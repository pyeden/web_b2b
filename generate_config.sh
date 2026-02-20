#!/bin/bash

# ============================================
# Docker Compose 智能配置生成脚本
# 自动检测IP并替换所有配置
# ============================================

PROJECT_DIR="$(pwd)"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "========================================="
echo "    Docker Compose 智能配置生成工具"
echo "========================================="
echo -e "${NC}"
echo ""

# 获取服务器IP
get_ip() {
    # 尝试多种方式获取IP
    local ip=$(hostname -I | awk '{print $1}')
    if [ -z "$ip" ]; then
        ip=$(ip addr show | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | cut -d/ -f1 | head -1)
    fi
    if [ -z "$ip" ]; then
        ip=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4 2>/dev/null || echo "")
    fi
    echo "$ip"
}

# 用户输入选择
echo -e "${YELLOW}请选择配置方式:${NC}"
echo "1. 使用服务器IP地址"
echo "2. 使用自定义域名"
read -p "请输入选择 (1 或 2): " choice

if [ "$choice" = "1" ]; then
    # 自动检测IP
    SERVER_IP=$(get_ip)
    if [ -z "$SERVER_IP" ]; then
        echo -e "${RED}✗ 无法自动检测IP${NC}"
        read -p "请手动输入服务器IP: " SERVER_IP
    fi
    echo -e "${GREEN}✓ 使用IP: $SERVER_IP${NC}"
    CONFIG_HOST="$SERVER_IP"
elif [ "$choice" = "2" ]; then
    read -p "请输入域名 (例: mytest.com): " DOMAIN
    CONFIG_HOST="$DOMAIN"
    echo -e "${GREEN}✓ 使用域名: $DOMAIN${NC}"
else
    echo -e "${RED}✗ 无效选择${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}开始生成配置文件...${NC}"
echo ""

# 创建必要的目录
echo "[1/7] 创建目录结构..."
mkdir -p logs/nginx
mkdir -p mysql-init
echo -e "${GREEN}✓ 完成${NC}"

# 生成 docker-compose.yml
echo "[2/7] 生成 docker-compose.yml..."
cat > docker-compose.yml << DOCKEREOF
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: web_b2b_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123456
      MYSQL_DATABASE: web_b2b
      MYSQL_USER: web_b2b_user
      MYSQL_PASSWORD: user123456
      TZ: 'Asia/Shanghai'
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql-init:/docker-entrypoint-initdb.d
    networks:
      - web_b2b_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: web_b2b_server
    restart: always
    command: gunicorn server.wsgi:application --bind 0.0.0.0:8000 --workers 4
    environment:
      DEBUG: 'False'
      ALLOWED_HOSTS: '$CONFIG_HOST,localhost,127.0.0.1'
      DATABASE_URL: 'mysql://web_b2b_user:user123456@mysql:3306/web_b2b'
      DJANGO_SETTINGS_MODULE: 'server.settings'
    ports:
      - "8000:8000"
    volumes:
      - ./server:/app
      - ./server/media:/app/media
      - ./server/upload:/app/upload
      - ./server/static:/app/static
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - web_b2b_network

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    container_name: web_b2b_web
    restart: always
    environment:
      NODE_ENV: 'production'
      NEXT_PUBLIC_API_URL: 'http://$CONFIG_HOST/myapp'
    ports:
      - "3000:3000"
    volumes:
      - ./web:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - server
    networks:
      - web_b2b_network

  nginx:
    image: nginx:latest
    container_name: web_b2b_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./server/upload:/var/www/upload:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - server
      - web
    networks:
      - web_b2b_network

networks:
  web_b2b_network:
    driver: bridge

volumes:
  mysql_data:
    driver: local
DOCKEREOF
echo -e "${GREEN}✓ 完成${NC}"

# 生成 .env 文件
echo "[3/7] 生成 .env 文件..."
cat > .env << ENVEOF
MYSQL_ROOT_PASSWORD=root123456
MYSQL_DATABASE=web_b2b
MYSQL_USER=web_b2b_user
MYSQL_PASSWORD=user123456
DEBUG=False
ALLOWED_HOSTS=$CONFIG_HOST,localhost,127.0.0.1
DJANGO_SETTINGS_MODULE=server.settings
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://$CONFIG_HOST/myapp
SERVER_HOST=$CONFIG_HOST
ENVEOF
echo -e "${GREEN}✓ 完成${NC}"

# 生成 nginx.conf
echo "[4/7] 生成 nginx.conf..."
cat > nginx.conf << NGINXEOF
upstream django_backend {
    server server:8000;
}

upstream nextjs_frontend {
    server web:3000;
}

server {
    listen 80;
    server_name $CONFIG_HOST localhost;

    location /upload/ {
        access_log off;
        log_not_found off;
        alias /var/www/upload/;
        add_header Cache-Control "public, max-age=90";
        expires 90d;
    }

    location /favicon.ico {
        access_log off;
        log_not_found off;
        alias /var/www/upload/img/favicon.ico;
        add_header Cache-Control "public, max-age=31536000";
        expires 1y;
    }

    location /myapp/ {
        proxy_pass http://django_backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        client_max_body_size 100M;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # CORS 跨域配置
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    location /_next/image {
        proxy_pass http://nextjs_frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        add_header Cache-Control "public, max-age=31536000, immutable";
        expires 1y;
    }

    location /_next/static {
        proxy_pass http://nextjs_frontend;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
        expires 1y;
    }

    location /_next/webpack-hmr {
        proxy_pass http://nextjs_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location / {
        proxy_pass http://nextjs_frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log warn;
}
NGINXEOF
echo -e "${GREEN}✓ 完成${NC}"

# 生成 server Dockerfile
echo "[5/7] 生成 server/Dockerfile..."
cat > server/Dockerfile << 'DOCKERPYEOF'
FROM python:3.11

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

CMD ["gunicorn", "server.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
DOCKERPYEOF
echo -e "${GREEN}✓ 完成${NC}"

# 生成 web Dockerfile
echo "[6/7] 生成 web/Dockerfile..."
cat > web/Dockerfile << 'DOCKERNODEEOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build || true

EXPOSE 3000

CMD ["npm", "start"]
DOCKERNODEEOF
echo -e "${GREEN}✓ 完成${NC}"

# 生成快速启动脚本
echo "[7/7] 生成快速启动脚本..."
cat > start.sh << 'STARTEOF'
#!/bin/bash
echo "========================================="
echo "启动所有 Docker Compose 服务"
echo "========================================="
docker-compose up -d
sleep 3
echo ""
echo "========================================="
echo "服务状态"
echo "========================================="
docker-compose ps
echo ""
echo "========================================="
echo "访问地址"
echo "========================================="
echo "前端: http://localhost:3000"
echo "后端: http://localhost:8000"
echo "Nginx: http://localhost"
echo "========================================"
STARTEOF
chmod +x start.sh
echo -e "${GREEN}✓ 完成${NC}"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✓ 所有配置文件已生成完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}配置信息:${NC}"
echo "  主机地址: $CONFIG_HOST"
echo "  前端URL: http://$CONFIG_HOST:3000"
echo "  后端URL: http://$CONFIG_HOST:8000"
echo "  Nginx URL: http://$CONFIG_HOST"
echo ""
echo -e "${YELLOW}接下来请执行:${NC}"
echo "  1. 检查配置文件是否正确"
echo "  2. 修改 .env 中的密码（建议）"
echo "  3. 运行启动脚本: bash start.sh"
echo ""
echo -e "${YELLOW}常用命令:${NC}"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  查看状态: docker-compose ps"
echo ""


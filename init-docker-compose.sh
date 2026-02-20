#!/bin/bash

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[⚠]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

clear
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║  Docker Compose 一键自动化部署           ║"
echo "║  Web B2B Project                          ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# ========== 检查 Docker ==========
log_info "检查 Docker 环境..."
if ! command -v docker &> /dev/null; then
    log_error "Docker 未安装"
    exit 1
fi
log_success "Docker 已安装"

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose 未安装"
    exit 1
fi
log_success "Docker Compose 已安装"

# ========== 检查 NPM 用于前端构建 ==========
log_info "检查前端构建工具..."
if ! command -v npm &> /dev/null; then
    log_warning "NPM 未安装，跳过前端构建"
else
    log_success "NPM 已安装，开始构建前端..."
    cd web
    if [ ! -d "node_modules" ]; then
        log_info "安装前端依赖..."
        npm install --legacy-peer-deps
    fi
    log_info "构建前端项目..."
    npm run build
    if [ -d "out" ]; then
        log_success "前端构建完成（out 目录）"
    elif [ -d ".next" ]; then
        log_warning "使用 .next 目录（standalone 模式）"
    fi
    cd ..
fi

echo ""

# ========== 创建必要目录 ==========
log_info "创建必要目录..."
mkdir -p mysql-init
mkdir -p logs/nginx
log_success "目录已创建"

echo ""

# ========== 创建 .env 文件 ==========
log_info "检查环境配置..."
if [ ! -f ".env" ]; then
    log_warning ".env 文件不存在，创建默认配置..."
    cat > .env << 'EOF'
# ========== Django 配置 ==========
DEBUG=False
SECRET_KEY=django-insecure-sz@madp0ifx!b)^lg_g!f+5s*w7w_=sjgq-k+erzb%x42$^r!d
ALLOWED_HOSTS=localhost,127.0.0.1,xxxxx.com,www.xxxxx.com

# ========== 数据库配置 ==========
DB_ENGINE=django.db.backends.mysql
DB_NAME=django_db
DB_USER=django
DB_PASSWORD=django123456
DB_HOST=mysql
DB_PORT=3306
MYSQL_ROOT_PASSWORD=root123456

# ========== 跨域配置 ==========
CORS_ALLOWED_ORIGINS=http://xxxxx.com,https://xxxxx.com,http://www.xxxxx.com,https://www.xxxxx.com

# ========== 基础 URL ==========
BASE_HOST_URL=http://xxxxx.com

# ========== 超级用户配置 ==========
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_PASSWORD=admin123456
DJANGO_SUPERUSER_EMAIL=admin@example.com
EOF
    log_success ".env 已创建"
else
    log_success ".env 文件已存在"
fi

echo ""

# ========== 创建 MySQL 初始化脚本 ==========
log_info "配置 MySQL 初始化脚本..."
if [ ! -f "mysql-init/init.sql" ]; then
    cat > mysql-init/init.sql << 'EOF'
CREATE DATABASE IF NOT EXISTS `django_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'django'@'%' IDENTIFIED BY 'django123456';
GRANT ALL PRIVILEGES ON `django_db`.* TO 'django'@'%';
FLUSH PRIVILEGES;
EOF
    log_success "init.sql 已创建"
else
    log_success "init.sql 已存在"
fi

echo ""

# ========== 停止旧容器 ==========
log_info "停止旧容器..."
docker-compose down --remove-orphans 2>/dev/null || true
log_success "旧容器已停止"

echo ""

# ========== 清理旧镜像 ==========
log_info "清理旧镜像..."
docker-compose rm -f 2>/dev/null || true
log_success "旧镜像已清理"

echo ""

# ========== 构建新镜像 ==========
log_info "构建 Docker 镜像..."
docker-compose build --no-cache
log_success "镜像构建完成"

echo ""

# ========== 启动服务 ==========
log_info "启动 Docker 容器..."
docker-compose up -d
log_success "容器已启动"

echo ""

# ========== 等待服务启动 ==========
log_info "等待服务完全启动（60 秒）..."
sleep 60

echo ""

# ========== 显示服务状态 ==========
log_info "显示服务状态..."
docker-compose ps

echo ""

# ========== 显示日志 ==========
log_info "显示启动日志..."
docker-compose logs --tail 50

echo ""

# ========== 健康检查 ==========
log_info "执行健康检查..."
echo ""

# MySQL 检查
if docker-compose exec -T mysql mysql -u root -proot123456 -e "SELECT 1" > /dev/null 2>&1; then
    log_success "MySQL 服务正常"
else
    log_error "MySQL 服务异常"
fi

# Django 检查
if docker-compose exec -T django curl -s http://localhost:8000/myapp/ > /dev/null 2>&1; then
    log_success "Django 服务正常"
else
    log_error "Django 服务异常"
fi

# Nginx 检查
if docker-compose exec -T nginx wget -q -O- http://localhost > /dev/null 2>&1; then
    log_success "Nginx 服务正常"
else
    log_error "Nginx 服务异常"
fi

echo ""

# ========== 获取访问地址 ==========
local_ip=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        ✓ 部署完成！可以开始使用          ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo "📝 访问地址："
echo "  后台管理: ${BLUE}http://${local_ip}/admin/${NC}"
echo "  API 接口: ${BLUE}http://${local_ip}/myapp/${NC}"
echo "  前端首页: ${BLUE}http://${local_ip}/${NC}"
echo ""
echo "🔐 默认账号密码："
echo "  用户名: ${YELLOW}admin${NC}"
echo "  密码:   ${YELLOW}admin123456${NC}"
echo ""
echo "🔍 常用命令："
echo "  查看日志:   ${BLUE}docker-compose logs -f${NC}"
echo "  查看 Django 日志: ${BLUE}docker-compose logs -f django${NC}"
echo "  进入 Django: ${BLUE}docker-compose exec django bash${NC}"
echo "  进入 MySQL: ${BLUE}docker-compose exec mysql mysql -u django -pdjango123456${NC}"
echo "  重启服务:   ${BLUE}docker-compose restart${NC}"
echo "  停止服务:   ${BLUE}docker-compose down${NC}"
echo ""

log_success "部署脚本执行完成！"

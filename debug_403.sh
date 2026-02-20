#!/bin/bash

echo "========================================="
echo "诊断 403 Forbidden 问题"
echo "========================================="

cd ~/web_b2b

# 1. 检查文件是否存在
echo "[1/7] 检查宿主机文件..."
ls -la server/upload/img/logo.png 2>/dev/null || echo "❌ logo.png 不存在"
echo ""

# 2. 检查目录权限
echo "[2/7] 检查宿主机目录权限..."
ls -la server/upload/
ls -la server/upload/img/ | head -5
echo ""

# 3. 检查 Nginx 容器内的文件
echo "[3/7] 检查 Nginx 容器内的文件..."
docker-compose exec nginx ls -la /app/upload/ 2>/dev/null || echo "❌ /app/upload 不存在"
docker-compose exec nginx ls -la /app/upload/img/ 2>/dev/null | head -5 || echo "❌ /app/upload/img 不存在"
echo ""

# 4. 检查 Nginx 配置
echo "[4/7] 检查 Nginx 配置..."
docker-compose exec nginx cat /etc/nginx/conf.d/default.conf | grep -A 5 "location /upload"
echo ""

# 5. 测试 Nginx 配置
echo "[5/7] 测试 Nginx 配置语法..."
docker-compose exec nginx nginx -t
echo ""

# 6. 检查 Nginx 进程用户
echo "[6/7] 检查 Nginx 运行用户..."
docker-compose exec nginx ps aux | grep nginx
echo ""

# 7. 尝试在容器内访问文件
echo "[7/7] 在 Nginx 容器内测试文件访问..."
docker-compose exec nginx cat /app/upload/img/logo.png > /dev/null 2>&1 && echo "✓ 文件可读" || echo "❌ 文件不可读"
echo ""

echo "========================================="
echo "诊断完成"
echo "========================================="


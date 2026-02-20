#!/bin/bash

echo "========================================="
echo "诊断前后端连接问题"
echo "========================================="
echo ""

# 1. 检查所有容器状态
echo "[1/6] 检查容器状态..."
docker-compose ps
echo ""

# 2. 检查 web 容器的环境变量
echo "[2/6] 检查前端环境变量..."
docker-compose exec web printenv | grep -E "API_URL|NODE_ENV|NEXT_PUBLIC"
echo ""

# 3. 测试后端API是否可访问（从宿主机）
echo "[3/6] 测试后端API（从宿主机）..."
curl -s http://localhost/myapp/admin/basicGlobal/listInfo | head -20
echo ""

# 4. 测试后端API（从web容器内部）
echo "[4/6] 测试后端API（从web容器内）..."
docker-compose exec web wget -q -O- http://server:8000/myapp/admin/basicGlobal/listInfo 2>&1 | head -20
echo ""

# 5. 检查 Django 日志
echo "[5/6] Django 最近的错误日志..."
docker-compose logs server --tail=20
echo ""

# 6. 检查 Next.js 日志
echo "[6/6] Next.js 最近的错误日志..."
docker-compose logs web --tail=30
echo ""

echo "========================================="
echo "诊断完成"
echo "========================================="


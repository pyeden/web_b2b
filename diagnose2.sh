#!/bin/bash

echo "========================================="
echo "深度诊断 Django 后端问题"
echo "========================================="
echo ""

# 1. 查看 Django 详细日志
echo "[1/4] Django 容器日志（最近50行）..."
docker-compose logs server 2>&1 | tail -50
echo ""

# 2. 进入容器测试 Django 是否正常运行
echo "[2/4] 测试 Django 应用..."
docker-compose exec server python manage.py check
echo ""

# 3. 检查数据库连接
echo "[3/4] 测试数据库连接..."
docker-compose exec server python manage.py dbshell --command="SELECT 1;" 2>&1 || echo "数据库连接失败"
echo ""

# 4. 查看 Django URL 配置
echo "[4/4] 检查 URL 路由..."
docker-compose exec server python manage.py show_urls 2>&1 || docker-compose exec server python -c "from django.urls import get_resolver; print(get_resolver().url_patterns)" 2>&1 || echo "无法获取URL配置"
echo ""

echo "========================================="
echo "诊断完成"
echo "========================================="


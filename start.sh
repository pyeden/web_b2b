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

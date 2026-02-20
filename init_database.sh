#!/bin/bash

echo "========================================="
echo "初始化 Django 数据库"
echo "========================================="
echo ""

# 1. 检查数据库连接
echo "[1/5] 检查数据库连接..."
docker-compose exec server python -c "
from django.db import connection
connection.ensure_connection()
print('✓ 数据库连接成功')
"

# 2. 查看当前数据库表
echo ""
echo "[2/5] 查看当前数据库表..."
docker-compose exec mysql mysql -uroot -proot123456 web_b2b -e "SHOW TABLES;" || echo "数据库可能为空"

# 3. 运行 makemigrations
echo ""
echo "[3/5] 创建迁移文件..."
docker-compose exec server python manage.py makemigrations

# 4. 运行 migrate
echo ""
echo "[4/5] 执行数据库迁移..."
docker-compose exec server python manage.py migrate

# 5. 再次检查表
echo ""
echo "[5/5] 验证表是否创建..."
docker-compose exec mysql mysql -uroot -proot123456 web_b2b -e "SHOW TABLES;"

echo ""
echo "========================================="
echo "✓ 数据库初始化完成！"
echo "========================================="
echo ""
echo "测试 API："
echo "  curl http://localhost/myapp/admin/basicGlobal/listInfo"
echo ""


#!/bin/bash

# Скрипт для копирования проекта на VPS сервер
# Использование: ./deploy.sh root@ваш-сервер-ip

if [ -z "$1" ]; then
    echo "❌ Укажите адрес сервера!"
    echo "Использование: ./deploy.sh root@ваш-сервер-ip"
    echo "Пример: ./deploy.sh root@123.45.67.89"
    exit 1
fi

SERVER=$1
REMOTE_DIR="/var/www/kemart"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🚀 КемАрт - Развёртывание на сервер                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Сервер: $SERVER"
echo "📁 Папка: $REMOTE_DIR"
echo ""

# Создаём папку на сервере
echo "📁 Создание папки на сервере..."
ssh $SERVER "mkdir -p $REMOTE_DIR"

# Копируем файлы
echo "📦 Копирование файлов..."

# Сервер (бэкенд)
echo "  → server/"
scp -r ./server $SERVER:$REMOTE_DIR/

# Админка (фронтенд)
echo "  → dist/ (админка)"
scp -r ./dist $SERVER:$REMOTE_DIR/

# Сайт (HTML файлы)
if [ -d "./site" ]; then
    echo "  → site/ (HTML сайт)"
    scp -r ./site $SERVER:$REMOTE_DIR/
else
    echo "⚠️  Папка site/ не найдена. Пропускаем."
    echo "   Скопируйте HTML из GitHub в папку site/ и повторите."
fi

# package.json и README
echo "  → README.md, START.md, INTEGRATION.md"
scp ./README.md ./START.md ./INTEGRATION.md $SERVER:$REMOTE_DIR/ 2>/dev/null

echo ""
echo "🔧 Настройка на сервере..."

# Установка зависимостей и запуск
ssh $SERVER << 'ENDSSH'
cd /var/www/kemart/server

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install --production

# Создание .env если не существует
if [ ! -f .env ]; then
    echo "🔐 Создание .env..."
    cat > .env << 'EOF'
PORT=3001
JWT_SECRET=kemart-secret-change-me-in-production-2024
NODE_ENV=production
EOF
    echo "⚠️  ОБЯЗАТЕЛЬНО измените JWT_SECRET в /var/www/kemart/server/.env"
fi

# Остановка старого процесса если есть
pm2 stop kemart 2>/dev/null || true
pm2 delete kemart 2>/dev/null || true

# Запуск
echo "🚀 Запуск сервера..."
pm2 start index.js --name kemart
pm2 save

# Настройка автозапуска
pm2 startup 2>/dev/null

# Создание папки uploads
mkdir -p uploads

# Права
chmod -R 755 uploads
ENDSSH

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   ✅ Развёртывание завершено!                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📡 Админка: http://$SERVER:3001/admin"
echo "👤 Логин: admin"
echo "🔑 Пароль: admin"
echo ""
echo "⚠️  ВАЖНО:"
echo "1. Смените пароль админа сразу после входа!"
echo "2. Измените JWT_SECRET: ssh $SERVER 'nano /var/www/kemart/server/.env'"
echo "3. Настройте Nginx и домен (см. README.md)"
echo ""

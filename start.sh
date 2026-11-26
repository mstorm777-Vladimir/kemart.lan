#!/bin/bash

# Скрипт для запуска КемАрт на локальном сервере

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🏠 КемАрт - Запуск локального сервера                   ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo "Установите Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js версия: $(node --version)"
echo ""

# Переход в папку сервера
cd server

# Проверка наличия node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей сервера..."
    npm install
    echo ""
fi

# Запуск сервера
echo "🚀 Запуск сервера..."
echo ""
echo "📡 Админка: http://localhost:3001/admin"
echo "👤 Логин: admin"
echo "🔑 Пароль: admin"
echo ""
echo "Нажмите Ctrl+C для остановки"
echo ""

node index.js

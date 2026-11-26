#!/bin/bash

# Скрипт для автоматической интеграции HTML-файлов с админкой
# Запустите после копирования HTML из GitHub в папку site/

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🔧 КемАрт - Интеграция HTML с админкой                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

SITE_DIR="./site"

# Проверка наличия папки site
if [ ! -d "$SITE_DIR" ]; then
    echo "❌ Папка site/ не найдена!"
    echo "Сначала скопируйте HTML-файлы из GitHub в папку site/"
    exit 1
fi

echo "✅ Папка site/ найдена"
echo ""

# Создание папок для скриптов и стилей
echo "📁 Создание папок..."
mkdir -p "$SITE_DIR/assets/js"
mkdir -p "$SITE_DIR/assets/css"

# Копирование файлов загрузчика
echo "📦 Копирование файлов загрузчика..."
if [ -f "./public/site/assets/js/kemart-loader.js" ]; then
    cp "./public/site/assets/js/kemart-loader.js" "$SITE_DIR/assets/js/"
    echo "✅ kemart-loader.js скопирован"
else
    echo "⚠️  kemart-loader.js не найден в public/site/assets/js/"
fi

if [ -f "./public/site/assets/css/kemart-dynamic.css" ]; then
    cp "./public/site/assets/css/kemart-dynamic.css" "$SITE_DIR/assets/css/"
    echo "✅ kemart-dynamic.css скопирован"
else
    echo "⚠️  kemart-dynamic.css не найден в public/site/assets/css/"
fi

echo ""
echo "🔧 Модификация HTML-файлов..."

# Функция для добавления скрипта перед </body>
add_script_to_html() {
    local file=$1
    local section=$2
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    # Проверяем есть ли уже наш скрипт
    if grep -q "kemart-loader.js" "$file"; then
        echo "⏭️  $file - уже модифицирован"
        return
    fi
    
    # Добавляем стили и скрипт перед </body>
    sed -i 's|</body>|<link rel="stylesheet" href="/assets/css/kemart-dynamic.css">\n<script src="/assets/js/kemart-loader.js"></script>\n</body>|g' "$file"
    
    echo "✅ $file - добавлен скрипт загрузчика"
}

# Обрабатываем все HTML файлы
find "$SITE_DIR" -name "*.html" -type f | while read -r html_file; do
    add_script_to_html "$html_file"
done

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   ✅ Интеграция завершена!                                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Следующие шаги:"
echo ""
echo "1. Откройте HTML-файлы и добавьте data-атрибуты:"
echo "   - data-kemart=\"portfolio\" для портфолио"
echo "   - data-kemart=\"reviews\" для отзывов"
echo "   - data-kemart=\"services\" для услуг"
echo "   - data-kemart=\"faq\" для FAQ"
echo "   - data-kemart=\"contacts\" для контактов"
echo ""
echo "2. Загрузите папку site/ на сервер:"
echo "   scp -r ./site root@ваш-сервер:/var/www/kemart/"
echo ""
echo "3. Перезапустите сервер:"
echo "   ssh root@ваш-сервер 'pm2 restart kemart'"
echo ""
echo "📖 Подробная инструкция: INTEGRATION.md"
echo ""

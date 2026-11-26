#!/usr/bin/env node

/**
 * Скрипт для автоматической модификации HTML-файлов
 * Добавляет data-атрибуты и подключает загрузчик
 * 
 * Использование:
 *   node scripts/integrate-html.js
 */

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..', 'site');

// Шаблоны для замены в HTML
const MODIFICATIONS = {
  // Портфолио
  portfolio: {
    pattern: /class="[^"]*s-slider-type-6[^"]*"[^>]*>([\s\S]*?)<\/section>/g,
    replacement: `<div class="kemart-portfolio-grid" data-kemart="portfolio" data-kemart-template="slider" data-kemart-limit="0">
      <!-- Проекты подгрузятся из админки -->
    </div>
  </section>`
  },
  
  // Отзывы
  reviews: {
    pattern: /class="[^"]*s-reviews-type-4[^"]*"[^>]*>([\s\S]*?)<\/section>/g,
    replacement: `<div class="kemart-reviews-grid" data-kemart="reviews" data-kemart-template="cards" data-kemart-limit="6">
      <!-- Отзывы подгрузятся из админки -->
    </div>
  </section>`
  },
  
  // Услуги
  services: {
    pattern: /class="[^"]*s-advantages-blocks-type-7[^"]*"[^>]*>([\s\S]*?)<\/section>/g,
    replacement: `<div class="kemart-services-grid" data-kemart="services">
      <!-- Услуги подгрузятся из админки -->
    </div>
  </section>`
  },
  
  // FAQ
  faq: {
    pattern: /class="[^"]*s-faq-type-2[^"]*"[^>]*>([\s\S]*?)<\/section>/g,
    replacement: `<div class="kemart-faq-list" data-kemart="faq" data-kemart-template="accordion">
      <!-- FAQ подгрузится из админки -->
    </div>
  </section>`
  },
  
  // Контакты
  contacts: {
    pattern: /class="[^"]*s-contacts-extensible-type-2[^"]*"[^>]*>([\s\S]*?)<\/section>/g,
    replacement: `<div data-kemart="contacts">
      $1
    </div>
  </section>`
  }
};

// Скрипт и стили для добавления перед </body>
const INJECT_CODE = `
<!-- КемАрт: Динамическая загрузка данных из админки -->
<link rel="stylesheet" href="/assets/css/kemart-dynamic.css">
<script src="/assets/js/kemart-loader.js"></script>
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const fileName = path.basename(filePath);
  
  // Проверяем, не модифицирован ли уже файл
  if (content.includes('kemart-loader.js')) {
    console.log(`⏭️  ${fileName} - уже модифицирован`);
    return false;
  }
  
  // Применяем модификации в зависимости от типа страницы
  if (filePath.includes('portfolio')) {
    if (MODIFICATIONS.portfolio.pattern.test(content)) {
      content = content.replace(MODIFICATIONS.portfolio.pattern, MODIFICATIONS.portfolio.replacement);
      modified = true;
      console.log(`✅ ${fileName} - добавлен блок портфолио`);
    }
  }
  
  if (fileName === 'index.html' || filePath.includes('aboutus')) {
    // На главной и "О нас" есть отзывы
    if (MODIFICATIONS.reviews.pattern.test(content)) {
      content = content.replace(MODIFICATIONS.reviews.pattern, MODIFICATIONS.reviews.replacement);
      modified = true;
      console.log(`✅ ${fileName} - добавлен блок отзывов`);
    }
  }
  
  if (filePath.includes('price') || filePath.includes('services')) {
    if (MODIFICATIONS.services.pattern.test(content)) {
      content = content.replace(MODIFICATIONS.services.pattern, MODIFICATIONS.services.replacement);
      modified = true;
      console.log(`✅ ${fileName} - добавлен блок услуг`);
    }
  }
  
  if (fileName === 'index.html') {
    // FAQ на главной
    if (MODIFICATIONS.faq.pattern.test(content)) {
      content = content.replace(MODIFICATIONS.faq.pattern, MODIFICATIONS.faq.replacement);
      modified = true;
      console.log(`✅ ${fileName} - добавлен блок FAQ`);
    }
  }
  
  if (filePath.includes('contacts')) {
    if (MODIFICATIONS.contacts.pattern.test(content)) {
      content = content.replace(MODIFICATIONS.contacts.pattern, MODIFICATIONS.contacts.replacement);
      modified = true;
      console.log(`✅ ${fileName} - добавлен блок контактов`);
    }
  }
  
  // Добавляем скрипт загрузчика перед </body>
  if (modified || true) { // Всегда добавляем скрипт
    if (content.includes('</body>') && !content.includes('kemart-loader.js')) {
      content = content.replace('</body>', INJECT_CODE + '</body>');
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith('.html')) {
      callback(filePath);
    }
  }
}

// Копирование файлов загрузчика
function copyLoaderFiles() {
  const jsSource = path.join(__dirname, '..', 'public', 'site', 'assets', 'js', 'kemart-loader.js');
  const cssSource = path.join(__dirname, '..', 'public', 'site', 'assets', 'css', 'kemart-dynamic.css');
  
  const jsDest = path.join(SITE_DIR, 'assets', 'js', 'kemart-loader.js');
  const cssDest = path.join(SITE_DIR, 'assets', 'css', 'kemart-dynamic.css');
  
  // Создаём папки
  fs.mkdirSync(path.dirname(jsDest), { recursive: true });
  fs.mkdirSync(path.dirname(cssDest), { recursive: true });
  
  // Копируем файлы
  if (fs.existsSync(jsSource)) {
    fs.copyFileSync(jsSource, jsDest);
    console.log('✅ kemart-loader.js скопирован');
  }
  
  if (fs.existsSync(cssSource)) {
    fs.copyFileSync(cssSource, cssDest);
    console.log('✅ kemart-dynamic.css скопирован');
  }
}

// Главная функция
function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║   🔧 КемАрт - Интеграция HTML с админкой                  ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  
  if (!fs.existsSync(SITE_DIR)) {
    console.error('❌ Папка site/ не найдена!');
    console.error('Сначала скопируйте HTML-файлы из GitHub в папку site/');
    process.exit(1);
  }
  
  console.log('📁 Папка site/ найдена');
  console.log('');
  
  // Копируем файлы загрузчика
  console.log('📦 Копирование файлов загрузчика...');
  copyLoaderFiles();
  console.log('');
  
  // Обрабатываем HTML файлы
  console.log('🔧 Модификация HTML-файлов...');
  let modifiedCount = 0;
  
  walkDir(SITE_DIR, (filePath) => {
    if (processFile(filePath)) {
      modifiedCount++;
    }
  });
  
  console.log('');
  console.log(`✅ Модифицировано файлов: ${modifiedCount}`);
  console.log('');
  console.log('📝 Следующие шаги:');
  console.log('');
  console.log('1. Проверьте HTML-файлы в папке site/');
  console.log('2. Загрузите папку site/ на сервер:');
  console.log('   scp -r ./site root@ваш-сервер:/var/www/kemart/');
  console.log('');
  console.log('3. Перезапустите сервер:');
  console.log('   ssh root@ваш-сервер "pm2 restart kemart"');
  console.log('');
}

main();

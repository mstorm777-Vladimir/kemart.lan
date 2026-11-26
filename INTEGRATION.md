# 📝 ИНСТРУКЦИЯ: Как сделать HTML динамическим

## 🎯 Что мы делаем

Превращаем ваши статические HTML-файлы из GitHub в динамические, которые автоматически подгружают данные из админки.

---

## 📁 Структура проекта на сервере

```
/var/www/kemart/
├── site/                    ← Ваши HTML-файлы из GitHub
│   ├── index.html
│   ├── portfolio/
│   │   └── index.html
│   ├── services/
│   ├── contacts/
│   └── assets/
│       ├── img/             ← Картинки из GitHub
│       ├── styles/          ← CSS из GitHub
│       ├── js/              ← НОВЫЙ скрипт загрузчика
│       │   └── kemart-loader.js
│       └── css/             ← НОВЫЕ стили для динамических блоков
│           └── kemart-dynamic.css
├── server/                  ← Бэкенд (уже настроен)
└── dist/                    ← Админка (React)
```

---

## 🚀 Пошаговая инструкция

### Шаг 1: Скопируйте HTML-файлы из GitHub

```bash
# На вашем компьютере
cd kemart-site  # папка с файлами из GitHub

# Создайте папку site в проекте
mkdir -p ../kemart/site

# Скопируйте все HTML-файлы и папки
cp -r index.html aboutus blog contacts portfolio price services working useful chertezhi ../kemart/site/
cp -r assets ../kemart/site/
```

### Шаг 2: Скопируйте новые файлы

```bash
# Скопируйте скрипт загрузчика
cp public/site/assets/js/kemart-loader.js ../kemart/site/assets/js/

# Скопируйте стили
cp public/site/assets/css/kemart-dynamic.css ../kemart/site/assets/css/

# Создайте папки если их нет
mkdir -p ../kemart/site/assets/js
mkdir -p ../kemart/site/assets/css
```

### Шаг 3: Загрузите на сервер

```bash
# Загрузите всю папку site на VPS
scp -r ./site root@ваш-сервер:/var/www/kemart/
```

---

## 🔧 Как изменить ваши HTML-файлы

### Пример 1: Главная страница (index.html)

Откройте `site/index.html` и найдите секцию с отзывами. Добавьте атрибут `data-kemart`:

**Было:**
```html
<section class="reviews-section">
  <h2>Отзывы клиентов</h2>
  <div class="review-item">
    <p>Дарья Ащеулова: Спасибо огромное...</p>
  </div>
  <!-- другие отзывы -->
</section>
```

**Стало:**
```html
<section class="reviews-section">
  <h2>Отзывы клиентов</h2>
  
  <!-- Добавили data-kemart="reviews" -->
  <div class="kemart-reviews-grid" data-kemart="reviews" data-kemart-limit="6">
    <!-- Отзывы подгрузятся автоматически из админки -->
  </div>
</section>
```

**В конце `</body>` добавьте скрипт:**
```html
<!-- Перед закрывающим </body> -->
<link rel="stylesheet" href="assets/css/kemart-dynamic.css">
<script src="assets/js/kemart-loader.js"></script>
</body>
```

---

### Пример 2: Страница портфолио (portfolio/index.html)

**Было:**
```html
<section class="portfolio-grid">
  <div class="portfolio-item">
    <img src="assets/img/project1.jpg">
    <h3>Гостиная вместо коридора</h3>
  </div>
  <!-- другие проекты -->
</section>
```

**Стало:**
```html
<section class="portfolio-grid">
  <!-- Добавили data-kemart="portfolio" -->
  <div class="kemart-portfolio-grid" 
       data-kemart="portfolio" 
       data-kemart-template="grid"
       data-kemart-limit="0">
    <!-- Проекты подгрузятся из админки -->
  </div>
</section>

<script src="assets/js/kemart-loader.js"></script>
```

---

### Пример 3: Страница услуг (services/index.html)

**Было:**
```html
<div class="service-item">
  <h3>Дизайн проект L</h3>
  <p>Чертежи, визуализации, таблицы материалов.</p>
  <div class="price">от 1500 ₽/м²</div>
</div>
```

**Стало:**
```html
<div class="kemart-services-grid" data-kemart="services">
  <!-- Услуги подгрузятся из админки -->
</div>

<script src="assets/js/kemart-loader.js"></script>
```

---

### Пример 4: Страница FAQ

**Было:**
```html
<div class="faq-item">
  <h4>Сколько лет вы работаете в дизайне интерьера?</h4>
  <p>Студия дизайна интерьера КемАрт работает с 2010 года...</p>
</div>
```

**Стало:**
```html
<div class="kemart-faq-list" data-kemart="faq" data-kemart-template="accordion">
  <!-- FAQ подгрузится из админки -->
</div>

<script src="assets/js/kemart-loader.js"></script>
```

---

### Пример 5: Контакты (любая страница)

**Было:**
```html
<div class="contacts">
  <p>Адрес: г. Кемерово, пр. Советский 2/8, оф. 409</p>
  <p>Телефон: <a href="tel:+79511688008">8-951-168-80-08</a></p>
  <p>Email: <a href="mailto:kem-art@yandex.ru">kem-art@yandex.ru</a></p>
</div>
```

**Стало:**
```html
<div class="contacts" data-kemart="contacts">
  <p>Адрес: <span data-kemart-field="address">г. Кемерово, пр. Советский 2/8, оф. 409</span></p>
  <p>Телефон: <a href="tel:+79511688008" data-kemart-field="phone1">8-951-168-80-08</a></p>
  <p>Email: <a href="mailto:kem-art@yandex.ru" data-kemart-field="email">kem-art@yandex.ru</a></p>
</div>

<script src="assets/js/kemart-loader.js"></script>
```

---

## 🎨 Доступные шаблоны

### Портфолио
```html
<!-- Сетка -->
<div data-kemart="portfolio" data-kemart-template="grid"></div>

<!-- Слайдер -->
<div data-kemart="portfolio" data-kemart-template="slider"></div>

<!-- С фильтром по категории -->
<div data-kemart="portfolio" data-kemart-category="Гостиные"></div>

<!-- Ограничение количества -->
<div data-kemart="portfolio" data-kemart-limit="6"></div>
```

### Отзывы
```html
<!-- Карточки -->
<div data-kemart="reviews" data-kemart-template="cards"></div>

<!-- Показать только 3 -->
<div data-kemart="reviews" data-kemart-limit="3"></div>
```

### FAQ
```html
<!-- Аккордеон (раскрывающийся) -->
<div data-kemart="faq" data-kemart-template="accordion"></div>

<!-- Простой список -->
<div data-kemart="faq" data-kemart-template="list"></div>
```

---

## 🔄 Как это работает

1. **Вы заходите в админку** → http://kemart.ru/admin
2. **Меняете данные** (добавляете проект, отзыв, услугу)
3. **Данные сохраняются в базу** (SQLite)
4. **Пользователь открывает сайт** → http://kemart.ru
5. **Скрипт `kemart-loader.js` подгружает данные** из `/api/portfolio`, `/api/reviews` и т.д.
6. **Сайт показывает актуальные данные** без перезагрузки

---

## 💾 Кэширование

Скрипт кэширует данные на 5 минут, чтобы не нагружать сервер. Если вы обновили данные в админке, они появятся на сайте в течение 5 минут.

**Принудительное обновление кэша:**
```javascript
// В консоли браузера (F12)
KemartLoader.clearCache();
KemartLoader.refresh();
```

---

## 🆘 Решение проблем

### Данные не подгружаются

1. **Проверьте консоль браузера (F12)** — должны быть сообщения `[КемАрт]`
2. **Убедитесь что сервер запущен:**
   ```bash
   pm2 status
   ```
3. **Проверьте что API работает:**
   ```bash
   curl http://localhost:3001/api/portfolio
   ```

### Картинки не отображаются

Убедитесь что картинки лежат в `site/assets/img/` и имена файлов совпадают с теми, что указаны в админке.

### Стили не применяются

Проверьте что подключили `kemart-dynamic.css` перед `kemart-loader.js`:
```html
<link rel="stylesheet" href="assets/css/kemart-dynamic.css">
<script src="assets/js/kemart-loader.js"></script>
```

---

## 📋 Чек-лист

- [ ] Скопировал HTML-файлы из GitHub в папку `site/`
- [ ] Скопировал картинки из `assets/img/`
- [ ] Скопировал `kemart-loader.js` в `site/assets/js/`
- [ ] Скопировал `kemart-dynamic.css` в `site/assets/css/`
- [ ] Добавил `<script src="assets/js/kemart-loader.js"></script>` в HTML
- [ ] Добавил `data-kemart` атрибуты в нужные места
- [ ] Загрузил всё на сервер через `scp`
- [ ] Перезапустил сервер: `pm2 restart kemart`
- [ ] Проверил что данные подгружаются

---

## 🎯 Готово!

Теперь ваш сайт динамический! Меняйте данные в админке → они автоматически появятся на сайте.

**Удачи! 🚀**

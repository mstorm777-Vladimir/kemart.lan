# 🏁 БЫСТРЫЙ СТАРТ — С чего начать прямо сейчас

## 📦 Что у вас есть

```
kemart/
├── src/                    ← Админка (React)
├── server/                 ← Бэкенд (Node.js + SQLite)
├── public/site/            ← Скрипты для интеграции с HTML
├── scripts/                ← Вспомогательные скрипты
├── dist/                   ← Собранный фронтенд
├── deploy.sh               ← Скрипт развёртывания
├── integrate-html.sh       ← Скрипт интеграции HTML
└── README.md               ← Полная документация
```

---

## 🎯 План действий (по шагам)

### ЭТАП 1: Локальный запуск (на вашем компьютере)

```bash
# 1. Установите Node.js (если ещё нет)
# https://nodejs.org/ — скачайте версию 18+

# 2. Установите зависимости бэкенда
cd server
npm install

# 3. Запустите сервер
npm start
```

Откройте **http://localhost:3001/admin**  
Логин: `admin` / Пароль: `admin`

**✅ Потестируйте админку** — добавьте проект, отзыв, услугу.

---

### ЭТАП 2: Подготовка HTML-файлов

```bash
# 1. Создайте папку site в корне проекта
mkdir site

# 2. Скопируйте туда файлы из GitHub
#    (index.html, aboutus/, portfolio/, assets/ и т.д.)

# 3. Запустите скрипт интеграции
node scripts/integrate-html.js
```

Этот скрипт:
- Скопирует `kemart-loader.js` в `site/assets/js/`
- Скопирует `kemart-dynamic.css` в `site/assets/css/`
- Добавит скрипт загрузчика во все HTML-файлы

---

### ЭТАП 3: Ручная настройка HTML

Откройте `site/index.html` и найдите секцию с отзывами. Замените содержимое:

**Было (примерно так):**
```html
<section class="s-reviews-type-4 ...">
  <div class="review-item">
    <p>Дарья Ащеулова: Спасибо...</p>
  </div>
  <!-- другие отзывы -->
</section>
```

**Стало:**
```html
<section class="s-reviews-type-4 ...">
  <div class="kemart-reviews-grid" data-kemart="reviews" data-kemart-limit="6">
    <!-- Отзывы подгрузятся автоматически -->
  </div>
</section>
```

Повторите для других секций:
- Портфолио → `data-kemart="portfolio"`
- Услуги → `data-kemart="services"`
- FAQ → `data-kemart="faq"`
- Контакты → `data-kemart="contacts"`

---

### ЭТАП 4: Развёртывание на VPS

**Вариант А — Автоматически (рекомендуется):**
```bash
chmod +x deploy.sh
./deploy.sh root@ваш-сервер-ip
```

**Вариант Б — Вручную:**
```bash
# На вашем компьютере:
scp -r ./server root@ваш-сервер:/var/www/kemart/
scp -r ./dist root@ваш-сервер:/var/www/kemart/
scp -r ./site root@ваш-сервер:/var/www/kemart/

# На сервере:
ssh root@ваш-сервер
cd /var/www/kemart/server
npm install --production
pm2 start index.js --name kemart
pm2 save
pm2 startup
```

---

### ЭТАП 5: Настройка Nginx

```bash
# На сервере:
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/kemart
```

Вставьте конфигурацию из `README.md` (раздел "Настройка Nginx").

```bash
sudo ln -s /etc/nginx/sites-available/kemart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🎨 Что получится в итоге

```
kemart.ru/           ← Ваш HTML-сайт (из GitHub)
├── /admin           ← Админка (React)
├── /api             ← API для данных
└── /uploads         ← Загруженные картинки

kemart.ru/admin      ← Управление контентом
kemart.ru/api/...    ← Данные (портфолио, отзывы и т.д.)
```

**Как это работает:**
1. Вы меняете данные в админке (`/admin`)
2. Данные сохраняются в базу (`kemart.db`)
3. Сайт подгружает их через JavaScript (`kemart-loader.js`)
4. Посетители видят актуальный контент

---

## 📋 Чек-лист

- [ ] Установил Node.js 18+
- [ ] Запустил сервер локально (`cd server && npm start`)
- [ ] Зашёл в админку (`http://localhost:3001/admin`)
- [ ] Скопировал HTML из GitHub в папку `site/`
- [ ] Запустил `node scripts/integrate-html.js`
- [ ] Добавил `data-kemart` атрибуты в HTML
- [ ] Загрузил всё на VPS (`./deploy.sh`)
- [ ] Настроил Nginx
- [ ] Сменил пароль админа
- [ ] Изменил JWT_SECRET в `.env`

---

## 🆘 Если что-то не работает

**Проблема:** Сервер не запускается  
**Решение:** `cd server && npm install`

**Проблема:** Порт 3001 занят  
**Решение:** `sudo lsof -i :3001` → `sudo kill -9 <PID>`

**Проблема:** Данные не подгружаются на сайте  
**Решение:** Откройте F12 → Console → проверьте ошибки

**Проблема:** 502 Bad Gateway  
**Решение:** `pm2 status` → `pm2 restart kemart`

---

## 📞 Полезные команды

```bash
# Локально
cd server && npm start           # Запуск сервера
npm run build                    # Сборка админки

# На сервере
pm2 status                       # Статус
pm2 logs kemart                  # Логи
pm2 restart kemart               # Перезапуск
sudo systemctl reload nginx      # Перезагрузка Nginx

# Бэкап базы
cp /var/www/kemart/server/kemart.db ~/backups/kemart-$(date +%Y%m%d).db
```

---

## 🎯 Итого

**Время на настройку:** ~1-2 часа  
**Стоимость VPS:** от 300₽/мес (Beget, Timeweb)  
**Результат:** Полноценная CMS для вашего сайта

**Удачи! 🚀**

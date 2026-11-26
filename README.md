# 🏠 КемАрт — Админ-панель для сайта

Полноценная CMS для управления сайтом студии дизайна интерьера КемАрт.

## 📦 Структура проекта

```
kemart-site/
├── server/              ← Бэкенд (Node.js + Express + SQLite)
│   ├── index.js         ← Главный файл сервера
│   ├── database.js      ← Инициализация БД
│   ├── auth.js          ← Авторизация (JWT)
│   ├── routes.js        ← API роуты
│   ├── package.json     ← Зависимости сервера
│   └── .env             ← Конфигурация
├── src/                 ← Фронтенд (React + TypeScript)
├── dist/                ← Собранный фронтенд (после npm run build)
└── README.md            ← Эта инструкция
```

## 🚀 Быстрый старт (локально)

### 1. Установите Node.js

Скачайте и установите Node.js версии 18+:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка
node --version   # должно быть v18+
npm --version
```

### 2. Соберите фронтенд

```bash
# В корне проекта
npm install
npm run build
```

### 3. Запустите сервер

```bash
cd server
npm install
npm start
```

### 4. Откройте админку

Откройте в браузере: **http://localhost:3001/admin**

**Логин:** `admin`  
**Пароль:** `admin`

⚠️ **ОБЯЗАТЕЛЬНО смените пароль после первого входа!**

---

## 🖥️ Развёртывание на VPS (Ubuntu)

### Шаг 1: Подготовка сервера

Подключитесь к серверу по SSH:
```bash
ssh root@ваш-сервер-ip
```

Обновите систему:
```bash
sudo apt update && sudo apt upgrade -y
```

### Шаг 2: Установка Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Шаг 3: Установка PM2 (менеджер процессов)

PM2 будет держать сервер запущенным 24/7:
```bash
sudo npm install -g pm2
```

### Шаг 4: Загрузка проекта

```bash
# Создайте папку для проекта
sudo mkdir -p /var/www/kemart
cd /var/www/kemart

# Вариант А: Скопируйте файлы с локального компьютера
# На вашем компьютере:
scp -r ./server root@ваш-сервер-ip:/var/www/kemart/
scp -r ./dist root@ваш-сервер-ip:/var/www/kemart/

# Вариант Б: Клонируйте из Git
git clone https://github.com/ваш-username/kemart-site.git .
```

### Шаг 5: Настройка сервера

```bash
cd /var/www/kemart/server

# Установите зависимости
npm install --production

# Создайте .env файл с безопасным секретом
nano .env
```

Содержимое `.env`:
```
PORT=3001
JWT_SECRET=придумайте-очень-длинный-секретный-ключ-минимум-32-символа
NODE_ENV=production
```

### Шаг 6: Запуск с PM2

```bash
# Запустите сервер
pm2 start index.js --name kemart

# Сохраните конфигурацию PM2
pm2 save

# Настройте автозапуск при перезагрузке сервера
pm2 startup
# Скопируйте и выполните команду, которую выведет PM2
```

**Полезные команды PM2:**
```bash
pm2 status          # Статус всех приложений
pm2 logs kemart     # Логи сервера
pm2 restart kemart  # Перезапуск
pm2 stop kemart     # Остановка
```

### Шаг 7: Настройка Nginx (веб-сервер)

```bash
sudo apt install nginx -y

# Создайте конфигурацию
sudo nano /etc/nginx/sites-available/kemart
```

Содержимое конфигурации:
```nginx
server {
    listen 80;
    server_name kemart.ru www.kemart.ru;  # Замените на ваш домен

    # Админка
    location /admin {
        alias /var/www/kemart/dist;
        try_files $uri $uri/ /admin/index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }

    # Загруженные файлы
    location /uploads {
        proxy_pass http://localhost:3001;
    }

    # Ваш основной сайт (статические файлы)
    location / {
        root /var/www/kemart/site;  # Папка с вашим HTML-сайтом
        try_files $uri $uri/ /index.html;
    }
}
```

Активируйте конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/kemart /etc/nginx/sites-enabled/
sudo nginx -t           # Проверка конфигурации
sudo systemctl reload nginx
```

### Шаг 8: SSL сертификат (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d kemart.ru -d www.kemart.ru
```

---

## 🔧 Управление контентом

### Экспорт данных (бэкап)

В админке на дашборде нажмите **«Экспорт»** — скачается JSON-файл со всеми данными.

### Импорт данных (восстановление)

Нажмите **«Импорт»** и выберите ранее сохранённый JSON-файл.

### Загрузка картинок

В разделе **«Медиафайлы»** можно загружать картинки. Они сохраняются в `/var/www/kemart/server/uploads/`.

---

## 🔐 Безопасность

1. **Смените пароль админа** сразу после первого входа
2. **Измените JWT_SECRET** в `.env` на случайную длинную строку
3. **Настройте firewall:**
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```
4. **Регулярно делайте бэкапы** базы данных:
   ```bash
   cp /var/www/kemart/server/kemart.db ~/backups/kemart-$(date +%Y%m%d).db
   ```

---

## 📁 Структура файлов сайта

Ваш HTML-сайт лежит в `/var/www/kemart/site/`:
```
site/
├── index.html
├── aboutus/
├── blog/
├── contacts/
├── portfolio/
├── price/
├── services/
├── assets/
│   ├── img/           ← Картинки сайта
│   └── styles/        ← CSS стили
```

---

## 🆘 Решение проблем

**Сервер не запускается:**
```bash
pm2 logs kemart   # Посмотрите ошибки
```

**502 Bad Gateway:**
```bash
pm2 status         # Проверьте что сервер запущен
pm2 restart kemart # Перезапустите
```

**Не могу загрузить файлы:**
```bash
sudo chown -R www-data:www-data /var/www/kemart/server/uploads
sudo chmod -R 755 /var/www/kemart/server/uploads
```

---

## 📞 Поддержка

Если что-то не работает:
1. Проверьте логи: `pm2 logs kemart`
2. Проверьте Nginx: `sudo nginx -t`
3. Проверьте что порт 3001 свободен: `sudo lsof -i :3001`

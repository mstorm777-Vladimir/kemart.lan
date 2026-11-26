require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { initDatabase } = require('./database');
const { setupAuthRoutes } = require('./auth');
const { setupRoutes } = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, '../dist')));

// Ваш основной сайт (HTML-файлы из GitHub)
const sitePath = path.join(__dirname, '../site');
if (require('fs').existsSync(sitePath)) {
  app.use(express.static(sitePath));
  console.log('✅ Сайт подключён из папки: /site');
} else {
  console.log('⚠️  Папка /site не найдена. Скопируйте HTML-файлы из GitHub в папку /site');
}

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Недопустимый тип файла'));
  }
});

// Загрузка файлов
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    res.json({
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`
    });
  });
});

// Инициализация БД
initDatabase();

// Настройка роутов
setupAuthRoutes(app);
setupRoutes(app);

// SPA fallback для админки
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ошибка сервера' });
});

// Создание папки uploads если её нет
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏠 КемАрт - Сервер запущен!                             ║
║                                                           ║
║   📡 API:        http://localhost:${PORT}/api                ║
║   🔐 Админка:    http://localhost:${PORT}/admin              ║
║                                                           ║
║   👤 Логин: admin                                         ║
║   🔑 Пароль: admin                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

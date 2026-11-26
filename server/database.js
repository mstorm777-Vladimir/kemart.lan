const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, 'kemart.db'));

// Включаем WAL режим для лучшей производительности
db.pragma('journal_mode = WAL');

// Инициализация таблиц
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      image TEXT,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT,
      image TEXT,
      slug TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      project TEXT,
      text TEXT,
      image TEXT,
      rating INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT,
      order_num INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      slug TEXT,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT,
      size INTEGER,
      mime_type TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Создаём админа по умолчанию
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin', 10);
    db.prepare('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)').run(
      'admin',
      hashedPassword,
      'admin@kemart.ru',
      'admin'
    );
    console.log('✅ Создан пользователь admin (пароль: admin)');
  }

  // Добавляем демо-данные если таблица пустая
  const portfolioCount = db.prepare('SELECT COUNT(*) as count FROM portfolio').get();
  if (portfolioCount.count === 0) {
    const insertPortfolio = db.prepare('INSERT INTO portfolio (title, category, description, image, status) VALUES (?, ?, ?, ?, ?)');
    const demoPortfolio = [
      ['Гостиная вместо коридора', 'Реализованные', 'Гостиная вместо коридора', '9d36b536-bdd5-489f-9825-9f9fb37fcc90-15657347.jpeg', 'published'],
      ['Деревянные панели и скрытые двери', 'Гостиные', 'Деревянные панели и скрытые двери в гостиной', '6ecd5946-c019-4368-bfae-25500dcb3099-6432129.jpeg', 'published'],
      ['Столовая зона с картинами', 'Реализованные', 'Столовая зона с картинами под заказ', 'c3fcfeeb-4e99-4a72-8346-439fb3d08d10-6432130.jpeg', 'published'],
      ['Кухня с барной стойкой', 'Кухни', 'Кухня с барной стойкой у окна', '0219e77e-68ad-40c1-b0fd-319e05420902-15657348.jpeg', 'published'],
      ['Спальня с изголовьем', 'Спальни', 'Спальня с красивым изголовьем', '8d5bc35c-bb31-45e6-98ed-e9f06c38632e-15657349.jpeg', 'published'],
      ['Детская для двух братьев', 'Детские', 'Детская для двух братьев', '6678e8db-953a-49b0-b17e-628d5dfed905-6424452.jpeg', 'published'],
    ];
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertPortfolio.run(...item);
      }
    });
    insertMany(demoPortfolio);
    console.log('✅ Добавлены демо-данные портфолио');
  }

  const reviewsCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  if (reviewsCount.count === 0) {
    const insertReview = db.prepare('INSERT INTO reviews (name, project, text, image, rating) VALUES (?, ?, ?, ?, ?)');
    const demoReviews = [
      ['Дарья Ащеулова', 'Квартира в Подмосковье. 2024г.', 'Спасибо огромное дизайн-студии "КемАрт"! Дом – очень стильный и уютный!', 'fe84e8d5-3084-44a7-b2ff-012d8fab570e-15657367.jpeg', 5],
      ['Александр Уйманов', 'Квартира на Лесной Поляне. 2017г.', 'Очень качественный подход к дизайн-проекту. Проработали все нюансы.', 'dc8eaa49-96be-4478-b472-5f2a1fb5a7df-15657370.jpeg', 5],
      ['Екатерина Ермолина', 'Таунхаус. 2022г.', 'Обратились к Алёне и Владимиру для создания дизайн проекта. Результатом очень довольны!', '81a747dc-744f-42cd-863d-ea55037dd051-15657368.jpeg', 5],
    ];
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertReview.run(...item);
      }
    });
    insertMany(demoReviews);
    console.log('✅ Добавлены демо-данные отзывов');
  }

  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (servicesCount.count === 0) {
    const insertService = db.prepare('INSERT INTO services (title, description, price, image, slug) VALUES (?, ?, ?, ?, ?)');
    const demoServices = [
      ['Дизайн проект L', 'Чертежи, визуализации, таблицы материалов.', 'от 1500 ₽/м²', '85a6280d-0d19-4c78-a00c-58793425aab8-15547867.jpeg', 'design_proekt'],
      ['Перепланировки + электрика S', 'Быстрый проект, только чертежи.', 'от 800 ₽/м²', 'a5912feb-ecbc-4b97-9193-c44265b6939b-15557864.jpeg', 'dizain_proekt_s_pereplanirovki-elektrika'],
      ['Перепланировки XS', 'Когда нужна только расстановка мебели', 'от 500 ₽/м²', '9592c6db-4511-4a6a-af33-9b36844ad50e-15557863.jpeg', 'planirovki'],
      ['Консультация', 'Экспресс-консультация перед покупкой квартиры.', 'от 3000 ₽', '12e50f43-9616-49a1-9553-2b42777c9a95-15547869.jpeg', 'express_konsyltachia'],
    ];
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertService.run(...item);
      }
    });
    insertMany(demoServices);
    console.log('✅ Добавлены демо-данные услуг');
  }

  const faqCount = db.prepare('SELECT COUNT(*) as count FROM faq').get();
  if (faqCount.count === 0) {
    const insertFaq = db.prepare('INSERT INTO faq (question, answer, order_num) VALUES (?, ?, ?)');
    const demoFaq = [
      ['Сколько лет вы работаете в дизайне интерьера?', 'Студия дизайна интерьера КемАрт работает с 2010 года.', 1],
      ['Есть ли портфолио реализованных проектов?', 'Да, у студии КемАрт есть портфолио реализованных проектов.', 2],
      ['Работаете ли вы удалённо?', 'Да, студия КемАрт работает как с проектами в Кемерово, так и удалённо.', 3],
      ['Как начать работу над дизайн-проектом?', 'Чтобы начать работу, свяжитесь с нами по телефону или напишите в Telegram.', 4],
    ];
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertFaq.run(...item);
      }
    });
    insertMany(demoFaq);
    console.log('✅ Добавлены демо-данные FAQ');
  }
}

module.exports = { db, initDatabase };

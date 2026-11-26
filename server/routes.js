const { db } = require('../database');
const { authMiddleware } = require('../auth');

function setupRoutes(app) {
  // ===== PORTFOLIO =====
  app.get('/api/portfolio', (req, res) => {
    const items = db.prepare('SELECT * FROM portfolio ORDER BY created_at DESC').all();
    res.json(items);
  });

  app.get('/api/portfolio/:id', (req, res) => {
    const item = db.prepare('SELECT * FROM portfolio WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Не найдено' });
    res.json(item);
  });

  app.post('/api/portfolio', authMiddleware, (req, res) => {
    const { title, category, description, image, status } = req.body;
    const result = db.prepare('INSERT INTO portfolio (title, category, description, image, status) VALUES (?, ?, ?, ?, ?)').run(title, category, description, image, status || 'draft');
    res.json({ id: result.lastInsertRowid, ...req.body });
  });

  app.put('/api/portfolio/:id', authMiddleware, (req, res) => {
    const { title, category, description, image, status } = req.body;
    db.prepare('UPDATE portfolio SET title=?, category=?, description=?, image=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(title, category, description, image, status, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/portfolio/:id', authMiddleware, (req, res) => {
    db.prepare('DELETE FROM portfolio WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // ===== SERVICES =====
  app.get('/api/services', (req, res) => {
    const items = db.prepare('SELECT * FROM services ORDER BY id ASC').all();
    res.json(items);
  });

  app.post('/api/services', authMiddleware, (req, res) => {
    const { title, description, price, image, slug } = req.body;
    const result = db.prepare('INSERT INTO services (title, description, price, image, slug) VALUES (?, ?, ?, ?, ?)').run(title, description, price, image, slug);
    res.json({ id: result.lastInsertRowid, ...req.body });
  });

  app.put('/api/services/:id', authMiddleware, (req, res) => {
    const { title, description, price, image, slug } = req.body;
    db.prepare('UPDATE services SET title=?, description=?, price=?, image=?, slug=? WHERE id=?').run(title, description, price, image, slug, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/services/:id', authMiddleware, (req, res) => {
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // ===== REVIEWS =====
  app.get('/api/reviews', (req, res) => {
    const items = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
    res.json(items);
  });

  app.post('/api/reviews', authMiddleware, (req, res) => {
    const { name, project, text, image, rating } = req.body;
    const result = db.prepare('INSERT INTO reviews (name, project, text, image, rating) VALUES (?, ?, ?, ?, ?)').run(name, project, text, image, rating || 5);
    res.json({ id: result.lastInsertRowid, ...req.body });
  });

  app.put('/api/reviews/:id', authMiddleware, (req, res) => {
    const { name, project, text, image, rating } = req.body;
    db.prepare('UPDATE reviews SET name=?, project=?, text=?, image=?, rating=? WHERE id=?').run(name, project, text, image, rating, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/reviews/:id', authMiddleware, (req, res) => {
    db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // ===== FAQ =====
  app.get('/api/faq', (req, res) => {
    const items = db.prepare('SELECT * FROM faq ORDER BY order_num ASC').all();
    res.json(items);
  });

  app.post('/api/faq', authMiddleware, (req, res) => {
    const { question, answer, order_num } = req.body;
    const result = db.prepare('INSERT INTO faq (question, answer, order_num) VALUES (?, ?, ?)').run(question, answer, order_num || 0);
    res.json({ id: result.lastInsertRowid, ...req.body });
  });

  app.put('/api/faq/:id', authMiddleware, (req, res) => {
    const { question, answer, order_num } = req.body;
    db.prepare('UPDATE faq SET question=?, answer=?, order_num=? WHERE id=?').run(question, answer, order_num, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/faq/:id', authMiddleware, (req, res) => {
    db.prepare('DELETE FROM faq WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // ===== BLOG =====
  app.get('/api/blog', (req, res) => {
    const items = db.prepare('SELECT * FROM blog ORDER BY created_at DESC').all();
    res.json(items);
  });

  app.get('/api/blog/:slug', (req, res) => {
    const item = db.prepare('SELECT * FROM blog WHERE slug = ?').get(req.params.slug);
    if (!item) return res.status(404).json({ error: 'Не найдено' });
    res.json(item);
  });

  app.post('/api/blog', authMiddleware, (req, res) => {
    const { title, excerpt, content, image, slug, status } = req.body;
    const result = db.prepare('INSERT INTO blog (title, excerpt, content, image, slug, status) VALUES (?, ?, ?, ?, ?, ?)').run(title, excerpt, content, image, slug, status || 'draft');
    res.json({ id: result.lastInsertRowid, ...req.body });
  });

  app.put('/api/blog/:id', authMiddleware, (req, res) => {
    const { title, excerpt, content, image, slug, status } = req.body;
    db.prepare('UPDATE blog SET title=?, excerpt=?, content=?, image=?, slug=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(title, excerpt, content, image, slug, status, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/blog/:id', authMiddleware, (req, res) => {
    db.prepare('DELETE FROM blog WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // ===== SETTINGS =====
  app.get('/api/settings', (req, res) => {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    rows.forEach(row => { settings[row.key] = row.value; });
    res.json(settings);
  });

  app.put('/api/settings', authMiddleware, (req, res) => {
    const settings = req.body;
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        upsert.run(key, value);
      }
    });
    transaction(settings);
    res.json({ success: true });
  });

  // ===== DASHBOARD STATS =====
  app.get('/api/stats', (req, res) => {
    const portfolioCount = db.prepare('SELECT COUNT(*) as count FROM portfolio').get().count;
    const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
    const reviewsCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
    const blogCount = db.prepare('SELECT COUNT(*) as count FROM blog').get().count;
    const mediaCount = db.prepare('SELECT COUNT(*) as count FROM media').get().count;

    res.json({
      portfolio: portfolioCount,
      services: servicesCount,
      reviews: reviewsCount,
      blog: blogCount,
      media: mediaCount
    });
  });

  // ===== MEDIA (упрощённо - только метаданные) =====
  app.get('/api/media', (req, res) => {
    const items = db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all();
    res.json(items);
  });

  app.post('/api/media', authMiddleware, (req, res) => {
    const { filename, original_name, size, mime_type } = req.body;
    const result = db.prepare('INSERT INTO media (filename, original_name, size, mime_type) VALUES (?, ?, ?, ?)').run(filename, original_name, size, mime_type);
    res.json({ id: result.lastInsertRowid, ...req.body });
  });

  app.delete('/api/media/:id', authMiddleware, (req, res) => {
    db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // ===== EXPORT/IMPORT JSON =====
  app.get('/api/export', authMiddleware, (req, res) => {
    const data = {
      portfolio: db.prepare('SELECT * FROM portfolio').all(),
      services: db.prepare('SELECT * FROM services').all(),
      reviews: db.prepare('SELECT * FROM reviews').all(),
      faq: db.prepare('SELECT * FROM faq').all(),
      blog: db.prepare('SELECT * FROM blog').all(),
      settings: Object.fromEntries(db.prepare('SELECT key, value FROM settings').all().map(r => [r.key, r.value])),
    };
    res.json(data);
  });

  app.post('/api/import', authMiddleware, (req, res) => {
    const data = req.body;
    try {
      const transaction = db.transaction(() => {
        if (data.portfolio) {
          db.prepare('DELETE FROM portfolio').run();
          const insert = db.prepare('INSERT INTO portfolio (title, category, description, image, status) VALUES (?, ?, ?, ?, ?)');
          data.portfolio.forEach(item => insert.run(item.title, item.category, item.description, item.image, item.status));
        }
        if (data.services) {
          db.prepare('DELETE FROM services').run();
          const insert = db.prepare('INSERT INTO services (title, description, price, image, slug) VALUES (?, ?, ?, ?, ?)');
          data.services.forEach(item => insert.run(item.title, item.description, item.price, item.image, item.slug));
        }
        if (data.reviews) {
          db.prepare('DELETE FROM reviews').run();
          const insert = db.prepare('INSERT INTO reviews (name, project, text, image, rating) VALUES (?, ?, ?, ?, ?)');
          data.reviews.forEach(item => insert.run(item.name, item.project, item.text, item.image, item.rating));
        }
        if (data.faq) {
          db.prepare('DELETE FROM faq').run();
          const insert = db.prepare('INSERT INTO faq (question, answer, order_num) VALUES (?, ?, ?)');
          data.faq.forEach(item => insert.run(item.question, item.answer, item.order_num));
        }
        if (data.blog) {
          db.prepare('DELETE FROM blog').run();
          const insert = db.prepare('INSERT INTO blog (title, excerpt, content, image, slug, status) VALUES (?, ?, ?, ?, ?, ?)');
          data.blog.forEach(item => insert.run(item.title, item.excerpt, item.content, item.image, item.slug, item.status));
        }
        if (data.settings) {
          const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
          Object.entries(data.settings).forEach(([key, value]) => upsert.run(key, value));
        }
      });
      transaction();
      res.json({ success: true, message: 'Данные импортированы' });
    } catch (err) {
      res.status(400).json({ error: 'Ошибка импорта: ' + err.message });
    }
  });
}

module.exports = { setupRoutes };

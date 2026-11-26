/**
 * КемАрт - Загрузчик данных из админки
 * Подключите этот скрипт к HTML-страницам для автоматической подгрузки данных
 * 
 * Использование:
 * <script src="/assets/js/kemart-loader.js"></script>
 * 
 * Элементы с data-атрибутами:
 * data-kemart="portfolio"      - список проектов
 * data-kemart="reviews"        - отзывы
 * data-kemart="services"       - услуги
 * data-kemart="faq"            - FAQ
 * data-kemart="contacts"       - контакты
 * data-kemart-field="title"    - поле для подстановки текста
 */

(function() {
  'use strict';

  const API_BASE = '/api';
  const CACHE_KEY = 'kemart_cache';
  const CACHE_TTL = 5 * 60 * 1000; // 5 минут

  // Кэш данных
  let cache = {};
  let cacheTime = {};

  // Загрузка данных с кэшированием
  async function fetchData(endpoint, forceRefresh = false) {
    const now = Date.now();
    
    // Проверяем кэш
    if (!forceRefresh && cache[endpoint] && (now - cacheTime[endpoint]) < CACHE_TTL) {
      return cache[endpoint];
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      cache[endpoint] = data;
      cacheTime[endpoint] = now;
      
      // Сохраняем в localStorage для оффлайн-режима
      try {
        localStorage.setItem(CACHE_KEY + endpoint, JSON.stringify({ data, time: now }));
      } catch (e) {}
      
      return data;
    } catch (err) {
      console.warn(`[КемАрт] Ошибка загрузки ${endpoint}:`, err);
      // Пробуем взять из localStorage
      try {
        const cached = localStorage.getItem(CACHE_KEY + endpoint);
        if (cached) {
          const { data } = JSON.parse(cached);
          return data;
        }
      } catch (e) {}
      return null;
    }
  }

  // Экранирование HTML
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== ПОРТФОЛИО =====
  async function renderPortfolio(container) {
    const data = await fetchData('/portfolio');
    if (!data) return;

    const category = container.dataset.kemartCategory || 'all';
    const limit = parseInt(container.dataset.kemartLimit) || 0;
    
    let items = data.filter(p => p.status === 'published');
    if (category !== 'all') {
      items = items.filter(p => p.category === category);
    }
    if (limit > 0) {
      items = items.slice(0, limit);
    }

    const template = container.dataset.kemartTemplate || 'grid';
    
    if (template === 'grid') {
      container.innerHTML = items.map(item => `
        <div class="kemart-portfolio-item" data-category="${escapeHtml(item.category)}">
          <div class="kemart-portfolio-image">
            <img src="/assets/img/${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 dy=%22.3em%22%3E${encodeURIComponent(item.title)}%3C/text%3E%3C/svg%3E'">
          </div>
          <div class="kemart-portfolio-info">
            <h3 class="kemart-portfolio-title">${escapeHtml(item.title)}</h3>
            <p class="kemart-portfolio-category">${escapeHtml(item.category)}</p>
            ${item.description ? `<p class="kemart-portfolio-desc">${escapeHtml(item.description)}</p>` : ''}
          </div>
        </div>
      `).join('');
    } else if (template === 'slider') {
      container.innerHTML = items.map(item => `
        <div class="kemart-slider-item">
          <img src="/assets/img/${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <div class="kemart-slider-caption">${escapeHtml(item.title)}</div>
        </div>
      `).join('');
    }
  }

  // ===== ОТЗЫВЫ =====
  async function renderReviews(container) {
    const data = await fetchData('/reviews');
    if (!data) return;

    const limit = parseInt(container.dataset.kemartLimit) || 0;
    let items = limit > 0 ? data.slice(0, limit) : data;

    const template = container.dataset.kemartTemplate || 'cards';
    
    if (template === 'cards') {
      container.innerHTML = items.map(item => `
        <div class="kemart-review-item">
          <div class="kemart-review-header">
            ${item.image ? `<img src="/assets/img/${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="kemart-review-avatar" loading="lazy">` : ''}
            <div class="kemart-review-info">
              <div class="kemart-review-name">${escapeHtml(item.name)}</div>
              <div class="kemart-review-project">${escapeHtml(item.project)}</div>
            </div>
          </div>
          <div class="kemart-review-stars">
            ${'★'.repeat(item.rating || 5)}${'☆'.repeat(5 - (item.rating || 5))}
          </div>
          <div class="kemart-review-text">${escapeHtml(item.text)}</div>
        </div>
      `).join('');
    }
  }

  // ===== УСЛУГИ =====
  async function renderServices(container) {
    const data = await fetchData('/services');
    if (!data) return;

    container.innerHTML = data.map(item => `
      <div class="kemart-service-item">
        ${item.image ? `<img src="/assets/img/${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">` : ''}
        <h3 class="kemart-service-title">${escapeHtml(item.title)}</h3>
        <p class="kemart-service-desc">${escapeHtml(item.description)}</p>
        <div class="kemart-service-price">${escapeHtml(item.price)}</div>
        ${item.slug ? `<a href="/services/${escapeHtml(item.slug)}" class="kemart-service-link">Подробнее</a>` : ''}
      </div>
    `).join('');
  }

  // ===== FAQ =====
  async function renderFaq(container) {
    const data = await fetchData('/faq');
    if (!data) return;

    const template = container.dataset.kemartTemplate || 'accordion';
    
    if (template === 'accordion') {
      container.innerHTML = data.map((item, i) => `
        <div class="kemart-faq-item">
          <button class="kemart-faq-question" onclick="this.parentElement.classList.toggle('active')">
            <span>${escapeHtml(item.question)}</span>
            <span class="kemart-faq-icon">+</span>
          </button>
          <div class="kemart-faq-answer">
            <p>${escapeHtml(item.answer)}</p>
          </div>
        </div>
      `).join('');
    } else if (template === 'list') {
      container.innerHTML = data.map(item => `
        <div class="kemart-faq-item">
          <h4 class="kemart-faq-question">${escapeHtml(item.question)}</h4>
          <p class="kemart-faq-answer">${escapeHtml(item.answer)}</p>
        </div>
      `).join('');
    }
  }

  // ===== КОНТАКТЫ =====
  async function renderContacts(container) {
    const data = await fetchData('/settings');
    if (!data) return;

    // Заменяем текст в элементах с data-kemart-field
    const fields = container.querySelectorAll('[data-kemart-field]');
    fields.forEach(field => {
      const fieldName = field.dataset.kemartField;
      if (data[fieldName]) {
        if (field.tagName === 'A' && (fieldName.includes('phone') || fieldName.includes('email') || fieldName.includes('http'))) {
          field.href = fieldName.includes('phone') ? `tel:${data[fieldName]}` : 
                       fieldName.includes('email') ? `mailto:${data[fieldName]}` : 
                       data[fieldName];
        }
        field.textContent = data[fieldName];
      }
    });
  }

  // ===== ГЛАВНАЯ ФУНКЦИЯ =====
  async function init() {
    console.log('[КемАрт] Загрузка данных из админки...');
    
    // Находим все элементы с data-kemart
    const elements = document.querySelectorAll('[data-kemart]');
    
    if (elements.length === 0) {
      console.log('[КемАрт] Динамические элементы не найдены');
      return;
    }

    // Обрабатываем каждый элемент
    const promises = Array.from(elements).map(async (el) => {
      const type = el.dataset.kemart;
      
      try {
        switch (type) {
          case 'portfolio':
            await renderPortfolio(el);
            break;
          case 'reviews':
            await renderReviews(el);
            break;
          case 'services':
            await renderServices(el);
            break;
          case 'faq':
            await renderFaq(el);
            break;
          case 'contacts':
            await renderContacts(el);
            break;
          default:
            console.warn(`[КемАрт] Неизвестный тип: ${type}`);
        }
      } catch (err) {
        console.error(`[КемАрт] Ошибка рендеринга ${type}:`, err);
      }
    });

    await Promise.all(promises);
    console.log('[КемАрт] Данные загружены ✓');
  }

  // Запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Экспортируем для ручного использования
  window.KemartLoader = {
    refresh: init,
    fetch: fetchData,
    clearCache: () => {
      cache = {};
      cacheTime = {};
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_KEY)) localStorage.removeItem(key);
      });
    }
  };
})();

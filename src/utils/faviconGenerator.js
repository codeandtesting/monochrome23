// Утилита для генерации favicon из первой буквы компании

/**
 * Генерирует favicon с первой буквой на градиентном фоне
 * @param {string} text - Текст (обычно название компании)
 * @param {string} gradientFrom - Начальный цвет градиента
 * @param {string} gradientTo - Конечный цвет градиента
 * @returns {string} Data URL изображения
 */
export function generateLetterFavicon(text, gradientFrom = '#3b82f6', gradientTo = '#8b5cf6') {
  const canvas = document.createElement('canvas');
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Получаем первую букву
  const letter = (text || 'M').charAt(0).toUpperCase();

  // Создаем градиент
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, gradientFrom);
  gradient.addColorStop(1, gradientTo);

  // Рисуем фон с градиентом
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Рисуем букву
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.55}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, size / 2, size / 2);

  return canvas.toDataURL('image/png');
}

/**
 * Обновляет favicon в браузере
 * @param {string} faviconUrl - URL или data URL изображения
 */
export function updateFavicon(faviconUrl) {
  // Удаляем существующие favicon links
  const existingLinks = document.querySelectorAll('link[rel*="icon"]');
  existingLinks.forEach(link => link.remove());

  // Создаем новый link элемент
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = faviconUrl;
  document.head.appendChild(link);

  // Добавляем также apple-touch-icon
  const appleLink = document.createElement('link');
  appleLink.rel = 'apple-touch-icon';
  appleLink.href = faviconUrl;
  document.head.appendChild(appleLink);
}

/**
 * Генерирует и устанавливает favicon на основе названия компании
 * @param {string} companyName - Название компании
 * @param {string} colorScheme - Цветовая схема (optional)
 */
export function setCompanyFavicon(companyName, colorScheme = 'default') {
  const gradients = {
    default: { from: '#3b82f6', to: '#8b5cf6' },
    purple: { from: '#8b5cf6', to: '#ec4899' },
    green: { from: '#10b981', to: '#06b6d4' },
    orange: { from: '#f97316', to: '#eab308' },
    cyan: { from: '#06b6d4', to: '#3b82f6' },
    red: { from: '#ef4444', to: '#f97316' },
    neon: { from: '#a855f7', to: '#ec4899' },
    aurora: { from: '#06b6d4', to: '#a855f7' },
    monochrome: { from: '#ffffff', to: '#9ca3af' },
    mint: { from: '#10b981', to: '#34d399' },
    cosmic: { from: '#7c3aed', to: '#2dd4bf' },
    rose: { from: '#f43f5e', to: '#fb7185' }
  };

  const colors = gradients[colorScheme] || gradients.default;
  const faviconDataUrl = generateLetterFavicon(companyName, colors.from, colors.to);
  updateFavicon(faviconDataUrl);

  return faviconDataUrl;
}

/**
 * Сохраняет favicon в localStorage для сайта
 * @param {string} siteId - ID сайта
 * @param {string} faviconUrl - URL favicon
 */
export function saveFaviconToStorage(siteId, faviconUrl) {
  const key = `progressit_favicon_${siteId}`;
  localStorage.setItem(key, faviconUrl);
}

/**
 * Загружает favicon из localStorage
 * @param {string} siteId - ID сайта
 * @returns {string|null} URL favicon или null
 */
export function loadFaviconFromStorage(siteId) {
  const key = `progressit_favicon_${siteId}`;
  return localStorage.getItem(key);
}

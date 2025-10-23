// Утилита для работы с настройками дизайна

const DESIGN_STORAGE_KEY = 'progressit_design_settings';

// Цветовые схемы
export const COLOR_SCHEMES = {
  default: {
    name: 'Default Dark',
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // purple-500
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    accent: '#06b6d4', // cyan-500
  },
  purple: {
    name: 'Purple Dream',
    primary: '#8b5cf6', // purple-500
    secondary: '#ec4899', // pink-500
    background: '#0a0014',
    surface: '#1a0f2e',
    text: '#ffffff',
    accent: '#a855f7', // purple-400
  },
  green: {
    name: 'Tech Green',
    primary: '#10b981', // green-500
    secondary: '#06b6d4', // cyan-500
    background: '#001a0f',
    surface: '#0a2f1f',
    text: '#ffffff',
    accent: '#34d399', // green-400
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#f97316', // orange-500
    secondary: '#eab308', // yellow-500
    background: '#1a0a00',
    surface: '#2f1a0a',
    text: '#ffffff',
    accent: '#fb923c', // orange-400
  },
  cyan: {
    name: 'Ocean Blue',
    primary: '#06b6d4', // cyan-500
    secondary: '#3b82f6', // blue-500
    background: '#001a1f',
    surface: '#0a2f3f',
    text: '#ffffff',
    accent: '#22d3ee', // cyan-400
  },
  red: {
    name: 'Red Hot',
    primary: '#ef4444', // red-500
    secondary: '#f97316', // orange-500
    background: '#1a0000',
    surface: '#2f0a0a',
    text: '#ffffff',
    accent: '#f87171', // red-400
  }
};

// Типы лендингов
export const LANDING_TYPES = {
  main: {
    name: 'Main Landing',
    description: 'Главная страница с чатом',
    path: '/',
    features: ['AI Chat', 'Hero Section', 'Portfolio Gallery', 'Social Links']
  },
  client: {
    name: 'Client Site',
    description: 'Клиентский сайт с динамическим контентом',
    path: '/2',
    features: ['Split Layout', 'Auto-changing Content', 'AI Chat', 'Hero Screen']
  }
};

// Дефолтные настройки дизайна
const getDefaultDesignSettings = () => ({
  colorScheme: 'default',
  activeLanding: 'main', // 'main' или 'client'
  customColors: null, // Для будущих кастомных цветов
  lastModified: new Date().toISOString()
});

// Получить настройки дизайна
export const getDesignSettings = () => {
  try {
    const settings = localStorage.getItem(DESIGN_STORAGE_KEY);
    return settings ? JSON.parse(settings) : getDefaultDesignSettings();
  } catch (error) {
    console.error('Error reading design settings:', error);
    return getDefaultDesignSettings();
  }
};

// Сохранить настройки дизайна
export const saveDesignSettings = (settings) => {
  try {
    const updatedSettings = {
      ...settings,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(updatedSettings));
    
    // Отправляем событие для обновления страниц
    window.dispatchEvent(new Event('designSettingsUpdated'));
    
    return true;
  } catch (error) {
    console.error('Error saving design settings:', error);
    return false;
  }
};

// Обновить цветовую схему
export const updateColorScheme = (schemeName) => {
  const settings = getDesignSettings();
  settings.colorScheme = schemeName;
  return saveDesignSettings(settings);
};

// Обновить активный лендинг
export const updateActiveLanding = (landingType) => {
  const settings = getDesignSettings();
  settings.activeLanding = landingType;
  return saveDesignSettings(settings);
};

// Получить текущую цветовую схему
export const getCurrentColorScheme = () => {
  const settings = getDesignSettings();
  return COLOR_SCHEMES[settings.colorScheme] || COLOR_SCHEMES.default;
};

// Применить цветовую схему к документу
export const applyColorScheme = (schemeName) => {
  const scheme = COLOR_SCHEMES[schemeName] || COLOR_SCHEMES.default;
  const root = document.documentElement;
  
  root.style.setProperty('--color-primary', scheme.primary);
  root.style.setProperty('--color-secondary', scheme.secondary);
  root.style.setProperty('--color-background', scheme.background);
  root.style.setProperty('--color-surface', scheme.surface);
  root.style.setProperty('--color-text', scheme.text);
  root.style.setProperty('--color-accent', scheme.accent);
};

// Сбросить к дефолтным настройкам
export const resetDesignSettings = () => {
  try {
    localStorage.removeItem(DESIGN_STORAGE_KEY);
    applyColorScheme('default');
    return getDefaultDesignSettings();
  } catch (error) {
    console.error('Error resetting design settings:', error);
    return getDefaultDesignSettings();
  }
};


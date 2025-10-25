// Утилита для работы с настройками дизайна

const DESIGN_STORAGE_KEY = 'progressit_design_settings';

// Цветовые схемы с градиентами
export const COLOR_SCHEMES = {
  default: {
    name: 'Midnight Blue',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientFrom: '#3b82f6',
    gradientTo: '#8b5cf6',
    category: 'Professional'
  },
  purple: {
    name: 'Purple Dream',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    background: '#0a0014',
    surface: '#1a0f2e',
    text: '#ffffff',
    accent: '#a855f7',
    gradient: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
    category: 'Creative'
  },
  green: {
    name: 'Emerald Forest',
    primary: '#10b981',
    secondary: '#06b6d4',
    background: '#001a0f',
    surface: '#0a2f1f',
    text: '#ffffff',
    accent: '#34d399',
    gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
    gradientFrom: '#10b981',
    gradientTo: '#06b6d4',
    category: 'Natural'
  },
  orange: {
    name: 'Sunset Glow',
    primary: '#f97316',
    secondary: '#eab308',
    background: '#1a0a00',
    surface: '#2f1a0a',
    text: '#ffffff',
    accent: '#fb923c',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradientFrom: '#f97316',
    gradientTo: '#eab308',
    category: 'Energetic'
  },
  cyan: {
    name: 'Ocean Wave',
    primary: '#06b6d4',
    secondary: '#3b82f6',
    background: '#001a1f',
    surface: '#0a2f3f',
    text: '#ffffff',
    accent: '#22d3ee',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradientFrom: '#06b6d4',
    gradientTo: '#3b82f6',
    category: 'Cool'
  },
  red: {
    name: 'Fire Blaze',
    primary: '#ef4444',
    secondary: '#f97316',
    background: '#1a0000',
    surface: '#2f0a0a',
    text: '#ffffff',
    accent: '#f87171',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradientFrom: '#ef4444',
    gradientTo: '#f97316',
    category: 'Bold'
  },
  neon: {
    name: 'Neon Nights',
    primary: '#a855f7',
    secondary: '#ec4899',
    background: '#0a0014',
    surface: '#1a0f2e',
    text: '#ffffff',
    accent: '#f0abfc',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    gradientFrom: '#a855f7',
    gradientTo: '#ec4899',
    category: 'Vibrant'
  },
  aurora: {
    name: 'Northern Aurora',
    primary: '#06b6d4',
    secondary: '#a855f7',
    background: '#000814',
    surface: '#001d3d',
    text: '#ffffff',
    accent: '#22d3ee',
    gradient: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
    gradientFrom: '#06b6d4',
    gradientTo: '#a855f7',
    category: 'Modern'
  },
  monochrome: {
    name: 'Pure Monochrome',
    primary: '#ffffff',
    secondary: '#9ca3af',
    background: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    accent: '#d1d5db',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    gradientFrom: '#ffffff',
    gradientTo: '#9ca3af',
    category: 'Minimal'
  },
  mint: {
    name: 'Fresh Mint',
    primary: '#10b981',
    secondary: '#34d399',
    background: '#001a0f',
    surface: '#0a2f1f',
    text: '#ffffff',
    accent: '#6ee7b7',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    gradientFrom: '#10b981',
    gradientTo: '#34d399',
    category: 'Fresh'
  },
  cosmic: {
    name: 'Cosmic Purple',
    primary: '#7c3aed',
    secondary: '#2dd4bf',
    background: '#0f0a1e',
    surface: '#1e1433',
    text: '#ffffff',
    accent: '#a78bfa',
    gradient: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 50%, #2dd4bf 100%)',
    gradientFrom: '#7c3aed',
    gradientTo: '#2dd4bf',
    category: 'Futuristic'
  },
  rose: {
    name: 'Rose Gold',
    primary: '#f43f5e',
    secondary: '#fb7185',
    background: '#1a0008',
    surface: '#2f0a14',
    text: '#ffffff',
    accent: '#fda4af',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradientFrom: '#f43f5e',
    gradientTo: '#fb7185',
    category: 'Elegant'
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


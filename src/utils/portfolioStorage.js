// Утилита для работы с портфолио в localStorage

const PORTFOLIO_STORAGE_KEY = 'progressit_portfolio';

// Получить все элементы портфолио
export const getAllPortfolioItems = () => {
  try {
    const items = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    return items ? JSON.parse(items) : getDefaultPortfolio();
  } catch (error) {
    console.error('Error reading portfolio:', error);
    return getDefaultPortfolio();
  }
};

// Дефолтное портфолио (если пусто)
const getDefaultPortfolio = () => [
  // Images
  {
    id: 'default_1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    title: 'Analytics Dashboard',
    category: 'Web Development',
    isDefault: true
  },
  {
    id: 'default_2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    title: 'Mobile Banking App',
    category: 'Mobile Development',
    isDefault: true
  },
  {
    id: 'default_3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    title: 'Blockchain Platform',
    category: 'Blockchain',
    isDefault: true
  },
  {
    id: 'default_4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    title: 'NFT Marketplace',
    category: 'Web3',
    isDefault: true
  },
  {
    id: 'default_5',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    title: 'Casino Platform',
    category: 'Gaming',
    isDefault: true
  },
  {
    id: 'default_6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    title: 'E-commerce Solution',
    category: 'E-commerce',
    isDefault: true
  },
  // Videos
  {
    id: 'default_video_1',
    type: 'video',
    url: 'https://youtube.com/watch?v=example1',
    title: 'Product Demo',
    isDefault: true
  },
  {
    id: 'default_video_2',
    type: 'video',
    url: 'https://vimeo.com/example2',
    title: 'Client Testimonial',
    isDefault: true
  },
  // Cases
  {
    id: 'default_case_1',
    type: 'case',
    title: 'DeFi Trading Platform',
    description: 'Built a decentralized trading platform with smart contract integration, handling $10M+ in daily volume',
    isDefault: true
  },
  {
    id: 'default_case_2',
    type: 'case',
    title: 'NFT Marketplace',
    description: 'Developed an NFT marketplace with advanced filtering, bidding system, and wallet integration',
    isDefault: true
  },
  // Links
  {
    id: 'default_link_1',
    type: 'link',
    platform: 'github',
    url: 'https://github.com/progressit',
    isDefault: true
  },
  {
    id: 'default_link_2',
    type: 'link',
    platform: 'linkedin',
    url: 'https://linkedin.com/company/progressit',
    isDefault: true
  }
];

// Добавить элемент в портфолио
export const addPortfolioItem = (item) => {
  try {
    const items = getAllPortfolioItems();
    
    const newItem = {
      id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: item.type || 'image',
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    // Добавляем поля в зависимости от типа
    if (item.type === 'image') {
      newItem.url = item.url;
      newItem.title = item.title || 'Untitled';
      newItem.category = item.category || 'Other';
    } else if (item.type === 'video') {
      newItem.url = item.url;
      newItem.title = item.title || 'Untitled Video';
    } else if (item.type === 'case') {
      newItem.title = item.title || 'Untitled Case';
      newItem.description = item.description || '';
    } else if (item.type === 'link') {
      newItem.platform = item.platform || 'website';
      newItem.url = item.url;
    }
    
    items.unshift(newItem); // Добавляем в начало
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
    return newItem;
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    return null;
  }
};

// Удалить элемент из портфолио
export const deletePortfolioItem = (itemId) => {
  try {
    const items = getAllPortfolioItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(filteredItems));
    return true;
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return false;
  }
};

// Обновить элемент портфолио
export const updatePortfolioItem = (itemId, updates) => {
  try {
    const items = getAllPortfolioItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return null;
    
    items[itemIndex] = {
      ...items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
    return items[itemIndex];
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return null;
  }
};

// Получить элементы по типу
export const getPortfolioByType = (type) => {
  const items = getAllPortfolioItems();
  return items.filter(item => item.type === type);
};

// Получить элементы по категории
export const getPortfolioByCategory = (category) => {
  const items = getAllPortfolioItems();
  return items.filter(item => item.category === category);
};

// Сбросить к дефолтному портфолио
export const resetToDefault = () => {
  try {
    localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    return getDefaultPortfolio();
  } catch (error) {
    console.error('Error resetting portfolio:', error);
    return [];
  }
};

// Статистика портфолио
export const getPortfolioStats = () => {
  const items = getAllPortfolioItems();
  return {
    total: items.length,
    images: items.filter(i => i.type === 'image').length,
    videos: items.filter(i => i.type === 'video').length,
    cases: items.filter(i => i.type === 'case').length,
    links: items.filter(i => i.type === 'link').length,
    custom: items.filter(i => !i.isDefault).length,
    default: items.filter(i => i.isDefault).length
  };
};

// Получить только изображения
export const getImages = () => {
  const items = getAllPortfolioItems();
  return items.filter(item => item.type === 'image');
};

// Получить только видео
export const getVideos = () => {
  const items = getAllPortfolioItems();
  return items.filter(item => item.type === 'video');
};

// Получить только кейсы
export const getCases = () => {
  const items = getAllPortfolioItems();
  return items.filter(item => item.type === 'case');
};

// Получить только ссылки
export const getLinks = () => {
  const items = getAllPortfolioItems();
  return items.filter(item => item.type === 'link');
};


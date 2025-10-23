// Утилита для работы с данными сайта в localStorage
import { DEFAULT_SERVICES } from '../data/servicesData';

const SITE_DATA_STORAGE_KEY = 'progressit_site_data';
const SERVICES_STORAGE_KEY = 'progressit_services';

// Дефолтные данные сайта
const getDefaultSiteData = () => ({
  hero: {
    companyName: 'ProgressIT',
    tagline: 'Your Vision, Infinite Possibilities',
    description: 'UK-based software development company with 15+ years of expertise in Blockchain, Web3, Casino, Gaming, and Full-Stack Development. 500+ projects delivered worldwide.'
  },
  services: {
    heading: 'Our Services',
    // Услуги теперь хранятся отдельно
  },
  contacts: {
    heading: 'Get in Touch',
    phone: '+37120531400',
    email: 'info@progressit.online',
    address: '27 Old Gloucester Street, London, WC1N 3AX, United Kingdom',
    website: 'https://www.progressit.online'
  },
  social: {
    facebook: 'https://facebook.com/progressit',
    instagram: 'https://instagram.com/progressit',
    twitter: 'https://twitter.com/progressit',
    discord: 'https://discord.gg/progressit',
    youtube: 'https://youtube.com/@progressit'
  },
  stats: {
    enabled: true,
    items: [
      { icon: '⚡', value: '15+', label: 'Years of Experience' },
      { icon: '🛡️', value: '500+', label: 'Projects Delivered' },
      { icon: '⭐', value: '200+', label: 'Happy Clients' }
    ]
  },
  testimonials: {
    enabled: true,
    items: [
      {
        id: 'test_1',
        name: 'John D.',
        role: 'CEO, TechCorp',
        rating: 5,
        text: 'ProgressIT delivered an outstanding blockchain solution. Professional, timely, and exceeded expectations!'
      },
      {
        id: 'test_2',
        name: 'Maria K.',
        role: 'Founder, GamingHub',
        rating: 5,
        text: 'Amazing work on our casino platform. Their expertise in gaming development is unmatched.'
      }
    ]
  }
});

// Получить все данные сайта
export const getSiteData = () => {
  try {
    const data = localStorage.getItem(SITE_DATA_STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultSiteData();
  } catch (error) {
    console.error('Error reading site data:', error);
    return getDefaultSiteData();
  }
};

// Сохранить данные сайта
export const saveSiteData = (data) => {
  try {
    localStorage.setItem(SITE_DATA_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving site data:', error);
    return false;
  }
};

// Обновить конкретную секцию
export const updateSection = (sectionName, sectionData) => {
  try {
    const currentData = getSiteData();
    currentData[sectionName] = sectionData;
    localStorage.setItem(SITE_DATA_STORAGE_KEY, JSON.stringify(currentData));
    return true;
  } catch (error) {
    console.error('Error updating section:', error);
    return false;
  }
};

// Получить конкретную секцию
export const getSection = (sectionName) => {
  const data = getSiteData();
  return data[sectionName] || {};
};

// Сбросить к дефолтным данным
export const resetToDefault = () => {
  try {
    localStorage.removeItem(SITE_DATA_STORAGE_KEY);
    localStorage.removeItem(SERVICES_STORAGE_KEY);
    return getDefaultSiteData();
  } catch (error) {
    console.error('Error resetting site data:', error);
    return getDefaultSiteData();
  }
};

// ===== УПРАВЛЕНИЕ УСЛУГАМИ =====

// Получить все услуги
export const getAllServices = () => {
  try {
    const services = localStorage.getItem(SERVICES_STORAGE_KEY);
    return services ? JSON.parse(services) : DEFAULT_SERVICES;
  } catch (error) {
    console.error('Error reading services:', error);
    return DEFAULT_SERVICES;
  }
};

// Сохранить все услуги
export const saveAllServices = (services) => {
  try {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
    return true;
  } catch (error) {
    console.error('Error saving services:', error);
    return false;
  }
};

// Добавить новую услугу
export const addService = (service) => {
  try {
    const services = getAllServices();
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const newService = {
      id: newId,
      ...service,
      active: service.active !== undefined ? service.active : true
    };
    services.push(newService);
    saveAllServices(services);
    return newService;
  } catch (error) {
    console.error('Error adding service:', error);
    return null;
  }
};

// Обновить услугу
export const updateService = (id, updates) => {
  try {
    const services = getAllServices();
    const index = services.findIndex(s => s.id === id);
    if (index !== -1) {
      services[index] = { ...services[index], ...updates };
      saveAllServices(services);
      return services[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating service:', error);
    return null;
  }
};

// Удалить услугу
export const deleteService = (id) => {
  try {
    const services = getAllServices();
    const filtered = services.filter(s => s.id !== id);
    saveAllServices(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting service:', error);
    return false;
  }
};

// Удалить несколько услуг
export const deleteMultipleServices = (ids) => {
  try {
    const services = getAllServices();
    const filtered = services.filter(s => !ids.includes(s.id));
    saveAllServices(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting multiple services:', error);
    return false;
  }
};

// Получить услуги по категории
export const getServicesByCategory = (category) => {
  const services = getAllServices();
  return category === 'all' ? services : services.filter(s => s.category === category);
};

// Поиск услуг
export const searchServices = (query) => {
  const services = getAllServices();
  const lowerQuery = query.toLowerCase();
  return services.filter(s => 
    s.title.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.category.toLowerCase().includes(lowerQuery)
  );
};


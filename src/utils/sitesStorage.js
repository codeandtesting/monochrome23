// Storage for managing multiple sites

const SITES_STORAGE_KEY = 'progressit_sites';
const ACTIVE_SITE_KEY = 'progressit_active_site';

// Get all sites
export const getAllSites = () => {
  try {
    const sites = localStorage.getItem(SITES_STORAGE_KEY);
    return sites ? JSON.parse(sites) : [];
  } catch (error) {
    console.error('Error reading sites:', error);
    return [];
  }
};

// Get active site ID
export const getActiveSiteId = () => {
  return localStorage.getItem(ACTIVE_SITE_KEY) || null;
};

// Set active site
export const setActiveSite = (siteId) => {
  localStorage.setItem(ACTIVE_SITE_KEY, siteId);
  window.dispatchEvent(new Event('activeSiteChanged'));
};

// Get active site data
export const getActiveSite = () => {
  let sites = getAllSites();
  
  // Если нет сайтов вообще - инициализируем систему
  if (sites.length === 0) {
    console.warn('⚠️ No sites found, initializing default sites...');
    initializeSitesFromLegacy();
    sites = getAllSites();
  }
  
  const activeId = getActiveSiteId();
  
  if (!activeId && sites.length > 0) {
    // Если нет активного сайта, но есть сайты - выбираем первый
    setActiveSite(sites[0].id);
    return sites[0];
  }
  
  return sites.find(site => site.id === activeId) || sites[0] || null;
};

// Get site by URL
export const getSiteByUrl = (url) => {
  const sites = getAllSites();
  return sites.find(site => site.url === url) || null;
};

// Create new site
export const createSite = (siteData) => {
  const sites = getAllSites();
  
  // Определяем URL для нового сайта
  const siteUrl = siteData.url || `/${sites.length + 1}`;
  
  const newSite = {
    id: `site_${Date.now()}`,
    name: siteData.name || 'Untitled Site',
    url: siteUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: siteData.data || {
      hero: {
        companyName: siteData.name || 'Untitled Site',
        tagline: 'Your tagline here',
        description: 'Your description here'
      },
      contacts: {
        heading: 'Get in Touch',
        phone: '',
        email: '',
        address: '',
        website: ''
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        discord: '',
        youtube: ''
      },
      stats: {
        enabled: false,
        items: []
      },
      testimonials: {
        enabled: false,
        items: []
      }
    },
    services: siteData.services || [],
    portfolio: siteData.portfolio || [],
    design: siteData.design || {
      colorScheme: 'default',
      activeLanding: 'client'
    }
  };
  
  sites.push(newSite);
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  
  // Set as active site
  setActiveSite(newSite.id);
  
  return newSite;
};

// Update site
export const updateSite = (siteId, updates) => {
  const sites = getAllSites();
  const siteIndex = sites.findIndex(site => site.id === siteId);
  
  if (siteIndex === -1) {
    return false;
  }
  
  sites[siteIndex] = {
    ...sites[siteIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  window.dispatchEvent(new Event('sitesUpdated'));
  
  return true;
};

// Delete site
export const deleteSite = (siteId) => {
  const sites = getAllSites();
  const filteredSites = sites.filter(site => site.id !== siteId);
  
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(filteredSites));
  
  // If deleted site was active, set first site as active
  if (getActiveSiteId() === siteId && filteredSites.length > 0) {
    setActiveSite(filteredSites[0].id);
  }
  
  window.dispatchEvent(new Event('sitesUpdated'));
  return true;
};

// Update active site data
export const updateActiveSiteData = (dataUpdates) => {
  const activeId = getActiveSiteId();
  if (!activeId) return false;
  
  const sites = getAllSites();
  const siteIndex = sites.findIndex(site => site.id === activeId);
  
  if (siteIndex === -1) return false;
  
  sites[siteIndex].data = {
    ...sites[siteIndex].data,
    ...dataUpdates
  };
  sites[siteIndex].updatedAt = new Date().toISOString();
  
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  window.dispatchEvent(new Event('siteDataUpdated'));
  
  return true;
};

// Update active site services
export const updateActiveSiteServices = (services) => {
  const activeId = getActiveSiteId();
  if (!activeId) return false;
  
  const sites = getAllSites();
  const siteIndex = sites.findIndex(site => site.id === activeId);
  
  if (siteIndex === -1) return false;
  
  sites[siteIndex].services = services;
  sites[siteIndex].updatedAt = new Date().toISOString();
  
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  window.dispatchEvent(new Event('siteDataUpdated'));
  
  return true;
};

// Update active site portfolio
export const updateActiveSitePortfolio = (portfolio) => {
  const activeId = getActiveSiteId();
  if (!activeId) return false;
  
  const sites = getAllSites();
  const siteIndex = sites.findIndex(site => site.id === activeId);
  
  if (siteIndex === -1) return false;
  
  sites[siteIndex].portfolio = portfolio;
  sites[siteIndex].updatedAt = new Date().toISOString();
  
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  window.dispatchEvent(new Event('portfolioUpdated'));
  
  return true;
};

// Update active site design
export const updateActiveSiteDesign = (design) => {
  const activeId = getActiveSiteId();
  if (!activeId) return false;
  
  const sites = getAllSites();
  const siteIndex = sites.findIndex(site => site.id === activeId);
  
  if (siteIndex === -1) return false;
  
  sites[siteIndex].design = {
    ...sites[siteIndex].design,
    ...design
  };
  sites[siteIndex].updatedAt = new Date().toISOString();
  
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  window.dispatchEvent(new Event('designSettingsUpdated'));
  
  return true;
};

// Reset and reinitialize all sites
export const resetSites = () => {
  localStorage.removeItem(SITES_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_SITE_KEY);
  localStorage.removeItem('progressit_site_data');
  localStorage.removeItem('progressit_services');
  localStorage.removeItem('progressit_portfolio');
  localStorage.removeItem('progressit_design_settings');
  window.location.reload();
};

// Fix missing URLs in existing sites
export const fixMissingUrls = () => {
  const sites = getAllSites();
  let updated = false;
  
  // Найти все используемые URL
  const usedUrls = new Set(sites.filter(s => s.url).map(s => s.url));
  
  // Назначить URL сайтам без URL
  let nextUrlNumber = 3; // начинаем с /3, т.к. / для лендинга, /2 для ProgressIT
  
  const fixedSites = sites.map(site => {
    if (!site.url || site.url === 'undefined') {
      // Найти свободный URL
      while (usedUrls.has(`/${nextUrlNumber}`)) {
        nextUrlNumber++;
      }
      
      const newUrl = `/${nextUrlNumber}`;
      usedUrls.add(newUrl);
      nextUrlNumber++;
      updated = true;
      
      return {
        ...site,
        url: newUrl,
        updatedAt: new Date().toISOString()
      };
    }
    return site;
  });
  
  if (updated) {
    localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(fixedSites));
    window.dispatchEvent(new Event('sitesUpdated'));
    console.log('✅ Fixed missing URLs for sites');
  }
  
  return updated;
};

// Initialize sites from legacy data
export const initializeSitesFromLegacy = () => {
  let sites = getAllSites();
  
  // Если есть сайт на '/', переместить на '/2'
  const rootSiteIndex = sites.findIndex(site => site.url === '/');
  if (rootSiteIndex !== -1) {
    sites[rootSiteIndex].url = '/2';
    sites[rootSiteIndex].updatedAt = new Date().toISOString();
    localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
    console.log('✅ Moved root site to /2');
  }
  
  // Проверяем, существует ли ProgressIT
  const progressItExists = sites.some(site => site.url === '/2' || site.name === 'ProgressIT');
  
  // Если ProgressIT не существует, создаём его
  if (!progressItExists) {
    const progressItSite = {
      id: `site_progressit_${Date.now()}`,
      name: 'ProgressIT',
      url: '/2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        hero: {
          companyName: 'ProgressIT',
          tagline: 'Create AI-Powered Websites in Minutes',
          description: 'Build professional landing pages with AI assistance. No coding required. Perfect for businesses, freelancers, and agencies.'
        },
        contacts: {
          heading: 'Get in Touch',
          phone: '+1 234 567 890',
          email: 'hello@progressit.ai',
          address: '',
          website: 'https://progressit.ai'
        },
        social: {
          facebook: '',
          instagram: '',
          twitter: '',
          discord: '',
          youtube: ''
        },
        stats: {
          enabled: true,
          items: [
            { icon: '⚡', value: '10+', label: 'Years Experience' },
            { icon: '🛡️', value: '1000+', label: 'Websites Created' },
            { icon: '⭐', value: '500+', label: 'Happy Clients' }
          ]
        },
        testimonials: {
          enabled: false,
          items: []
        }
      },
      services: [
        { id: 'service_1', title: 'AI Website Generator', description: 'Generate complete websites with AI', category: 'AI Tools', active: true },
        { id: 'service_2', title: 'Custom Landing Pages', description: 'Build beautiful landing pages', category: 'Design', active: true },
        { id: 'service_3', title: 'SEO Optimization', description: 'Optimize for search engines', category: 'Marketing', active: true },
        { id: 'service_4', title: 'Analytics Dashboard', description: 'Track your website performance', category: 'Analytics', active: true },
        { id: 'service_5', title: '24/7 Support', description: 'Get help when you need it', category: 'Support', active: true }
      ],
      portfolio: [],
      design: {
        colorScheme: 'default',
        activeLanding: 'client'
      }
    };
    
    // Добавляем ProgressIT в начало массива
    sites.unshift(progressItSite);
    localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
    
    // Если нет активного сайта, устанавливаем ProgressIT
    if (!getActiveSiteId()) {
      setActiveSite(progressItSite.id);
    }
    
    window.dispatchEvent(new Event('sitesUpdated'));
  }
  
  // Try to load legacy data for other sites (если есть)
  if (sites.length === 0) {
    const legacySiteData = localStorage.getItem('progressit_site_data');
    const legacyServices = localStorage.getItem('progressit_services');
    const legacyPortfolio = localStorage.getItem('progressit_portfolio');
    const legacyDesign = localStorage.getItem('progressit_design_settings');
    
    if (legacySiteData) {
      const siteData = JSON.parse(legacySiteData);
      const services = legacyServices ? JSON.parse(legacyServices) : [];
      const portfolio = legacyPortfolio ? JSON.parse(legacyPortfolio) : [];
      const design = legacyDesign ? JSON.parse(legacyDesign) : { colorScheme: 'default', activeLanding: 'client' };
      
      // Только если это не ProgressIT
      if (siteData.hero?.companyName && siteData.hero.companyName !== 'ProgressIT') {
        createSite({
          name: siteData.hero.companyName,
          url: '/3',
          data: siteData,
          services: services,
          portfolio: portfolio,
          design: design
        });
      }
    }
  }
};


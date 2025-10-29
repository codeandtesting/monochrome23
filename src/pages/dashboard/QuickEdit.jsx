import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, RefreshCw, Sparkles, Palette, Monitor, Eye, X, Zap, BarChart, Upload, Chrome, Menu } from 'lucide-react';
import { getActiveSite, updateSite } from '../../utils/sitesStorage';
import { getDesignSettings, saveDesignSettings, COLOR_SCHEMES, LANDING_TYPES, applyColorScheme } from '../../utils/designStorage';
import { getSEOData, saveSEOData, generateSEOFromSite, calculateSEOScore } from '../../utils/seoStorage';
import { generateLetterFavicon, updateFavicon, saveFaviconToStorage, loadFaviconFromStorage } from '../../utils/faviconGenerator';
import ServicesManager from '../../components/dashboard/ServicesManager';
import Portfolio from './Portfolio';
import AISuggestions from '../../components/dashboard/AISuggestions';
import { HelpTooltip } from '../../components/Tooltip';
import GroupedTabs from '../../components/dashboard/GroupedTabs';
import WelcomeTour from '../../components/dashboard/WelcomeTour';

export default function QuickEdit() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentSite, setCurrentSite] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [designSettings, setDesignSettings] = useState(getDesignSettings());
  const [previewKey, setPreviewKey] = useState(0);
  const [pendingAISave, setPendingAISave] = useState(false);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [seoScore, setSeoScore] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [faviconVariations, setFaviconVariations] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if first login or new site and show welcome tour
  useEffect(() => {
    const isFirstLogin = localStorage.getItem('progressit_first_login');
    const site = getActiveSite();

    // Показываем тур если это первый логин ИЛИ если сайт новый
    if (isFirstLogin === 'true' || site?.isNew) {
      setShowWelcomeTour(true);
      localStorage.removeItem('progressit_first_login');

      // Убираем флаг isNew у сайта после показа тура
      if (site?.isNew) {
        updateSite(site.id, { isNew: false });
      }
    }
  }, []);

  // Загрузить данные при монтировании
  useEffect(() => {
    loadSiteData();

    const handleActiveSiteChange = () => {
      loadSiteData();
    };

    const handleShowTour = () => {
      setShowWelcomeTour(true);
    };

    window.addEventListener('activeSiteChanged', handleActiveSiteChange);
    window.addEventListener('sitesUpdated', handleActiveSiteChange);
    window.addEventListener('showWelcomeTour', handleShowTour);

    return () => {
      window.removeEventListener('activeSiteChanged', handleActiveSiteChange);
      window.removeEventListener('sitesUpdated', handleActiveSiteChange);
      window.removeEventListener('showWelcomeTour', handleShowTour);
    };
  }, []);

  // Автосохранение после AI suggestion
  useEffect(() => {
    if (pendingAISave && currentSite && siteData) {
      updateSite(currentSite.id, { data: siteData });
      window.dispatchEvent(new Event('siteDataUpdated'));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setPendingAISave(false);
    }
  }, [pendingAISave, currentSite, siteData]);

  // Автосохранение при изменении данных (с debounce)
  useEffect(() => {
    if (!currentSite || !siteData) return;

    // Не сохраняем при первой загрузке
    const isInitialLoad = !pendingAISave && saved === false;
    if (isInitialLoad) return;

    const debounceTimer = setTimeout(() => {
      updateSite(currentSite.id, { data: siteData });
      window.dispatchEvent(new Event('siteDataUpdated'));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000); // Сохраняем через 1 секунду после последнего изменения

    return () => clearTimeout(debounceTimer);
  }, [siteData]);

  const loadSiteData = () => {
    const site = getActiveSite();
    if (site) {
      setCurrentSite(site);
      setSiteData(site.data);

      // Проверяем, если сайт новый - показываем тур
      if (site.isNew) {
        setShowWelcomeTour(true);
        updateSite(site.id, { isNew: false });
      }

      // Загрузить настройки дизайна из сайта
      if (site.design) {
        setDesignSettings(site.design);
        applyColorScheme(site.design.colorScheme || 'default');
      }

      // Загрузить или создать SEO данные
      let seo = getSEOData(site.id);
      if (!seo) {
        // Автоматически генерируем SEO при первой загрузке
        seo = generateSEOFromSite(site.data);
        saveSEOData(site.id, seo);
      }
      setSeoData(seo);

      // Рассчитать SEO Score
      const score = calculateSEOScore(seo, site.data);
      setSeoScore(score);

      // Загрузить или создать favicon
      let favicon = loadFaviconFromStorage(site.id);
      if (!favicon && site.data?.hero?.companyName) {
        // Автоматически генерируем favicon при первой загрузке
        const colorScheme = site.design?.colorScheme || 'default';
        favicon = generateLetterFavicon(
          site.data.hero.companyName,
          COLOR_SCHEMES[colorScheme]?.gradientFrom || '#3b82f6',
          COLOR_SCHEMES[colorScheme]?.gradientTo || '#8b5cf6'
        );
        saveFaviconToStorage(site.id, favicon);
      }
      if (favicon) {
        setFaviconPreview(favicon);
        updateFavicon(favicon);
      }
    }
  };

  const handleSave = () => {
    if (currentSite && siteData) {
      updateSite(currentSite.id, { data: siteData });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      
      // Обновить главную страницу если она открыта
      window.dispatchEvent(new Event('siteDataUpdated'));
    }
  };

  const handleReset = () => {
    if (window.confirm('Сбросить все данные к значениям по умолчанию?')) {
      // Reset to default structure
      const defaultData = {
        hero: {
          companyName: currentSite?.name || 'Company Name',
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
      };
      setSiteData(defaultData);
    }
  };

  const updateHero = (field, value) => {
    setSiteData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateServices = (field, value) => {
    setSiteData(prev => ({
      ...prev,
      services: { ...prev.services, [field]: value }
    }));
  };

  const updateServiceItem = (index, field, value) => {
    setSiteData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        list: prev.services.list.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addService = () => {
    setSiteData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        list: [...prev.services.list, { icon: '✨', title: 'New Service', description: 'Description' }]
      }
    }));
  };

  const removeService = (index) => {
    setSiteData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        list: prev.services.list.filter((_, i) => i !== index)
      }
    }));
  };

  const updateContacts = (field, value) => {
    setSiteData(prev => ({
      ...prev,
      contacts: { ...prev.contacts, [field]: value }
    }));
  };

  const updateSocial = (field, value) => {
    setSiteData(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value }
    }));
  };

  // SEO обновления
  const updateSEO = (field, value) => {
    const updatedSEO = { ...seoData, [field]: value };
    setSeoData(updatedSEO);

    // Сохранить в localStorage
    if (currentSite) {
      saveSEOData(currentSite.id, updatedSEO);
      // Пересчитать score
      const score = calculateSEOScore(updatedSEO, siteData);
      setSeoScore(score);
    }
  };

  const generateAISEO = () => {
    if (!currentSite || !siteData) return;

    const generatedSEO = generateSEOFromSite(siteData);
    setSeoData(generatedSEO);
    saveSEOData(currentSite.id, generatedSEO);

    // Пересчитать score
    const score = calculateSEOScore(generatedSEO, siteData);
    setSeoScore(score);

    // Показать уведомление
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Обработка AI предложений
  const handleAISuggestion = (suggestion) => {
    console.log('Applying AI suggestion:', suggestion);

    switch (suggestion.type) {
      // Hero секция
      case 'hero_stat':
      case 'hero_tagline':
        if (suggestion.data.field === 'description') {
          updateHero('description', suggestion.data.newValue);
        } else if (suggestion.data.field === 'tagline') {
          updateHero('tagline', suggestion.data.newValue);
        } else if (suggestion.data.field === 'companyName') {
          updateHero('companyName', suggestion.data.newValue);
        }
        break;

      // Services секция
      case 'service':
        addService({
          title: suggestion.data.title,
          description: suggestion.data.description,
          category: suggestion.data.category,
          active: true
        });
        break;

      // Contacts секция
      case 'contact_method':
        if (suggestion.data.field && suggestion.data.value) {
          updateContacts(suggestion.data.field, suggestion.data.value);
        }
        break;

      // Social секция
      case 'social_platform':
        if (suggestion.data.platform && suggestion.data.url) {
          updateSocial(suggestion.data.platform, suggestion.data.url);
        }
        break;

      // SEO Meta секция
      case 'seo_meta':
        if (suggestion.data.field && suggestion.data.newValue) {
          const newSeoData = { ...seoData };
          newSeoData[suggestion.data.field] = suggestion.data.newValue;
          setSeoData(newSeoData);

          // Пересчитать SEO Score
          const score = calculateSEOScore(newSeoData, siteData);
          setSeoScore(score);
        }
        break;

      // Statistics секция
      case 'statistic':
        if (suggestion.data.value && suggestion.data.label) {
          const newStats = { ...siteData.stats };
          if (!newStats.items) newStats.items = [];

          newStats.items.push({
            value: suggestion.data.value,
            label: suggestion.data.label,
            icon: suggestion.data.icon || '📊'
          });

          setSiteData(prev => ({ ...prev, stats: newStats }));
        }
        break;

      case 'benefit':
      case 'case_study':
      case 'testimonial':
        console.log('Suggestion type not yet implemented:', suggestion.type);
        break;

      default:
        console.log('Unknown suggestion type:', suggestion.type);
    }

    // Триггерим автосохранение через useEffect
    setPendingAISave(true);

    // Закрываем модальное окно AI после применения
    setShowAI(false);
  };

  // Обработчики дизайна
  const handleColorSchemeChange = (schemeName) => {
    const newSettings = {
      ...designSettings,
      colorScheme: schemeName
    };
    setDesignSettings(newSettings);
    
    // Сохранить в активный сайт
    if (currentSite) {
      updateSite(currentSite.id, { 
        design: newSettings 
      });
    }
    
    applyColorScheme(schemeName);
    setPreviewKey(prev => prev + 1); // Обновить iframe
    window.dispatchEvent(new Event('designSettingsUpdated'));
  };

  const handleLandingTypeChange = (landingType) => {
    const newSettings = {
      ...designSettings,
      activeLanding: landingType
    };
    setDesignSettings(newSettings);
    
    // Сохранить в активный сайт
    if (currentSite) {
      updateSite(currentSite.id, { 
        design: newSettings 
      });
    }
    
    setPreviewKey(prev => prev + 1); // Обновить iframe
    window.dispatchEvent(new Event('designSettingsUpdated'));
  };

  const isLayout2 = designSettings.activeLanding === 'client';
  
  const sections = [
    { id: 'hero', label: isLayout2 ? 'Main Hero & Showcase' : 'Main Hero / Title' },
    { id: 'services', label: 'Services Section' },
    { id: 'domain', label: 'Custom Domain' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'stats', label: 'Statistics & Achievements' },
    { id: 'testimonials', label: 'Client Testimonials' },
    { id: 'contacts', label: 'Contacts Section' },
    { id: 'social', label: 'Social Networks' },
    { id: 'visual', label: 'Visual Design' },
  ];

  if (!siteData) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  // Visual Design - fullscreen режим отключён; секция рендерится инлайн ниже
  if (false && activeSection === 'visual') {
    return (
      <div className="fixed inset-0 z-50 flex gap-0 bg-black">
        {/* Left: Live Preview - занимает всю левую часть */}
        <div className="flex-1 bg-gray-950 overflow-hidden flex flex-col">
          <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-gray-400" />
              <span className="text-sm font-medium">Живое превью</span>
              <span className="text-xs text-gray-500 ml-2">
                {currentSite?.url || '/'}
              </span>
            </div>
            <div className="flex gap-2">
              <a
                href={currentSite?.url || '/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
              >
                Открыть в новой вкладке →
              </a>
            </div>
          </div>
          <iframe
            key={`preview-${previewKey}-${currentSite?.id}-${designSettings.colorScheme}`}
            src={currentSite?.url || '/'}
            className="w-full flex-1"
            title="Live Preview"
          />
        </div>

        {/* Right: Controls */}
        <div className="w-96 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Настройки дизайна</h3>
            <button
              onClick={() => setActiveSection('hero')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Закрыть превью"
            >
              <X size={20} />
            </button>
          </div>

          {/* Landing Type */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Monitor size={18} className="text-blue-400" />
              <h4 className="text-sm font-semibold">Тип лендинга</h4>
            </div>
            
            <div className="space-y-2">
              {Object.entries(LANDING_TYPES).map(([key, landing]) => (
                <div
                  key={key}
                  onClick={() => handleLandingTypeChange(key)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    designSettings.activeLanding === key
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{landing.name}</p>
                      <p className="text-xs text-gray-500">{landing.path}</p>
                    </div>
                    {designSettings.activeLanding === key && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette size={18} className="text-purple-400" />
              <h4 className="text-sm font-semibold">Цветовая палитра</h4>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                <div
                  key={key}
                  onClick={() => handleColorSchemeChange(key)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    designSettings.colorScheme === key
                      ? 'border-purple-500 ring-2 ring-purple-500 ring-opacity-30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  style={{ backgroundColor: scheme.background }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium" style={{ color: scheme.text }}>
                      {scheme.name}
                    </p>
                    {designSettings.colorScheme === key && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scheme.primary }} />
                    )}
                  </div>

                  {/* Color Dots */}
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-md"
                      style={{ backgroundColor: scheme.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded-md"
                      style={{ backgroundColor: scheme.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded-md"
                      style={{ backgroundColor: scheme.accent }}
                      title="Accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-3">
            <p className="text-xs text-blue-400">
              ✨ Изменения применяются мгновенно в превью
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] -m-6 md:-m-8">
      {/* Left Panel - Edit Forms */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-black">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold mb-1">Quick Edit</h1>
                <p className="text-gray-500 text-xs">
                  Редактируйте контент в реальном времени
                </p>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="space-y-5">
              {/* Main Hero - всегда показываем */}
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-gray-400 mb-3">Main Hero</h2>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-500">
                    Название компании
                    <HelpTooltip
                      content="This is the main name that appears at the top of your website. Keep it short and memorable."
                      position="right"
                    />
                  </label>
                  <input
                    type="text"
                    value={siteData.hero.companyName}
                    onChange={(e) => updateHero('companyName', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-500">
                    Слоган
                    <HelpTooltip
                      content="A catchy tagline that describes what you do. Aim for 5-10 words that capture your value."
                      position="right"
                    />
                  </label>
                  <input
                    type="text"
                    value={siteData.hero.tagline}
                    onChange={(e) => updateHero('tagline', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-gray-500">
                    Описание
                    <HelpTooltip
                      content="A brief description of your business. Explain what you do and why customers should choose you. 2-3 sentences work best."
                      position="right"
                    />
                  </label>
                  <textarea
                    value={siteData.hero.description}
                    onChange={(e) => updateHero('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {siteData.hero.description.length} / 500 символов
                  </p>
                </div>

                {/* AI Suggestions для текста */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowAI(true)}
                    className="w-full px-4 py-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Sparkles size={16} />
                    AI улучшить текст
                  </button>
                  <p className="text-xs text-gray-600 mt-1.5 text-center">
                    AI предложит улучшения для названия, слогана и описания
                  </p>
                </div>
              </div>

              {/* Content Showcase Settings - только для Layout 2 */}
              {isLayout2 && (
                <>
                  <div className="border-t border-gray-800/50 pt-5">
                    <h2 className="text-sm font-medium text-gray-400 mb-3">Content Showcase Settings</h2>
                    <p className="text-xs text-gray-500 mb-4">
                      Choose which sections to display in the left panel carousel (Layout 2)
                    </p>

                    <div className="space-y-3 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                      <h3 className="text-sm font-medium mb-2 text-gray-400">Enabled Sections</h3>

                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded hover:bg-gray-800/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showAbout !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showAbout: e.target.checked }
                          }))}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium">About / Hero</p>
                          <p className="text-xs text-gray-600">Company name, tagline, description</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded hover:bg-gray-800/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showPortfolio !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showPortfolio: e.target.checked }
                          }))}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium">Portfolio</p>
                          <p className="text-xs text-gray-600">Portfolio gallery showcase</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded hover:bg-gray-800/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showServices !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showServices: e.target.checked }
                          }))}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium">Services</p>
                          <p className="text-xs text-gray-600">List of your services</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded hover:bg-gray-800/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showStats !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showStats: e.target.checked }
                          }))}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium">Statistics</p>
                          <p className="text-xs text-gray-600">Achievements and numbers</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded hover:bg-gray-800/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showTestimonials !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showTestimonials: e.target.checked }
                          }))}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium">Testimonials</p>
                          <p className="text-xs text-gray-600">Client reviews and feedback</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded hover:bg-gray-800/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showContacts !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showContacts: e.target.checked }
                          }))}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium">Contacts</p>
                          <p className="text-xs text-gray-600">Contact information</p>
                        </div>
                      </label>

                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-xs">
                        <p className="text-blue-400 font-medium mb-1">💡 Tip</p>
                        <p className="text-gray-400">
                          These sections will cycle automatically in the left panel every 5 seconds. Enable only the sections you want to showcase.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Visual Design - inline controls */}
          {activeSection === 'visual' && (
            <div className="space-y-5">
              <h2 className="text-sm font-medium text-gray-400 mb-3">Visual Design</h2>

              {/* Live preview link */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Eye size={16} className="text-gray-400" />
                  <span>Live preview:</span>
                  <a href={currentSite?.url || '/'} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    {currentSite?.url || '/'}
                  </a>
                </div>
                <button
                  onClick={() => setPreviewKey(prev => prev + 1)}
                  className="px-3 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded hover:bg-gray-700"
                >
                  Refresh Preview
                </button>
              </div>

              {/* Inline Live Preview */}
              <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
                <iframe
                  key={`inline-preview-${previewKey}-${currentSite?.id}-${designSettings.colorScheme}-${designSettings.activeLanding}`}
                  src={currentSite?.url || '/'}
                  title="Live Preview"
                  className="w-full h-[560px]"
                />
              </div>

              {/* Landing Type */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Monitor size={18} className="text-blue-400" />
                  <h4 className="text-sm font-semibold">Тип лендинга</h4>
                  <HelpTooltip
                    content="Choose between two layout styles: Layout 1 (traditional chat interface) or Layout 2 (split-screen with content carousel)."
                    position="right"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(LANDING_TYPES).map(([key, landing]) => (
                    <button
                      key={key}
                      onClick={() => handleLandingTypeChange(key)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        designSettings.activeLanding === key
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                      }`}
                    >
                      <p className="text-sm font-medium">{landing.name}</p>
                      <p className="text-xs text-gray-500">{landing.path}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette size={18} className="text-purple-400" />
                  <h4 className="text-sm font-semibold">Цветовая палитра</h4>
                  <HelpTooltip
                    content="Select a color scheme for your website. Each theme includes a beautiful gradient background and coordinated colors."
                    position="right"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                    <button
                      key={key}
                      onClick={() => handleColorSchemeChange(key)}
                      className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        designSettings.colorScheme === key
                          ? 'border-white ring-4 ring-white/20 scale-105 shadow-2xl'
                          : 'border-gray-700 hover:border-gray-500 hover:scale-105 shadow-lg'
                      }`}
                    >
                      {/* Gradient Background */}
                      <div
                        className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity"
                        style={{ background: scheme.gradient }}
                      />

                      {/* Content */}
                      <div className="relative p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-bold text-white drop-shadow-lg">{scheme.name}</p>
                            <p className="text-xs text-white/80 font-medium">{scheme.category}</p>
                          </div>
                          {designSettings.colorScheme === key && (
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                              <div className="w-2 h-2 rounded-full bg-black" />
                            </div>
                          )}
                        </div>

                        {/* Color Swatches */}
                        <div className="flex gap-1.5">
                          <span
                            className="w-8 h-8 rounded-lg shadow-md border border-white/20"
                            style={{ backgroundColor: scheme.primary }}
                          />
                          <span
                            className="w-8 h-8 rounded-lg shadow-md border border-white/20"
                            style={{ backgroundColor: scheme.secondary }}
                          />
                          <span
                            className="w-8 h-8 rounded-lg shadow-md border border-white/20"
                            style={{ backgroundColor: scheme.accent }}
                          />
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Save / Preview */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (currentSite) updateSite(currentSite.id, { design: designSettings });
                    setSaved(true);
                    setTimeout(() => setSaved(false), 1500);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Design
                </button>
                <a
                  href={currentSite?.url || '/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Open Preview
                </a>
                {saved && <span className="text-sm text-green-400">Saved!</span>}
              </div>
            </div>
          )}

          {/* Favicon Section */}
          {activeSection === 'favicon' && (
            <div className="space-y-5">
              <h2 className="text-sm font-medium text-gray-400 mb-3">Favicon Settings</h2>

              {/* Info Banner */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                <p className="text-xs text-blue-400 leading-relaxed">
                  Your favicon appears in browser tabs. We automatically generate one from your company name, but you can upload a custom image.
                </p>
              </div>

              {/* Current Favicon Preview */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <label className="block text-xs font-medium mb-3 text-gray-500">Current Favicon</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg border-2 border-gray-700 flex items-center justify-center bg-gray-800">
                    {faviconPreview || loadFaviconFromStorage(currentSite?.id) ? (
                      <img
                        src={faviconPreview || loadFaviconFromStorage(currentSite?.id)}
                        alt="Favicon"
                        className="w-12 h-12 rounded"
                      />
                    ) : (
                      <Chrome size={32} className="text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Auto-generated from company name</p>
                    <p className="text-xs text-gray-500">Click "Generate" to create a new one</p>
                  </div>
                </div>
              </div>

              {/* Generate from Letter */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <label className="block text-xs font-medium mb-2 text-gray-500">
                  Generate from Company Name
                  <HelpTooltip
                    content="Creates multiple favicon variations with the first letter of your company name on different gradient backgrounds. Click to generate options."
                    position="right"
                  />
                </label>
                <button
                  onClick={() => {
                    if (!currentSite || !siteData) return;
                    const companyName = siteData.hero?.companyName || 'M';
                    const letter = companyName.charAt(0).toUpperCase();

                    // All available color combinations (24 options)
                    const allColorCombinations = [
                      { name: 'Blue Purple', from: '#3b82f6', to: '#8b5cf6' },
                      { name: 'Purple Pink', from: '#8b5cf6', to: '#ec4899' },
                      { name: 'Emerald Cyan', from: '#10b981', to: '#06b6d4' },
                      { name: 'Orange Yellow', from: '#f97316', to: '#eab308' },
                      { name: 'Red Orange', from: '#ef4444', to: '#f97316' },
                      { name: 'Indigo Purple', from: '#6366f1', to: '#a855f7' },
                      { name: 'Teal Green', from: '#14b8a6', to: '#10b981' },
                      { name: 'Pink Rose', from: '#ec4899', to: '#f43f5e' },
                      { name: 'Lime Green', from: '#84cc16', to: '#22c55e' },
                      { name: 'Violet Fuchsia', from: '#7c3aed', to: '#d946ef' },
                      { name: 'Sky Blue', from: '#0ea5e9', to: '#06b6d4' },
                      { name: 'Amber Orange', from: '#f59e0b', to: '#f97316' },
                      { name: 'Cyan Teal', from: '#06b6d4', to: '#14b8a6' },
                      { name: 'Fuchsia Pink', from: '#d946ef', to: '#ec4899' },
                      { name: 'Blue Cyan', from: '#3b82f6', to: '#06b6d4' },
                      { name: 'Green Emerald', from: '#22c55e', to: '#10b981' },
                      { name: 'Red Pink', from: '#ef4444', to: '#ec4899' },
                      { name: 'Purple Indigo', from: '#a855f7', to: '#6366f1' },
                      { name: 'Yellow Lime', from: '#eab308', to: '#84cc16' },
                      { name: 'Rose Red', from: '#f43f5e', to: '#ef4444' },
                      { name: 'Indigo Blue', from: '#6366f1', to: '#3b82f6' },
                      { name: 'Teal Cyan', from: '#14b8a6', to: '#06b6d4' },
                      { name: 'Orange Amber', from: '#f97316', to: '#f59e0b' },
                      { name: 'Pink Fuchsia', from: '#ec4899', to: '#d946ef' }
                    ];

                    // Shuffle and pick 8 random combinations each time
                    const shuffled = [...allColorCombinations].sort(() => Math.random() - 0.5);
                    const selectedCombinations = shuffled.slice(0, 8);

                    const variations = selectedCombinations.map(combo => ({
                      name: combo.name,
                      dataUrl: generateLetterFavicon(companyName, combo.from, combo.to),
                      from: combo.from,
                      to: combo.to
                    }));

                    setFaviconVariations(variations);
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  {faviconVariations.length > 0 ? 'Generate New Variations' : 'Generate Letter Favicon'}
                </button>
                {faviconVariations.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Click to generate 8 new random color combinations
                  </p>
                )}
              </div>

              {faviconVariations.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <label className="block text-xs font-medium mb-3 text-gray-500">
                    Choose a variation (click to apply)
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {faviconVariations.map((variation, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setFaviconPreview(variation.dataUrl);
                          saveFaviconToStorage(currentSite.id, variation.dataUrl);
                          updateFavicon(variation.dataUrl);
                          setSaved(true);
                          setTimeout(() => setSaved(false), 1500);
                        }}
                        className="group relative aspect-square border-2 border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all hover:scale-105"
                        title={variation.name}
                      >
                        <img
                          src={variation.dataUrl}
                          alt={variation.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                          <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            Apply
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Custom (Hardcoded for presentation) */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <label className="block text-xs font-medium mb-2 text-gray-500">
                  Upload Custom Image
                  <HelpTooltip
                    content="Upload your own favicon image. Recommended size: 32x32 or 64x64 pixels, PNG format."
                    position="right"
                  />
                </label>
                <label className="block border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-400 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-600">PNG, JPG or ICO (max. 1MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const dataUrl = event.target.result;
                          setFaviconPreview(dataUrl);
                          saveFaviconToStorage(currentSite?.id, dataUrl);
                          updateFavicon(dataUrl);
                          setSaved(true);
                          setTimeout(() => setSaved(false), 1500);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <p className="text-xs text-yellow-500 mt-3">
                    (Presentation only - upload saves to localStorage)
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Services Section - NEW MANAGER */}
          {activeSection === 'services' && (
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3">Управление услугами</h2>
              <ServicesManager />
            </div>
          )}

          {/* Custom Domain Section */}
          {activeSection === 'domain' && (
            <div className="space-y-5">
              <h2 className="text-sm font-medium text-gray-400 mb-3">Custom Domain</h2>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-xs text-yellow-400">
                  Подключите ваш собственный домен. Это демонстрационный интерфейс (hardcoded) для презентации, сохранение идёт в текущий активный сайт.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Domain input */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5 space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-gray-500">Ваш домен</label>
                    <input
                      type="text"
                      value={currentSite?.customDomain || ''}
                      onChange={(e) => {
                        if (!currentSite) return;
                        updateSite(currentSite.id, { customDomain: e.target.value });
                      }}
                      placeholder="yourdomain.com"
                      className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {currentSite?.customDomain ? 'DNS not verified yet' : 'No domain connected'}
                  </div>

                  <button
                    onClick={() => alert('DNS verification simulated for demo')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Verify DNS
                  </button>
                </div>

                {/* DNS records */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">DNS Records</h3>
                  <p className="text-sm text-gray-400 mb-4">Добавьте записи у вашего регистратора доменов:</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded p-3">
                      <div>
                        <p className="font-medium">A</p>
                        <p className="text-gray-400">@ → 76.76.21.21</p>
                      </div>
                      <button className="px-2 py-1 text-xs border border-gray-700 rounded hover:bg-gray-800" onClick={() => navigator.clipboard.writeText('76.76.21.21')}>Copy</button>
                    </div>
                    <div className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded p-3">
                      <div>
                        <p className="font-medium">CNAME</p>
                        <p className="text-gray-400">www → cname.vercel-dns.com</p>
                      </div>
                      <button className="px-2 py-1 text-xs border border-gray-700 rounded hover:bg-gray-800" onClick={() => navigator.clipboard.writeText('cname.vercel-dns.com')}>Copy</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-400">
                • Изменения DNS могут применяться до 24 часов.\n<br />
                • После добавления записей нажмите Verify DNS.
              </div>
            </div>
          )}

          {/* Portfolio Section - embedded existing manager */}
          {activeSection === 'portfolio' && (
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3">Портфолио</h2>
              <div className="mb-4 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                <p className="text-xs text-blue-400">Управляйте фотографиями, видео, кейсами и внешними ссылками вашего сайта</p>
              </div>
              <Portfolio />
            </div>
          )}

          {/* Contacts Section */}
          {activeSection === 'contacts' && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-gray-400 mb-3">Contacts Section</h2>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">Заголовок</label>
                <input
                  type="text"
                  value={siteData.contacts.heading}
                  onChange={(e) => updateContacts('heading', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  📞 Телефон
                  <HelpTooltip
                    content="Your business phone number. Visitors can click to call you directly from the website."
                    position="right"
                  />
                </label>
                <input
                  type="tel"
                  value={siteData.contacts.phone}
                  onChange={(e) => updateContacts('phone', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  📧 Email
                  <HelpTooltip
                    content="Your business email address. Visitors can click to send you an email."
                    position="right"
                  />
                </label>
                <input
                  type="email"
                  value={siteData.contacts.email}
                  onChange={(e) => updateContacts('email', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">📍 Адрес</label>
                <input
                  type="text"
                  value={siteData.contacts.address}
                  onChange={(e) => updateContacts('address', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">🌐 Website</label>
                <input
                  type="url"
                  value={siteData.contacts.website}
                  onChange={(e) => updateContacts('website', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>
            </div>
          )}

          {/* Statistics */}
          {activeSection === 'stats' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-400">Statistics & Achievements</h2>
                <button
                  onClick={() => {
                    const newStats = {...siteData.stats};
                    if (!newStats.items) newStats.items = [];
                    newStats.items.push({ value: '', label: '', icon: '📊' });
                    setSiteData(prev => ({ ...prev, stats: newStats }));
                  }}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium transition-colors"
                >
                  + Add Statistic
                </button>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={siteData.stats?.enabled ?? true}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      stats: { ...prev.stats, enabled: e.target.checked }
                    }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Show statistics section</span>
                </label>
              </div>

              <div className="space-y-2.5">
                {siteData.stats?.items?.map((stat, index) => (
                  <div key={index} className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-gray-500">Value</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = {...siteData.stats};
                              newStats.items[index].value = e.target.value;
                              setSiteData(prev => ({ ...prev, stats: newStats }));
                            }}
                            placeholder="e.g. 500+"
                            className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-gray-500">Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = {...siteData.stats};
                              newStats.items[index].label = e.target.value;
                              setSiteData(prev => ({ ...prev, stats: newStats }));
                            }}
                            placeholder="e.g. Projects Completed"
                            className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newStats = {...siteData.stats};
                          newStats.items.splice(index, 1);
                          setSiteData(prev => ({ ...prev, stats: newStats }));
                        }}
                        className="mt-7 p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(!siteData.stats?.items || siteData.stats.items.length === 0) && (
                <div className="text-center py-8 text-gray-500 bg-gray-900 border border-gray-800 rounded-lg">
                  No statistics added yet. Click "+ Add Statistic" to add one.
                </div>
              )}
            </div>
          )}

          {/* Testimonials */}
          {activeSection === 'testimonials' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-400">Client Testimonials</h2>
                <button
                  onClick={() => {
                    const newTestimonials = {...siteData.testimonials};
                    if (!newTestimonials.items) newTestimonials.items = [];
                    newTestimonials.items.push({
                      id: `testimonial_${Date.now()}`,
                      name: '',
                      role: '',
                      text: '',
                      rating: 5
                    });
                    setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                  }}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium transition-colors"
                >
                  + Add Testimonial
                </button>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={siteData.testimonials?.enabled ?? true}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      testimonials: { ...prev.testimonials, enabled: e.target.checked }
                    }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Show testimonials section</span>
                </label>
              </div>

              <div className="space-y-2.5">
                {siteData.testimonials?.items?.map((testimonial, index) => (
                  <div key={testimonial.id} className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2.5">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-500">Name</label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => {
                                const newTestimonials = {...siteData.testimonials};
                                newTestimonials.items[index].name = e.target.value;
                                setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                              }}
                              placeholder="e.g. John Doe"
                              className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-500">Role / Company</label>
                            <input
                              type="text"
                              value={testimonial.role}
                              onChange={(e) => {
                                const newTestimonials = {...siteData.testimonials};
                                newTestimonials.items[index].role = e.target.value;
                                setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                              }}
                              placeholder="e.g. CEO at Company"
                              className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-gray-500">Testimonial Text</label>
                          <textarea
                            value={testimonial.text}
                            onChange={(e) => {
                              const newTestimonials = {...siteData.testimonials};
                              newTestimonials.items[index].text = e.target.value;
                              setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                            }}
                            rows={3}
                            placeholder="Client's feedback..."
                            className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5 text-gray-500">Rating (1-5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={testimonial.rating}
                            onChange={(e) => {
                              const newTestimonials = {...siteData.testimonials};
                              newTestimonials.items[index].rating = parseInt(e.target.value);
                              setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                            }}
                            className="w-24 px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newTestimonials = {...siteData.testimonials};
                          newTestimonials.items.splice(index, 1);
                          setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(!siteData.testimonials?.items || siteData.testimonials.items.length === 0) && (
                <div className="text-center py-8 text-gray-500 bg-gray-900 border border-gray-800 rounded-lg">
                  No testimonials added yet. Click "+ Add Testimonial" to add one.
                </div>
              )}
            </div>
          )}

          {/* Social Networks */}
          {activeSection === 'social' && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-gray-400 mb-3">Social Networks</h2>

              <div className="space-y-2.5">
                {Object.entries(siteData.social).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="block text-xs font-medium mb-1.5 text-gray-500 capitalize">
                      {platform === 'twitter' ? 'X (Twitter)' : platform}
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateSocial(platform, e.target.value)}
                      placeholder={`https://${platform}.com/...`}
                      className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO - Meta Tags */}
          {activeSection === 'seo-meta' && seoData && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-400">Meta Теги</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Оптимизация для поисковых систем</p>
                </div>
                <button
                  onClick={generateAISEO}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2 font-medium"
                >
                  <Zap size={16} />
                  Генерировать AI
                </button>
              </div>

              {/* SEO Score */}
              {seoScore && (
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BarChart size={20} className="text-orange-400" />
                      <h3 className="font-semibold">SEO Score</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold text-orange-400">{seoScore.score}</div>
                      <div className="text-gray-400">/100</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                      style={{ width: `${seoScore.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Оценка: {seoScore.grade}</p>

                  {seoScore.issues.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-orange-500/20">
                      <p className="text-xs font-semibold text-orange-400 mb-1">Проблемы:</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {seoScore.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  Page Title
                  <HelpTooltip content="Заголовок страницы в поисковой выдаче. Оптимально: 30-60 символов" position="right" />
                </label>
                <input
                  type="text"
                  value={seoData.title || ''}
                  onChange={(e) => updateSEO('title', e.target.value)}
                  placeholder="Название компании - Слоган"
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50"
                  maxLength={60}
                />
                <p className="text-xs text-gray-600 mt-1">{seoData.title?.length || 0} / 60 символов</p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  Meta Description
                  <HelpTooltip content="Описание страницы в поисковой выдаче. Оптимально: 120-160 символов" position="right" />
                </label>
                <textarea
                  value={seoData.description || ''}
                  onChange={(e) => updateSEO('description', e.target.value)}
                  placeholder="Краткое описание вашего бизнеса..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none"
                  maxLength={160}
                />
                <p className="text-xs text-gray-600 mt-1">{seoData.description?.length || 0} / 160 символов</p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  Keywords
                  <HelpTooltip content="Ключевые слова через запятую. Добавляются автоматически из ваших услуг" position="right" />
                </label>
                <input
                  type="text"
                  value={seoData.keywords || ''}
                  onChange={(e) => updateSEO('keywords', e.target.value)}
                  placeholder="услуга 1, услуга 2, услуга 3"
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  Author
                </label>
                <input
                  type="text"
                  value={seoData.author || ''}
                  onChange={(e) => updateSEO('author', e.target.value)}
                  placeholder="Название компании"
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50"
                />
              </div>
            </div>
          )}

          {/* SEO - Content */}
          {activeSection === 'seo-content' && seoData && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-400">SEO Контент</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Структурированные данные и настройки</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded">AI</span>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-400">
                  💡 Schema.org данные генерируются автоматически на основе вашей контактной информации и услуг
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Canonical URL
                  <HelpTooltip content="Основной URL вашего сайта для поисковиков" position="right" />
                </label>
                <input
                  type="url"
                  value={seoData.canonicalUrl || ''}
                  onChange={(e) => updateSEO('canonicalUrl', e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Robots
                  <HelpTooltip content="Правила индексации для поисковых роботов" position="right" />
                </label>
                <select
                  value={seoData.robots || 'index, follow'}
                  onChange={(e) => updateSEO('robots', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="index, follow">Index, Follow (рекомендуется)</option>
                  <option value="noindex, follow">NoIndex, Follow</option>
                  <option value="index, nofollow">Index, NoFollow</option>
                  <option value="noindex, nofollow">NoIndex, NoFollow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Language
                </label>
                <select
                  value={seoData.language || 'ru'}
                  onChange={(e) => updateSEO('language', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ru">Русский (ru)</option>
                  <option value="en">English (en)</option>
                  <option value="uk">Українська (uk)</option>
                </select>
              </div>
            </div>
          )}

          {/* SEO - Open Graph */}
          {activeSection === 'seo-social' && seoData && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Open Graph</h2>
                <p className="text-sm text-gray-400 mt-1">Как ваш сайт выглядит в соцсетях</p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-sm text-purple-400">
                  ✨ Open Graph теги делают ваши ссылки красивыми в Facebook, Twitter, Telegram и других соцсетях
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  OG Title
                  <HelpTooltip content="Заголовок при репосте в соцсети" position="right" />
                </label>
                <input
                  type="text"
                  value={seoData.ogTitle || ''}
                  onChange={(e) => updateSEO('ogTitle', e.target.value)}
                  placeholder="Название вашей компании"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  OG Description
                  <HelpTooltip content="Описание при репосте в соцсети" position="right" />
                </label>
                <textarea
                  value={seoData.ogDescription || ''}
                  onChange={(e) => updateSEO('ogDescription', e.target.value)}
                  placeholder="Краткое описание..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.ogDescription?.length || 0} / 200 символов</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  OG Image URL
                  <HelpTooltip content="Картинка при репосте в соцсети (1200x630px)" position="right" />
                </label>
                <input
                  type="url"
                  value={seoData.ogImage || ''}
                  onChange={(e) => updateSEO('ogImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">Рекомендуемый размер: 1200x630px</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  OG Type
                </label>
                <select
                  value={seoData.ogType || 'website'}
                  onChange={(e) => updateSEO('ogType', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="website">Website</option>
                  <option value="article">Article</option>
                  <option value="business.business">Business</option>
                </select>
              </div>
            </div>
          )}

          {/* Auto-save indicator - компактный */}
          <div className="mt-6 pt-4 border-t border-gray-800/50">
            <div className="flex items-center justify-between">
              {/* Auto-save status */}
              <div className="flex items-center gap-2">
                {saved ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Изменения сохранены</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">Автосохранение активно</span>
                  </>
                )}
              </div>

              {/* Action button - только превью */}
              <a
                href="/2"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300"
                title="Открыть превью сайта"
              >
                <ExternalLink size={14} />
                <span>Превью</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Grouped Sections (Desktop) */}
      <div className="hidden lg:block lg:w-72 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-medium text-sm mb-0.5">Settings</h3>
          <p className="text-xs text-gray-600">Select section</p>
        </div>

        <GroupedTabs
          activeSection={activeSection}
          onTabChange={setActiveSection}
        />
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Drawer */}
          <div className="lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto animate-slideInRight shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Settings</h3>
                <p className="text-xs text-gray-600">Select section</p>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4">
              <GroupedTabs
                activeSection={activeSection}
                onTabChange={(section) => {
                  setActiveSection(section);
                  setShowMobileMenu(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* AI Suggestions Modal */}
      {showAI && (
        <AISuggestions
          sectionType={activeSection}
          currentData={siteData}
          onApplySuggestion={handleAISuggestion}
          onClose={() => setShowAI(false)}
        />
      )}

      {/* Welcome Tour Modal */}
      {showWelcomeTour && (
        <WelcomeTour
          onClose={() => setShowWelcomeTour(false)}
          onNavigate={(target) => {
            setActiveSection(target);
            setShowWelcomeTour(false);
          }}
        />
      )}
    </div>
  );
}

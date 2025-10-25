import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, RefreshCw, Sparkles, Palette, Monitor, Eye, X, Zap, BarChart } from 'lucide-react';
import { getActiveSite, updateSite } from '../../utils/sitesStorage';
import { getDesignSettings, saveDesignSettings, COLOR_SCHEMES, LANDING_TYPES, applyColorScheme } from '../../utils/designStorage';
import { getSEOData, saveSEOData, generateSEOFromSite, calculateSEOScore } from '../../utils/seoStorage';
import ServicesManager from '../../components/dashboard/ServicesManager';
import Portfolio from './Portfolio';
import AISuggestions from '../../components/dashboard/AISuggestions';
import { HelpTooltip } from '../../components/Tooltip';
import GroupedTabs from '../../components/dashboard/GroupedTabs';

export default function QuickEdit() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentSite, setCurrentSite] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [designSettings, setDesignSettings] = useState(getDesignSettings());
  const [previewKey, setPreviewKey] = useState(0);
  const [pendingAISave, setPendingAISave] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [seoScore, setSeoScore] = useState(null);

  // Check if first login
  useEffect(() => {
    const isFirstLogin = localStorage.getItem('progressit_first_login');
    if (isFirstLogin === 'true') {
      setShowWelcome(true);
      localStorage.removeItem('progressit_first_login');
    }
  }, []);

  // Загрузить данные при монтировании
  useEffect(() => {
    loadSiteData();
    
    const handleActiveSiteChange = () => {
      loadSiteData();
    };
    
    window.addEventListener('activeSiteChanged', handleActiveSiteChange);
    window.addEventListener('sitesUpdated', handleActiveSiteChange);
    
    return () => {
      window.removeEventListener('activeSiteChanged', handleActiveSiteChange);
      window.removeEventListener('sitesUpdated', handleActiveSiteChange);
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

  const loadSiteData = () => {
    const site = getActiveSite();
    if (site) {
      setCurrentSite(site);
      setSiteData(site.data);

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

      // Старые типы (обратная совместимость)
      case 'statistic':
        if (suggestion.data.field === 'description') {
          updateHero('description', suggestion.data.newValue);
        } else if (suggestion.data.field === 'tagline') {
          updateHero('tagline', suggestion.data.newValue);
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
    <div className="flex h-[calc(100vh-100px)] -m-6 md:-m-8">
      {/* Left Panel - Edit Forms */}
      <div className="flex-1 p-6 overflow-y-auto bg-black">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-xl font-semibold mb-1">Quick Edit</h1>
            <p className="text-gray-500 text-xs">
              Редактируйте контент в реальном времени
            </p>
          </div>

          {/* Welcome Banner for First-Time Users */}
          {showWelcome && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg relative">
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                  <Sparkles size={14} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1.5">Welcome to Quick Edit!</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-2">
                    Customize your site - edit text, change colors, manage services. All changes appear in real-time.
                  </p>
                  <p className="text-blue-400 text-xs">
                    Use the tabs below to navigate
                  </p>
                </div>
              </div>
            </div>
          )}

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
                  <label className="block text-sm font-medium mb-2">
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
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {siteData.hero.description.length} / 500 символов
                  </p>
                </div>
              </div>

              {/* Content Showcase Settings - только для Layout 2 */}
              {isLayout2 && (
                <>
                  <div className="border-t border-gray-800 pt-6">
                    <h2 className="text-xl font-semibold mb-4">Content Showcase Settings</h2>
                    <p className="text-sm text-gray-400 mb-6">
                      Choose which sections to display in the left panel carousel (Layout 2)
                    </p>
                    
                    <div className="space-y-4 bg-gray-900 p-5 rounded-lg border border-gray-800">
                      <h3 className="font-semibold mb-3">Enabled Sections</h3>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showAbout !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showAbout: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                        <div>
                          <p className="font-medium">About / Hero</p>
                          <p className="text-xs text-gray-500">Company name, tagline, description</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showPortfolio !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showPortfolio: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                        <div>
                          <p className="font-medium">Portfolio</p>
                          <p className="text-xs text-gray-500">Portfolio gallery showcase</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showServices !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showServices: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                        <div>
                          <p className="font-medium">Services</p>
                          <p className="text-xs text-gray-500">List of your services</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showStats !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showStats: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                        <div>
                          <p className="font-medium">Statistics</p>
                          <p className="text-xs text-gray-500">Achievements and numbers</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showTestimonials !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showTestimonials: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                        <div>
                          <p className="font-medium">Testimonials</p>
                          <p className="text-xs text-gray-500">Client reviews and feedback</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded hover:bg-gray-800 transition-colors">
                        <input
                          type="checkbox"
                          checked={siteData.showcase?.showContacts !== false}
                          onChange={(e) => setSiteData(prev => ({
                            ...prev,
                            showcase: { ...prev.showcase, showContacts: e.target.checked }
                          }))}
                          className="w-5 h-5"
                        />
                        <div>
                          <p className="font-medium">Contacts</p>
                          <p className="text-xs text-gray-500">Contact information</p>
                        </div>
                      </label>
                      
                      <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4 text-sm">
                        <p className="text-blue-400 font-medium mb-1">💡 Tip</p>
                        <p className="text-gray-300">
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
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Visual Design</h2>

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

          {/* Services Section - NEW MANAGER */}
          {activeSection === 'services' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Управление услугами</h2>
              <div className="mb-4 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-sm text-blue-400">
                  💡 Теперь вы можете управлять до 1000+ услуг с поиском, фильтрами и пагинацией.
                </p>
              </div>
              <ServicesManager />
            </div>
          )}

          {/* Custom Domain Section */}
          {activeSection === 'domain' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Custom Domain</h2>

              <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-4">
                <p className="text-sm text-yellow-400">
                  Подключите ваш собственный домен. Это демонстрационный интерфейс (hardcoded) для презентации, сохранение идёт в текущий активный сайт.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Domain input */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ваш домен</label>
                    <input
                      type="text"
                      value={currentSite?.customDomain || ''}
                      onChange={(e) => {
                        if (!currentSite) return;
                        updateSite(currentSite.id, { customDomain: e.target.value });
                      }}
                      placeholder="yourdomain.com"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <h2 className="text-xl font-semibold mb-4">Портфолио</h2>
              <div className="mb-4 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
                <p className="text-sm text-blue-400">Управляйте фотографиями, видео, кейсами и внешними ссылками вашего сайта</p>
              </div>
              <Portfolio />
            </div>
          )}

          {/* Contacts Section */}
          {activeSection === 'contacts' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Contacts Section</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Заголовок</label>
                <input
                  type="text"
                  value={siteData.contacts.heading}
                  onChange={(e) => updateContacts('heading', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
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
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
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
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">📍 Адрес</label>
                <input
                  type="text"
                  value={siteData.contacts.address}
                  onChange={(e) => updateContacts('address', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">🌐 Website</label>
                <input
                  type="url"
                  value={siteData.contacts.website}
                  onChange={(e) => updateContacts('website', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Statistics */}
          {activeSection === 'stats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Statistics & Achievements</h2>
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

              <div className="space-y-3">
                {siteData.stats?.items?.map((stat, index) => (
                  <div key={index} className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-2">Value</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = {...siteData.stats};
                              newStats.items[index].value = e.target.value;
                              setSiteData(prev => ({ ...prev, stats: newStats }));
                            }}
                            placeholder="e.g. 500+"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = {...siteData.stats};
                              newStats.items[index].label = e.target.value;
                              setSiteData(prev => ({ ...prev, stats: newStats }));
                            }}
                            placeholder="e.g. Projects Completed"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Client Testimonials</h2>
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

              <div className="space-y-3">
                {siteData.testimonials?.items?.map((testimonial, index) => (
                  <div key={testimonial.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => {
                                const newTestimonials = {...siteData.testimonials};
                                newTestimonials.items[index].name = e.target.value;
                                setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                              }}
                              placeholder="e.g. John Doe"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Role / Company</label>
                            <input
                              type="text"
                              value={testimonial.role}
                              onChange={(e) => {
                                const newTestimonials = {...siteData.testimonials};
                                newTestimonials.items[index].role = e.target.value;
                                setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                              }}
                              placeholder="e.g. CEO at Company"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Testimonial Text</label>
                          <textarea
                            value={testimonial.text}
                            onChange={(e) => {
                              const newTestimonials = {...siteData.testimonials};
                              newTestimonials.items[index].text = e.target.value;
                              setSiteData(prev => ({ ...prev, testimonials: newTestimonials }));
                            }}
                            rows={3}
                            placeholder="Client's feedback..."
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
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
                            className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Social Networks</h2>

              <div className="space-y-3">
                {Object.entries(siteData.social).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {platform === 'twitter' ? 'X (Twitter)' : platform}
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateSocial(platform, e.target.value)}
                      placeholder={`https://${platform}.com/...`}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO - Meta Tags */}
          {activeSection === 'seo-meta' && seoData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Meta Теги</h2>
                  <p className="text-sm text-gray-400 mt-1">Оптимизация для поисковых систем</p>
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
                <label className="block text-sm font-medium mb-2">
                  Page Title
                  <HelpTooltip content="Заголовок страницы в поисковой выдаче. Оптимально: 30-60 символов" position="right" />
                </label>
                <input
                  type="text"
                  value={seoData.title || ''}
                  onChange={(e) => updateSEO('title', e.target.value)}
                  placeholder="Название компании - Слоган"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.title?.length || 0} / 60 символов</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Description
                  <HelpTooltip content="Описание страницы в поисковой выдаче. Оптимально: 120-160 символов" position="right" />
                </label>
                <textarea
                  value={seoData.description || ''}
                  onChange={(e) => updateSEO('description', e.target.value)}
                  placeholder="Краткое описание вашего бизнеса..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">{seoData.description?.length || 0} / 160 символов</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Keywords
                  <HelpTooltip content="Ключевые слова через запятую. Добавляются автоматически из ваших услуг" position="right" />
                </label>
                <input
                  type="text"
                  value={seoData.keywords || ''}
                  onChange={(e) => updateSEO('keywords', e.target.value)}
                  placeholder="услуга 1, услуга 2, услуга 3"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={seoData.author || ''}
                  onChange={(e) => updateSEO('author', e.target.value)}
                  placeholder="Название компании"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* SEO - Content */}
          {activeSection === 'seo-content' && seoData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">SEO Контент</h2>
                  <p className="text-sm text-gray-400 mt-1">Структурированные данные и настройки</p>
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

          {/* Save Button */}
          <div className="mt-6 pt-4 border-t border-gray-800/50 sticky bottom-0 bg-black pb-4">
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                  saved
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Save size={14} />
                {saved ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={() => setShowAI(true)}
                className="px-3 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all flex items-center gap-1.5 text-sm font-medium"
              >
                <Sparkles size={14} />
                AI
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors flex items-center gap-1.5 text-sm"
                title="Reset"
              >
                <RefreshCw size={14} />
              </button>

              <a
                href="/2"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors flex items-center gap-1.5 text-sm"
                title="Preview"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Grouped Sections */}
      <div className="w-72 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-medium text-sm mb-0.5">Settings</h3>
          <p className="text-xs text-gray-600">Select section</p>
        </div>

        <GroupedTabs
          activeSection={activeSection}
          onTabChange={setActiveSection}
        />
      </div>

      {/* AI Suggestions Modal */}
      {showAI && (
        <AISuggestions
          sectionType={activeSection}
          currentData={siteData}
          onApplySuggestion={handleAISuggestion}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Save, ExternalLink, RefreshCw, Sparkles, Palette, Monitor, Eye, X } from 'lucide-react';
import { getActiveSite, updateSite } from '../../utils/sitesStorage';
import { getDesignSettings, saveDesignSettings, COLOR_SCHEMES, LANDING_TYPES, applyColorScheme } from '../../utils/designStorage';
import ServicesManager from '../../components/dashboard/ServicesManager';
import Portfolio from './Portfolio';
import AISuggestions from '../../components/dashboard/AISuggestions';

export default function QuickEdit() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentSite, setCurrentSite] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [designSettings, setDesignSettings] = useState(getDesignSettings());
  const [previewKey, setPreviewKey] = useState(0);
  const [pendingAISave, setPendingAISave] = useState(false);

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Quick Edit Mode</h1>
            <p className="text-gray-400 text-sm">
              Редактируйте контент вашего сайта в реальном времени
            </p>
          </div>

          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              {/* Main Hero - всегда показываем */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Main Hero / Title</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Название компании</label>
                  <input
                    type="text"
                    value={siteData.hero.companyName}
                    onChange={(e) => updateHero('companyName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Слоган</label>
                  <input
                    type="text"
                    value={siteData.hero.tagline}
                    onChange={(e) => updateHero('tagline', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                    <button
                      key={key}
                      onClick={() => handleColorSchemeChange(key)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        designSettings.colorScheme === key
                          ? 'border-purple-500 ring-2 ring-purple-500/30'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      style={{ backgroundColor: scheme.background }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium" style={{ color: scheme.text }}>{scheme.name}</p>
                        {designSettings.colorScheme === key && (
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scheme.primary }} />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span className="w-6 h-6 rounded-md" style={{ backgroundColor: scheme.primary }} />
                        <span className="w-6 h-6 rounded-md" style={{ backgroundColor: scheme.secondary }} />
                        <span className="w-6 h-6 rounded-md" style={{ backgroundColor: scheme.accent }} />
                      </div>
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
                <label className="block text-sm font-medium mb-2">📞 Телефон</label>
                <input
                  type="tel"
                  value={siteData.contacts.phone}
                  onChange={(e) => updateContacts('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">📧 Email</label>
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

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-800 sticky bottom-0 bg-black pb-6">
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  saved 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Save size={18} />
                {saved ? '✓ Сохранено!' : 'Сохранить изменения'}
              </button>
              
              <button
                onClick={() => setShowAI(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2 font-medium"
              >
                <Sparkles size={18} />
                Доработать с AI
              </button>

              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Сбросить
              </button>

              <a
                href="/2"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <ExternalLink size={18} />
                Просмотр
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Sections List */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto">
        <h3 className="font-semibold mb-4 text-lg">All Editable Sections</h3>
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeSection === section.id
                  ? 'bg-blue-500 bg-opacity-10 border-2 border-blue-400 text-blue-400'
                  : 'bg-gray-800 border border-gray-700 hover:bg-gray-750 text-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  Circle,
  Palette,
  Eye,
  Share2,
  Zap,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Bot,
  Globe,
  Image
} from 'lucide-react';
import { getActiveSite, updateSite } from '../../utils/sitesStorage';
import { getDesignSettings, saveDesignSettings, COLOR_SCHEMES, applyColorScheme } from '../../utils/designStorage';
import { SERVICES_CATEGORIES } from '../../data/servicesData';
import { chatWithDeepSeek } from '../../api/deepseek';
import { generateSiteSystemPrompt } from '../../utils/dynamicPrompt';

export default function WelcomeTour({ onClose, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Load current site data
  const [currentSite, setCurrentSite] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [designSettings, setDesignSettings] = useState(getDesignSettings());

  // Mini chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll chat to bottom
  const scrollChatToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize chat greeting when site loads
  useEffect(() => {
    if (currentSite) {
      const companyName = currentSite.data?.hero?.companyName || 'вашей компании';
      setChatMessages([
        {
          role: 'assistant',
          content: `Привет! Я AI-чатбот для ${companyName}. Задайте мне вопрос об услугах, и я отвечу! 👋`
        }
      ]);
    }
  }, [currentSite]);

  // Auto-scroll chat on new messages
  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages, isAiTyping]);

  // Load site data on mount
  useEffect(() => {
    const site = getActiveSite();
    if (site) {
      setCurrentSite(site);
      setSiteData(site.data || {
        hero: { companyName: '', tagline: '', description: '' },
        services: { list: [] },
        contacts: { heading: 'Get in Touch', phone: '', email: '', address: '' }
      });
      if (site.design) {
        setDesignSettings(site.design);
      }
    }
  }, []);

  // Auto-save on data change
  useEffect(() => {
    if (currentSite && siteData) {
      const debounce = setTimeout(() => {
        updateSite(currentSite.id, { data: siteData });
        window.dispatchEvent(new Event('siteDataUpdated'));
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [siteData, currentSite]);

  const updateHero = (field, value) => {
    setSiteData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateContacts = (field, value) => {
    setSiteData(prev => ({
      ...prev,
      contacts: { ...prev.contacts, [field]: value }
    }));
  };

  const addService = () => {
    const newService = {
      id: `service_${Date.now()}`,
      title: '',
      description: '',
      category: SERVICES_CATEGORIES[0],
      active: true
    };

    if (currentSite) {
      const updatedServices = [...(currentSite.services || []), newService];
      updateSite(currentSite.id, { services: updatedServices });

      // Обновляем локальное состояние
      setCurrentSite(prev => ({ ...prev, services: updatedServices }));
    }
  };

  const updateService = (index, field, value) => {
    if (currentSite) {
      const updatedServices = currentSite.services.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      updateSite(currentSite.id, { services: updatedServices });
      setCurrentSite(prev => ({ ...prev, services: updatedServices }));
    }
  };

  const removeService = (index) => {
    if (currentSite) {
      const updatedServices = currentSite.services.filter((_, i) => i !== index);
      updateSite(currentSite.id, { services: updatedServices });
      setCurrentSite(prev => ({ ...prev, services: updatedServices }));
    }
  };

  const handleColorSchemeChange = (schemeName) => {
    const newSettings = {
      ...designSettings,
      colorScheme: schemeName
    };
    setDesignSettings(newSettings);

    if (currentSite) {
      updateSite(currentSite.id, { design: newSettings });
    }

    applyColorScheme(schemeName);
    window.dispatchEvent(new Event('designSettingsUpdated'));
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isAiTyping || !currentSite) return;

    const userMessage = {
      role: 'user',
      content: chatInput
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiTyping(true);

    try {
      // Генерируем системный промпт на основе данных сайта
      const systemPrompt = generateSiteSystemPrompt(
        currentSite.data,
        currentSite.services || []
      );

      // Собираем историю сообщений для API
      const conversationHistory = [
        { role: 'system', content: systemPrompt },
        ...chatMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage.content }
      ];

      // Вызываем реальный API
      const aiResponse = await chatWithDeepSeek(conversationHistory);

      const aiMessage = {
        role: 'assistant',
        content: aiResponse
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте снова! 😔'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  if (!siteData) {
    return null;
  }

  const steps = [
    {
      title: 'Добро пожаловать! 👋',
      description: 'Ваш сайт создан! Теперь давайте настроим его под себя. Это займет всего несколько минут.',
      icon: Sparkles,
      gradient: 'from-blue-500 to-cyan-500',
      type: 'welcome'
    },
    {
      title: 'Редактируйте контент 📝',
      description: 'Используйте меню справа, чтобы изменить текст, добавить услуги и портфолио. Все изменения сохраняются автоматически.',
      icon: Palette,
      gradient: 'from-purple-500 to-pink-500',
      type: 'hero-edit'
    },
    {
      title: 'Добавьте услуги ⚡',
      description: 'Расскажите о своих услугах. Вы можете добавить несколько услуг прямо здесь.',
      icon: Zap,
      gradient: 'from-cyan-500 to-blue-500',
      type: 'services-edit'
    },
    {
      title: 'Настройте дизайн 🎨',
      description: 'Выберите цветовую схему для вашего сайта. Изменения применяются мгновенно!',
      icon: Palette,
      gradient: 'from-orange-500 to-red-500',
      type: 'design-edit'
    },
    {
      title: 'Добавьте контакты 📞',
      description: 'Укажите контактную информацию, чтобы клиенты могли связаться с вами.',
      icon: Share2,
      gradient: 'from-green-500 to-emerald-500',
      type: 'contacts-edit'
    },
    {
      title: 'Поговорите с AI-чатботом 🤖',
      description: 'Попробуйте пообщаться с вашим AI-ассистентом! Он будет отвечать на вопросы посетителей 24/7.',
      icon: MessageCircle,
      gradient: 'from-blue-500 to-purple-500',
      type: 'chat-demo'
    },
    {
      title: 'Готово! 🚀',
      description: 'Вы готовы к работе! Ваш сайт настроен и готов к использованию.',
      icon: CheckCircle2,
      gradient: 'from-blue-500 to-purple-500',
      type: 'complete'
    }
  ];

  const checklist = [
    { id: 'hero', label: 'Заполнить Hero секцию', icon: Sparkles, target: 'hero' },
    { id: 'services', label: 'Добавить услуги', icon: Zap, target: 'services' },
    { id: 'design', label: 'Выбрать цветовую схему', icon: Palette, target: 'visual' },
    { id: 'contacts', label: 'Добавить контакты', icon: Share2, target: 'contacts' },
    { id: 'portfolio', label: 'Добавить портфолио', icon: Image, target: 'portfolio' },
    { id: 'preview', label: 'Просмотреть сайт', icon: Eye, action: 'preview' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStep]);
    } else {
      // Last step - close tour
      localStorage.setItem('progressit_tour_completed', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('progressit_tour_completed', 'true');
    onClose();
  };

  const handleAction = (target) => {
    if (onNavigate && target) {
      onNavigate(target);
      handleNext();
    }
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${currentStepData.gradient} rounded-lg flex items-center justify-center`}>
                <StepIcon size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-xs text-gray-400">
                  Шаг {currentStep + 1} из {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${currentStepData.gradient} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 leading-relaxed mb-6">
            {currentStepData.description}
          </p>

          {/* Embedded Forms Based on Step Type */}
          {currentStepData.type === 'hero-edit' && (
            <div className="space-y-4 mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-400">Название компании</label>
                <input
                  type="text"
                  value={siteData.hero?.companyName || ''}
                  onChange={(e) => updateHero('companyName', e.target.value)}
                  placeholder="Введите название вашей компании"
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-400">Слоган</label>
                <input
                  type="text"
                  value={siteData.hero?.tagline || ''}
                  onChange={(e) => updateHero('tagline', e.target.value)}
                  placeholder="Краткое описание вашей деятельности"
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-400">Описание</label>
                <textarea
                  value={siteData.hero?.description || ''}
                  onChange={(e) => updateHero('description', e.target.value)}
                  placeholder="Подробное описание вашей компании и услуг"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none"
                />
              </div>
            </div>
          )}

          {currentStepData.type === 'services-edit' && (
            <div className="space-y-4 mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
              {currentSite?.services?.map((service, index) => (
                <div key={service.id || index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-300">Услуга {index + 1}</h4>
                    <button
                      onClick={() => removeService(index)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-500/10"
                    >
                      ✕ Удалить
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-gray-400">Название *</label>
                      <input
                        type="text"
                        value={service.title || ''}
                        onChange={(e) => updateService(index, 'title', e.target.value)}
                        placeholder="Blockchain Development"
                        className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-gray-400">Категория</label>
                      <select
                        value={service.category || SERVICES_CATEGORIES[0]}
                        onChange={(e) => updateService(index, 'category', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      >
                        {SERVICES_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-gray-400">Описание *</label>
                    <textarea
                      value={service.description || ''}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="Custom blockchain solutions with smart contracts..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`active-${service.id}`}
                      checked={service.active !== false}
                      onChange={(e) => updateService(index, 'active', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
                    />
                    <label htmlFor={`active-${service.id}`} className="text-xs text-gray-400">
                      Активна (отображается на сайте)
                    </label>
                  </div>
                </div>
              ))}

              {(!currentSite?.services || currentSite.services.length === 0) && (
                <div className="text-center py-6 text-gray-500 text-sm">
                  Нет услуг. Добавьте минимум 3 услуги для демонстрации.
                </div>
              )}

              <button
                onClick={addService}
                className="w-full px-4 py-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <span className="text-lg">+</span>
                Добавить услугу
              </button>
            </div>
          )}

          {currentStepData.type === 'design-edit' && (
            <div className="space-y-4 mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <label className="block text-xs font-medium mb-3 text-gray-400">Выберите цветовую схему</label>
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => handleColorSchemeChange(key)}
                    className={`group relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      designSettings.colorScheme === key
                        ? 'border-white ring-2 ring-white/20 scale-105'
                        : 'border-gray-700 hover:border-gray-500 hover:scale-105'
                    }`}
                  >
                    <div
                      className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ background: scheme.gradient }}
                    />
                    <div className="relative p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-white drop-shadow-lg">{scheme.name}</p>
                        {designSettings.colorScheme === key && (
                          <CheckCircle2 size={16} className="text-white" />
                        )}
                      </div>
                      <div className="flex gap-1">
                        {[scheme.primary, scheme.secondary, scheme.accent].map((color, i) => (
                          <span
                            key={i}
                            className="w-6 h-6 rounded shadow-md border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStepData.type === 'contacts-edit' && (
            <div className="mb-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-400 flex items-center gap-2">
                    <Phone size={14} />
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={siteData.contacts?.phone || ''}
                    onChange={(e) => updateContacts('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-400 flex items-center gap-2">
                    <Mail size={14} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={siteData.contacts?.email || ''}
                    onChange={(e) => updateContacts('email', e.target.value)}
                    placeholder="info@company.com"
                    className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-400 flex items-center gap-2">
                    <Phone size={14} />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={siteData.contacts?.whatsapp || ''}
                    onChange={(e) => updateContacts('whatsapp', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </div>

                {/* Telegram */}
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-400 flex items-center gap-2">
                    <Send size={14} />
                    Telegram
                  </label>
                  <input
                    type="text"
                    value={siteData.contacts?.telegram || ''}
                    onChange={(e) => updateContacts('telegram', e.target.value)}
                    placeholder="@username"
                    className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </div>

                {/* Address - Full width */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-2 text-gray-400 flex items-center gap-2">
                    <MapPin size={14} />
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={siteData.contacts?.address || ''}
                    onChange={(e) => updateContacts('address', e.target.value)}
                    placeholder="г. Москва, ул. Примерная, д. 1"
                    className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Chat Demo */}
          {currentStepData.type === 'chat-demo' && (
            <div className="mb-6 bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-700 text-gray-100 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isAiTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-700 px-4 py-3 rounded-xl rounded-bl-none">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-700 p-3 bg-gray-900/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isAiTyping) {
                        e.preventDefault();
                        handleChatSend();
                      }
                    }}
                    placeholder="Задайте вопрос AI-чатботу..."
                    disabled={isAiTyping}
                    className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleChatSend}
                    disabled={!chatInput.trim() || isAiTyping}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Final step - View Site Button */}
          {currentStep === steps.length - 1 && (
            <div className="mb-6 space-y-4">
              {/* Big "View Site" button */}
              <button
                onClick={() => {
                  if (currentSite?.url) {
                    window.open(currentSite.url, '_blank');
                  }
                }}
                className="w-full py-6 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 rounded-xl text-white font-bold text-xl transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 group"
              >
                <Eye size={24} className="group-hover:scale-110 transition-transform" />
                Посмотреть сайт
                <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              {/* Checklist */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  Чеклист для начала
                </h3>
                <div className="space-y-2">
                  {checklist.map((item) => {
                    // Check if item is completed
                    let isCompleted = false;
                    if (item.id === 'hero') {
                      isCompleted = !!(siteData.hero?.companyName && siteData.hero?.tagline);
                    } else if (item.id === 'services') {
                      isCompleted = currentSite?.services && currentSite.services.length > 0;
                    } else if (item.id === 'design') {
                      isCompleted = !!designSettings.colorScheme;
                    } else if (item.id === 'contacts') {
                      isCompleted = !!(siteData.contacts?.phone || siteData.contacts?.email);
                    } else if (item.id === 'portfolio') {
                      isCompleted = currentSite?.portfolio && currentSite.portfolio.length > 0;
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.action === 'preview') {
                            // Open preview in new tab
                            if (currentSite?.url) {
                              window.open(currentSite.url, '_blank');
                            }
                          } else if (item.target && onNavigate) {
                            onNavigate(item.target);
                            onClose();
                          }
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-left group"
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                        )}
                        <item.icon size={14} className={isCompleted ? "text-green-400" : "text-gray-400"} />
                        <span className={`text-sm flex-1 ${isCompleted ? "text-gray-200 line-through" : "text-gray-300"}`}>
                          {item.label}
                        </span>
                        <ArrowRight size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Назад
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className={`flex-1 px-6 py-2.5 bg-gradient-to-r ${currentStepData.gradient} text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2`}
            >
              {currentStep === steps.length - 1 ? 'Начать работу' : 'Далее'}
              <ArrowRight size={18} />
            </button>
            {currentStep === 0 && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium text-gray-400"
              >
                Пропустить
              </button>
            )}
          </div>
        </div>

        {/* Footer Hint */}
        <div className="px-6 pb-6">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2">
            <Sparkles size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-400/80">
              Совет: используйте AI Suggestions (кнопка со звездочкой) для автоматической оптимизации контента
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

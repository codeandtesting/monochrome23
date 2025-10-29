import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Phone, Mail, Globe, Facebook, Instagram, Twitter, MessageCircle, Youtube, Send } from 'lucide-react';
import { createSite } from '../../utils/sitesStorage';
import ChatPage from '../ChatPage';
import ClientSitePage from '../ClientSitePage';
import ProgressSteps from '../../components/ProgressSteps';

export default function AIWizardStep3() {
  const navigate = useNavigate();
  const [generatedContent, setGeneratedContent] = useState(null);
  // Fixed to Layout 1 only
  const selectedLayout = 'main';
  const selectedColor = 'purple';
  const [contacts, setContacts] = useState({
    phone: '',
    email: '',
    website: '',
    telegram: '',
    whatsapp: ''
  });
  const [social, setSocial] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    discord: '',
    youtube: ''
  });
  const [stats, setStats] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  useEffect(() => {
    const content = localStorage.getItem('generatedContent');
    if (!content) {
      navigate('/onboarding/ai-wizard/step1');
      return;
    }
    const parsed = JSON.parse(content);
    setGeneratedContent(parsed);
    setStats(parsed.stats || []);

    // Auto-select first domain option
    if (parsed.hero?.companyName) {
      const cleanName = parsed.hero.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      setSelectedDomain(`${cleanName}.sixtea.com`);
    }
  }, []);

  // Generate domain suggestions based on company name
  const generateDomainSuggestions = (companyName) => {
    if (!companyName) return [];

    const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const firstWord = companyName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const initials = companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toLowerCase();

    return [
      `${cleanName}.sixtea.com`,
      `${firstWord}.sixtea.com`,
      `${initials}.sixtea.com`
    ].filter((domain, index, self) => self.indexOf(domain) === index); // Remove duplicates
  };

  const domainSuggestions = useMemo(() => {
    return generatedContent ? generateDomainSuggestions(generatedContent.hero?.companyName) : [];
  }, [generatedContent]);

  const handleFinish = () => {
    // Подготавливаем данные сайта
    const siteData = {
      hero: generatedContent.hero,
      services: {
        heading: 'Our Services'
      },
      contacts: {
        heading: 'Get in Touch',
        phone: contacts.phone,
        email: contacts.email,
        address: '',
        website: contacts.website,
        telegram: contacts.telegram,
        whatsapp: contacts.whatsapp
      },
      social: social,
      stats: {
        enabled: true,
        items: stats
      },
      testimonials: {
        enabled: false,
        items: []
      }
    };
    
    // Подготавливаем услуги
    const services = generatedContent.services.map((service, index) => ({
      id: `service_${Date.now()}_${index}`,
      title: service.title,
      description: service.description,
      category: service.category || 'General',
      active: true
    }));

    // Создаем новый сайт
    createSite({
      name: generatedContent.hero.companyName,
      data: siteData,
      services: services,
      portfolio: [],
      design: {
        colorScheme: selectedColor,
        activeLanding: selectedLayout
      }
    });

    // Очищаем временные данные
    localStorage.removeItem('aiWizardData');
    localStorage.removeItem('generatedContent');

    // Переходим на фейковую регистрацию (прокладка), затем в дашборд
    navigate('/onboarding/signup');
  };

  // Собираем временный сайт для живого превью на основе сгенерированных данных
  const previewSite = useMemo(() => {
    if (!generatedContent) return null;
    const mappedServices = (generatedContent.services || []).map((service, index) => ({
      id: `preview_${index}`,
      title: service.title,
      description: service.description,
      category: service.category || 'General',
      active: true
    }));

    return {
      id: 'preview-site',
      name: generatedContent.hero?.companyName || 'Preview Site',
      data: {
        hero: generatedContent.hero,
        services: {
          enabled: true,
          heading: 'Our Services',
          list: mappedServices
        },
        contacts: {
          heading: 'Get in Touch',
          phone: contacts.phone,
          email: contacts.email,
          address: '',
          website: contacts.website,
          telegram: contacts.telegram,
          whatsapp: contacts.whatsapp
        },
        social: {
          facebook: social.facebook,
          instagram: social.instagram,
          twitter: social.twitter,
          discord: social.discord,
          youtube: social.youtube
        },
        stats: {
          enabled: (stats || []).length > 0,
          items: stats
        },
        testimonials: {
          enabled: false,
          items: []
        },
        showcase: {
          showAbout: true,
          showPortfolio: true,
          showServices: true,
          showStats: true,
          showTestimonials: false,
          showContacts: true
        }
      },
      services: mappedServices,
      portfolio: [],
      design: {
        colorScheme: selectedColor,
        activeLanding: selectedLayout
      }
    };
  }, [generatedContent, contacts, social, stats, selectedLayout, selectedColor]);

  if (!generatedContent) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header - No green checkmark */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Website is Ready!</h1>
          <p className="text-gray-400">
            Review and add your contact information
          </p>
        </div>

        {/* Preview Section - Full Width */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Content Preview</h2>

          {/* Preview Window - Full Width - Layout 1 Only */}
          {previewSite && (
            <div className="rounded-lg overflow-hidden border border-gray-800 bg-black h-[700px]">
              <ChatPage siteData={previewSite} embedded />
            </div>
          )}
        </div>

        {/* Domain Selection Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Choose Your Domain</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-4">Select a domain for your website or enter your own</p>

            {/* Domain Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {domainSuggestions.map((domain, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDomain(domain);
                    setCustomDomain('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedDomain === domain && !customDomain
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{domain}</span>
                    {selectedDomain === domain && !customDomain && (
                      <Check size={18} className="text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Domain Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Or enter your custom subdomain:</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-gray-800 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setCustomDomain(value);
                      if (value) {
                        setSelectedDomain('');
                      }
                    }}
                    placeholder="mycompany"
                    className="flex-1 px-4 py-3 bg-transparent focus:outline-none font-mono text-sm"
                  />
                  <span className="px-3 text-gray-500 font-mono text-sm">.sixtea.com</span>
                </div>
                {customDomain && (
                  <Check size={20} className="text-green-500" />
                )}
              </div>
            </div>

            {/* Selected Domain Display */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Your website will be available at:</p>
              <p className="font-mono text-blue-400 font-medium">
                https://{customDomain ? `${customDomain}.sixtea.com` : selectedDomain || 'your-domain.sixtea.com'}
              </p>
            </div>

            {/* Custom Domain Note */}
            <div className="mt-3 flex items-start gap-2 text-sm text-gray-400">
              <span className="text-blue-400 mt-0.5">ℹ️</span>
              <p>
                No worries! Later you can setup a fully custom domain (e.g., yourcompany.com)
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout - Content Details & Contact Form */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Content Details - TEMPORARILY COMMENTED OUT FOR TESTING */}
          {/*
          <div>
            <h2 className="text-xl font-semibold mb-2">Content Details</h2>
            <p className="text-sm text-gray-400 mb-4">
              More flexible setup of your website waiting for you in your personal dashboard. No worries, we got every aspect covered!
            </p>
            <div className="space-y-3">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase">Hero Section</h3>
                <h4 className="text-xl font-bold mb-1">{generatedContent.hero.companyName}</h4>
                <p className="text-blue-400 text-sm mb-2">{generatedContent.hero.tagline}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{generatedContent.hero.description}</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase">Services ({generatedContent.services.length})</h3>
                <div className="space-y-2">
                  {generatedContent.services.slice(0, 3).map((service, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-2">
                      <p className="font-medium text-sm">{service.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{service.description}</p>
                    </div>
                  ))}
                  {generatedContent.services.length > 3 && (
                    <p className="text-xs text-gray-500 italic">+{generatedContent.services.length - 3} more services...</p>
                  )}
                </div>
              </div>

              {stats.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase">Statistics (Editable)</h3>
                  <div className="space-y-2">
                    {stats.map((stat, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...stats];
                            newStats[index].value = e.target.value;
                            setStats(newStats);
                          }}
                          placeholder="Value"
                          className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...stats];
                            newStats[index].label = e.target.value;
                            setStats(newStats);
                          }}
                          placeholder="Label"
                          className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          */}

          {/* Compact Contact Form - Single Column, More Efficient Layout */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Add Your Contact Information</h2>

            {/* Single Card with Grid Layout */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              {/* Contact Details - Grid Layout */}
              <h3 className="text-base font-medium mb-3 text-gray-300">Contact Details</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Phone size={14} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contacts.phone}
                    onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Mail size={14} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contacts.email}
                    onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Globe size={14} />
                    Website (optional)
                  </label>
                  <input
                    type="url"
                    value={contacts.website}
                    onChange={(e) => setContacts({ ...contacts, website: e.target.value })}
                    placeholder="https://yoursite.com"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Send size={14} />
                    Telegram (optional)
                  </label>
                  <input
                    type="text"
                    value={contacts.telegram}
                    onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })}
                    placeholder="@username"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Phone size={14} />
                    WhatsApp (optional)
                  </label>
                  <input
                    type="tel"
                    value={contacts.whatsapp}
                    onChange={(e) => setContacts({ ...contacts, whatsapp: e.target.value })}
                    placeholder="+1 234 567 890"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Social Media - Compact Grid */}
              <h3 className="text-base font-medium mb-3 text-gray-300">Social Media (optional)</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Facebook size={14} />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={social.facebook}
                    onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                    placeholder="facebook.com/..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Instagram size={14} />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={social.instagram}
                    onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                    placeholder="instagram.com/..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Twitter size={14} />
                    X (Twitter)
                  </label>
                  <input
                    type="url"
                    value={social.twitter}
                    onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                    placeholder="twitter.com/..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <MessageCircle size={14} />
                    Discord
                  </label>
                  <input
                    type="url"
                    value={social.discord}
                    onChange={(e) => setSocial({ ...social, discord: e.target.value })}
                    placeholder="discord.gg/..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5 text-gray-400">
                    <Youtube size={14} />
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={social.youtube}
                    onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                    placeholder="youtube.com/..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => navigate('/onboarding/ai-wizard/step1')}
                className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Start Over
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 font-medium text-sm"
              >
                Finish & Go to Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps - Moved to Bottom */}
        <div className="mt-12">
          <ProgressSteps
            currentStep={3}
            totalSteps={4}
            steps={['Basic Info', 'Services', 'Details', 'Preview']}
          />
        </div>
      </div>
    </div>
  );
}

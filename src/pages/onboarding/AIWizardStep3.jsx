import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Phone, Mail, Globe, Facebook, Instagram, Twitter, MessageCircle, Youtube } from 'lucide-react';
import { createSite } from '../../utils/sitesStorage';

export default function AIWizardStep3() {
  const navigate = useNavigate();
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contacts, setContacts] = useState({
    phone: '',
    email: '',
    website: ''
  });
  const [social, setSocial] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    discord: '',
    youtube: ''
  });
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const content = localStorage.getItem('generatedContent');
    if (!content) {
      navigate('/onboarding/ai-wizard/step1');
      return;
    }
    const parsed = JSON.parse(content);
    setGeneratedContent(parsed);
    setStats(parsed.stats || []);
  }, []);

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
        website: contacts.website
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
        colorScheme: 'default',
        activeLanding: 'client'
      }
    });

    // Очищаем временные данные
    localStorage.removeItem('aiWizardData');
    localStorage.removeItem('generatedContent');

    // Переходим на дашборд
    navigate('/dashboard');
  };

  if (!generatedContent) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-4">
            <Check size={24} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Your Website is Ready!</h1>
          <p className="text-gray-400">
            Step 3 of 3 • Review and add your contact information
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Generated Content Preview</h2>
            
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">HERO SECTION</h3>
                <h4 className="text-2xl font-bold mb-2">{generatedContent.hero.companyName}</h4>
                <p className="text-blue-400 mb-3">{generatedContent.hero.tagline}</p>
                <p className="text-gray-400 text-sm">{generatedContent.hero.description}</p>
              </div>

              {/* Services */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">SERVICES ({generatedContent.services.length})</h3>
                <div className="space-y-3">
                  {generatedContent.services.slice(0, 3).map((service, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-3">
                      <p className="font-medium">{service.title}</p>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </div>
                  ))}
                  {generatedContent.services.length > 3 && (
                    <p className="text-sm text-gray-500">+{generatedContent.services.length - 3} more services...</p>
                  )}
                </div>
              </div>

              {/* Stats - Editable */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">STATISTICS (Editable)</h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...stats];
                          newStats[index].value = e.target.value;
                          setStats(newStats);
                        }}
                        placeholder="Value"
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Add Your Contact Information</h2>
            
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Contact Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contacts.phone}
                      onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                      placeholder="+1 234 567 890"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contacts.email}
                      onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                      placeholder="contact@company.com"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Globe size={16} />
                      Website (optional)
                    </label>
                    <input
                      type="url"
                      value={contacts.website}
                      onChange={(e) => setContacts({ ...contacts, website: e.target.value })}
                      placeholder="https://www.yourwebsite.com"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Social Media (optional)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Facebook size={16} />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={social.facebook}
                      onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Instagram size={16} />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={social.instagram}
                      onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Twitter size={16} />
                      X (Twitter)
                    </label>
                    <input
                      type="url"
                      value={social.twitter}
                      onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                      placeholder="https://twitter.com/..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <MessageCircle size={16} />
                      Discord
                    </label>
                    <input
                      type="url"
                      value={social.discord}
                      onChange={(e) => setSocial({ ...social, discord: e.target.value })}
                      placeholder="https://discord.gg/..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Youtube size={16} />
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={social.youtube}
                      onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/onboarding/ai-wizard/step1')}
                  className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  Finish & Go to Dashboard
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

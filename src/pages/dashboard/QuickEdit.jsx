import React, { useState } from 'react';
import { Save, Plus, X, Sparkles } from 'lucide-react';

export default function QuickEdit() {
  const [activeSection, setActiveSection] = useState('hero');

  const [heroData, setHeroData] = useState({
    heading: 'Ремонт мебели любой сложности',
    subheading: 'Профессиональное восстановление за 1-3 дня',
    buttonText: 'Получить консультацию',
  });

  const [servicesData, setServicesData] = useState({
    heading: 'Наши услуги',
    services: [
      'Ремонт царапин и потертостей на коже',
      'Полная реставрация обивки',
      'Замена наполнителя мягкой мебели',
    ],
  });

  const [portfolioData, setPortfolioData] = useState({
    heading: 'Наши работы',
    photos: ['/portfolio/1a.jpg', '/portfolio/2a.jpg'],
  });

  const [contactsData, setContactsData] = useState({
    heading: 'Контакты',
    phone: '+7 999 123-45-67',
    email: 'info@company.com',
    address: 'Москва, ул. Примерная, 123',
  });

  const sections = [
    { id: 'hero', label: 'Main Hero / Title' },
    { id: 'services', label: 'Services Section' },
    { id: 'portfolio', label: 'Portfolio Section' },
    { id: 'info', label: 'Service Data / Information' },
    { id: 'contacts', label: 'Contacts Section' },
    { id: 'social', label: 'Social Networks' },
    { id: 'ai-widget', label: 'AI Chat Widget' },
    { id: 'footer', label: 'Footer Section' },
  ];

  const handleSave = () => {
    alert('Изменения сохранены!');
  };

  return (
    <div className="flex h-[calc(100vh-100px)] -m-6 md:-m-8">
      {/* LEFT Panel - Content Editor */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Quick Edit Mode</h1>

          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Main Hero / Title</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Заголовок</label>
                <input
                  type="text"
                  value={heroData.heading}
                  onChange={(e) => setHeroData({ ...heroData, heading: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Подзаголовок</label>
                <textarea
                  value={heroData.subheading}
                  onChange={(e) => setHeroData({ ...heroData, subheading: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Текст кнопки</label>
                <input
                  type="text"
                  value={heroData.buttonText}
                  onChange={(e) => setHeroData({ ...heroData, buttonText: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Services Section */}
          {activeSection === 'services' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Services Section</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Заголовок секции</label>
                <input
                  type="text"
                  value={servicesData.heading}
                  onChange={(e) => setServicesData({ ...servicesData, heading: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Услуги</label>
                <div className="space-y-2">
                  {servicesData.services.map((service, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => {
                          const newServices = [...servicesData.services];
                          newServices[index] = e.target.value;
                          setServicesData({ ...servicesData, services: newServices });
                        }}
                        className="flex-1 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newServices = servicesData.services.filter((_, i) => i !== index);
                          setServicesData({ ...servicesData, services: newServices });
                        }}
                        className="px-3 py-2 bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => {
                      setServicesData({ 
                        ...servicesData, 
                        services: [...servicesData.services, ''] 
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg text-sm"
                  >
                    <Plus size={16} />
                    Добавить услугу
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Section */}
          {activeSection === 'portfolio' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Portfolio Section</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Заголовок секции</label>
                <input
                  type="text"
                  value={portfolioData.heading}
                  onChange={(e) => setPortfolioData({ ...portfolioData, heading: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Фотографии</label>
                <div className="grid grid-cols-2 gap-3">
                  {portfolioData.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          const newPhotos = portfolioData.photos.filter((_, i) => i !== index);
                          setPortfolioData({ ...portfolioData, photos: newPhotos });
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <div className="aspect-square border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-900">
                    <Plus size={32} className="text-gray-500" />
                  </div>
                </div>
              </div>
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
                  value={contactsData.heading}
                  onChange={(e) => setContactsData({ ...contactsData, heading: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <input
                  type="tel"
                  value={contactsData.phone}
                  onChange={(e) => setContactsData({ ...contactsData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={contactsData.email}
                  onChange={(e) => setContactsData({ ...contactsData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Адрес</label>
                <input
                  type="text"
                  value={contactsData.address}
                  onChange={(e) => setContactsData({ ...contactsData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Social Networks Section */}
          {activeSection === 'social' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Social Networks</h2>
              
              <div className="space-y-3">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
                    <div>
                      <p className="font-medium">Instagram</p>
                      <p className="text-xs text-gray-400">Не подключен</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-400 font-medium">Подключить →</button>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg"></div>
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-xs text-gray-400">Не подключен</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-400 font-medium">Подключить →</button>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg"></div>
                    <div>
                      <p className="font-medium">WhatsApp Business</p>
                      <p className="text-xs text-gray-400">Не подключен</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-400 font-medium">Подключить →</button>
                </div>
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {!['hero', 'services', 'portfolio', 'contacts', 'social'].includes(activeSection) && (
            <div className="text-center py-12">
              <p className="text-gray-400">Секция в разработке</p>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT Sidebar - Sections List */}
      <div className="w-96 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">All Editable Sections</h2>
        
        <div className="space-y-2 mb-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 text-blue-400'
                  : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* AI Assistance */}
        <div className="bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-purple-400" size={20} />
            <h3 className="font-semibold">AI Assistance</h3>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Нужна помощь с этой секцией?
          </p>
          <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
            Попросить AI улучшить
          </button>
        </div>
      </div>
    </div>
  );
}

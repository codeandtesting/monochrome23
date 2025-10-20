import React, { useState } from 'react';
import { Save, Check, X, Plus } from 'lucide-react';

export default function Settings() {
  const [companyName, setCompanyName] = useState('Мастерская Уютный Дом');
  const [slogan, setSlogan] = useState('Возвращаем вашей мебели первозданный вид');
  const [description, setDescription] = useState('Профессиональная реставрация и ремонт мебели с 2010 года');
  
  const [services, setServices] = useState([
    'Ремонт царапин и потертостей на коже',
    'Полная реставрация обивки',
    'Замена наполнителя мягкой мебели',
    'Выездной ремонт на дому'
  ]);

  const [benefits, setBenefits] = useState([
    { icon: '⚡', title: '1-3 дня', description: 'Быстрые сроки' },
    { icon: '🛡️', title: '12 месяцев', description: 'Гарантия' },
    { icon: '⭐', title: '500+', description: 'Довольных клиентов' }
  ]);

  const [phone, setPhone] = useState('+7 999 123-45-67');
  const [email, setEmail] = useState('info@company.com');
  const [address, setAddress] = useState('Москва, ул. Примерная, 123');

  const [aiTone, setAiTone] = useState('friendly');
  const [requestContacts, setRequestContacts] = useState(true);
  const [offerBooking, setOfferBooking] = useState(true);

  const addService = () => {
    setServices([...services, '']);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index, value) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
  };

  const handleSave = () => {
    alert('Настройки сохранены!');
  };

  const handleSaveAndPublish = () => {
    alert('Настройки сохранены и опубликованы!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Настройки сайта</h1>
      </div>

      {/* Основная информация */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="font-semibold mb-4">Основная информация</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название компании</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Слоган</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">О компании</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={280}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/280 символов</p>
          </div>
        </div>
      </div>

      {/* Услуги */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Услуги</h3>
          <button
            onClick={addService}
            className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
          >
            <Plus size={16} />
            Добавить услугу
          </button>
        </div>
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={service}
                onChange={(e) => updateService(index, e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeService(index)}
                className="px-3 py-2 bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Преимущества */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="font-semibold mb-4">Преимущества</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="mb-3">
                <label className="block text-xs text-gray-400 mb-1">Иконка (emoji)</label>
                <input
                  type="text"
                  value={benefit.icon}
                  onChange={(e) => {
                    const newBenefits = [...benefits];
                    newBenefits[index].icon = e.target.value;
                    setBenefits(newBenefits);
                  }}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-center text-2xl"
                  maxLength={2}
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs text-gray-400 mb-1">Заголовок</label>
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => {
                    const newBenefits = [...benefits];
                    newBenefits[index].title = e.target.value;
                    setBenefits(newBenefits);
                  }}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Описание</label>
                <input
                  type="text"
                  value={benefit.description}
                  onChange={(e) => {
                    const newBenefits = [...benefits];
                    newBenefits[index].description = e.target.value;
                    setBenefits(newBenefits);
                  }}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Контакты */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="font-semibold mb-4">Контакты</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">📞 Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">📍 Адрес</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* AI-агент */}
      <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          🤖 Настройки AI-агента
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Тон общения</label>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="friendly">Дружелюбный</option>
              <option value="formal">Формальный</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Запрашивать контакты</p>
              <p className="text-sm text-gray-400">AI будет просить номер телефона/email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={requestContacts}
                onChange={(e) => setRequestContacts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Предлагать букинг</p>
              <p className="text-sm text-gray-400">AI будет предлагать забронировать встречу</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={offerBooking}
                onChange={(e) => setOfferBooking(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3">
        <button className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
          Отмена
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Сохранить
        </button>
        <button
          onClick={handleSaveAndPublish}
          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Сохранить и опубликовать
        </button>
      </div>
    </div>
  );
}

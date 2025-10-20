import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AIWizardStep2() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    instagram: false,
    facebook: false,
    whatsapp: false,
  });

  const handleNext = () => {
    localStorage.setItem('onboarding_step2', JSON.stringify(formData));
    navigate('/onboarding/ai-wizard/step3');
  };

  const socialButtons = [
    {
      id: 'instagram',
      name: 'Instagram',
      color: 'from-purple-500 to-pink-500',
      letter: 'in',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: 'bg-blue-500',
      letter: 'f',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      color: 'bg-green-500',
      letter: 'W',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
            ✨
          </div>
          <h2 className="text-3xl font-bold mb-2">AI Wizard</h2>
          <p className="text-gray-400">Шаг 2 из 3 • Добавьте контакты</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            📞 Укажите способы связи, чтобы клиенты могли с вами связаться
          </p>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Телефон *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+7 999 123-45-67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Адрес (необязательно)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Москва, ул. Примерная, 123"
            />
          </div>

          {/* Social Networks */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-lg font-semibold mb-2">Социальные сети (необязательно)</h3>
            <p className="text-sm text-gray-400 mb-4">Подключите аккаунты в один клик</p>

            <div className="space-y-3">
              {socialButtons.map((social) => (
                <button
                  key={social.id}
                  onClick={() => setFormData({ ...formData, [social.id]: !formData[social.id] })}
                  className="w-full flex items-center justify-between p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                      {social.letter}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{social.name}</p>
                      <p className="text-xs text-gray-500">
                        {formData[social.id] ? 'Подключен' : 'Не подключен'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-400 font-medium">
                    {formData[social.id] ? 'Отключить' : 'Подключить →'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/onboarding/ai-wizard/step1')}
            className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Назад
          </button>
          <button
            onClick={handleNext}
            disabled={!formData.phone || !formData.email}
            className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Далее →
          </button>
        </div>
      </div>
    </div>
  );
}


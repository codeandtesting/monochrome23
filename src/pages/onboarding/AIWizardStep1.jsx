import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function AIWizardStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    about: '',
    services: '',
    benefits: '',
  });

  const handleNext = () => {
    // Save to localStorage or context
    localStorage.setItem('onboarding_step1', JSON.stringify(formData));
    navigate('/onboarding/ai-wizard/step2');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
            ✨
          </div>
          <h2 className="text-3xl font-bold mb-2">AI Wizard</h2>
          <p className="text-gray-400">Шаг 1 из 3 • AI создаст контент за вас</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            💡 Просто ответьте на вопросы своими словами. AI создаст профессиональный контент для сайта.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Чем занимается ваша компания? *
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Например: Мы ремонтируем мебель. Специализируемся на кожаных диванах и креслах. Работаем 10 лет."
            />
            <p className="text-xs text-gray-500 mt-2">
              AI создаст красивое описание на основе вашего ответа
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Какие услуги вы предлагаете?
            </label>
            <textarea
              value={formData.services}
              onChange={(e) => setFormData({ ...formData, services: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Например: Ремонт царапин, реставрация обивки, замена наполнителя, выездной ремонт"
            />
            <p className="text-xs text-gray-500 mt-2">
              Перечислите через запятую или опишите своими словами
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ваши преимущества
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Например: Быстро делаем за 1-3 дня, даём гарантию 12 месяцев, более 500 клиентов"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/onboarding')}
            className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Назад
          </button>
          <button
            onClick={handleNext}
            disabled={!formData.about}
            className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Далее →
          </button>
        </div>
      </div>
    </div>
  );
}


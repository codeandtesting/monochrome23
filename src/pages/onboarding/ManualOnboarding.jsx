import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ManualOnboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    slogan: '',
    about: '',
  });

  const charCount = formData.about.length;
  const maxChars = 280;

  const handleContinue = () => {
    localStorage.setItem('manual_onboarding', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4"></div>
          <h2 className="text-3xl font-bold mb-2">Создайте свой AI-сайт за 3 минуты</h2>
          <p className="text-gray-400">Шаг 1 из 4</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Название компании *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Название вашей компании"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Слоган</label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Краткое описание вашего бизнеса"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">О компании (280 символов)</label>
            <textarea
              value={formData.about}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) {
                  setFormData({ ...formData, about: e.target.value });
                }
              }}
              maxLength={maxChars}
              rows={4}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Расскажите о вашей компании..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {charCount}/{maxChars} символов
            </p>
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
            onClick={handleContinue}
            disabled={!formData.companyName}
            className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Далее →
          </button>
        </div>
      </div>
    </div>
  );
}


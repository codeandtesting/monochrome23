import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

export default function AIWizardStep3() {
  const navigate = useNavigate();
  const [selectedDesign, setSelectedDesign] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);

  const designs = [
    {
      id: 'modern',
      name: 'Modern Minimal',
      description: 'Чистый и профессиональный',
      recommended: true,
      gradient: 'from-blue-50 to-white',
    },
    {
      id: 'classic',
      name: 'Classic Business',
      description: 'Традиционный стиль',
      gradient: 'from-gray-50 to-white',
    },
    {
      id: 'creative',
      name: 'Creative Bold',
      description: 'Яркий и современный',
      gradient: 'from-purple-50 to-white',
    },
  ];

  const handleViewPreview = () => {
    localStorage.setItem('onboarding_design', selectedDesign);
    navigate('/onboarding/ai-wizard/preview');
  };

  const handleCreateSite = () => {
    localStorage.setItem('onboarding_design', selectedDesign);
    // Here you would normally create the site
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
            ✨
          </div>
          <h2 className="text-3xl font-bold mb-2">AI Wizard</h2>
          <p className="text-gray-400">Шаг 3 из 3 • Выберите дизайн</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            🎨 AI подобрал шаблоны на основе вашего бизнеса. Вы можете изменить дизайн позже.
          </p>
        </div>

        {/* Design Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => setSelectedDesign(design.id)}
              className={`group relative border-2 rounded-xl overflow-hidden transition-all ${
                selectedDesign === design.id
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {design.recommended && (
                <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full z-10">
                  AI Recommended
                </div>
              )}

              {/* Design Preview */}
              <div className={`bg-gradient-to-b ${design.gradient} p-12 aspect-video flex items-center justify-center relative`}>
                <div className="text-center text-gray-800">
                  <div className="w-20 h-20 bg-gray-200 rounded mb-3 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-32 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              </div>

              {/* Design Info */}
              <div className="p-4 bg-gray-900">
                <p className="font-semibold mb-1">{design.name}</p>
                <p className="text-xs text-gray-400">{design.description}</p>
              </div>

              {/* Selected Indicator */}
              {selectedDesign === design.id && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check size={18} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Success Message */}
        <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-3xl">✓</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">AI сгенерировал ваш сайт!</h3>
              <p className="text-gray-300 text-sm">
                Контент готов. Проверьте информацию перед публикацией.
              </p>
            </div>
          </div>
          <button
            onClick={handleViewPreview}
            className="w-full py-3 bg-gray-900 border-2 border-green-500 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            📄 Просмотреть весь контент сайта
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/onboarding/ai-wizard/step2')}
            className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Назад
          </button>
          <button
            onClick={handleCreateSite}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
          >
            Создать сайт ✨
          </button>
        </div>
      </div>
    </div>
  );
}


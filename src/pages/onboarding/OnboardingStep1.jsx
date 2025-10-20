import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Edit } from 'lucide-react';

export default function OnboardingStep1() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Создайте свой AI-сайт за 3 минуты</h2>
          <p className="text-gray-400">Шаг 1 из 4</p>
        </div>

        {/* Choice Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-medium mb-6 text-center">Как вы хотите создать сайт?</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Wizard Option */}
            <button
              onClick={() => navigate('/onboarding/ai-wizard/step1')}
              className="group border-2 border-blue-500 bg-blue-500 bg-opacity-10 rounded-xl p-8 hover:bg-opacity-20 transition-all text-left"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                ✨
              </div>
              <h3 className="text-xl font-bold text-center mb-3">AI Wizard</h3>
              <p className="text-gray-400 text-center mb-4">
                Ответьте на несколько вопросов, AI создаст всё за вас
              </p>
              <div className="bg-blue-500 bg-opacity-20 text-blue-400 rounded-lg p-3 text-sm text-center font-medium">
                Рекомендуется
              </div>
            </button>

            {/* Manual Option */}
            <button
              onClick={() => navigate('/onboarding/manual/step1')}
              className="group border-2 border-gray-700 bg-gray-900 rounded-xl p-8 hover:border-gray-600 hover:bg-gray-800 transition-all text-left"
            >
              <div className="w-16 h-16 bg-gray-700 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                ✍️
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Вручную</h3>
              <p className="text-gray-400 text-center mb-4">
                Заполните информацию самостоятельно
              </p>
              <div className="bg-gray-800 rounded-lg p-3 text-sm text-center text-gray-400 font-medium">
                Больше контроля
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


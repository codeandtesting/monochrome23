import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

export default function WelcomeTour({ onClose, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      title: 'Добро пожаловать! 👋',
      description: 'Ваш сайт создан! Теперь давайте настроим его под себя. Это займет всего несколько минут.',
      icon: Sparkles,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Редактируйте контент 📝',
      description: 'Используйте меню справа, чтобы изменить текст, добавить услуги и портфолио. Все изменения сохраняются автоматически.',
      icon: Palette,
      gradient: 'from-purple-500 to-pink-500',
      action: { label: 'Открыть Hero секцию', target: 'hero' }
    },
    {
      title: 'Настройте дизайн 🎨',
      description: 'Выберите цветовую схему и стиль оформления в разделе "Дизайн и цвета". Попробуйте разные варианты!',
      icon: Palette,
      gradient: 'from-orange-500 to-red-500',
      action: { label: 'Открыть Дизайн', target: 'visual' }
    },
    {
      title: 'Посмотрите результат 👀',
      description: 'Нажмите "View Live Site" в меню профиля, чтобы увидеть, как выглядит ваш сайт для посетителей.',
      icon: Eye,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Готово! 🚀',
      description: 'Вы готовы к работе! Не забудьте добавить контакты и настроить SEO для лучшей видимости в поисковиках.',
      icon: CheckCircle2,
      gradient: 'from-blue-500 to-purple-500'
    }
  ];

  const checklist = [
    { id: 'hero', label: 'Заполнить Hero секцию', icon: Sparkles, target: 'hero' },
    { id: 'services', label: 'Добавить услуги', icon: Zap, target: 'services' },
    { id: 'design', label: 'Выбрать цветовую схему', icon: Palette, target: 'visual' },
    { id: 'contacts', label: 'Добавить контакты', icon: Share2, target: 'contacts' },
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

          {/* Action Button if available */}
          {currentStepData.action && (
            <button
              onClick={() => handleAction(currentStepData.action.target)}
              className={`w-full mb-6 px-6 py-3 bg-gradient-to-r ${currentStepData.gradient} text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2`}
            >
              {currentStepData.action.label}
              <ArrowRight size={18} />
            </button>
          )}

          {/* Checklist on last step */}
          {currentStep === steps.length - 1 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />
                Чеклист для начала
              </h3>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action === 'preview') {
                        // Open preview in new tab
                        window.open(window.location.origin + '/preview', '_blank');
                      } else if (item.target && onNavigate) {
                        onNavigate(item.target);
                        onClose();
                      }
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-left group"
                  >
                    <Circle size={16} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                    <item.icon size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-300 flex-1">{item.label}</span>
                    <ArrowRight size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Назад
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex-1 px-6 py-2.5 bg-gradient-to-r ${currentStepData.gradient} text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2`}
            >
              {currentStep === steps.length - 1 ? 'Начать работу' : 'Далее'}
              <ArrowRight size={18} />
            </button>
            {currentStep === 0 && (
              <button
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

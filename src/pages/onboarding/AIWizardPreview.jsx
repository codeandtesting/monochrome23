import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Edit, RefreshCw, Check } from 'lucide-react';

export default function AIWizardPreview() {
  const navigate = useNavigate();

  const contentSections = [
    {
      title: 'Основная информация',
      items: [
        { label: 'Название', value: 'Мастерская "Уютный Дом"' },
        { label: 'Слоган', value: 'Возвращаем вашей мебели первозданный вид' },
        {
          label: 'О компании',
          value:
            'Профессиональная реставрация и ремонт мебели с 2010 года. Специализируемся на работе с кожаными диванами и креслами, обеспечивая высокое качество и долговечность результата.',
        },
      ],
    },
    {
      title: 'Услуги',
      list: [
        'Ремонт царапин и потертостей на коже',
        'Полная реставрация обивки',
        'Замена наполнителя мягкой мебели',
        'Выездной ремонт на дому',
      ],
    },
    {
      title: 'Преимущества',
      benefits: [
        { icon: '⚡', title: '1-3 дня', description: 'Быстрые сроки' },
        { icon: '🛡️', title: '12 месяцев', description: 'Гарантия' },
        { icon: '⭐', title: '500+ клиентов', description: 'Довольных' },
      ],
    },
    {
      title: 'Контакты',
      contacts: ['📞 +7 999 123-45-67', '📧 info@company.com', '📍 Москва, ул. Примерная, 123'],
    },
  ];

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Просмотр контента сайта</h2>
            <p className="text-sm text-gray-400 mt-1">
              Проверьте всю информацию перед публикацией
            </p>
          </div>
          <button
            onClick={() => navigate('/onboarding/ai-wizard/step3')}
            className="text-3xl text-gray-400 hover:text-white transition-colors"
          >
            <X />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Основная информация */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Основная информация</h3>
              <button className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                <Edit size={16} />
                Редактировать
              </button>
            </div>
            <div className="space-y-3">
              {contentSections[0].items.map((item, index) => (
                <div key={index}>
                  <span className="text-gray-400 text-sm">{item.label}:</span>
                  <p className="font-medium mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Услуги */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Услуги</h3>
              <button className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                <Edit size={16} />
                Редактировать
              </button>
            </div>
            <ul className="space-y-2">
              {contentSections[1].list.map((service, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-blue-400">•</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Преимущества */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Преимущества</h3>
              <button className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                <Edit size={16} />
                Редактировать
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {contentSections[2].benefits.map((benefit, index) => (
                <div key={index}>
                  <div className="text-3xl mb-2">{benefit.icon}</div>
                  <p className="font-semibold">{benefit.title}</p>
                  <p className="text-xs text-gray-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Контакты */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">Контакты</h3>
              <button className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                <Edit size={16} />
                Редактировать
              </button>
            </div>
            <div className="space-y-2">
              {contentSections[3].contacts.map((contact, index) => (
                <p key={index} className="text-gray-300">
                  {contact}
                </p>
              ))}
            </div>
          </div>

          {/* AI Agent Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">AI-агент настроен</h3>
              <span className="text-xs bg-green-500 bg-opacity-20 text-green-400 px-3 py-1 rounded-full">
                Готов
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-3">AI будет отвечать на вопросы клиентов о:</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Услугах и ценах</li>
              <li>• Сроках выполнения работ</li>
              <li>• Примерах работ и портфолио</li>
              <li>• Букировании консультаций</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-800 p-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Что-то не подходит?</h3>
                <p className="text-sm text-gray-300">
                  Если вам что-то не нравится, вы можете отредактировать контент вручную или
                  попросить AI сгенерировать заново.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
              <Edit size={18} />
              Редактировать вручную
            </button>
            <button className="flex-1 px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
              <RefreshCw size={18} />
              Сгенерировать заново
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Всё отлично, продолжить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';

export default function Subscription() {
  const currentPlan = 'free';
  const [showComparison, setShowComparison] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/мес',
      features: [
        { text: '500 AI запросов/мес', included: true },
        { text: 'Базовый дашборд', included: true },
        { text: 'yoursite.ourhost.ai', included: true },
        { text: 'Голосовые запросы', included: false },
        { text: 'Фото запросы', included: false },
        { text: 'Свой хост', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: '/мес',
      popular: true,
      features: [
        { text: '2000 AI запросов/мес', included: true },
        { text: 'Расширенный дашборд', included: true },
        { text: 'yoursite.ourhost.ai', included: true },
        { text: 'Голосовые запросы 🎤', included: true },
        { text: 'Фото запросы 📷', included: true },
        { text: 'Свой хост', included: false },
      ],
    },
    {
      id: 'business',
      name: 'Business',
      price: '$26.50',
      period: '/мес',
      features: [
        { text: '10000 AI запросов/мес', included: true },
        { text: 'Полный дашборд', included: true },
        { text: 'Свой домен 🌐', included: true },
        { text: 'Голосовые запросы 🎤', included: true },
        { text: 'Фото запросы 📷', included: true },
        { text: 'Кастомный дизайн 🎨', included: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Тарифные планы</h1>
        <p className="text-gray-400">Текущий план: Free</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-gray-900 border rounded-xl p-6 flex flex-col ${
              plan.popular
                ? 'border-blue-500'
                : 'border-gray-800'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                  Популярный
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-bold mb-3">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400 ml-1">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature, index) => (
                <li 
                  key={index} 
                  className={`flex items-start text-sm ${
                    feature.included ? '' : 'text-gray-500'
                  }`}
                >
                  {feature.included ? (
                    <Check className="text-green-400 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  ) : (
                    <X className="text-gray-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  )}
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                currentPlan === plan.id
                  ? 'border-2 border-gray-700 text-gray-400 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? 'Текущий план' : 'Выбрать план'}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2 mx-auto"
        >
          <ChevronDown 
            size={18} 
            className={`transition-transform ${showComparison ? 'rotate-180' : ''}`}
          />
          Показать детальное сравнение планов
        </button>
      </div>

      {/* Add-ons (if comparison shown) */}
      {showComparison && (
        <div className="space-y-4 max-w-2xl mx-auto">
          <h3 className="font-semibold">Дополнительные возможности</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">🎤 Voice Messages</p>
                  <p className="text-sm text-gray-400">Голосовые сообщения от клиентов</p>
                </div>
              </div>
              <p className="text-xl font-bold mb-3">+$15/mo</p>
              <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm">
                Добавить
              </button>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">📷 Image Recognition</p>
                  <p className="text-sm text-gray-400">Обработка фото от клиентов</p>
                </div>
              </div>
              <p className="text-xl font-bold mb-3">+$15/mo</p>
              <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm">
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 max-w-2xl mx-auto">
        <h3 className="font-semibold mb-3">Способ оплаты</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-400">No payment method</p>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm">
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}


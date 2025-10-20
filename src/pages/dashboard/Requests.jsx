import React, { useState } from 'react';
import { Phone, Mail, Image as ImageIcon, Calendar } from 'lucide-react';

export default function Requests() {
  const [activeTab, setActiveTab] = useState('all');

  const requests = [
    { 
      id: 1, 
      name: 'Иван П.', 
      email: 'ivan@email.com', 
      preview: 'Интересует ремонт кожаного дивана. Бюджет: $500-700', 
      status: 'Лид', 
      action: '📞 Запросил звонок',
      time: '2 часа назад',
      type: 'lead'
    },
    { 
      id: 2, 
      name: 'Мария К.', 
      email: 'maria@email.com', 
      preview: 'Хочу забукать консультацию на завтра', 
      status: 'Букинг', 
      action: '📅 Забронировал',
      time: '3 часа назад',
      type: 'booking'
    },
    { 
      id: 3, 
      name: 'Анонимный', 
      email: '-', 
      preview: 'Сколько стоит ваш сервис?', 
      status: 'Вопрос', 
      action: '💬 5 сообщений',
      time: '5 часов назад',
      type: 'chat'
    },
    { 
      id: 4, 
      name: 'Петр С.', 
      email: 'petr@email.com', 
      preview: 'Нужна срочная помощь с царапиной', 
      status: 'Лид', 
      action: '📷 Отправил фото',
      time: '1 день назад',
      type: 'lead'
    },
    { 
      id: 5, 
      name: 'Ольга Т.', 
      email: 'olga@email.com', 
      preview: 'Посмотрела портфолио, хочу заказать', 
      status: 'Лид', 
      action: '📞 Запросил звонок',
      time: '1 день назад',
      type: 'lead'
    },
  ];

  const tabs = [
    { id: 'all', label: 'Все', count: 127 },
    { id: 'chat', label: 'Чаты', count: 89 },
    { id: 'lead', label: 'Лиды', count: 23 },
    { id: 'booking', label: 'Букинги', count: 8 },
  ];

  const filteredRequests = activeTab === 'all' 
    ? requests 
    : requests.filter(req => req.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Запросы клиентов</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-800 text-white'
                : 'border border-gray-700 hover:bg-gray-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:bg-gray-850 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                  {request.name[0]}
                </div>
                <div>
                  <p className="font-medium">{request.name}</p>
                  <p className="text-xs text-gray-500">{request.email}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                request.status === 'Лид' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                request.status === 'Букинг' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                'bg-gray-700 text-gray-300'
              }`}>
                {request.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{request.preview}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{request.action}</span>
              <span>{request.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


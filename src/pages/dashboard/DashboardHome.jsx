import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Edit, Lightbulb } from 'lucide-react';

export default function DashboardHome() {
  const recentRequests = [
    { id: 1, name: 'Анонимный пользователь', message: 'Сколько стоит ваш сервис?', time: '2 мин назад' },
    { id: 2, name: 'Иван П.', message: 'Можете показать портфолио?', time: '15 мин назад' },
    { id: 3, name: 'Мария К.', message: 'Хочу забукать консультацию', time: '1 час назад' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-400">yourcompany.ourhost.ai</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            target="_blank"
            className="px-4 py-2 border-2 border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <ExternalLink size={18} />
            View Site
          </Link>
          <Link
            to="/dashboard/quick-edit"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Edit size={18} />
            Edit Site
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Визиты</p>
          <p className="text-3xl font-bold">342</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Запросы AI</p>
          <p className="text-3xl font-bold">127</p>
          <p className="text-xs text-gray-500 mt-1">из 500/месяц</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Лиды</p>
          <p className="text-3xl font-bold">23</p>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="text-blue-400" size={20} />
              <h3 className="font-semibold">AI Suggestions</h3>
            </div>
            <p className="text-sm text-gray-300">
              Добавьте больше фото в портфолио для увеличения конверсии
            </p>
          </div>
          <Link
            to="/dashboard/portfolio"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium ml-4"
          >
            View
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-4">Последние запросы</h3>
        <div className="space-y-3">
          {recentRequests.map((request) => (
            <div 
              key={request.id}
              className="flex justify-between items-center pb-3 last:pb-0 border-b border-gray-800 last:border-0 hover:bg-gray-800 hover:mx-[-1rem] hover:px-4 hover:py-2 rounded transition-all cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium">{request.name}</p>
                <p className="text-xs text-gray-500">{request.message}</p>
              </div>
              <span className="text-xs text-gray-400">{request.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


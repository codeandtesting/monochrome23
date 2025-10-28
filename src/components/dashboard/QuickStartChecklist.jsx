import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Palette,
  Briefcase,
  Share2,
  Eye,
  Globe,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

export default function QuickStartChecklist({ siteData, onNavigate }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [checklist, setChecklist] = useState([]);

  // Calculate checklist based on site data
  useEffect(() => {
    if (!siteData) return;

    const tasks = [
      {
        id: 'hero',
        label: 'Настроить главную секцию',
        description: 'Заголовок, слоган и описание компании',
        icon: Sparkles,
        target: 'hero',
        completed: !!(
          siteData.hero?.companyName &&
          siteData.hero?.tagline &&
          siteData.hero?.description
        )
      },
      {
        id: 'services',
        label: 'Добавить услуги',
        description: 'Минимум 3 услуги для демонстрации',
        icon: Briefcase,
        target: 'services',
        completed: !!(
          siteData.services?.items &&
          siteData.services.items.length >= 3
        )
      },
      {
        id: 'design',
        label: 'Выбрать дизайн',
        description: 'Цветовая схема и стиль',
        icon: Palette,
        target: 'visual',
        completed: false // Can be tracked via designSettings
      },
      {
        id: 'portfolio',
        label: 'Добавить портфолио',
        description: 'Примеры ваших работ',
        icon: Award,
        target: 'portfolio',
        completed: false // Portfolio is tracked separately
      },
      {
        id: 'contacts',
        label: 'Указать контакты',
        description: 'Телефон, email, адрес',
        icon: Share2,
        target: 'contacts',
        completed: !!(
          siteData.contacts?.phone ||
          siteData.contacts?.email
        )
      },
      {
        id: 'domain',
        label: 'Подключить домен',
        description: 'Свой уникальный адрес сайта',
        icon: Globe,
        target: 'domain',
        completed: false // Domain connection is Pro feature
      },
      {
        id: 'seo',
        label: 'Настроить SEO',
        description: 'Meta теги для поисковиков',
        icon: TrendingUp,
        target: 'seo-meta',
        completed: false // SEO data tracked separately
      }
    ];

    setChecklist(tasks);
  }, [siteData]);

  const completedCount = checklist.filter((task) => task.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Hide if all completed
  if (completedCount === totalCount && totalCount > 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold">Быстрый старт</h3>
            <p className="text-xs text-gray-400">
              {completedCount} из {totalCount} выполнено
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress Circle */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-800"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                className="text-blue-400 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-400">{Math.round(progress)}%</span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </div>
      </button>

      {/* Checklist Items */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-1">
          {checklist.map((task) => {
            const TaskIcon = task.icon;
            return (
              <button
                key={task.id}
                onClick={() => {
                  if (onNavigate && task.target) {
                    onNavigate(task.target);
                  }
                }}
                disabled={task.completed}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all ${
                  task.completed
                    ? 'bg-gray-800/30 opacity-50 cursor-default'
                    : 'bg-gray-800/50 hover:bg-gray-800/70 cursor-pointer'
                }`}
              >
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 size={18} className="text-green-400" />
                  ) : (
                    <Circle size={18} className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <TaskIcon size={14} className={task.completed ? 'text-gray-500' : 'text-blue-400'} />
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {task.label}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
              </button>
            );
          })}

          {/* Motivational Message */}
          {progress > 0 && progress < 100 && (
            <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400 text-center">
                {progress >= 75
                  ? '🎉 Почти готово! Завершите оставшиеся задачи'
                  : progress >= 50
                  ? '💪 Отличная работа! Продолжайте в том же духе'
                  : progress >= 25
                  ? '🚀 Хорошее начало! Продолжайте настройку'
                  : '👋 Добро пожаловать! Начните с настройки Hero секции'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

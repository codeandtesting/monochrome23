import React, { useState } from 'react';
import {
  Pencil,
  Briefcase,
  Palette,
  Image,
  MessageSquare,
  BarChart3,
  Phone,
  Share2,
  Globe,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Search,
  FileText,
  Tag,
  Chrome
} from 'lucide-react';

const TAB_GROUPS = [
  {
    id: 'essentials',
    name: 'Основные настройки',
    description: 'Главный контент вашего сайта',
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-500',
    tabs: [
      { id: 'hero', label: 'Hero / Главная', icon: Pencil, badge: null },
      { id: 'services', label: 'Услуги', icon: Briefcase, badge: null },
      { id: 'visual', label: 'Дизайн и цвета', icon: Palette, badge: null },
      { id: 'favicon', label: 'Favicon', icon: Chrome, badge: null }
    ]
  },
  {
    id: 'content',
    name: 'Контент и медиа',
    description: 'Портфолио и отзывы',
    icon: Image,
    gradient: 'from-purple-500 to-pink-500',
    tabs: [
      { id: 'portfolio', label: 'Портфолио', icon: Image, badge: null },
      { id: 'testimonials', label: 'Отзывы', icon: MessageSquare, badge: null },
      { id: 'stats', label: 'Статистика', icon: BarChart3, badge: null }
    ]
  },
  {
    id: 'contacts',
    name: 'Контакты и связь',
    description: 'Как с вами связаться',
    icon: Phone,
    gradient: 'from-green-500 to-emerald-500',
    tabs: [
      { id: 'contacts', label: 'Контактная информация', icon: Phone, badge: null },
      { id: 'social', label: 'Социальные сети', icon: Share2, badge: null }
    ]
  },
  {
    id: 'seo',
    name: 'SEO и продвижение',
    description: 'Оптимизация для поисковиков',
    icon: Search,
    gradient: 'from-orange-500 to-red-500',
    tabs: [
      { id: 'domain', label: 'Домен', icon: Globe, badge: 'Pro' },
      { id: 'seo-meta', label: 'Meta теги', icon: Tag, badge: null },
      { id: 'seo-content', label: 'SEO контент', icon: FileText, badge: 'AI' },
      { id: 'seo-social', label: 'Open Graph', icon: Share2, badge: null }
    ]
  }
];

export default function GroupedTabs({ activeSection, onTabChange }) {
  const [expandedGroups, setExpandedGroups] = useState(['essentials']); // First group expanded by default
  const [hoveredTab, setHoveredTab] = useState(null);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isTabActive = (tabId) => activeSection === tabId;
  const isGroupActive = (group) => group.tabs.some(tab => tab.id === activeSection);

  return (
    <div className="space-y-1.5">
      {TAB_GROUPS.map((group) => {
        const GroupIcon = group.icon;
        const isExpanded = expandedGroups.includes(group.id);
        const isActive = isGroupActive(group);

        return (
          <div
            key={group.id}
            className={`rounded-lg border transition-all ${
              isActive
                ? 'border-gray-700/50 bg-gray-900/30'
                : 'border-gray-800/50 bg-gray-900/20'
            }`}
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-800/20 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                {/* Icon with gradient */}
                <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${group.gradient} opacity-80 flex items-center justify-center flex-shrink-0`}>
                  <GroupIcon size={14} className="text-white" />
                </div>

                {/* Text */}
                <div className="text-left">
                  <h3 className="text-xs font-medium text-white">
                    {group.name}
                  </h3>
                </div>
              </div>

              {/* Expand indicator */}
              <div className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                <ChevronDown size={14} className="text-gray-600" />
              </div>
            </button>

            {/* Group Tabs */}
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-2 pb-1.5 space-y-0.5">
                {group.tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isTabActiveState = isTabActive(tab.id);

                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={`w-full px-3 py-1.5 rounded-md flex items-center justify-between transition-all ${
                        isTabActiveState
                          ? `bg-gradient-to-r ${group.gradient} bg-opacity-20 border-l-2 border-l-current`
                          : 'bg-transparent hover:bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <TabIcon
                          size={13}
                          className={`transition-colors ${
                            isTabActiveState ? 'text-white' : 'text-gray-500'
                          }`}
                        />
                        <span className={`text-xs font-normal transition-colors ${
                          isTabActiveState ? 'text-white' : 'text-gray-400'
                        }`}>
                          {tab.label}
                        </span>
                      </div>

                      {/* Badge */}
                      {tab.badge && (
                        <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-medium rounded">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Tips */}
      <div className="mt-3 p-3 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center flex-shrink-0 border border-blue-500/20">
            <Sparkles size={11} className="text-blue-400" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-blue-400 mb-0.5">
              Tip
            </h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Start with essentials, then add media
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

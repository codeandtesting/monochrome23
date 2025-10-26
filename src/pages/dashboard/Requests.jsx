import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Image as ImageIcon, Calendar } from 'lucide-react';
import { getChatsBySite, getChatPreview, getTimeAgo } from '../../utils/chatStorage';
import { getActiveSite } from '../../utils/sitesStorage';

export default function Requests() {
  const [activeTab, setActiveTab] = useState('all');
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({ total: 0, conversations: 0, leads: 0, bookings: 0 });
  const navigate = useNavigate();

  // Загрузить чаты из localStorage при монтировании
  useEffect(() => {
    loadChats();
    
    // Обновлять при смене активного сайта
    const handleSiteChange = () => {
      loadChats();
    };
    
    window.addEventListener('activeSiteChanged', handleSiteChange);
    window.addEventListener('sitesUpdated', handleSiteChange);
    
    return () => {
      window.removeEventListener('activeSiteChanged', handleSiteChange);
      window.removeEventListener('sitesUpdated', handleSiteChange);
    };
  }, []);

  const loadChats = () => {
    const activeSite = getActiveSite();
    const siteChats = activeSite ? getChatsBySite(activeSite.id) : [];
    setChats(siteChats);
    
    // Подсчитываем статистику для текущего сайта
    const siteStats = {
      total: siteChats.length,
      conversations: siteChats.filter(c => c.status === 'conversation').length,
      leads: siteChats.filter(c => c.status === 'lead').length,
      bookings: siteChats.filter(c => c.status === 'booking').length,
    };
    setStats(siteStats);
  };

  // Преобразуем чаты в формат для отображения
  const requests = chats.map(chat => ({
    id: chat.id,
    name: chat.userInfo.name || 'Анонимный',
    email: chat.userInfo.email || '-',
    preview: getChatPreview(chat.messages),
    status: chat.status === 'booking' ? 'Букинг' : 
            chat.status === 'lead' ? 'Лид' : 'Вопрос',
    action: chat.action || `💬 ${chat.messages.filter(m => m.role === 'user').length} сообщений`,
    time: getTimeAgo(chat.updatedAt),
    type: chat.status,
    source: chat.source === 'client' ? '🌐 Client Site' : '💬 Main Chat'
  }));

  const tabs = [
    { id: 'all', label: 'Все', count: stats.total },
    { id: 'conversation', label: 'Чаты', count: stats.conversations },
    { id: 'lead', label: 'Лиды', count: stats.leads },
    { id: 'booking', label: 'Букинги', count: stats.bookings },
  ];

  const filteredRequests = activeTab === 'all' 
    ? requests 
    : requests.filter(req => req.type === activeTab);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Запросы клиентов</h1>
        <p className="text-sm text-gray-500">Все обращения с ваших сайтов</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 text-gray-400'
            }`}
          >
            {tab.label} <span className="text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-2.5">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/30 border border-gray-800/50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-3">
              <Mail className="text-gray-600" size={20} />
            </div>
            <p className="text-gray-400 mb-1 text-sm font-medium">Нет запросов</p>
            <p className="text-xs text-gray-600">
              Чаты с главной страницы появятся здесь автоматически
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => navigate(`/dashboard/requests/${request.id}`)}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:bg-gray-800/50 hover:border-gray-700 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-sm font-medium border border-gray-700 group-hover:border-gray-600 transition-colors">
                    {request.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{request.name}</p>
                      <span className="text-xs text-gray-600">{request.source}</span>
                    </div>
                    <p className="text-xs text-gray-600">{request.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  request.status === 'Лид' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  request.status === 'Букинг' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {request.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2.5 line-clamp-2">{request.preview}</p>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>{request.action}</span>
                <span>{request.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


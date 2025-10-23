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
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-gray-400 mb-2">Нет запросов</p>
            <p className="text-sm text-gray-500">
              Чаты с главной страницы появятся здесь автоматически
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => navigate(`/dashboard/requests/${request.id}`)}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:bg-gray-850 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {request.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{request.name}</p>
                      <span className="text-xs text-gray-500">{request.source}</span>
                    </div>
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
          ))
        )}
      </div>
    </div>
  );
}


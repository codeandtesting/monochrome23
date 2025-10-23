import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Edit, Lightbulb, Pencil, Plus, ChevronDown, Check, Globe } from 'lucide-react';
import { getChatsBySite, getChatPreview, getTimeAgo } from '../../utils/chatStorage';
import { getActiveSite, getAllSites, setActiveSite, getActiveSiteId } from '../../utils/sitesStorage';

export default function DashboardHome() {
  const [stats, setStats] = useState({ total: 0, conversations: 0, leads: 0, bookings: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [activeSite, setActiveSiteState] = useState(null);
  const [allSites, setAllSites] = useState([]);
  const [totalSites, setTotalSites] = useState(0);
  const [showSiteSelector, setShowSiteSelector] = useState(false);
  const selectorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    
    const handleActiveSiteChange = () => {
      loadData();
    };
    
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowSiteSelector(false);
      }
    };
    
    window.addEventListener('activeSiteChanged', handleActiveSiteChange);
    window.addEventListener('sitesUpdated', handleActiveSiteChange);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('activeSiteChanged', handleActiveSiteChange);
      window.removeEventListener('sitesUpdated', handleActiveSiteChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadData = () => {
    const site = getActiveSite();
    const sites = getAllSites();
    
    // Если нет сайтов, перенаправляем на onboarding
    if (!site) {
      navigate('/onboarding');
      return;
    }
    
    setActiveSiteState(site);
    setAllSites(sites);
    setTotalSites(sites.length);
    
    // Получаем чаты только для текущего сайта
    const siteChats = getChatsBySite(site.id);
    
    // Подсчитываем статистику для текущего сайта
    const siteStats = {
      total: siteChats.length,
      conversations: siteChats.filter(c => c.status === 'conversation').length,
      leads: siteChats.filter(c => c.status === 'lead').length,
      bookings: siteChats.filter(c => c.status === 'booking').length,
    };
    setStats(siteStats);
    
    // Берем 3 последних чата этого сайта
    const recent = siteChats.slice(0, 3).map(chat => ({
      id: chat.id,
      name: chat.userInfo.name || 'Анонимный пользователь',
      message: getChatPreview(chat.messages),
      time: getTimeAgo(chat.updatedAt)
    }));
    
    setRecentRequests(recent);
  };

  const handleSelectSite = (siteId) => {
    setActiveSite(siteId);
    setShowSiteSelector(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="relative" ref={selectorRef}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">M</span>
            </div>
            <h1 className="text-3xl font-bold">Monochrome</h1>
          </div>
          <div 
            onClick={() => totalSites > 1 && setShowSiteSelector(!showSiteSelector)}
            className={`flex items-center gap-3 ${totalSites > 1 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          >
            <p className="text-gray-400">
              {activeSite ? `${activeSite.name}.ourhost.ai` : 'Loading...'}
            </p>
            {totalSites > 1 && (
              <>
                <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                  {totalSites} sites
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform ${showSiteSelector ? 'rotate-180' : ''}`}
                />
              </>
            )}
          </div>

          {/* Sites Dropdown */}
          {showSiteSelector && totalSites > 1 && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {allSites.map(site => (
                  <div
                    key={site.id}
                    onClick={() => handleSelectSite(site.id)}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors ${
                      site.id === activeSite?.id ? 'bg-gray-700' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                      site.id === activeSite?.id
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                        : 'bg-gray-700'
                    }`}>
                      {site.id === activeSite?.id ? (
                        <Check size={18} className="text-white" />
                      ) : (
                        <Globe size={18} className="text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {site.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Updated {new Date(site.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            to="/onboarding/ai-wizard/step1"
            className="px-4 py-2 border-2 border-green-500 border-opacity-30 text-green-400 rounded-lg hover:bg-green-500 hover:bg-opacity-10 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            New Site
          </Link>
          <Link
            to={activeSite?.url || '/'}
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
            <Pencil size={18} />
            Edit Site
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Всего чатов</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Запросы AI</p>
          <p className="text-3xl font-bold">{stats.conversations}</p>
          <p className="text-xs text-gray-500 mt-1">разговоры</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Лиды</p>
          <p className="text-3xl font-bold">{stats.leads}</p>
          <p className="text-xs text-gray-500 mt-1">+{stats.bookings} букингов</p>
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Последние запросы</h3>
          <Link 
            to="/dashboard/requests" 
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Все →
          </Link>
        </div>
        <div className="space-y-3">
          {recentRequests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Пока нет запросов. Чаты с главной страницы появятся здесь.
            </p>
          ) : (
            recentRequests.map((request) => (
              <div 
                key={request.id}
                onClick={() => navigate(`/dashboard/requests/${request.id}`)}
                className="flex justify-between items-center pb-3 last:pb-0 border-b border-gray-800 last:border-0 hover:bg-gray-800 hover:mx-[-1rem] hover:px-4 hover:py-2 rounded transition-all cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium">{request.name}</p>
                  <p className="text-xs text-gray-500">{request.message}</p>
                </div>
                <span className="text-xs text-gray-400">{request.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


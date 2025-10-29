import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Edit, Lightbulb, Plus, ChevronDown, Check, Globe } from 'lucide-react';
import { getChatsBySite, getChatPreview, getTimeAgo } from '../../utils/chatStorage';
import { getActiveSite, getAllSites, setActiveSite, getActiveSiteId } from '../../utils/sitesStorage';
import OnboardingChecklist from '../../components/OnboardingChecklist';
import CountUp from 'react-countup';

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
    // Перезагружаем данные вместо reload всей страницы
    setTimeout(() => {
      loadData();
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start sm:justify-between gap-4">
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
            <div className="absolute top-full left-0 mt-2 w-full sm:w-80 max-w-[calc(100vw-2rem)] bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-sm animate-fadeIn">
              <div className="max-h-64 overflow-y-auto">
                {allSites.map((site, index) => (
                  <div
                    key={site.id}
                    onClick={() => handleSelectSite(site.id)}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 cursor-pointer transition-all group animate-fadeInUp ${
                      site.id === activeSite?.id ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-2 border-blue-500' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 ${
                      site.id === activeSite?.id
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                        : 'bg-gray-700 group-hover:bg-gray-600'
                    }`}>
                      {site.id === activeSite?.id ? (
                        <Check size={18} className="text-white" />
                      ) : (
                        <Globe size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate transition-colors ${
                        site.id === activeSite?.id ? 'text-blue-400' : 'text-white group-hover:text-blue-400'
                      }`}>
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
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/onboarding/ai-wizard/step1"
            className="group px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-lg hover:shadow-green-500/50"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            New Site
          </Link>
          <Link
            to={activeSite?.url || '/'}
            target="_blank"
            className="group px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            View Site
          </Link>
        </div>
      </div>

      {/* Onboarding Checklist */}
      <OnboardingChecklist />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 rounded-lg p-5 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Всего чатов</p>
          <p className="text-2xl font-semibold text-blue-400">
            <CountUp end={stats.total} duration={2} />
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-lg p-5 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Запросы AI</p>
          <p className="text-2xl font-semibold text-purple-400">
            <CountUp end={stats.conversations} duration={2} />
          </p>
          <p className="text-xs text-gray-500 mt-1.5">разговоры</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-lg p-5 hover:border-green-500/40 transition-all hover:shadow-lg hover:shadow-green-500/10">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Лиды</p>
          <p className="text-2xl font-semibold text-green-400">
            <CountUp end={stats.leads} duration={2} />
          </p>
          <p className="text-xs text-gray-500 mt-1.5">
            +<CountUp end={stats.bookings} duration={2} /> букингов
          </p>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="relative bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg p-6 overflow-hidden group hover:border-blue-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
        <div className="relative flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                <Lightbulb className="text-blue-400" size={18} />
              </div>
              <h3 className="font-medium text-base">AI Suggestions</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Добавьте больше фото в портфолио для увеличения конверсии
            </p>
          </div>
          <Link
            to="/dashboard/portfolio"
            className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/50 transition-all text-sm font-medium ml-4"
          >
            View
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all overflow-hidden">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-medium text-base">Последние запросы</h3>
          <Link
            to="/dashboard/requests"
            className="text-xs text-gray-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            Все
            <span>→</span>
          </Link>
        </div>
        <div className="space-y-3">
          {recentRequests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Пока нет запросов. Чаты с главной страницы появятся здесь.
            </p>
          ) : (
            recentRequests.map((request, index) => (
              <div
                key={request.id}
                onClick={() => navigate(`/dashboard/requests/${request.id}`)}
                className="flex justify-between items-center pb-3 last:pb-0 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 hover:mx-[-0.5rem] hover:px-2 hover:py-1.5 rounded transition-all cursor-pointer group/item"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 group-hover/item:border-blue-500/50 transition-colors">
                    <span className="text-xs font-medium text-gray-400 group-hover/item:text-blue-400">{request.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-normal group-hover/item:text-white transition-colors">{request.name}</p>
                    <p className="text-xs text-gray-500">{request.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{request.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


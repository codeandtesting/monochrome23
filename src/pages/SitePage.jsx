import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSiteByUrl } from '../utils/sitesStorage';
import ChatPage from './ChatPage';
image.pngimport ClientSitePage from './ClientSitePage';

export default function SitePage() {
  const location = useLocation();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSite();
    
    const handleSiteUpdate = () => {
      loadSite();
    };
    
    window.addEventListener('siteDataUpdated', handleSiteUpdate);
    window.addEventListener('sitesUpdated', handleSiteUpdate);
    window.addEventListener('designSettingsUpdated', handleSiteUpdate);
    window.addEventListener('activeSiteChanged', handleSiteUpdate);
    
    return () => {
      window.removeEventListener('siteDataUpdated', handleSiteUpdate);
      window.removeEventListener('sitesUpdated', handleSiteUpdate);
      window.removeEventListener('designSettingsUpdated', handleSiteUpdate);
      window.removeEventListener('activeSiteChanged', handleSiteUpdate);
    };
  }, [location.pathname]);

  const loadSite = () => {
    const currentSite = getSiteByUrl(location.pathname);
    
    if (!currentSite) {
      // Если сайт не найден, показываем 404 или редирект
      setLoading(false);
      return;
    }
    
    setSite(currentSite);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400">Site not found</p>
        </div>
      </div>
    );
  }

  // Выбираем layout на основе настроек сайта
  const isMainLayout = site.design?.activeLanding === 'main';
  
  // Main Landing - оригинальный ChatPage (только чат)
  if (isMainLayout) {
    return <ChatPage siteData={site} />;
  }
  
  // Client Site - Split layout с контентом слева и чатом справа
  return <ClientSitePage siteData={site} />;
}


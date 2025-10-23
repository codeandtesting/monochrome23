import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, Check, Globe, Trash2, ExternalLink } from 'lucide-react';
import { getAllSites, getActiveSiteId, setActiveSite, deleteSite } from '../../utils/sitesStorage';

export default function SiteSelector() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [activeSiteId, setActiveSiteId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadSites();
    
    const handleSitesUpdate = () => loadSites();
    const handleActiveSiteChange = () => {
      setActiveSiteId(getActiveSiteId());
    };
    
    window.addEventListener('sitesUpdated', handleSitesUpdate);
    window.addEventListener('activeSiteChanged', handleActiveSiteChange);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('sitesUpdated', handleSitesUpdate);
      window.removeEventListener('activeSiteChanged', handleActiveSiteChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadSites = () => {
    const allSites = getAllSites();
    setSites(allSites);
    setActiveSiteId(getActiveSiteId());
  };

  const handleSelectSite = (siteId) => {
    setActiveSite(siteId);
    setIsOpen(false);
    // Reload page data
    window.location.reload();
  };

  const handleDeleteSite = (e, siteId) => {
    e.stopPropagation();
    
    if (sites.length === 1) {
      alert('Cannot delete the last site');
      return;
    }
    
    if (confirm('Are you sure you want to delete this site?')) {
      deleteSite(siteId);
      loadSites();
    }
  };

  const handleCreateNewSite = () => {
    setIsOpen(false);
    navigate('/onboarding/ai-wizard/step1');
  };

  const activeSite = sites.find(site => site.id === activeSiteId);

  if (sites.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Site Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all w-full min-w-[240px]"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center flex-shrink-0">
          <Globe size={18} className="text-white" />
        </div>
        
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-white truncate">
            {activeSite?.name || 'Select Site'}
          </p>
          <p className="text-xs text-gray-400">
            {sites.length} {sites.length === 1 ? 'site' : 'sites'}
          </p>
        </div>
        
        <ChevronDown 
          size={18} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Sites List */}
          <div className="max-h-64 overflow-y-auto">
            {sites.map(site => (
              <div
                key={site.id}
                onClick={() => handleSelectSite(site.id)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors ${
                  site.id === activeSiteId ? 'bg-gray-700' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                  site.id === activeSiteId 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                    : 'bg-gray-700'
                }`}>
                  {site.id === activeSiteId ? (
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
                
                {sites.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteSite(e, site.id)}
                    className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
                    title="Delete site"
                  >
                    <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Create New Site Button */}
          <div className="border-t border-gray-700">
            <button
              onClick={handleCreateNewSite}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded flex items-center justify-center">
                <Plus size={18} className="text-green-400" />
              </div>
              <span className="text-sm font-medium text-green-400">Create New Site</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


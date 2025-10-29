import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Check, Trash2, Plus, ExternalLink, Pencil } from 'lucide-react';
import { getAllSites, getActiveSiteId, setActiveSite, deleteSite } from '../../utils/sitesStorage';

export default function MySites() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [activeSiteId, setActiveSiteIdState] = useState(null);

  useEffect(() => {
    loadSites();
    
    const handleSitesUpdate = () => loadSites();
    
    window.addEventListener('sitesUpdated', handleSitesUpdate);
    window.addEventListener('activeSiteChanged', handleSitesUpdate);
    
    return () => {
      window.removeEventListener('sitesUpdated', handleSitesUpdate);
      window.removeEventListener('activeSiteChanged', handleSitesUpdate);
    };
  }, []);

  const loadSites = () => {
    const allSites = getAllSites();
    setSites(allSites);
    setActiveSiteIdState(getActiveSiteId());
  };

  const handleSelectSite = (siteId) => {
    setActiveSite(siteId);
    navigate('/dashboard');
  };

  const handleDeleteSite = (siteId) => {
    if (sites.length === 1) {
      alert('Cannot delete the last site');
      return;
    }
    
    if (confirm('Are you sure you want to delete this site? All data will be lost.')) {
      deleteSite(siteId);
      loadSites();
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-0.5">My Sites</h1>
          <p className="text-gray-500 text-sm">Manage your websites</p>
        </div>
        <button
          onClick={() => navigate('/onboarding/ai-wizard/step1')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-green-500/20"
        >
          <Plus size={16} />
          Create New Site
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sites.map(site => (
          <div
            key={site.id}
            className={`group relative bg-gradient-to-br from-gray-900 to-gray-900/50 border rounded-lg p-4 transition-all hover:shadow-lg ${
              site.id === activeSiteId
                ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            {/* Active Badge */}
            {site.id === activeSiteId && (
              <div className="absolute top-3 right-3">
                <div className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-medium text-blue-400">Active</span>
                </div>
              </div>
            )}

            {/* Site Header */}
            <div className="mb-4">
              <h3 className="font-medium text-base truncate mb-1">{site.name}</h3>
              <p className="text-xs text-gray-500 truncate">{site.url}</p>
            </div>

            {/* Site Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500 mb-0.5">Services</div>
                <div className="text-base font-semibold text-white">{site.services?.length || 0}</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500 mb-0.5">Portfolio</div>
                <div className="text-base font-semibold text-white">{site.portfolio?.length || 0}</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500 mb-0.5">Updated</div>
                <div className="text-[10px] font-medium text-gray-400">
                  {new Date(site.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {site.id !== activeSiteId ? (
                <button
                  onClick={() => handleSelectSite(site.id)}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-xs font-medium"
                >
                  Switch to This Site
                </button>
              ) : (
                <button
                  onClick={() => navigate('/dashboard/quick-edit')}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 transition-all text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              )}

              <Link
                to={site.url}
                target="_blank"
                className="px-3 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800/50 hover:text-white transition-all flex items-center justify-center"
                title="View site"
              >
                <ExternalLink size={14} />
              </Link>

              {sites.length > 1 && (
                <button
                  onClick={() => handleDeleteSite(site.id)}
                  className="px-3 py-2 border border-gray-700 text-gray-500 rounded-lg hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all"
                  title="Delete site"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sites.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center">
            <Globe size={32} className="text-gray-600" />
          </div>
          <h3 className="text-lg font-medium mb-1">No sites yet</h3>
          <p className="text-gray-500 text-sm mb-6">Create your first website to get started</p>
          <button
            onClick={() => navigate('/onboarding/ai-wizard/step1')}
            className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all inline-flex items-center gap-2 text-sm font-medium shadow-lg shadow-green-500/20"
          >
            <Plus size={16} />
            Create New Site
          </button>
        </div>
      )}
    </div>
  );
}


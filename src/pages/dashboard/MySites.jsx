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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Sites</h1>
          <p className="text-gray-400">Manage your websites</p>
        </div>
        <button
          onClick={() => navigate('/onboarding/ai-wizard/step1')}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Create New Site
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map(site => (
          <div
            key={site.id}
            className={`bg-gray-900 border-2 rounded-lg p-5 transition-all ${
              site.id === activeSiteId
                ? 'border-blue-500'
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            {/* Site Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  site.id === activeSiteId
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                    : 'bg-gray-800'
                }`}>
                  {site.id === activeSiteId ? (
                    <Check size={24} className="text-white" />
                  ) : (
                    <Globe size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{site.name}</h3>
                  {site.id === activeSiteId && (
                    <span className="text-xs text-blue-400">Active</span>
                  )}
                </div>
              </div>
            </div>

            {/* Site Info */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">URL:</span>
                <span className="text-white font-medium">{site.url}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Services:</span>
                <span className="text-white font-medium">{site.services?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Portfolio:</span>
                <span className="text-white font-medium">{site.portfolio?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Updated:</span>
                <span className="text-white font-medium">
                  {new Date(site.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                to={site.url}
                target="_blank"
                className="px-3 py-2 border border-gray-700 text-gray-300 rounded hover:bg-gray-800 transition-colors flex items-center justify-center"
                title="View site"
              >
                <ExternalLink size={16} />
              </Link>
              
              {site.id !== activeSiteId ? (
                <button
                  onClick={() => handleSelectSite(site.id)}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Switch to This Site
                </button>
              ) : (
                <button
                  onClick={() => navigate('/dashboard/quick-edit')}
                  className="flex-1 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Pencil size={16} />
                  Edit Site
                </button>
              )}
              
              {sites.length > 1 && (
                <button
                  onClick={() => handleDeleteSite(site.id)}
                  className="px-3 py-2 border border-red-500 border-opacity-30 text-red-400 rounded hover:bg-red-500 hover:bg-opacity-10 transition-colors"
                  title="Delete site"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sites.length === 0 && (
        <div className="text-center py-12">
          <Globe size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold mb-2">No sites yet</h3>
          <p className="text-gray-400 mb-4">Create your first website to get started</p>
          <button
            onClick={() => navigate('/onboarding/ai-wizard/step1')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Site
          </button>
        </div>
      )}
    </div>
  );
}


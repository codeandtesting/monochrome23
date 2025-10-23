import React, { useState, useEffect } from 'react';
import { Plus, X, Image as ImageIcon, Video, FileText, Link as LinkIcon, Save } from 'lucide-react';
import { getActiveSite, updateSite } from '../../utils/sitesStorage';

export default function Portfolio() {
  const [currentSite, setCurrentSite] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [activeTab, setActiveTab] = useState('photos');
  const [stats, setStats] = useState({ total: 0, images: 0, videos: 0, cases: 0, links: 0 });
  
  // Photos
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('Web Development');
  const [showAddImageForm, setShowAddImageForm] = useState(false);
  
  // Videos
  const [videos, setVideos] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  
  // Cases
  const [cases, setCases] = useState([]);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDescription, setNewCaseDescription] = useState('');
  
  // Links
  const [links, setLinks] = useState([]);
  const [newLinkPlatform, setNewLinkPlatform] = useState('behance');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    loadPortfolio();
    
    const handleSiteChange = () => {
      loadPortfolio();
    };
    
    window.addEventListener('activeSiteChanged', handleSiteChange);
    window.addEventListener('sitesUpdated', handleSiteChange);
    
    return () => {
      window.removeEventListener('activeSiteChanged', handleSiteChange);
      window.removeEventListener('sitesUpdated', handleSiteChange);
    };
  }, []);

  const loadPortfolio = () => {
    const site = getActiveSite();
    if (site) {
      setCurrentSite(site);
      const portfolioItems = site.portfolio || [];
      setPortfolio(portfolioItems);
      
      const imgs = portfolioItems.filter(item => item.type === 'image');
      const vids = portfolioItems.filter(item => item.type === 'video');
      const csss = portfolioItems.filter(item => item.type === 'case');
      const lnks = portfolioItems.filter(item => item.type === 'link');
      
      setImages(imgs);
      setVideos(vids);
      setCases(csss);
      setLinks(lnks);
      setStats({
        total: portfolioItems.length,
        images: imgs.length,
        videos: vids.length,
        cases: csss.length,
        links: lnks.length
      });
    }
  };

  const savePortfolio = (updatedPortfolio) => {
    if (currentSite) {
      updateSite(currentSite.id, { portfolio: updatedPortfolio });
      loadPortfolio();
      window.dispatchEvent(new Event('portfolioUpdated'));
    }
  };

  // Image handlers
  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      alert('Пожалуйста, введите URL изображения');
      return;
    }

    const newItem = {
      id: `portfolio_${Date.now()}`,
      type: 'image',
      url: newImageUrl,
      title: newImageTitle || 'Untitled',
      category: newImageCategory
    };

    savePortfolio([...portfolio, newItem]);
    setNewImageUrl('');
    setNewImageTitle('');
    setNewImageCategory('Web Development');
    setShowAddImageForm(false);
  };

  const handleDeleteImage = (itemId) => {
    if (window.confirm('Удалить это изображение из портфолио?')) {
      const updatedPortfolio = portfolio.filter(item => item.id !== itemId);
      savePortfolio(updatedPortfolio);
    }
  };

  // Video handlers
  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) {
      alert('Пожалуйста, введите URL видео');
      return;
    }

    const newItem = {
      id: `portfolio_${Date.now()}`,
      type: 'video',
      url: newVideoUrl,
      title: newVideoTitle || 'Untitled Video'
    };

    savePortfolio([...portfolio, newItem]);
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const handleDeleteVideo = (itemId) => {
    if (window.confirm('Удалить это видео?')) {
      const updatedPortfolio = portfolio.filter(item => item.id !== itemId);
      savePortfolio(updatedPortfolio);
    }
  };

  // Case handlers
  const handleAddCase = () => {
    if (!newCaseTitle.trim()) {
      alert('Пожалуйста, введите название кейса');
      return;
    }

    const newItem = {
      id: `portfolio_${Date.now()}`,
      type: 'case',
      title: newCaseTitle,
      description: newCaseDescription
    };

    savePortfolio([...portfolio, newItem]);
    setNewCaseTitle('');
    setNewCaseDescription('');
  };

  const handleDeleteCase = (itemId) => {
    if (window.confirm('Удалить этот кейс?')) {
      const updatedPortfolio = portfolio.filter(item => item.id !== itemId);
      savePortfolio(updatedPortfolio);
    }
  };

  // Link handlers
  const handleAddLink = () => {
    if (!newLinkUrl.trim()) {
      alert('Пожалуйста, введите URL');
      return;
    }

    const newItem = {
      id: `portfolio_${Date.now()}`,
      type: 'link',
      platform: newLinkPlatform,
      url: newLinkUrl
    };

    savePortfolio([...portfolio, newItem]);
    setNewLinkPlatform('behance');
    setNewLinkUrl('');
  };

  const handleDeleteLink = (itemId) => {
    if (window.confirm('Удалить эту ссылку?')) {
      const updatedPortfolio = portfolio.filter(item => item.id !== itemId);
      savePortfolio(updatedPortfolio);
    }
  };

  const tabs = [
    { id: 'photos', label: `📷 Фото (${stats.images})`, icon: ImageIcon },
    { id: 'videos', label: `🎥 Видео (${stats.videos})`, icon: Video },
    { id: 'cases', label: `📝 Кейсы (${stats.cases})`, icon: FileText },
    { id: 'links', label: `🔗 Ссылки (${stats.links})`, icon: LinkIcon },
  ];

  const categories = [
    'Web Development',
    'Mobile Development',
    'Blockchain',
    'Web3',
    'Gaming',
    'E-commerce',
    'DeFi',
    'NFT',
    'Other'
  ];

  const platforms = [
    { value: 'behance', label: 'Behance' },
    { value: 'github', label: 'GitHub' },
    { value: 'dribbble', label: 'Dribbble' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'website', label: 'Website' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Портфолио</h1>
          <p className="text-gray-400 text-sm">Управление контентом для галереи в чате</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          📊 Всего: <strong>{stats.total}</strong> элементов 
          ({stats.images} фото, {stats.videos} видео, {stats.cases} кейсов, {stats.links} ссылок)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 bg-opacity-10 text-blue-400 border border-blue-500 border-opacity-30'
                : 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* Add Form */}
          {showAddImageForm && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Добавить изображение</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">URL изображения *</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название проекта</label>
                  <input
                    type="text"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    placeholder="My Project"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
                  <select
                    value={newImageCategory}
                    onChange={(e) => setNewImageCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddImage}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setShowAddImageForm(false);
                    setNewImageUrl('');
                    setNewImageTitle('');
                  }}
                  className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium">Фотографии работ</label>
              {!showAddImageForm && (
                <button
                  onClick={() => setShowAddImageForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Добавить фото
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                    <p className="text-white font-medium text-sm px-2 text-center mb-1">{item.title}</p>
                    <p className="text-gray-300 text-xs px-2 text-center mb-3">{item.category}</p>
                    
                    <button
                      onClick={() => handleDeleteImage(item.id)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs flex items-center gap-1"
                    >
                      <X size={14} />
                      Удалить
                    </button>
                  </div>
                  
                  {!item.isDefault && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Ваше
                    </div>
                  )}
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-gray-400 mb-2">Нет изображений</p>
                <button
                  onClick={() => setShowAddImageForm(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Добавить первое фото
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <label className="block text-sm font-medium mb-4">Видео (YouTube, Vimeo)</label>
            
            {/* Video List */}
            <div className="space-y-3 mb-4">
              {videos.map((video) => (
                <div key={video.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{video.title}</p>
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 break-all"
                      >
                        {video.url}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="ml-3 px-3 py-1.5 bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 rounded-lg transition-colors text-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Video */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Добавить видео</h3>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Название</label>
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="Demo Video"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">URL *</label>
                <input
                  type="url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleAddVideo}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-sm transition-colors"
              >
                <Plus size={16} />
                Добавить видео
              </button>
            </div>

            {videos.length === 0 && (
              <div className="text-center py-8 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Нет видео. Добавьте первое!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <label className="block text-sm font-medium mb-4">Кейсы / Описание работ</label>
            
            {/* Cases List */}
            <div className="space-y-4 mb-4">
              {cases.map((caseItem, index) => (
                <div key={caseItem.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">Кейс {index + 1}</h3>
                    <button
                      onClick={() => handleDeleteCase(caseItem.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Название:</p>
                      <p className="font-medium">{caseItem.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Описание:</p>
                      <p className="text-sm text-gray-300">{caseItem.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Case */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Добавить кейс</h3>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Название кейса *</label>
                <input
                  type="text"
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  placeholder="Реставрация кожаного дивана"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Описание проекта</label>
                <textarea
                  value={newCaseDescription}
                  onChange={(e) => setNewCaseDescription(e.target.value)}
                  placeholder="Полное восстановление кожаной обивки дивана с заменой наполнителя"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleAddCase}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-sm transition-colors"
              >
                <Plus size={16} />
                Добавить кейс
              </button>
            </div>

            {cases.length === 0 && (
              <div className="text-center py-8 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Нет кейсов. Добавьте первый!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <label className="block text-sm font-medium mb-4">Внешние ссылки</label>
            
            {/* Links List */}
            <div className="space-y-3 mb-4">
              {links.map((link) => (
                <div key={link.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-gray-800 rounded text-xs font-medium">
                      {link.platform}
                    </div>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 break-all"
                    >
                      {link.url}
                    </a>
                  </div>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="ml-3 px-3 py-1.5 bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 rounded-lg transition-colors text-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Link */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Добавить ссылку</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Платформа</label>
                  <select
                    value={newLinkPlatform}
                    onChange={(e) => setNewLinkPlatform(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {platforms.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">URL *</label>
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleAddLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-sm transition-colors"
              >
                <Plus size={16} />
                Добавить ссылку
              </button>
            </div>

            {links.length === 0 && (
              <div className="text-center py-8 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Нет ссылок. Добавьте первую!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

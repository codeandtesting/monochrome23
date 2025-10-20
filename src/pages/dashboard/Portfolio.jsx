import React, { useState } from 'react';
import { Plus, X, Upload, Image as ImageIcon, Video, FileText, Link as LinkIcon } from 'lucide-react';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('photos');
  
  const [photos, setPhotos] = useState([
    '/portfolio/1a.jpg',
    '/portfolio/2a.jpg',
    '/portfolio/3a.jpg',
  ]);

  const [videos, setVideos] = useState([
    'https://youtube.com/watch?v=example1',
    'https://vimeo.com/example2',
  ]);

  const [cases, setCases] = useState([
    { title: 'Реставрация кожаного дивана', description: 'Полное восстановление кожаной обивки дивана с заменой наполнителя' },
  ]);

  const [links, setLinks] = useState([
    { platform: 'behance', url: 'https://behance.net/yourprofile' },
  ]);

  const tabs = [
    { id: 'photos', label: '📷 Фото', icon: ImageIcon },
    { id: 'videos', label: '🎥 Видео', icon: Video },
    { id: 'cases', label: '📝 Кейсы', icon: FileText },
    { id: 'links', label: '🔗 Ссылки', icon: LinkIcon },
  ];

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const removeCase = (index) => {
    setCases(cases.filter((_, i) => i !== index));
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Портфолио</h1>
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
        <div>
          <label className="block text-sm font-medium mb-4">Фотографии работ</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group"
              >
                <img
                  src={photo}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {/* Add Photo Button */}
            <div className="aspect-square border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors">
              <Plus size={32} className="text-gray-500 mb-2" />
              <span className="text-sm text-gray-400">Добавить фото</span>
            </div>
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          <label className="block text-sm font-medium mb-4">Видео (YouTube, Vimeo)</label>
          <div className="space-y-3 max-w-2xl">
            {videos.map((video, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={video}
                  onChange={(e) => {
                    const newVideos = [...videos];
                    newVideos[index] = e.target.value;
                    setVideos(newVideos);
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeVideo(index)}
                  className="px-3 py-3 bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            
            <button
              onClick={() => setVideos([...videos, ''])}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />
              Добавить видео
            </button>
          </div>
        </div>
      )}

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div>
          <label className="block text-sm font-medium mb-4">Кейсы / Описание работ</label>
          <div className="space-y-4 max-w-2xl">
            {cases.map((caseItem, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Кейс {index + 1}</h3>
                  <button
                    onClick={() => removeCase(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Название кейса</label>
                    <input
                      type="text"
                      value={caseItem.title}
                      onChange={(e) => {
                        const newCases = [...cases];
                        newCases[index].title = e.target.value;
                        setCases(newCases);
                      }}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Описание проекта</label>
                    <textarea
                      value={caseItem.description}
                      onChange={(e) => {
                        const newCases = [...cases];
                        newCases[index].description = e.target.value;
                        setCases(newCases);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setCases([...cases, { title: '', description: '' }])}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />
              Добавить кейс
            </button>
          </div>
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div>
          <label className="block text-sm font-medium mb-4">Внешние ссылки</label>
          <div className="space-y-3 max-w-2xl">
            {links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={link.platform}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[index].platform = e.target.value;
                    setLinks(newLinks);
                  }}
                  className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="behance">Behance</option>
                  <option value="github">GitHub</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
                
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...links];
                    newLinks[index].url = e.target.value;
                    setLinks(newLinks);
                  }}
                  placeholder="https://..."
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  onClick={() => removeLink(index)}
                  className="px-3 py-3 bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            
            <button
              onClick={() => setLinks([...links, { platform: 'behance', url: '' }])}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />
              Добавить ссылку
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

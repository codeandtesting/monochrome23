import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Check, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getActiveSite, updateSite } from '../../utils/sitesStorage';
import { SERVICES_CATEGORIES } from '../../data/servicesData';

export default function ServicesManager() {
  const [currentSite, setCurrentSite] = useState(null);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedServices, setSelectedServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: SERVICES_CATEGORIES[0],
    active: true
  });
  const [customCategory, setCustomCategory] = useState(''); // Для кастомной категории

  useEffect(() => {
    loadServices();
    
    const handleSiteChange = () => {
      loadServices();
    };
    
    window.addEventListener('activeSiteChanged', handleSiteChange);
    window.addEventListener('sitesUpdated', handleSiteChange);
    
    return () => {
      window.removeEventListener('activeSiteChanged', handleSiteChange);
      window.removeEventListener('sitesUpdated', handleSiteChange);
    };
  }, []);

  const loadServices = () => {
    const site = getActiveSite();
    if (site) {
      setCurrentSite(site);
      setServices(site.services || []);
    }
  };

  const saveServices = (updatedServices) => {
    if (currentSite) {
      updateSite(currentSite.id, { services: updatedServices });
      setServices(updatedServices);
      window.dispatchEvent(new Event('siteDataUpdated'));
    }
  };

  // Фильтрация
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && service.active) ||
      (statusFilter === 'inactive' && !service.active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Обработчики
  const handleAddService = () => {
    if (newService.title && newService.description) {
      // Используем кастомную категорию, если она введена и выбрана "Other"
      const finalCategory = newService.category === 'Other' && customCategory.trim() 
        ? customCategory.trim() 
        : newService.category;
      
      const newServiceItem = {
        id: `service_${Date.now()}`,
        ...newService,
        category: finalCategory
      };
      
      saveServices([...services, newServiceItem]);
      
      setNewService({
        title: '',
        description: '',
        category: SERVICES_CATEGORIES[0],
        active: true
      });
      setCustomCategory('');
      setShowAddForm(false);
    }
  };

  const handleUpdateService = (id) => {
    const updatedServices = services.map(s => 
      s.id === id ? { ...s, ...editForm } : s
    );
    saveServices(updatedServices);
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Удалить эту услугу?')) {
      const updatedServices = services.filter(s => s.id !== id);
      saveServices(updatedServices);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Удалить выбранные услуги (${selectedServices.length})?`)) {
      const updatedServices = services.filter(s => !selectedServices.includes(s.id));
      saveServices(updatedServices);
      setSelectedServices([]);
    }
  };

  const handleToggleActive = (id, currentStatus) => {
    const updatedServices = services.map(s => 
      s.id === id ? { ...s, active: !currentStatus } : s
    );
    saveServices(updatedServices);
  };

  const handleSelectAll = () => {
    if (selectedServices.length === paginatedServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(paginatedServices.map(s => s.id));
    }
  };

  const handleSelectService = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const startEditing = (service) => {
    setEditingId(service.id);
    setEditForm(service);
  };

  return (
    <div className="space-y-3">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-500">Всего услуг</p>
          <p className="text-xl font-semibold">{services.length}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-500">Активные</p>
          <p className="text-xl font-semibold text-green-400">{services.filter(s => s.active).length}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-500">Неактивные</p>
          <p className="text-xl font-semibold text-gray-500">{services.filter(s => !s.active).length}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-500">Категории</p>
          <p className="text-xl font-semibold">{SERVICES_CATEGORIES.length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Поиск по названию, описанию, категории..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              <option value="all">Все категории</option>
              {SERVICES_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all flex items-center gap-1.5 font-medium"
          >
            <Plus size={16} />
            Добавить услугу
          </button>

          {selectedServices.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-all flex items-center gap-1.5 font-medium"
            >
              <Trash2 size={16} />
              Удалить выбранные ({selectedServices.length})
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredServices.length)} из {filteredServices.length}
        </div>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
          <h3 className="text-sm font-medium mb-3 text-gray-400">Новая услуга</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-500">Название *</label>
              <input
                type="text"
                value={newService.title}
                onChange={(e) => setNewService({...newService, title: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                placeholder="Blockchain Development"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-500">Категория</label>
              <select
                value={newService.category}
                onChange={(e) => {
                  setNewService({...newService, category: e.target.value});
                  if (e.target.value !== 'Other') {
                    setCustomCategory('');
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
              >
                {SERVICES_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Кастомная категория - показывается только если выбрана "Other" */}
            {newService.category === 'Other' && (
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1.5 text-gray-500">
                  Своя категория <span className="text-gray-600">(необязательно, по умолчанию "Other")</span>
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                  placeholder="Например: AI & Machine Learning, DevOps, Testing..."
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1.5 text-gray-500">Описание *</label>
              <textarea
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 text-sm bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                placeholder="Custom blockchain solutions with smart contracts..."
              />
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddService}
              disabled={!newService.title || !newService.description}
              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 font-medium"
            >
              <Check size={16} />
              Добавить
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-gray-800/50 text-sm rounded-lg hover:bg-gray-700/50 transition-all flex items-center gap-1.5 border border-gray-700"
            >
              <X size={16} />
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
          <thead className="bg-gray-800/30 border-b border-gray-800">
            <tr>
              <th className="p-2.5 text-left">
                <input
                  type="checkbox"
                  checked={selectedServices.length === paginatedServices.length && paginatedServices.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="p-2.5 text-left text-xs font-medium text-gray-500">ID</th>
              <th className="p-2.5 text-left text-xs font-medium text-gray-500">Название</th>
              <th className="p-2.5 text-left text-xs font-medium text-gray-500">Описание</th>
              <th className="p-2.5 text-left text-xs font-medium text-gray-500">Категория</th>
              <th className="p-2.5 text-left text-xs font-medium text-gray-500">Статус</th>
              <th className="p-2.5 text-right text-xs font-medium text-gray-500">Действия</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-400">
                  Услуги не найдены
                </td>
              </tr>
            ) : (
              paginatedServices.map((service) => (
                <tr key={service.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="p-2.5">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleSelectService(service.id)}
                      className="w-4 h-4 rounded"
                    />
                  </td>
                  <td className="p-2.5 text-xs text-gray-600">#{service.id}</td>
                  <td className="p-2.5">
                    {editingId === service.id ? (
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="w-full px-2 py-1 text-sm bg-gray-900/50 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      />
                    ) : (
                      <span className="text-sm font-medium">{service.title}</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    {editingId === service.id ? (
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        rows={2}
                        className="w-full px-2 py-1 text-sm bg-gray-900/50 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
                      />
                    ) : (
                      <span className="text-xs text-gray-500 line-clamp-2">{service.description}</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    {editingId === service.id ? (
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        className="w-full px-2 py-1 text-sm bg-gray-900/50 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                      >
                        {SERVICES_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-gray-800/50 rounded border border-gray-700">{service.category}</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    <button
                      onClick={() => handleToggleActive(service.id, service.active)}
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        service.active
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                          : 'bg-gray-800/50 text-gray-500 hover:bg-gray-700/50 border border-gray-700'
                      } transition-all`}
                    >
                      {service.active ? 'Активна' : 'Выкл'}
                    </button>
                  </td>
                  <td className="p-2.5 text-right">
                    <div className="flex gap-1.5 justify-end">
                      {editingId === service.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateService(service.id)}
                            className="p-1.5 text-green-400 hover:bg-gray-800/50 rounded transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({});
                            }}
                            className="p-1.5 text-gray-500 hover:bg-gray-800/50 rounded transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(service)}
                            className="p-1.5 text-blue-400 hover:bg-gray-800/50 rounded transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-1.5 text-red-400 hover:bg-gray-800/50 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Показывать:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 text-sm bg-gray-900/50 border border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-gray-900/50 border border-gray-800 rounded hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2.5 py-1 text-sm rounded transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-gray-900/50 border border-gray-800 rounded hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="text-xs text-gray-500">
            Страница {currentPage} из {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}


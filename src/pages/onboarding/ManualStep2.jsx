import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Briefcase } from 'lucide-react';
import { SERVICES_CATEGORIES } from '../../data/servicesData';
import ProgressSteps from '../../components/ProgressSteps';

export default function ManualStep2() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: SERVICES_CATEGORIES[0]
  });
  const [customCategory, setCustomCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('manual_step2');
    if (saved) {
      setServices(JSON.parse(saved));
    }
  }, []);

  const handleAddService = () => {
    if (!newService.title || !newService.description) {
      alert('Please fill in service title and description');
      return;
    }

    // If "Other" is selected, use custom category (or "Other" if empty)
    const finalCategory = newService.category === 'Other' 
      ? (customCategory.trim() || 'Other')
      : newService.category;

    const service = {
      id: `service_${Date.now()}`,
      ...newService,
      category: finalCategory,
      active: true
    };

    setServices([...services, service]);
    setNewService({ title: '', description: '', category: SERVICES_CATEGORIES[0] });
    setCustomCategory('');
    setShowAddForm(false);
  };

  const handleRemoveService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleContinue = () => {
    if (services.length === 0) {
      alert('Please add at least one service');
      return;
    }

    localStorage.setItem('manual_step2', JSON.stringify(services));
    navigate('/onboarding/manual/step3');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Progress Steps */}
        <ProgressSteps
          currentStep={2}
          totalSteps={4}
          steps={['Basic Info', 'Services', 'Details', 'Preview']}
        />

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Briefcase size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">What do you offer?</h2>
          <p className="text-gray-400">Step 2 of 4 • Services & Products</p>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.length > 0 && (
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-start justify-between group hover:border-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{service.title}</h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full text-gray-400">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{service.description}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveService(service.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={18} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Service Form */}
          {showAddForm ? (
            <div className="bg-gray-900 border-2 border-blue-500 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Title *</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Web Development"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  rows={2}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this service..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newService.category}
                  onChange={(e) => {
                    setNewService({ ...newService, category: e.target.value });
                    if (e.target.value !== 'Other') {
                      setCustomCategory('');
                    }
                  }}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SERVICES_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Custom Category Input - shows when "Other" is selected */}
              {newService.category === 'Other' && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <label className="block text-sm font-medium mb-2 text-blue-400">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-black border border-blue-500/50 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Digital Marketing, Consulting, etc."
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Leave empty to use "Other" as category
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddService}
                  className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
                >
                  Add Service
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewService({ title: '', description: '', category: SERVICES_CATEGORIES[0] });
                    setCustomCategory('');
                  }}
                  className="px-4 py-2.5 border border-gray-700 hover:bg-gray-900 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-xl transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-white"
            >
              <Plus size={20} />
              Add Service
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/onboarding/manual/step1')}
            className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={services.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue ({services.length} services) →
          </button>
        </div>
      </div>
    </div>
  );
}


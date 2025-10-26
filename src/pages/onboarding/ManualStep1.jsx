import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import ProgressSteps from '../../components/ProgressSteps';

export default function ManualStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    description: '',
    location: 'local',
    specificLocation: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('manual_step1');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleContinue = () => {
    if (!formData.companyName || !formData.description) {
      alert('Please fill in required fields');
      return;
    }
    
    localStorage.setItem('manual_step1', JSON.stringify(formData));
    navigate('/onboarding/manual/step2');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress Steps */}
        <ProgressSteps
          currentStep={1}
          totalSteps={4}
          steps={['Basic Info', 'Services', 'Details', 'Preview']}
        />

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Building2 size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Tell us about your business</h2>
          <p className="text-gray-400">Step 1 of 4 • Company Information</p>
        </div>

        {/* Form */}
        <div className="space-y-6 bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. ProgressIT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tagline / Slogan
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Your Vision, Infinite Possibilities"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Company Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your business, what you do, and what makes you unique..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length} characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Business Scope</label>
            <div className="grid grid-cols-3 gap-3">
              {['local', 'regional', 'global'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, location: type })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.location === type
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {formData.location !== 'global' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Location / City
              </label>
              <input
                type="text"
                value={formData.specificLocation}
                onChange={(e) => setFormData({ ...formData, specificLocation: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. London, UK"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/onboarding')}
            className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!formData.companyName || !formData.description}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}


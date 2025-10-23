import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Globe, MapPin, Building2 } from 'lucide-react';

export default function AIWizardStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    businessDescription: '',
    location: 'global', // 'local', 'regional', 'global'
    specificLocation: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = 'Business description is required';
    }
    if (formData.location === 'local' && !formData.specificLocation.trim()) {
      newErrors.specificLocation = 'Please specify your location';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Сохраняем данные и переходим к генерации
    localStorage.setItem('aiWizardData', JSON.stringify(formData));
    navigate('/onboarding/ai-wizard/step2');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">AI Wizard</h1>
          <p className="text-gray-400">
            Step 1 of 3 • AI will create content for you
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-sm text-blue-400">
                Simply answer the questions in your own words. AI will create professional content for your website.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              What is your company name? *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => {
                setFormData({ ...formData, companyName: e.target.value });
                setErrors({ ...errors, companyName: '' });
              }}
              placeholder="E.g., We repair furniture. Specializing in leather sofas and chairs. Working for 10 years."
              className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 ${
                errors.companyName ? 'border-2 border-red-500' : 'border border-gray-800 focus:ring-blue-500'
              }`}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              What services do you offer? *
            </label>
            <textarea
              value={formData.businessDescription}
              onChange={(e) => {
                setFormData({ ...formData, businessDescription: e.target.value });
                setErrors({ ...errors, businessDescription: '' });
              }}
              placeholder="E.g., Scratch repair, upholstery replacement, stain removal, mobile repair service"
              rows={4}
              className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 resize-none ${
                errors.businessDescription ? 'border-2 border-red-500' : 'border border-gray-800 focus:ring-blue-500'
              }`}
            />
            {errors.businessDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              AI will create a beautiful description based on your answer
            </p>
          </div>

          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Where do you operate? *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, location: 'local' })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.location === 'local'
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <MapPin className="mb-2" size={24} />
                <p className="font-medium">Local</p>
                <p className="text-xs text-gray-500 mt-1">One city/region</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, location: 'regional', specificLocation: '' })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.location === 'regional'
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <Building2 className="mb-2" size={24} />
                <p className="font-medium">Regional</p>
                <p className="text-xs text-gray-500 mt-1">Multiple cities/states</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, location: 'global', specificLocation: '' })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.location === 'global'
                    ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <Globe className="mb-2" size={24} />
                <p className="font-medium">Global</p>
                <p className="text-xs text-gray-500 mt-1">Worldwide services</p>
              </button>
            </div>
          </div>

          {/* Specific Location */}
          {formData.location === 'local' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Please specify your location *
              </label>
              <input
                type="text"
                value={formData.specificLocation}
                onChange={(e) => {
                  setFormData({ ...formData, specificLocation: e.target.value });
                  setErrors({ ...errors, specificLocation: '' });
                }}
                placeholder="E.g., New York, NY"
                className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 ${
                  errors.specificLocation ? 'border-2 border-red-500' : 'border border-gray-800 focus:ring-blue-500'
                }`}
              />
              {errors.specificLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.specificLocation}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 font-medium"
            >
              Generate with AI
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

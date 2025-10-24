import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { createSite } from '../../utils/sitesStorage';
import SignUpPage from '../../components/SignUpModal';

const COLOR_SCHEMES = [
  { id: 'default', name: 'Classic Dark', primary: '#000000', accent: '#ffffff' },
  { id: 'blue', name: 'Ocean Blue', primary: '#0f172a', accent: '#3b82f6' },
  { id: 'purple', name: 'Royal Purple', primary: '#1e1b4b', accent: '#8b5cf6' },
  { id: 'green', name: 'Forest Green', primary: '#14532d', accent: '#22c55e' },
  { id: 'red', name: 'Fire Red', primary: '#450a0a', accent: '#ef4444' },
  { id: 'orange', name: 'Sunset Orange', primary: '#431407', accent: '#f97316' }
];

export default function ManualStep4() {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('default');
  const [companyInfo, setCompanyInfo] = useState(null);
  const [services, setServices] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Load all previous steps data
    const step1 = localStorage.getItem('manual_step1');
    const step2 = localStorage.getItem('manual_step2');
    
    if (step1) setCompanyInfo(JSON.parse(step1));
    if (step2) setServices(JSON.parse(step2));
  }, []);

  const handleFinish = async () => {
    setIsCreating(true);

    try {
      // Get all data from localStorage
      const step1 = JSON.parse(localStorage.getItem('manual_step1') || '{}');
      const step2 = JSON.parse(localStorage.getItem('manual_step2') || '[]');
      const contactsData = JSON.parse(localStorage.getItem('manual_step3_contacts') || '{}');
      const socialData = JSON.parse(localStorage.getItem('manual_step3_social') || '{}');

      // Build site data structure
      const siteData = {
        hero: {
          companyName: step1.companyName || 'Your Company',
          tagline: step1.tagline || '',
          description: step1.description || '',
          location: step1.location || 'global',
          specificLocation: step1.specificLocation || ''
        },
        services: {
          enabled: true,
          heading: 'Our Services',
          items: step2
        },
        contacts: {
          heading: 'Get in Touch',
          phone: contactsData.phone || '',
          email: contactsData.email || '',
          address: contactsData.address || '',
          website: contactsData.website || ''
        },
        social: {
          facebook: socialData.facebook || '',
          instagram: socialData.instagram || '',
          twitter: socialData.twitter || '',
          discord: socialData.discord || '',
          youtube: socialData.youtube || ''
        },
        stats: {
          enabled: false,
          items: []
        },
        testimonials: {
          enabled: false,
          items: []
        }
      };

      // Create the new site
      createSite({
        name: step1.companyName,
        data: siteData,
        services: step2,
        portfolio: [],
        design: {
          colorScheme: selectedColor,
          activeLanding: 'client'
        }
      });

      // Clean up localStorage
      localStorage.removeItem('manual_step1');
      localStorage.removeItem('manual_step2');
      localStorage.removeItem('manual_step3_contacts');
      localStorage.removeItem('manual_step3_social');

      // Show sign up modal
      setTimeout(() => {
        setIsCreating(false);
        setShowSignUp(true);
      }, 500);

    } catch (error) {
      console.error('Error creating site:', error);
      alert('Failed to create site. Please try again.');
      setIsCreating(false);
    }
  };

  const handleSignUpComplete = () => {
    setShowSignUp(false);
    navigate('/dashboard');
  };

  if (!companyInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Choose your design</h2>
          <p className="text-gray-400">Step 4 of 4 • Design & Preview</p>
        </div>

        {/* Color Schemes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-6">Select Color Scheme</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setSelectedColor(scheme.id)}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  selectedColor === scheme.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {selectedColor === scheme.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={14} />
                  </div>
                )}
                
                <div className="flex gap-2 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-700"
                    style={{ backgroundColor: scheme.primary }}
                  />
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-700"
                    style={{ backgroundColor: scheme.accent }}
                  />
                </div>
                
                <p className="font-medium text-left">{scheme.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-6">Preview</h3>
          
          <div className="bg-black border border-gray-700 rounded-lg p-8 space-y-6">
            {/* Hero Preview */}
            <div>
              <h4 className="text-2xl font-bold mb-2">{companyInfo.companyName}</h4>
              {companyInfo.tagline && (
                <p className="text-lg text-gray-400 mb-3">{companyInfo.tagline}</p>
              )}
              <p className="text-gray-400">{companyInfo.description}</p>
            </div>

            {/* Services Preview */}
            {services.length > 0 && (
              <div>
                <h5 className="font-semibold mb-3 text-gray-300">Services ({services.length})</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.slice(0, 6).map((service) => (
                    <div key={service.id} className="bg-gray-900 border border-gray-800 rounded p-3">
                      <p className="text-sm font-medium truncate">{service.title}</p>
                      <p className="text-xs text-gray-500">{service.category}</p>
                    </div>
                  ))}
                  {services.length > 6 && (
                    <div className="bg-gray-900 border border-gray-800 rounded p-3 flex items-center justify-center">
                      <p className="text-xs text-gray-500">+{services.length - 6} more</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/onboarding/manual/step3')}
            disabled={isCreating}
            className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={handleFinish}
            disabled={isCreating}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg transition-all font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Site...
              </>
            ) : (
              <>
                <Check size={18} />
                Create My Site
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignUp && (
        <SignUpPage
          onClose={() => setShowSignUp(false)}
          onComplete={handleSignUpComplete}
        />
      )}
    </div>
  );
}


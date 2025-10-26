import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Monitor, Smartphone } from 'lucide-react';
import { createSite } from '../../utils/sitesStorage';
import { COLOR_SCHEMES } from '../../utils/designStorage';
import SignUpPage from '../../components/SignUpModal';
import ChatPage from '../ChatPage';
import ClientSitePage from '../ClientSitePage';
import ProgressSteps from '../../components/ProgressSteps';

export default function ManualStep4() {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('default');
  const [selectedLayout, setSelectedLayout] = useState('client');
  const [companyInfo, setCompanyInfo] = useState(null);
  const [services, setServices] = useState([]);
  const [contacts, setContacts] = useState(null);
  const [social, setSocial] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Load all previous steps data
    const step1 = localStorage.getItem('manual_step1');
    const step2 = localStorage.getItem('manual_step2');
    const step3Contacts = localStorage.getItem('manual_step3_contacts');
    const step3Social = localStorage.getItem('manual_step3_social');

    if (step1) setCompanyInfo(JSON.parse(step1));
    if (step2) setServices(JSON.parse(step2));
    if (step3Contacts) setContacts(JSON.parse(step3Contacts));
    if (step3Social) setSocial(JSON.parse(step3Social));
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
          activeLanding: selectedLayout
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

  // Build preview site data
  const previewSite = useMemo(() => {
    if (!companyInfo) return null;

    return {
      id: 'preview-site',
      name: companyInfo.companyName || 'Preview Site',
      data: {
        hero: {
          companyName: companyInfo.companyName || 'Your Company',
          tagline: companyInfo.tagline || '',
          description: companyInfo.description || '',
          location: companyInfo.location || 'global',
          specificLocation: companyInfo.specificLocation || ''
        },
        services: {
          enabled: true,
          heading: 'Our Services',
          list: services
        },
        contacts: {
          heading: 'Get in Touch',
          phone: contacts?.phone || '',
          email: contacts?.email || '',
          address: contacts?.address || '',
          website: contacts?.website || ''
        },
        social: {
          facebook: social?.facebook || '',
          instagram: social?.instagram || '',
          twitter: social?.twitter || '',
          discord: social?.discord || '',
          youtube: social?.youtube || ''
        },
        stats: {
          enabled: true,
          items: [
            { label: 'Projects Completed', value: '100+' },
            { label: 'Happy Clients', value: '50+' },
            { label: 'Support', value: '24/7' }
          ]
        },
        testimonials: {
          enabled: false,
          items: []
        },
        showcase: {
          showAbout: true,
          showPortfolio: false,
          showTestimonials: false,
          showStats: true
        }
      },
      services: services,
      design: {
        colorScheme: selectedColor,
        activeLanding: selectedLayout
      }
    };
  }, [companyInfo, services, contacts, social, selectedColor, selectedLayout]);

  if (!companyInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const selectedScheme = COLOR_SCHEMES[selectedColor];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress Steps */}
        <ProgressSteps
          currentStep={4}
          totalSteps={4}
          steps={['Basic Info', 'Services', 'Details', 'Preview']}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Choose your design</h2>
          <p className="text-gray-400">Step 4 of 4 • Design & Preview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Color Schemes */}
          <div className="space-y-5">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <h3 className="text-base font-semibold mb-4">Select Color Scheme</h3>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(COLOR_SCHEMES).slice(0, 12).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedColor(key)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      selectedColor === key
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {selectedColor === key && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check size={12} />
                      </div>
                    )}

                    <div className="flex gap-2 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${scheme.gradientFrom} 0%, ${scheme.gradientTo} 100%)`
                        }}
                      />
                      <div
                        className="w-10 h-10 rounded-lg border border-gray-700"
                        style={{ backgroundColor: scheme.background }}
                      />
                    </div>

                    <p className="text-sm font-medium text-left">{scheme.name}</p>
                    <p className="text-xs text-gray-500 text-left">{scheme.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Website Preview */}
          <div className="space-y-5">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Live Website Preview</h3>

                {/* Layout Selector */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedLayout('main')}
                    className={`p-2 rounded-lg border transition-all ${
                      selectedLayout === 'main'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                    title="Layout 1 - Chat Style"
                  >
                    <Monitor size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedLayout('client')}
                    className={`p-2 rounded-lg border transition-all ${
                      selectedLayout === 'client'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                    title="Layout 2 - Client Style"
                  >
                    <Smartphone size={16} />
                  </button>
                </div>
              </div>

              {/* Real Live Preview */}
              {previewSite && (
                selectedLayout === 'main' ? (
                  <div className="rounded-lg overflow-hidden border border-gray-800 bg-black h-[700px]">
                    <ChatPage siteData={previewSite} embedded />
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden border border-gray-800 bg-black h-[700px] relative">
                    <div style={{
                      transform: 'scale(0.5)',
                      transformOrigin: 'top left',
                      width: '200%',
                      height: '200%'
                    }}>
                      <ClientSitePage siteData={previewSite} />
                    </div>
                  </div>
                )
              )}

              {/* Color Info */}
              <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Selected Scheme:</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{
                      background: `linear-gradient(135deg, ${selectedScheme.gradientFrom}, ${selectedScheme.gradientTo})`
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">{selectedScheme.name}</p>
                    <p className="text-xs text-gray-600">{selectedScheme.category} Style</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 max-w-7xl mx-auto">
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

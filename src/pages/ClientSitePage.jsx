import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveSite } from '../utils/sitesStorage';
import { applyColorScheme } from '../utils/designStorage';
import ChatPage from './ChatPage';

export default function ClientSitePage({ siteData: propSiteData, forceMobile = false }) {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true);
  const [mobileStage, setMobileStage] = useState('preview');
  const [currentSite, setCurrentSite] = useState(propSiteData || getActiveSite());
  const touchStartXRef = useRef(0);

  const siteData = currentSite?.data || {};
  const services = currentSite?.services || [];
  const portfolioItems = currentSite?.portfolio || [];

  console.log('🌐 ClientSitePage - Current site:', currentSite?.name, '| ID:', currentSite?.id);

  useEffect(() => {
    if (propSiteData) {
      setCurrentSite(propSiteData);
    }
  }, [propSiteData]);

  useEffect(() => {
    if (!propSiteData) {
      const handleDataUpdate = () => {
        setCurrentSite(getActiveSite());
      };
      
      window.addEventListener('siteDataUpdated', handleDataUpdate);
      window.addEventListener('sitesUpdated', handleDataUpdate);
      window.addEventListener('activeSiteChanged', handleDataUpdate);
      
      return () => {
        window.removeEventListener('siteDataUpdated', handleDataUpdate);
        window.removeEventListener('sitesUpdated', handleDataUpdate);
        window.removeEventListener('activeSiteChanged', handleDataUpdate);
      };
    }
  }, [propSiteData]);

  useEffect(() => {
    const colorScheme = currentSite?.design?.colorScheme || 'default';
    applyColorScheme(colorScheme);

    const handleDesignUpdate = () => {
      const updatedSite = getActiveSite();
      const updatedColorScheme = updatedSite?.design?.colorScheme || 'default';
      applyColorScheme(updatedColorScheme);
    };

    window.addEventListener('designSettingsUpdated', handleDesignUpdate);
    window.addEventListener('activeSiteChanged', handleDesignUpdate);
    return () => {
      window.removeEventListener('designSettingsUpdated', handleDesignUpdate);
      window.removeEventListener('activeSiteChanged', handleDesignUpdate);
    };
  }, [currentSite]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => {
      setIsDesktop(e.matches);
      if (e.matches) {
        setMobileStage('preview');
      }
    };
    mq.addEventListener('change', onChange);
    setIsDesktop(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const contentVariants = useMemo(() => {
    const variants = [];
    const showcaseSettings = siteData.showcase || {};
    
    // About/Hero (по умолчанию включено)
    if (showcaseSettings.showAbout !== false) {
      variants.push({
        type: 'about',
        content: (
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-gradient-theme">{siteData.hero?.companyName || 'Company Name'}</h2>
            <p className="text-xl text-theme-primary mb-4">{siteData.hero?.tagline || 'Your tagline'}</p>
            <p className="text-gray-400 mb-6 leading-relaxed">{siteData.hero?.description || 'Description'}</p>
          </div>
        )
      });
    }
    
    // Portfolio (по умолчанию включено)
    if (showcaseSettings.showPortfolio !== false) {
      variants.push({
        type: 'portfolio',
        content: (
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gradient-theme">Portfolio</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {portfolioItems.filter(item => item.type === 'image').slice(0, 4).map((item) => (
                <div key={item.id} className="aspect-square bg-gray-800 rounded-lg overflow-hidden group relative">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-semibold">{item.title}</p>
                    <p className="text-gray-300 text-xs">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      });
    }
    
    // Services (по умолчанию включено)
    if (showcaseSettings.showServices !== false) {
      variants.push({
        type: 'services',
        content: (
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gradient-theme">Our Services</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {services.filter(s => s.active).slice(0, 8).map((service) => (
                <div key={service.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                  <h3 className="font-semibold mb-1 text-sm">{service.title}</h3>
                  <p className="text-gray-400 text-xs">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      });
    }
    
    // Statistics (только если включено)
    if (showcaseSettings.showStats !== false && siteData.stats?.enabled) {
      variants.push({
        type: 'stats',
        content: (
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gradient-theme">Our Achievements</h2>
            <div className="grid grid-cols-3 gap-6 text-center">
              {siteData.stats.items.map((stat, index) => (
                <div key={index}>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )
      });
    }
    
    // Testimonials (только если включено)
    if (showcaseSettings.showTestimonials !== false && siteData.testimonials?.enabled) {
      variants.push({
        type: 'testimonials',
        content: (
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gradient-theme">Client Testimonials</h2>
            <div className="space-y-4">
              {siteData.testimonials.items.slice(0, 2).map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center font-bold text-theme-primary">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                      <div className="text-yellow-400 text-sm">
                        {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        )
      });
    }
    
    // Contacts (по умолчанию включено)
    if (showcaseSettings.showContacts !== false) {
      variants.push({
        type: 'contacts',
        content: (
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gradient-theme">{siteData.contacts?.heading || 'Get in Touch'}</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">📞</div>
                <div>
                  <p className="text-gray-400 text-sm">Телефон</p>
                  <p className="font-semibold">{siteData.contacts?.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">📧</div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-semibold">{siteData.contacts?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        )
      });
    }
    
    return variants;
  }, [siteData, services, portfolioItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContentIndex((prev) => (prev + 1) % contentVariants.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [contentVariants.length]);

  const nextSlide = () => {
    setCurrentContentIndex((prev) => (prev + 1) % contentVariants.length);
  };

  const prevSlide = () => {
    setCurrentContentIndex((prev) => (prev - 1 + contentVariants.length) % contentVariants.length);
  };

  const goToSlide = (index) => {
    setCurrentContentIndex(index);
  };

  const desktop = forceMobile ? false : isDesktop;

  return (
    <div className="landing-theme min-h-screen bg-black text-white">
      <div className={`${desktop ? 'h-screen grid-cols-2' : 'min-h-screen grid-cols-1'} grid`}>
        
        {/* LEFT - Preview (Desktop only) */}
        {desktop && (
          <div className="p-12 flex items-center justify-center bg-black relative overflow-hidden group">
            <div className="relative w-full flex items-center justify-center min-h-[400px]">
              {contentVariants.map((variant, index) => (
                <div key={variant.type} className={`absolute transition-all duration-500 ${index === currentContentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  {variant.content}
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-800">
              {contentVariants.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all rounded-full ${
                    index === currentContentIndex
                      ? 'w-8 h-2 bg-theme-primary'
                      : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* RIGHT - Chat */}
        <div className={`${desktop ? 'border-l h-screen' : 'min-h-screen'} border-gray-800 bg-black overflow-hidden relative`}>
          
          {/* MOBILE: Preview overlay */}
          {!desktop && mobileStage === 'preview' && (
            <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center p-6" onClick={() => setMobileStage('chat')} onTouchStart={(e) => (touchStartXRef.current = e.touches[0].clientX)} onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touchStartXRef.current; if (dx < -50) setMobileStage('chat'); }}>

              {/* Content Carousel */}
              <div className="w-full max-w-md flex-1 flex items-center justify-center relative">
                {contentVariants.map((variant, index) => (
                  <div key={`mob-${variant.type}`} className={`transition-all duration-500 ${index === currentContentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'}`}>
                    {variant.content}
                  </div>
                ))}
              </div>

              {/* Enhanced Dots Indicator */}
              <div className="w-full flex flex-col items-center gap-4 pb-4">
                <div className="flex gap-2 bg-gray-900/70 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700">
                  {contentVariants.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                      className={`transition-all rounded-full ${
                        index === currentContentIndex
                          ? 'w-8 h-2.5 bg-theme-primary shadow-lg shadow-theme-primary/50'
                          : 'w-2.5 h-2.5 bg-gray-600'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Swipe Hint */}
                <div className="flex items-center gap-2 text-gray-400 text-xs animate-pulse">
                  <span>Swipe left to chat</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          )}

          {/* CHAT FROM LAYOUT 1 */}
          <div className="h-full">
            <ChatPage siteData={currentSite} embedded />
          </div>

          {/* Mobile: back button */}
          {!desktop && mobileStage === 'chat' && (
            <button onClick={() => setMobileStage('preview')} className="fixed top-4 left-4 px-4 py-2 text-sm bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-full text-white z-50 flex items-center gap-2 hover:bg-gray-700 transition-all">
              <ChevronLeft size={16} />
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

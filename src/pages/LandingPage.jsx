import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Clock, MessageCircle, Globe, TrendingUp, CheckCircle, Play, Star, Users, Rocket, Moon, Coffee, Target, BarChart3, Shield } from 'lucide-react';
import '../styles/animated-card.css';
import '../styles/glassmorphism.css';
import '../styles/monochrome-theme.css';
import { initializeGlassCards, addScrollReveal } from '../utils/glassEffects';
import MonochromeColorControls from '../components/MonochromeColorControls';

export default function LandingPage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const fullText = 'Launch Your Selling Website in 60 Seconds';

  // Typing animation
  useEffect(() => {
    if (!isTyping) return;

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Chatbot Works 24/7",
      description: "Your virtual manager talks to clients, answers questions and collects contacts — even while you sleep.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Launch in 60 Seconds",
      description: "Just answer 3 questions — artificial intelligence creates a complete selling website instantly.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Unlimited Websites",
      description: "Manage all your projects from one dashboard. Each client gets their own site with unique design.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "No Coding Required",
      description: "Visual editor with quick edits. Change text, colors, services — everything in a few clicks.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Leads",
      description: "Track visitors, requests and AI conversations in real-time. All leads in one place.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Start Free Forever",
      description: "Launch unlimited sites, no credit card required. Upgrade anytime for premium features.",
      gradient: "from-teal-500 to-green-500"
    }
  ];

  // Live counter effect
  const [sitesCount, setSitesCount] = useState(53100);
  const [usersCount, setUsersCount] = useState(24100);

  useEffect(() => {
    const sitesInterval = setInterval(() => {
      setSitesCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);

    const usersInterval = setInterval(() => {
      setUsersCount(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);

    return () => {
      clearInterval(sitesInterval);
      clearInterval(usersInterval);
    };
  }, []);

  // Initialize glass morphism effects
  useEffect(() => {
    const cleanup1 = initializeGlassCards('.glass-feature-card', 8);
    const cleanup2 = addScrollReveal('.glass-card');
    const cleanup3 = addScrollReveal('.glass-feature-card');

    return () => {
      cleanup1();
      cleanup2();
      cleanup3();
    };
  }, []);

  const stats = [
    { icon: <Rocket />, value: sitesCount.toLocaleString() + '+', label: "Sites Created", gradient: "from-blue-500 to-cyan-500", live: true },
    { icon: <Users />, value: usersCount.toLocaleString() + '+', label: "Active Users", gradient: "from-purple-500 to-pink-500", live: true },
    { icon: <Star />, value: "4.9", label: "Average Rating", gradient: "from-yellow-500 to-orange-500" }
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      {/* Monochrome Animated Background */}
      <div className="monochrome-animated-bg"></div>

      {/* SVG Filters */}
      <svg className="animated-svg-container">
        <defs>
          {/* Turbulent displacement filter for animated card */}
          <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>

          {/* Colorize filter */}
          <filter id="colorize" x="0%" y="0%" width="100%" height="100%">
            <feFlood floodColor="var(--base-color)" floodOpacity="0.5" />
            <feComposite in="SourceGraphic" operator="overlay" />
          </filter>

          {/* Monochrome blend filter */}
          <filter id="monochrome-blend" x="0%" y="0%" width="100%" height="100%">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0.2 0.4 0.6 0.8 1" />
              <feFuncG type="discrete" tableValues="0.2 0.4 0.6 0.8 1" />
              <feFuncB type="discrete" tableValues="0.2 0.4 0.6 0.8 1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/50">
                <span className="text-2xl font-bold">M</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Monochrome</span>
            </div>

            {/* Dashboard Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="group px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/50 flex items-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Sparkles size={20} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              <span className="relative z-10">Dashboard</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Trust Badges */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="glass-badge" style={{ borderColor: 'var(--base-alpha-20)' }}>
              <Sparkles size={16} style={{ color: 'var(--base-color)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--tint-light)' }}>AI-Powered</span>
            </div>
            <div className="glass-badge" style={{ borderColor: 'var(--base-alpha-20)' }}>
              <Zap size={16} style={{ color: 'var(--base-color)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--tint-light)' }}>No-Code</span>
            </div>
            <div className="glass-badge" style={{ borderColor: 'var(--base-alpha-20)' }}>
              <CheckCircle size={16} style={{ color: 'var(--base-color)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--tint-light)' }}>Free to Start</span>
            </div>
          </div>

          {/* Animated Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]">
            <span className="monochrome-text-gradient">
              {typedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </h1>

          <p className="text-xl sm:text-2xl mb-4 max-w-3xl mx-auto animate-fadeInUp leading-relaxed" style={{ color: 'var(--tint-light)' }}>
            <span className="text-2xl sm:text-3xl font-bold block mb-3" style={{ color: 'var(--base-color)' }}>
              While You Sleep — Your Site Works
            </span>
            AI chatbot talks to clients, answers questions<br />
            and collects leads 24/7
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fadeInUp animation-delay-300">
            <button
              onClick={() => navigate('/onboarding')}
              className="monochrome-button px-10 py-5 rounded-xl text-xl font-bold flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, var(--base-color), var(--tint-light))` }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles size={24} />
                Start Free Now
              </span>
            </button>
            <button
              onClick={() => navigate('/2')}
              className="group px-10 py-5 rounded-xl text-xl font-bold transition-all flex items-center gap-3"
              style={{
                border: `2px solid var(--base-alpha-30)`,
                background: 'var(--base-alpha-10)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Play size={24} className="group-hover:translate-x-1 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Urgency message */}
          <div className="mb-12 animate-fadeInUp animation-delay-400">
            <p className="text-lg" style={{ color: 'var(--tone-light)' }}>
              <span style={{ color: 'var(--base-color)', fontWeight: '600' }}>Get your first lead</span> today
            </p>
          </div>

        </div>

        {/* Floating Elements */}
        <div className="absolute top-40 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-float animation-delay-4000"></div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <span className="monochrome-text-gradient">Tired</span> of These Problems?
          </h2>
          <p className="text-center mb-12 text-lg" style={{ color: 'var(--tone-light)' }}>We know what's stopping you</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="monochrome-premium-card monochrome-card-gradient p-6">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--base-color)' }}>Slow & Expensive</h3>
              <p style={{ color: 'var(--tone-light)' }}>Developers charge $1000+ and take months. Every edit costs extra.</p>
            </div>

            <div className="monochrome-premium-card monochrome-card-stripes p-6">
              <div className="text-4xl mb-3">😴</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--base-color)' }}>Site Doesn't Sell</h3>
              <p style={{ color: 'var(--tone-light)' }}>Visitors come and go. No chat, no one to answer questions at 3 AM.</p>
            </div>

            <div className="monochrome-premium-card monochrome-card-dots p-6">
              <div className="text-4xl mb-3">🤯</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--base-color)' }}>Complex Management</h3>
              <p style={{ color: 'var(--tone-light)' }}>WordPress, hosting, domains, updates. Need a tech expert for every little thing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Live Counters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const patterns = ['monochrome-card-circles', 'monochrome-card-mesh', 'monochrome-card-waves'];
              return (
                <div
                  key={index}
                  className={`monochrome-premium-card ${patterns[index % patterns.length]} text-center p-6`}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, var(--base-color), var(--tint-light))'
                    }}
                  >
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div
                    className="text-4xl font-bold mb-2 flex items-center justify-center gap-2"
                    style={{ color: 'var(--tint-lightest)' }}
                  >
                    {stat.value}
                    {stat.live && (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--base-color)' }}></span>
                        <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: 'var(--base-color)' }}></span>
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'var(--tone-light)' }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4">
            Why Choose <span className="monochrome-text-gradient">Monochrome?</span>
          </h2>
          <p className="text-center mb-16 text-lg" style={{ color: 'var(--tone-light)' }}>Everything you need to launch a selling website</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-feature-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="glass-glow"></div>
                <div className="glass-content">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, var(--base-alpha-20), var(--base-alpha-30))'
                    }}
                  >
                    <div style={{ color: 'var(--base-color)' }}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--tint-lightest)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--tone-light)' }}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Card */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="animated-card-container">
            <div className="animated-card-inner">
              <div className="animated-card-border-outer">
                <div className="animated-card-main"></div>
              </div>
              <div className="animated-card-glow-1"></div>
              <div className="animated-card-glow-2"></div>
            </div>

            <div className="animated-card-overlay-1"></div>
            <div className="animated-card-overlay-2"></div>
            <div className="animated-card-bg-glow"></div>

            <div className="animated-card-content">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Moon className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: 'var(--base-color)' }} />
                <Coffee className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: 'var(--tint-light)' }} />
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                While You Sleep,<br />
                <span className="monochrome-text-gradient">
                  Your Site Sells For You
                </span>
              </h2>
              <p className="text-sm sm:text-xl mb-6 sm:mb-8 leading-relaxed" style={{ color: 'var(--tone-light)' }}>
                AI chatbot talks to every visitor, answers questions,<br className="hidden sm:block" />
                tells about your services and collects leads automatically.<br className="hidden sm:block" />
                <span className="font-semibold" style={{ color: 'var(--base-color)' }}>24/7. No days off. No salary.</span>
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="monochrome-button group px-6 py-3 sm:px-12 sm:py-6 rounded-xl text-base sm:text-2xl font-bold transition-all transform hover:scale-110 flex items-center gap-2 sm:gap-3 mx-auto"
                style={{
                  background: 'linear-gradient(135deg, var(--base-color), var(--tint-light))',
                  boxShadow: '0 0 40px var(--base-alpha-50)'
                }}
              >
                <Sparkles size={20} className="sm:w-7 sm:h-7 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative z-10">Launch in 60 Seconds</span>
                <Sparkles size={20} className="sm:w-7 sm:h-7 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <p className="mt-4 sm:mt-6 text-sm sm:text-lg" style={{ color: 'var(--tone-light)' }}>
                Get your <span className="font-semibold" style={{ color: 'var(--base-color)' }}>first lead today</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4">
            <span className="monochrome-text-gradient">Frequently Asked Questions</span>
          </h2>
          <p className="text-center mb-12 text-lg" style={{ color: 'var(--tone-light)' }}>Everything you need to know</p>

          <div className="space-y-4">
            <div className="monochrome-premium-card monochrome-card-gradient p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span style={{ color: 'var(--base-color)' }}>❓</span>
                <span style={{ color: 'var(--tint-lightest)' }}>Really in 60 seconds?</span>
              </h3>
              <p style={{ color: 'var(--tone-light)' }}>Yes! Answer 3 questions — AI creates the site automatically. Text, design, chatbot — everything ready to work.</p>
            </div>

            <div className="monochrome-premium-card monochrome-card-stripes p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span style={{ color: 'var(--base-color)' }}>💰</span>
                <span style={{ color: 'var(--tint-lightest)' }}>How much does it cost?</span>
              </h3>
              <p style={{ color: 'var(--tone-light)' }}>Start free with unlimited sites. Premium plans available with advanced features, analytics, and priority support.</p>
            </div>

            <div className="monochrome-premium-card monochrome-card-dots p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span style={{ color: 'var(--base-color)' }}>🤖</span>
                <span style={{ color: 'var(--tint-lightest)' }}>How does the AI chatbot work?</span>
              </h3>
              <p style={{ color: 'var(--tone-light)' }}>The chatbot learns your services and answers visitor questions 24/7. It collects contacts, talks about prices and services — like an experienced manager.</p>
            </div>

            <div className="monochrome-premium-card monochrome-card-circles p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span style={{ color: 'var(--base-color)' }}>⚙️</span>
                <span style={{ color: 'var(--tint-lightest)' }}>Do I need technical knowledge?</span>
              </h3>
              <p style={{ color: 'var(--tone-light)' }}>No! The interface is intuitive and easy. Change text, add services, customize colors — like a regular editor.</p>
            </div>

            <div className="monochrome-premium-card monochrome-card-mesh p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span style={{ color: 'var(--base-color)' }}>📱</span>
                <span style={{ color: 'var(--tint-lightest)' }}>Does it work on phones?</span>
              </h3>
              <p style={{ color: 'var(--tone-light)' }}>Yes! All sites are responsive — look beautiful on any device: smartphones, tablets, desktops.</p>
            </div>

            <div className="monochrome-premium-card monochrome-card-waves p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span style={{ color: 'var(--base-color)' }}>🔒</span>
                <span style={{ color: 'var(--tint-lightest)' }}>Is my data safe?</span>
              </h3>
              <p style={{ color: 'var(--tone-light)' }}>Absolutely! All data is stored locally in your browser. We don't collect personal information or share it with third parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8 relative z-10" style={{ borderColor: 'var(--base-alpha-20)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--base-color), var(--tint-light))'
                  }}
                >
                  <span className="text-xl font-bold text-white">M</span>
                </div>
                <span className="text-xl font-bold" style={{ color: 'var(--tint-lightest)' }}>Monochrome</span>
              </div>
              <p className="max-w-md" style={{ color: 'var(--tone-light)' }}>
                Your Vision, Infinite Possibilities. AI-powered website builder for modern businesses.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--tint-lightest)' }}>Product</h4>
              <ul className="space-y-2" style={{ color: 'var(--tone-light)' }}>
                <li>
                  <button
                    onClick={() => navigate('/onboarding')}
                    className="transition-colors"
                    style={{ color: 'var(--tone-light)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--base-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--tone-light)'}
                  >
                    Create Site
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/2')}
                    className="transition-colors"
                    style={{ color: 'var(--tone-light)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--base-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--tone-light)'}
                  >
                    Demo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="transition-colors"
                    style={{ color: 'var(--tone-light)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--base-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--tone-light)'}
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--tint-lightest)' }}>Company</h4>
              <ul className="space-y-2" style={{ color: 'var(--tone-light)' }}>
                <li>
                  <a
                    href="#"
                    className="transition-colors"
                    style={{ color: 'var(--tone-light)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--base-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--tone-light)'}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors"
                    style={{ color: 'var(--tone-light)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--base-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--tone-light)'}
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors"
                    style={{ color: 'var(--tone-light)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--base-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--tone-light)'}
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition-colors"
                    style={{ color: 'var(--tone-light)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--base-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--tone-light)'}
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center" style={{ borderTop: '1px solid var(--base-alpha-20)', color: 'var(--tone-light)' }}>
            <p>&copy; 2025 Monochrome. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Interactive Color Controls */}
      <MonochromeColorControls />
    </div>
  );
}

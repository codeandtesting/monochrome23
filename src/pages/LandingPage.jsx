import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Clock, MessageCircle, Globe, TrendingUp, CheckCircle, Play, Star, Users, Rocket, Moon, Coffee, Target, BarChart3, Shield } from 'lucide-react';

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
      title: "Completely Free",
      description: "No card required, no hidden fees, no limits on number of sites. Start right now.",
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

  const stats = [
    { icon: <Rocket />, value: sitesCount.toLocaleString() + '+', label: "Sites Created", gradient: "from-blue-500 to-cyan-500", live: true },
    { icon: <Users />, value: usersCount.toLocaleString() + '+', label: "Active Users", gradient: "from-purple-500 to-pink-500", live: true },
    { icon: <Star />, value: "4.9", label: "Average Rating", gradient: "from-yellow-500 to-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform">
                <span className="text-xl font-bold">M</span>
              </div>
              <span className="text-xl font-bold">Monochrome</span>
            </div>

            {/* Dashboard Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
            >
              <Sparkles size={18} />
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Trust Badges */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-gray-300">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">No-Code</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm font-medium text-gray-300">100% Free</span>
            </div>
          </div>

          {/* Animated Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-300%">
              {typedText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto animate-fadeInUp leading-relaxed">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent block mb-3">
              While You Sleep — Your Site Works
            </span>
            AI chatbot talks to clients, answers questions<br />
            and collects leads 24/7
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fadeInUp animation-delay-300">
            <button
              onClick={() => navigate('/onboarding')}
              className="group px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl text-xl font-bold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 flex items-center gap-3"
            >
              <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
              Create Site Free
            </button>
            <button
              onClick={() => navigate('/2')}
              className="group px-10 py-5 border-2 border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 rounded-xl text-xl font-bold transition-all flex items-center gap-3"
            >
              <Play size={24} className="group-hover:translate-x-1 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Urgency message */}
          <div className="mb-12 animate-fadeInUp animation-delay-400">
            <p className="text-gray-400 text-lg">
              <span className="text-green-400 font-semibold">Get your first lead</span> today
            </p>
          </div>

          {/* Free Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full backdrop-blur-sm animate-fadeInUp animation-delay-600 hover:scale-105 transition-transform">
            <CheckCircle size={20} className="text-yellow-400 animate-pulse" />
            <span className="text-yellow-100 font-semibold">100% FREE • No Credit Card • Unlimited</span>
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
            <span className="text-red-400">Tired</span> of These Problems?
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">We know what's stopping you</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-xl font-bold mb-2 text-red-400">Slow & Expensive</h3>
              <p className="text-gray-400">Developers charge $1000+ and take months. Every edit costs extra.</p>
            </div>

            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div className="text-4xl mb-3">😴</div>
              <h3 className="text-xl font-bold mb-2 text-red-400">Site Doesn't Sell</h3>
              <p className="text-gray-400">Visitors come and go. No chat, no one to answer questions at 3 AM.</p>
            </div>

            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div className="text-4xl mb-3">🤯</div>
              <h3 className="text-xl font-bold mb-2 text-red-400">Complex Management</h3>
              <p className="text-gray-400">WordPress, hosting, domains, updates. Need a tech expert for every little thing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Live Counters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 hover:scale-105 transition-all group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent flex items-center justify-center gap-2`}>
                  {stat.value}
                  {stat.live && (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Monochrome?</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">Everything you need to launch a selling website</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all group hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} bg-opacity-20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  <div className={`bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-12 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Moon className="w-12 h-12 text-blue-400" />
              <Coffee className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              While You Sleep,<br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Your Site Sells For You
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              AI chatbot talks to every visitor, answers questions,<br />
              tells about your services and collects leads automatically.<br />
              <span className="text-green-400 font-semibold">24/7. No days off. No salary.</span>
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="group px-12 py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl text-2xl font-bold transition-all transform hover:scale-110 hover:shadow-2xl hover:shadow-green-500/50 flex items-center gap-3 mx-auto"
            >
              <Sparkles size={28} className="group-hover:rotate-180 transition-transform duration-500" />
              Launch in 60 Seconds
              <Sparkles size={28} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
            <p className="text-gray-400 mt-6 text-lg">
              Get your <span className="text-green-400 font-semibold">first lead today</span>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-400 mb-12 text-lg">Everything you need to know</p>

          <div className="space-y-4">
            <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-blue-400">❓</span>
                Really in 60 seconds?
              </h3>
              <p className="text-gray-400">Yes! Answer 3 questions — AI creates the site automatically. Text, design, chatbot — everything ready to work.</p>
            </div>

            <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-green-400">💰</span>
                How much does it cost?
              </h3>
              <p className="text-gray-400">Completely free. No hidden fees, no trial period. Create unlimited websites.</p>
            </div>

            <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-purple-400">🤖</span>
                How does the AI chatbot work?
              </h3>
              <p className="text-gray-400">The chatbot learns your services and answers visitor questions 24/7. It collects contacts, talks about prices and services — like an experienced manager.</p>
            </div>

            <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-orange-400">⚙️</span>
                Do I need technical knowledge?
              </h3>
              <p className="text-gray-400">No! The interface is intuitive and easy. Change text, add services, customize colors — like a regular editor.</p>
            </div>

            <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-pink-400">📱</span>
                Does it work on phones?
              </h3>
              <p className="text-gray-400">Yes! All sites are responsive — look beautiful on any device: smartphones, tablets, desktops.</p>
            </div>

            <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-yellow-400">🔒</span>
                Is my data safe?
              </h3>
              <p className="text-gray-400">Absolutely! All data is stored locally in your browser. We don't collect personal information or share it with third parties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold">M</span>
                </div>
                <span className="text-xl font-bold">Monochrome</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Your Vision, Infinite Possibilities. AI-powered website builder for modern businesses.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/onboarding')} className="hover:text-white transition-colors">Create Site</button></li>
                <li><button onClick={() => navigate('/2')} className="hover:text-white transition-colors">Demo</button></li>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Monochrome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

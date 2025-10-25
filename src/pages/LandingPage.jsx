import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Clock, Palette, Globe, TrendingUp, CheckCircle, Play, Star, Users, Rocket } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const fullText = 'Create Your Website in 60 Seconds';

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
      icon: <Zap className="w-8 h-8" />,
      title: "Create in 60 Seconds",
      description: "AI-powered website builder. Just describe your business and get a professional site instantly.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Generate Leads Today",
      description: "Start capturing leads immediately with built-in AI chat and smart forms.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Works While You Sleep",
      description: "24/7 AI assistant engages visitors and collects information even when you're offline.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Flexible Color Settings",
      description: "6 beautiful color schemes. Match your brand perfectly with one click.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "For All Business Types",
      description: "From agencies to freelancers, restaurants to tech startups. One platform, infinite possibilities.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Completely Free",
      description: "No credit card required. No hidden fees. Start building your online presence today.",
      gradient: "from-teal-500 to-green-500"
    }
  ];

  const stats = [
    { icon: <Rocket />, value: "10K+", label: "Sites Created", gradient: "from-blue-500 to-cyan-500" },
    { icon: <Users />, value: "50K+", label: "Happy Users", gradient: "from-purple-500 to-pink-500" },
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

          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeInUp">
            AI-powered platform that builds professional websites instantly.<br />
            <span className="text-green-400 font-semibold">Start generating leads today.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeInUp animation-delay-300">
            <button
              onClick={() => navigate('/onboarding')}
              className="group px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 flex items-center gap-2"
            >
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/2')}
              className="group px-8 py-4 border-2 border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 rounded-lg text-lg font-semibold transition-all flex items-center gap-2"
            >
              <Play size={20} className="group-hover:translate-x-1 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Free Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full backdrop-blur-sm animate-fadeInUp animation-delay-600 hover:scale-105 transition-transform">
            <CheckCircle size={20} className="text-yellow-400 animate-pulse" />
            <span className="text-yellow-100 font-semibold">100% FREE • No Credit Card Required</span>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-40 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-float animation-delay-4000"></div>
      </section>

      {/* Stats Section */}
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
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
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
          <p className="text-center text-gray-400 mb-16 text-lg">Everything you need to launch your online presence</p>

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
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              While You Sleep,<br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Your Website Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              AI chat assistant engages every visitor, answers questions,<br />
              and collects leads automatically. 24/7.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="group px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg text-xl font-bold transition-all transform hover:scale-110 hover:shadow-2xl hover:shadow-green-500/50 flex items-center gap-3 mx-auto"
            >
              <Sparkles size={24} className="group-hover:rotate-180 transition-transform duration-500" />
              Start Building Now
              <Sparkles size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
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
                <li><button onClick={() => navigate('/2')} className="hover:text-white transition-colors">View Demo</button></li>
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

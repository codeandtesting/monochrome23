import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Clock, Palette, Globe, TrendingUp, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Create in 60 Seconds",
      description: "AI-powered website builder. Just describe your business and get a professional site instantly."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Generate Leads Today",
      description: "Start capturing leads immediately with built-in AI chat and smart forms."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Works While You Sleep",
      description: "24/7 AI assistant engages visitors and collects information even when you're offline."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Flexible Color Settings",
      description: "6 beautiful color schemes. Match your brand perfectly with one click."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "For All Business Types",
      description: "From agencies to freelancers, restaurants to tech startups. One platform, infinite possibilities."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Completely Free",
      description: "No credit card required. No hidden fees. Start building your online presence today."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">M</span>
              </div>
              <span className="text-xl font-bold">Monochrome</span>
            </div>

            {/* Dashboard Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Sparkles size={18} />
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Your Website<br />in 60 Seconds
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered platform that builds professional websites instantly.<br />
            Start generating leads today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Sparkles size={20} />
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/2')}
              className="px-8 py-4 border-2 border-gray-600 hover:border-gray-500 rounded-lg text-lg font-semibold transition-all"
            >
              View Demo
            </button>
          </div>
          
          {/* Free Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-full">
            <CheckCircle size={20} className="text-yellow-400" />
            <span className="text-yellow-100 font-semibold">100% FREE • No Credit Card Required</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Monochrome?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
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
            className="px-10 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg text-xl font-bold transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <Sparkles size={24} />
            Start Building Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
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


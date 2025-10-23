import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ShoppingBag, Hammer, Code, Heart } from 'lucide-react';

export default function BusinessTypeSelect() {
  const navigate = useNavigate();

  const businessTypes = [
    {
      id: 'service',
      icon: <Briefcase className="w-12 h-12" />,
      title: 'Service Business',
      description: 'Consulting, Agency, Freelance, Professional Services',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'product',
      icon: <ShoppingBag className="w-12 h-12" />,
      title: 'Product/E-commerce',
      description: 'Online Store, Retail, Physical Products',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'creative',
      icon: <Heart className="w-12 h-12" />,
      title: 'Creative/Personal',
      description: 'Portfolio, Blog, Photography, Art',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'tech',
      icon: <Code className="w-12 h-12" />,
      title: 'Tech/Startup',
      description: 'SaaS, App, Software, Technology',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'local',
      icon: <Hammer className="w-12 h-12" />,
      title: 'Local Business',
      description: 'Restaurant, Salon, Repair, Medical',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'other',
      icon: <Users className="w-12 h-12" />,
      title: 'Other',
      description: 'Non-profit, Education, Community',
      color: 'from-gray-500 to-slate-500'
    }
  ];

  const handleSelect = (typeId) => {
    // Сохраняем выбранный тип в localStorage
    localStorage.setItem('selectedBusinessType', typeId);
    // Переходим на страницу выбора метода онбординга
    navigate('/onboarding/choose-method');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold">M</span>
        </div>
        <span className="text-2xl font-bold">Monochrome</span>
      </div>

      {/* Title */}
      <div className="text-center mb-12 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Let's Get Started
        </h1>
        <p className="text-lg sm:text-xl text-gray-300">
          To get started, simply choose what you're creating a site for.<br />
          This will help prepare the platform specifically for you.
        </p>
      </div>

      {/* Business Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl w-full mb-8">
        {businessTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className="group relative bg-gray-900 border-2 border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-left"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className={`mb-4 bg-gradient-to-br ${type.color} w-16 h-16 rounded-lg flex items-center justify-center text-white`}>
                {type.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                {type.title}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {type.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Skip option */}
      <button
        onClick={() => navigate('/onboarding/choose-method')}
        className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
      >
        Skip this step →
      </button>
    </div>
  );
}


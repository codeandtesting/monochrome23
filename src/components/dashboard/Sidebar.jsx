import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  CreditCard,
  Image,
  Plug,
  Pencil,
  LogOut,
  Menu,
  X,
  Globe,
  Sparkles
} from 'lucide-react';
import { getActiveSite } from '../../utils/sitesStorage';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [activeSite, setActiveSite] = useState(null);

  useEffect(() => {
    loadActiveSite();

    const handleSiteChange = () => {
      loadActiveSite();
    };

    window.addEventListener('activeSiteChanged', handleSiteChange);
    window.addEventListener('sitesUpdated', handleSiteChange);

    return () => {
      window.removeEventListener('activeSiteChanged', handleSiteChange);
      window.removeEventListener('sitesUpdated', handleSiteChange);
    };
  }, []);

  const loadActiveSite = () => {
    const site = getActiveSite();
    setActiveSite(site);
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      path: '/dashboard/my-sites',
      icon: Globe,
      label: 'My Sites',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      path: '/dashboard/quick-edit',
      icon: Pencil,
      label: 'Quick Edit',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      path: '/dashboard/requests',
      icon: MessageSquare,
      label: 'Requests',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      path: '/dashboard/integrations',
      icon: Plug,
      label: 'Integrations',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      path: '/dashboard/subscription',
      icon: CreditCard,
      label: 'Subscription',
      gradient: 'from-pink-500 to-rose-500',
      badge: 'Pro'
    },
    {
      path: '/dashboard/settings',
      icon: Settings,
      label: 'Settings',
      gradient: 'from-gray-500 to-slate-500'
    },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800/50">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500/80 to-purple-600/80 rounded-lg flex items-center justify-center transition-all">
                <span className="text-white font-semibold text-base">
                  {activeSite?.name?.charAt(0).toUpperCase() || 'M'}
                </span>
              </div>
              <div>
                <span className="text-lg font-semibold block">{activeSite?.name || 'Monochrome'}</span>
                <span className="text-xs text-gray-500">AI Website Builder</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
            {menuItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group relative flex items-center justify-between px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${
                      active
                        ? `bg-gradient-to-r ${item.gradient} bg-opacity-10 border-l-2 border-l-blue-500`
                        : 'text-gray-400 hover:bg-gray-800/30 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={18} className={active ? 'text-white' : ''} />
                    <span className={`text-sm ${active ? 'font-medium text-white' : 'font-normal'}`}>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-medium rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section - View Site */}
          <div className="p-4 border-t border-gray-800/50">
            <Link
              to={activeSite?.url || '/'}
              className="group flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 text-gray-400 hover:text-white transition-all"
            >
              <Sparkles size={16} />
              <span className="text-sm font-normal">View Live Site</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

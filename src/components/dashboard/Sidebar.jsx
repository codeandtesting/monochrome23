import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Sparkles,
  ChevronUp,
  User
} from 'lucide-react';
import { getActiveSite } from '../../utils/sitesStorage';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSite, setActiveSite] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

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

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

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
  ];

  const profileMenuItems = [
    {
      path: '/dashboard/settings',
      icon: Settings,
      label: 'Settings',
      gradient: 'from-gray-500 to-slate-500'
    },
    {
      path: '/dashboard/subscription',
      icon: CreditCard,
      label: 'Subscription',
      gradient: 'from-pink-500 to-rose-500',
      badge: 'Pro'
    },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic (clear localStorage, redirect to login)
    console.log('Logout clicked');
    // For now, just redirect to home
    navigate('/');
  };

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

          {/* Bottom Section - User Profile Menu */}
          <div className="p-4 border-t border-gray-800/50 relative" ref={profileMenuRef}>
            {/* Profile Menu Dropdown */}
            {profileMenuOpen && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl overflow-hidden animate-fadeInUp">
                <div className="py-1">
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setIsOpen(false);
                      }}
                      className={`
                        group flex items-center justify-between px-4 py-2.5
                        hover:bg-gray-800/50 transition-colors
                        ${isActive(item.path) ? 'bg-gray-800/30' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {item.label}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-medium rounded">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}

                  {/* Divider */}
                  <div className="my-1 border-t border-gray-800"></div>

                  {/* View Live Site */}
                  <Link
                    to={activeSite?.url || '/'}
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsOpen(false);
                    }}
                    className="group flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-800/50 transition-colors"
                  >
                    <Sparkles size={16} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      View Live Site
                    </span>
                  </Link>

                  {/* Divider */}
                  <div className="my-1 border-t border-gray-800"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full group flex items-center space-x-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm text-gray-300 group-hover:text-red-400 transition-colors">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Profile Button */}
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={`
                group w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                border transition-all
                ${
                  profileMenuOpen
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-gray-900/50 border-gray-800 hover:bg-gray-800/30 hover:border-gray-700'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                {/* User Avatar with "U" */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">U</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">Artjom</div>
                  <div className="text-xs text-gray-500">Pro plan</div>
                </div>
              </div>
              <ChevronUp
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${
                  profileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

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
  User,
  Languages,
  HelpCircle,
  BookOpen,
  Crown,
  ChevronRight
} from 'lucide-react';
import { getActiveSite } from '../../utils/sitesStorage';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSite, setActiveSite] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (United States)');
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

  const languages = [
    'English (United States)',
    'Français (France)',
    'Deutsch (Deutschland)',
    'हिन्दी (भारत)',
    'Indonesia (Indonesia)',
    'Italiano (Italia)',
    '日本語 (日本)',
    '한국어(대한민국)',
    'Português (Brasil)',
    'Español (Latinoamérica)',
    'Español (España)',
    'Русский (Россия)'
  ];

  const profileMenuItems = [
    {
      path: '/dashboard/settings',
      icon: Settings,
      label: 'Settings',
      shortcut: '⌘+Ctrl+,'
    },
    {
      type: 'language',
      icon: Languages,
      label: 'Language',
      hasSubmenu: true
    },
    {
      type: 'button',
      icon: HelpCircle,
      label: 'Get help',
      action: () => window.open('https://docs.monochrome.app/help', '_blank')
    },
    {
      type: 'button',
      icon: BookOpen,
      label: 'Learn more',
      action: () => window.open('https://docs.monochrome.app', '_blank')
    },
    {
      type: 'link',
      path: '/dashboard/settings',
      state: { tab: 'billing' },
      icon: Crown,
      label: 'Upgrade plan'
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
      {/* Mobile Menu Button - Hidden when menu is open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar - Desktop: Vertical, Mobile: Horizontal */}
      <aside
        className={`
          fixed lg:static z-40
          lg:inset-y-0 lg:left-0 lg:w-64
          lg:bg-gradient-to-b from-gray-900 via-gray-900 to-black lg:border-r border-gray-800

          bottom-0 left-0 right-0
          bg-gray-900/95 backdrop-blur-lg border-t

          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-0'}
        `}
      >
        <div className="flex lg:flex-col h-full relative">
          {/* Logo - Desktop Only */}
          <div className="hidden lg:block p-6 border-b border-gray-800/50">
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

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          {/* Navigation - Horizontal on Mobile, Vertical on Desktop */}
          <nav className="flex lg:flex-col flex-1 lg:p-4 p-1.5 lg:space-y-0.5 gap-1.5 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto whitespace-nowrap lg:whitespace-normal">
            {menuItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group relative flex lg:flex-row flex-col items-center lg:justify-between justify-center
                    px-2 py-1.5 lg:px-3 lg:py-2.5 rounded-lg min-w-[70px] lg:min-w-0
                    transition-all duration-200
                    ${
                      active
                        ? `bg-gradient-to-r ${item.gradient} bg-opacity-10 lg:border-l-2 lg:border-l-blue-500 border-b-2 lg:border-b-0 border-b-blue-500`
                        : 'text-gray-400 hover:bg-gray-800/30 hover:text-white'
                    }
                  `}
                >
                  <div className="flex lg:flex-row flex-col items-center lg:space-x-3 gap-0.5">
                    <item.icon size={16} className={active ? 'text-white' : ''} />
                    <span className={`text-[10px] lg:text-sm ${active ? 'font-medium text-white' : 'font-normal'}`}>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="hidden lg:inline-block px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-medium rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section - User Profile Menu (Desktop Only) */}
          <div className="hidden lg:block p-4 border-t border-gray-800/50 relative" ref={profileMenuRef}>
            {/* Profile Menu Dropdown */}
            {profileMenuOpen && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl overflow-hidden animate-fadeInUp">
                <div className="py-1">
                  {profileMenuItems.map((item, index) => {
                    // Language menu item with submenu
                    if (item.type === 'language') {
                      return (
                        <div key={index} className="relative">
                          <button
                            onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                            className="w-full group flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/50 transition-colors text-left"
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                {item.label}
                              </span>
                            </div>
                            <ChevronRight size={14} className="text-gray-500" />
                          </button>

                          {/* Language Submenu */}
                          {languageMenuOpen && (
                            <div className="absolute left-full top-0 ml-1 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl max-h-80 overflow-y-auto">
                              <div className="py-1">
                                {languages.map((lang) => (
                                  <button
                                    key={lang}
                                    onClick={() => {
                                      setSelectedLanguage(lang);
                                      setLanguageMenuOpen(false);
                                      setProfileMenuOpen(false);
                                    }}
                                    className="w-full group flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/50 transition-colors text-left"
                                  >
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                      {lang}
                                    </span>
                                    {selectedLanguage === lang && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Button type (with custom action)
                    if (item.type === 'button') {
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            item.action();
                            setProfileMenuOpen(false);
                          }}
                          className="w-full group flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/50 transition-colors text-left"
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                              {item.label}
                            </span>
                          </div>
                        </button>
                      );
                    }

                    // Regular link item
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        state={item.state || undefined}
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
                        {item.shortcut && (
                          <span className="text-xs text-gray-500">
                            {item.shortcut}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  {/* Divider */}
                  <div className="my-1 border-t border-gray-800"></div>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full group flex items-center space-x-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm text-gray-300 group-hover:text-red-400 transition-colors">
                      Log out
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Profile Button */}
            <button
              type="button"
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
                {/* User Avatar with initials */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">FF</span>
                </div>
                <div className="text-left overflow-hidden">
                  <div className="text-sm font-medium text-white truncate">faazylav@gmail.com</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Crown size={10} className="text-yellow-500" />
                    Max plan
                  </div>
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

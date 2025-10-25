import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronUp, Pencil, MessageSquare, Palette, Image, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getActiveSite } from '../utils/sitesStorage';
import { getChatsBySite } from '../utils/chatStorage';
import { getAllPortfolioItems } from '../utils/portfolioStorage';

export default function OnboardingChecklist() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Check if user has dismissed the checklist
    const dismissed = localStorage.getItem('onboarding_checklist_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Load and check completion status
    loadChecklist();

    // Listen for updates
    const handleUpdate = () => loadChecklist();
    window.addEventListener('activeSiteChanged', handleUpdate);
    window.addEventListener('sitesUpdated', handleUpdate);
    window.addEventListener('portfolioUpdated', handleUpdate);

    return () => {
      window.removeEventListener('activeSiteChanged', handleUpdate);
      window.removeEventListener('sitesUpdated', handleUpdate);
      window.removeEventListener('portfolioUpdated', handleUpdate);
    };
  }, []);

  const loadChecklist = () => {
    const site = getActiveSite();
    if (!site) return;

    const items = [
      {
        id: 'edit_content',
        title: 'Edit your website content',
        description: 'Customize your hero section, tagline, and company description',
        icon: Pencil,
        link: '/dashboard/quick-edit',
        completed: checkContentEdited(site)
      },
      {
        id: 'customize_design',
        title: 'Customize design & colors',
        description: 'Choose your color scheme and layout style',
        icon: Palette,
        link: '/dashboard/design',
        completed: checkDesignCustomized(site)
      },
      {
        id: 'add_portfolio',
        title: 'Add portfolio items',
        description: 'Showcase your work with images and descriptions',
        icon: Image,
        link: '/dashboard/portfolio',
        completed: checkPortfolioAdded(site)
      },
      {
        id: 'test_chat',
        title: 'Test your chatbot',
        description: 'Try having a conversation with your AI assistant',
        icon: MessageSquare,
        link: site.url || '/',
        external: true,
        completed: checkChatTested(site)
      },
      {
        id: 'publish',
        title: 'View your live website',
        description: 'See how your website looks to visitors',
        icon: ExternalLink,
        link: site.url || '/',
        external: true,
        completed: false // Always show as incomplete to encourage viewing
      }
    ];

    const completed = items.filter(item => item.completed).length;
    setChecklist(items);
    setCompletedCount(completed);

    // Auto-dismiss when all tasks (except view site) are completed
    if (completed >= 4) {
      setIsExpanded(false);
    }
  };

  const checkContentEdited = (site) => {
    // Check if user has customized hero content
    if (!site.data?.hero) return false;
    const hero = site.data.hero;
    // If tagline or description has changed from default AI-generated content
    return hero.tagline && hero.description && hero.tagline.length > 10;
  };

  const checkDesignCustomized = (site) => {
    // Check if user has changed color scheme or layout
    return site.design && (site.design.colorScheme !== 'purple' || site.design.activeLanding);
  };

  const checkPortfolioAdded = (site) => {
    // Check if user has added at least one portfolio item (custom, not default)
    const portfolioItems = getAllPortfolioItems();
    const customItems = portfolioItems.filter(item => !item.isDefault);
    return customItems && customItems.length > 0;
  };

  const checkChatTested = (site) => {
    // Check if there's at least one chat conversation
    const chats = getChatsBySite(site.id);
    return chats && chats.length > 0;
  };

  const handleDismiss = () => {
    localStorage.setItem('onboarding_checklist_dismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  const progress = (completedCount / checklist.length) * 100;

  return (
    <div className="relative bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg overflow-hidden hover:border-blue-500/30 transition-all">
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
            {completedCount === checklist.length ? (
              <Check size={16} className="text-blue-400" />
            ) : (
              <span className="text-blue-400 font-medium text-xs">{completedCount}/{checklist.length}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">Getting Started Checklist</h3>
            <p className="text-xs text-gray-500">
              {completedCount === checklist.length
                ? 'All done! Your website is ready'
                : `${checklist.length - completedCount} tasks remaining`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="p-1 hover:bg-gray-800/50 rounded transition-colors"
            title="Dismiss checklist"
          >
            <X size={16} className="text-gray-500 hover:text-gray-400 transition-colors" />
          </button>
          {isExpanded ? (
            <ChevronUp size={18} className="text-gray-500" />
          ) : (
            <ChevronDown size={18} className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-3">
        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      {isExpanded && (
        <div className="p-4 pt-1 space-y-1.5">
          {checklist.map((item, index) => {
            const Icon = item.icon;
            const ItemContent = (
              <div
                className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all group/task ${
                  item.completed
                    ? 'border-green-500/20 bg-green-500/5'
                    : 'border-gray-800 bg-gray-900/30 hover:bg-gray-800/30 hover:border-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                  item.completed
                    ? 'bg-green-500/20 border border-green-500/40'
                    : 'bg-gray-800 border border-gray-700 group-hover/task:border-blue-500/50'
                }`}>
                  {item.completed ? (
                    <Check size={12} className="text-green-400" />
                  ) : (
                    <Icon size={12} className="text-gray-500 group-hover/task:text-blue-400 transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-normal transition-colors ${
                    item.completed ? 'text-green-400/70 line-through' : 'text-gray-300 group-hover/task:text-white'
                  }`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {item.description}
                  </p>
                </div>
                {!item.completed && (
                  <div className="flex-shrink-0">
                    <div className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs rounded hover:bg-blue-500/20 transition-colors">
                      Go
                    </div>
                  </div>
                )}
              </div>
            );

            return item.external ? (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {ItemContent}
              </a>
            ) : (
              <Link
                key={item.id}
                to={item.link}
              >
                {ItemContent}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

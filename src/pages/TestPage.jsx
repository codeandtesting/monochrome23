import React, { useState } from 'react';
import { Smartphone, Monitor, RotateCw } from 'lucide-react';
import ChatPage from './ChatPage';
import ClientSitePage from './ClientSitePage';
import { getActiveSite } from '../utils/sitesStorage';

export default function TestPage() {
  const [layout, setLayout] = useState('main'); // 'main' or 'client'
  const [device, setDevice] = useState('mobile'); // 'mobile' or 'desktop'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' or 'landscape'
  
  const activeSite = getActiveSite();
  
  // Create a modified siteData that respects our local layout choice
  const testSiteData = activeSite ? {
    ...activeSite,
    design: {
      ...activeSite.design,
      activeLanding: layout // Override with current test layout
    }
  } : null;

  const deviceSizes = {
    mobile: {
      portrait: { width: '375px', height: '667px' }, // iPhone SE
      landscape: { width: '667px', height: '375px' }
    },
    tablet: {
      portrait: { width: '768px', height: '1024px' }, // iPad
      landscape: { width: '1024px', height: '768px' }
    },
    desktop: {
      portrait: { width: '100%', height: '100%' },
      landscape: { width: '100%', height: '100%' }
    }
  };

  const currentSize = deviceSizes[device][orientation];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Control Panel */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            {/* Title */}
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-2xl font-bold">Layout Test Page</h1>
              <p className="text-sm text-gray-400">Testing: {activeSite?.name || 'Site'}</p>
            </div>

            {/* Layout Selector */}
            <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setLayout('main')}
                className={`px-4 py-2 rounded transition-all ${
                  layout === 'main'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Layout 1 (Main)
              </button>
              <button
                onClick={() => setLayout('client')}
                className={`px-4 py-2 rounded transition-all ${
                  layout === 'client'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Layout 2 (Split)
              </button>
            </div>

            {/* Device Selector */}
            <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setDevice('mobile')}
                className={`px-4 py-2 rounded transition-all flex items-center gap-2 ${
                  device === 'mobile'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone size={18} />
                Mobile
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`px-4 py-2 rounded transition-all flex items-center gap-2 ${
                  device === 'tablet'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Monitor size={18} />
                Tablet
              </button>
              <button
                onClick={() => setDevice('desktop')}
                className={`px-4 py-2 rounded transition-all flex items-center gap-2 ${
                  device === 'desktop'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Monitor size={18} />
                Desktop
              </button>
            </div>

            {/* Orientation Toggle */}
            {device !== 'desktop' && (
              <button
                onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all flex items-center gap-2"
                title="Rotate"
              >
                <RotateCw size={18} />
                {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
              </button>
            )}
          </div>

          {/* Info */}
          <div className="mt-3 text-sm text-gray-400">
            Current size: <span className="text-white font-mono">{currentSize.width} × {currentSize.height}</span>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          className="bg-black border-4 border-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: currentSize.width,
            height: currentSize.height,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          {layout === 'main' ? (
            <ChatPage siteData={testSiteData} embedded />
          ) : (
            <ClientSitePage siteData={testSiteData} forceMobile={device !== 'desktop'} />
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2 text-blue-400">Layout 1 (Main Landing)</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Chat-only interface</li>
                <li>• Centered layout</li>
                <li>• Hero section with company info</li>
                <li>• Best for chat-focused interaction</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-400">Layout 2 (Split/Client Site)</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Split layout (desktop)</li>
                <li>• Left: Dynamic content showcase</li>
                <li>• Right: Chat interface</li>
                <li>• Auto-cycling content every 5s</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


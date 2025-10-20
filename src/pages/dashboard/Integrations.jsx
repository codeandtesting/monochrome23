import React, { useState } from 'react';

export default function Integrations() {
  const [calendlyUrl, setCalendlyUrl] = useState('https://calendly.com/yourcompany');
  const [calendlyConnected, setCalendlyConnected] = useState(true);

  const integrations = [
    {
      id: 'calendly',
      name: 'Calendly',
      description: 'Букинг встреч',
      color: 'bg-blue-500',
      connected: true,
      locked: false,
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Аналитика посетителей',
      color: 'bg-purple-500',
      connected: false,
      locked: true,
      plan: 'Pro план',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Уведомления о лидах',
      color: 'bg-green-500',
      connected: false,
      locked: true,
      plan: 'Pro план',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Интеграции</h1>
      </div>

      {/* Integrations List */}
      <div className="space-y-4 max-w-2xl">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className={`bg-gray-900 border border-gray-800 rounded-lg p-4 ${
              integration.locked ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${integration.color} rounded`}></div>
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-gray-400">{integration.description}</p>
                </div>
              </div>
              
              {integration.locked ? (
                <span className="text-xs bg-yellow-500 bg-opacity-20 text-yellow-400 px-2 py-1 rounded">
                  {integration.plan}
                </span>
              ) : (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integration.connected}
                    onChange={() => {
                      if (integration.id === 'calendly') {
                        setCalendlyConnected(!calendlyConnected);
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[26px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              )}
            </div>
            
            {integration.id === 'calendly' && calendlyConnected && (
              <div className="mt-3">
                <input
                  type="url"
                  value={calendlyUrl}
                  onChange={(e) => setCalendlyUrl(e.target.value)}
                  placeholder="https://calendly.com/your-username"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


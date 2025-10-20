import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}

export function DashboardProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Admin User',
    email: 'admin@progressit.online',
    plan: 'pro',
  });

  const [stats, setStats] = useState({
    totalRequests: 47,
    activeChats: 8,
    conversionRate: 34,
    revenue: 12450,
  });

  const [requests, setRequests] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [settings, setSettings] = useState({});

  // Load data from localStorage or API
  useEffect(() => {
    // Load saved data
    const savedSettings = localStorage.getItem('dashboard_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('dashboard_settings', JSON.stringify(newSettings));
  };

  // Add request
  const addRequest = (request) => {
    setRequests([...requests, { ...request, id: Date.now() }]);
  };

  // Update request
  const updateRequest = (id, updates) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, ...updates } : req
    ));
  };

  // Delete request
  const deleteRequest = (id) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  // Portfolio management
  const addPortfolioItem = (item) => {
    setPortfolioItems([...portfolioItems, { ...item, id: Date.now() }]);
  };

  const updatePortfolioItem = (id, updates) => {
    setPortfolioItems(portfolioItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deletePortfolioItem = (id) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  const value = {
    user,
    stats,
    requests,
    portfolioItems,
    settings,
    setUser,
    setStats,
    updateSettings,
    addRequest,
    updateRequest,
    deleteRequest,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}


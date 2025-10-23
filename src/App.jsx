import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './contexts/DashboardContext';
import { initializeSitesFromLegacy, fixMissingUrls } from './utils/sitesStorage';

// Pages
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import ClientSitePage from './pages/ClientSitePage';
import SitePage from './pages/SitePage';
import TestPage from './pages/TestPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Requests from './pages/dashboard/Requests';
import RequestDetail from './pages/dashboard/RequestDetail';
import Settings from './pages/dashboard/Settings';
import Subscription from './pages/dashboard/Subscription';
import Portfolio from './pages/dashboard/Portfolio';
import Integrations from './pages/dashboard/Integrations';
import QuickEdit from './pages/dashboard/QuickEdit';
import MySites from './pages/dashboard/MySites';

// Onboarding Pages
import BusinessTypeSelect from './pages/onboarding/BusinessTypeSelect';
import ChooseMethod from './pages/onboarding/ChooseMethod';
import AIWizardStep1 from './pages/onboarding/AIWizardStep1';
import AIWizardStep2 from './pages/onboarding/AIWizardStep2';
import AIWizardStep3 from './pages/onboarding/AIWizardStep3';
import AIWizardPreview from './pages/onboarding/AIWizardPreview';
import ManualStep1 from './pages/onboarding/ManualStep1';
import ManualStep2 from './pages/onboarding/ManualStep2';
import ManualStep3 from './pages/onboarding/ManualStep3';
import ManualStep4 from './pages/onboarding/ManualStep4';

export default function App() {
  // Initialize sites system on first load
  useEffect(() => {
    initializeSitesFromLegacy();
    fixMissingUrls(); // Fix any sites without URLs
  }, []);

  return (
    <BrowserRouter>
      <DashboardProvider>
        <Routes>
          {/* Onboarding Routes */}
          <Route path="/onboarding" element={<BusinessTypeSelect />} />
          <Route path="/onboarding/choose-method" element={<ChooseMethod />} />
          
          {/* AI Wizard Routes */}
          <Route path="/onboarding/ai-wizard/step1" element={<AIWizardStep1 />} />
          <Route path="/onboarding/ai-wizard/step2" element={<AIWizardStep2 />} />
          <Route path="/onboarding/ai-wizard/step3" element={<AIWizardStep3 />} />
          <Route path="/onboarding/ai-wizard/preview" element={<AIWizardPreview />} />
          
          {/* Manual Setup Routes */}
          <Route path="/onboarding/manual/step1" element={<ManualStep1 />} />
          <Route path="/onboarding/manual/step2" element={<ManualStep2 />} />
          <Route path="/onboarding/manual/step3" element={<ManualStep3 />} />
          <Route path="/onboarding/manual/step4" element={<ManualStep4 />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="my-sites" element={<MySites />} />
            <Route path="requests" element={<Requests />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="settings" element={<Settings />} />
            <Route path="quick-edit" element={<QuickEdit />} />
          </Route>

          {/* Main Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Test Page - Layout Testing */}
          <Route path="/test" element={<TestPage />} />
          
          {/* Site Routes - универсальный роут для всех клиентских сайтов */}
          <Route path="/:siteId" element={<SitePage />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}

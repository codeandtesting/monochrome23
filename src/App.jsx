import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './contexts/DashboardContext';

// Pages
import ChatPage from './pages/ChatPage';
import ClientSitePage from './pages/ClientSitePage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Requests from './pages/dashboard/Requests';
import Settings from './pages/dashboard/Settings';
import Subscription from './pages/dashboard/Subscription';
import Portfolio from './pages/dashboard/Portfolio';
import Integrations from './pages/dashboard/Integrations';
import QuickEdit from './pages/dashboard/QuickEdit';

// Onboarding Pages
import OnboardingStep1 from './pages/onboarding/OnboardingStep1';
import AIWizardStep1 from './pages/onboarding/AIWizardStep1';
import AIWizardStep2 from './pages/onboarding/AIWizardStep2';
import AIWizardStep3 from './pages/onboarding/AIWizardStep3';
import AIWizardPreview from './pages/onboarding/AIWizardPreview';
import ManualOnboarding from './pages/onboarding/ManualOnboarding';

export default function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <Routes>
          {/* Main Chat Page */}
          <Route path="/" element={<ChatPage />} />
          
          {/* Client Site Demo */}
          <Route path="/2" element={<ClientSitePage />} />

          {/* Onboarding Routes */}
          <Route path="/onboarding" element={<OnboardingStep1 />} />
          <Route path="/onboarding/ai-wizard/step1" element={<AIWizardStep1 />} />
          <Route path="/onboarding/ai-wizard/step2" element={<AIWizardStep2 />} />
          <Route path="/onboarding/ai-wizard/step3" element={<AIWizardStep3 />} />
          <Route path="/onboarding/ai-wizard/preview" element={<AIWizardPreview />} />
          <Route path="/onboarding/manual/step1" element={<ManualOnboarding />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="requests" element={<Requests />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="settings" element={<Settings />} />
            <Route path="quick-edit" element={<QuickEdit />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}

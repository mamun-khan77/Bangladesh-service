import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { InteractiveMap } from './components/InteractiveMap';
import { ReportFeed } from './components/ReportFeed';
import { TransparencyDashboard } from './components/TransparencyDashboard';
import { PoliceDirectory } from './components/PoliceDirectory';
import { AuthorityDirectory } from './components/AuthorityDirectory';
import { EmergencyDirectory } from './components/EmergencyDirectory';
import { RoleDashboard } from './components/RoleDashboard';
import { ReportWizardModal } from './components/ReportWizardModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { InfoModal } from './components/InfoModal';
import { PlusCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setIsReportWizardOpen } = useApp();
  const [activeInfoModal, setActiveInfoModal] = useState<'contact' | 'faq' | 'privacy' | 'terms' | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 antialiased selection:bg-emerald-600 selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Dynamic View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 sm:space-y-8">
        {(activeTab === 'home' || activeTab === 'map') && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            <HeroSection />
            <InteractiveMap />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="animate-in fade-in duration-200">
            <ReportFeed />
          </div>
        )}

        {(activeTab === 'transparency' || activeTab === 'analytics') && (
          <div className="animate-in fade-in duration-200">
            <TransparencyDashboard />
          </div>
        )}

        {activeTab === 'police' && (
          <div className="animate-in fade-in duration-200">
            <PoliceDirectory />
          </div>
        )}

        {activeTab === 'authorities' && (
          <div className="animate-in fade-in duration-200">
            <AuthorityDirectory />
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="animate-in fade-in duration-200">
            <EmergencyDirectory />
          </div>
        )}

        {(activeTab === 'dashboard' || activeTab.endsWith('_dash')) && (
          <div className="animate-in fade-in duration-200">
            <RoleDashboard />
          </div>
        )}
      </main>

      {/* Floating Action Button for Quick Issue Reporting (Mobile optimized) */}
      <button
        onClick={() => setIsReportWizardOpen(true)}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center space-x-2 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 ring-2 ring-white/20 dark:ring-emerald-400/30 font-bold text-sm hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer"
        title="File a Civic Issue Report"
      >
        <PlusCircle className="w-5 h-5 text-white" />
        <span className="hidden sm:inline">Report Issue</span>
      </button>

      {/* Modals */}
      <ReportWizardModal />
      <ReportDetailModal />
      <InfoModal type={activeInfoModal} onClose={() => setActiveInfoModal(null)} />

      {/* Footer */}
      <Footer onOpenModal={(type) => setActiveInfoModal(type)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

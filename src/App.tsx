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
  const { activeTab, setIsReportWizardOpen, theme } = useApp();
  const [activeInfoModal, setActiveInfoModal] = useState<'contact' | 'faq' | 'privacy' | 'terms' | null>(null);

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#F0EDE4] text-[#004741]' : 'bg-[#003833] text-[#F0EDE4]'} flex flex-col font-sans selection:bg-[#F0EDE4] selection:text-[#004741] transition-colors duration-200`}>
      {/* Navbar */}
      <Navbar />

      {/* Dynamic View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {(activeTab === 'home' || activeTab === 'map') && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <HeroSection />
            <InteractiveMap />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="animate-in fade-in duration-200">
            <ReportFeed />
          </div>
        )}

        {activeTab === 'transparency' && (
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

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            <RoleDashboard />
          </div>
        )}
      </main>

      {/* Floating Action Button for Quick Issue Reporting */}
      <button
        onClick={() => setIsReportWizardOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 px-5 py-3 rounded-full bg-[#E4FD97] text-[#004741] hover:bg-[#d5f47d] shadow-xl shadow-black/25 ring-2 ring-[#004741]/30 font-black text-sm hover:scale-105 transition-all focus:outline-none cursor-pointer"
        title="File a Civic Issue Report"
      >
        <PlusCircle className="w-5 h-5 text-[#004741]" />
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

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Shield,
  FileText,
  MapPin,
  Building2,
  BarChart3,
  Globe,
  Bell,
  UserCheck,
  PlusCircle,
  Menu,
  X,
  Lock,
  ChevronDown,
  CheckCircle2,
  PhoneCall,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    toggleLanguage,
    user,
    switchRole,
    setIsReportWizardOpen,
    notifications,
    markNotificationAsRead,
    setSelectedReport,
    reports,
    t,
    theme,
    toggleTheme
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'citizen', label: 'Citizen', desc: 'Public reporting & civic tracking' },
    { role: 'moderator', label: 'Moderator', desc: 'Civic triage & evidence verification' },
    { role: 'authority', label: 'Authority', desc: 'Official response & public resolution' },
    { role: 'admin', label: 'Administrator', desc: 'System governance & audit trail' }
  ];

  const handleNav = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const clearAllNotifications = () => {
    notifications.forEach((n) => {
      if (!n.isRead) markNotificationAsRead(n.id);
    });
  };

  const openNotifReport = (reportId?: string, notifId?: string) => {
    if (notifId) markNotificationAsRead(notifId);
    if (reportId) {
      const rep = reports.find((r) => r.id === reportId);
      if (rep) {
        setSelectedReport(rep);
      }
    }
    setIsNotifDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isLight = theme === 'light';

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-200"
      id="main-header"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group shrink-0"
            onClick={() => handleNav('home')}
            id="nav-brand-logo"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-900/20 group-hover:bg-emerald-500 transition-all">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-amber-400" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight block text-slate-900 dark:text-white">
                <span className="hidden sm:inline">
                  {language === 'bn' ? 'বাংলাদেশ সিভিক ওয়াচ' : 'Bangladesh Civic Watch'}
                </span>
                <span className="sm:hidden">
                  {language === 'bn' ? 'সিভিক ওয়াচ' : 'Civic Watch'}
                </span>
              </span>
              <span className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                {language === 'bn' ? 'নাগরিক পর্যবেক্ষণ ও স্বচ্ছতা প্ল্যাটফর্ম' : 'Civic Grievance & Accountability'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {[
              { id: 'home', label: 'Home', icon: null },
              { id: 'map', label: t.exploreMap, icon: MapPin },
              { id: 'reports', label: t.viewReports, icon: FileText },
              { id: 'police', label: t.policeAndEmergency, icon: PhoneCall },
              { id: 'authorities', label: t.authorities, icon: Building2 },
              { id: 'analytics', label: t.statistics, icon: BarChart3 }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Dynamic Dashboard based on Role */}
            <button
              onClick={() => handleNav('dashboard')}
              id="nav-link-role-dash"
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                activeTab === 'dashboard' || activeTab.endsWith('_dash')
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {user.role === 'admin' ? (
                <Lock className="w-3.5 h-3.5 text-amber-500" />
              ) : user.role === 'authority' ? (
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              ) : user.role === 'moderator' ? (
                <Shield className="w-3.5 h-3.5 text-teal-500" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span className="capitalize">{user.role} Portal</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Primary Report CTA */}
            <button
              onClick={() => setIsReportWizardOpen(true)}
              id="btn-nav-report-issue"
              className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">{t.reportAnIssue}</span>
              <span className="sm:hidden">Report</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              id="btn-language-switcher"
              title="Switch language between English and বাংলা"
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{language === 'en' ? 'বাং' : 'EN'}</span>
            </button>

            {/* Theme Switcher (Dark / Light) */}
            <button
              onClick={toggleTheme}
              id="btn-theme-toggle"
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-slate-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                id="btn-notifications-dropdown"
                className="relative p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full font-bold text-[10px] flex items-center justify-center bg-rose-500 text-white shadow-xs">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div
                  className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  id="notifications-dropdown-menu"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold flex items-center space-x-1.5 text-slate-900 dark:text-white">
                      <Bell className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t.notifications} ({notifications.length})</span>
                    </span>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto mt-2 space-y-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs py-5 text-center text-slate-500 dark:text-slate-400">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => openNotifReport(n.reportId, n.id)}
                          className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                            n.isRead
                              ? 'hover:bg-slate-100 dark:hover:bg-slate-800/60 opacity-80'
                              : 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</h4>
                            <span className="text-[10px] text-slate-500 shrink-0">
                              {new Date(n.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[11px] mt-1 line-clamp-2 text-slate-600 dark:text-slate-300">
                            {n.message}
                          </p>
                          {n.reportId && (
                            <span className="inline-block mt-1.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              View #{n.reportId} →
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher (Desktop) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                id="btn-role-switcher"
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="capitalize">{user.role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  id="role-dropdown-menu"
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    {t.switchRole}
                  </div>
                  <div className="mt-1 space-y-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-start space-x-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          user.role === r.role
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white capitalize">{r.label}</span>
                            {user.role === r.role && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-[10px] leading-tight mt-0.5 text-slate-500 dark:text-slate-400">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-in slide-in-from-top-2">
            {[
              { id: 'home', label: 'Home', icon: null },
              { id: 'map', label: t.exploreMap, icon: MapPin },
              { id: 'reports', label: t.viewReports, icon: FileText },
              { id: 'police', label: t.policeAndEmergency, icon: PhoneCall },
              { id: 'authorities', label: t.authorities, icon: Building2 },
              { id: 'analytics', label: t.statistics, icon: BarChart3 },
              { id: 'dashboard', label: `${user.role.toUpperCase()} ${t.dashboard}`, icon: UserCheck }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab.endsWith('_dash'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Role Switcher Bar */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 block mb-2">
                {t.switchRole}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      handleNav('dashboard');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      user.role === r.role
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

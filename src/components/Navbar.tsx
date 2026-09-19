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
  };

  const isLight = theme === 'light';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
        isLight
          ? 'bg-[#FAF8F5]/95 border-[#004741]/20 text-[#004741]'
          : 'bg-[#003833]/95 border-[#F0EDE4]/20 text-[#F0EDE4]'
      }`}
      id="main-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNav('home')}
            id="nav-brand-logo"
          >
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl border transition-colors ${
                isLight
                  ? 'bg-[#F0EDE4] border-[#004741]/30 group-hover:border-[#004741]'
                  : 'bg-[#004741] border-[#F0EDE4]/30 group-hover:border-[#F0EDE4]'
              }`}
            >
              <Shield className={`w-5 h-5 ${isLight ? 'text-[#004741]' : 'text-[#F0EDE4]'}`} />
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 bg-[#E4FD97] ring-[#004741]"
              />
            </div>
            <div>
              <span
                className={`font-extrabold text-lg tracking-tight transition-colors ${
                  isLight ? 'text-[#004741]' : 'text-[#F0EDE4]'
                }`}
              >
                {language === 'bn' ? 'বাংলাদেশ সিভিক ওয়াচ' : 'Bangladesh Civic Watch'}
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
                  className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? isLight
                        ? 'bg-[#004741] text-[#F0EDE4] shadow-sm'
                        : 'bg-[#F0EDE4] text-[#004741] font-bold shadow-sm'
                      : isLight
                      ? 'text-[#004741]/80 hover:text-[#004741] hover:bg-[#004741]/10'
                      : 'text-[#F0EDE4]/80 hover:text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Dynamic Dashboard based on Role */}
            {user.role === 'citizen' && (
              <button
                onClick={() => handleNav('citizen_dash')}
                id="nav-link-citizen-dash"
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'citizen_dash'
                    ? isLight
                      ? 'bg-[#004741] text-[#F0EDE4]'
                      : 'bg-[#F0EDE4] text-[#004741]'
                    : isLight
                    ? 'text-[#004741]/80 hover:text-[#004741] hover:bg-[#004741]/10'
                    : 'text-[#F0EDE4]/80 hover:text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
                }`}
              >
                {t.dashboard}
              </button>
            )}
            {user.role === 'moderator' && (
              <button
                onClick={() => handleNav('moderator_dash')}
                id="nav-link-mod-dash"
                className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                  activeTab === 'moderator_dash'
                    ? isLight
                      ? 'bg-[#004741] text-[#F0EDE4] border-[#004741]'
                      : 'bg-[#F0EDE4] text-[#004741] border-[#F0EDE4]'
                    : isLight
                    ? 'bg-[#004741]/10 text-[#004741] border-[#004741]/30 hover:bg-[#004741]/20'
                    : 'bg-[#F0EDE4]/15 text-[#F0EDE4] border-[#F0EDE4]/30 hover:bg-[#F0EDE4]/25'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Moderation Queue</span>
              </button>
            )}
            {user.role === 'authority' && (
              <button
                onClick={() => handleNav('authority_dash')}
                id="nav-link-auth-dash"
                className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                  activeTab === 'authority_dash'
                    ? isLight
                      ? 'bg-[#004741] text-[#F0EDE4] border-[#004741]'
                      : 'bg-[#F0EDE4] text-[#004741] border-[#F0EDE4]'
                    : isLight
                    ? 'bg-[#004741]/10 text-[#004741] border-[#004741]/30 hover:bg-[#004741]/20'
                    : 'bg-[#F0EDE4]/15 text-[#F0EDE4] border-[#F0EDE4]/30 hover:bg-[#F0EDE4]/25'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Official Portal</span>
              </button>
            )}
            {user.role === 'admin' && (
              <button
                onClick={() => handleNav('admin_dash')}
                id="nav-link-admin-dash"
                className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg border ${
                  activeTab === 'admin_dash'
                    ? isLight
                      ? 'bg-[#004741] text-[#F0EDE4] border-[#004741]'
                      : 'bg-[#F0EDE4] text-[#004741] border-[#F0EDE4]'
                    : isLight
                    ? 'bg-[#004741]/10 text-[#004741] border-[#004741]/30 hover:bg-[#004741]/20'
                    : 'bg-[#F0EDE4]/15 text-[#F0EDE4] border-[#F0EDE4]/30 hover:bg-[#F0EDE4]/25'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Primary Report CTA */}
            <button
              onClick={() => setIsReportWizardOpen(true)}
              id="btn-nav-report-issue"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-black text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-[#E4FD97] hover:bg-[#d5f47d] text-[#004741] border border-[#004741]/20 shadow-md shadow-black/10"
            >
              <PlusCircle className="w-4 h-4 text-[#004741]" />
              <span>{t.reportAnIssue}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              id="btn-language-switcher"
              title="Switch language between English and বাংলা"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isLight
                  ? 'bg-[#FAF8F5] border-[#004741]/25 text-[#004741] hover:bg-[#004741]/10'
                  : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Theme Switcher (Dark / Light) */}
            <button
              onClick={toggleTheme}
              id="btn-theme-toggle"
              title={
                !isLight
                  ? language === 'bn'
                    ? 'লাইট মোডে পরিবর্তন করুন'
                    : 'Switch to Light Mode'
                  : language === 'bn'
                  ? 'ডার্ক মোডে পরিবর্তন করুন'
                  : 'Switch to Dark Mode'
              }
              aria-label={!isLight ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`flex items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-[#FAF8F5] border-[#004741]/25 text-[#004741] hover:bg-[#004741]/10'
                  : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
              }`}
            >
              {!isLight ? (
                <Sun className="w-4 h-4 text-[#F0EDE4] transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-[#004741] transition-transform" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                id="btn-notifications-dropdown"
                className={`relative p-2 rounded-lg border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-[#FAF8F5] border-[#004741]/25 text-[#004741] hover:bg-[#004741]/10'
                    : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full font-black text-[10px] flex items-center justify-center bg-[#E4FD97] text-[#004741] border border-[#004741]/30 shadow-sm"
                  >
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                    isLight
                      ? 'bg-[#FAF8F5] border-[#004741]/25 text-[#004741]'
                      : 'bg-[#003833] border-[#F0EDE4]/25 text-[#F0EDE4]'
                  }`}
                  id="notifications-dropdown-menu"
                >
                  <div
                    className={`flex items-center justify-between pb-2 border-b ${
                      isLight ? 'border-[#004741]/20' : 'border-[#F0EDE4]/20'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center space-x-1.5">
                      <Bell className="w-3.5 h-3.5" />
                      <span>{t.notifications} ({notifications.length})</span>
                    </span>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className={`text-[10px] hover:underline cursor-pointer ${
                          isLight ? 'text-[#004741]/75 hover:text-[#004741]' : 'text-[#F0EDE4]/75 hover:text-[#F0EDE4]'
                        }`}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className={`divide-y max-h-72 overflow-y-auto mt-2 ${
                    isLight ? 'divide-[#004741]/10' : 'divide-[#F0EDE4]/10'
                  }`}>
                    {notifications.length === 0 ? (
                      <p
                        className={`text-xs py-4 text-center ${
                          isLight ? 'text-[#004741]/60' : 'text-[#F0EDE4]/60'
                        }`}
                      >
                        No notifications
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => openNotifReport(n.reportId, n.id)}
                          className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                            n.isRead
                              ? isLight
                                ? 'hover:bg-[#004741]/5 opacity-75'
                                : 'hover:bg-[#F0EDE4]/5 opacity-75'
                              : isLight
                              ? 'bg-[#004741]/10 hover:bg-[#004741]/15'
                              : 'bg-[#F0EDE4]/15 hover:bg-[#F0EDE4]/20'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-semibold">{n.title}</h4>
                            <span
                              className={`text-[10px] ${
                                isLight ? 'text-[#004741]/60' : 'text-[#F0EDE4]/60'
                              }`}
                            >
                              {new Date(n.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] mt-1 line-clamp-2 ${
                              isLight ? 'text-[#004741]/75' : 'text-[#F0EDE4]/75'
                            }`}
                          >
                            {n.message}
                          </p>
                          {n.reportId && (
                            <span
                              className={`inline-block mt-1 text-[10px] font-mono font-bold ${
                                isLight ? 'text-[#004741]' : 'text-[#F0EDE4]'
                              }`}
                            >
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

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                id="btn-role-switcher"
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-[#FAF8F5] border-[#004741]/25 text-[#004741] hover:bg-[#004741]/10'
                    : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline capitalize">{user.role}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-2xl p-2 z-50 ${
                    isLight
                      ? 'bg-[#FAF8F5] border-[#004741]/25 text-[#004741]'
                      : 'bg-[#003833] border-[#F0EDE4]/25 text-[#F0EDE4]'
                  }`}
                  id="role-dropdown-menu"
                >
                  <div
                    className={`px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider border-b ${
                      isLight
                        ? 'text-[#004741]/60 border-[#004741]/15'
                        : 'text-[#F0EDE4]/60 border-[#F0EDE4]/15'
                    }`}
                  >
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
                        className={`w-full flex items-start space-x-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                          user.role === r.role
                            ? isLight
                              ? 'bg-[#004741]/15 border border-[#004741]/30 font-bold'
                              : 'bg-[#F0EDE4]/20 border border-[#F0EDE4]/30 font-bold'
                            : isLight
                            ? 'hover:bg-[#004741]/8'
                            : 'hover:bg-[#F0EDE4]/8'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-semibold">{r.label}</span>
                            {user.role === r.role && (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                          </div>
                          <p
                            className={`text-[10px] leading-tight mt-0.5 ${
                              isLight ? 'text-[#004741]/70' : 'text-[#F0EDE4]/70'
                            }`}
                          >
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg border cursor-pointer ${
                isLight
                  ? 'bg-[#FAF8F5] border-[#004741]/25 text-[#004741]'
                  : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden py-4 border-t space-y-2 animate-in slide-in-from-top-2 ${
              isLight ? 'border-[#004741]/20' : 'border-[#F0EDE4]/20'
            }`}
          >
            {[
              { id: 'home', label: 'Home', icon: null },
              { id: 'map', label: t.exploreMap, icon: MapPin },
              { id: 'reports', label: t.viewReports, icon: FileText },
              { id: 'police', label: t.policeAndEmergency, icon: PhoneCall },
              { id: 'authorities', label: t.authorities, icon: Building2 },
              { id: 'analytics', label: t.statistics, icon: BarChart3 },
              { id: 'citizen_dash', label: t.dashboard, icon: null }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === item.id
                      ? isLight
                        ? 'bg-[#004741] text-[#F0EDE4] font-bold'
                        : 'bg-[#F0EDE4] text-[#004741] font-bold'
                      : isLight
                      ? 'text-[#004741] hover:bg-[#004741]/10'
                      : 'text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Theme Toggle */}
            <div
              className={`pt-2 border-t flex items-center justify-between px-1 ${
                isLight ? 'border-[#004741]/20' : 'border-[#F0EDE4]/20'
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  isLight ? 'text-[#004741]/70' : 'text-[#F0EDE4]/70'
                }`}
              >
                {language === 'bn' ? 'থিম পরিবর্তন' : 'Appearance'}
              </span>
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  isLight
                    ? 'bg-[#004741] text-[#F0EDE4] border-[#004741]'
                    : 'bg-[#F0EDE4] text-[#004741] border-[#F0EDE4]'
                }`}
              >
                {!isLight ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#004741]" />
                    <span>{language === 'bn' ? 'লাইট মোড চালু করুন' : 'Switch to Light'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#F0EDE4]" />
                    <span>{language === 'bn' ? 'ডার্ক মোড চালু করুন' : 'Switch to Dark'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

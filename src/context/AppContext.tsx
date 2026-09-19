import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CivicReport,
  User,
  UserRole,
  Language,
  ReportStatus,
  OfficialResponse,
  NotificationItem,
  AuditLogEntry,
  ThemeMode
} from '../types';
import { SAMPLE_REPORTS } from '../data/sampleReports';
import { TRANSLATIONS } from '../data/translations';

interface AppContextType {
  user: User;
  switchRole: (role: UserRole) => void;
  language: Language;
  toggleLanguage: () => void;
  t: typeof TRANSLATIONS.en;
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  
  reports: CivicReport[];
  addReport: (report: Omit<CivicReport, 'id' | 'submittedAt' | 'updatedAt' | 'statusHistory' | 'comments' | 'upvotesCount'>) => string;
  updateReportStatus: (reportId: string, newStatus: ReportStatus, comment: string) => void;
  addOfficialResponse: (reportId: string, response: Omit<OfficialResponse, 'id' | 'respondedAt'>) => void;
  addComment: (reportId: string, text: string) => void;
  toggleBookmark: (reportId: string) => void;
  upvoteReport: (reportId: string) => void;
  flagSpamReport: (reportId: string, reason: string) => void;
  
  selectedReport: CivicReport | null;
  setSelectedReport: (report: CivicReport | null) => void;
  isReportWizardOpen: boolean;
  setIsReportWizardOpen: (open: boolean) => void;
  
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  auditLogs: AuditLogEntry[];
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Search & Global filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedDivision: string;
  setSelectedDivision: (div: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (dist: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_REPORTS_KEY = 'bcw_civic_reports_v1';
const LOCAL_STORAGE_AUDIT_KEY = 'bcw_audit_logs_v1';
const LOCAL_STORAGE_NOTIFS_KEY = 'bcw_notifications_v1';
const LOCAL_STORAGE_THEME_KEY = 'bcw_theme_mode_v1';

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-03-08T14:20:00Z',
    actor: 'Executive Engineer (DSCC Zone-2)',
    role: 'authority',
    action: 'STATUS_UPDATE',
    targetId: 'BCW-2026-000101',
    details: 'Status changed to "Action Taken" with official deployment dispatch reference DSCC/ENG/Z2/2026-089',
    ipAddress: '103.14.28.12 (Gov Gateway)'
  },
  {
    id: 'log-2',
    timestamp: '2026-03-07T09:30:00Z',
    actor: 'Super Admin',
    role: 'admin',
    action: 'FORWARD_TO_AUTHORITY',
    targetId: 'BCW-2026-000103',
    details: 'Forwarded hazardous electrical risk to BPDB Chattogram Dispatch control',
    ipAddress: '103.23.44.18'
  },
  {
    id: 'log-3',
    timestamp: '2026-03-06T10:00:00Z',
    actor: 'Integrity Compliance Officer',
    role: 'moderator',
    action: 'MODERATION_REVIEW',
    targetId: 'BCW-2026-000102',
    details: 'Audio evidence verified against land registry timing logs. Marked as "Under Review".',
    ipAddress: '103.18.52.90'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    reportId: 'BCW-2026-000101',
    title: 'Official Action Taken',
    message: 'DSCC Engineering section deployed equipment to unblock drainage on Dhanmondi Road 27.',
    type: 'authority_action',
    timestamp: '2026-03-08T14:20:00Z',
    isRead: false
  },
  {
    id: 'notif-2',
    reportId: 'BCW-2026-000103',
    title: 'Priority Forwarding',
    message: 'Report on hazardous transformer in Panchlaish forwarded to BPDB dispatch.',
    type: 'status_update',
    timestamp: '2026-03-07T09:30:00Z',
    isRead: false
  },
  {
    id: 'notif-3',
    reportId: 'BCW-2026-000106',
    title: 'Additional Information Requested',
    message: 'LGED Quality Inspector requested signboard details for Fakirhat culvert report.',
    type: 'moderation',
    timestamp: '2026-03-06T15:00:00Z',
    isRead: true
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('citizen');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });
  const [activeTab, setActiveTab] = useState<string>('home');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  const [isReportWizardOpen, setIsReportWizardOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Reports state
  const [reports, setReports] = useState<CivicReport[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved reports', e);
      }
    }
    return SAMPLE_REPORTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Current user configuration based on active role
  const user: User = {
    id: role === 'anonymous' ? 'anon' : 'user-curr',
    name:
      role === 'citizen'
        ? 'Mamun Khan'
        : role === 'anonymous'
        ? 'Anonymous Citizen'
        : role === 'moderator'
        ? 'Civic Integrity Moderator'
        : role === 'authority'
        ? 'Executive Officer (DSCC / Thana Liaison)'
        : 'System Administrator',
    email: role === 'anonymous' ? 'confidential@anonymous.local' : 'khanmamun.cse@gmail.com',
    role,
    verified: role !== 'anonymous',
    department: role === 'authority' ? 'Municipal Public Works & Police Desk' : undefined,
    jurisdiction: role === 'authority' ? 'Dhaka / Regional' : undefined
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    // Add audit entry for role switch
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user.name,
      role: newRole,
      action: 'ROLE_SWITCH',
      targetId: 'SESSION',
      details: `Switched active role context to "${newRole}"`,
      ipAddress: '127.0.0.1 (Local Session)'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const addReport = (
    newReportData: Omit<CivicReport, 'id' | 'submittedAt' | 'updatedAt' | 'statusHistory' | 'comments' | 'upvotesCount'>
  ): string => {
    const timestamp = new Date().toISOString();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newId = `BCW-2026-${randomNum}`;

    const newReport: CivicReport = {
      ...newReportData,
      id: newId,
      submittedAt: timestamp,
      updatedAt: timestamp,
      status: 'submitted',
      upvotesCount: 1,
      reporterName: newReportData.privacy === 'anonymous_public' ? 'Anonymous Citizen' : user.name,
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: 'submitted',
          changedBy: newReportData.privacy === 'anonymous_public' ? 'Anonymous Citizen' : user.name,
          userRole: user.role,
          timestamp,
          comment: 'New citizen report received and recorded in public ledger.'
        }
      ],
      comments: []
    };

    setReports((prev) => [newReport, ...prev]);

    // Create Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      reportId: newId,
      title: 'Report Submitted Successfully',
      message: `Your report #${newId} "${newReport.title.slice(0, 40)}..." has been recorded for review.`,
      type: 'status_update',
      timestamp,
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Create Audit Log
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      actor: user.name,
      role: user.role,
      action: 'SUBMIT_REPORT',
      targetId: newId,
      details: `New report submitted in category "${newReport.category}" under division "${newReport.location.division}". Privacy: ${newReport.privacy}`,
      ipAddress: '103.14.28.12'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    return newId;
  };

  const updateReportStatus = (reportId: string, newStatus: ReportStatus, comment: string) => {
    const timestamp = new Date().toISOString();

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;

        const newHistoryItem = {
          id: `sh-${Date.now()}`,
          status: newStatus,
          changedBy: user.name,
          userRole: user.role,
          timestamp,
          comment: comment || `Status transitioned to ${newStatus}`
        };

        return {
          ...r,
          status: newStatus,
          updatedAt: timestamp,
          statusHistory: [...r.statusHistory, newHistoryItem]
        };
      })
    );

    // If active in modal, update modal state
    setSelectedReport((curr) => {
      if (curr && curr.id === reportId) {
        return {
          ...curr,
          status: newStatus,
          updatedAt: timestamp,
          statusHistory: [
            ...curr.statusHistory,
            {
              id: `sh-${Date.now()}`,
              status: newStatus,
              changedBy: user.name,
              userRole: user.role,
              timestamp,
              comment: comment || `Status transitioned to ${newStatus}`
            }
          ]
        };
      }
      return curr;
    });

    // Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      reportId,
      title: `Status Changed: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
      message: `Report #${reportId} status was updated to "${newStatus.replace(/_/g, ' ')}" by ${user.name}.`,
      type: 'status_update',
      timestamp,
      isRead: false
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Audit Log
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      actor: user.name,
      role: user.role,
      action: 'STATUS_UPDATE',
      targetId: reportId,
      details: `Transitioned status to "${newStatus}". Auditor note: ${comment}`,
      ipAddress: '103.14.28.12'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const addOfficialResponse = (
    reportId: string,
    resp: Omit<OfficialResponse, 'id' | 'respondedAt'>
  ) => {
    const timestamp = new Date().toISOString();
    const officialResp: OfficialResponse = {
      ...resp,
      id: `res-${Date.now()}`,
      respondedAt: timestamp
    };

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        const newHistory = {
          id: `sh-${Date.now()}`,
          status: 'action_taken' as ReportStatus,
          changedBy: resp.authorityName,
          userRole: 'authority' as UserRole,
          timestamp,
          comment: `Official response published: ${resp.actionTakenDetails || resp.responseText.slice(0, 100)}`
        };

        return {
          ...r,
          status: 'action_taken',
          updatedAt: timestamp,
          officialResponse: officialResp,
          statusHistory: [...r.statusHistory, newHistory]
        };
      })
    );

    setSelectedReport((curr) => {
      if (curr && curr.id === reportId) {
        return {
          ...curr,
          status: 'action_taken',
          updatedAt: timestamp,
          officialResponse: officialResp,
          statusHistory: [
            ...curr.statusHistory,
            {
              id: `sh-${Date.now()}`,
              status: 'action_taken',
              changedBy: resp.authorityName,
              userRole: 'authority',
              timestamp,
              comment: `Official response published: ${resp.actionTakenDetails || resp.responseText.slice(0, 100)}`
            }
          ]
        };
      }
      return curr;
    });

    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      actor: resp.authorityName,
      role: 'authority',
      action: 'OFFICIAL_RESPONSE',
      targetId: reportId,
      details: `Official response submitted with reference #${resp.referenceNo || 'N/A'}. Action taken noted.`,
      ipAddress: '103.14.28.12 (Gov Portal)'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const addComment = (reportId: string, text: string) => {
    if (!text.trim()) return;
    const timestamp = new Date().toISOString();

    const newComment = {
      id: `com-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      comment: text.trim(),
      createdAt: timestamp,
      isOfficial: user.role === 'authority' || user.role === 'moderator' || user.role === 'admin'
    };

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return {
          ...r,
          comments: [...r.comments, newComment]
        };
      })
    );

    setSelectedReport((curr) => {
      if (curr && curr.id === reportId) {
        return {
          ...curr,
          comments: [...curr.comments, newComment]
        };
      }
      return curr;
    });
  };

  const toggleBookmark = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return { ...r, isBookmarked: !r.isBookmarked };
      })
    );
    setSelectedReport((curr) => {
      if (curr && curr.id === reportId) {
        return { ...curr, isBookmarked: !curr.isBookmarked };
      }
      return curr;
    });
  };

  const upvoteReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return { ...r, upvotesCount: r.upvotesCount + 1 };
      })
    );
    setSelectedReport((curr) => {
      if (curr && curr.id === reportId) {
        return { ...curr, upvotesCount: curr.upvotesCount + 1 };
      }
      return curr;
    });
  };

  const flagSpamReport = (reportId: string, reason: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        return { ...r, isFlaggedSpam: true, moderationNotes: reason };
      })
    );
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user.name,
      role: user.role,
      action: 'FLAG_SPAM',
      targetId: reportId,
      details: `Report flagged as suspicious/spam. Reason: ${reason}`,
      ipAddress: '103.14.28.12'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const resetToSampleData = () => {
    localStorage.removeItem(LOCAL_STORAGE_REPORTS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_AUDIT_KEY);
    localStorage.removeItem(LOCAL_STORAGE_NOTIFS_KEY);
    setReports(SAMPLE_REPORTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const t = TRANSLATIONS[language];

  return (
    <AppContext.Provider
      value={{
        user,
        switchRole,
        language,
        toggleLanguage,
        t,
        theme,
        toggleTheme,
        setTheme,
        reports,
        addReport,
        updateReportStatus,
        addOfficialResponse,
        addComment,
        toggleBookmark,
        upvoteReport,
        flagSpamReport,
        selectedReport,
        setSelectedReport,
        isReportWizardOpen,
        setIsReportWizardOpen,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        auditLogs,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDivision,
        setSelectedDivision,
        selectedDistrict,
        setSelectedDistrict,
        selectedStatus,
        setSelectedStatus,
        resetToSampleData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const useAppContext = useApp;

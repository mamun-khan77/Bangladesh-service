import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CivicReport, ReportStatus, UserRole } from '../types';
import {
  User,
  Shield,
  ShieldCheck,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Bookmark,
  ChevronRight,
  History,
  Lock,
  SlidersHorizontal
} from 'lucide-react';

export const RoleDashboard: React.FC = () => {
  const {
    user,
    switchRole,
    reports,
    auditLogs,
    setSelectedReport,
    notifications,
    updateReportStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my_reports' | 'bookmarks' | 'queue' | 'audit_logs'>('my_reports');

  // Filtered reports for citizen
  const myReports = reports.filter((r) => r.reporterId === user.id || r.reporterName === user.name);
  const bookmarkedReports = reports.filter((r) => r.isBookmarked);

  // Authority & Moderator queues
  const unreviewedQueue = reports.filter(
    (r) => r.status === 'submitted' || r.status === 'under_review'
  );
  const assignedQueue = reports.filter(
    (r) => r.status === 'verified' || r.status === 'forwarded_to_authority' || r.status === 'action_taken'
  );

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Status', 'District', 'Upazila', 'SubmittedAt'];
    const rows = reports.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.severity,
      r.status,
      r.location.district,
      r.location.upazila,
      r.submittedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bangladesh_civic_reports_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'authority':
        return <Building2 className="w-5 h-5 text-indigo-500" />;
      case 'moderator':
        return <ShieldCheck className="w-5 h-5 text-teal-500" />;
      case 'admin':
        return <Lock className="w-5 h-5 text-amber-500" />;
      default:
        return <User className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6" id="role-management-dashboard">
      {/* Top Banner with User Profile & Role Switcher */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
              {getRoleIcon(user.role)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {user.role} workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Role-based civic oversight, complaint management, and verified audit logs.
              </p>
            </div>
          </div>

          {/* Quick Role Tester Switcher (Responsive) */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-full md:w-auto">
            <span className="text-[10px] text-slate-400 font-semibold px-2 hidden sm:inline">Role:</span>
            {(['citizen', 'authority', 'moderator', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`flex-1 sm:flex-none px-2.5 py-1 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  user.role === r
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls and Tab Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {user.role === 'citizen' && (
              <>
                <button
                  onClick={() => setActiveTab('my_reports')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'my_reports'
                      ? 'bg-slate-900 dark:bg-slate-800 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  My Submissions ({myReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'bookmarks'
                      ? 'bg-slate-900 dark:bg-slate-800 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Saved Bookmarks ({bookmarkedReports.length})
                </button>
              </>
            )}

            {(user.role === 'authority' || user.role === 'moderator' || user.role === 'admin') && (
              <>
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'queue'
                      ? 'bg-slate-900 dark:bg-slate-800 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {user.role === 'moderator' ? 'Verification Queue' : 'Assigned Jurisdiction Queue'}
                </button>
                <button
                  onClick={() => setActiveTab('audit_logs')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                    activeTab === 'audit_logs'
                      ? 'bg-slate-900 dark:bg-slate-800 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  System Audit Trail ({auditLogs.length})
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Citizen Tab: My Submissions */}
      {user.role === 'citizen' && activeTab === 'my_reports' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Lodged Reports</h3>
          {myReports.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              You haven't filed any reports yet. Use the "Report an Issue" button to submit a grievance.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all cursor-pointer space-y-2 text-slate-900 dark:text-slate-100"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-400 font-bold">#{r.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold line-clamp-1">{r.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{r.description}</p>
                  <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>📍 {r.location.upazila}, {r.location.district}</span>
                    <span>{new Date(r.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Citizen Tab: Saved Bookmarks */}
      {user.role === 'citizen' && activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Saved Case Bookmarks</h3>
          {bookmarkedReports.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              No saved bookmarks yet. Click the bookmark icon on any report to track its progress.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedReports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all cursor-pointer space-y-2 text-slate-900 dark:text-slate-100"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-400 font-bold">#{r.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold line-clamp-1">{r.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{r.description}</p>
                  <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>📍 {r.location.district}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Inspect Case →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Authority / Moderator Queue */}
      {(user.role === 'authority' || user.role === 'moderator' || user.role === 'admin') && activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {user.role === 'moderator' ? 'Triage & Verification Action Queue' : 'Assigned Jurisdiction Action Queue'}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {(user.role === 'moderator' ? unreviewedQueue : assignedQueue).length} pending cases
            </span>
          </div>

          <div className="space-y-3">
            {(user.role === 'moderator' ? unreviewedQueue : assignedQueue).map((r) => (
              <div
                key={r.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-900 dark:text-slate-100"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono text-slate-400 font-bold">#{r.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {r.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 capitalize">{r.category}</span>
                  </div>
                  <h4 className="text-sm font-bold">{r.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{r.description}</p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    📍 {r.location.upazila}, {r.location.district} • Submitted by: {r.reporterName}
                  </div>
                </div>

                {/* Triage Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedReport(r)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    Inspect
                  </button>

                  {user.role === 'moderator' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(r.id, 'verified', 'Verified by civic moderator')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Verify Allegation
                      </button>
                      <button
                        onClick={() => updateReportStatus(r.id, 'forwarded_to_authority', 'Forwarded to DC / Municipal desk')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Forward
                      </button>
                    </>
                  )}

                  {user.role === 'authority' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(r.id, 'action_taken', 'Official team dispatched for inspection')}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Action Taken
                      </button>
                      <button
                        onClick={() => updateReportStatus(r.id, 'resolved', 'Issue resolved and verified on site')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit_logs' && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold flex items-center space-x-2">
                <History className="w-4 h-4 text-emerald-500" />
                <span>Immutable Transparency Audit Trail</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                All status transitions, authority dispatches, and moderator edits are permanently logged
              </p>
            </div>
            <span className="font-mono text-xs text-slate-400 font-bold">{auditLogs.length} events</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto space-y-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-400">#{log.targetId}</span>
                    <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.action}
                    </span>
                    <span className="text-slate-500">• {log.actor} ({log.role})</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
  History
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
    link.setAttribute('download', `BCW_Civic_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'resolved':
        return { label: 'Resolved', color: 'text-[#2BEE34] bg-[#2BEE34]/15 border-[#2BEE34]/40' };
      case 'action_taken':
        return { label: 'Action Taken', color: 'text-emerald-300 bg-emerald-950/40 border-emerald-600/40' };
      case 'verified':
        return { label: 'Verified', color: 'text-blue-300 bg-blue-950/40 border-blue-600/40' };
      case 'forwarded_to_authority':
        return { label: 'Forwarded', color: 'text-purple-300 bg-purple-950/40 border-purple-600/40' };
      case 'under_review':
        return { label: 'Under Review', color: 'text-amber-300 bg-amber-950/40 border-amber-600/40' };
      default:
        return { label: 'Submitted', color: 'text-zinc-300 bg-zinc-800 border-zinc-700' };
    }
  };

  return (
    <div className="space-y-6" id="role-dashboard">
      {/* Dashboard Top Header & Role Switcher */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
              {user.role === 'citizen' && <User className="w-6 h-6 text-[#2BEE34]" />}
              {user.role === 'authority' && <Building2 className="w-6 h-6 text-emerald-400" />}
              {user.role === 'moderator' && <ShieldCheck className="w-6 h-6 text-amber-400" />}
              {user.role === 'admin' && <Shield className="w-6 h-6 text-purple-400" />}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#2BEE34]/15 text-[#2BEE34] border border-[#2BEE34]/40">
                  {user.role} workspace
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Role-based civic oversight, complaint management, and verified audit logs.
              </p>
            </div>
          </div>

          {/* Quick Role Tester Switcher */}
          <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 font-semibold px-2">Switch View:</span>
            {(['citizen', 'authority', 'moderator', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  user.role === r
                    ? 'bg-[#2BEE34] text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls and Tab Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center space-x-2 text-xs">
            {user.role === 'citizen' && (
              <>
                <button
                  onClick={() => setActiveTab('my_reports')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                    activeTab === 'my_reports'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  My Submissions ({myReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                    activeTab === 'bookmarks'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
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
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                    activeTab === 'queue'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {user.role === 'moderator' ? 'Verification Queue' : 'Assigned Jurisdiction Queue'}
                </button>
                <button
                  onClick={() => setActiveTab('audit_logs')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                    activeTab === 'audit_logs'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  System Audit Trail ({auditLogs.length})
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#2BEE34]" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Citizen Tab: My Submissions */}
      {user.role === 'citizen' && activeTab === 'my_reports' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Your Lodged Reports</h3>
          {myReports.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-400">
              You haven't submitted any complaints under this account session yet. Use the "Report an Issue" button to file your first civic report.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReports.map((report) => {
                const badge = getStatusBadge(report.status);
                return (
                  <div
                    key={report.id}
                    className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-zinc-400">#{report.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4
                        onClick={() => setSelectedReport(report)}
                        className="text-sm font-bold text-white hover:text-[#2BEE34] cursor-pointer"
                      >
                        {report.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">{report.description}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">
                        {new Date(report.submittedAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-[#2BEE34] font-semibold hover:underline flex items-center space-x-1"
                      >
                        <span>View Status & Audit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Citizen Tab: Bookmarks */}
      {user.role === 'citizen' && activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Bookmarked Reports</h3>
          {bookmarkedReports.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-400">
              No bookmarked reports. Click the bookmark icon on any report in the feed or map to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="font-mono text-xs text-zinc-400">#{report.id}</span>
                    <h4
                      onClick={() => setSelectedReport(report)}
                      className="text-sm font-bold text-white hover:text-[#2BEE34] cursor-pointer mt-1"
                    >
                      {report.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{report.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800">
                    <span className="text-zinc-400">{report.location.district}</span>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-[#2BEE34] font-semibold hover:underline"
                    >
                      Inspect
                    </button>
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
            <h3 className="text-sm font-bold text-white">
              {user.role === 'moderator' ? 'Incoming Reports for Verification' : 'Jurisdiction Action Queue'}
            </h3>
            <span className="text-xs text-zinc-400">
              Total in queue: {user.role === 'moderator' ? unreviewedQueue.length : assignedQueue.length}
            </span>
          </div>

          <div className="space-y-3">
            {(user.role === 'moderator' ? unreviewedQueue : assignedQueue).map((report) => {
              const badge = getStatusBadge(report.status);
              return (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        #{report.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {report.location.upazila}, {report.location.district}
                      </span>
                    </div>

                    <h4
                      onClick={() => setSelectedReport(report)}
                      className="text-sm font-bold text-white hover:text-[#2BEE34] cursor-pointer"
                    >
                      {report.title}
                    </h4>

                    <p className="text-xs text-zinc-400 line-clamp-1">{report.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition-colors"
                    >
                      Inspect & Audit
                    </button>
                    {user.role === 'moderator' && report.status === 'submitted' && (
                      <button
                        onClick={() => updateReportStatus(report.id, 'verified', 'Fast-track verification passed by moderator desk.')}
                        className="px-4 py-2 rounded-xl bg-[#2BEE34] hover:bg-[#25d32d] text-zinc-950 text-xs font-bold transition-colors"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Audit Logs Trail */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <History className="w-5 h-5 text-[#2BEE34]" />
            <h3 className="text-sm font-bold">Tamper-Evident System Audit Trail</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Immutable log of all status transitions, verification notes, and official state department responses.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-wider bg-zinc-950/60">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Report ID</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{log.targetId}</td>
                      <td className="py-3 px-4 font-semibold text-[#2BEE34]">{log.action}</td>
                      <td className="py-3 px-4 text-zinc-300">
                        {log.actor}{' '}
                        <span className="text-[10px] text-zinc-500 uppercase">({log.role})</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

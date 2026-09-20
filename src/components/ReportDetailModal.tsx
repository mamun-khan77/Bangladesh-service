import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportStatus } from '../types';
import {
  X,
  MapPin,
  Calendar,
  Building2,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const ReportDetailModal: React.FC = () => {
  const {
    selectedReport,
    setSelectedReport,
    user,
    toggleBookmark,
    upvoteReport,
    addComment,
    updateReportStatus,
    addOfficialResponse
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus>(selectedReport?.status || 'under_review');
  const [statusComment, setStatusComment] = useState('');

  // Official Response Form States
  const [isAddingResponse, setIsAddingResponse] = useState(false);
  const [officialTitle, setOfficialTitle] = useState('Executive Engineer');
  const [department, setDepartment] = useState('Public Works Department (PWD)');
  const [responseText, setResponseText] = useState('');
  const [actionDetails, setActionDetails] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  if (!selectedReport) return null;

  const handleClose = () => {
    setSelectedReport(null);
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(selectedReport.id, commentInput);
    setCommentInput('');
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateReportStatus(selectedReport.id, newStatus, statusComment);
    setIsUpdatingStatus(false);
    setStatusComment('');
  };

  const handleOfficialResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    addOfficialResponse(selectedReport.id, {
      authorityName: user.name,
      officialTitle,
      department,
      responseText,
      actionTakenDetails: actionDetails,
      referenceNo: referenceNo || `GOV-REF-${Date.now().toString().slice(-6)}`
    });
    setIsAddingResponse(false);
    setResponseText('');
    setActionDetails('');
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'resolved':
        return { label: 'Resolved', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
      case 'action_taken':
        return { label: 'Action Taken', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30 font-semibold' };
      case 'verified':
        return { label: 'Verified Allegation', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 font-medium' };
      case 'forwarded_to_authority':
        return { label: 'Forwarded to Authority', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' };
      case 'under_review':
        return { label: 'Under Review', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
      case 'needs_info':
        return { label: 'Needs More Info', bg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' };
      default:
        return { label: 'Citizen Submitted', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30' };
    }
  };

  const statusBadge = getStatusBadge(selectedReport.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      id="report-detail-modal"
    >
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/70">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              #{selectedReport.id}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg}`}
            >
              {statusBadge.label}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
              {selectedReport.category.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => toggleBookmark(selectedReport.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                selectedReport.isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900'
              }`}
              title="Bookmark Report"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Title & Metadata */}
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold leading-tight">
              {selectedReport.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedReport.location.addressDescription} ({selectedReport.location.upazila}, {selectedReport.location.district})
                </span>
                {selectedReport.location.isApproximate && (
                  <span className="text-amber-600 dark:text-amber-400 text-[10px] font-semibold">(Approx. 1km Area)</span>
                )}
              </span>

              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(selectedReport.submittedAt).toLocaleDateString()}</span>
              </span>

              <span className="flex items-center space-x-1">
                <span>By:</span>
                <strong className="text-slate-700 dark:text-slate-300">{selectedReport.reporterName}</strong>
              </span>

              {selectedReport.organizationInvolved && (
                <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px]">
                  Dept: {selectedReport.organizationInvolved}
                </span>
              )}
            </div>
          </div>

          {/* Description Block */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Citizen Allegation / Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedReport.description}
            </p>
          </div>

          {/* Evidence Attachments Viewer */}
          {selectedReport.evidence.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Attached Evidence ({selectedReport.evidence.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedReport.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    {ev.fileType === 'image' && ev.url.startsWith('http') ? (
                      <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={ev.url}
                          alt={ev.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                        <FileText className="w-8 h-8 text-emerald-500" />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold truncate max-w-[160px]">
                        {ev.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{ev.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Authority Response Section */}
          {selectedReport.officialResponse ? (
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Official Authority Response</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                  Ref: {selectedReport.officialResponse.referenceNo}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedReport.officialResponse.authorityName}
                </span>{' '}
                • {selectedReport.officialResponse.officialTitle} ({selectedReport.officialResponse.department})
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900">
                "{selectedReport.officialResponse.responseText}"
              </p>

              {selectedReport.officialResponse.actionTakenDetails && (
                <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
                  <strong className="text-emerald-600 dark:text-emerald-400">Action Executed on Ground:</strong>{' '}
                  {selectedReport.officialResponse.actionTakenDetails}
                </div>
              )}

              <div className="text-[10px] text-slate-400 text-right">
                Verified Date: {new Date(selectedReport.officialResponse.respondedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>No official response published yet. Monitored by district desk.</span>
              {user.role === 'authority' && (
                <button
                  onClick={() => setIsAddingResponse(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
                >
                  Publish Official Response
                </button>
              )}
            </div>
          )}

          {/* Form for Authority to publish official response */}
          {isAddingResponse && (
            <form
              onSubmit={handleOfficialResponseSubmit}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-500/50 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Draft Official State Authority Statement</span>
                <button
                  type="button"
                  onClick={() => setIsAddingResponse(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Official Designation</label>
                  <input
                    type="text"
                    value={officialTitle}
                    onChange={(e) => setOfficialTitle(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Department / Branch</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-xs mb-1">Official Response Statement *</label>
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="State the formal position, field inspection findings, and engineering or disciplinary steps taken..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 text-xs mb-1">Action Executed on Ground</label>
                <input
                  type="text"
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                  placeholder="e.g. Pump deployed, contractor summoned, penalty notice served"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Publish Official Response to Public Ledger
              </button>
            </form>
          )}

          {/* Audit Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Status & Verification Timeline
            </h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {selectedReport.statusHistory.map((item) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="text-xs font-semibold flex items-center space-x-2">
                    <span className="capitalize">{item.status.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      • {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.comment}</p>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Updated by: <span className="text-slate-700 dark:text-slate-300">{item.changedBy}</span> ({item.userRole})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moderator / Authority Action Bar */}
          {(user.role === 'moderator' || user.role === 'authority' || user.role === 'admin') && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Administrative Actions ({user.role.toUpperCase()})</span>
                </span>
                <button
                  onClick={() => setIsUpdatingStatus(!isUpdatingStatus)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {isUpdatingStatus ? 'Cancel' : 'Change Status / Workflow'}
                </button>
              </div>

              {isUpdatingStatus && (
                <form onSubmit={handleStatusSubmit} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 mb-1">New Workflow Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                      >
                        <option value="under_review">Under Review</option>
                        <option value="needs_info">Needs More Information</option>
                        <option value="verified">Verified Allegation</option>
                        <option value="forwarded_to_authority">Forward to Authority</option>
                        <option value="action_taken">Action Taken</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                        <option value="duplicate">Duplicate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 dark:text-slate-400 mb-1">Auditor / Decision Note *</label>
                      <input
                        type="text"
                        required
                        value={statusComment}
                        onChange={(e) => setStatusComment(e.target.value)}
                        placeholder="State reason for verification, forwarding, or resolution..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Commit Status Update with Audit Log
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Citizen Comments & Updates Thread */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Citizen Discussion & Ground Updates ({selectedReport.comments.length})</span>
            </h3>

            <div className="space-y-2">
              {selectedReport.comments.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No comments yet. Are you familiar with this location? Add ground updates below.
                </p>
              ) : (
                selectedReport.comments.map((com) => (
                  <div
                    key={com.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      com.isOfficial
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                        <span>{com.userName}</span>
                        {com.isOfficial && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            Official
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(com.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="leading-relaxed">{com.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddCommentSubmit} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a civil ground update or note..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer"
                title="Post Comment"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 flex items-center justify-between text-xs">
          <button
            onClick={() => upvoteReport(selectedReport.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
            <span>Support / Confirm ({selectedReport.upvotesCount})</span>
          </button>

          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

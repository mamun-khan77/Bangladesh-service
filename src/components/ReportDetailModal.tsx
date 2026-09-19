import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CivicReport, ReportStatus } from '../types';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  ThumbsUp,
  Bookmark,
  Share2,
  Lock,
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';

export const ReportDetailModal: React.FC = () => {
  const {
    selectedReport,
    setSelectedReport,
    user,
    updateReportStatus,
    addOfficialResponse,
    addComment,
    toggleBookmark,
    upvoteReport,
    flagSpamReport
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus>('verified');
  const [statusComment, setStatusComment] = useState('');

  // Official Response Form States (Authority only)
  const [isAddingResponse, setIsAddingResponse] = useState(false);
  const [officialTitle, setOfficialTitle] = useState('Executive Officer');
  const [department, setDepartment] = useState('City Engineering / Thana Patrol');
  const [responseText, setResponseText] = useState('');
  const [actionDetails, setActionDetails] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  if (!selectedReport) return null;

  const handleClose = () => {
    setSelectedReport(null);
    setIsUpdatingStatus(false);
    setIsAddingResponse(false);
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
        return { label: 'Resolved', bg: 'bg-[#2BEE34]/15', text: 'text-[#2BEE34]', border: 'border-[#2BEE34]/40' };
      case 'action_taken':
        return { label: 'Action Taken', bg: 'bg-emerald-950/40', text: 'text-emerald-300', border: 'border-emerald-600/40' };
      case 'verified':
        return { label: 'Verified Allegation', bg: 'bg-blue-950/40', text: 'text-blue-300', border: 'border-blue-600/40' };
      case 'forwarded_to_authority':
        return { label: 'Forwarded to Authority', bg: 'bg-purple-950/40', text: 'text-purple-300', border: 'border-purple-600/40' };
      case 'under_review':
        return { label: 'Under Review', bg: 'bg-amber-950/40', text: 'text-amber-300', border: 'border-amber-600/40' };
      case 'needs_info':
        return { label: 'Needs More Info', bg: 'bg-yellow-950/40', text: 'text-yellow-300', border: 'border-yellow-600/40' };
      default:
        return { label: 'Citizen Submitted', bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700' };
    }
  };

  const statusBadge = getStatusBadge(selectedReport.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      id="report-detail-modal"
    >
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
              #{selectedReport.id}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
            >
              {statusBadge.label}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 capitalize">
              {selectedReport.category.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleBookmark(selectedReport.id)}
              className={`p-2 rounded-lg border transition-colors ${
                selectedReport.isBookmarked
                  ? 'bg-[#2BEE34]/20 border-[#2BEE34] text-[#2BEE34]'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              title="Bookmark Report"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Title & Metadata */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {selectedReport.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-2.5">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-[#2BEE34]" />
                <span className="text-zinc-300 font-medium">
                  {selectedReport.location.addressDescription} ({selectedReport.location.upazila}, {selectedReport.location.district})
                </span>
                {selectedReport.location.isApproximate && (
                  <span className="text-amber-400 text-[10px] font-semibold">(Approx. 1km Area)</span>
                )}
              </span>

              <span className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span>Submitted: {new Date(selectedReport.submittedAt).toLocaleDateString()}</span>
              </span>

              <span className="flex items-center space-x-1">
                <span>By:</span>
                <strong className="text-zinc-200">{selectedReport.reporterName}</strong>
              </span>

              {selectedReport.organizationInvolved && (
                <span className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-[11px]">
                  Dept: {selectedReport.organizationInvolved}
                </span>
              )}
            </div>
          </div>

          {/* Description Block */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Citizen Allegation / Description
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
              {selectedReport.description}
            </p>
          </div>

          {/* Evidence Attachments Viewer */}
          {selectedReport.evidence.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Attached Evidence ({selectedReport.evidence.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedReport.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors"
                  >
                    {ev.fileType === 'image' && ev.url.startsWith('http') ? (
                      <div className="w-full h-36 rounded-lg overflow-hidden bg-zinc-900">
                        <img
                          src={ev.url}
                          alt={ev.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400">
                        <FileText className="w-8 h-8 text-[#2BEE34]" />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[160px]">
                        {ev.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">{ev.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Authority Response Section (Section 32) */}
          {selectedReport.officialResponse ? (
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Building2 className="w-5 h-5 text-[#2BEE34]" />
                  <span>Official Authority Response</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-700/50">
                  Ref: {selectedReport.officialResponse.referenceNo}
                </span>
              </div>

              <div className="text-xs text-zinc-300">
                <span className="font-semibold text-white">
                  {selectedReport.officialResponse.authorityName}
                </span>{' '}
                • {selectedReport.officialResponse.officialTitle} ({selectedReport.officialResponse.department})
              </div>

              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/80">
                "{selectedReport.officialResponse.responseText}"
              </p>

              {selectedReport.officialResponse.actionTakenDetails && (
                <div className="text-xs text-zinc-300 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                  <strong className="text-emerald-400">Action Executed on Ground:</strong>{' '}
                  {selectedReport.officialResponse.actionTakenDetails}
                </div>
              )}

              <div className="text-[10px] text-zinc-500 text-right">
                Verified Date: {new Date(selectedReport.officialResponse.respondedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <span>No official response published yet. Status is monitored by district desk.</span>
              {user.role === 'authority' && (
                <button
                  onClick={() => setIsAddingResponse(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#2BEE34] text-zinc-950 font-bold hover:bg-[#25d32d] transition-colors"
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
              className="p-4 rounded-xl bg-zinc-950 border border-emerald-600/50 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Draft Official State Authority Statement</span>
                <button
                  type="button"
                  onClick={() => setIsAddingResponse(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Official Designation</label>
                  <input
                    type="text"
                    value={officialTitle}
                    onChange={(e) => setOfficialTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Department / Branch</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-xs mb-1">Official Response Statement *</label>
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="State the formal position, field inspection findings, and engineering or disciplinary steps taken..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs mb-1">Action Executed on Ground</label>
                <input
                  type="text"
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                  placeholder="e.g. Pump deployed, contractor summoned, penalty notice served"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#2BEE34] hover:bg-[#25d32d] text-zinc-950 font-bold text-xs"
              >
                Publish Official Response to Public Ledger
              </button>
            </form>
          )}

          {/* Audit Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Status & Verification Timeline
            </h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
              {selectedReport.statusHistory.map((item) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#2BEE34] ring-4 ring-zinc-900" />
                  <div className="text-xs font-semibold text-white flex items-center space-x-2">
                    <span className="capitalize">{item.status.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-zinc-500 font-normal">
                      • {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.comment}</p>
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    Updated by: <span className="text-zinc-300">{item.changedBy}</span> ({item.userRole})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moderator / Authority Action Bar */}
          {(user.role === 'moderator' || user.role === 'authority' || user.role === 'admin') && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Administrative & Moderation Actions ({user.role.toUpperCase()})</span>
                </span>
                <button
                  onClick={() => setIsUpdatingStatus(!isUpdatingStatus)}
                  className="text-xs font-semibold text-[#2BEE34] hover:underline"
                >
                  {isUpdatingStatus ? 'Cancel' : 'Change Status / Workflow'}
                </button>
              </div>

              {isUpdatingStatus && (
                <form onSubmit={handleStatusSubmit} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1">New Workflow Status</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
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
                      <label className="block text-zinc-400 mb-1">Auditor / Decision Note *</label>
                      <input
                        type="text"
                        required
                        value={statusComment}
                        onChange={(e) => setStatusComment(e.target.value)}
                        placeholder="State reason for verification, forwarding, or resolution..."
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
                  >
                    Commit Status Update with Audit Log
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Citizen Comments & Updates Thread */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-[#2BEE34]" />
              <span>Citizen Discussion & Ground Updates ({selectedReport.comments.length})</span>
            </h3>

            <div className="space-y-2">
              {selectedReport.comments.length === 0 ? (
                <p className="text-xs text-zinc-500 py-2">
                  No comments yet. Are you familiar with this location? Add ground updates below.
                </p>
              ) : (
                selectedReport.comments.map((com) => (
                  <div
                    key={com.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      com.isOfficial
                        ? 'bg-emerald-950/20 border-emerald-600/40 text-emerald-200'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center space-x-1.5">
                        <span>{com.userName}</span>
                        {com.isOfficial && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 text-[10px] font-bold">
                            Official
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-zinc-500">
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
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#2BEE34]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#2BEE34] hover:bg-[#25d32d] text-zinc-950 font-bold transition-colors"
                title="Post Comment"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs">
          <button
            onClick={() => upvoteReport(selectedReport.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
          >
            <ThumbsUp className="w-4 h-4 text-[#2BEE34]" />
            <span>Support / Confirm ({selectedReport.upvotesCount})</span>
          </button>

          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

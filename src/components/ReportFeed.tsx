import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CivicReport, ReportSeverity, ReportStatus } from '../types';
import { DIVISIONS } from '../data/geoData';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ThumbsUp,
  Bookmark,
  ChevronRight,
  Shield,
  Eye,
  Building2,
  SlidersHorizontal,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpDown
} from 'lucide-react';

export const ReportFeed: React.FC = () => {
  const {
    reports,
    setSelectedReport,
    toggleBookmark,
    upvoteReport,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDivision,
    setSelectedDivision,
    selectedStatus,
    setSelectedStatus,
    language
  } = useApp();

  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'severity'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Filter and Sort
  const filteredAndSorted = useMemo(() => {
    return reports
      .filter((r) => {
        // Privacy filter: do not show private authority reports in public feed
        if (r.privacy === 'private_authority') return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = r.title.toLowerCase().includes(q);
          const matchesDesc = r.description.toLowerCase().includes(q);
          const matchesId = r.id.toLowerCase().includes(q);
          const matchesDistrict = r.location.district.toLowerCase().includes(q);
          const matchesUpazila = r.location.upazila.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesId && !matchesDistrict && !matchesUpazila) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;

        // Status filter
        if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;

        // Division filter
        if (selectedDivision !== 'all' && r.location.division !== selectedDivision) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        }
        if (sortBy === 'upvotes') {
          return b.upvotesCount - a.upvotesCount;
        }
        if (sortBy === 'severity') {
          const score = { critical: 4, high: 3, medium: 2, low: 1 };
          return score[b.severity] - score[a.severity];
        }
        return 0;
      });
  }, [reports, searchQuery, selectedCategory, selectedStatus, selectedDivision, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginatedReports = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'resolved':
        return {
          label: 'Resolved',
          classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
        };
      case 'action_taken':
        return {
          label: 'Action Taken',
          classes: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-semibold'
        };
      case 'verified':
        return {
          label: 'Verified',
          classes: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-medium'
        };
      case 'forwarded_to_authority':
        return {
          label: 'Forwarded',
          classes: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
        };
      default:
        return {
          label: 'Submitted',
          classes: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/30'
        };
    }
  };

  const getSeverityBadge = (severity: ReportSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'Critical Hazard',
          classes: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40 font-bold'
        };
      case 'high':
        return {
          label: 'High Priority',
          classes: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/35 font-semibold'
        };
      case 'medium':
        return {
          label: 'Medium',
          classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
        };
      default:
        return {
          label: 'Low',
          classes: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/25'
        };
    }
  };

  return (
    <div className="space-y-6" id="public-report-feed">
      {/* Feed Header and Search Controls */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              <span>Public Civic Reports & Grievances</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live citizen allegations, verification statuses, and authority actions recorded across Bangladesh.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{filteredAndSorted.length}</strong> matching reports
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, keyword, ID, or upazila..."
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>

          {/* Division Filter */}
          <div>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="all">All Divisions</option>
              {DIVISIONS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="road">Roads & Bridges</option>
              <option value="drainage">Drainage & WASA</option>
              <option value="electricity">Power & Electric</option>
              <option value="waste_management">Waste Management</option>
              <option value="bribery">Bribery & Extortion</option>
              <option value="corruption">Public Fund Corruption</option>
              <option value="police_related">Police Misconduct</option>
              <option value="healthcare">Healthcare & Hospital</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="forwarded_to_authority">Forwarded</option>
              <option value="action_taken">Action Taken</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Sorting & Reset Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800/80">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  sortBy === 'newest'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('upvotes')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  sortBy === 'upvotes'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Most Upvoted
              </button>
              <button
                onClick={() => setSortBy('severity')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  sortBy === 'severity'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Severity
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDivision('all');
              setSelectedStatus('all');
              setSortBy('newest');
            }}
            className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      {paginatedReports.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 space-y-3">
          <FileText className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No reports match your filters</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria, switching division, or clearing all active filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedReports.map((report) => {
            const status = getStatusBadge(report.status);
            const severity = getSeverityBadge(report.severity);

            return (
              <div
                key={report.id}
                className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:shadow-md transition-all text-slate-900 dark:text-slate-100"
              >
                <div className="space-y-3">
                  {/* Card Header: Badges & ID */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold ${status.classes}`}>
                        {status.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${severity.classes}`}>
                        {severity.label}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-slate-400 shrink-0 font-bold">
                      #{report.id}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      onClick={() => setSelectedReport(report)}
                      className="text-sm font-bold line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Evidence Thumbnails if present */}
                  {report.evidence && report.evidence.length > 0 && (
                    <div className="flex items-center space-x-1.5 pt-1">
                      {report.evidence.slice(0, 3).map((ev, i) => (
                        <div
                          key={ev.id || i}
                          className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
                        >
                          {ev.fileType === 'image' ? (
                            <img
                              src={ev.url}
                              alt={ev.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold uppercase text-slate-400">
                              {ev.fileType}
                            </div>
                          )}
                        </div>
                      ))}
                      {report.evidence.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          +{report.evidence.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Location and Authority Tags */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">
                        {report.location.upazila}, {report.location.district} ({report.location.division})
                      </span>
                    </div>

                    {report.officialResponse && (
                      <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="line-clamp-1">
                          Official response on record from {report.officialResponse.department}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {/* Upvote & Bookmark */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => upvoteReport(report.id)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        report.hasUpvoted
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300'
                      }`}
                      title="Support this civic report"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{report.upvotesCount}</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(report.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        report.isBookmarked
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300'
                      }`}
                      title="Bookmark Report"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <span>View Case</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 text-xs font-semibold"
          >
            Previous
          </button>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 text-xs font-semibold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

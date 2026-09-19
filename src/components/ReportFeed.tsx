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
  FileText
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
    theme
  } = useApp();

  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'severity'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const isLight = theme === 'light';

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
          classes: isLight
            ? 'bg-[#004741] text-[#F0EDE4] border border-[#004741]'
            : 'bg-[#F0EDE4] text-[#004741] border border-[#F0EDE4]'
        };
      case 'action_taken':
        return {
          label: 'Action Taken',
          classes: isLight
            ? 'bg-[#004741]/15 text-[#004741] border border-[#004741]/35 font-bold'
            : 'bg-[#F0EDE4]/20 text-[#F0EDE4] border border-[#F0EDE4]/35 font-bold'
        };
      case 'verified':
        return {
          label: 'Verified',
          classes: isLight
            ? 'bg-[#004741]/10 text-[#004741] border border-[#004741]/25'
            : 'bg-[#F0EDE4]/15 text-[#F0EDE4] border border-[#F0EDE4]/25'
        };
      case 'forwarded_to_authority':
        return {
          label: 'Forwarded',
          classes: isLight
            ? 'bg-[#004741]/8 text-[#004741] border border-[#004741]/20'
            : 'bg-[#F0EDE4]/12 text-[#F0EDE4] border border-[#F0EDE4]/20'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          classes: isLight
            ? 'bg-[#004741]/6 text-[#004741] border border-[#004741]/15'
            : 'bg-[#F0EDE4]/10 text-[#F0EDE4] border border-[#F0EDE4]/15'
        };
      default:
        return {
          label: 'Submitted',
          classes: isLight
            ? 'bg-[#004741]/5 text-[#004741]/80 border border-[#004741]/15'
            : 'bg-[#F0EDE4]/8 text-[#F0EDE4]/80 border border-[#F0EDE4]/15'
        };
    }
  };

  const getSeverityBadge = (severity: ReportSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'Critical Hazard',
          classes: 'bg-[#E4FD97] text-[#004741] border border-[#004741]/30 font-black shadow-sm'
        };
      case 'high':
        return {
          label: 'High Priority',
          classes: isLight
            ? 'bg-[#E4FD97]/30 text-[#004741] border border-[#004741]/30 font-bold'
            : 'bg-[#FFC6A8]/20 text-[#FFC6A8] border border-[#FFC6A8]/30 font-bold'
        };
      case 'medium':
        return {
          label: 'Medium',
          classes: isLight
            ? 'bg-[#004741]/8 text-[#004741] border border-[#004741]/20'
            : 'bg-[#F0EDE4]/12 text-[#F0EDE4] border border-[#F0EDE4]/20'
        };
      default:
        return {
          label: 'Low',
          classes: isLight
            ? 'bg-[#004741]/5 text-[#004741]/75 border border-[#004741]/15'
            : 'bg-[#F0EDE4]/8 text-[#F0EDE4]/75 border border-[#F0EDE4]/15'
        };
    }
  };

  return (
    <div className="space-y-6" id="public-report-feed">
      {/* Feed Header and Search Controls */}
      <div
        className={`border rounded-2xl p-5 shadow-xl space-y-4 ${
          isLight
            ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
            : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
        }`}
      >
        <div
          className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b ${
            isLight ? 'border-[#004741]/15' : 'border-[#F0EDE4]/15'
          }`}
        >
          <div>
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Public Civic Reports & Grievances</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-[#004741]/75' : 'text-[#F0EDE4]/75'}`}>
              Live citizen allegations, verification statuses, and authority actions recorded across Bangladesh.
            </p>
          </div>

          <div className="text-xs font-mono opacity-80">
            Showing <strong>{filteredAndSorted.length}</strong> matching reports
          </div>
        </div>

        {/* Search Input and Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-[#004741]/50' : 'text-[#F0EDE4]/50'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, keyword, district, thana..."
              className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none ${
                isLight
                  ? 'bg-white border-[#004741]/25 text-[#004741] placeholder:text-[#004741]/40 focus:border-[#004741]'
                  : 'bg-[#003833] border-[#F0EDE4]/25 text-[#F0EDE4] placeholder:text-[#F0EDE4]/40 focus:border-[#F0EDE4]'
              }`}
            />
          </div>

          {/* Division Filter */}
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setCurrentPage(1);
            }}
            className={`border rounded-xl px-3 py-2 text-xs focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741] focus:border-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/25 text-[#F0EDE4] focus:border-[#F0EDE4]'
            }`}
          >
            <option value="all">All Divisions</option>
            {DIVISIONS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.banglaName})
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className={`border rounded-xl px-3 py-2 text-xs focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741] focus:border-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/25 text-[#F0EDE4] focus:border-[#F0EDE4]'
            }`}
          >
            <option value="all">All Categories</option>
            <option value="road">Road & Bridge</option>
            <option value="drainage">Drainage & Waterlogging</option>
            <option value="electricity">Electricity</option>
            <option value="waste_management">Waste Management</option>
            <option value="bribery">Bribery & Extortion</option>
            <option value="corruption">Public Corruption</option>
            <option value="public_service">Public Service</option>
            <option value="environment">Environment</option>
            <option value="police_related">Police-related</option>
          </select>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`border rounded-xl px-3 py-2 text-xs focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741] focus:border-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/25 text-[#F0EDE4] focus:border-[#F0EDE4]'
            }`}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="severity">Sort: Highest Urgency</option>
            <option value="upvotes">Sort: Most Supported</option>
          </select>
        </div>
      </div>

      {/* Reports Card List */}
      {paginatedReports.length === 0 ? (
        <div
          className={`border rounded-2xl p-12 text-center space-y-3 ${
            isLight
              ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
              : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
          }`}
        >
          <FileText className="w-10 h-10 opacity-50 mx-auto" />
          <h3 className="text-base font-bold">No Reports Found</h3>
          <p className="text-xs opacity-75 max-w-sm mx-auto">
            No citizen reports match your current filter criteria. Try resetting the filters or submit a new report.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDivision('all');
              setSelectedStatus('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border ${
              isLight
                ? 'bg-[#004741] text-[#F0EDE4] border-[#004741]'
                : 'bg-[#F0EDE4] text-[#004741] border-[#F0EDE4]'
            }`}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedReports.map((report) => {
            const status = getStatusBadge(report.status);
            const sev = getSeverityBadge(report.severity);

            return (
              <div
                key={report.id}
                className={`border rounded-2xl p-5 shadow-md flex flex-col justify-between transition-all group ${
                  isLight
                    ? 'bg-[#FAF8F5] hover:bg-white border-[#004741]/15 hover:border-[#004741]/40 text-[#004741]'
                    : 'bg-[#004741] hover:bg-[#003833] border-[#F0EDE4]/15 hover:border-[#F0EDE4]/40 text-[#F0EDE4]'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: ID, Status, Severity */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                          isLight
                            ? 'bg-white border-[#004741]/20 text-[#004741]'
                            : 'bg-[#003833] border-[#F0EDE4]/20 text-[#F0EDE4]'
                        }`}
                      >
                        #{report.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status.classes}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sev.classes}`}
                    >
                      {sev.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setSelectedReport(report)}
                    className="text-base font-bold cursor-pointer transition-colors line-clamp-2 leading-snug hover:underline"
                  >
                    {report.title}
                  </h3>

                  {/* Description excerpt */}
                  <p className="text-xs opacity-80 line-clamp-3 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Location and Date tags */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] opacity-75 pt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {report.location.upazila}, {report.location.district}
                      </span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(report.submittedAt).toLocaleDateString()}</span>
                    </span>

                    {report.evidence.length > 0 && (
                      <span className="text-[10px] opacity-75">
                        • {report.evidence.length} file(s) attached
                      </span>
                    )}
                  </div>

                  {/* Official response teaser if present */}
                  {report.officialResponse && (
                    <div
                      className={`p-2.5 rounded-xl border text-[11px] flex items-center space-x-2 ${
                        isLight
                          ? 'bg-[#004741]/10 border-[#004741]/25 text-[#004741]'
                          : 'bg-[#F0EDE4]/15 border-[#F0EDE4]/25 text-[#F0EDE4]'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate font-medium">
                        Official Action by {report.officialResponse.authorityName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div
                  className={`flex items-center justify-between pt-4 mt-4 border-t text-xs ${
                    isLight ? 'border-[#004741]/15' : 'border-[#F0EDE4]/15'
                  }`}
                >
                  <div className="flex items-center space-x-3 opacity-80">
                    <button
                      onClick={() => upvoteReport(report.id)}
                      className="flex items-center space-x-1 hover:underline cursor-pointer transition-colors"
                      title="Support this report"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{report.upvotesCount}</span>
                    </button>

                    <button
                      onClick={() => toggleBookmark(report.id)}
                      className={`cursor-pointer transition-colors ${
                        report.isBookmarked ? 'font-bold' : ''
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex items-center space-x-1 font-bold hover:underline cursor-pointer transition-colors"
                  >
                    <span>Inspect Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-1.5 rounded-lg border text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/25 text-[#F0EDE4]'
            }`}
          >
            Previous
          </button>
          <span className="text-xs px-2 opacity-80">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={`px-3 py-1.5 rounded-lg border text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/25 text-[#F0EDE4]'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

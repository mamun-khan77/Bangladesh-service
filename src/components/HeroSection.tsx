import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  FileText,
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Search,
  PhoneCall,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    t,
    language,
    reports,
    setIsReportWizardOpen,
    setActiveTab,
    setSelectedCategory,
    setSelectedReport,
    setSearchQuery,
    theme
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const isLight = theme === 'light';

  const totalCount = reports.length;
  const underReviewCount = reports.filter((r) => r.status === 'under_review' || r.status === 'submitted').length;
  const actionTakenCount = reports.filter((r) => r.status === 'action_taken' || r.status === 'forwarded_to_authority').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Quick categories with live counts
  const quickCategories = [
    { key: 'road', label: language === 'bn' ? 'সড়ক ও সেতু' : 'Roads & Bridges', icon: '🛣️' },
    { key: 'drainage', label: language === 'bn' ? 'ওয়াসা ও নিষ্কাশন' : 'Drainage & Water', icon: '🌊' },
    { key: 'electricity', label: language === 'bn' ? 'বিদ্যুৎ বিভ্রাট' : 'Power & Electricity', icon: '⚡' },
    { key: 'bribery', label: language === 'bn' ? 'ঘুষ ও দুর্নীতি' : 'Bribery & Harassment', icon: '⚖️' },
    { key: 'waste_management', label: language === 'bn' ? 'বর্জ্য ব্যবস্থাপনা' : 'Garbage & Sanitation', icon: '♻️' },
    { key: 'public_service', label: language === 'bn' ? 'পাবলিক সার্ভিস' : 'Public Services', icon: '🏛️' }
  ];

  // Pick 3 high-priority or recently acted-upon reports for the "Live Dispatches" preview
  const featuredReports = reports
    .filter((r) => r.status === 'action_taken' || r.status === 'resolved' || r.status === 'verified')
    .slice(0, 3);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;

    const term = localSearch.trim().toLowerCase();

    // Check if it matches an exact report ID (e.g. BCW-2026-0001)
    const matchedReport = reports.find(
      (r) => r.id.toLowerCase() === term || r.id.toLowerCase().includes(term)
    );

    if (matchedReport) {
      setSelectedReport(matchedReport);
      setSearchError(null);
      return;
    }

    // Otherwise apply global search and switch to reports tab
    setSearchQuery(localSearch);
    setActiveTab('reports');
  };

  return (
    <section className="relative overflow-hidden pt-2 pb-6" id="hero-section">
      {/* Ambient Radial Accent (Two-color system) */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 blur-3xl pointer-events-none -z-10 rounded-full transition-colors ${
          isLight ? 'bg-[#004741]/5' : 'bg-[#F0EDE4]/5'
        }`}
      />

      <div className="space-y-6">
        {/* Top Operational Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div
            className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
              isLight
                ? 'bg-[#004741]/10 border-[#004741]/25 text-[#004741]'
                : 'bg-[#F0EDE4]/15 border-[#F0EDE4]/30 text-[#F0EDE4]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isLight ? 'bg-[#004741]' : 'bg-[#F0EDE4]'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLight ? 'bg-[#004741]' : 'bg-[#F0EDE4]'
                }`}
              />
            </span>
            <span>
              {language === 'bn'
                ? 'সরাসরি নাগরিক মনিটরিং সক্রিয়: ৬৪ জেলা কাভারেজ'
                : 'Live Civic Monitoring Active: 64 District Public Surveillance'}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('police')}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[#004741]/30 bg-[#E4FD97] hover:bg-[#d5f47d] text-[#004741] font-bold transition-all shadow-sm cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#004741]" />
              <span>{language === 'bn' ? 'জরুরি হটলাইন ৯৯৯' : 'Emergency Hotlines 999'}</span>
            </button>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Bold Value Proposition & Search Action */}
          <div
            className={`lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-sm transition-colors ${
              isLight
                ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
                : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs uppercase font-extrabold tracking-widest flex items-center space-x-1.5 ${
                    isLight ? 'text-[#004741]' : 'text-[#F0EDE4]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নাগরিক জবাবদিহিতা পোর্টাল' : 'CIVIC ACCOUNTABILITY SYSTEM'}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                {language === 'bn' ? (
                  <>
                    জনগণের চোখে পর্যবেক্ষণ, <br />
                    <span className={isLight ? 'text-[#004741] underline decoration-[#E4FD97] decoration-4 underline-offset-4' : 'text-[#E4FD97]'}>স্বচ্ছ প্রশাসন</span> ও নিরপেক্ষ জবাবদিহিতা।
                  </>
                ) : (
                  <>
                    Report Civic Grievances. <br />
                    <span className={isLight ? 'text-[#004741] underline decoration-[#E4FD97] decoration-4 underline-offset-4' : 'text-[#E4FD97]'}>Track Authorities</span> in Real-Time.
                  </>
                )}
              </h1>

              <p
                className={`text-sm sm:text-base max-w-xl leading-relaxed ${
                  isLight ? 'text-[#004741]/80' : 'text-[#F0EDE4]/80'
                }`}
              >
                {language === 'bn'
                  ? 'সড়কের খানাখন্দ, ড্রেনেজ জট, ওয়াসার সমস্যা থেকে শুরু করে সেবা প্রদানে হয়রানি ও দুর্নীতি—ছবি ও জিপিএস প্রমাণসহ অভিযোগ দায়ের করুন। প্রতিটি অভিযোগ সরাসরি সরকারি দপ্তরের নজরে আনা হয়।'
                  : 'From broken roads, waterlogging, and sanitation hazards to bribery and public service extortion—submit geo-tagged reports with evidence and hold civic departments directly accountable.'}
              </p>
            </div>

            {/* Instant Case Tracker Search Bar */}
            <div className="mt-6 pt-6 border-t border-current/15 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                  {language === 'bn' ? 'অভিযোগ ট্র্যাক বা অনুসন্ধান করুন' : 'Track Existing Grievance or Search Thana'}
                </label>
                <form onSubmit={handleHeroSearch} className="flex items-center gap-2">
                  <div
                    className={`relative flex-1 flex items-center rounded-xl border transition-all ${
                      isLight
                        ? 'bg-white border-[#004741]/30 focus-within:border-[#004741] focus-within:ring-2 focus-within:ring-[#004741]/20'
                        : 'bg-[#003833] border-[#F0EDE4]/30 focus-within:border-[#F0EDE4] focus-within:ring-2 focus-within:ring-[#F0EDE4]/20'
                    }`}
                  >
                    <Search
                      className={`w-4 h-4 ml-3.5 shrink-0 ${
                        isLight ? 'text-[#004741]/60' : 'text-[#F0EDE4]/60'
                      }`}
                    />
                    <input
                      type="text"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder={
                        language === 'bn'
                          ? 'ট্র্যাকিং আইডি (যেমন: BCW-2026-0001) বা থানা দিয়ে খুঁজুন...'
                          : 'Enter Case ID (e.g. BCW-2026-0001) or Thana name...'
                      }
                      className="w-full bg-transparent px-3 py-2.5 text-xs focus:outline-none placeholder:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-black text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 bg-[#E4FD97] text-[#004741] hover:bg-[#d5f47d] border border-[#004741]/20 shadow-md"
                  >
                    {language === 'bn' ? 'অনুসন্ধান' : 'Track Case'}
                  </button>
                </form>
                {searchError && (
                  <p className="text-xs mt-1.5 pl-2 font-medium opacity-90">{searchError}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsReportWizardOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer bg-[#E4FD97] text-[#004741] hover:bg-[#d5f47d] border border-[#004741]/30 shadow-lg shadow-black/20"
                >
                  <PlusCircle className="w-5 h-5 text-[#004741]" />
                  <span>{language === 'bn' ? 'নতুন অভিযোগ জানান' : 'Report an Issue Now'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl border font-bold text-sm transition-colors cursor-pointer ${
                    isLight
                      ? 'border-[#004741]/30 text-[#004741] hover:bg-[#004741]/10'
                      : 'border-[#F0EDE4]/30 text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{language === 'bn' ? 'লাইভ ম্যাপ দেখুন' : 'Explore Live Map'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Transparency Metrics & Dispatches */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Top Stat Matrix */}
            <div
              className={`p-6 rounded-3xl border shadow-xl backdrop-blur-sm space-y-4 ${
                isLight
                  ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
                  : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 opacity-90">
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'bn' ? 'লাইভ জবাবদিহিতা পরিসংখ্যান' : 'Real-Time Impact Metrics'}</span>
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    isLight
                      ? 'bg-[#004741]/10 text-[#004741] border-[#004741]/20'
                      : 'bg-[#F0EDE4]/15 text-[#F0EDE4] border-[#F0EDE4]/25'
                  }`}
                >
                  {resolutionRate}% {language === 'bn' ? 'সমাধান হার' : 'Resolved'}
                </span>
              </div>

              {/* 4-Stat Bento Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Total Reports */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isLight ? 'bg-white/80 border-[#004741]/15' : 'bg-[#003833] border-[#F0EDE4]/15'
                  }`}
                >
                  <div className="text-[11px] font-medium opacity-80 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'মোট অভিযোগ' : 'Total Reports'}</span>
                  </div>
                  <div className="text-2xl font-black mt-0.5">{totalCount}</div>
                </div>

                {/* Under Review */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isLight ? 'bg-white/80 border-[#004741]/15' : 'bg-[#003833] border-[#F0EDE4]/15'
                  }`}
                >
                  <div className="text-[11px] font-medium opacity-80 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'তদন্তাধীন' : 'Under Review'}</span>
                  </div>
                  <div className="text-2xl font-black mt-0.5">{underReviewCount}</div>
                </div>

                {/* Official Action Taken */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isLight ? 'bg-white/80 border-[#004741]/15' : 'bg-[#003833] border-[#F0EDE4]/15'
                  }`}
                >
                  <div className="text-[11px] font-medium opacity-80 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পদক্ষেপ গৃহীত' : 'Action Taken'}</span>
                  </div>
                  <div className="text-2xl font-black mt-0.5">{actionTakenCount}</div>
                </div>

                {/* Fully Resolved */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isLight ? 'bg-white/80 border-[#004741]/15' : 'bg-[#003833] border-[#F0EDE4]/15'
                  }`}
                >
                  <div className="text-[11px] font-medium opacity-80 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সমাধানকৃত' : 'Audited Resolved'}</span>
                  </div>
                  <div className="text-2xl font-black mt-0.5">{resolvedCount}</div>
                </div>
              </div>
            </div>

            {/* Recent Dispatches Preview */}
            <div
              className={`p-5 rounded-3xl border shadow-xl backdrop-blur-sm space-y-3 flex-1 flex flex-col justify-between ${
                isLight
                  ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
                  : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-[#E4FD97] ring-2 ring-[#004741]" />
                  <span>{language === 'bn' ? 'সাম্প্রতিক দাপ্তরিক পদক্ষেপ' : 'Recent Civic Dispatches'}</span>
                </div>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-xs hover:underline font-semibold flex items-center space-x-1 cursor-pointer opacity-90"
                >
                  <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {featuredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isLight
                        ? 'bg-white hover:bg-white/90 border-[#004741]/15 hover:border-[#004741]'
                        : 'bg-[#003833] hover:bg-[#003833]/90 border-[#F0EDE4]/15 hover:border-[#F0EDE4]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono font-bold">{report.id}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          isLight
                            ? 'bg-[#004741]/10 text-[#004741] border-[#004741]/20'
                            : 'bg-[#F0EDE4]/15 text-[#F0EDE4] border-[#F0EDE4]/20'
                        }`}
                      >
                        {report.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold mt-1 line-clamp-1">{report.title}</h4>
                    <div className="flex items-center justify-between text-[10px] mt-1.5 opacity-80">
                      <span>📍 {report.location.upazila}, {report.location.district}</span>
                      <span className="font-semibold flex items-center space-x-0.5">
                        <span>Inspect</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Issue Category Jump Chips */}
        <div
          className={`p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
            isLight
              ? 'bg-[#FAF8F5] border-[#004741]/15 text-[#004741]'
              : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
          }`}
        >
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider shrink-0 opacity-80">
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'দ্রুত বিভাগ ফিল্টার:' : 'Filter by Domain:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {quickCategories.map((cat) => {
              const count = reports.filter((r) => r.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key as any);
                    setActiveTab('reports');
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-[#004741] hover:text-[#F0EDE4] border-[#004741]/20 text-[#004741]'
                      : 'bg-[#003833] hover:bg-[#F0EDE4] hover:text-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isLight ? 'bg-[#004741]/10 text-[#004741]' : 'bg-[#F0EDE4]/15 text-[#F0EDE4]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Step Accountability Process Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: language === 'bn' ? 'নাগরিক রিপোর্ট দাখিল' : 'Report with Evidence',
              desc: language === 'bn' ? 'ছবি ও জিপিএস অবস্থানসহ অভিযোগ দায়ের করুন।' : 'Upload photo & GPS proof. Choose anonymous or verified.'
            },
            {
              step: '02',
              title: language === 'bn' ? 'মডারেশন ও তথ্য যাচাই' : 'Civic Verification',
              desc: language === 'bn' ? 'স্বেচ্ছাসেবী ও মডারেটর দল সত্যতা যাচাই করে।' : 'Triage moderators authenticate evidence to prevent false claims.'
            },
            {
              step: '03',
              title: language === 'bn' ? 'কর্তৃপক্ষের কাছে প্রেরণ' : 'Authority Escalation',
              desc: language === 'bn' ? 'সরাসরি সংশ্লিষ্ট মন্ত্রণালয় বা সিটি করপোরেশনে ফরওয়ার্ড।' : 'Direct digital dispatch to City Corp, WASA, PDB, or ACC.'
            },
            {
              step: '04',
              title: language === 'bn' ? 'সমাধান ও অডিট রেকর্ড' : 'Audited Resolution',
              desc: language === 'bn' ? 'কর্মকর্তার সমাধান রিপোর্ট ও নাগরিক রেটিং।' : 'Verified fix photo uploaded & stored permanently in the public log.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className={`p-4 rounded-2xl border shadow-sm space-y-1.5 transition-colors ${
                isLight
                  ? 'bg-[#FAF8F5] border-[#004741]/15 text-[#004741]'
                  : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
              }`}
            >
              <div className="text-xs font-mono font-bold mb-1 opacity-80">
                STEP {item.step}
              </div>
              <h4 className="text-xs font-bold tracking-tight">{item.title}</h4>
              <p
                className={`text-[11px] leading-relaxed ${
                  isLight ? 'text-[#004741]/75' : 'text-[#F0EDE4]/75'
                }`}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

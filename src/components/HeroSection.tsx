import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  FileText,
  PlusCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Search,
  PhoneCall,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    language,
    reports,
    setIsReportWizardOpen,
    setActiveTab,
    setSelectedCategory,
    setSelectedReport,
    setSearchQuery
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

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
    { key: 'bribery', label: language === 'bn' ? 'ঘুষ ও দুর্নীতি' : 'Bribery & Corruption', icon: '⚖️' },
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
    <section className="relative overflow-hidden pt-1 pb-4" id="hero-section">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="space-y-5 sm:space-y-6">
        {/* Top Operational Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span className="text-[11px] sm:text-xs">
              {language === 'bn'
                ? 'সরাসরি নাগরিক মনিটরিং সক্রিয়: ৬৪ জেলা কাভারেজ'
                : 'Live Civic Monitoring Active: 64 District Surveillance'}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('emergency')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold transition-all shadow-xs cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>{language === 'bn' ? 'জরুরি হটলাইন ৯৯৯' : 'Emergency 999 Hotlines'}</span>
            </button>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Column: Bold Value Proposition & Search Action */}
          <div className="lg:col-span-7 flex flex-col justify-between p-5 sm:p-7 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নাগরিক জবাবদিহিতা পোর্টাল' : 'CIVIC ACCOUNTABILITY SYSTEM'}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.2]">
                {language === 'bn' ? (
                  <>
                    জনগণের চোখে পর্যবেক্ষণ, <br />
                    <span className="text-emerald-600 dark:text-emerald-400">স্বচ্ছ প্রশাসন</span> ও নিরপেক্ষ জবাবদিহিতা।
                  </>
                ) : (
                  <>
                    Report Civic Grievances. <br />
                    <span className="text-emerald-600 dark:text-emerald-400">Track Authorities</span> in Real-Time.
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                {language === 'bn'
                  ? 'সড়কের খানাখন্দ, ড্রেনেজ জট, ওয়াসার সমস্যা থেকে শুরু করে সেবা প্রদানে হয়রানি ও দুর্নীতি—ছবি ও জিপিএস প্রমাণসহ অভিযোগ দায়ের করুন। প্রতিটি অভিযোগ সরাসরি সরকারি দপ্তরের নজরে আনা হয়।'
                  : 'From broken roads, waterlogging, and sanitation hazards to bribery and public service extortion—submit geo-tagged reports with evidence and hold civic departments directly accountable.'}
              </p>
            </div>

            {/* Instant Case Tracker Search Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500 dark:text-slate-400">
                  {language === 'bn' ? 'অভিযোগ ট্র্যাক বা অনুসন্ধান করুন' : 'Track Grievance or Search by Location'}
                </label>
                <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="relative flex-1 flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <Search className="w-4 h-4 ml-3.5 shrink-0 text-slate-400" />
                    <input
                      type="text"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder={
                        language === 'bn'
                          ? 'ট্র্যাকিং আইডি (BCW-2026-0001) বা জেলা দিয়ে খুঁজুন...'
                          : 'Enter Case ID (e.g. BCW-2026-0001) or Thana...'
                      }
                      className="w-full bg-transparent px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-xs transition-all cursor-pointer shrink-0 text-center"
                  >
                    {language === 'bn' ? 'অনুসন্ধান' : 'Track Case'}
                  </button>
                </form>
                {searchError && (
                  <p className="text-xs mt-1.5 pl-1 font-medium text-rose-500">{searchError}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                <button
                  onClick={() => setIsReportWizardOpen(true)}
                  className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 text-white" />
                  <span>{language === 'bn' ? 'নতুন অভিযোগ জানান' : 'Report an Issue Now'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('map')}
                  className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'bn' ? 'লাইভ ম্যাপ দেখুন' : 'Explore Live Map'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Transparency Metrics & Dispatches */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {/* Top Stat Matrix */}
            <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3.5 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'bn' ? 'লাইভ জবাবদিহিতা পরিসংখ্যান' : 'Real-Time Impact Metrics'}</span>
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                  {resolutionRate}% {language === 'bn' ? 'সমাধান হার' : 'Resolved'}
                </span>
              </div>

              {/* 4-Stat Bento Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* Total Reports */}
                <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{language === 'bn' ? 'মোট অভিযোগ' : 'Total Reports'}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-slate-900 dark:text-white">{totalCount}</div>
                </div>

                {/* Under Review */}
                <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{language === 'bn' ? 'তদন্তাধীন' : 'Under Review'}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-slate-900 dark:text-white">{underReviewCount}</div>
                </div>

                {/* Official Action Taken */}
                <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[11px] font-medium text-teal-600 dark:text-teal-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                    <span>{language === 'bn' ? 'পদক্ষেপ গৃহীত' : 'Action Taken'}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-slate-900 dark:text-white">{actionTakenCount}</div>
                </div>

                {/* Fully Resolved */}
                <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{language === 'bn' ? 'সমাধানকৃত' : 'Audited Resolved'}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-slate-900 dark:text-white">{resolvedCount}</div>
                </div>
              </div>
            </div>

            {/* Recent Dispatches Preview */}
            <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 flex-1 flex flex-col justify-between text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'bn' ? 'সাম্প্রতিক দাপ্তরিক পদক্ষেপ' : 'Recent Civic Dispatches'}</span>
                </div>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center space-x-0.5 cursor-pointer"
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
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{report.id}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        {report.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold mt-1 line-clamp-1 text-slate-900 dark:text-slate-100">{report.title}</h4>
                    <div className="flex items-center justify-between text-[10px] mt-1.5 text-slate-500 dark:text-slate-400">
                      <span>📍 {report.location.upazila}, {report.location.district}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-0.5">
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

        {/* Quick Issue Category Jump Chips (Mobile horizontal scroll / flex wrap) */}
        <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider shrink-0 text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'bn' ? 'দ্রুত বিভাগ ফিল্টার:' : 'Filter by Domain:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
            {quickCategories.map((cat) => {
              const count = reports.filter((r) => r.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key as any);
                    setActiveTab('reports');
                  }}
                  className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all cursor-pointer"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Step Accountability Process Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
              desc: language === 'bn' ? 'কর্মকর্তার সমাধান রিপোর্ট ও নাগরিক রেটিং।' : 'Verified fix photo uploaded & stored permanently in public ledger.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1.5 transition-colors"
            >
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                STEP {item.step}
              </div>
              <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">{item.title}</h4>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { EMERGENCY_CONTACTS } from '../data/emergencyData';
import { useAppContext } from '../context/AppContext';
import {
  PhoneCall,
  AlertTriangle,
  Clock,
  Phone,
  Flame,
  Scale,
  HeartPulse,
  Users,
  ShieldAlert
} from 'lucide-react';

export const EmergencyDirectory: React.FC = () => {
  const { language } = useAppContext();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'national':
        return <PhoneCall className="w-5 h-5 text-rose-500" />;
      case 'anti_corruption':
        return <Scale className="w-5 h-5 text-amber-500" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'medical':
        return <HeartPulse className="w-5 h-5 text-emerald-500" />;
      case 'social_welfare':
        return <Users className="w-5 h-5 text-indigo-500" />;
      default:
        return <Phone className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6" id="emergency-directory">
      {/* Top Banner */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-6 h-6" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {language === 'bn'
              ? 'বাংলাদেশ জাতীয় জরুরি ও নাগরিক হটলাইনসমূহ'
              : 'Official Bangladesh National Emergency & Civic Hotlines'}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          {language === 'bn'
            ? 'জরুরি জীবনরক্ষা, ফায়ার সার্ভিস, অ্যাম্বুলেন্স ও দুর্নীতি দমন কমিশনের সরাসরি টোল-ফ্রি জরুরি সরকারি হটলাইন।'
            : 'Immediate toll-free state hotlines for armed emergencies, urgent medical ambulance, fire outbreaks, and direct Anti-Corruption Commission reporting.'}
        </p>
        <div className="p-3 sm:p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
          <strong>{language === 'bn' ? 'জরুরি নির্দেশনা:' : 'Legal Guidance:'}</strong>{' '}
          {language === 'bn'
            ? 'জীবনহানির সরাসরি হুমকি বা চলমান অপরাধের ক্ষেত্রে অনলাইনে অভিযোগ জমা না দিয়ে সরাসরি ৯৯৯ নম্বরে ফোন করুন।'
            : 'For immediate threat to life, robbery in progress, or domestic violence, contact the appropriate state hotline directly by phone rather than lodging an online grievance.'}
        </div>
      </div>

      {/* Emergency Hotline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMERGENCY_CONTACTS.map((em) => (
          <div
            key={em.id}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:shadow-md transition-all text-slate-900 dark:text-slate-100"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
                  {getCategoryIcon(em.category)}
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      em.isTollFree
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {em.isTollFree ? 'Toll-Free' : 'Standard Rate'}
                  </span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-end space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{em.availableHours}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold leading-snug">{em.title}</h3>
                <h4 className="text-xs font-semibold mt-0.5 text-emerald-600 dark:text-emerald-400">
                  {em.banglaTitle}
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">{em.agency}</div>
              </div>

              <p className="text-xs leading-relaxed p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                {em.description}
              </p>
            </div>

            {/* Direct Call Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
                {em.number}
              </span>

              <a
                href={`tel:${em.number}`}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hotline</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

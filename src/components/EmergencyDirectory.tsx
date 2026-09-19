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
  Users
} from 'lucide-react';

export const EmergencyDirectory: React.FC = () => {
  const { theme, language } = useAppContext();
  const isLight = theme === 'light';

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'national':
        return <PhoneCall className="w-5 h-5 text-[#004741] dark:text-[#E4FD97]" />;
      case 'anti_corruption':
        return <Scale className="w-5 h-5 text-[#004741] dark:text-[#E4FD97]" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-[#004741] dark:text-[#E4FD97]" />;
      case 'medical':
        return <HeartPulse className="w-5 h-5 text-[#004741] dark:text-[#E4FD97]" />;
      case 'social_welfare':
        return <Users className="w-5 h-5 text-[#004741] dark:text-[#E4FD97]" />;
      default:
        return <Phone className="w-5 h-5 text-[#004741] dark:text-[#E4FD97]" />;
    }
  };

  return (
    <div className="space-y-6" id="emergency-directory">
      {/* Top Banner */}
      <div
        className={`border rounded-2xl p-6 shadow-xl space-y-3 transition-colors ${
          isLight
            ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
            : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
        }`}
      >
        <div className="flex items-center space-x-2 text-[#004741] dark:text-[#E4FD97]">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl font-black tracking-tight text-inherit">
            {language === 'bn'
              ? 'বাংলাদেশ জাতীয় জরুরি ও নাগরিক হটলাইনসমূহ'
              : 'Official Bangladesh National Emergency & Civic Hotlines'}
          </h2>
        </div>
        <p
          className={`text-xs max-w-2xl leading-relaxed ${
            isLight ? 'text-[#004741]/80' : 'text-[#F0EDE4]/80'
          }`}
        >
          {language === 'bn'
            ? 'জরুরি জীবনরক্ষা, ফায়ার সার্ভিস, অ্যাম্বুলেন্স ও দুর্নীতি দমন কমিশনের সরাসরি টোল-ফ্রি জরুরি সরকারি হটলাইন।'
            : 'Immediate toll-free state hotlines for armed emergencies, urgent medical ambulance, fire outbreaks, and direct Anti-Corruption Commission reporting.'}
        </p>
        <div
          className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
            isLight
              ? 'bg-white border-[#004741]/15 text-[#004741]/90'
              : 'bg-[#003833] border-[#F0EDE4]/15 text-[#F0EDE4]/90'
          }`}
        >
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
            className={`border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
              isLight
                ? 'bg-white hover:bg-[#FAF8F5] border-[#004741]/15 hover:border-[#004741] text-[#004741]'
                : 'bg-[#004741] hover:bg-[#003833] border-[#F0EDE4]/15 hover:border-[#F0EDE4] text-[#F0EDE4]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div
                  className={`p-2.5 rounded-xl border ${
                    isLight
                      ? 'bg-[#FAF8F5] border-[#004741]/15'
                      : 'bg-[#003833] border-[#F0EDE4]/15'
                  }`}
                >
                  {getCategoryIcon(em.category)}
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      em.isTollFree
                        ? isLight
                          ? 'bg-[#E4FD97] text-[#004741] border-[#004741]/25 font-black'
                          : 'bg-[#E4FD97]/20 text-[#E4FD97] border-[#E4FD97]/30 font-bold'
                        : isLight
                        ? 'bg-[#004741]/8 text-[#004741] border-[#004741]/20'
                        : 'bg-[#F0EDE4]/10 text-[#F0EDE4] border-[#F0EDE4]/20'
                    }`}
                  >
                    {em.isTollFree ? 'Toll-Free' : 'Standard Rate'}
                  </span>
                  <div className="text-[10px] opacity-70 mt-1 flex items-center justify-end space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{em.availableHours}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold leading-snug">{em.title}</h3>
                <h4
                  className={`text-xs font-semibold mt-0.5 ${
                    isLight ? 'text-[#004741]/80' : 'text-[#E4FD97]'
                  }`}
                >
                  {em.banglaTitle}
                </h4>
                <div className="text-[11px] opacity-70 mt-1 font-semibold">{em.agency}</div>
              </div>

              <p
                className={`text-xs leading-relaxed p-2.5 rounded-xl border ${
                  isLight
                    ? 'bg-[#FAF8F5] border-[#004741]/15 opacity-85'
                    : 'bg-[#003833] border-[#F0EDE4]/15 opacity-85'
                }`}
              >
                {em.description}
              </p>
            </div>

            {/* Direct Call Button */}
            <div className="pt-3 border-t border-current/15 flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-[#004741] dark:text-[#E4FD97]">
                {em.number}
              </span>

              <a
                href={`tel:${em.number}`}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#E4FD97] hover:bg-[#d5f47d] text-[#004741] font-black text-xs shadow-md border border-[#004741]/20 transition-transform hover:scale-105"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#004741]" />
                <span>Call Hotline</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

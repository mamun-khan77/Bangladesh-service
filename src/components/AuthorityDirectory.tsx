import React, { useState } from 'react';
import { ADMINISTRATIVE_OFFICIALS } from '../data/administrativeData';
import { DIVISIONS } from '../data/geoData';
import {
  Building2,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AuthorityDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');

  const filteredOfficials = ADMINISTRATIVE_OFFICIALS.filter((off) => {
    if (selectedDivision !== 'all' && off.division !== selectedDivision) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = off.name.toLowerCase().includes(q);
      const matchesOffice = off.officeName.toLowerCase().includes(q);
      const matchesDistrict = off.district.toLowerCase().includes(q);
      const matchesDesig = off.designation.toLowerCase().includes(q);
      return matchesName || matchesOffice || matchesDistrict || matchesDesig;
    }
    return true;
  });

  return (
    <div className="space-y-6" id="authority-directory">
      {/* Banner */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            <span>Administrative Officials & Government Office Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verified contact details for District Magistrates (DC), Superintendents of Police (SP), Upazila Nirbahi Officers (UNO), City Corporations, and Anti-Corruption Commission divisional desks.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by office, DC, SP, UNO, district, or municipal body..."
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>

          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
          >
            <option value="all">All Divisions</option>
            {DIVISIONS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.banglaName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Officials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOfficials.map((off) => (
          <div
            key={off.id}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:shadow-md transition-all text-slate-900 dark:text-slate-100"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {off.district} • {off.division}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Verified: {off.lastVerifiedDate}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold leading-snug">{off.name}</h3>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{off.designation}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{off.officeName}</div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start space-x-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{off.officeAddress}</span>
              </p>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${off.officialContact}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 font-mono">
                    {off.officialContact}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-500 dark:text-slate-400 truncate">{off.officeEmail}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={off.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Web Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${off.officialContact}`}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Call Office
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

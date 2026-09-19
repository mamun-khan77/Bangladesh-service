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
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#2BEE34]" />
            <span>Administrative Officials & Government Office Directory</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Verified contact details for District Magistrates (DC), Superintendents of Police (SP), Upazila Nirbahi Officers (UNO), City Corporations, and Anti-Corruption Commission divisional desks.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800/80">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by office, DC, SP, UNO, district, or municipal body..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#2BEE34]"
            />
          </div>

          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2BEE34]"
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
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:bg-zinc-900/90 transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {off.district} • {off.division}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Verified: {off.lastVerifiedDate}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white leading-snug">{off.name}</h3>
                <div className="text-xs text-[#2BEE34] font-semibold mt-0.5">{off.designation}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{off.officeName}</div>
              </div>

              <p className="text-xs text-zinc-400 flex items-start space-x-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                <span>{off.officeAddress}</span>
              </p>

              <div className="space-y-1 text-xs text-zinc-300 pt-1">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <a href={`tel:${off.officialContact}`} className="hover:text-[#2BEE34] font-mono">
                    {off.officialContact}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono text-zinc-400 truncate">{off.officeEmail}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <a
                href={off.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs font-semibold text-[#2BEE34] hover:underline"
              >
                <span>Official Web Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${off.officialContact}`}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-colors"
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

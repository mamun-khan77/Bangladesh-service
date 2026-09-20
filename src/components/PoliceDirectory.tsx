import React, { useState, useMemo } from 'react';
import { POLICE_STATIONS } from '../data/policeData';
import { PoliceStation } from '../types';
import { DIVISIONS, DISTRICTS } from '../data/geoData';
import { useAppContext } from '../context/AppContext';
import {
  Shield,
  PhoneCall,
  MapPin,
  Search,
  CheckCircle2,
  ExternalLink,
  Navigation,
  X
} from 'lucide-react';

export const PoliceDirectory: React.FC = () => {
  const { language } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStation, setSelectedStation] = useState<PoliceStation | null>(null);
  const [nearbyNotice, setNearbyNotice] = useState<string | null>(null);

  const filteredStations = useMemo(() => {
    return POLICE_STATIONS.filter((ps) => {
      if (selectedDivision !== 'all' && ps.division !== selectedDivision) return false;
      if (selectedDistrict !== 'all' && ps.district !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ps.name.toLowerCase().includes(q) || ps.banglaName.includes(q);
        const matchesDistrict = ps.district.toLowerCase().includes(q);
        const matchesUpazila = ps.upazila.toLowerCase().includes(q);
        const matchesAddress = ps.address.toLowerCase().includes(q);
        return matchesName || matchesDistrict || matchesUpazila || matchesAddress;
      }
      return true;
    });
  }, [searchQuery, selectedDivision, selectedDistrict]);

  const handleLocateNearMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let closest: PoliceStation | null = null;
        let minDistance = Infinity;

        POLICE_STATIONS.forEach((ps) => {
          const dist = Math.sqrt(
            Math.pow(ps.latitude - lat, 2) + Math.pow(ps.longitude - lng, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            closest = ps;
          }
        });

        if (closest) {
          setSelectedStation(closest);
          setNearbyNotice(`Nearest police station located: ${(closest as PoliceStation).name}`);
          setTimeout(() => setNearbyNotice(null), 5000);
        }
      },
      () => {
        const fallback = POLICE_STATIONS[0];
        setSelectedStation(fallback);
        setNearbyNotice('Using Dhanmondi Model Police Station as default location.');
        setTimeout(() => setNearbyNotice(null), 5000);
      }
    );
  };

  return (
    <div className="space-y-6" id="police-stations-directory">
      {/* Directory Banner */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center space-x-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>{language === 'bn' ? 'বাংলাদেশ পুলিশ থানা ডিরেক্টরি' : 'Bangladesh Police Stations (Thana) Directory'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'মেট্রোপলিটন ও জেলা পুলিশের ভেরিফায়েড ল্যান্ডলাইন, ডিউটি অফিসার ও জরুরি থানার যোগাযোগ তালিকা।'
                : 'Search verified Thana landlines, duty officer desks, and emergency jurisdictions across all metropolitan and district police units.'}
            </p>
          </div>

          <button
            onClick={handleLocateNearMe}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নিকটবর্তী থানা খুঁজুন' : 'Find Stations Near Me'}</span>
          </button>
        </div>

        {nearbyNotice && (
          <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{nearbyNotice}</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'ঢাকা, ধানমন্ডি, বাগেরহাট...' : 'Search by name, district, or address...'}
              className="w-full rounded-xl pl-9 pr-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
            />
          </div>

          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDistrict('all');
            }}
            className="rounded-xl px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
          >
            <option value="all">All Divisions</option>
            {DIVISIONS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.banglaName})
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
          >
            <option value="all">All Districts</option>
            {DISTRICTS.filter((d) => {
              if (selectedDivision === 'all') return true;
              const divObj = DIVISIONS.find((v) => v.name === selectedDivision);
              return divObj ? d.divisionId === divObj.id : true;
            }).map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.banglaName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Police Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:shadow-md transition-all text-slate-900 dark:text-slate-100"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {station.district} • {station.upazila}
                </span>
                <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Verified 2026</span>
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold leading-snug">{station.name}</h3>
                <h4 className="text-xs font-semibold mt-0.5 text-emerald-600 dark:text-emerald-400">
                  {station.banglaName}
                </h4>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start space-x-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{station.address}</span>
              </p>

              <div className="text-[11px] p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <strong>Jurisdiction:</strong> {station.jurisdiction}
              </div>
            </div>

            {/* Direct Call and Details Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <a
                href={`tel:${station.officialPhone}`}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Thana Desk</span>
              </a>

              <button
                onClick={() => setSelectedStation(station)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Police Station Details Modal (Mobile optimized) */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm sm:text-base font-bold">{selectedStation.name}</h3>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">Official Bangla Name:</strong>
                <span>{selectedStation.banglaName}</span>
              </div>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">Full Address:</strong>
                <span>{selectedStation.address}</span>
              </div>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">Command & Administrative Desk:</strong>
                <span>{selectedStation.officerInCharge || 'Inspector In-Charge'}</span>
              </div>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">Official Landline / Control Room:</strong>
                <a
                  href={`tel:${selectedStation.officialPhone}`}
                  className="text-emerald-600 dark:text-emerald-400 font-mono hover:underline text-sm font-bold block mt-0.5"
                >
                  {selectedStation.officialPhone}
                </a>
              </div>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">National Emergency Hotline:</strong>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">999 (Immediate Dispatch)</span>
              </div>
              {selectedStation.email && (
                <div>
                  <strong className="block font-bold text-slate-900 dark:text-white">Official Dispatch Email:</strong>
                  <span className="font-mono">{selectedStation.email}</span>
                </div>
              )}
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">Patrol Jurisdiction:</strong>
                <span>{selectedStation.jurisdiction}</span>
              </div>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">Geographical Coordinates:</strong>
                <span className="font-mono">
                  {selectedStation.latitude}° N, {selectedStation.longitude}° E
                </span>
              </div>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Directory verified from DMP/District Police Gazette records: {selectedStation.lastVerifiedDate}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedStation.latitude},${selectedStation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Maps</span>
              </a>
              <a
                href={`tel:${selectedStation.officialPhone}`}
                className="flex items-center justify-center px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
              >
                Call Thana Desk Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

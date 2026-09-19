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
  const { theme, language } = useAppContext();
  const isLight = theme === 'light';

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
      <div
        className={`border rounded-2xl p-6 shadow-xl space-y-4 transition-colors ${
          isLight
            ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
            : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#004741] dark:text-[#E4FD97]" />
              <span>{language === 'bn' ? 'বাংলাদেশ পুলিশ থানা ডিরেক্টরি' : 'Bangladesh Police Stations (Thana) Directory'}</span>
            </h2>
            <p
              className={`text-xs mt-1 max-w-2xl leading-relaxed ${
                isLight ? 'text-[#004741]/80' : 'text-[#F0EDE4]/80'
              }`}
            >
              {language === 'bn'
                ? 'মেট্রোপলিটন ও জেলা পুলিশের ভেরিফায়েড ল্যান্ডলাইন, ডিউটি অফিসার ও জরুরি থানার যোগাযোগ তালিকা।'
                : 'Search verified Thana landlines, duty officer desks, and emergency jurisdictions across all metropolitan and district police units.'}
            </p>
          </div>

          <button
            onClick={handleLocateNearMe}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#E4FD97] hover:bg-[#d5f47d] text-[#004741] font-black text-xs shadow-md border border-[#004741]/20 transition-transform hover:scale-105 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#004741]" />
            <span>{language === 'bn' ? 'নিকটবর্তী থানা খুঁজুন' : 'Find Stations Near Me'}</span>
          </button>
        </div>

        {nearbyNotice && (
          <div
            className={`p-2.5 rounded-lg border text-xs flex items-center space-x-2 ${
              isLight
                ? 'bg-[#004741]/10 border-[#004741]/25 text-[#004741]'
                : 'bg-[#F0EDE4]/15 border-[#F0EDE4]/25 text-[#F0EDE4]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#004741] dark:text-[#E4FD97]" />
            <span>{nearbyNotice}</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-current/15">
          <div className="relative">
            <Search className="w-4 h-4 opacity-60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'ঢাকা, ধানমন্ডি, বাগেরহাট...' : 'e.g. Dhaka, Dhanmondi, Bagerhat...'}
              className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs border focus:outline-none ${
                isLight
                  ? 'bg-white border-[#004741]/30 text-[#004741] focus:border-[#004741]'
                  : 'bg-[#003833] border-[#F0EDE4]/30 text-[#F0EDE4] focus:border-[#F0EDE4]'
              }`}
            />
          </div>

          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDistrict('all');
            }}
            className={`rounded-xl px-3 py-2 text-xs border focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/30 text-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/30 text-[#F0EDE4]'
            }`}
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
            className={`rounded-xl px-3 py-2 text-xs border focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/30 text-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/30 text-[#F0EDE4]'
            }`}
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
            className={`border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all ${
              isLight
                ? 'bg-white hover:bg-[#FAF8F5] border-[#004741]/15 hover:border-[#004741] text-[#004741]'
                : 'bg-[#004741] hover:bg-[#003833] border-[#F0EDE4]/15 hover:border-[#F0EDE4] text-[#F0EDE4]'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isLight
                      ? 'bg-[#004741]/10 text-[#004741] border-[#004741]/20'
                      : 'bg-[#F0EDE4]/15 text-[#F0EDE4] border-[#F0EDE4]/25'
                  }`}
                >
                  {station.district} • {station.upazila}
                </span>
                <span className="flex items-center space-x-1 text-[10px] font-bold text-[#004741] dark:text-[#E4FD97]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E4FD97] border border-[#004741]/30" />
                  <span>Verified 2026</span>
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold leading-snug">{station.name}</h3>
                <h4
                  className={`text-xs font-semibold mt-0.5 ${
                    isLight ? 'text-[#004741]/80' : 'text-[#E4FD97]'
                  }`}
                >
                  {station.banglaName}
                </h4>
              </div>

              <p className="text-xs opacity-80 flex items-start space-x-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 opacity-60 shrink-0 mt-0.5" />
                <span>{station.address}</span>
              </p>

              <div
                className={`text-[11px] p-2.5 rounded-xl border ${
                  isLight
                    ? 'bg-[#FAF8F5] border-[#004741]/15'
                    : 'bg-[#003833] border-[#F0EDE4]/15'
                }`}
              >
                <strong>Jurisdiction:</strong> {station.jurisdiction}
              </div>
            </div>

            {/* Direct Call and Details Action */}
            <div className="pt-3 border-t border-current/15 flex items-center justify-between gap-2">
              <a
                href={`tel:${station.officialPhone}`}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-[#E4FD97] hover:bg-[#d5f47d] text-[#004741] text-xs font-black border border-[#004741]/20 transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#004741]" />
                <span>Call Thana Desk</span>
              </a>

              <button
                onClick={() => setSelectedStation(station)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-[#FAF8F5] hover:bg-[#004741]/10 text-[#004741] border-[#004741]/25'
                    : 'bg-[#003833] hover:bg-[#F0EDE4]/10 text-[#F0EDE4] border-[#F0EDE4]/25'
                }`}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Police Station Details Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className={`border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 ${
              isLight
                ? 'bg-[#FAF8F5] border-[#004741]/30 text-[#004741]'
                : 'bg-[#003833] border-[#F0EDE4]/30 text-[#F0EDE4]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-current/20">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#004741] dark:text-[#E4FD97]" />
                <h3 className="text-sm font-bold">{selectedStation.name}</h3>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="opacity-70 hover:opacity-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs opacity-90">
              <div>
                <strong className="block font-bold">Official Bangla Name:</strong>
                <span>{selectedStation.banglaName}</span>
              </div>
              <div>
                <strong className="block font-bold">Full Address:</strong>
                <span>{selectedStation.address}</span>
              </div>
              <div>
                <strong className="block font-bold">Command & Administrative Desk:</strong>
                <span>{selectedStation.officerInCharge || 'Inspector In-Charge'}</span>
              </div>
              <div>
                <strong className="block font-bold">Official Landline / Control Room:</strong>
                <a
                  href={`tel:${selectedStation.officialPhone}`}
                  className="text-[#004741] dark:text-[#E4FD97] font-mono hover:underline text-sm font-bold block mt-0.5"
                >
                  {selectedStation.officialPhone}
                </a>
              </div>
              <div>
                <strong className="block font-bold">National Emergency Hotline:</strong>
                <span className="font-mono font-bold text-[#004741] dark:text-[#E4FD97]">999 (Immediate Dispatch)</span>
              </div>
              {selectedStation.email && (
                <div>
                  <strong className="block font-bold">Official Dispatch Email:</strong>
                  <span className="font-mono">{selectedStation.email}</span>
                </div>
              )}
              <div>
                <strong className="block font-bold">Patrol Jurisdiction:</strong>
                <span>{selectedStation.jurisdiction}</span>
              </div>
              <div>
                <strong className="block font-bold">Geographical Coordinates:</strong>
                <span className="font-mono">
                  {selectedStation.latitude}° N, {selectedStation.longitude}° E
                </span>
              </div>
              <div className="text-[10px] opacity-70 pt-2 border-t border-current/15">
                Directory verified from DMP/District Police Gazette records: {selectedStation.lastVerifiedDate}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedStation.latitude},${selectedStation.longitude}`}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  isLight
                    ? 'bg-white hover:bg-gray-100 text-[#004741] border-[#004741]/30'
                    : 'bg-[#004741] hover:bg-[#004741]/80 text-[#F0EDE4] border-[#F0EDE4]/30'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Maps</span>
              </a>
              <a
                href={`tel:${selectedStation.officialPhone}`}
                className="px-5 py-2 rounded-xl bg-[#E4FD97] hover:bg-[#d5f47d] text-[#004741] font-black text-xs border border-[#004741]/30 shadow-sm"
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

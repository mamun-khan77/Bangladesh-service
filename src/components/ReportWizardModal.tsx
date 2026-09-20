import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ReportCategory, ReportSeverity, ReportPrivacy, ReportEvidence } from '../types';
import { DIVISIONS, DISTRICTS, UPAZILAS } from '../data/geoData';
import L from 'leaflet';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  File,
  Trash2,
  MapPin,
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle2,
  Copy,
  Crosshair
} from 'lucide-react';

const CATEGORIES_LIST: { id: ReportCategory; label: string; icon: string; desc: string }[] = [
  { id: 'road', label: 'Road & Bridge', icon: '🛣️', desc: 'Crater, collapsed bridge, hazardous potholes' },
  { id: 'drainage', label: 'Drainage & Waterlogging', icon: '🌊', desc: 'Blocked drains, monsoon flooding, open culvert' },
  { id: 'electricity', label: 'Electricity & Power', icon: '⚡', desc: 'Open transformer, dangling wires, load-shedding racket' },
  { id: 'waste_management', label: 'Waste Management', icon: '♻️', desc: 'Uncollected medical/municipal garbage, rotting dump' },
  { id: 'bribery', label: 'Bribery & Extortion', icon: '⚖️', desc: 'Speed money demands, extortion by intermediaries' },
  { id: 'corruption', label: 'Public Fund Corruption', icon: '🏛️', desc: 'Procurement fraud, kickbacks, ghost projects' },
  { id: 'public_service', label: 'Public Service Neglect', icon: '📋', desc: 'Absentee officials, harassment at government counters' },
  { id: 'police_related', label: 'Police Misconduct', icon: '👮', desc: 'Refusal to record GD/FIR, harassment or bribe demand' },
  { id: 'water', label: 'WASA & Drinking Water', icon: '🚰', desc: 'Contaminated brown water, chronic supply stoppage' },
  { id: 'gas', label: 'Gas Supply & Leakage', icon: '🔥', desc: 'Illegal gas taps, pipe leaks, zero cylinder pressure' },
  { id: 'environment', label: 'Environment & Pollution', icon: '🌳', desc: 'Toxic river effluent, illegal brick kilns, deforestation' },
  { id: 'healthcare', label: 'Healthcare & Hospital', icon: '🏥', desc: 'Emergency refusal, expired drugs, absent doctors' },
  { id: 'education', label: 'Education & Schools', icon: '🎓', desc: 'Dilapidated classroom roof, teacher absenteeism' },
  { id: 'government_office', label: 'Land & Government Office', icon: '🏢', desc: 'Namjari harassment, AC Land counter irregularities' },
  { id: 'public_safety', label: 'Public Safety & Crime', icon: '🚨', desc: 'Gang violence, eve-teasing blackspots, drug havens' },
  { id: 'infrastructure', label: 'Public Infrastructure', icon: '🏗️', desc: 'Sub-standard embankment, ferry ghat collapse' },
  { id: 'other', label: 'Other Civic Grievance', icon: '📌', desc: 'Any other critical citizen grievance' }
];

export const ReportWizardModal: React.FC = () => {
  const { isReportWizardOpen, setIsReportWizardOpen, addReport, user, theme } = useApp();

  const [step, setStep] = useState<number>(1);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  // Form States
  const [category, setCategory] = useState<ReportCategory>('road');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [organizationInvolved, setOrganizationInvolved] = useState<string>('');
  const [severity, setSeverity] = useState<ReportSeverity>('medium');

  // Location States
  const [division, setDivision] = useState<string>('Dhaka');
  const [district, setDistrict] = useState<string>('Dhaka');
  const [upazila, setUpazila] = useState<string>('Dhanmondi');
  const [addressDescription, setAddressDescription] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(23.7461);
  const [longitude, setLongitude] = useState<number>(90.3742);
  const [isApproximate, setIsApproximate] = useState<boolean>(false);

  // Evidence States
  const [evidenceList, setEvidenceList] = useState<ReportEvidence[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Privacy States
  const [privacy, setPrivacy] = useState<ReportPrivacy>('public');
  const [copiedId, setCopiedId] = useState(false);

  // Mini Map for Pinning Location
  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<L.Map | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close and reset
  const handleClose = () => {
    setIsReportWizardOpen(false);
    setTimeout(() => {
      setStep(1);
      setSubmittedReportId(null);
      setTitle('');
      setDescription('');
      setEvidenceList([]);
    }, 300);
  };

  // Init mini map in step 3
  useEffect(() => {
    if (step === 3 && miniMapContainerRef.current && !miniMapRef.current) {
      const map = L.map(miniMapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 13
      });

      const tileUrl =
        theme === 'light'
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-wizard-pin',
        html: `<div style="background-color: #059669; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const pin = L.marker([latitude, longitude], { draggable: true, icon: customIcon }).addTo(map);
      pin.on('dragend', (e) => {
        const marker = e.target;
        const pos = marker.getLatLng();
        setLatitude(Number(pos.lat.toFixed(5)));
        setLongitude(Number(pos.lng.toFixed(5)));
      });

      map.on('click', (e) => {
        pin.setLatLng(e.latlng);
        setLatitude(Number(e.latlng.lat.toFixed(5)));
        setLongitude(Number(e.latlng.lng.toFixed(5)));
      });

      pinMarkerRef.current = pin;
      miniMapRef.current = map;
    }

    if (step === 3 && miniMapRef.current) {
      setTimeout(() => {
        miniMapRef.current?.invalidateSize();
      }, 200);
    }
  }, [step, latitude, longitude, theme]);

  // Update pin if lat/lng change from dropdowns
  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const firstDist = DISTRICTS.find((d) => {
      const divObj = DIVISIONS.find((v) => v.name === newDiv);
      return divObj ? d.divisionId === divObj.id : false;
    });
    if (firstDist) {
      setDistrict(firstDist.name);
      setLatitude(firstDist.latitude);
      setLongitude(firstDist.longitude);
      miniMapRef.current?.setView([firstDist.latitude, firstDist.longitude], 12);
      pinMarkerRef.current?.setLatLng([firstDist.latitude, firstDist.longitude]);
    }
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const d = DISTRICTS.find((x) => x.name === newDist);
    if (d) {
      setLatitude(d.latitude);
      setLongitude(d.longitude);
      miniMapRef.current?.setView([d.latitude, d.longitude], 12);
      pinMarkerRef.current?.setLatLng([d.latitude, d.longitude]);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          setLatitude(lat);
          setLongitude(lng);
          miniMapRef.current?.setView([lat, lng], 14);
          pinMarkerRef.current?.setLatLng([lat, lng]);
        },
        () => {
          alert('Could not access GPS location. You can drag the map pin to set exact coordinates.');
        }
      );
    }
  };

  // Evidence file handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError(null);

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'audio/mpeg',
      'audio/mp4',
      'audio/x-m4a',
      'video/mp4'
    ];
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
        setUploadError(`File "${file.name}" has an unsupported format. Use JPG, PNG, PDF, or MP4.`);
        return;
      }

      if (file.size > maxSizeBytes) {
        setUploadError(`File "${file.name}" exceeds the 15MB limit.`);
        return;
      }

      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const fileType: ReportEvidence['fileType'] = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : file.type.startsWith('audio')
        ? 'audio'
        : file.type.includes('pdf')
        ? 'pdf'
        : 'document';

      const dummyUrl = URL.createObjectURL(file);

      const newEv: ReportEvidence = {
        id: `ev-${Date.now()}-${i}`,
        name: file.name,
        fileType,
        fileSize: sizeStr,
        url: dummyUrl,
        uploadedAt: new Date().toISOString()
      };

      setEvidenceList((prev) => [...prev, newEv]);
    }
  };

  const removeEvidence = (id: string) => {
    setEvidenceList((prev) => prev.filter((e) => e.id !== id));
  };

  // Submit report
  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and detailed description.');
      return;
    }

    const newId = addReport({
      title: title.trim(),
      description: description.trim(),
      category,
      severity,
      privacy,
      location: {
        division,
        district,
        upazila,
        unionOrArea: '',
        addressDescription: addressDescription.trim() || `${upazila}, ${district}`,
        latitude,
        longitude,
        isApproximate
      },
      organizationInvolved: organizationInvolved.trim() || undefined,
      evidence: evidenceList
    });

    setSubmittedReportId(newId);
    setStep(6);
  };

  const copyReportId = () => {
    if (submittedReportId) {
      navigator.clipboard.writeText(submittedReportId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  if (!isReportWizardOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      id="report-wizard-modal"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Submit Citizen Grievance & Issue Report
              </h2>
            </div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
              Step {step} of 5: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{['Category Selection', 'Issue Details & Severity', 'Location & Geotag', 'Evidence & Photos', 'Privacy & Consent'][step - 1] || 'Completed'}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar with high contrast */}
        {step <= 5 && (
          <div className="px-5 sm:px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs overflow-x-auto">
            {['Category', 'Details', 'Location', 'Evidence', 'Privacy'].map((name, idx) => {
              const isCurrent = step === idx + 1;
              const isPast = step > idx + 1;
              return (
                <div
                  key={name}
                  className={`flex items-center space-x-1.5 font-bold shrink-0 px-1 ${
                    isCurrent
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : isPast
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isPast
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-700'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <span className="hidden sm:inline">{name}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Body Content with slight tint background for high card contrast */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-5 bg-slate-50/70 dark:bg-slate-900/60">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Select Problem Category</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Choose the category that best describes the civic issue or corruption grievance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[48vh] overflow-y-auto pr-1">
                {CATEGORIES_LIST.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{cat.icon}</span>
                        <h4
                          className={`text-xs font-bold ${
                            isSelected
                              ? 'text-emerald-900 dark:text-emerald-200'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {cat.label}
                        </h4>
                      </div>
                      <p
                        className={`text-[11px] mt-1.5 line-clamp-2 leading-relaxed ${
                          isSelected
                            ? 'text-emerald-800 dark:text-emerald-300 font-medium'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {cat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: ISSUE DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Describe the Issue</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Provide factual, neutral statements detailing the date, observed impact, and urgency.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Report Title <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Submerged culvert causing sinkhole risk near Asad Gate junction"
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    Detailed Description <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="State the problem clearly. Mention duration, safety hazards to pedestrians/vehicles, demands made if applicable..."
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                      Severity & Urgency Level
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                    >
                      <option value="low">Low - Minor nuisance</option>
                      <option value="medium">Medium - Disruption to daily routine</option>
                      <option value="high">High - Safety risk or repeated extortion</option>
                      <option value="critical">Critical - Immediate hazard to human life</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                      Organization / Dept Involved (Optional)
                    </label>
                    <input
                      type="text"
                      value={organizationInvolved}
                      onChange={(e) => setOrganizationInvolved(e.target.value)}
                      placeholder="e.g. DSCC Zone 2 / WASA / Local Land Registry"
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800/80 text-xs text-amber-950 dark:text-amber-200 flex items-start space-x-2.5 shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Neutrality Guideline:</strong> State observable facts. Avoid defamatory language, unverified personal attacks, or private home addresses.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & MAP PIN */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Location & Geotag</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Pin the location on the map or select the administrative division, district, and upazila.
                </p>
              </div>

              {/* Administrative Selectors with crisp borders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">Division</label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-600 shadow-xs"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.banglaName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">District</label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-600 shadow-xs"
                  >
                    {DISTRICTS.filter((d) => {
                      const divObj = DIVISIONS.find((v) => v.name === division);
                      return divObj ? d.divisionId === divObj.id : true;
                    }).map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">Upazila / Thana</label>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-600 shadow-xs"
                  >
                    {(() => {
                      const distObj = DISTRICTS.find((d) => d.name === district);
                      const matchingUpazilas = distObj ? UPAZILAS.filter((u) => u.districtId === distObj.id) : [];
                      if (matchingUpazilas.length > 0) {
                        return matchingUpazilas.map((u) => (
                          <option key={u.id} value={u.name}>
                            {u.name} ({u.banglaName})
                          </option>
                        ));
                      }
                      return <option value={upazila}>{upazila || 'Sadar'}</option>;
                    })()}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  Specific Street / Area / Landmark
                </label>
                <input
                  type="text"
                  value={addressDescription}
                  onChange={(e) => setAddressDescription(e.target.value)}
                  placeholder="e.g. Near Mirpur 10 roundabout, opposite fire station"
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
              </div>

              {/* Interactive Mini Map */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    Pinpoint on Map (Click or Drag Marker)
                  </span>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer font-bold"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Locate My GPS</span>
                  </button>
                </div>

                <div
                  ref={miniMapContainerRef}
                  className="w-full h-48 rounded-2xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs"
                />

                <div className="text-xs text-slate-700 dark:text-slate-300 font-mono font-semibold flex items-center space-x-3 pt-1">
                  <span>Lat: {latitude}</span>
                  <span>Long: {longitude}</span>
                </div>
              </div>

              {/* Privacy Location Guard */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-start space-x-3 shadow-xs">
                <input
                  type="checkbox"
                  id="approx-loc-toggle"
                  checked={isApproximate}
                  onChange={(e) => setIsApproximate(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="approx-loc-toggle" className="text-xs cursor-pointer">
                  <strong className="text-slate-900 dark:text-white block font-bold">
                    Use approximate location radius on public map (Whistleblower Protection)
                  </strong>
                  <span className="text-slate-600 dark:text-slate-300 text-[11px] font-medium leading-relaxed block mt-0.5">
                    If enabled, the public map will only display a generalized 1km area radius. Exact GPS pin will only be revealed to verified authorities.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: EVIDENCE UPLOAD */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Upload Supporting Evidence</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Substantiate your report with photos, documents, invoices, or audio/video recordings.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-400 dark:border-slate-600 hover:border-emerald-600 rounded-2xl p-6 text-center cursor-pointer bg-white dark:bg-slate-800/90 hover:bg-emerald-50/40 dark:hover:bg-slate-800 transition-all shadow-xs"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,application/pdf,audio/*,video/*"
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Click to browse or drag and drop files here
                </div>
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                  Supports JPG, PNG, PDF, Audio notes, MP4 (Max 15MB per file)
                </div>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 font-bold">
                  {uploadError}
                </div>
              )}

              {/* Attached files list */}
              {evidenceList.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Attached Files ({evidenceList.length})
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {evidenceList.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs shadow-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <File className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white truncate">{ev.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium shrink-0">
                            ({ev.fileSize})
                          </span>
                        </div>
                        <button
                          onClick={() => removeEvidence(ev.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 shadow-xs">
                <strong className="text-slate-900 dark:text-white font-bold">Anti-False Report Verification:</strong>{' '}
                All uploaded files undergo automated MIME integrity checks. Metadata (EXIF timestamp) is cross-checked during moderator review.
              </div>
            </div>
          )}

          {/* STEP 5: PRIVACY SETTINGS */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Privacy & Submission Mode</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Control how your name and report visibility are treated across the public ledger.
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setPrivacy('public')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    privacy === 'public'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center space-x-2 font-bold text-xs ${
                        privacy === 'public'
                          ? 'text-emerald-900 dark:text-emerald-200'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Public Verified Report</span>
                    </div>
                    {privacy === 'public' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </div>
                  <p
                    className={`text-[11px] mt-1.5 leading-relaxed ${
                      privacy === 'public'
                        ? 'text-emerald-800 dark:text-emerald-300 font-medium'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Visible on the public map and report feed. Your name will be displayed as "{user.name}". Your phone number and private email are <strong>never</strong> shown publicly.
                  </p>
                </div>

                <div
                  onClick={() => setPrivacy('anonymous_public')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    privacy === 'anonymous_public'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center space-x-2 font-bold text-xs ${
                        privacy === 'anonymous_public'
                          ? 'text-emerald-900 dark:text-emerald-200'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span>Anonymous Public Report (Whistleblower)</span>
                    </div>
                    {privacy === 'anonymous_public' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <p
                    className={`text-[11px] mt-1.5 leading-relaxed ${
                      privacy === 'anonymous_public'
                        ? 'text-emerald-800 dark:text-emerald-300 font-medium'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    The report appears on the public map, but your name is displayed strictly as "Anonymous Citizen". Recommended for sensitive bribery or corruption reports.
                  </p>
                </div>

                <div
                  onClick={() => setPrivacy('private_authority')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    privacy === 'private_authority'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center space-x-2 font-bold text-xs ${
                        privacy === 'private_authority'
                          ? 'text-emerald-900 dark:text-emerald-200'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      <Lock className="w-4 h-4 text-indigo-500" />
                      <span>Confidential Direct Authority Submission</span>
                    </div>
                    {privacy === 'private_authority' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <p
                    className={`text-[11px] mt-1.5 leading-relaxed ${
                      privacy === 'private_authority'
                        ? 'text-emerald-800 dark:text-emerald-300 font-medium'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Report is not visible on the public map. Only accessible by authorized DC, Police SP, and Anti-Corruption review officers.
                  </p>
                </div>
              </div>

              {/* Review summary preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs space-y-2 shadow-xs">
                <div className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  Submission Summary
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong className="text-slate-900 dark:text-white">Title:</strong> {title || '(No title provided)'}
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong className="text-slate-900 dark:text-white">Location:</strong> {upazila}, {district}, {division}
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong className="text-slate-900 dark:text-white">Category:</strong> {category.toUpperCase()} •{' '}
                  <strong className="text-slate-900 dark:text-white">Severity:</strong> {severity.toUpperCase()}
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong className="text-slate-900 dark:text-white">Evidence:</strong> {evidenceList.length} attachment(s)
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SUBMISSION CONFIRMATION RECEIPT */}
          {step === 6 && submittedReportId && (
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-400 dark:border-emerald-700 flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-400 shadow-xs">
                <Check className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Report Lodged Successfully</h3>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                  Your civic issue has been securely registered into the Bangladesh Civic Watch ledger. Keep your tracking ID for status verification.
                </p>
              </div>

              {/* Tracking ID Badge */}
              <div className="inline-flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-xs">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono font-bold">
                    Official Report ID
                  </div>
                  <div className="text-lg font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                    {submittedReportId}
                  </div>
                </div>
                <button
                  onClick={copyReportId}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Copy Tracking ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-left text-xs text-slate-700 dark:text-slate-300 space-y-2 max-w-md mx-auto shadow-xs">
                <div className="font-extrabold text-slate-900 dark:text-white">What Happens Next?</div>
                <div className="flex items-start space-x-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">1.</span>
                  <span>Moderator review checks photo geo-tags and validity within 24 hours.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">2.</span>
                  <span>Forwarded to the appropriate municipality, police thana, or DC office.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">3.</span>
                  <span>You will receive an in-app notification when an official response is published.</span>
                </div>
              </div>

              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Done / View Reports
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step <= 5 && (
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && (!title.trim() || !description.trim())) {
                    alert('Please provide both title and description before proceeding.');
                    return;
                  }
                  setStep((s) => s + 1);
                }}
                className="flex items-center space-x-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Submit Report to Ledger</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
  ShieldCheck,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle2,
  Copy,
  Download
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
  const [unionOrArea, setUnionOrArea] = useState<string>('');
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

      const pin = L.marker([latitude, longitude], { draggable: true }).addTo(map);
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
  }, [step, latitude, longitude]);

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
      status: 'submitted',
      privacy,
      location: {
        division,
        district,
        upazila,
        unionOrArea: unionOrArea.trim() || 'General Area',
        addressDescription: addressDescription.trim() || `${upazila}, ${district}`,
        latitude,
        longitude,
        isApproximate
      },
      organizationInvolved: organizationInvolved.trim() || undefined,
      reporterId: privacy === 'anonymous_public' ? undefined : user.id,
      reporterName: privacy === 'anonymous_public' ? 'Anonymous Citizen' : user.name,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      id="report-wizard-modal"
    >
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2BEE34]" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Submit Citizen Grievance & Issue Report
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Step {step} of 5 • Structured evidence & location submission
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        {step <= 5 && (
          <div className="px-6 pt-3 pb-1 bg-zinc-900 border-b border-zinc-800/80 flex items-center justify-between text-xs">
            {['Category', 'Details', 'Location', 'Evidence', 'Privacy'].map((name, idx) => (
              <div
                key={name}
                className={`flex items-center space-x-1.5 font-semibold ${
                  step === idx + 1
                    ? 'text-[#2BEE34]'
                    : step > idx + 1
                    ? 'text-zinc-300'
                    : 'text-zinc-600'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step === idx + 1
                      ? 'bg-[#2BEE34] text-zinc-950'
                      : step > idx + 1
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {step > idx + 1 ? '✓' : idx + 1}
                </span>
                <span className="hidden sm:inline">{name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Select Problem Category</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Choose the category that best describes the civic issue or corruption grievance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {CATEGORIES_LIST.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      category === cat.id
                        ? 'bg-[#2BEE34]/10 border-[#2BEE34] shadow-md shadow-[#2BEE34]/10'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{cat.icon}</span>
                      <h4 className="text-xs font-bold text-white">{cat.label}</h4>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-tight">
                      {cat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ISSUE DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Describe the Issue</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Provide factual, neutral statements detailing the date, observed impact, and urgency.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Report Title <span className="text-[#FF4103]">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Submerged culvert causing sinkhole risk near Asad Gate junction"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#2BEE34]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Detailed Description <span className="text-[#FF4103]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="State the problem clearly. Mention duration, safety hazards to pedestrians/vehicles, demands made if applicable, and historical negligence..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#2BEE34]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Severity & Urgency Level
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2BEE34]"
                    >
                      <option value="low">Low - Minor nuisance</option>
                      <option value="medium">Medium - Disruption to daily routine</option>
                      <option value="high">High - Safety risk or repeated extortion</option>
                      <option value="critical">Critical - Immediate hazard to human life</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Organization / Dept Involved (Optional)
                    </label>
                    <input
                      type="text"
                      value={organizationInvolved}
                      onChange={(e) => setOrganizationInvolved(e.target.value)}
                      placeholder="e.g. DSCC Zone 2 / WASA / Local Land Registry"
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#2BEE34]"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Neutrality Guideline:</strong> State observable facts. Avoid defamatory language, unverified personal attacks, or doxxing private home addresses.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & MAP PIN */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Location & Geotag</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Pin the location on the map or select the administrative division, district, and upazila.
                </p>
              </div>

              {/* Administrative Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Division</label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2BEE34]"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.banglaName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2BEE34]"
                  >
                    {DISTRICTS.filter((d) => {
                      const divObj = DIVISIONS.find((v) => v.name === division);
                      return divObj ? d.divisionId === divObj.id : true;
                    }).map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.banglaName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Upazila / Thana</label>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2BEE34]"
                  >
                    {UPAZILAS.filter((u) => {
                      const distObj = DISTRICTS.find((dt) => dt.name === district);
                      return distObj ? u.districtId === distObj.id : true;
                    }).map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.banglaName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Street / Landmark Description
                </label>
                <input
                  type="text"
                  value={addressDescription}
                  onChange={(e) => setAddressDescription(e.target.value)}
                  placeholder="e.g. Near Kalabagan Bus Stand, opposite Sonali Bank branch"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#2BEE34]"
                />
              </div>

              {/* Mini Map Canvas */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2BEE34]" />
                    <span>Drag pin or click map to set exact coordinates:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="text-[11px] font-bold text-[#2BEE34] hover:underline"
                  >
                    Use GPS Location
                  </button>
                </div>

                <div
                  ref={miniMapContainerRef}
                  className="w-full h-52 rounded-xl border border-zinc-700 overflow-hidden bg-zinc-950"
                />

                <div className="text-[11px] text-zinc-400 font-mono flex items-center space-x-3 pt-1">
                  <span>Lat: {latitude}</span>
                  <span>Long: {longitude}</span>
                </div>
              </div>

              {/* Privacy Location Guard */}
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="approx-loc-toggle"
                  checked={isApproximate}
                  onChange={(e) => setIsApproximate(e.target.checked)}
                  className="mt-1 rounded bg-zinc-900 border-zinc-700 text-[#2BEE34] focus:ring-[#2BEE34]"
                />
                <label htmlFor="approx-loc-toggle" className="text-xs cursor-pointer">
                  <strong className="text-white block">
                    Use approximate location radius on public map (Whistleblower Protection)
                  </strong>
                  <span className="text-zinc-400 text-[11px]">
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
                <h3 className="text-sm font-bold text-white">Upload Supporting Evidence</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Substantiate your report with photos, documents, invoices, or audio/video recordings.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-[#2BEE34] rounded-2xl p-6 text-center cursor-pointer bg-zinc-950/60 hover:bg-zinc-950 transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,application/pdf,audio/*,video/*"
                  className="hidden"
                />
                <UploadCloud className="w-8 h-8 text-[#2BEE34] mx-auto mb-2" />
                <div className="text-xs font-bold text-white">
                  Click to browse or drag and drop files here
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Supports JPG, PNG, PDF, Audio notes, MP4 (Max 15MB per file)
                </div>
              </div>

              {uploadError && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300">
                  {uploadError}
                </div>
              )}

              {/* Attached files list */}
              {evidenceList.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-300">
                    Attached Files ({evidenceList.length})
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {evidenceList.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <File className="w-4 h-4 text-[#2BEE34] shrink-0" />
                          <span className="font-medium text-white truncate">{ev.name}</span>
                          <span className="text-[10px] text-zinc-500 shrink-0">({ev.fileSize})</span>
                        </div>
                        <button
                          onClick={() => removeEvidence(ev.id)}
                          className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400">
                <strong className="text-zinc-200">Anti-False Report Verification:</strong> All uploaded files undergo automated MIME integrity checks. Metadata (EXIF timestamp) is cross-checked during moderator review.
              </div>
            </div>
          )}

          {/* STEP 5: PRIVACY SETTINGS */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Privacy & Submission Mode</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Control how your name and report visibility are treated across the public ledger.
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setPrivacy('public')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    privacy === 'public'
                      ? 'bg-[#2BEE34]/10 border-[#2BEE34]'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-bold text-xs text-white">
                      <Eye className="w-4 h-4 text-[#2BEE34]" />
                      <span>Public Verified Report</span>
                    </div>
                    {privacy === 'public' && <CheckCircle2 className="w-4 h-4 text-[#2BEE34]" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Visible on the public map and report feed. Your name will be displayed as "{user.name}". Your phone number and private email are <strong>never</strong> shown publicly.
                  </p>
                </div>

                <div
                  onClick={() => setPrivacy('anonymous_public')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    privacy === 'anonymous_public'
                      ? 'bg-[#2BEE34]/10 border-[#2BEE34]'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-bold text-xs text-white">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Anonymous Public Report (Whistleblower)</span>
                    </div>
                    {privacy === 'anonymous_public' && <CheckCircle2 className="w-4 h-4 text-[#2BEE34]" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    The report appears on the public map, but your name is displayed strictly as "Anonymous Citizen". Recommended for sensitive bribery or corruption reports.
                  </p>
                </div>

                <div
                  onClick={() => setPrivacy('private_authority')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    privacy === 'private_authority'
                      ? 'bg-[#2BEE34]/10 border-[#2BEE34]'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-bold text-xs text-white">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <span>Confidential Direct Authority Submission</span>
                    </div>
                    {privacy === 'private_authority' && <CheckCircle2 className="w-4 h-4 text-[#2BEE34]" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Report is not visible on the public map. Only accessible by authorized DC, Police SP, and Anti-Corruption review officers.
                  </p>
                </div>
              </div>

              {/* Review summary preview */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1.5">
                <div className="font-bold text-white text-[11px] uppercase tracking-wider">
                  Submission Summary
                </div>
                <div className="text-zinc-300">
                  <strong>Title:</strong> {title || '(No title provided)'}
                </div>
                <div className="text-zinc-300">
                  <strong>Location:</strong> {upazila}, {district}, {division}
                </div>
                <div className="text-zinc-300">
                  <strong>Category:</strong> {category.toUpperCase()} • <strong>Severity:</strong> {severity.toUpperCase()}
                </div>
                <div className="text-zinc-300">
                  <strong>Evidence:</strong> {evidenceList.length} attachment(s)
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SUBMISSION CONFIRMATION RECEIPT */}
          {step === 6 && submittedReportId && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#2BEE34]/20 border border-[#2BEE34]/40 flex items-center justify-center mx-auto text-[#2BEE34]">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white">Report Lodged Successfully</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Your civic issue has been securely registered into the Bangladesh Civic Watch ledger. Keep your tracking ID for status verification.
                </p>
              </div>

              {/* Tracking ID Badge */}
              <div className="inline-flex items-center space-x-3 px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-700">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                    Official Report ID
                  </div>
                  <div className="text-lg font-mono font-bold text-[#2BEE34]">
                    {submittedReportId}
                  </div>
                </div>
                <button
                  onClick={copyReportId}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Copy Tracking ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-[#2BEE34]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-left text-xs text-zinc-400 space-y-2 max-w-md mx-auto">
                <div className="font-semibold text-white">What Happens Next?</div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#2BEE34]">1.</span>
                  <span>Moderator review checks photo geo-tags and validity within 24 hours.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#2BEE34]">2.</span>
                  <span>Forwarded to the appropriate municipality, police thana, or DC office.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#2BEE34]">3.</span>
                  <span>You will receive an in-app notification when an official response is published.</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-[#2BEE34] hover:bg-[#25d32d] text-zinc-950 font-bold text-xs shadow-lg transition-colors"
                >
                  Done / View Reports
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step <= 5 && (
          <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
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
                className="flex items-center space-x-1 px-5 py-2 rounded-xl bg-[#2BEE34] hover:bg-[#25d32d] text-zinc-950 text-xs font-bold transition-all shadow-md"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center space-x-1.5 px-6 py-2 rounded-xl bg-[#2BEE34] hover:bg-[#25d32d] text-zinc-950 text-xs font-bold transition-all shadow-lg shadow-[#2BEE34]/20 hover:scale-[1.02]"
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

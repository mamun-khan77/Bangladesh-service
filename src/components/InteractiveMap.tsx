import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { DIVISIONS, DISTRICTS } from '../data/geoData';
import { CivicReport, ReportSeverity, ReportStatus } from '../types';
import {
  Layers,
  Filter,
  MapPin,
  Compass,
  AlertCircle,
  RefreshCw,
  Search,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const {
    reports,
    selectedReport,
    setSelectedReport,
    selectedDivision,
    setSelectedDivision,
    selectedDistrict,
    setSelectedDistrict,
    selectedCategory,
    setSelectedCategory,
    theme,
    language
  } = useApp();

  const isLight = theme === 'light';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Map Filter States
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'markers' | 'cluster' | 'heatmap'>('markers');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(false);

  // Filtered districts according to selected division
  const availableDistricts =
    selectedDivision === 'all'
      ? DISTRICTS
      : DISTRICTS.filter((d) => {
          const div = DIVISIONS.find((v) => v.name === selectedDivision);
          return div ? d.divisionId === div.id : false;
        });

  // Filter reports
  const filteredReports = reports.filter((r) => {
    if (selectedDivision !== 'all' && r.location.division !== selectedDivision) return false;
    if (selectedDistrict !== 'all' && r.location.district !== selectedDistrict) return false;
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && r.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    return true;
  });

  // Pin colors using standard modern civic palette
  const getMarkerPinColor = (status: ReportStatus, severity: ReportSeverity) => {
    if (status === 'resolved') {
      return { bg: '#10b981', border: '#ffffff', dot: '#ffffff' }; // Emerald
    }
    if (severity === 'critical') {
      return { bg: '#f43f5e', border: '#ffffff', dot: '#ffffff' }; // Rose Red
    }
    if (severity === 'high') {
      return { bg: '#f59e0b', border: '#ffffff', dot: '#ffffff' }; // Amber
    }
    if (status === 'action_taken' || status === 'verified') {
      return { bg: '#06b6d4', border: '#ffffff', dot: '#ffffff' }; // Cyan
    }
    return { bg: '#6366f1', border: '#ffffff', dot: '#ffffff' }; // Indigo
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Bangladesh Center Coordinates
    const map = L.map(mapContainerRef.current, {
      center: [23.8103, 90.4125],
      zoom: 7,
      minZoom: 6,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true
    });

    const tileUrl = isLight
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png';

    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

    const tiles = L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);

    tileLayerRef.current = tiles;
    const markers = L.layerGroup().addTo(map);
    markersLayerRef.current = markers;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size on fullscreen toggle, mobile filter drawer toggle, or orientation changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [isFullscreen, isMobileFiltersOpen]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Update Tiles on theme toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileUrl = isLight
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [isLight]);

  // Center on Division or District selection
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedDistrict !== 'all') {
      const dist = DISTRICTS.find((d) => d.name === selectedDistrict);
      if (dist) {
        mapInstanceRef.current.flyTo([dist.latitude, dist.longitude], 11, { duration: 1.2 });
      }
    } else if (selectedDivision !== 'all') {
      const div = DIVISIONS.find((d) => d.name === selectedDivision);
      if (div) {
        mapInstanceRef.current.flyTo([div.latitude, div.longitude], 9, { duration: 1.2 });
      }
    }
  }, [selectedDivision, selectedDistrict]);

  // Render Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    if (viewMode === 'markers') {
      filteredReports.forEach((report) => {
        const pin = getMarkerPinColor(report.status, report.severity);
        const isPulse = report.severity === 'critical';

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              ${
                isPulse
                  ? `<span style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #f43f5e; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
                  : ''
              }
              <div style="width: 24px; height: 24px; border-radius: 50%; background: ${pin.bg}; border: 2.5px solid ${pin.border}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.35); cursor: pointer;">
                <div style="width: 6px; height: 6px; border-radius: 50%; background: ${pin.dot};"></div>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        const marker = L.marker([report.location.latitude, report.location.longitude], {
          icon: customIcon
        });

        const statusLabel = report.status.replace(/_/g, ' ').toUpperCase();
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3.5 min-w-[240px] max-w-[280px] text-left';
        popupContent.style.backgroundColor = isLight ? '#ffffff' : '#0f172a';
        popupContent.style.color = isLight ? '#0f172a' : '#f8fafc';
        popupContent.style.borderRadius = '12px';

        popupContent.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-family: monospace; opacity: 0.75; padding-bottom: 6px; border-bottom: 1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};">
            <span>#${report.id}</span>
            <span style="padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 9px; background: ${pin.bg}22; color: ${pin.bg}; border: 1px solid ${pin.bg}44;">
              ${statusLabel}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: bold; margin-top: 6px; line-height: 1.3;">${report.title}</h4>
          <p style="font-size: 11px; margin-top: 4px; opacity: 0.8; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${report.description}</p>
          <div style="margin-top: 8px; font-size: 10px; opacity: 0.8; display: flex; align-items: center; justify-content: space-between;">
            <span>📍 ${report.location.upazila}, ${report.location.district}</span>
            ${report.location.isApproximate ? '<span>(Approx. Area)</span>' : ''}
          </div>
          <button id="btn-view-rep-${report.id}" style="width: 100%; margin-top: 10px; padding: 7px 10px; border-radius: 8px; background: #059669; color: #ffffff; font-weight: bold; font-size: 11px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>View Full Case Details</span>
            <span>→</span>
          </button>
        `;

        popupContent.querySelector(`#btn-view-rep-${report.id}`)?.addEventListener('click', () => {
          setSelectedReport(report);
        });

        marker.bindPopup(popupContent);
        markersLayerRef.current?.addLayer(marker);
      });
    } else if (viewMode === 'cluster' || viewMode === 'heatmap') {
      filteredReports.forEach((report) => {
        const radius = viewMode === 'heatmap' ? 4500 : 2500;
        const opacity = viewMode === 'heatmap' ? 0.35 : 0.6;
        const color = report.severity === 'critical' ? '#f43f5e' : '#10b981';

        const circle = L.circle([report.location.latitude, report.location.longitude], {
          color: color,
          fillColor: color,
          fillOpacity: opacity,
          radius: radius,
          weight: 1.5
        });

        circle.bindTooltip(
          `<div><strong>${report.category.toUpperCase()}</strong>: ${report.location.district}</div>`,
          { className: isLight ? 'bg-white text-slate-900 font-sans shadow-md' : 'bg-slate-900 text-white font-sans shadow-md' }
        );

        circle.on('click', () => {
          setSelectedReport(report);
        });

        markersLayerRef.current?.addLayer(circle);
      });
    }
  }, [filteredReports, viewMode, isLight]);

  // Center on User Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.5 });
          const userCircle = L.circleMarker([lat, lng], {
            radius: 8,
            color: '#10b981',
            fillColor: '#34d399',
            fillOpacity: 0.9,
            weight: 3
          }).addTo(mapInstanceRef.current);
          userCircle.bindPopup('<b>Your Approximate Location</b>').openPopup();
        }
      },
      () => {
        alert('Could not retrieve your location. Showing central Dhaka.');
        mapInstanceRef.current?.flyTo([23.8103, 90.4125], 11);
      }
    );
  };

  const resetAllFilters = () => {
    setSelectedDivision('all');
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
  };

  const activeFilterCount =
    (selectedDivision !== 'all' ? 1 : 0) +
    (selectedDistrict !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSeverity !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0);

  return (
    <div
      className={`border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 sm:inset-2 z-50 rounded-none sm:rounded-2xl' : 'relative w-full rounded-3xl'
      }`}
      id="geospatial-incident-map"
    >
      {/* Top Map Header & Controls */}
      <div className="p-3.5 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-900 dark:text-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              {language === 'bn' ? 'জাতীয় ভূ-স্থানিক অভিযোগ মানচিত্র' : 'National Geospatial Grievance Map'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'bn'
              ? `বর্তমানে সক্রিয় ${filteredReports.length}টি ঘটনা প্রদর্শিত হচ্ছে (৬৪ জেলা)`
              : `Rendering ${filteredReports.length} geo-authenticated civic reports across Bangladesh`}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="sm:hidden flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-500" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            {isMobileFiltersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center space-x-1.5">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <button
                onClick={() => setViewMode('markers')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'markers'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Pins
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'heatmap'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Heatmap
              </button>
            </div>

            {/* Locate Me */}
            <button
              onClick={handleLocateMe}
              title="Locate around my position"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Selection Strip (Responsive: Desktop strip, Mobile collapsible) */}
      <div
        className={`p-3.5 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900 ${
          isMobileFiltersOpen ? 'block' : 'hidden sm:block'
        }`}
      >
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Division Selector */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Division
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDistrict('all');
              }}
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="all">All Divisions (8)</option>
              {DIVISIONS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="all">All Districts ({availableDistricts.length})</option>
              {availableDistricts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="road">Road & Bridge</option>
              <option value="drainage">Drainage & Flooding</option>
              <option value="electricity">Electricity & Power</option>
              <option value="waste_management">Waste & Garbage</option>
              <option value="bribery">Bribery & Extortion</option>
              <option value="corruption">Public Corruption</option>
              <option value="public_service">Public Service</option>
              <option value="water">WASA & Water</option>
              <option value="healthcare">Healthcare</option>
              <option value="police_related">Police Misconduct</option>
            </select>
          </div>

          {/* Severity Selector */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Hazard (Immediate)</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="forwarded_to_authority">Forwarded</option>
              <option value="action_taken">Action Taken</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={resetAllFilters}
              className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className={`relative w-full flex-1 ${isFullscreen ? 'h-[calc(100vh-140px)] sm:h-[calc(100vh-130px)]' : 'min-h-[380px] sm:min-h-[520px]'}`}>
        <div ref={mapContainerRef} className="w-full h-full min-h-[380px] sm:min-h-[520px]" />

        {/* Interactive Legend Overlay (Collapsible on mobile) */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-[400] rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg text-[11px] text-slate-800 dark:text-slate-200 max-w-[260px] sm:max-w-none overflow-hidden transition-all">
          <button
            onClick={() => setIsLegendExpanded(!isLegendExpanded)}
            className="w-full px-3 py-1.5 sm:py-2 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer bg-slate-50 dark:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Map Legend</span>
            </span>
            <span className="text-slate-400 sm:hidden">
              {isLegendExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </span>
          </button>
          
          <div className={`${isLegendExpanded ? 'block' : 'hidden sm:block'} p-3 space-y-1.5 border-t border-slate-100 dark:border-slate-800`}>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-900 animate-ping" />
              <span className="font-bold text-rose-600 dark:text-rose-400">Critical Hazard (Pulsing)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Action Taken / Dispatched</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Resolved Case</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

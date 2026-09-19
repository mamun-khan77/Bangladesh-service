import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { CivicReport, ReportCategory, ReportSeverity } from '../types';
import { DIVISIONS, DISTRICTS } from '../data/geoData';
import {
  MapPin,
  Layers,
  Filter,
  RefreshCw,
  Maximize2,
  Minimize2,
  AlertCircle,
  Eye,
  CheckCircle2,
  Info
} from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const {
    reports,
    setSelectedReport,
    setIsReportWizardOpen,
    selectedDivision,
    setSelectedDivision,
    selectedDistrict,
    setSelectedDistrict,
    selectedCategory,
    setSelectedCategory,
    theme
  } = useApp();

  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [viewMode, setViewMode] = useState<'markers' | 'cluster' | 'heatmap'>('markers');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeReportCount, setActiveReportCount] = useState(reports.length);

  const isLight = theme === 'light';
  const primaryColor = isLight ? '#004741' : '#F0EDE4';
  const secondaryColor = isLight ? '#F0EDE4' : '#004741';

  // Filter reports according to state
  const filteredReports = reports.filter((r) => {
    if (selectedDivision !== 'all' && r.location.division !== selectedDivision) return false;
    if (selectedDistrict !== 'all' && r.location.district !== selectedDistrict) return false;
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && r.severity !== selectedSeverity) return false;
    return true;
  });

  useEffect(() => {
    setActiveReportCount(filteredReports.length);
  }, [filteredReports.length]);

  // Marker colors with lime (#E4FD97) for critical alerts
  const getMarkerPinColor = (status: string, severity: string) => {
    if (severity === 'critical') {
      return {
        bg: '#E4FD97',
        border: '#004741',
        dot: '#004741',
        pulseBg: '#E4FD97',
        pulse: true
      };
    }
    if (status === 'resolved') {
      return {
        bg: primaryColor,
        border: secondaryColor,
        dot: secondaryColor,
        pulseBg: 'transparent',
        pulse: false
      };
    }
    return {
      bg: isLight ? '#004741' : '#F0EDE4',
      border: isLight ? '#F0EDE4' : '#004741',
      dot: isLight ? '#F0EDE4' : '#004741',
      pulseBg: isLight ? '#004741' : '#F0EDE4',
      pulse: true
    };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Bangladesh
      const map = L.map(mapContainerRef.current, {
        center: [23.8103, 90.4125],
        zoom: 7,
        minZoom: 6,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: false
      });

      // Strict high-contrast map tiles
      const tileUrl = isLight
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      tileLayerRef.current = tiles;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance alive or clean up
    };
  }, []);

  // Update tiles when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileUrl = isLight
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [isLight]);

  // Handle Division/District flyTo
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

  // Render Markers / Heatmap circles
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    if (viewMode === 'markers') {
      filteredReports.forEach((report) => {
        const pin = getMarkerPinColor(report.status, report.severity);
        const isPulse = report.severity === 'critical';

        // Custom HTML DivIcon with lime for critical alerts
        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              ${
                isPulse
                  ? `<span style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: #E4FD97; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
                  : ''
              }
              <div style="width: 22px; height: 22px; border-radius: 50%; background: ${pin.bg}; border: 2px solid ${pin.border}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,35,32,0.5); cursor: pointer;">
                <div style="width: 7px; height: 7px; border-radius: 50%; background: ${pin.dot};"></div>
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

        // Interactive popup strictly adhering to #004741 and #F0EDE4
        const statusLabel = report.status.replace(/_/g, ' ').toUpperCase();
        const popupContent = document.createElement('div');
        popupContent.className = 'p-3.5 min-w-[240px] max-w-[280px]';
        popupContent.style.backgroundColor = isLight ? '#FAF8F5' : '#003a35';
        popupContent.style.color = isLight ? '#004741' : '#F0EDE4';
        popupContent.style.borderRadius = '12px';

        popupContent.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-family: monospace; opacity: 0.8; padding-bottom: 6px; border-bottom: 1px solid ${isLight ? 'rgba(0,71,65,0.2)' : 'rgba(240,237,228,0.2)'};">
            <span>#${report.id}</span>
            <span style="padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 9px; border: 1px solid ${isLight ? 'rgba(0,71,65,0.3)' : 'rgba(240,237,228,0.3)'};">
              ${statusLabel}
            </span>
          </div>
          <h4 style="font-size: 12px; font-weight: bold; margin-top: 6px; line-height: 1.3;">${report.title}</h4>
          <p style="font-size: 11px; margin-top: 4px; opacity: 0.8; line-height: 1.4;">${report.description}</p>
          <div style="margin-top: 8px; font-size: 10px; opacity: 0.8; display: flex; align-items: center; justify-content: space-between;">
            <span>📍 ${report.location.upazila}, ${report.location.district}</span>
            ${report.location.isApproximate ? '<span>(Approx. Area)</span>' : ''}
          </div>
          <button id="btn-view-rep-${report.id}" style="width: 100%; margin-top: 10px; padding: 6px 10px; border-radius: 8px; background: ${primaryColor}; color: ${secondaryColor}; font-weight: bold; font-size: 11px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>View Full Details</span>
            <span>→</span>
          </button>
        `;

        // Attach event listener inside popup
        popupContent.querySelector(`#btn-view-rep-${report.id}`)?.addEventListener('click', () => {
          setSelectedReport(report);
        });

        marker.bindPopup(popupContent);
        markersLayerRef.current?.addLayer(marker);
      });
    } else if (viewMode === 'cluster' || viewMode === 'heatmap') {
      // Density circles visualization in strict two-color scheme
      filteredReports.forEach((report) => {
        const radius = viewMode === 'heatmap' ? 4500 : 2500;
        const opacity = viewMode === 'heatmap' ? 0.3 : 0.55;

        const circle = L.circle([report.location.latitude, report.location.longitude], {
          color: primaryColor,
          fillColor: primaryColor,
          fillOpacity: opacity,
          radius: radius,
          weight: 1
        });

        circle.bindTooltip(
          `<div><strong>${report.category.toUpperCase()}</strong>: ${report.location.district}</div>`,
          { className: isLight ? 'bg-[#FAF8F5] text-[#004741]' : 'bg-[#003a35] text-[#F0EDE4]' }
        );

        circle.on('click', () => {
          setSelectedReport(report);
        });

        markersLayerRef.current?.addLayer(circle);
      });
    }
  }, [filteredReports, viewMode, isLight]);

  const resetView = () => {
    setSelectedDivision('all');
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setSelectedSeverity('all');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([23.8103, 90.4125], 7, { duration: 1.2 });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[580px] sm:h-[640px]'
      } ${
        isLight
          ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
          : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
      }`}
      id="interactive-map-container"
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 inset-x-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Filter Hub */}
        <div
          className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border shadow-xl pointer-events-auto backdrop-blur-md ${
            isLight
              ? 'bg-[#FAF8F5]/90 border-[#004741]/20'
              : 'bg-[#003833]/90 border-[#F0EDE4]/20'
          }`}
        >
          {/* Division Filter */}
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDistrict('all');
            }}
            id="map-filter-division"
            className={`border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741]'
                : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4]'
            }`}
          >
            <option value="all">All Divisions (৮টি বিভাগ)</option>
            {DIVISIONS.map((div) => (
              <option key={div.id} value={div.name}>
                {div.name} ({div.banglaName})
              </option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            id="map-filter-district"
            className={`border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741]'
                : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4]'
            }`}
          >
            <option value="all">All Districts (৬৪ জেলা)</option>
            {DISTRICTS.filter((d) => {
              if (selectedDivision === 'all') return true;
              const divObj = DIVISIONS.find((div) => div.name === selectedDivision);
              return divObj ? d.divisionId === divObj.id : true;
            }).map((dist) => (
              <option key={dist.id} value={dist.name}>
                {dist.name} ({dist.banglaName})
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            id="map-filter-category"
            className={`border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741]'
                : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4]'
            }`}
          >
            <option value="all">All Categories</option>
            <option value="road">Roads & Bridges</option>
            <option value="drainage">Drainage & WASA</option>
            <option value="electricity">Electricity & Power</option>
            <option value="bribery">Bribery & Harassment</option>
            <option value="waste_management">Garbage & Waste</option>
            <option value="public_service">Public Services</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            id="map-filter-severity"
            className={`border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741]'
                : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4]'
            }`}
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Right Map View Modes & Tools */}
        <div
          className={`flex items-center space-x-1.5 p-1.5 rounded-xl border shadow-xl pointer-events-auto backdrop-blur-md ${
            isLight
              ? 'bg-[#FAF8F5]/90 border-[#004741]/20'
              : 'bg-[#003833]/90 border-[#F0EDE4]/20'
          }`}
        >
          <div
            className={`flex rounded-lg p-0.5 border text-xs ${
              isLight ? 'bg-white border-[#004741]/20' : 'bg-[#004741] border-[#F0EDE4]/20'
            }`}
          >
            {(['markers', 'cluster', 'heatmap'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer capitalize ${
                  viewMode === mode
                    ? isLight
                      ? 'bg-[#004741] text-[#F0EDE4] font-bold'
                      : 'bg-[#F0EDE4] text-[#004741] font-bold'
                    : isLight
                    ? 'text-[#004741]/70 hover:text-[#004741]'
                    : 'text-[#F0EDE4]/70 hover:text-[#F0EDE4]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Reset Zoom */}
          <button
            onClick={resetView}
            title="Reset to whole Bangladesh"
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741] hover:bg-[#004741]/10'
                : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white border-[#004741]/25 text-[#004741] hover:bg-[#004741]/10'
                : 'bg-[#004741] border-[#F0EDE4]/25 text-[#F0EDE4] hover:bg-[#F0EDE4]/10'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Bottom Map Legend */}
      <div
        className={`absolute bottom-3 left-3 z-[1000] backdrop-blur-md px-3.5 py-2 rounded-xl border text-xs shadow-xl flex items-center space-x-3.5 ${
          isLight
            ? 'bg-[#FAF8F5]/95 border-[#004741]/25 text-[#004741]'
            : 'bg-[#003833]/95 border-[#F0EDE4]/25 text-[#F0EDE4]'
        }`}
      >
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-[#E4FD97] ring-1 ring-[#004741]" />
          <span className="text-[11px] font-black text-[#004741] dark:text-[#E4FD97]">Critical Alert</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full inline-block ${
              isLight ? 'bg-[#004741]' : 'bg-[#F0EDE4]'
            }`}
          />
          <span className="text-[11px] font-semibold">Active Hazard</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full inline-block border-2 ${
              isLight
                ? 'border-[#004741] bg-[#FAF8F5]'
                : 'border-[#F0EDE4] bg-[#003833]'
            }`}
          />
          <span className="text-[11px] font-semibold">Resolved / Verified</span>
        </div>
        <div className="border-l border-current/20 pl-3 text-[10px] opacity-80 hidden sm:block">
          Active Filter: <strong>{activeReportCount}</strong> reports mapped
        </div>
      </div>

      {/* Bottom Right CTA to pin issue */}
      <div className="absolute bottom-3 right-16 z-[1000]">
        <button
          onClick={() => setIsReportWizardOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-black text-xs shadow-xl transition-transform hover:scale-105 cursor-pointer bg-[#E4FD97] text-[#004741] hover:bg-[#d5f47d] border border-[#004741]/30"
        >
          <MapPin className="w-3.5 h-3.5 text-[#004741]" />
          <span>Pin New Issue</span>
        </button>
      </div>
    </div>
  );
};

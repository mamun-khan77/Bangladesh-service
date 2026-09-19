import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Phone, AlertTriangle } from 'lucide-react';

export const Footer: React.FC<{ onOpenModal: (type: 'contact' | 'faq' | 'privacy' | 'terms') => void }> = ({
  onOpenModal
}) => {
  const { setActiveTab, theme } = useApp();
  const isLight = theme === 'light';

  return (
    <footer
      className={`border-t mt-16 pt-12 pb-8 transition-colors ${
        isLight
          ? 'bg-[#FAF8F5] border-[#004741]/20 text-[#004741]'
          : 'bg-[#003530] border-[#F0EDE4]/20 text-[#F0EDE4]'
      }`}
      id="main-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b ${
            isLight ? 'border-[#004741]/15' : 'border-[#F0EDE4]/15'
          }`}
        >
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                  isLight
                    ? 'bg-[#004741] text-[#F0EDE4] border-[#004741]'
                    : 'bg-[#F0EDE4] text-[#004741] border-[#F0EDE4]'
                }`}
              >
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold tracking-tight">
                Bangladesh Civic Watch
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md opacity-80">
              A transparent, geospatial citizen reporting platform facilitating structured monitoring of public service grievances, infrastructure hazards, and corruption allegations across all 64 districts of Bangladesh.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded border text-[11px] ${
                  isLight
                    ? 'bg-white border-[#004741]/20 text-[#004741]'
                    : 'bg-[#004741] border-[#F0EDE4]/20 text-[#F0EDE4]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isLight ? 'bg-[#004741]' : 'bg-[#F0EDE4]'
                  }`}
                />
                <span>Active Public Transparency Ledger</span>
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs opacity-85">
              <li>
                <button
                  onClick={() => setActiveTab('map')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Interactive GIS Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Public Reports Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('police')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Police Stations Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('authorities')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Administrative Officials
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Transparency Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-90">
              Governance & Safety
            </h4>
            <ul className="space-y-2 text-xs opacity-85">
              <li>
                <button
                  onClick={() => onOpenModal('privacy')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Privacy Policy & Protection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('terms')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('faq')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('contact')}
                  className="hover:underline cursor-pointer transition-colors"
                >
                  Report Abuse / Misconduct
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline Box */}
          <div
            className={`border rounded-xl p-4 space-y-2 shadow-lg ${
              isLight
                ? 'border-[#004741]/20 bg-[#FAF8F5] text-[#004741]'
                : 'border-[#E4FD97]/30 bg-[#003833] text-[#F0EDE4]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#004741] dark:text-[#E4FD97]" />
              <span className="text-xs font-black uppercase tracking-wider">Urgent Assistance</span>
            </div>
            <p className="text-[11px] leading-tight opacity-80">
              For active armed crime, fire outbreaks, or life emergencies:
            </p>
            <a
              href="tel:999"
              className="flex items-center justify-center space-x-2 py-2 rounded-lg font-mono font-black text-sm transition-all hover:scale-[1.02] cursor-pointer bg-[#E4FD97] text-[#004741] hover:bg-[#d5f47d] border border-[#004741]/20 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#004741]" />
              <span>Call 999 (National)</span>
            </a>
            <div className="text-[10px] opacity-80 text-center">
              DUDOK Corruption Hotline: <strong className="font-bold underline decoration-[#E4FD97]">106</strong>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div
          className={`my-6 p-3.5 rounded-lg border text-[11px] leading-relaxed ${
            isLight
              ? 'bg-white/70 border-[#004741]/15 opacity-80'
              : 'bg-[#004741]/60 border-[#F0EDE4]/15 opacity-80'
          }`}
        >
          <strong>Legal Notice:</strong> This platform records citizen reports and allegations to promote public service accountability and infrastructure monitoring. It does not itself determine criminal or legal guilt. All submissions remain citizen allegations until formally reviewed and investigated by authorized state bodies.
        </div>

        {/* Copyright and Creator Credential - STRICT COMPLIANCE */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs pt-4 opacity-80">
          <div>
            © 2026 Bangladesh Civic Watch. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0 font-semibold flex items-center space-x-1.5">
            <span>Platform Architect:</span>
            <span className="font-bold underline">Built by Mamun Khan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

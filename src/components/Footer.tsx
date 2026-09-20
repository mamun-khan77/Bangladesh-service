import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Phone, AlertTriangle } from 'lucide-react';

export const Footer: React.FC<{ onOpenModal: (type: 'contact' | 'faq' | 'privacy' | 'terms') => void }> = ({
  onOpenModal
}) => {
  const { setActiveTab } = useApp();

  return (
    <footer
      className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 mt-16 pt-12 pb-8 transition-colors"
      id="main-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold tracking-tight">
                Bangladesh Civic Watch
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md text-slate-500 dark:text-slate-400">
              A transparent, geospatial citizen reporting platform facilitating structured monitoring of public service grievances, infrastructure hazards, and corruption allegations across all 64 districts of Bangladesh.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Public Transparency Ledger</span>
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-400">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <button
                  onClick={() => setActiveTab('map')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Interactive GIS Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Public Reports Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('police')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Police Stations Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('authorities')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Administrative Officials
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Transparency Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-400">
              Governance & Safety
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <button
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Privacy Policy & Protection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('faq')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  Report Abuse / Misconduct
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline Box */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-sm bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Urgent Assistance</span>
            </div>
            <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">
              For active armed crime, fire outbreaks, or life emergencies:
            </p>
            <a
              href="tel:999"
              className="flex items-center justify-center space-x-2 py-2 rounded-xl font-mono font-bold text-xs transition-all active:scale-95 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 999 (National)</span>
            </a>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
              DUDOK Corruption Hotline: <strong className="font-bold text-slate-900 dark:text-white">106</strong>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="my-6 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong>Legal Notice:</strong> This platform records citizen reports and allegations to promote public service accountability and infrastructure monitoring. It does not itself determine criminal or legal guilt. All submissions remain citizen allegations until formally reviewed and investigated by authorized state bodies.
        </div>

        {/* Copyright and Creator Credential - STRICT COMPLIANCE */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs pt-4 text-slate-500 dark:text-slate-400">
          <div>
            © 2026 Bangladesh Civic Watch. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0 font-semibold flex items-center space-x-1.5">
            <span>Platform Architect:</span>
            <span className="font-bold underline text-slate-900 dark:text-white">Built by Mamun Khan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

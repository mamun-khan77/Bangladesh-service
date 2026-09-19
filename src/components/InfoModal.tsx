import React from 'react';
import { X, Shield, FileText, HelpCircle, PhoneCall, CheckCircle } from 'lucide-react';

interface InfoModalProps {
  type: 'contact' | 'faq' | 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 my-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            {type === 'privacy' && <Shield className="w-5 h-5 text-[#2BEE34]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-amber-400" />}
            {type === 'faq' && <HelpCircle className="w-5 h-5 text-blue-400" />}
            {type === 'contact' && <PhoneCall className="w-5 h-5 text-purple-400" />}

            <h3 className="text-base font-bold text-white">
              {type === 'privacy' && 'Whistleblower Protection & Data Privacy Policy'}
              {type === 'terms' && 'Platform Governance & Terms of Service'}
              {type === 'faq' && 'Frequently Asked Questions (FAQ)'}
              {type === 'contact' && 'Civic Watch Desk & Technical Inquiries'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-[65vh] overflow-y-auto pr-1 text-xs text-zinc-300 space-y-4 leading-relaxed">
          {type === 'privacy' && (
            <>
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-600/40 text-emerald-300">
                <strong>Whistleblower First Principle:</strong> Your personal contact details, private phone number, and IP address are encrypted. If you select "Anonymous Public Report", your name is stripped across the public ledger.
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">1. Approximate vs Exact Geolocation</h4>
                <p>
                  For sensitive corruption or police-misconduct reports, citizens may choose "Approximate Location". In this mode, the public map displays only a generalized 1-kilometer radius, concealing your exact house or office entrance coordinates.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">2. Data Retention & Evidence Privacy</h4>
                <p>
                  Uploaded evidence is scanned for metadata (EXIF). Personal identifiers found on incidental bystanders in photographs are blurred during moderation before public dispatch.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">3. Government & Law Enforcement Access</h4>
                <p>
                  Official inquiries by the Anti-Corruption Commission (ACC) or District Magistrate require verified institutional credentials. Whistleblower identities submitted under anonymous protection are never disclosed without formal judicial warrant.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-600/40 text-amber-300">
                <strong>Zero Tolerance for Malicious or Defamatory Submissions:</strong> Filing knowingly false allegations to settle personal vendettas constitutes an offense under Bangladesh digital safety statutes.
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">1. Objective Factual Reporting</h4>
                <p>
                  Users agree to provide accurate, truthful descriptions. Defamatory speech, personal phone number leaks (doxxing), or abusive language will lead to immediate report rejection and device blocking.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">2. Verification Procedures</h4>
                <p>
                  Reports undergo a standardized three-tier audit: automated integrity check, moderator review, and formal administrative dispatch. Verification status reflects observable physical evidence and administrative feedback.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">3. Disclaimer of Liability</h4>
                <p>
                  Bangladesh Civic Watch is a civic monitoring and accountability technology platform. Official administrative actions, arrests, or road repairs are the legal responsibility of the corresponding municipal, law enforcement, or ministry bodies.
                </p>
              </div>
            </>
          )}

          {type === 'faq' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Q: How do I submit an issue?</h4>
                <p className="text-zinc-400">
                  Click the green "+ Report Issue" button, select the issue category (road, water, corruption, etc.), drag the map pin to the location, attach photos or documents, choose public or anonymous privacy, and click Submit.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Q: What happens after my report is submitted?</h4>
                <p className="text-zinc-400">
                  You receive a unique tracking ID (e.g. BCW-2026-000101). Moderators verify the evidence within 24 hours, update the status to "Verified", and dispatch the record to the appropriate Thana, Upazila Nirbahi Officer (UNO), or City Corporation desk.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Q: Should I report active armed robberies or fires here?</h4>
                <p className="text-zinc-400 text-amber-300">
                  <strong>NO.</strong> For urgent, life-threatening emergencies, call the National Emergency Hotline <strong>999</strong> or Fire Service <strong>102</strong> immediately. This platform is for civic oversight, tracking, and institutional accountability.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Q: How does anonymous reporting protect me?</h4>
                <p className="text-zinc-400">
                  When you select "Anonymous Public Report", your name and profile information are permanently hidden on the public map and report ledger. The public sees only "Anonymous Citizen".
                </p>
              </div>
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-4">
              <p>
                For technical questions, verification appeals, or municipal data synchronization partnerships with Bangladesh Civic Watch:
              </p>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 font-mono">
                <div><strong>National Desk:</strong> desk@civicwatch.bd</div>
                <div><strong>Moderation Appeals:</strong> verification@civicwatch.bd</div>
                <div><strong>Location:</strong> Level 7, Civic Technology Hub, Kawran Bazar, Dhaka 1215</div>
                <div><strong>Audit Dispatch Hotline:</strong> +880 2 9876543 (Sun - Thu, 9:00 AM - 5:00 PM)</div>
              </div>
              <p className="text-[11px] text-zinc-500">
                To report active crimes or urgent safety threats, please dial <strong>999</strong> directly.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  SignalZero,
  Send,
  Copy,
  Check,
  AlertCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LowNetworkSmsBanner({
  bloodGroup = 'A-',
  units = 2,
  hospitalName = 'Lilavati Hospital',
}) {
  const { isLowNetworkMode, setIsLowNetworkMode } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isLowNetworkMode) return null;

  // Short structured SMS format
  const cleanHospCode = hospitalName.split(' ')[0].toUpperCase();
  const smsBody = `BLOOD REQ ${bloodGroup.replace(/\s+/g, '')} ${units}U ${cleanHospCode}`;
  const smsRecipient = '104'; // State Health & Emergency Blood Helpline

  const handleCopy = () => {
    navigator.clipboard.writeText(smsBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-950 space-y-3">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <SignalZero className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
              Low-Network / Offline SMS Fallback Active
            </h4>
            <p className="text-[11px] text-amber-800">
              For hospital basements with 0% data connectivity. Sends compact code to National Helpline 104.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLowNetworkMode(false)}
          className="text-xs font-bold text-amber-900 hover:text-black underline"
        >
          Exit SMS Mode
        </button>
      </div>

      {/* Code Display */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1 bg-white p-3 rounded-xl border border-amber-300 font-mono text-sm font-bold text-slate-900 tracking-wider flex items-center justify-between shadow-inner">
          <span>{smsBody}</span>
          <span className="text-[10px] text-slate-400 font-sans uppercase">To: {smsRecipient}</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <a
            href={`sms:${smsRecipient}?body=${encodeURIComponent(smsBody)}`}
            className="flex-1 sm:flex-initial bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send via SMS</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="bg-white hover:bg-slate-50 border border-amber-300 text-slate-800 font-bold text-xs py-3 px-3 rounded-xl flex items-center space-x-1 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

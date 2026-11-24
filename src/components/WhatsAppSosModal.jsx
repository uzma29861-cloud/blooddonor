import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WhatsAppSosModal() {
  const { whatsAppModal, closeWhatsAppModal, toggleWhatsAppSimulatedStatus } = useApp();
  const { isOpen, request, isSimulatedFulfilled } = whatsAppModal;

  const [copied, setCopied] = useState(false);

  if (!isOpen || !request) return null;

  const reqUrl = `https://lifepulse.org/sos/${request.id}`;

  const messageText = isSimulatedFulfilled
    ? `✅ [UPDATE: REQUEST FULFILLED]\n\nThank you community! A verified donor reached ${request.hospitalName} for Patient ${request.patientName}.\n\nUnits are fulfilled. PLEASE STOP CALLING. Thank you for your prayers and support! 🙏\n\nLive verification record: ${reqUrl}`
    : `🚨 *URGENT BLOOD REQUIRED (${request.bloodGroup})* 🚨\n\n` +
      `• *Patient:* ${request.patientName}\n` +
      `• *Blood Group Needed:* *${request.bloodGroup}* (${request.componentType})\n` +
      `• *Required:* ${request.units} Units\n` +
      `• *Hospital:* ${request.hospitalName} (${request.hospitalArea})\n` +
      `• *Urgency:* ${request.urgency}\n` +
      `• *Doctor Verified:* ✅ Lilavati Medical Requisition Verified\n\n` +
      `🔗 *Live Auto-Updating Web Status Link:*\n${reqUrl}\n\n` +
      `*(Note: When fulfilled, this link will automatically mark as closed so the family does not receive unwanted calls.)*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </span>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">
                  One-Tap Auto-Expiring WhatsApp SOS Card
                </h3>
                <p className="text-xs text-emerald-100">
                  Prevents family spam harassment once blood is arranged
                </p>
              </div>
            </div>

            <button
              onClick={closeWhatsAppModal}
              className="text-white/80 hover:text-white text-xs font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Demo Toggle: Switch between URGENT vs FULFILLED */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">
                ⚡ Hackathon Demo State Toggle:
              </span>
              <span className="text-[11px] text-slate-500">
                Simulate how the shared web link dynamically changes in real-time
              </span>
            </div>

            <button
              type="button"
              onClick={toggleWhatsAppSimulatedStatus}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSimulatedFulfilled
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emergency-600 text-white shadow-sm'
              }`}
            >
              <span>{isSimulatedFulfilled ? 'State: FULFILLED (Safe)' : 'State: URGENT NEED'}</span>
            </button>
          </div>

          {/* Live Web Card Preview */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Recipient Web Preview (What people see when clicking the WhatsApp link):
            </label>

            <div
              className={`rounded-2xl border-2 p-5 transition-all ${
                isSimulatedFulfilled
                  ? 'bg-emerald-50/80 border-emerald-300'
                  : 'bg-rose-50/80 border-rose-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isSimulatedFulfilled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emergency-600 text-white animate-pulse'
                    }`}
                  >
                    {isSimulatedFulfilled ? '✓ Fulfilled & Closed' : '🚨 Urgent SOS Need'}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-2">
                    {request.patientName} — {request.units} Units of {request.bloodGroup}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {request.hospitalName} • {request.componentType}
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                    isSimulatedFulfilled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {request.bloodGroup}
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`mt-3 p-2.5 rounded-xl text-xs font-bold ${
                  isSimulatedFulfilled
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-100 text-rose-900 border border-rose-200'
                }`}
              >
                {isSimulatedFulfilled ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      Donors arranged! Thank you community — please do not make further calls to the family.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-rose-700 shrink-0 animate-spin" />
                    <span>
                      Actively coordinating voluntary donors within 2 km. Doctor slip verified.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formatted Text Box */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              WhatsApp Broadcast Message:
            </label>
            <textarea
              readOnly
              rows={4}
              value={messageText}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs text-slate-800 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center space-x-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

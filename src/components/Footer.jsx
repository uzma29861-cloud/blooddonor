import React from 'react';
import { Heart, ShieldAlert, PhoneCall, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

export default function Footer() {
  const { language } = useApp();
  const t = (key) => getTranslation(language, key);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      {/* Prominent Medical Disclaimer Banner */}
      <div className="bg-rose-950/90 border-b border-rose-900/60 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center space-x-3 text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm font-semibold tracking-wide">
            <span className="text-white font-extrabold uppercase mr-1">Medical Disclaimer:</span>
            "This platform is a community coordination prototype and must not be treated as an emergency medical service."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emergency-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Life<span className="text-emergency-500">Pulse</span> Network
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Rapid Voluntary Blood Donor Network — an open community coordination prototype connecting verified voluntary donors with patients during critical surgery and trauma emergencies.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Encrypted Donor Privacy Masking Active</span>
            </div>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emergency-500" />
              <span>National Helplines (India)</span>
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <span className="text-white font-semibold">108</span> — Emergency Medical & Ambulance
              </li>
              <li>
                <span className="text-white font-semibold">102</span> — Free Maternity & Infant Ambulance
              </li>
              <li>
                <span className="text-white font-semibold">104</span> — State Health Helpline & Blood Availability
              </li>
              <li>
                <span className="text-white font-semibold">eRaktKosh</span> — National Blood Transfusion Council
              </li>
            </ul>
          </div>

          {/* Hackathon Meta */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Project Prototype
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed for Hackathon Demonstrations. Implements Leaflet Geolocation, Multi-Language Voice Dictation, 90/120 Day Cooldown Locks, and Privacy-Shield Geofencing.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Role: Patient • Donor • Admin Verifier
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Rapid Voluntary Blood Donor Network (LifePulse). All Rights Reserved.</div>
          <div className="text-slate-400">
            Strict Donor Privacy Protocol: Location terminates within 100m geofence.
          </div>
        </div>
      </div>
    </footer>
  );
}

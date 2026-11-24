import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  Bell,
  BellRing,
  Volume2,
  Users,
  Award,
} from 'lucide-react';
import { RARE_TRIBE_DATA } from '../utils/mockBackend';
import { useApp } from '../context/AppContext';
import { playEmergencyAlertSound } from '../utils/soundEffects';

export default function RareBloodTribeCard() {
  const { activeDonor, togglePrioritySirenAlerts } = useApp();
  const tribe = RARE_TRIBE_DATA[activeDonor.bloodGroup];

  if (!tribe) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-rose-900/40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{tribe.tribeName}</span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">
            Rare Blood Tribe Network ({activeDonor.bloodGroup})
          </h3>

          <p className="text-xs text-rose-100 max-w-xl leading-relaxed">
            {tribe.description}
          </p>

          <div className="flex items-center space-x-3 pt-1 text-xs">
            <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-xl text-rose-200">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>
                <strong>{tribe.cityDonorsCount} verified donors</strong> in {tribe.cityName}
              </span>
            </div>
            <div className="text-slate-400">
              Rarity: <strong className="text-amber-300">{tribe.rarityPercent}</strong> of population
            </div>
          </div>
        </div>

        {/* Priority Siren Alert Toggle */}
        <div className="bg-black/30 backdrop-blur border border-rose-800/60 p-4 rounded-2xl shrink-0 w-full md:w-auto text-right md:text-left space-y-2">
          <div className="flex items-center justify-between md:justify-start md:space-x-4">
            <div>
              <span className="text-xs font-bold text-white block">
                Priority Siren Alerts
              </span>
              <span className="text-[10px] text-rose-300 block">
                High-priority sound override for life-or-death calls
              </span>
            </div>

            <button
              type="button"
              onClick={() => togglePrioritySirenAlerts(activeDonor.id)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none shrink-0 ${
                activeDonor.isPrioritySirenAlerts ? 'bg-rose-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  activeDonor.isPrioritySirenAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end md:justify-start space-x-2 pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={() => playEmergencyAlertSound()}
              className="text-[10px] text-amber-300 hover:text-amber-200 font-bold flex items-center space-x-1 underline"
            >
              <Volume2 className="w-3 h-3" />
              <span>Test Audio Siren Chime</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

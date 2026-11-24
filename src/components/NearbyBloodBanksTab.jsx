import React from 'react';
import {
  Building2,
  PhoneCall,
  MapPin,
  CheckCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NearbyBloodBanksTab({ requestedGroup = 'O-', requestedComponent = 'Whole Blood' }) {
  const { bloodBanks } = useApp();

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Official Hybrid Fallback Network:</strong> When voluntary donors are en route or unavailable, you can contact these verified zonal blood banks with ready reserve stock.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bloodBanks.map((bank) => {
          const availableUnits = bank.stock[requestedGroup] ?? 0;
          const hasStock = availableUnits > 0;

          return (
            <div
              key={bank.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {bank.name}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {bank.area} • <strong>{bank.distanceKm} km away</strong>
                    </span>
                  </div>
                </div>

                {/* Units Available Badge */}
                <div
                  className={`px-3 py-1.5 rounded-xl text-center shrink-0 border ${
                    hasStock
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  <span className="block text-lg font-black leading-none">
                    {availableUnits}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter">
                    {requestedGroup} Units
                  </span>
                </div>
              </div>

              {/* Extra Inventory Highlights */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">O+ Stock:</span>
                  <span className="font-bold text-slate-800">{bank.stock['O+']} Units</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Platelets SDP:</span>
                  <span className="font-bold text-slate-800">{bank.plateletsStock} Kits</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Status:</span>
                  <span className="font-bold text-emerald-600">Open 24x7</span>
                </div>
              </div>

              {/* Contact Button */}
              <div className="flex items-center space-x-2 pt-1">
                <a
                  href={`tel:${bank.phone.replace(/\s+/g, '')}`}
                  className="flex-1 bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Blood Bank ({bank.phone})</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

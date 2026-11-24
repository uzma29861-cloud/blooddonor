import React, { useState } from 'react';
import {
  BLOOD_GROUPS,
  BLOOD_FACTS,
  getCanReceiveFrom,
  getCanDonateTo,
} from '../utils/compatibility';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Info,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function BloodCompatibilityVisualizer() {
  const { language } = useApp();
  const t = (key) => getTranslation(language, key);

  const [selectedGroup, setSelectedGroup] = useState('O-');
  const [componentType, setComponentType] = useState('Whole Blood');

  const canReceiveFrom = getCanReceiveFrom(selectedGroup, componentType);
  const canDonateTo = getCanDonateTo(selectedGroup, componentType);
  const facts = BLOOD_FACTS[selectedGroup] || {};

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emergency-600 bg-emergency-50 px-3 py-1 rounded-full mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Medical Knowledge Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('compatTitle')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('compatSubtitle')}
          </p>
        </div>

        {/* Component Selector */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 self-start md:self-auto text-xs font-semibold">
          {['Whole Blood', 'Single Donor Platelets (SDP)', 'Plasma'].map((comp) => (
            <button
              key={comp}
              onClick={() => setComponentType(comp)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                componentType === comp
                  ? 'bg-white text-emergency-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Blood Group Selection Grid */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Select Blood Group to Analyze Compatibility:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {BLOOD_GROUPS.map((group) => {
            const isSelected = selectedGroup === group;
            return (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`py-3 px-2 rounded-2xl text-center font-extrabold text-sm transition-all relative border-2 ${
                  isSelected
                    ? 'border-emergency-600 bg-emergency-600 text-white shadow-lg shadow-emergency-200 scale-105'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/70 text-slate-800'
                }`}
              >
                {group}
                {group === 'O-' && (
                  <span className="block text-[8px] font-bold text-yellow-300 uppercase tracking-tighter">
                    Univ Donor
                  </span>
                )}
                {group === 'AB+' && (
                  <span className="block text-[8px] font-bold text-sky-200 uppercase tracking-tighter">
                    Univ Recip
                  </span>
                )}
                {group === 'Bombay (hh)' && (
                  <span className="block text-[8px] font-bold text-amber-300 uppercase tracking-tighter">
                    Ultra Rare
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Highlight Rationale Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white rounded-2xl p-5 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emergency-600/30 border border-emergency-500/50 flex items-center justify-center font-black text-2xl text-emergency-400">
              {selectedGroup}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">{facts.title || selectedGroup}</h3>
                {facts.badge && (
                  <span className="text-[10px] bg-emergency-600/40 text-emergency-200 font-bold px-2 py-0.5 rounded-full border border-emergency-500/30">
                    {facts.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{facts.description}</p>
            </div>
          </div>
          <div className="text-right sm:border-l sm:border-slate-700/60 sm:pl-4 shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Prevalence</div>
            <div className="text-xs font-bold text-amber-300">{facts.rarity || 'Common'}</div>
          </div>
        </div>
      </div>

      {/* Two Columns: Can Receive From vs Can Donate To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Can Receive From */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-3 pb-2 border-b border-emerald-200/60">
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-extrabold">
              {selectedGroup} {t('canReceiveFrom')}
            </h4>
          </div>
          <p className="text-xs text-emerald-700 mb-3">
            If a patient with <strong>{selectedGroup}</strong> needs {componentType.toLowerCase()}, these donors can safely donate:
          </p>
          <div className="flex flex-wrap gap-2">
            {canReceiveFrom.map((grp) => (
              <span
                key={grp}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-extrabold text-sm shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{grp}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Can Donate To */}
        <div className="bg-sky-50/60 border border-sky-200/80 rounded-2xl p-5">
          <div className="flex items-center space-x-2 text-sky-800 font-bold mb-3 pb-2 border-b border-sky-200/60">
            <ArrowUpRight className="w-5 h-5 text-sky-600" />
            <h4 className="text-sm font-extrabold">
              {selectedGroup} {t('canDonateTo')}
            </h4>
          </div>
          <p className="text-xs text-sky-700 mb-3">
            A voluntary donor with <strong>{selectedGroup}</strong> can safely help patients with these blood groups:
          </p>
          <div className="flex flex-wrap gap-2">
            {canDonateTo.map((grp) => (
              <span
                key={grp}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-sky-300 text-sky-800 font-extrabold text-sm shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>{grp}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Special Medical Note for Bombay Blood and Universal Types */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Automatic Backend Matching Protocol: </span>
          When a family posts an emergency for <strong>{selectedGroup}</strong>, the LifePulse dispatch engine notifies{' '}
          <strong>all {canReceiveFrom.length} compatible blood types</strong> ({canReceiveFrom.join(', ')}), maximizing the chance of immediate donor response rather than waiting only for an exact match.
        </div>
      </div>
    </div>
  );
}

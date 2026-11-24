import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Moon, Sun, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const THEMES = [
  {
    id: 'crimson',
    name: 'Crimson Pulse',
    subtitle: 'Trustworthy Medical Crimson',
    colorHex: '#be123c',
    accentClass: 'bg-rose-600',
    softClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
  },
  {
    id: 'teal',
    name: 'Clinical Teal & Emerald',
    subtitle: 'Calm Stress-Free Healthcare',
    colorHex: '#0f766e',
    accentClass: 'bg-teal-600',
    softClass: 'bg-teal-50',
    borderClass: 'border-teal-200',
  },
  {
    id: 'blue',
    name: 'Royal Trust Blue',
    subtitle: 'Official Hospital Healthcare',
    colorHex: '#1d4ed8',
    accentClass: 'bg-blue-600',
    softClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
  },
  {
    id: 'dark',
    name: 'High-Contrast Dark',
    subtitle: 'Low-Light Emergency Wards',
    colorHex: '#f43f5e',
    accentClass: 'bg-slate-900 border border-slate-700',
    softClass: 'bg-slate-800',
    borderClass: 'border-rose-500',
    isDark: true,
  },
];

export default function ThemeSwitcher() {
  const { currentTheme, changeTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1.5 transition-all shadow-2xs"
        title="Change App Theme & Colors"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs inline-block"
          style={{ backgroundColor: activeThemeObj.colorHex }}
        />
        <Palette className="w-3.5 h-3.5 text-slate-600" />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-scale-up">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 px-1">
            <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5 text-emergency-600" />
              <span>Theme & Color Palette</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              Live Switch
            </span>
          </div>

          <div className="space-y-1.5">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    changeTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 font-bold shadow-xs'
                      : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-5 h-5 rounded-lg border border-black/15 flex items-center justify-center text-[10px] text-white shadow-xs font-bold"
                      style={{ backgroundColor: theme.colorHex }}
                    >
                      {theme.isDark ? <Moon className="w-3 h-3 text-white" /> : null}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {theme.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {theme.subtitle}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

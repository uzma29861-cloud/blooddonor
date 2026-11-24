import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, RefreshCw, ShieldCheck, ChevronDown, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function UserProfileMenu() {
  const { currentUser, logoutUser, setShowAuthModal, currentRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shortName = currentUser?.name
    ? currentUser.name.split(' ')[0]
    : 'Donor';

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 transition-all shadow-2xs"
        title="View Profile / Switch User"
      >
        <div className="w-5 h-5 rounded-lg bg-emergency-600 text-white flex items-center justify-center text-[10px] font-black">
          {currentUser?.bloodGroup && currentUser?.bloodGroup !== 'N/A'
            ? currentUser.bloodGroup
            : '🩸'}
        </div>
        <span className="hidden xl:inline max-w-[90px] truncate text-slate-900">
          {shortName}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-scale-up space-y-2">
          {/* Header */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 truncate">
                {currentUser?.name || 'User'}
              </span>
              {currentUser?.bloodGroup && currentUser?.bloodGroup !== 'N/A' && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emergency-100 text-emergency-800 border border-emergency-200">
                  {currentUser.bloodGroup}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {currentUser?.phone || '+91 98200 14829'} • {currentUser?.city || 'Mumbai'}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified LifePulse Profile</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setShowAuthModal(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch User / Re-login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logoutUser();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out & Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

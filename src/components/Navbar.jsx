import React, { useState } from 'react';
import {
  Heart,
  Activity,
  UserCheck,
  Building2,
  Navigation,
  Globe,
  Zap,
  Radio,
  SignalZero,
  Signal,
  X,
  ShieldAlert,
  CalendarCheck2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, getTranslation } from '../utils/translations';
import ThemeSwitcher from './ThemeSwitcher';
import UserProfileMenu from './UserProfileMenu';

export default function Navbar() {
  const {
    language,
    changeLanguage,
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    requests,
    triggerDemoScenario,
    isLowNetworkMode,
    setIsLowNetworkMode,
  } = useApp();

  const [hideTopBanner, setHideTopBanner] = useState(false);
  const t = (key) => getTranslation(language, key);

  const activeEmergencyCount = requests.filter(
    (r) => r.status !== 'FULFILLED'
  ).length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Sleek single-line dismissible medical announcement bar */}
      {!hideTopBanner && (
        <div className="bg-gradient-to-r from-emergency-700 via-emergency-800 to-emergency-900 text-white text-xs font-medium px-4 py-1.5 flex items-center justify-between transition-all">
          <div className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-bold tracking-wide uppercase text-[10px] bg-white/20 px-1.5 py-0.5 rounded shrink-0">
              Medical Notice
            </span>
            <span className="hidden sm:inline text-rose-100 font-medium truncate">
              {t('disclaimerBanner')}
            </span>
            <span className="sm:hidden text-rose-100 font-medium">Emergency: Call 108/102</span>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 ml-2">
            <button
              onClick={triggerDemoScenario}
              className="flex items-center space-x-1 bg-amber-400 text-slate-950 hover:bg-amber-300 px-2.5 py-0.5 rounded-full font-black text-[11px] shadow-sm transition-all transform active:scale-95"
              title="Pre-loads a critical emergency for a fast 3-minute hackathon pitch"
            >
              <Zap className="w-3 h-3 text-slate-900 fill-slate-900" />
              <span>{t('demoScenarioBtn')}</span>
            </button>

            <button
              onClick={() => setHideTopBanner(true)}
              className="text-rose-200 hover:text-white p-0.5 rounded"
              title="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Logo & Title (Cleanly Aligned, No Overlap) */}
          <div
            onClick={() => setActiveTab('request')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-emergency-600 flex items-center justify-center text-white shadow-md shadow-emergency-600/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Life<span className="text-emergency-600">Pulse</span>
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-emergency-50 text-emergency-700 border border-emergency-200 whitespace-nowrap">
                  Rapid Network
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                Voluntary Blood Donor Emergency Response
              </span>
            </div>
          </div>

          {/* Center: Navigation Pill Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('request')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'request'
                  ? 'bg-white text-emergency-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emergency-600" />
              <span>{t('navEmergencyRequest')}</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'tracker'
                  ? 'bg-white text-emergency-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('navLiveTracking')}</span>
              {activeEmergencyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-black rounded-full bg-emergency-600 text-white animate-pulse">
                  {activeEmergencyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('donor_portal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'donor_portal'
                  ? 'bg-white text-emergency-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Donor Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('scheduled_care')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'scheduled_care'
                  ? 'bg-white text-emergency-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('navScheduledCare')}</span>
            </button>

            <button
              onClick={() => setActiveTab('compatibility')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'compatibility'
                  ? 'bg-white text-emergency-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span>Compatibility</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_portal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                activeTab === 'admin_portal'
                  ? 'bg-white text-emergency-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right: Theme Picker, Language, SMS Mode, Profile, Demo Role */}
          <div className="flex items-center space-x-2">
            {/* Demo Role Switcher */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl shadow-inner text-xs border border-slate-700">
              <button
                onClick={() => {
                  setCurrentRole('requester');
                  if (activeTab === 'donor_portal' || activeTab === 'admin_portal') {
                    setActiveTab('tracker');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'requester'
                    ? 'bg-emergency-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="View as Patient / Requester"
              >
                🏥 Requester
              </button>
              <button
                onClick={() => {
                  setCurrentRole('donor');
                  setActiveTab('donor_portal');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'donor'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="View as Voluntary Donor"
              >
                🩸 Donor
              </button>
              <button
                onClick={() => {
                  setCurrentRole('hospital_admin');
                  setActiveTab('admin_portal');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'hospital_admin'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="View as Hospital Admin Verifier"
              >
                🩺 Admin
              </button>
            </div>

            {/* Offline / Low-Network SMS Mode Toggle */}
            <button
              onClick={() => setIsLowNetworkMode(!isLowNetworkMode)}
              className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
                isLowNetworkMode
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
              title={isLowNetworkMode ? 'Low-Network SMS Mode ON' : 'Toggle SMS Mode'}
            >
              {isLowNetworkMode ? (
                <SignalZero className="w-4 h-4 text-slate-950" />
              ) : (
                <Signal className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Dynamic Theme & Color Switcher */}
            <ThemeSwitcher />

            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1.5 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emergency-500 transition-colors appearance-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native}
                  </option>
                ))}
              </select>
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2 pointer-events-none" />
            </div>

            {/* User Profile Pill Menu */}
            <UserProfileMenu />
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto space-x-1 text-xs">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
              activeTab === 'request'
                ? 'bg-rose-50 text-emergency-700'
                : 'text-slate-600'
            }`}
          >
            {t('navEmergencyRequest')}
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
              activeTab === 'tracker'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600'
            }`}
          >
            {t('navLiveTracking')}
          </button>
          <button
            onClick={() => setActiveTab('donor_portal')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
              activeTab === 'donor_portal'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600'
            }`}
          >
            Donor Hub
          </button>
          <button
            onClick={() => setActiveTab('scheduled_care')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
              activeTab === 'scheduled_care'
                ? 'bg-rose-50 text-emergency-700'
                : 'text-slate-600'
            }`}
          >
            {t('navScheduledCare')}
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
              activeTab === 'compatibility'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600'
            }`}
          >
            Compatibility
          </button>
          <button
            onClick={() => setActiveTab('admin_portal')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
              activeTab === 'admin_portal'
                ? 'bg-purple-50 text-purple-700'
                : 'text-slate-600'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}

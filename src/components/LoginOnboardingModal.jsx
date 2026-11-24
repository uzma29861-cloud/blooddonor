import React, { useState } from 'react';
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  Phone,
  User,
  Heart,
  MapPin,
  Check,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, getTranslation } from '../utils/translations';
import { BLOOD_GROUPS } from '../utils/compatibility';

export default function LoginOnboardingModal() {
  const {
    language,
    changeLanguage,
    showAuthModal,
    setShowAuthModal,
    loginUser,
    bypassDemoLogin,
  } = useApp();

  const [step, setStep] = useState(1); // 1: Language selection, 2: Login / Profile details

  // Form states
  const [role, setRole] = useState('donor'); // 'donor' | 'requester'
  const [name, setName] = useState('Vikramaditya Sharma');
  const [phone, setPhone] = useState('+91 98200 14829');
  const [city, setCity] = useState('Mumbai');
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('4419'); // Pre-filled simulated OTP

  if (!showAuthModal) return null;

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setStep(2);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleFinishLogin = (e) => {
    e.preventDefault();
    loginUser({
      name: name.trim() || 'Voluntary Donor',
      phone: phone.trim() || '+91 98200 14829',
      city: city.trim() || 'Mumbai',
      bloodGroup: role === 'donor' ? bloodGroup : 'N/A',
      role,
    });
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform animate-scale-up">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-emergency-700 via-emergency-800 to-emergency-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white shadow-inner">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  Life<span className="text-rose-300">Pulse</span> Network
                </h2>
                <p className="text-xs text-rose-100">
                  {step === 1 ? 'Step 1 of 2: Select Your Language' : 'Step 2 of 2: Quick Onboarding'}
                </p>
              </div>
            </div>

            {/* Quick Demo Bypass Button */}
            <button
              type="button"
              onClick={() => {
                bypassDemoLogin();
                setShowAuthModal(false);
              }}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center space-x-1 transition-all transform active:scale-95"
              title="Skip login and enter full prototype immediately"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Instant Demo Bypass</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {step === 1 ? (
            /* STEP 1: Big Tactile Language Selection Cards */
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Choose Your Preferred Language
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  आपकी भाषा • तुमची भाषा • તમારી ભાષા
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between h-24 ${
                        isSelected
                          ? 'border-emergency-600 bg-rose-50/70 shadow-md ring-2 ring-emergency-400'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{lang.flag}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emergency-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900">
                          {lang.native}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {lang.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">
                  Select a language card to proceed to login.
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Quick Mobile + Simulated OTP Login */
            <form onSubmit={handleFinishLogin} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Welcome to LifePulse
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify mobile to access urgent requests and donor dispatch.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-emergency-600 hover:underline"
                >
                  Change Language ({LANGUAGES.find((l) => l.code === language)?.label})
                </button>
              </div>

              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('donor')}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                    role === 'donor'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🩸 I Want to Donate (Donor)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('requester')}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                    role === 'requester'
                      ? 'bg-white text-emergency-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🏥 I Need Blood (Patient Family)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emergency-500 bg-white"
                  />
                </div>

                {/* Mobile Number & Simulated OTP */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emergency-500 bg-white"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Simulated 4-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="4419"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold font-mono text-emerald-800 bg-emerald-50 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* City */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City / Metro *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emergency-500 bg-white"
                  />
                </div>

                {/* Blood Group (if donor) */}
                {role === 'donor' && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Blood Group *
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emergency-800 bg-rose-50/50 focus:ring-2 focus:ring-emergency-500"
                    >
                      {BLOOD_GROUPS.map((grp) => (
                        <option key={grp} value={grp}>
                          {grp}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Enter LifePulse</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    bypassDemoLogin();
                    setShowAuthModal(false);
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl transition-all"
                >
                  ⚡ Skip & Continue as Guest / Demo Mode
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

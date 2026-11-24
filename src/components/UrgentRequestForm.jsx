import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  UploadCloud,
  FileCheck2,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Volume2,
  Share2,
  Users,
  Building2,
  Radio,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BLOOD_GROUPS, getCanReceiveFrom } from '../utils/compatibility';
import { getTranslation } from '../utils/translations';
import LowNetworkSmsBanner from './LowNetworkSmsBanner';

export default function UrgentRequestForm() {
  const {
    language,
    hospitals,
    createRequest,
    setActiveTab,
    isLowNetworkMode,
    openWhatsAppModal,
    donors,
    bloodBanks,
  } = useApp();

  const t = (key) => getTranslation(language, key);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [componentType, setComponentType] = useState('Whole Blood');
  const [units, setUnits] = useState(2);
  const [urgency, setUrgency] = useState('Critical - Immediate');
  const [hospitalId, setHospitalId] = useState(hospitals[0]?.id || 'hosp-1');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [doctorSlip, setDoctorSlip] = useState(null);
  const [doctorSlipPreview, setDoctorSlipPreview] = useState(null);
  const [isDoctorVerified, setIsDoctorVerified] = useState(true);

  // Voice to text dictation state
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type details or try Google Chrome.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        language === 'hi'
          ? 'hi-IN'
          : language === 'mr'
          ? 'mr-IN'
          : language === 'gu'
          ? 'gu-IN'
          : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript('Listening... Speak clearly...');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setSpeechTranscript(transcript);

        const lower = transcript.toLowerCase();

        if (lower.includes('o negative') || lower.includes('o-')) setBloodGroup('O-');
        else if (lower.includes('o positive') || lower.includes('o+')) setBloodGroup('O+');
        else if (lower.includes('a negative') || lower.includes('a-')) setBloodGroup('A-');
        else if (lower.includes('a positive') || lower.includes('a+')) setBloodGroup('A+');
        else if (lower.includes('b negative') || lower.includes('b-')) setBloodGroup('B-');
        else if (lower.includes('b positive') || lower.includes('b+')) setBloodGroup('B+');
        else if (lower.includes('ab positive') || lower.includes('ab+')) setBloodGroup('AB+');
        else if (lower.includes('ab negative') || lower.includes('ab-')) setBloodGroup('AB-');
        else if (lower.includes('bombay')) setBloodGroup('Bombay (hh)');

        const unitMatch = lower.match(/(\d+)\s*(unit|units|pints|bags)/);
        if (unitMatch && unitMatch[1]) {
          setUnits(parseInt(unitMatch[1], 10));
        }

        if (lower.includes('lilavati')) setHospitalId('hosp-1');
        else if (lower.includes('tata')) setHospitalId('hosp-2');
        else if (lower.includes('kem')) setHospitalId('hosp-3');
        else if (lower.includes('kokilaben')) setHospitalId('hosp-4');
        else if (lower.includes('reliance') || lower.includes('h n')) setHospitalId('hosp-5');

        if (lower.includes('platelet') || lower.includes('sdp')) {
          setComponentType('Single Donor Platelets (SDP)');
        } else if (lower.includes('plasma')) {
          setComponentType('Plasma');
        }

        const patientMatch = lower.match(/patient\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/);
        if (patientMatch && patientMatch[1]) {
          setPatientName(patientMatch[1].charAt(0).toUpperCase() + patientMatch[1].slice(1));
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDoctorSlip(reader.result);
        setDoctorSlipPreview(reader.result);
        setIsDoctorVerified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter patient name.');
      return;
    }
    if (!requesterPhone.trim()) {
      alert('Please enter family mobile number.');
      return;
    }

    createRequest({
      patientName,
      bloodGroup,
      componentType,
      units,
      urgency,
      hospitalId,
      requesterPhone,
      requesterName: requesterName || 'Family Attendant',
      doctorSlip:
        doctorSlipPreview ||
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    });
  };

  const compatibleDonorsList = getCanReceiveFrom(bloodGroup, componentType);
  const selectedHospitalObj = hospitals.find((h) => h.id === hospitalId) || hospitals[0];

  // Dynamic calculations for the Live Match Radar
  const compatibleDonorsNearby = donors.filter(
    (d) => d.isAvailable && compatibleDonorsList.includes(d.bloodGroup)
  );

  const nearbyBankStockCount = bloodBanks.reduce((acc, curr) => {
    return acc + (curr.stock[bloodGroup] || 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Offline / Low-Network SMS Fallback Banner (Feature F) */}
      <LowNetworkSmsBanner
        bloodGroup={bloodGroup}
        units={units}
        hospitalName={selectedHospitalObj.name}
      />

      {/* 2-COLUMN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (65% width) — Guided 3-Step Urgent Request Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Form Header with Voice Dictation */}
          <div className="p-6 sm:p-7 bg-gradient-to-r from-emergency-700 via-emergency-800 to-emergency-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-white/15 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Hyperlocal 2km SOS Dispatch</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                {t('requestTitle')}
              </h2>
              <p className="text-xs text-rose-100 mt-0.5 max-w-xl">
                {t('requestSubtitle')}
              </p>
            </div>

            {/* Voice Dictate Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all ${
                isListening
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/50 animate-pulse'
                  : 'bg-white text-emergency-800 hover:bg-rose-50'
              }`}
              title="Dictate patient and hospital details"
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-emergency-700 animate-bounce" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-emergency-700" />
                  <span>Dictate with Voice</span>
                </>
              )}
            </button>
          </div>

          {/* Voice transcript display */}
          {speechTranscript && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center space-x-2 text-xs text-amber-900">
              <Volume2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-bold">Transcribed:</span>
              <span className="italic">"{speechTranscript}"</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-7">
            {/* SECTION 1: Patient & Blood Need */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-emergency-100 text-emergency-800 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Patient & Blood Requirement
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('patientName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500 text-xs font-bold text-slate-900 bg-white"
                  />
                </div>

                {/* Urgency Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('urgencyLevel')}
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emergency-500 text-xs font-bold text-emergency-800 bg-rose-50/60"
                  >
                    <option value="Critical - Immediate">Critical - Immediate (Surgery/Trauma)</option>
                    <option value="Within 6 Hours">Within 6 Hours (Urgent Transfusion)</option>
                    <option value="Scheduled">Scheduled (Within 24 Hours)</option>
                  </select>
                </div>
              </div>

              {/* TACTILE BLOOD GROUP SELECTOR PILLS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Required Blood Group *
                  </label>
                  <span className="text-[11px] text-emergency-700 font-extrabold">
                    {compatibleDonorsList.length} Compatible Groups Will Be Alerted
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-9 gap-1.5">
                  {BLOOD_GROUPS.map((grp) => {
                    const isSelected = bloodGroup === grp;
                    return (
                      <button
                        key={grp}
                        type="button"
                        onClick={() => setBloodGroup(grp)}
                        className={`py-2.5 px-2 rounded-xl text-center font-black text-xs transition-all relative border-2 ${
                          isSelected
                            ? 'border-emergency-600 bg-emergency-600 text-white shadow-sm scale-105'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800'
                        }`}
                      >
                        {grp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Component & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('componentType')}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Whole Blood', 'Single Donor Platelets (SDP)', 'Plasma'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setComponentType(type)}
                        className={`py-2 px-1.5 rounded-xl text-[11px] font-bold text-center border-2 transition-all ${
                          componentType === type
                            ? 'border-emergency-600 bg-rose-50 text-emergency-800 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {type === 'Single Donor Platelets (SDP)' ? 'Platelets' : type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('unitsRequired')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setUnits(Math.max(1, units - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-base flex items-center justify-center border border-slate-200"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-black text-sm py-2 bg-slate-50 border border-slate-200 rounded-xl">
                      {units} {units === 1 ? 'Unit' : 'Units'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setUnits(Math.min(10, units + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-base flex items-center justify-center border border-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Hospital Location */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-emergency-100 text-emergency-800 flex items-center justify-center text-xs font-black">
                  2
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Hospital Location & Radius Anchor
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {hospitals.map((hosp) => {
                  const isSelected = hospitalId === hosp.id;
                  return (
                    <button
                      key={hosp.id}
                      type="button"
                      onClick={() => setHospitalId(hosp.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-emergency-600 bg-rose-50/60 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-black text-slate-900">
                        <MapPin
                          className={`w-3.5 h-3.5 ${
                            isSelected ? 'text-emergency-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{hosp.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium pl-5 mt-0.5">
                        {hosp.area}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 3: Contact & Doctor Verification */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                <span className="w-6 h-6 rounded-full bg-emergency-100 text-emergency-800 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Contact & Doctor Prescription Verification
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Family Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    placeholder="+91 98201 00000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emergency-500 text-xs font-bold text-slate-900 bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    🔒 Number stays masked until a verified donor explicitly accepts.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Attendant Name / Relation
                  </label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="e.g. Aarti Deshmukh (Sister)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emergency-500 text-xs font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Doctor prescription slip */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <label className="cursor-pointer flex-1 w-full flex items-center justify-center p-3.5 border-2 border-dashed border-slate-300 hover:border-emergency-500 rounded-xl bg-white transition-colors">
                  <UploadCloud className="w-5 h-5 text-slate-400 mr-2" />
                  <span className="text-xs font-bold text-slate-700">
                    {doctorSlipPreview ? 'Prescription slip attached' : 'Upload Doctor Requisition Slip'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center space-x-2.5 bg-white p-2 rounded-xl border border-slate-200 shrink-0">
                  <img
                    src={
                      doctorSlipPreview ||
                      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
                    }
                    alt="Prescription preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-left text-xs">
                    <span className="font-extrabold text-slate-800 block">Lilavati Hospital Memo</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Stamp Verified #MH-8841</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 bg-emergency-600 hover:bg-emergency-700 text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 transform active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Urgent SOS to Donors</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  openWhatsAppModal({
                    id: 'REQ-NEW',
                    patientName: patientName || 'Emergency Patient',
                    bloodGroup,
                    componentType,
                    units,
                    urgency,
                    hospitalName: selectedHospitalObj.name,
                    hospitalArea: selectedHospitalObj.area,
                    status: 'NOTIFIED',
                  });
                }}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-1.5 shadow-xs transition-all"
                title="Preview auto-updating WhatsApp message card"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp SOS Card</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN (35% width) — Live Smart Summary & Match Radar (Sticky Sidebar) */}
        <div className="lg:col-span-4 space-y-5 sticky top-24">
          {/* Live Match Radar Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emergency-600"></span>
                </span>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Live Match Radar
                </h3>
              </div>

              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                2 km Hyperlocal
              </span>
            </div>

            {/* Target Group & Compatibility Highlights */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Selected Need:</span>
                <span className="font-black text-emergency-700 text-sm">{bloodGroup}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Hospital Anchor:</span>
                <span className="font-extrabold text-slate-900 truncate max-w-[170px]">
                  {selectedHospitalObj.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Component:</span>
                <span className="font-bold text-slate-700">{componentType}</span>
              </div>
            </div>

            {/* Real-Time Compatible Alert Group Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                Compatible Donors That Will Receive Alert:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {compatibleDonorsList.map((grp) => (
                  <span
                    key={grp}
                    className="inline-flex items-center px-2.5 py-1 rounded-xl bg-rose-50 text-emergency-800 border border-rose-200 text-xs font-black shadow-2xs"
                  >
                    ✓ {grp}
                  </span>
                ))}
              </div>
            </div>

            {/* Nearby Verified Donors & Blood Banks Count */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-center">
                <div className="flex items-center justify-center space-x-1 text-emerald-800 text-lg font-black">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{compatibleDonorsNearby.length || 4}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-900 block mt-0.5">
                  Compatible Donors in 2km
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="flex items-center justify-center space-x-1 text-slate-900 text-lg font-black">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>{nearbyBankStockCount}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 block mt-0.5">
                  Units in Zonal Banks
                </span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp SOS Card Preview Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Auto-Expiring WhatsApp Card
                </h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                Self-Updating
              </span>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              Upon posting, families get a live web link that automatically switches to <strong>"FULFILLED"</strong> once donors are arranged, preventing 500+ spam calls after the operation.
            </p>

            <button
              type="button"
              onClick={() => {
                openWhatsAppModal({
                  id: 'REQ-PREVIEW',
                  patientName: patientName || 'Patient Name',
                  bloodGroup,
                  componentType,
                  units,
                  urgency,
                  hospitalName: selectedHospitalObj.name,
                  hospitalArea: selectedHospitalObj.area,
                  status: 'NOTIFIED',
                });
              }}
              className="w-full bg-white hover:bg-emerald-100 text-emerald-800 font-black text-xs py-2 px-3 rounded-xl border border-emerald-300 transition-colors flex items-center justify-center space-x-1 shadow-2xs"
            >
              <span>Preview WhatsApp Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

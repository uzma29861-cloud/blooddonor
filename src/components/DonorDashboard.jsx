import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Clock,
  Award,
  AlertCircle,
  Share2,
  Download,
  CheckCircle,
  Sparkles,
  MapPin,
  Lock,
  Unlock,
  QrCode,
  Calendar,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Send,
  Navigation,
  Phone,
  ExternalLink,
  CheckCircle2,
  Car,
  Tent,
  Activity,
  Plus,
  Ticket,
  FileText,
  BadgeCheck,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { isCompatible } from '../utils/compatibility';
import RareBloodTribeCard from './RareBloodTribeCard';
import confetti from 'canvas-confetti';

export default function DonorDashboard() {
  const {
    language,
    activeDonor,
    currentUser,
    toggleDonorAvailability,
    getDonorCooldownStatus,
    resetCooldown,
    simulateDonationCompletionForDemo,
    requests,
    initiateAcceptRequest,
    startJourney,
    updateQuickStatus,
    completeRequest,
    sendChatMessage,
    setActiveTab,
    setActiveTrackingRequestId,
    communityCamps,
    bookCampSlot,
    hostNewCamp,
    bookedPass,
    setBookedPass,
    pastDonations,
    donorHealthVault,
  } = useApp();

  const t = (key) => getTranslation(language, key);

  // Sub-tabs: 'emergency' | 'camps' | 'journey'
  const [donorSubTab, setDonorSubTab] = useState('emergency');

  // Modals state
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showHostCampModal, setShowHostCampModal] = useState(false);
  const [bookingCamp, setBookingCamp] = useState(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState('10:30 AM');
  const [donorChatInputs, setDonorChatInputs] = useState({});

  // Host a Camp Form state
  const [hostCampForm, setHostCampForm] = useState({
    title: '',
    organizer: '',
    date: 'Saturday, 05 Dec 2026',
    venue: '',
    totalSlots: 50,
    contactPerson: `${currentUser?.name || activeDonor.name} • ${currentUser?.phone || '+91 98200 14829'}`,
  });

  const cooldown = getDonorCooldownStatus();

  // Find incoming requests matching this donor
  const compatibleRequests = requests.filter(
    (r) =>
      r.status === 'NOTIFIED' &&
      isCompatible(activeDonor.bloodGroup, r.bloodGroup, r.componentType)
  );

  // Find active missions accepted by this donor
  const acceptedMissions = requests.filter(
    (r) =>
      (r.status === 'ACCEPTED' || r.status === 'EN_ROUTE') &&
      (r.acceptedByDonorId === activeDonor.id || !r.acceptedByDonorId || r.acceptedByDonorName === activeDonor.name)
  );

  const triggerCertificateCelebration = () => {
    setShowCertificateModal(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#be123c', '#e11d48', '#f59e0b', '#059669'],
      });
    } catch (e) {
      console.warn('Confetti trigger', e);
    }
  };

  const handleSendDonorChat = (reqId, customText = null) => {
    const textToSend = customText || donorChatInputs[reqId];
    if (!textToSend || !textToSend.trim()) return;
    sendChatMessage(reqId, textToSend.trim(), 'donor');
    setDonorChatInputs((prev) => ({ ...prev, [reqId]: '' }));
  };

  const handleConfirmSlotBooking = () => {
    if (!bookingCamp) return;
    bookCampSlot(bookingCamp.id, selectedSlotTime);
    setBookingCamp(null);
  };

  const handleHostCampSubmit = (e) => {
    e.preventDefault();
    if (!hostCampForm.title || !hostCampForm.venue) return;
    hostNewCamp(hostCampForm);
    setShowHostCampModal(false);
    setHostCampForm({
      title: '',
      organizer: '',
      date: 'Saturday, 05 Dec 2026',
      venue: '',
      totalSlots: 50,
      contactPerson: `${currentUser?.name || activeDonor.name} • ${currentUser?.phone || '+91 98200 14829'}`,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Rare Blood Tribe Network Badge & City Counter (Feature E) */}
      <RareBloodTribeCard />

      {/* Donor Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={activeDonor.avatar}
                alt={activeDonor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-100 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeDonor.name}
                </h2>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emergency-600 text-white shadow-sm">
                  {activeDonor.bloodGroup}
                </span>
                {activeDonor.verifiedBadge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Verified Voluntary Donor
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {activeDonor.area} • Registered Voluntary Lifesaver • {activeDonor.gender.toUpperCase()} ({activeDonor.age} yrs)
              </p>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">
                {activeDonor.isAvailable && !cooldown.inCooldown
                  ? t('availableStatus')
                  : t('unavailableStatus')}
              </div>
              <div className="text-[10px] text-slate-400">
                {cooldown.inCooldown
                  ? 'Locked by Medical Safety Protocol'
                  : 'Toggle to receive instant SOS alerts'}
              </div>
            </div>

            <button
              onClick={() => toggleDonorAvailability()}
              disabled={cooldown.inCooldown}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                activeDonor.isAvailable && !cooldown.inCooldown
                  ? 'bg-emerald-500'
                  : 'bg-slate-300 cursor-not-allowed opacity-80'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  activeDonor.isAvailable && !cooldown.inCooldown ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Donations
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {activeDonor.donationsCount || 6}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Voluntary Units</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emergency-800">
              {t('livesImpactedBadge')}
            </span>
            <div className="text-2xl font-black text-emergency-600 mt-0.5">
              {(activeDonor.donationsCount || 6) * 3}
            </div>
            <span className="text-[11px] text-emergency-800 font-medium">Patients Impacted</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Privacy Status
            </span>
            <div className="text-sm font-black text-slate-900 mt-2 flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Contact Masked</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Unlocked only upon accept</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Digital Certificate
              </span>
              <div className="text-xs font-bold text-amber-900 mt-1">Verified Impact Card</div>
            </div>
            <button
              onClick={triggerCertificateCelebration}
              className="mt-2 text-xs font-black text-amber-900 hover:text-amber-950 flex items-center space-x-1 underline"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>View Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setDonorSubTab('emergency')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition-all ${
            donorSubTab === 'emergency'
              ? 'bg-white text-emergency-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4 text-emergency-600 fill-emergency-100" />
          <span>Active Missions & Live SOS</span>
          {acceptedMissions.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setDonorSubTab('camps')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition-all ${
            donorSubTab === 'camps'
              ? 'bg-white text-emergency-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tent className="w-4 h-4 text-emerald-600" />
          <span>Community Donation Drives</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-black">
            {communityCamps.length} Camps
          </span>
        </button>

        <button
          onClick={() => setDonorSubTab('journey')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition-all ${
            donorSubTab === 'journey'
              ? 'bg-white text-emergency-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-blue-600" />
          <span>My Impact & Health Vault</span>
        </button>
      </div>

      {/* SUB-TAB 1: EMERGENCY MISSIONS & SOS FEED */}
      {donorSubTab === 'emergency' && (
        <div className="space-y-6">
          {/* ACTIVE ACCEPTED DONATION MISSION & LIVE CHAT WITH REQUESTER */}
          {acceptedMissions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Active Accepted Mission & Live Requester Coordination
                  </h3>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Eligibility Passed • Match Locked
                </span>
              </div>

              {acceptedMissions.map((mission) => {
                const isEnRoute = mission.status === 'EN_ROUTE';
                const chatList = mission.chatMessages || [];
                const currentInput = donorChatInputs[mission.id] || '';

                return (
                  <div
                    key={mission.id}
                    className="bg-white rounded-3xl border-2 border-emerald-400 p-6 sm:p-7 shadow-lg shadow-emerald-500/5 space-y-5"
                  >
                    {/* Mission Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-extrabold text-slate-900">
                            Patient: {mission.patientName}
                          </span>
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-emergency-800 uppercase">
                            {mission.urgency}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-emergency-600" />
                          <span>
                            <strong>{mission.hospitalName}</strong> ({mission.hospitalArea}) • {mission.units} Units of {mission.componentType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Mission Status
                          </span>
                          <span
                            className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block ${
                              isEnRoute
                                ? 'bg-blue-100 text-blue-800 animate-pulse'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isEnRoute ? '🚗 En Route to Hospital' : '✓ Accepted (Ready)'}
                          </span>
                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-emergency-600 text-white flex flex-col items-center justify-center font-black text-sm shadow-md">
                          <span>{mission.bloodGroup}</span>
                          <span className="text-[8px] uppercase tracking-tighter">Need</span>
                        </div>
                      </div>
                    </div>

                    {/* Unlocked Contact & Attendant Info */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Unlock className="w-4 h-4 text-emerald-600" />
                          <span className="font-extrabold text-emerald-950">
                            Privacy Shield Lifted for this Case:
                          </span>
                        </div>
                        <p className="text-emerald-900 font-medium">
                          Attendant: <strong>{mission.requesterName}</strong> • Phone:{' '}
                          <strong className="font-mono">{mission.requesterPhone}</strong>
                        </p>
                      </div>

                      <a
                        href={`tel:${mission.requesterPhone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Requester Directly</span>
                      </a>
                    </div>

                    {/* Mission Controls: Start Journey & Quick Status Updates */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                      <span className="text-xs font-extrabold text-slate-800 block">
                        Journey Navigation & Live GPS Streaming:
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        {!isEnRoute ? (
                          <button
                            onClick={() => startJourney(mission.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition-all transform active:scale-95"
                          >
                            <Car className="w-4 h-4" />
                            <span>Start Journey to Hospital (Broadcast GPS)</span>
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center space-x-1.5 bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-xl">
                              <Navigation className="w-3.5 h-3.5 animate-spin" />
                              <span>Live GPS Broadcasting Active</span>
                            </span>

                            <button
                              onClick={() => {
                                setActiveTrackingRequestId(mission.id);
                                setActiveTab('tracker');
                              }}
                              className="bg-white border border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1"
                            >
                              <span>View on Live Map Tracker</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => completeRequest(mission.id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                        >
                          Mark Donation Complete (Lock Cooldown)
                        </button>
                      </div>

                      {/* Quick Status Buttons */}
                      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-slate-500 font-bold text-[11px]">Quick Status:</span>
                        {['Left Home', 'In Traffic', 'Reached Hospital Reception', 'Entering Blood Bank'].map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => updateQuickStatus(mission.id, status)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                                mission.quickStatus === status
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {status}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Live In-App Chat with Requester */}
                    <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-xs font-black text-slate-900">
                            Direct Encrypted Chat with {mission.requesterName}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-500">End-to-End Coordination</span>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-slate-200 max-h-44 overflow-y-auto space-y-2 text-xs">
                        {chatList.length === 0 ? (
                          <div className="text-center py-4 text-slate-400">
                            No messages yet. Send a quick update to reassure the patient's family!
                          </div>
                        ) : (
                          chatList.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex flex-col ${
                                msg.sender === 'donor' ? 'items-end' : 'items-start'
                              }`}
                            >
                              <div
                                className={`px-3 py-2 rounded-2xl max-w-xs sm:max-w-md ${
                                  msg.sender === 'donor'
                                    ? 'bg-emerald-600 text-white rounded-br-xs'
                                    : 'bg-slate-100 text-slate-900 rounded-bl-xs border border-slate-200'
                                }`}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                                {msg.sender === 'donor' ? 'You' : mission.requesterName} • {msg.time}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={currentInput}
                          onChange={(e) =>
                            setDonorChatInputs({ ...donorChatInputs, [mission.id]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendDonorChat(mission.id);
                          }}
                          placeholder="Type an update (e.g. 'Parked vehicle, heading to Blood Bank OT-3')..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => handleSendDonorChat(mission.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Compatible Urgent Requests Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Live Urgent SOS Broadcasts Matching Your Blood Group ({activeDonor.bloodGroup})
                </h3>
                <p className="text-xs text-slate-500">
                  Hyperlocal emergency alerts filtered by biological compatibility.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-emergency-800 border border-rose-200">
                {compatibleRequests.length} Active SOS Alerts
              </span>
            </div>

            {compatibleRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-2">
                <Heart className="w-8 h-8 text-emergency-500 mx-auto fill-rose-100" />
                <h4 className="text-sm font-bold text-slate-800">No Pending Unassigned SOS in Your Vicinity</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {acceptedMissions.length > 0
                    ? 'You are currently assigned to an active mission above! Chat with the requester or start your journey.'
                    : 'All regional emergencies are currently covered. Click "⚡ Quick Demo Scenario" in the navbar to simulate a critical incoming request.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compatibleRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border-2 border-rose-200/80 p-5 shadow-sm space-y-4 hover:border-emergency-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-black text-slate-900">{req.patientName}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-emergency-800 uppercase border border-rose-200">
                            {req.urgency}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {req.hospitalName} ({req.hospitalArea})
                        </div>
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-emergency-600 text-white flex flex-col items-center justify-center font-black text-base shadow-md">
                        <span>{req.bloodGroup}</span>
                        <span className="text-[8px] font-bold uppercase tracking-tighter">Need</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Component:</span>
                        <span className="font-bold text-slate-800">{req.componentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Quantity Needed:</span>
                        <span className="font-bold text-slate-800">{req.units} Units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Compatibility:</span>
                        <span className="font-bold text-emerald-600">
                          ✓ Your {activeDonor.bloodGroup} is fully compatible
                        </span>
                      </div>
                    </div>

                    {/* Accept Button triggers the 20s Pre-Donation Medical Eligibility Quiz */}
                    <button
                      onClick={() => {
                        initiateAcceptRequest(req.id, activeDonor.id);
                      }}
                      className="w-full bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Accept Request (20s Medical Check)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COMMUNITY BLOOD CAMPS & FAST-TRACK PASS */}
      {donorSubTab === 'camps' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Upcoming Community Blood Donation Drives Near You
              </h2>
              <p className="text-xs text-slate-500">
                Pre-book a 10-minute slot to skip lines with a digital Fast-Track QR pass.
              </p>
            </div>

            <button
              onClick={() => setShowHostCampModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 self-start sm:self-center transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Host a Camp (College / Corporate)</span>
            </button>
          </div>

          {/* Active Booked Pass Notification Banner */}
          {bookedPass && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                    Active Fast-Track Digital Pass • {bookedPass.passId}
                  </div>
                  <h4 className="text-sm font-black text-white">
                    {bookedPass.campTitle} ({bookedPass.timeSlot})
                  </h4>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    {bookedPass.venue} • Show QR at registration desk to skip queues
                  </p>
                </div>
              </div>

              <button
                onClick={() => setBookedPass(bookedPass)}
                className="bg-white text-emerald-800 font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-50 self-start sm:self-center"
              >
                View Digital QR Pass
              </button>
            </div>
          )}

          {/* Camps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityCamps.map((camp) => {
              const bookedPercent = Math.round((camp.bookedSlots / camp.totalSlots) * 100);
              const remaining = camp.totalSlots - camp.bookedSlots;

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Organizer & Distance */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {camp.organizerBadge}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 pt-1">
                          {camp.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Organized by {camp.organizer}
                        </p>
                      </div>

                      <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg shrink-0">
                        {camp.distanceKm} km away
                      </span>
                    </div>

                    {/* Date, Time & Venue */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-2 text-xs">
                      <div className="flex items-center space-x-2 text-slate-800 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-emergency-600 shrink-0" />
                        <span>{camp.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{camp.time}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{camp.venue}</span>
                      </div>
                    </div>

                    {/* Demand Pills */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        High Demand Blood Groups:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {camp.inDemandBloodGroups.map((bg) => (
                          <span
                            key={bg}
                            className="text-[11px] font-bold bg-rose-50 text-emergency-700 px-2 py-0.5 rounded-md border border-rose-100"
                          >
                            {bg}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Slot Availability Progress */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-600">Fast-Track Slots</span>
                        <span className="font-black text-slate-900">
                          {remaining} slots left ({camp.bookedSlots}/{camp.totalSlots})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${bookedPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Action */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <button
                      onClick={() => setBookingCamp(camp)}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Book 10-Min Fast-Track Slot</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MY IMPACT & MINI HEALTH VAULT */}
      {donorSubTab === 'journey' && (
        <div className="space-y-7 animate-fade-in">
          {/* Post-Donation Mini Health Vault Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-2xs">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Clinical Lab Records</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    Post-Donation Mini Health Vault
                  </h3>
                  <p className="text-xs text-slate-500">
                    Routine physiological and serological screening logged during your voluntary donations.
                  </p>
                </div>
              </div>

              <button
                onClick={triggerCertificateCelebration}
                className="px-4 py-2 bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 self-start sm:self-auto transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Download Health & Donor Certificate</span>
              </button>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div className="text-slate-400 text-base mb-1">🩸</div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hemoglobin</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {donorHealthVault.metrics.hemoglobin.value}{' '}
                  <span className="text-xs font-normal text-slate-500">g/dL</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Optimal (13.0–17.5)
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div className="text-slate-400 text-base mb-1">💓</div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Pressure</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {donorHealthVault.metrics.bloodPressure.value}
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Normal Range
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div className="text-slate-400 text-base mb-1">⚡</div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pulse Rate</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {donorHealthVault.metrics.pulseRate.value}{' '}
                  <span className="text-xs font-normal text-slate-500">bpm</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Healthy Rhythm
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div className="text-slate-400 text-base mb-1">⚖️</div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Body Weight</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  {donorHealthVault.metrics.bodyWeight.value}{' '}
                  <span className="text-xs font-normal text-slate-500">kg</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Eligible (&gt;50kg)
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 col-span-2 sm:col-span-1">
                <div className="text-slate-400 text-base mb-1">🧪</div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Screening</span>
                <div className="text-sm font-black text-emerald-700 mt-1">
                  Non-Reactive
                </div>
                <span className="text-[10px] font-bold text-slate-500 block mt-0.5">
                  HIV/HBV/HCV/VDRL Clear
                </span>
              </div>
            </div>

            {/* Verification Footer Note */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Last verified at <strong>{donorHealthVault.donationCentre}</strong> on {donorHealthVault.lastCheckedDate}. Certified safe for patient transfusion.
                </span>
              </div>
              <span className="font-mono font-bold text-[11px] text-emerald-800 shrink-0 hidden sm:inline">
                {donorHealthVault.donorCardNumber}
              </span>
            </div>
          </div>

          {/* "Where Your Blood Went" Impact Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full mb-1">
                <Heart className="w-3.5 h-3.5 text-emergency-600 fill-emergency-100" />
                <span>Donor Retention & Gratitude Journey</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                "Where Your Blood Went" Impact Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Anonymized, heartwarming hospital reports showing the real human lives impacted by your voluntary donations.
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {pastDonations.map((donation) => (
                <div key={donation.id} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-emergency-600 border-4 border-white shadow-xs flex items-center justify-center text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>

                  <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors p-5 rounded-2xl border border-slate-200/80 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black text-emergency-700 bg-rose-100/70 px-2 py-0.5 rounded">
                          {donation.unitCode}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {donation.hospitalName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Donated on {donation.donationDate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      <strong>Transfused to:</strong> {donation.patientContext}
                    </div>

                    <p className="text-xs font-medium text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
                      "{donation.lifeImpactMessage}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="inline-flex items-center space-x-1 font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{donation.transfusionStatus}</span>
                      </span>
                      <span className="text-slate-400 font-medium">
                        Verified by {donation.verifiedDoctor}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SLOT BOOKING PICKER MODAL */}
      {bookingCamp && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6">
              <h3 className="text-base font-black">Book Fast-Track Slot</h3>
              <p className="text-xs text-emerald-200 mt-0.5">{bookingCamp.title}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div><strong>Venue:</strong> {bookingCamp.venue}</div>
                <div><strong>Date:</strong> {bookingCamp.date}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select 10-Minute Fast-Track Time Slot:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['09:30 AM', '10:15 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:15 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlotTime(slot)}
                      className={`p-2.5 rounded-xl font-bold border transition-all ${
                        selectedSlotTime === slot
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setBookingCamp(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSlotBooking}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-sm"
                >
                  Confirm & Get QR Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL FAST-TRACK QR PASS MODAL */}
      {bookedPass && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border-4 border-emerald-500 overflow-hidden animate-scale-up text-center p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  LifePulse Priority Pass
                </span>
                <h4 className="text-sm font-black text-slate-900">Fast-Track Entry Pass</h4>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded">
                {bookedPass.passId}
              </span>
            </div>

            {/* Simulated QR Code */}
            <div className="p-4 bg-slate-50 border-2 border-dashed border-emerald-300 rounded-2xl flex flex-col items-center justify-center">
              <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-slate-300 shadow-inner flex items-center justify-center relative">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <span className="text-[10px] text-slate-500 font-bold mt-2">
                Scan at Camp Welcome Desk to Skip Lines
              </span>
            </div>

            <div className="text-left text-xs bg-slate-50 p-3.5 rounded-xl space-y-1.5 border border-slate-150">
              <div className="flex justify-between">
                <span className="text-slate-500">Donor Name:</span>
                <strong className="text-slate-900">{bookedPass.donorName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <strong className="text-emergency-600">{bookedPass.bloodGroup}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Slot Time:</span>
                <strong className="text-emerald-700">{bookedPass.timeSlot} ({bookedPass.date})</strong>
              </div>
              <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                {bookedPass.campTitle}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Digital Pass saved to device. See you at the camp!');
                  setBookedPass(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Save Pass & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOST A CAMP MODAL */}
      {showHostCampModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6">
              <h3 className="text-base font-black">Register a Community Blood Drive</h3>
              <p className="text-xs text-emerald-200 mt-1">
                Colleges, corporate parks, and housing societies can coordinate voluntary camps.
              </p>
            </div>

            <form onSubmit={handleHostCampSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Camp / Drive Title</label>
                <input
                  type="text"
                  required
                  value={hostCampForm.title}
                  onChange={(e) => setHostCampForm({ ...hostCampForm, title: e.target.value })}
                  placeholder="e.g., St. Xavier's College Annual Blood Drive"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Organizer / Institution</label>
                <input
                  type="text"
                  required
                  value={hostCampForm.organizer}
                  onChange={(e) => setHostCampForm({ ...hostCampForm, organizer: e.target.value })}
                  placeholder="e.g., Rotary Club & Youth NSS"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Date</label>
                  <input
                    type="text"
                    value={hostCampForm.date}
                    onChange={(e) => setHostCampForm({ ...hostCampForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Expected Slots</label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={hostCampForm.totalSlots}
                    onChange={(e) => setHostCampForm({ ...hostCampForm, totalSlots: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Venue Address</label>
                <input
                  type="text"
                  required
                  value={hostCampForm.venue}
                  onChange={(e) => setHostCampForm({ ...hostCampForm, venue: e.target.value })}
                  placeholder="e.g., College Quadrangle / Corporate Foyer, Mumbai"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHostCampModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Publish Blood Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verified Blood Donor Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-amber-300 overflow-hidden transform animate-scale-up text-center p-8 relative">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto mb-3 text-amber-800 shadow-inner">
              <Award className="w-10 h-10 text-amber-600" />
            </div>

            <div className="text-[10px] font-black uppercase tracking-widest text-amber-700">
              National Voluntary Coordination Registry
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Verified Blood Donor & Health Certificate
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Presented with gratitude for saving lives through voluntary community blood donation.
            </p>

            <div className="my-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Donor Name:</span>
                <span className="font-extrabold text-slate-900 text-sm">{activeDonor.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-black text-emergency-600 text-sm">{activeDonor.bloodGroup}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Lives Impacted:</span>
                <span className="font-black text-emerald-700 text-sm">
                  {(activeDonor.donationsCount || 6) * 3} Patients
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Clinical Screening Status:</span>
                <span className="font-bold text-emerald-800 text-xs">Non-Reactive (Safe)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Certificate ID:</span>
                <span className="font-mono font-bold text-slate-700">LP-CERT-8849-MH</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  alert('Certificate & Health Summary downloaded. Thank you for being a lifesaver!');
                  setShowCertificateModal(false);
                }}
                className="flex-1 bg-emergency-600 hover:bg-emergency-700 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 px-4 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Phone,
  MessageSquare,
  Radio,
  MapPin,
  Car,
  ChevronRight,
  ShieldAlert,
  Send,
  Volume2,
  ExternalLink,
  RotateCcw,
  Share2,
  Building2,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import NearbyBloodBanksTab from './NearbyBloodBanksTab';
import L from 'leaflet';

export default function LiveRequestTracker() {
  const {
    language,
    currentRole,
    requests,
    activeTrackingRequestId,
    setActiveTrackingRequestId,
    activeRequest,
    initiateAcceptRequest,
    startJourney,
    updateQuickStatus,
    completeRequest,
    sendChatMessage,
    escalateSosRadius,
    activeDonor,
    openWhatsAppModal,
    openRideModal,
  } = useApp();

  const t = (key) => getTranslation(language, key);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const donorMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const geofenceCircleRef = useRef(null);

  const [chatInput, setChatInput] = useState('');
  const [activeViewTab, setActiveViewTab] = useState('live_map'); // 'live_map' | 'blood_banks'

  const req = activeRequest || requests[0];

  const getStepStatus = (stepIndex) => {
    if (!req) return 'pending';
    const status = req.status;

    if (stepIndex === 1) return 'done';
    if (stepIndex === 2) return status !== 'VERIFIED' ? 'done' : 'in_progress';
    if (stepIndex === 3) {
      if (['ACCEPTED', 'EN_ROUTE', 'FULFILLED'].includes(status)) return 'done';
      return status === 'NOTIFIED' ? 'in_progress' : 'pending';
    }
    if (stepIndex === 4) {
      if (['EN_ROUTE', 'FULFILLED'].includes(status)) return status === 'FULFILLED' ? 'done' : 'in_progress';
      return 'pending';
    }
    if (stepIndex === 5) {
      return status === 'FULFILLED' ? 'done' : 'pending';
    }
    return 'pending';
  };

  useEffect(() => {
    if (!mapContainerRef.current || !req || activeViewTab !== 'live_map') return;

    const hospCoords = [req.hospitalLat || 19.0522, req.hospitalLng || 72.8306];
    const donorCoords = [
      req.donorLiveLocation?.lat || req.hospitalLat + 0.012,
      req.donorLiveLocation?.lng || req.hospitalLng - 0.015,
    ];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView(hospCoords, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Hospital Marker
      const hospIcon = L.divIcon({
        className: 'custom-hosp-pin',
        html: `
          <div style="background:#be123c; color:white; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(190,18,60,0.4); border:3px solid white; font-weight:bold; font-size:16px;">
            🏥
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      L.marker(hospCoords, { icon: hospIcon })
        .addTo(map)
        .bindPopup(`<b>${req.hospitalName}</b><br>Emergency Transfusion Blood Bank`)
        .openPopup();

      // Geofencing 100m circle around Hospital
      const geofenceCircle = L.circle(hospCoords, {
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        radius: 100,
        dashArray: '4, 4',
      }).addTo(map);
      geofenceCircle.bindTooltip('100m Auto-Stop Geofence', { permanent: false });
      geofenceCircleRef.current = geofenceCircle;

      // Donor Marker
      const donorIcon = L.divIcon({
        className: 'custom-donor-pin',
        html: `
          <div style="position:relative; width:36px; height:36px;">
            <div style="position:absolute; width:100%; height:100%; background:#2563eb; border-radius:50%; opacity:0.3; animation:ping 1.5s infinite;"></div>
            <div style="background:#1d4ed8; color:white; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(37,99,235,0.4); border:3px solid white; font-size:16px;">
              🩸
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const donorMarker = L.marker(donorCoords, { icon: donorIcon }).addTo(map);
      donorMarker.bindPopup(`<b>${req.acceptedByDonorName || 'Voluntary Donor'}</b><br>Live GPS Streaming`);
      donorMarkerRef.current = donorMarker;

      const polyline = L.polyline([donorCoords, hospCoords], {
        color: '#be123c',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);
      routePolylineRef.current = polyline;

      mapInstanceRef.current = map;
    } else {
      if (donorMarkerRef.current && req.donorLiveLocation?.lat) {
        const newCoords = [req.donorLiveLocation.lat, req.donorLiveLocation.lng];
        donorMarkerRef.current.setLatLng(newCoords);

        if (routePolylineRef.current) {
          routePolylineRef.current.setLatLngs([newCoords, hospCoords]);
        }
      }
    }
  }, [req, req?.donorLiveLocation, activeViewTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(req.id, chatInput.trim());
    setChatInput('');
  };

  if (!req) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-slate-500">
        No active requests found. Post an urgent request or click "⚡ Quick Demo Scenario".
      </div>
    );
  }

  const isFulfilled = req.status === 'FULFILLED';
  const isEnRoute = req.status === 'EN_ROUTE';
  const isAccepted = req.status === 'ACCEPTED';
  const isGeofenceTerminated = req.donorLiveLocation?.geofenceReached || isFulfilled;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner with Request Switcher & WhatsApp Share */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-emergency-700 border border-rose-200 flex items-center justify-center font-black text-sm shadow-sm">
            {req.bloodGroup}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-slate-900">
                {req.patientName}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-emergency-800 uppercase border border-rose-200">
                {req.urgency}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {req.hospitalName} • {req.units} Units of {req.componentType}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* One-Tap WhatsApp SOS Card Button */}
          <button
            onClick={() => openWhatsAppModal(req)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all"
            title="Share self-updating card to WhatsApp family groups"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share WhatsApp SOS Card</span>
          </button>

          {/* Multi-Request Selector if more than 1 exist */}
          {requests.length > 1 && (
            <select
              value={req.id}
              onChange={(e) => setActiveTrackingRequestId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 bg-slate-50 focus:outline-none"
            >
              {requests.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.patientName} ({r.bloodGroup})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Swiggy/Zomato-Style Step-by-Step Live Progress Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Real-Time Emergency Pipeline
            </span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {t('trackingTitle')}
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold">
            <span className="text-slate-500">Current Status:</span>
            <span
              className={`px-3 py-1 rounded-full uppercase tracking-wider ${
                isFulfilled
                  ? 'bg-emerald-100 text-emerald-800'
                  : isEnRoute
                  ? 'bg-blue-100 text-blue-800 animate-pulse'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {req.status}
            </span>
          </div>
        </div>

        {/* 5-Step Progress Stepper */}
        <div className="relative">
          <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-slate-100 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
            {[
              { num: 1, label: t('step1'), desc: 'Doctor Slip Verified' },
              { num: 2, label: t('step2'), desc: `${req.searchRadiusKm} km Radius Alert` },
              { num: 3, label: t('step3'), desc: req.acceptedByDonorName || 'Waiting Donor' },
              { num: 4, label: t('step4'), desc: isEnRoute ? `${req.donorLiveLocation?.etaMinutes || 8} min ETA` : 'GPS Inactive' },
              { num: 5, label: t('step5'), desc: isFulfilled ? 'Completed & Safe' : 'Awaiting Arrival' },
            ].map((step) => {
              const status = getStepStatus(step.num);
              const isDone = status === 'done';
              const isInProgress = status === 'in_progress';

              return (
                <div
                  key={step.num}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isDone
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : isInProgress
                      ? 'bg-rose-50/70 border-emergency-400 text-emergency-900 ring-2 ring-rose-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-black text-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isInProgress
                        ? 'bg-emergency-600 text-white animate-bounce'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isDone ? '✓' : step.num}
                  </div>
                  <div className="text-xs font-extrabold">{step.label}</div>
                  <div className="text-[10px] mt-0.5 opacity-80 font-medium">
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Switcher: Live Map vs Nearby Blood Banks (Hybrid Fallback) */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveViewTab('live_map')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeViewTab === 'live_map'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Live Donor GPS Tracking</span>
        </button>

        <button
          onClick={() => setActiveViewTab('blood_banks')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeViewTab === 'blood_banks'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-emergency-600" />
          <span>Nearby Blood Banks (Live Stock Fallback)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emergency-100 text-emergency-800 font-extrabold">
            4 Banks
          </span>
        </button>
      </div>

      {activeViewTab === 'blood_banks' ? (
        /* Nearby Blood Banks Hybrid Fallback Component */
        <NearbyBloodBanksTab
          requestedGroup={req.bloodGroup}
          requestedComponent={req.componentType}
        />
      ) : (
        /* Live Leaflet Map & Dispatch Console */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Leaflet Map */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col">
            {/* Map Header with Live ETA Pill */}
            <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Live Geolocation Tracking
                </span>
              </div>

              {/* Live ETA Card */}
              <div className="flex items-center space-x-3 text-xs bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                {isFulfilled ? (
                  <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Reached Blood Bank • Donation In Progress</span>
                  </div>
                ) : isEnRoute ? (
                  <div className="flex items-center space-x-3 text-yellow-300 font-extrabold">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span>Arriving in {req.donorLiveLocation?.etaMinutes || 8} mins</span>
                    <span className="text-slate-400">•</span>
                    <span>{req.donorLiveLocation?.distanceKm || 2.1} km away</span>
                  </div>
                ) : (
                  <div className="text-slate-300 font-medium">
                    {req.acceptedByDonorName
                      ? 'Donor accepted. Awaiting journey start.'
                      : 'Dispatching to nearby compatible donors...'}
                  </div>
                )}
              </div>
            </div>

            {/* Leaflet Map Div */}
            <div
              ref={mapContainerRef}
              className="w-full h-80 sm:h-96 relative z-0"
              style={{ minHeight: '340px' }}
            />

            {/* Privacy Auto-Stop Geofence Rule Notice */}
            <div className="p-3.5 bg-emerald-50/70 border-t border-emerald-200/80 text-emerald-950 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Privacy-Shield Geofencing Active:</strong> Live GPS tracking automatically terminates once donor enters the 100-meter hospital radius.
                </span>
              </div>
              {isGeofenceTerminated && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 shrink-0 ml-2">
                  GPS Terminated
                </span>
              )}
            </div>
          </div>

          {/* Right Col: Controls, Ride Sponsoring & Contact */}
          <div className="space-y-4">
            {/* Donor & Family Action Console */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Emergency Coordination Controls
              </h4>

              {/* Sponsor Ride Button (Uber/Ola/Rapido) */}
              {(isAccepted || isEnRoute) && (
                <button
                  type="button"
                  onClick={() => openRideModal(req)}
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>Sponsor Donor's Ride (Uber/Ola/Rapido)</span>
                </button>
              )}

              {/* If request not accepted yet: Initiate Accept with 20s Quiz */}
              {req.status === 'NOTIFIED' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    ⚠️ Request verified. Waiting for a compatible voluntary donor to accept.
                  </div>
                  {currentRole === 'donor' ? (
                    <button
                      onClick={() => initiateAcceptRequest(req.id, activeDonor.id)}
                      className="w-full bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all"
                    >
                      🩸 Accept Request (20s Medical Check)
                    </button>
                  ) : (
                    <button
                      onClick={() => initiateAcceptRequest(req.id, 'donor-1')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5"
                    >
                      <span>Simulate Donor Acceptance (Demo)</span>
                    </button>
                  )}
                </div>
              )}

              {/* If accepted: Show "Start Journey to Hospital" button */}
              {isAccepted && (
                <div className="space-y-2.5">
                  <button
                    onClick={() => startJourney(req.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{t('startJourneyBtn')}</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center">
                    Requests GPS permission and streams coordinates to patient family.
                  </p>
                </div>
              )}

              {/* If en route: Quick Status Fallbacks for low network */}
              {(isEnRoute || isAccepted) && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    {t('manualStatusFallback')}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateQuickStatus(req.id, 'Left Home')}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                    >
                      {t('statusLeftHome')}
                    </button>
                    <button
                      onClick={() => updateQuickStatus(req.id, '5 Mins Away')}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                    >
                      {t('status5MinsAway')}
                    </button>
                  </div>
                  <button
                    onClick={() => completeRequest(req.id)}
                    className="w-full p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('statusReachedHospital')}</span>
                  </button>
                </div>
              )}

              {/* SOS Radius Escalation Button */}
              {!req.radiusEscalated && !isFulfilled && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => escalateSosRadius(req.id)}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-emergency-800 font-extrabold text-xs py-2.5 px-3 rounded-xl border border-rose-200 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-emergency-600" />
                    <span>{t('sosEscalationBtn')}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 block text-center mt-1">
                    Alerts 18 regional blood banks & donors up to 25 km.
                  </span>
                </div>
              )}

              {req.radiusEscalated && (
                <div className="p-2.5 bg-yellow-50 rounded-xl border border-yellow-200 text-[11px] text-yellow-900 font-medium">
                  🚨 {t('sosEscalatedNotice')}
                </div>
              )}
            </div>

            {/* Privacy-Masked Contact & Direct Chat */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contact Channels</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {req.acceptedByDonorName ? 'Unlocked' : 'Masked (Privacy)'}
                </span>
              </div>

              {/* Details */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Attendant:</span>
                  <span className="font-bold text-slate-900">{req.requesterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Attendant Phone:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {req.acceptedByDonorName ? req.requesterPhone : '+91 98201 •••••'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Voluntary Donor:</span>
                  <span className="font-bold text-slate-900">
                    {req.acceptedByDonorName || 'Waiting Acceptance'}
                  </span>
                </div>
                {req.acceptedByDonorName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Donor Phone:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {req.acceptedDonorPhone || '+91 98200 14829'}
                    </span>
                  </div>
                )}
              </div>

              {/* In-App Direct Emergency Chat */}
              {req.acceptedByDonorName && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    <span>Coordination Chat:</span>
                  </div>
                  <div className="h-28 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl text-xs border border-slate-200">
                    {req.chatMessages?.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          msg.sender === currentRole ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`px-2.5 py-1.5 rounded-xl max-w-[85%] ${
                            msg.sender === currentRole
                              ? 'bg-emergency-600 text-white'
                              : 'bg-white text-slate-800 border border-slate-200'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-0.5">{msg.time}</span>
                      </div>
                    ))}
                    {(!req.chatMessages || req.chatMessages.length === 0) && (
                      <div className="text-center text-slate-400 py-6 text-[11px]">
                        Send coordination instructions to donor.
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type urgent note..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-emergency-500"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

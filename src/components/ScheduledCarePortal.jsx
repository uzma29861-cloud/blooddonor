import React, { useState } from 'react';
import {
  Calendar,
  Heart,
  Users,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Building2,
  CalendarCheck2,
  ShieldAlert,
  ChevronRight,
  Share2,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BLOOD_GROUPS, isCompatible } from '../utils/compatibility';

export default function ScheduledCarePortal() {
  const {
    buddyCircles,
    joinBuddyCircle,
    plannedSurgeries,
    pledgePlannedSurgery,
    createPlannedSurgery,
    activeDonor,
    currentUser,
    getDonorCooldownStatus,
    hospitals,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('circles'); // 'circles' | 'surgeries'
  const [showNewSurgeryModal, setShowNewSurgeryModal] = useState(false);
  const [selectedCircleFilter, setSelectedCircleFilter] = useState('ALL');

  // New Planned Surgery Form State
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    bloodGroup: 'B+',
    componentType: 'Whole Blood / PRBC',
    surgeryType: '',
    hospitalName: hospitals[0]?.name || 'Lilavati Hospital & Research Centre',
    surgeryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    unitsRequired: 2,
    familyContact: `${currentUser?.name || 'Attendant'} • ${currentUser?.phone || '+91 98200 14829'}`,
    doctorName: '',
    notes: '',
  });

  const cooldown = getDonorCooldownStatus();

  const handleCreateSurgerySubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.surgeryType) return;
    createPlannedSurgery(formData);
    setShowNewSurgeryModal(false);
    setFormData({
      patientName: '',
      patientAge: '',
      bloodGroup: 'B+',
      componentType: 'Whole Blood / PRBC',
      surgeryType: '',
      hospitalName: hospitals[0]?.name || 'Lilavati Hospital & Research Centre',
      surgeryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      unitsRequired: 2,
      familyContact: `${currentUser?.name || 'Attendant'} • ${currentUser?.phone || '+91 98200 14829'}`,
      doctorName: '',
      notes: '',
    });
  };

  const filteredCircles = buddyCircles.filter((c) => {
    if (selectedCircleFilter === 'ALL') return true;
    return c.bloodGroup === selectedCircleFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emergency-900 via-emergency-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 rounded-full bg-emergency-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 text-rose-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Horizon 2 • Proactive Healthcare Ecosystem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Scheduled & Recurring Care Network
            </h1>
            <p className="text-sm text-rose-100 leading-relaxed">
              Moving beyond last-minute emergency panic. Protect Thalassemia children with recurring 4-donor circles and pledge advance replacement units for planned hospital surgeries.
            </p>
          </div>

          {/* Quick Metrics Pill */}
          <div className="flex items-center gap-3 bg-black/30 p-3.5 rounded-2xl border border-white/10 text-xs shrink-0">
            <div className="text-center px-2 border-r border-white/15">
              <div className="text-lg font-black text-amber-300">{buddyCircles.length}</div>
              <div className="text-[11px] text-slate-300">Active Circles</div>
            </div>
            <div className="text-center px-2 border-r border-white/15">
              <div className="text-lg font-black text-emerald-400">
                {buddyCircles.reduce((acc, c) => acc + c.pledgedDonors.length, 0)}
              </div>
              <div className="text-[11px] text-slate-300">Pledged Donors</div>
            </div>
            <div className="text-center px-2">
              <div className="text-lg font-black text-rose-300">{plannedSurgeries.length}</div>
              <div className="text-[11px] text-slate-300">Pre-Surgery Needs</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 pt-6 mt-6 border-t border-white/15">
          <button
            onClick={() => setActiveSubTab('circles')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeSubTab === 'circles'
                ? 'bg-white text-emergency-900 shadow-md font-extrabold'
                : 'bg-white/10 text-rose-100 hover:bg-white/20'
            }`}
          >
            <Users className="w-4 h-4 text-emergency-600" />
            <span>Thalassemia Blood Buddy Circles</span>
          </button>

          <button
            onClick={() => setActiveSubTab('surgeries')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
              activeSubTab === 'surgeries'
                ? 'bg-white text-emergency-900 shadow-md font-extrabold'
                : 'bg-white/10 text-rose-100 hover:bg-white/20'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4 text-emergency-600" />
            <span>Pre-Surgery Donor Pledges</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: THALASSEMIA BUDDY CIRCLES */}
      {activeSubTab === 'circles' && (
        <div className="space-y-6">
          {/* Why Blood Buddy Circles Matter - Clinical Explanation Banner */}
          <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-emergency-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-slate-900">
                  How "Adopt a Blood Buddy Circle" Works (4 Donors • 1 Child • 365 Days)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Patients with Thalassemia Major require safe transfusions every 21 days. With the 90-day medical cooldown, just <strong>4 pledged donors</strong> cycling across 4 quarters ensure a child never misses a transfusion or faces hospital stockouts.
                </p>
              </div>
            </div>

            {/* Blood Group Filter */}
            <div className="flex items-center space-x-1.5 self-end sm:self-center shrink-0">
              <span className="text-xs font-bold text-slate-500 mr-1">Filter:</span>
              {['ALL', 'O-', 'B+', 'A+'].map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedCircleFilter(bg)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedCircleFilter === bg
                      ? 'bg-emergency-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Circles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCircles.map((circle) => {
              const pledgedCount = circle.pledgedDonors.length;
              const isFull = pledgedCount >= circle.targetDonorsCount;
              const isCurrentUserPledged = circle.pledgedDonors.some(
                (d) => d.id === currentUser?.id || d.name === currentUser?.name || d.name === activeDonor.name
              );
              const percent = Math.min(100, Math.round((pledgedCount / circle.targetDonorsCount) * 100));

              return (
                <div
                  key={circle.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-5">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={circle.avatar}
                          alt={circle.patientName}
                          className="w-13 h-13 rounded-2xl object-cover border-2 border-rose-100 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h3 className="text-base font-extrabold text-slate-900">
                              {circle.patientName}
                            </h3>
                            <span className="text-xs text-slate-500 font-medium">
                              ({circle.patientAge} yrs)
                            </span>
                          </div>
                          <span className="inline-block text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md mt-0.5">
                            {circle.condition}
                          </span>
                        </div>
                      </div>

                      {/* Blood Group Badge */}
                      <span className="w-11 h-11 rounded-2xl bg-emergency-50 border border-emergency-200 text-emergency-700 font-black text-sm flex items-center justify-center shadow-2xs shrink-0">
                        {circle.bloodGroup}
                      </span>
                    </div>

                    {/* Patient Story */}
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                      "{circle.story}"
                    </p>

                    {/* Hospital & Doctor Note */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{circle.hospitalName}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{circle.doctorName}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-emerald-700 font-bold bg-emerald-50/80 px-2 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Next Due: {circle.nextTransfusionDate} (Every {circle.transfusionCycleDays}d)</span>
                      </div>
                    </div>

                    {/* Progress Bar of Blood Buddy Circle */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-emergency-600" />
                          <span>Buddy Circle Commitment</span>
                        </span>
                        <span className="font-extrabold text-emergency-600">
                          {pledgedCount} of {circle.targetDonorsCount} Donors
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emergency-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      {/* Pledged Donors avatars / slots */}
                      <div className="pt-2 space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Confirmed Rotation Donors:
                        </span>
                        <div className="space-y-1">
                          {circle.pledgedDonors.map((d, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-150"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 rounded-full bg-emergency-100 text-emergency-700 text-[10px] font-black flex items-center justify-center">
                                  {d.name[0]}
                                </span>
                                <span className="font-semibold text-slate-800">{d.name}</span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">{d.rotationSlot}</span>
                            </div>
                          ))}

                          {/* Empty Slot Placeholder */}
                          {!isFull && (
                            <div className="flex items-center justify-between text-xs bg-rose-50/60 border border-dashed border-rose-300 px-2.5 py-1.5 rounded-xl text-rose-700">
                              <span className="font-bold">Slot {pledgedCount + 1}: Open for Voluntary Donor</span>
                              <span className="text-[10px] font-extrabold uppercase">Waiting for Pledge</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    {isCurrentUserPledged ? (
                      <div className="w-full py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>You are in this Circle (Rotation Confirmed)</span>
                      </div>
                    ) : isFull ? (
                      <div className="w-full py-2.5 px-3 bg-slate-200/80 text-slate-600 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-slate-500" />
                        <span>Circle Fully Supported (4/4 Donors)</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => joinBuddyCircle(circle.id)}
                        className="w-full py-2.5 px-4 bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all transform active:scale-98 flex items-center justify-center space-x-1.5"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Join Buddy Circle as Regular Donor</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PRE-SURGERY DONOR PLEDGES */}
      {activeSubTab === 'surgeries' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Upcoming Planned Surgeries (7–14 Days Standby)
              </h2>
              <p className="text-xs text-slate-500">
                Pledge replacement units in advance so patient families do not spend the eve of major surgery scrambling for donors.
              </p>
            </div>

            <button
              onClick={() => setShowNewSurgeryModal(true)}
              className="px-4 py-2 bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 self-start sm:self-center transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Planned Surgery Need</span>
            </button>
          </div>

          {/* Surgeries List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plannedSurgeries.map((surg) => {
              const isFulfilled = surg.unitsPledged >= surg.unitsRequired;
              const hasPledged = surg.pledgedDonors.some((d) => d.name.includes(currentUser?.name || activeDonor.name));

              return (
                <div
                  key={surg.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Top Status & Date */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wide bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                            {surg.id}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isFulfilled
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isFulfilled ? '✓ Pledges Met' : `${surg.unitsRequired - surg.unitsPledged} Units Needed`}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mt-1">
                          {surg.patientName}
                          <span className="text-xs text-slate-500 font-normal ml-1.5">
                            ({surg.patientAge} yrs)
                          </span>
                        </h3>
                        <p className="text-xs font-bold text-emergency-700">{surg.surgeryType}</p>
                      </div>

                      {/* Blood Group Badge */}
                      <div className="text-center shrink-0">
                        <span className="w-12 h-12 rounded-2xl bg-emergency-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-emergency-600/20">
                          {surg.bloodGroup}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold block mt-1">
                          {surg.componentType.split('/')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Operational Details */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Operation Date:</span>
                        <span className="font-extrabold text-slate-800 flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-emergency-600" />
                          <span>{surg.surgeryDate}</span>
                        </span>
                        <span className="text-[11px] text-rose-600 font-semibold block mt-0.5">
                          (In {surg.daysUntilSurgery} days)
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospital & Doctor:</span>
                        <span className="font-bold text-slate-800 block truncate mt-0.5">{surg.hospitalName}</span>
                        <span className="text-[11px] text-slate-500 block truncate">{surg.doctorName}</span>
                      </div>
                    </div>

                    {/* Pledge Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Advance Donor Standby Units</span>
                        <span className="font-extrabold text-emergency-600">
                          {surg.unitsPledged} of {surg.unitsRequired} Units Pledged
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${(surg.unitsPledged / surg.unitsRequired) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Pledged List */}
                    {surg.pledgedDonors.length > 0 && (
                      <div className="space-y-1 text-xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Confirmed Standby Donors:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {surg.pledgedDonors.map((p, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center space-x-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{p.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="pt-3 border-t border-slate-100">
                    {hasPledged ? (
                      <div className="py-2.5 px-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>You Pledged Standby for this Surgery Date</span>
                      </div>
                    ) : isFulfilled ? (
                      <div className="py-2.5 px-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold text-center">
                        All Standby Donors Confirmed ✓
                      </div>
                    ) : (
                      <button
                        onClick={() => pledgePlannedSurgery(surg.id)}
                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                      >
                        <CalendarCheck2 className="w-4 h-4" />
                        <span>Pledge Standby Donation for {surg.surgeryDate}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* POST PLANNED SURGERY MODAL */}
      {showNewSurgeryModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="bg-gradient-to-r from-emergency-800 to-slate-900 text-white p-6">
              <h3 className="text-lg font-black">Register a Planned Surgery Need</h3>
              <p className="text-xs text-rose-200 mt-1">
                Post requirements 7–14 days in advance so voluntary donors can commit to your schedule.
              </p>
            </div>

            <form onSubmit={handleCreateSurgerySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g., Ramesh Kulkarni"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emergency-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Patient Age</label>
                  <input
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                    placeholder="e.g., 52"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emergency-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Surgery / Operation Type</label>
                <input
                  type="text"
                  required
                  value={formData.surgeryType}
                  onChange={(e) => setFormData({ ...formData, surgeryType: e.target.value })}
                  placeholder="e.g., Coronary Artery Bypass Graft (CABG)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emergency-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Units Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.unitsRequired}
                    onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Operation Date</label>
                  <input
                    type="date"
                    required
                    value={formData.surgeryDate}
                    onChange={(e) => setFormData({ ...formData, surgeryDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hospital Name</label>
                <select
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.name}>{h.name} ({h.area})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Surgeon / Doctor Name</label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  placeholder="e.g., Dr. A. K. Deshmukh"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewSurgeryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emergency-600 hover:bg-emergency-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Publish Pre-Surgery Need
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
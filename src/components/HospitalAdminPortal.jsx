import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  Radio,
  Award,
  AlertTriangle,
  ArrowRightLeft,
  Sparkles,
  Zap,
  TrendingUp,
  Send,
  Truck,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

export default function HospitalAdminPortal() {
  const {
    language,
    requests,
    hospitals,
    verifyRequisition,
    setActiveTrackingRequestId,
    setActiveTab,
    nearExpiryStock,
    broadcastStockTransfer,
    cityDemandAlert,
    preAlertDonors,
  } = useApp();

  const t = (key) => getTranslation(language, key);
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]?.id || 'hosp-1');
  const [filterVerified, setFilterVerified] = useState('all');

  const filteredRequests = requests.filter((r) => {
    if (filterVerified === 'verified') return r.slipVerified;
    if (filterVerified === 'pending') return !r.slipVerified;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in">
      {/* Admin Portal Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-purple-500/20 text-purple-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Hospital Blood Bank Verifier & Supply Exchange</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Hospital Authority Console & Stock Exchange
            </h2>
            <p className="text-xs text-purple-200 mt-1 max-w-xl">
              Prevent fraud by validating doctor requisition slips, prevent wastage with the near-expiry stock exchange, and forecast municipal blood shortages.
            </p>
          </div>

          <div className="bg-purple-950/60 p-3.5 rounded-2xl border border-purple-800/80 text-right">
            <span className="text-[10px] uppercase font-bold text-purple-300">
              Hospital Authority
            </span>
            <div className="text-sm font-black text-white">Lilavati Hospital & Research Centre</div>
            <span className="text-[10px] text-emerald-400 font-medium">Licensed Blood Bank #MH-881</span>
          </div>
        </div>
      </div>

      {/* FEATURE 4B: SEASONAL DEMAND & SHORTAGE PREDICTOR BANNER */}
      {cityDemandAlert && (
        <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-amber-500/30 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-200 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                  Predictive City Health Advisory
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {cityDemandAlert.timeframe}
                </span>
              </div>

              <h3 className="text-lg font-black text-white tracking-tight">
                {cityDemandAlert.title}
              </h3>

              <p className="text-xs text-amber-100 leading-relaxed">
                {cityDemandAlert.impactSummary} High urgency for{' '}
                <strong>{cityDemandAlert.criticalComponent}</strong> across groups{' '}
                <strong>{cityDemandAlert.inDemandGroups.join(', ')}</strong> in{' '}
                {cityDemandAlert.city}.
              </p>
            </div>

            {/* Metric pill & action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="bg-black/40 border border-amber-400/20 px-4 py-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">
                  Projected SDP Surge
                </span>
                <span className="text-2xl font-black text-amber-400 flex items-center justify-center space-x-1 mt-0.5">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>+{cityDemandAlert.projectedSurgePercentage}%</span>
                </span>
              </div>

              {!cityDemandAlert.preAlertDispatched ? (
                <button
                  onClick={preAlertDonors}
                  className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>⚡ Pre-Alert 42 Eligible Donors</span>
                </button>
              ) : (
                <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div>✓ 42 Donors Alerted via Push & SMS</div>
                    <div className="text-[10px] text-emerald-300 font-normal">
                      {cityDemandAlert.confirmedBookingsCount} Donors already booked fast-track slots
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4A: SHELF-LIFE & NEAR-EXPIRY STOCK EXCHANGE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded mb-1">
              <ArrowRightLeft className="w-3 h-3 text-emergency-600" />
              <span>Zero-Wastage Initiative</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Inter-Hospital Near-Expiry Stock Exchange
            </h3>
            <p className="text-xs text-slate-500">
              Platelets expire in only 5 days (120 hours). Broadcast units nearing shelf-life to partner oncology/trauma hospitals before expiration.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-emergency-800 border border-rose-200 self-start sm:self-auto">
            {nearExpiryStock.length} Units Monitored
          </span>
        </div>

        {/* Near Expiry Stock Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="pb-3">Unit Barcode</th>
                <th className="pb-3">Component Type</th>
                <th className="pb-3">Group & Units</th>
                <th className="pb-3">Storage / Remaining Shelf-Life</th>
                <th className="pb-3">Partner Hospital Route</th>
                <th className="pb-3 text-right">Transfer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nearExpiryStock.map((stock) => {
                const isAccepted = stock.transferBroadcastStatus === 'ACCEPTED';

                return (
                  <tr key={stock.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Barcode */}
                    <td className="py-4 font-mono font-bold text-slate-800">
                      {stock.unitBarcode}
                    </td>

                    {/* Component */}
                    <td className="py-4">
                      <span className="font-extrabold text-slate-900 block">{stock.component}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{stock.storageCondition}</span>
                    </td>

                    {/* Group & Units */}
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-lg bg-emergency-50 border border-emergency-200 text-emergency-700 font-black text-xs flex items-center justify-center">
                          {stock.bloodGroup}
                        </span>
                        <span className="font-bold text-slate-800">{stock.units} Units</span>
                      </div>
                    </td>

                    {/* Shelf Life */}
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                          stock.remainingHours <= 24
                            ? 'bg-rose-100 text-emergency-800 animate-pulse'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{stock.remainingHours} Hours Remaining</span>
                      </span>
                    </td>

                    {/* Target Hospital */}
                    <td className="py-4">
                      <span className="font-bold text-slate-800 block">
                        {stock.assignedHospital || stock.suggestedTransferHospital}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Auto-Recommended Route</span>
                    </td>

                    {/* Transfer Button */}
                    <td className="py-4 text-right">
                      {isAccepted ? (
                        <div className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs">
                          <Truck className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                          <span>Dispatched ({stock.transferTimestamp || 'Just now'})</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => broadcastStockTransfer(stock.id)}
                          className="bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition-all transform active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Broadcast Transfer Alert</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Requests Verification Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Emergency Requisition Verification Queue
            </h3>
            <p className="text-xs text-slate-500">
              Cross-check doctor prescriptions and authorize priority radius alerts.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setFilterVerified('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterVerified === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Requests ({requests.length})
            </button>
            <button
              onClick={() => setFilterVerified('pending')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterVerified === 'pending'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending Slip
            </button>
            <button
              onClick={() => setFilterVerified('verified')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterVerified === 'verified'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Verified Badges
            </button>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-black text-slate-900">{req.patientName}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emergency-100 text-emergency-800 uppercase">
                      {req.urgency}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {req.hospitalName} • Case ID: <span className="font-mono">{req.id}</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-emergency-600 text-white flex items-center justify-center font-black text-sm shadow">
                  {req.bloodGroup}
                </div>
              </div>

              {/* Requisition Slip Preview */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center space-x-3">
                <img
                  src={req.doctorSlip}
                  alt="Doctor requisition"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-800">Doctor's Official Requisition Slip</div>
                  <div className="text-[11px] text-slate-500">
                    {req.verificationDoctor || 'Awaiting Hospital Admin Verification'}
                  </div>
                  {req.slipVerified ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Hospital / Admin Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Requires Manual Authorization</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
                {!req.slipVerified ? (
                  <button
                    onClick={() => verifyRequisition(req.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Verify Slip</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTrackingRequestId(req.id);
                      setActiveTab('tracker');
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5"
                  >
                    <Radio className="w-4 h-4" />
                    <span>View Live Dispatch & Map</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
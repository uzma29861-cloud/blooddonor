import React, { useState } from 'react';
import {
  Car,
  Navigation,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  CreditCard,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SponsorRideModal() {
  const { rideModal, closeRideModal, activeDonor } = useApp();
  const { isOpen, request } = rideModal;

  const [selectedProvider, setSelectedProvider] = useState('uber');
  const [rideBooked, setRideBooked] = useState(false);

  if (!isOpen || !request) return null;

  const pickupLocation = `${request.acceptedByDonorName || activeDonor.name}'s Area (Bandra West)`;
  const dropLocation = `${request.hospitalName} Emergency OT Gate`;

  const rides = [
    {
      id: 'uber',
      name: 'Uber Go (AC Sedan)',
      eta: '3 mins away',
      fare: '₹140',
      tag: 'Most Reliable',
      icon: '🚗',
      color: 'border-slate-800 bg-slate-50',
    },
    {
      id: 'ola',
      name: 'Ola Mini (Fast Cab)',
      eta: '4 mins away',
      fare: '₹135',
      tag: 'Fast Pickup',
      icon: '🚕',
      color: 'border-amber-600 bg-amber-50/50',
    },
    {
      id: 'rapido',
      name: 'Rapido Bike Taxi (Beat Traffic)',
      eta: '2 mins away',
      fare: '₹65',
      tag: 'Fastest in Congestion',
      icon: '🛵',
      color: 'border-yellow-500 bg-yellow-50/50',
    },
  ];

  const handleConfirmRide = () => {
    setRideBooked(true);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                🚗
              </span>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">
                  Sponsor Donor's Ride to Hospital
                </h3>
                <p className="text-xs text-slate-300">
                  Ensure voluntary donors don't bear personal travel expenses
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setRideBooked(false);
                closeRideModal();
              }}
              className="text-white/80 hover:text-white text-xs font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {!rideBooked ? (
            <>
              {/* Pickup and Drop Route */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span className="w-0.5 h-6 bg-slate-300 my-0.5"></span>
                    <span className="w-3 h-3 rounded-full bg-emergency-600"></span>
                  </div>
                  <div className="space-y-3 flex-1 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Donor Pickup Point
                      </span>
                      <span className="font-extrabold text-slate-900">{pickupLocation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Hospital Drop Point
                      </span>
                      <span className="font-extrabold text-slate-900">{dropLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ride Options */}
              <div className="space-y-2.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Ride Provider:
                </label>

                {rides.map((ride) => {
                  const isSelected = selectedProvider === ride.id;
                  return (
                    <div
                      key={ride.id}
                      onClick={() => setSelectedProvider(ride.id)}
                      className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{ride.icon}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-extrabold text-slate-900">
                              {ride.name}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                              {ride.tag}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{ride.eta}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">{ride.fare}</span>
                        <span className="text-[10px] text-slate-400 block">Family Sponsored</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmRide}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>Confirm & Dispatch Sponsored Ride</span>
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  Trip live tracking link will be automatically shared with the voluntary donor.
                </p>
              </div>
            </>
          ) : (
            /* Ride Confirmed Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Ride Booked & En Route to Donor
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-2">
                  Driver Rajesh (White Swift Dzire • MH-02-EE-4192)
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Arriving at donor's Bandra West pickup in <strong>3 minutes</strong>. Direct destination set to Lilavati Hospital Emergency OT.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                Donor has received the live ride PIN and driver details via in-app notification.
              </div>

              <button
                type="button"
                onClick={() => {
                  setRideBooked(false);
                  closeRideModal();
                }}
                className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-bold text-xs"
              >
                Return to Live Tracker
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PreDonationQuizModal() {
  const { quizModal, handleQuizSuccess, handleQuizFailure } = useApp();
  const { isOpen, requestId, donorId } = quizModal;

  const [answers, setAnswers] = useState({
    q1: null, // Antibiotics / alcohol in 48h? (Must be 'no')
    q2: null, // Tattoos / piercings in 6mo? (Must be 'no')
    q3: null, // Weight above 50kg? (Must be 'yes')
    q4: null, // Healthy & fever-free? (Must be 'yes')
  });

  const [timerSeconds, setTimerSeconds] = useState(20);
  const [quizFailed, setQuizFailed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAnswers({ q1: null, q2: null, q3: null, q4: null });
      setTimerSeconds(20);
      setQuizFailed(false);
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (qKey, value) => {
    setAnswers((prev) => ({ ...prev, [qKey]: value }));
  };

  const isComplete =
    answers.q1 !== null &&
    answers.q2 !== null &&
    answers.q3 !== null &&
    answers.q4 !== null;

  const evaluateQuiz = () => {
    const passed =
      answers.q1 === 'no' &&
      answers.q2 === 'no' &&
      answers.q3 === 'yes' &&
      answers.q4 === 'yes';

    if (passed) {
      handleQuizSuccess(requestId, donorId);
    } else {
      setQuizFailed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emergency-700 to-emergency-800 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-rose-200" />
              </span>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">
                  20-Second Pre-Donation Medical Check
                </h3>
                <p className="text-xs text-rose-100">
                  National Blood Transfusion Council Safety Protocol
                </p>
              </div>
            </div>

            {/* 20s Timer Ring */}
            <div className="flex items-center space-x-1 bg-black/20 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-rose-100">
              <Clock className="w-3.5 h-3.5" />
              <span>{timerSeconds}s</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {!quizFailed ? (
            <>
              <p className="text-xs text-slate-600 font-medium">
                Please answer truthfully to protect both patient safety and your own health before accepting this emergency case:
              </p>

              <div className="space-y-3">
                {/* Question 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    1. Have you taken any antibiotics or alcohol in the last 48 hours?
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSelect('q1', 'no')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        answers.q1 === 'no'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      No (Eligible)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect('q1', 'yes')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        answers.q1 === 'yes'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {/* Question 2 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    2. Have you had any tattoos, piercings, or surgery in the last 6 months?
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSelect('q2', 'no')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        answers.q2 === 'no'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      No (Eligible)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect('q2', 'yes')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        answers.q2 === 'yes'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {/* Question 3 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    3. Is your body weight currently above 50 kg?
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSelect('q3', 'yes')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        answers.q3 === 'yes'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Yes (&gt; 50 kg)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect('q3', 'no')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        answers.q3 === 'no'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      No (&le; 50 kg)
                    </button>
                  </div>
                </div>

                {/* Question 4 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    4. Are you feeling completely healthy and fever-free today?
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSelect('q4', 'yes')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        answers.q4 === 'yes'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Yes (Healthy)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect('q4', 'no')}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        answers.q4 === 'no'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  disabled={!isComplete}
                  onClick={evaluateQuiz}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                    isComplete
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Eligibility & Confirm Match</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuizFailure(requestId)}
                  className="py-3 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            /* Failed Eligibility Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Temporary Deferral for Medical Safety
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Thank you deeply for your noble intent to donate. However, based on the medical safety standards of the National Blood Transfusion Council, you are currently temporarily deferred.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold">
                ✓ Don't worry! This emergency SOS has been <strong>automatically rerouted to the next nearby compatible donor</strong>.
              </div>

              <button
                type="button"
                onClick={() => handleQuizFailure(requestId)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-bold text-xs"
              >
                Close & Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

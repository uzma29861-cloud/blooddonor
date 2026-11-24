import React from 'react';
import { Globe, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, getTranslation } from '../utils/translations';

export default function LanguageSelectorModal() {
  const { language, changeLanguage, showLanguageModal, setShowLanguageModal } = useApp();

  if (!showLanguageModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-br from-emergency-600 to-emergency-800 p-6 text-white text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Choose Your Preferred Language
          </h2>
          <p className="text-xs text-emergency-100 mt-1 font-medium">
            आपकी भाषा • तुमची भाषा • તમારી ભાષા
          </p>
        </div>

        {/* Language Options */}
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-emergency-600 bg-emergency-50/70 text-emergency-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="text-sm font-bold">{lang.native}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{lang.label}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emergency-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3">
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-slate-900/10 transition-all active:scale-[0.98]"
            >
              <span>{getTranslation(language, 'continueBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400 font-medium pt-1">
            You can change your language anytime from the top bar.
          </p>
        </div>
      </div>
    </div>
  );
}

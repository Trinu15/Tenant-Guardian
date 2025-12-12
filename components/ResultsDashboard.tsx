import React from 'react';
import { RiskAnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, MapPin, IndianRupee, MessageSquare, Image as ImageIcon, ShieldAlert, ArrowLeft, UserCheck, Globe, Database } from 'lucide-react';
import { translations } from '../translations';

interface ResultsDashboardProps {
  result: RiskAnalysisResult;
  onReset: () => void;
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset, language }) => {
  const t = translations[language];

  const getVerdictBg = (color: string) => {
    switch (color) {
      case 'RED': return 'bg-red-400';
      case 'YELLOW': return 'bg-amber-400';
      case 'GREEN': return 'bg-emerald-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header & Navigation */}
      <button 
        onClick={onReset}
        className="flex items-center text-gray-600 hover:text-violet-600 transition font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> {t.startNew}
      </button>

      {/* Hero Section: Score & Verdict */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className={`${getVerdictBg(result.verdictColor)} p-4 text-center text-white font-bold text-xl uppercase tracking-wider shadow-inner`}>
          {result.verdict}
        </div>
        
        <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                className="text-gray-100"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
              />
              <circle
                className={result.verdictColor === 'RED' ? 'text-red-400' : result.verdictColor === 'YELLOW' ? 'text-amber-400' : 'text-emerald-400'}
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * result.riskScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-4xl font-extrabold text-gray-800">{result.riskScore}%</span>
              <p className="text-xs text-gray-500 font-semibold uppercase">{t.riskScore}</p>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.analysisSummary}</h3>
            <p className="text-gray-600 leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Detailed Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Geo-Location */}
        <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${result.geoLog.status === 'FAIL' ? 'border-red-400' : 'border-emerald-400'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <MapPin className="w-5 h-5 text-violet-400" /> {t.locationLogic}
            </h4>
            {result.geoLog.status === 'FAIL' ? (
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">{t.mismatch}</span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">{t.consistent}</span>
            )}
          </div>
          <p className="text-sm text-gray-600">{result.geoLog.details}</p>
        </div>

        {/* Pricing */}
        <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${result.priceLog.status === 'HIGH_RISK' ? 'border-red-400' : result.priceLog.status === 'MODERATE_RISK' ? 'border-amber-400' : 'border-emerald-400'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <IndianRupee className="w-5 h-5 text-violet-400" /> {t.priceIndex}
            </h4>
             {result.priceLog.status === 'HIGH_RISK' ? (
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">{t.suspicious}</span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">{t.fairMarket}</span>
            )}
          </div>
          <p className="text-sm text-gray-600">{result.priceLog.details}</p>
        </div>

        {/* Textual Analysis */}
        <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${result.textLog.status === 'DETECTED' ? 'border-red-400' : 'border-emerald-400'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <MessageSquare className="w-5 h-5 text-violet-400" /> {t.textPatterns}
            </h4>
            {result.textLog.status === 'DETECTED' ? (
              <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">{t.scamPhrases}</span>
            ) : (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">{t.clean}</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{result.textLog.details}</p>
          {result.textLog.keywordsFound && result.textLog.keywordsFound.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {result.textLog.keywordsFound.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded border border-red-100 font-mono">
                  "{kw}"
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Photo Integrity */}
        <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${result.photoLog.integrityScore < 5 ? 'border-red-400' : 'border-emerald-400'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <ImageIcon className="w-5 h-5 text-violet-400" /> {t.photoIntegrity}
            </h4>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.photoLog.integrityScore < 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              SCORE: {result.photoLog.integrityScore}/10
            </span>
          </div>
          <p className="text-sm text-gray-600">{result.photoLog.details}</p>
        </div>

        {/* Ownership Verification (Enhanced Feature) */}
        {result.ownershipLog && (
          <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${result.ownershipLog.status === 'SUSPICIOUS' ? 'border-red-400' : result.ownershipLog.status === 'UNKNOWN' ? 'border-amber-400' : 'border-emerald-400'} md:col-span-2`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                <Database className="w-5 h-5 text-violet-400" /> {t.ownershipAuth}
              </h4>
              {result.ownershipLog.status === 'SUSPICIOUS' ? (
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">{t.identityMismatch}</span>
              ) : result.ownershipLog.status === 'UNKNOWN' ? (
                 <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">{t.unverified}</span>
              ) : (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">{t.identityVerified}</span>
              )}
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{t.publicRecordSim}</p>
              <p className="text-sm text-gray-600 italic">
                "{t.publicRecordText}"
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              <span className="font-bold">{t.findings}</span>
              {result.ownershipLog.details}
            </p>
          </div>
        )}

      </div>

      {/* Actionable Steps */}
      <div className="bg-gray-800 text-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-300" />
            {t.actionPlan}
          </h3>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {result.actionableSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-400 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-200">{step}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
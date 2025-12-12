import React, { useState } from 'react';
import { Upload, FileCheck, Globe, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { translations } from '../translations';
import { verifyDocument } from '../services/geminiService';

interface DocVerificationProps {
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
}

const DocVerification: React.FC<DocVerificationProps> = ({ language }) => {
  const t = translations[language];
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        setFileData({
          base64: base64Content,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!fileData) return;
    setIsChecking(true);
    try {
      const data = await verifyDocument(fileData.base64, fileData.mimeType, language);
      setResult(data);
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl p-8 text-white shadow-lg w-full">
        <div className="flex items-center gap-3 mb-2">
          <FileCheck className="w-8 h-8" />
          <h1 className="text-3xl font-bold tracking-tight">Check.AI</h1>
        </div>
        <p className="text-teal-50 text-lg">
          {t.checkAiSubtitle}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${result ? 'xl:grid-cols-2' : ''} gap-8 transition-all`}>
        {/* Upload Section */}
        <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-200 transition-all ${!result ? 'max-w-4xl mx-auto w-full' : 'w-full h-fit'}`}>
          <div className="flex flex-col items-center justify-center w-full">
            <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${previewUrl ? 'border-teal-400 bg-teal-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-xl" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="bg-teal-100 p-4 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-teal-500" />
                  </div>
                  <p className="mb-2 text-lg text-gray-700 font-medium">{t.clickUpload}</p>
                  <p className="text-sm text-gray-500">{t.formats}</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          {fileData && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleVerify}
                disabled={isChecking}
                className="px-8 py-3 bg-teal-400 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
              >
                {isChecking ? (
                   <>
                     <Search className="w-5 h-5 animate-spin" />
                     {t.analyzing}
                   </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5" />
                    {t.checkAiBtn}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 h-fit">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-800">{t.checkAiResult}</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-6">
                
                {/* Verdict Card */}
                <div className={`p-5 rounded-xl border-l-4 ${result.verdict.includes("UNIQUE") ? 'bg-emerald-50 border-emerald-400' : 'bg-red-50 border-red-400'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className={`w-5 h-5 ${result.verdict.includes("UNIQUE") ? 'text-emerald-500' : 'text-red-500'}`} />
                    <span className="font-bold text-sm uppercase tracking-wide text-gray-500">{t.internetPresence}</span>
                  </div>
                  <h4 className={`text-2xl font-extrabold ${result.verdict.includes("UNIQUE") ? 'text-emerald-600' : 'text-red-600'}`}>
                    {result.verdict}
                  </h4>
                </div>

                {/* Description Card */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                   <div className="flex items-center gap-2 mb-2">
                    <FileCheck className="w-5 h-5 text-slate-600" />
                    <span className="font-bold text-sm uppercase tracking-wide text-gray-500">{t.aiDescription}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {result.details}
                  </p>
                  {result.sources && result.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs font-bold text-gray-400 mb-2">FOUND ON:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {result.sources.map((src: string, i: number) => (
                          <li key={i} className="text-xs text-blue-500 truncate underline">{src}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocVerification;
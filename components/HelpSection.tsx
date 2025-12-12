import React from 'react';
import { translations } from '../translations';
import { ShieldCheck, Search, FileSearch, MessageCircle, AlertOctagon } from 'lucide-react';

interface HelpSectionProps {
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
}

const HelpSection: React.FC<HelpSectionProps> = ({ language }) => {
  const t = translations[language];

  const steps = [
    {
      icon: <AlertOctagon className="w-8 h-8 text-violet-500" />,
      title: t.step1Title,
      desc: t.step1Desc,
      color: "bg-violet-50 border-violet-100"
    },
    {
      icon: <Search className="w-8 h-8 text-emerald-500" />,
      title: t.step2Title,
      desc: t.step2Desc,
      color: "bg-emerald-50 border-emerald-100"
    },
    {
      icon: <FileSearch className="w-8 h-8 text-sky-500" />,
      title: t.step3Title,
      desc: t.step3Desc,
      color: "bg-sky-50 border-sky-100"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-fuchsia-500" />,
      title: t.step4Title,
      desc: t.step4Desc,
      color: "bg-fuchsia-50 border-fuchsia-100"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-violet-400 rounded-2xl shadow-lg mb-4">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{t.helpTitle}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.helpSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, index) => (
          <div key={index} className={`p-8 rounded-2xl border ${step.color} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm">
                {step.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-center text-white">
        <h3 className="text-xl font-bold mb-4">Tenant Guardian AI Beta v1.1</h3>
        <p className="text-gray-400 max-w-3xl mx-auto text-sm">
          {t.footer}
        </p>
      </div>
    </div>
  );
};

export default HelpSection;
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Heart, Save, Check, AlertCircle } from 'lucide-react';
import { translations } from '../translations';

interface ProfileProps {
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
}

const Profile: React.FC<ProfileProps> = ({ language }) => {
  const t = translations[language];
  const [isSaved, setIsSaved] = useState(false);
  
  // Initialize state from localStorage or defaults
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) return JSON.parse(saved);
    return {
      fullName: 'Tenant User',
      email: 'user@tenantguardian.ai',
      phone: '',
      address: '',
      occupation: '',
      employer: '',
      income: '',
      emergencyName: '',
      emergencyPhone: '',
      bio: ''
    };
  });

  const [completion, setCompletion] = useState(0);

  // Calculate completion percentage
  useEffect(() => {
    const totalFields = Object.keys(profile).length;
    const filledFields = Object.values(profile).filter(val => val && val.toString().trim() !== '').length;
    const percent = Math.round((filledFields / totalFields) * 100);
    setCompletion(percent);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-8 text-white relative">
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white/30 text-violet-500">
                <User className="w-12 h-12" />
             </div>
             <div>
               <h1 className="text-3xl font-bold">{t.profileTitle}</h1>
               <p className="text-violet-100 mt-1 max-w-lg">{t.profileSubtitle}</p>
             </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute left-0 bottom-0 w-48 h-48 bg-black opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{t.completion}</h3>
            <span className={`text-2xl font-bold ${completion === 100 ? 'text-emerald-500' : 'text-violet-600'}`}>
              {completion}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${completion === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`}
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          {completion < 100 && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Complete all fields to reach 100%
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Personal Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-5 h-5 text-violet-500" /> {t.personalDetails}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">{t.fullName}</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-400 outline-none transition"
              />
            </div>
            
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">{t.email}</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full p-3 pl-10 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-600">{t.bio}</label>
              <textarea
                name="bio"
                rows={3}
                value={profile.bio}
                onChange={handleChange}
                placeholder={t.bioPlaceholder}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-400 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Phone className="w-5 h-5 text-fuchsia-500" /> {t.contactDetails}
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">{t.phone}</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fuchsia-400 outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">{t.currentAddress}</label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fuchsia-400 outline-none transition"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Employment & Financial */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-3">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Briefcase className="w-5 h-5 text-emerald-500" /> {t.employmentDetails}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">{t.occupation}</label>
              <input
                type="text"
                name="occupation"
                value={profile.occupation}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">{t.employer}</label>
              <input
                type="text"
                name="employer"
                value={profile.employer}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">{t.incomeRange}</label>
              <div className="relative">
                <select
                  name="income"
                  value={profile.income}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none transition appearance-none"
                >
                  <option value="">Select Range</option>
                  <option value="0-5L">₹0 - ₹5,00,000</option>
                  <option value="5-10L">₹5,00,000 - ₹10,00,000</option>
                  <option value="10-20L">₹10,00,000 - ₹20,00,000</option>
                  <option value="20L+">₹20,00,000+</option>
                </select>
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400" /> {t.emergencyName}
              </label>
              <input
                type="text"
                name="emergencyName"
                value={profile.emergencyName}
                onChange={handleChange}
                className="w-full p-3 bg-red-50 border border-red-100 rounded-lg focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">{t.emergencyPhone}</label>
              <input
                type="tel"
                name="emergencyPhone"
                value={profile.emergencyPhone}
                onChange={handleChange}
                className="w-full p-3 bg-red-50 border border-red-100 rounded-lg focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>
           </div>
        </div>

        {/* Save Button */}
        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transform transition active:scale-95"
          >
             {isSaved ? <Check className="w-5 h-5 text-emerald-400" /> : <Save className="w-5 h-5" />}
             {isSaved ? t.saved : t.saveChanges}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Profile;
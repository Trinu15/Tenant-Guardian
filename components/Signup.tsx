import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { translations } from '../translations';

interface SignupProps {
  onSignup: () => void;
  onNavigateToLogin: () => void;
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
  setLanguage: (lang: 'English' | 'Hindi' | 'French' | 'Spanish') => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Signup: React.FC<SignupProps> = ({ onSignup, onNavigateToLogin, language, setLanguage }) => {
  const t = translations[language];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSignup();
    }, 1000);
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      // Mock Google Profile data for the Profile page
      const mockGoogleProfile = {
        fullName: 'Alex Google',
        email: 'alex.google@gmail.com',
        phone: '',
        address: '',
        occupation: '',
        employer: '',
        income: '',
        emergencyName: '',
        emergencyPhone: '',
        bio: 'Account created via Google Secure Auth'
      };
      localStorage.setItem('user_profile', JSON.stringify(mockGoogleProfile));
      
      setIsGoogleLoading(false);
      onSignup();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
        {/* Right Side - Visual (Reversed for Signup) */}
        <div className="w-full md:w-1/2 bg-gradient-to-bl from-fuchsia-400 to-violet-400 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-fuchsia-100">{t.subtitle}</p>
          </div>
          
          <div className="relative z-10 mt-12">
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm font-medium bg-white/10 p-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                AI-Powered Analysis
              </li>
              <li className="flex items-center gap-2 text-sm font-medium bg-white/10 p-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Identity Verification
              </li>
              <li className="flex items-center gap-2 text-sm font-medium bg-white/10 p-2 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                Scam Pattern Detection
              </li>
            </ul>
          </div>

          {/* Abstract Shapes */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 relative">
          <div className="absolute top-4 right-4 md:left-4 md:right-auto">
             <select 
               value={language}
               onChange={(e) => setLanguage(e.target.value as any)}
               className="bg-slate-100 border-none text-gray-600 text-sm rounded-lg focus:ring-violet-400 block p-2 outline-none cursor-pointer"
             >
               <option value="English">English</option>
               <option value="Hindi">Hindi (हिंदी)</option>
               <option value="French">Français</option>
               <option value="Spanish">Español</option>
             </select>
          </div>

          <div className="mb-8 mt-4">
            <h2 className="text-2xl font-bold text-gray-900">{t.signupTitle}</h2>
            <p className="text-gray-500 text-sm mt-1">{t.signupSubtitle}</p>
          </div>

          <div className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t.fullName}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t.email}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t.password}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    {t.createAccount} <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative bg-white px-4 text-xs text-gray-400 uppercase font-medium">{t.or}</div>
            </div>

            <button
              onClick={handleGoogleSignup}
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-sm transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed gap-3"
            >
              {isGoogleLoading ? (
                 <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (
                <>
                  <GoogleIcon />
                  {t.googleSignUp}
                </>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t.haveAccount}{" "}
              <button 
                onClick={onNavigateToLogin}
                className="font-bold text-fuchsia-600 hover:text-fuchsia-700"
              >
                {t.signIn}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
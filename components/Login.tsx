import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, X, User } from 'lucide-react';
import { translations } from '../translations';

interface LoginProps {
  onLogin: () => void;
  onNavigateToSignup: () => void;
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
  setLanguage: (lang: 'English' | 'Hindi' | 'French' | 'Spanish') => void;
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignup, language, setLanguage }) => {
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const mockAccounts = [
    { name: 'Alex Google', email: 'alex.google@gmail.com' },
    { name: 'Sarah Tenant', email: 'sarah.tenant@gmail.com' },
    { name: 'Rahul Sharma', email: 'rahul.s@gmail.com' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // CREDENTIAL CHECK
      // Enforcing specific credentials as requested
      if (email.toLowerCase() === 'user@tenantguardian.ai' && password === 'password') {
        onLogin();
      } else {
        setError('Invalid credentials provided.');
      }
    }, 1000);
  };

  const handleGoogleBtnClick = () => {
    setShowGoogleModal(true);
  };

  const selectGoogleAccount = (account: typeof mockAccounts[0]) => {
    setIsGoogleLoading(true);
    setShowGoogleModal(false);
    setError(null);

    setTimeout(() => {
      // Mock Google Profile data for the Profile page
      const mockGoogleProfile = {
        fullName: account.name,
        email: account.email,
        phone: '',
        address: '',
        occupation: '',
        employer: '',
        income: '',
        emergencyName: '',
        emergencyPhone: '',
        bio: 'Logged in via Google Secure Auth'
      };
      localStorage.setItem('user_profile', JSON.stringify(mockGoogleProfile));
      
      setIsGoogleLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        {/* Left Side - Visual */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-violet-400 to-fuchsia-400 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-3 rounded-xl mb-6 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-violet-100">{t.subtitle}</p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
              <p className="text-sm font-medium">"Protects tenants by analyzing photos, pricing, and text for scam indicators."</p>
            </div>
          </div>

          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 relative">
          <div className="absolute top-4 right-4">
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

          <div className="mb-6 mt-4">
            <h2 className="text-2xl font-bold text-gray-900">{t.loginTitle}</h2>
            <p className="text-gray-500 text-sm mt-1">{t.loginSubtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    {t.signIn} <ArrowRight className="ml-2 w-4 h-4" />
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
              onClick={handleGoogleBtnClick}
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
                  {t.googleSignIn}
                </>
              )}
            </button>
          </div>

          {/* Demo Credentials Helper */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Demo Credentials</p>
             <div className="flex flex-col gap-1 text-sm text-gray-700 font-mono">
                <span>Email: <strong>user@tenantguardian.ai</strong></span>
                <span>Password: <strong>password</strong></span>
             </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t.noAccount}{" "}
              <button 
                onClick={onNavigateToSignup}
                className="font-bold text-violet-600 hover:text-violet-700"
              >
                {t.createAccount}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Google Account Selection Modal */}
      {showGoogleModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             {/* Google Header */}
             <div className="p-6 border-b border-gray-100 text-center">
               <GoogleIcon className="w-8 h-8 mx-auto mb-4" />
               <h3 className="text-xl font-medium text-gray-800">{t.chooseAccount}</h3>
               <p className="text-sm text-gray-500">{t.toContinue}</p>
             </div>
             
             {/* Account List */}
             <div className="p-2">
               {mockAccounts.map((acc, index) => (
                 <button 
                  key={index}
                  onClick={() => selectGoogleAccount(acc)} 
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left group border-b border-transparent hover:border-gray-100"
                 >
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-lg shrink-0">
                      {acc.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{acc.name}</p>
                      <p className="text-sm text-gray-500 truncate">{acc.email}</p>
                    </div>
                 </button>
               ))}
               
               <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">Use another account</p>
                  </div>
               </button>

               <div className="border-t border-gray-100 mt-2 pt-2">
                  <button onClick={() => setShowGoogleModal(false)} className="w-full p-4 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition">
                     Cancel
                  </button>
               </div>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default Login;
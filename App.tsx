import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';
import ChatBot from './components/ChatBot';
import Sidebar from './components/Sidebar';
import DocVerification from './components/DocVerification';
import HelpSection from './components/HelpSection';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { analyzeListing } from './services/geminiService';
import { ListingInputData, RiskAnalysisResult } from './types';
import { translations } from './translations';

// Wrapper component to use hooks within Router context
const AppContent: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth_token') === 'true';
  });

  const [language, setLanguage] = useState<'English' | 'Hindi' | 'French' | 'Spanish'>('English');
  const [analysisResult, setAnalysisResult] = useState<RiskAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const t = translations[language];

  const handleLogin = () => {
    localStorage.setItem('auth_token', 'true');
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleFormSubmit = async (data: ListingInputData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeListing(data);
      setAnalysisResult(result);
      navigate('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    navigate('/');
  };

  const handleSidebarChatClick = () => {
    setIsChatOpen(true);
    setChatContext("I need to speak with the landlord about a property. How should I proceed safely?");
  };

  // Auth Routing
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route 
          path="/login" 
          element={
            <Login 
              onLogin={handleLogin} 
              onNavigateToSignup={() => navigate('/signup')} 
              language={language}
              setLanguage={setLanguage}
            />
          } 
        />
        <Route 
          path="/signup" 
          element={
            <Signup 
              onSignup={handleLogin} 
              onNavigateToLogin={() => navigate('/login')} 
              language={language}
              setLanguage={setLanguage}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Main App Layout
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm flex-none">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-gradient-to-br from-violet-400 to-fuchsia-400 p-2 rounded-lg shadow-sm">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t.title}</h1>
                <p className="text-xs text-gray-500 -mt-1">{t.subtitle}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
               {t.beta}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <Sidebar 
          language={language} 
          onChatClick={handleSidebarChatClick} 
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">✕</button>
            </div>
          )}

          <Routes>
            <Route 
              path="/" 
              element={
                <InputForm 
                  onSubmit={handleFormSubmit} 
                  isLoading={isLoading} 
                  language={language} 
                  setLanguage={setLanguage} 
                />
              } 
            />
             <Route 
              path="/profile" 
              element={
                <Profile language={language} />
              } 
            />
            <Route 
              path="/doc-verification"
              element={
                <DocVerification language={language} />
              }
            />
             <Route 
              path="/help"
              element={
                <HelpSection language={language} />
              }
            />
            <Route 
              path="/results" 
              element={
                analysisResult ? (
                  <ResultsDashboard 
                    result={analysisResult} 
                    onReset={handleReset} 
                    language={language}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            {/* Redirect any unknown routes back to home in auth mode */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <footer className="text-center text-gray-400 text-sm py-4 mt-8">
            <p>{t.footer}</p>
          </footer>
        </main>
      </div>

      <ChatBot 
        key={language} 
        language={language} 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen}
        initialMessageContext={chatContext}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
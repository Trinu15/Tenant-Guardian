import React from 'react';
import { Home, LayoutDashboard, FileCheck, ScanFace, MessageCircle, HelpCircle, LogOut, User } from 'lucide-react';
import { translations } from '../translations';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  language: 'English' | 'Hindi' | 'French' | 'Spanish';
  onChatClick: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ language, onChatClick, onLogout }) => {
  const t = translations[language];
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/',
      action: () => navigate('/')
    },
    {
      id: 'profile',
      label: t.navProfile,
      icon: <User className="w-5 h-5" />,
      path: '/profile',
      action: () => navigate('/profile')
    },
    {
      id: 'docs',
      label: t.navDocVerification,
      icon: <FileCheck className="w-5 h-5" />,
      path: '/doc-verification',
      action: () => navigate('/doc-verification')
    },
    {
      id: 'ai-check',
      label: t.navAICheck,
      icon: <ScanFace className="w-5 h-5" />,
      path: '/', // Still points to dashboard as it shares the input form
      action: () => navigate('/') 
    },
    {
      id: 'chat',
      label: t.navChatLandlord,
      icon: <MessageCircle className="w-5 h-5" />,
      path: '#',
      action: onChatClick
    },
    {
      id: 'help',
      label: t.navHelp,
      icon: <HelpCircle className="w-5 h-5" />,
      path: '/help',
      action: () => navigate('/help')
    }
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
      <div className="p-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
          Menu
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            // Determine active state
            const isActive = location.pathname === item.path && item.path !== '#';
            
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-start gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                  isActive 
                    ? 'bg-violet-50 text-violet-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mt-0.5 ${isActive ? 'text-violet-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                  {item.icon}
                </span>
                <span className="text-left leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <div className="space-y-4">
          <div className="bg-fuchsia-50 rounded-xl p-4 border border-fuchsia-100">
            <div className="flex items-center gap-2 mb-2">
              <ScanFace className="w-5 h-5 text-fuchsia-500" />
              <span className="font-bold text-fuchsia-900 text-sm">Pro Tip</span>
            </div>
            <p className="text-xs text-fuchsia-700">
              Use "Documentation Verification" before signing any lease to check for forged ownership papers.
            </p>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
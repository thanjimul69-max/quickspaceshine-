import React from 'react';
import { Home, Sparkles, Headphones, User } from 'lucide-react';
import { AppNavPage } from '../types';

interface BottomNavProps {
  currentPage: AppNavPage;
  onNavigate: (page: AppNavPage) => void;
  onOpenHelp: () => void;
  onOpenServices: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenHelp,
  onOpenServices,
}) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      isActive: currentPage === 'home',
      onClick: () => onNavigate('home'),
    },
    {
      id: 'services',
      label: 'Services',
      icon: Sparkles,
      isActive: currentPage === 'kitchenDetail' || currentPage === 'bathroomDetail',
      onClick: onOpenServices,
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: Headphones,
      isActive: false,
      onClick: onOpenHelp,
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      isActive: currentPage === 'account',
      onClick: () => onNavigate('account'),
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-[9999] h-[60px] bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] select-none flex items-center"
    >
      <div className="w-full max-w-md mx-auto px-3 sm:px-6 h-[60px] flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={tab.onClick}
              id={`bottom-nav-tab-${tab.id}`}
              className={`group flex flex-col items-center justify-center flex-1 h-full py-1 px-1 transition-all duration-200 cursor-pointer relative ${
                isActive ? 'text-slate-950 font-black' : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              {/* Active Top Indicator Bar / Glow */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-slate-950 rounded-full animate-in fade-in zoom-in duration-200" />
              )}

              {/* Icon Container with subtle scale on active */}
              <div
                className={`p-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 scale-110'
                    : 'group-hover:bg-slate-50 group-active:scale-95'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] leading-tight tracking-tight transition-all duration-200 truncate ${
                  isActive ? 'font-black text-slate-950' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

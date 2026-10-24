import React from 'react';
import { Home, Gamepad2, Wind, MessageSquareHeart, BookOpen, Menu } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'entreplay', label: 'AmparoPlay', icon: Gamepad2 },
    { id: 'calm', label: 'Acalmar', icon: Wind },
    { id: 'chat', label: 'Escuta IA', icon: MessageSquareHeart },
    { id: 'journal', label: 'Diário', icon: BookOpen },
    { id: 'more', label: 'Mais', icon: Menu },
  ];

  return (
    <nav 
      aria-label="Navegação Principal"
      className="entre-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-[#0C131A]/95 border-t border-slate-800/80 backdrop-blur-md pb-safe"
    >
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`entre-nav-item flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-teal-950/60 text-teal-300 scale-105' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

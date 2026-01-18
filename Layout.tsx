
import React from 'react';
import { AppScreen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentScreen, onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-orange-500 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500 font-bold">P</div>
          <span className="font-bold text-lg">Poultry Mitra</span>
        </div>
        <button 
          onClick={() => onNavigate(AppScreen.PROFILE)}
          className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center"
        >
          👤
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg flex justify-around items-center p-3 z-10">
        <NavItem 
          active={currentScreen === AppScreen.DASHBOARD} 
          onClick={() => onNavigate(AppScreen.DASHBOARD)} 
          icon="🏠" 
          label="Home" 
        />
        <NavItem 
          active={currentScreen === AppScreen.AI_MITRA} 
          onClick={() => onNavigate(AppScreen.AI_MITRA)} 
          icon="🤖" 
          label="AI Mitra" 
        />
        <NavItem 
          active={currentScreen === AppScreen.RECORDS} 
          onClick={() => onNavigate(AppScreen.RECORDS)} 
          icon="📝" 
          label="Records" 
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${active ? 'text-orange-600 bg-orange-50' : 'text-slate-500'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

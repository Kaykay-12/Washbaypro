import React from 'react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';
import { LayoutDashboard, PlusCircle, List, Users, BarChart3, Settings, DollarSign, Menu, LogOut } from 'lucide-react';

interface NavItemProps {
  screen: Screen;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ screen, label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full p-4 rounded-2xl transition-all duration-300 group ${
      isActive 
        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-slate-900'
    }`}
  >
    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="font-semibold tracking-wide text-[15px]">{label}</span>
  </button>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentScreen, setCurrentScreen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { screen: Screen; label: string; icon: any }[] = [
    { screen: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { screen: 'new-job', label: 'New Job', icon: PlusCircle },
    { screen: 'queue', label: 'Live Queue', icon: List },
    { screen: 'customers', label: 'Customers', icon: Users },
    { screen: 'expenses', label: 'Expenses', icon: DollarSign },
    { screen: 'reports', label: 'Reports', icon: BarChart3 },
    { screen: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white m-4 rounded-3xl shadow-sm border border-gray-100 h-[calc(100vh-2rem)]">
        <div className="p-8 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gh-red to-gh-yellow rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">W</div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">WashBay<span className="text-gh-red">Pro</span></h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Manager V2.0</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
          <p className="px-4 text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">Menu</p>
          {navItems.map((item) => (
            <NavItem
              key={item.screen}
              {...item}
              isActive={currentScreen === item.screen}
              onClick={() => setCurrentScreen(item.screen)}
            />
          ))}
        </div>
        
        <div className="p-4 mt-auto">
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold border-2 border-white shadow-md">K</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Kwame O.</p>
                <p className="text-[10px] text-gray-500 font-medium">Admin Access</p>
              </div>
            </div>
            <LogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md h-20 flex items-center justify-between px-6 border-b border-gray-100 z-30 sticky top-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gh-red rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
            <h1 className="text-xl font-black text-slate-900">WashBay<span className="text-gh-red">Pro</span></h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-50 rounded-xl text-slate-900 hover:bg-gray-100">
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
           <div className="md:hidden absolute top-20 left-0 w-full bg-white z-50 border-b border-gray-100 shadow-2xl p-4 flex flex-col space-y-2 animate-in slide-in-from-top-4">
             {navItems.map((item) => (
              <button
                key={item.screen}
                onClick={() => {
                  setCurrentScreen(item.screen);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${currentScreen === item.screen ? 'bg-slate-900 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon size={20} />
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
           </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-10 pb-24 md:pb-10 scroll-smooth">
           {children}
        </div>
      </main>

      {/* Mobile Bottom FAB for Quick Action */}
      {currentScreen !== 'new-job' && (
        <button 
          onClick={() => setCurrentScreen('new-job')}
          className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl shadow-slate-400 flex items-center justify-center z-40 active:scale-90 transition-transform"
        >
          <PlusCircle size={32} />
        </button>
      )}
    </div>
  );
};
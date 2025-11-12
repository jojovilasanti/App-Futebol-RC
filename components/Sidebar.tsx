import React from 'react';
import { User, View } from '../types';
import { HomeIcon, HistoryIcon, RulesIcon, UserCircleIcon, AdminIcon, LogoutIcon, SunIcon, MoonIcon, TrophyIcon, SwitchHorizontalIcon, IdentificationIcon } from './icons/Icons';

interface SidebarProps {
  user: User;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
  onNavigate: (view: View, id?: string) => void;
  activeView: View;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTradingDates: string[];
}

interface NavItem {
  view?: View;
  href?: string;
  label: string;
  icon: React.ReactNode;
  isLive?: boolean;
  date?: string;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  isLive?: boolean;
}> = ({ icon, label, isActive, onClick, className = '', isLive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 relative ${
        isActive
          ? 'bg-brand-blue text-white shadow-lg'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      } ${className}`}
    >
      <span className="mr-4">{icon}</span>
      {label}
      {isLive && (
        <span className="absolute right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  user,
  theme,
  onToggleTheme,
  onLogout,
  onNavigate,
  activeView,
  isOpen,
  setIsOpen,
  activeTradingDates
}) => {
  const navItems: NavItem[] = [
    { view: 'home', label: 'Início', icon: <HomeIcon className="w-6 h-6" /> },
    { view: 'championships', label: 'Campeonatos', icon: <TrophyIcon className="w-6 h-6" /> },
    { view: 'history', label: 'Histórico', icon: <HistoryIcon className="w-6 h-6" /> },
    { view: 'rules', label: 'Regras', icon: <RulesIcon className="w-6 h-6" /> },
  ];
  
  if (activeTradingDates.length > 0) {
    navItems.splice(1, 0, { view: 'trading', label: 'Trocas ao Vivo', icon: <SwitchHorizontalIcon className="w-6 h-6" />, isLive: true, date: activeTradingDates[0] });
  }

  if (user.role === 'admin') {
    navItems.splice(1, 0, { view: 'admin', label: 'Admin', icon: <AdminIcon className="w-6 h-6" /> });
  }

  if (user.role === 'guest') {
    navItems.push({ 
        label: 'Virar Sócio', 
        icon: <IdentificationIcon className="w-6 h-6" />, 
        href: 'https://api.whatsapp.com/send/?phone=556791116093&text&type=phone_number&app_absent=0' 
    });
  } else {
    navItems.push({ view: 'profile', label: 'Perfil', icon: <UserCircleIcon className="w-6 h-6" /> });
  }


  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar-bg text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-center p-6 border-b border-gray-700/50 h-20 shrink-0">
           <h1 className="text-2xl font-bold text-white">Futebol RC</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.label}
              icon={item.icon}
              label={item.label}
              isLive={item.isLive}
              isActive={
                 item.view ? (
                    activeView === item.view ||
                    (item.view === 'championships' && (activeView === 'championshipDetails' || activeView === 'championshipForm'))
                ) : false
              }
              onClick={() => {
                if (item.href) {
                    window.open(item.href, '_blank', 'noopener,noreferrer');
                } else if (item.view) {
                    onNavigate(item.view, item.date);
                }
              }}
            />
          ))}
        </nav>
        
        <div className="px-4 py-4 border-t border-gray-700/50 shrink-0">
          <div className="flex justify-between items-center mb-4">
            {/* User Profile Section */}
            <div className="flex items-center p-2 rounded-lg overflow-hidden">
              <img src={user.avatarUrl} alt={user.nickname} className="w-10 h-10 rounded-full object-cover border-2 border-brand-blue-light" />
              <div className="ml-3">
                <p className="font-semibold text-sm text-white truncate">{user.name}</p>
                {user.role !== 'guest' && (
                    <p className="text-xs text-gray-400">Título: {user.membershipNumber}</p>
                )}
              </div>
            </div>
            {/* Theme Toggle for desktop */}
            <button 
              onClick={onToggleTheme} 
              className="p-2 rounded-full hidden md:inline-flex text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              aria-label="Mudar tema"
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
          </div>
          <NavLink
            icon={<LogoutIcon className="w-6 h-6" />}
            label="Sair"
            isActive={false}
            onClick={onLogout}
            className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
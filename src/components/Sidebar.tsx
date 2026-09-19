import React from 'react';
import { ShoppingBag, Home, Calendar, BookOpen, Grid, Settings, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar({ className = "" }: { className?: string }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      {/* Desktop view */}
      <aside className={`w-[90px] flex-shrink-0 flex-col items-center py-7 bg-bg-panel rounded-r-[40px] shadow-sm overflow-y-auto scrollbar-hide hidden xl:flex xl:sticky xl:top-4 xl:h-[calc(100vh-32px)] ${className}`}>
        <div className="mb-10 w-full flex justify-center">
          {/* Logo */}
          <div className="w-[42px] h-[42px] bg-[#222327] rounded-tl-[16px] rounded-br-[16px] rounded-tr-[4px] rounded-bl-[4px] flex items-center justify-center transform -rotate-45 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
             <div className="w-[18px] h-[18px] bg-[#FDF9F4] transform rotate-45 rounded-[5px]"></div>
          </div>
        </div>

        <nav className="flex flex-col gap-[22px] flex-1 items-center w-full">
          <SidebarIcon to="/notifications" icon={<Bell size={20} strokeWidth={1.8} />} hasNotification active={path === '/notifications'} />
          <SidebarIcon to="/" icon={<Home size={20} strokeWidth={1.8} />} active={path === '/'} />
          <SidebarIcon to="/calendar" icon={<Calendar size={20} strokeWidth={1.8} />} active={path === '/calendar'} />
          <SidebarIcon to="/courses" icon={<BookOpen size={20} strokeWidth={1.8} />} active={path === '/courses'} />
          <SidebarIcon to="/explore" icon={<Grid size={20} strokeWidth={1.8} />} active={path === '/explore'} />
        </nav>

        <div className="mt-auto flex flex-col gap-6 items-center w-full">
          <SidebarIcon to="/settings" icon={<Settings size={20} strokeWidth={1.8} />} active={path === '/settings'} />
          <button className="w-[46px] h-[46px] flex-shrink-0 rounded-full overflow-hidden border-[2px] border-bg-base shadow-sm mt-2 hover:scale-105 transition-transform relative">
            <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none"></div>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[400px] bg-[#1B1B1B]/95 backdrop-blur-md rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-50 px-4 py-3 flex justify-between items-center border border-white/10">
         <MobileIcon to="/" icon={<Home size={22} />} active={path === '/'} />
         <MobileIcon to="/explore" icon={<Grid size={22} />} active={path === '/explore'} />
         <MobileIcon to="/calendar" icon={<Calendar size={22} />} active={path === '/calendar'} />
         <MobileIcon to="/courses" icon={<BookOpen size={22} />} active={path === '/courses'} />
         <NavLink to="/settings" className="w-[42px] h-[42px] flex-shrink-0 rounded-full overflow-hidden border-[2px] border-white/20 hover:border-white transition-colors relative">
           <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="Profile" className="w-full h-full object-cover aspect-square" />
           {path === '/settings' && <div className="absolute inset-0 bg-black/20 rounded-full"></div>}
         </NavLink>
      </div>
    </>
  );
}

function MobileIcon({ icon, active, to }: { icon: React.ReactNode, active?: boolean, to: string }) {
  return (
    <NavLink to={to} className="relative flex-shrink-0 flex justify-center group">
       <div className={`w-[48px] h-[48px] flex items-center justify-center rounded-full transition-all duration-300 ${active ? 'bg-white text-[#1B1B1B]' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
         {icon}
       </div>
    </NavLink>
  );
}

function SidebarIcon({ icon, active, hasNotification, to }: { icon: React.ReactNode, active?: boolean, hasNotification?: boolean, to: string }) {
  return (
    <NavLink to={to} className="relative flex-shrink-0 flex justify-center group outline-none">
      <motion.div
        whileHover={{ scale: active ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`w-[52px] h-[52px] flex items-center justify-center rounded-full transition-colors relative ${
          active ? 'bg-[#1B1B1B] text-white shadow-md shadow-black/10' : 'bg-white text-[#1B1B1B] shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:bg-black/5 mx-auto'
        }`}
      >
        {icon}
        {hasNotification && (
          <>
             <span className="absolute top-[12px] right-[13px] w-[11px] h-[11px] bg-red-500 border-[2.5px] border-white rounded-full z-10 pointer-events-none" />
             <span className="absolute top-[12px] right-[13px] w-[11px] h-[11px] bg-red-500 border-[2.5px] border-white rounded-full z-0 animate-ping pointer-events-none opacity-75" />
          </>
        )}
      </motion.div>
    </NavLink>
  );
}

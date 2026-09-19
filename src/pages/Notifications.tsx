import React from 'react';
import { Bell, Clock, CheckCircle2, AlertCircle, ArrowRight, Zap, Gift } from 'lucide-react';

const NOTIFICATION_GROUPS = [
  {
    date: 'Today',
    items: [
      { id: 1, type: 'alert', title: "Subscription Expiring", desc: "Your Pro plan expires in 3 days. Renew now to keep access to all courses and resources.", time: "2 hours ago", unread: true, action: "Renew Plan", color: "bg-card-pink", icon: <AlertCircle size={20} className="text-red-600" /> },
      { id: 2, type: 'success', title: "Course Completed!", desc: "Congratulations! You've mastered 'Flutter Masterclass'. Your verified certificate is ready to claim.", time: "5 hours ago", unread: true, action: "Claim Certificate", color: "bg-card-green", icon: <CheckCircle2 size={20} className="text-green-700" /> },
    ]
  },
  {
    date: 'Yesterday',
    items: [
      { id: 3, type: 'update', title: "New Module Available", desc: "A heavily requested module 'Advanced State Management' has been added to your React course.", time: "Yesterday, 10:00 AM", unread: false, action: "Start Lesson", color: "bg-[#DCDDFF]", icon: <Zap size={20} className="text-indigo-600" /> },
    ]
  },
  {
    date: 'Older',
    items: [
      { id: 4, type: 'promo', title: "Exclusive 50% Off", desc: "As a top learner, unlock any advanced masterclass at half price for the next 24 hours.", time: "Oct 20, 2023", unread: false, action: "View Offer", color: "bg-card-yellow", icon: <Gift size={20} className="text-amber-700" /> },
      { id: 5, type: 'info', title: "Upcoming Webinar", desc: "Reminder: 'System Design Q&A' with Lead Designers starting this weekend. Add to calendar.", time: "Oct 18, 2023", unread: false, color: "bg-white", icon: <Bell size={20} className="text-[#1B1B1B]" /> },
    ]
  }
];

export default function Notifications() {
  return (
    <main className="flex-1 flex flex-col pt-10 xl:pt-[54px] px-6 md:px-[60px] xl:px-16 w-full min-w-0 pb-20">
      <div className="flex items-end justify-between mb-12">
        <h1 className="text-[52px] md:text-[68px] xl:text-[76px] font-semibold tracking-tight leading-[1] text-[#1B1B1B]">
          Notifications
        </h1>
        <button className="text-[14px] font-bold text-[#848484] hover:text-[#1B1B1B] transition-colors border-2 border-black/5 hover:border-black/10 px-5 py-2.5 rounded-full">
          Mark all as read
        </button>
      </div>

      <div className="max-w-[900px] relative">
         <div className="absolute left-[39px] top-4 bottom-0 w-[2px] bg-black/5 z-0"></div>

         <div className="flex flex-col gap-12 relative z-10">
            {NOTIFICATION_GROUPS.map((group, gIdx) => (
               <div key={group.date} className="flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                     <div className="bg-[#1B1B1B] text-white text-[12px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-sm z-10 ml-5 relative">
                        {group.date}
                        <div className="absolute top-1/2 left-[-20px] w-[20px] h-[2px] bg-black/5 -translate-y-1/2 -z-10"></div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-5 ml-[78px]">
                     {group.items.map((notif, i) => (
                        <div 
                          key={notif.id} 
                          className={`relative p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row gap-5 md:gap-8 border transition-all cursor-pointer group ${
                            notif.unread 
                              ? 'bg-white border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1' 
                              : 'bg-white/40 border-black/5 shadow-sm hover:bg-white hover:border-black/10'
                          }`}
                        >
                           <div className="absolute top-1/2 -left-[39px] w-[39px] h-[2px] bg-black/5 -translate-y-1/2 pointer-events-none"></div>
                           <div className={`absolute top-1/2 -left-[43px] w-2.5 h-2.5 rounded-full transform -translate-y-1/2 transition-transform ${notif.unread ? 'bg-[#1B1B1B] scale-125 shadow-[0_0_0_4px_rgba(27,27,27,0.1)]' : 'bg-[#848484]'}`}></div>

                           <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm border border-black/5 ${notif.color}`}>
                              {notif.icon}
                           </div>
                           
                           <div className="flex-1 flex flex-col justify-center">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                 <h3 className={`text-[20px] font-semibold ${notif.unread ? 'text-[#1B1B1B]' : 'text-[#1B1B1B]/80'}`}>
                                   {notif.title}
                                 </h3>
                                 <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#848484] mt-1 md:mt-0">
                                   <Clock size={14} /> {notif.time}
                                 </span>
                              </div>
                              <p className={`text-[15px] leading-relaxed max-w-[600px] mb-4 ${notif.unread ? 'text-[#1B1B1B]/70 font-medium' : 'text-[#848484]'}`}>
                                {notif.desc}
                              </p>
                              
                              {notif.action && (
                                <button className={`flex items-center gap-2 text-[14px] font-bold w-max transition-colors ${
                                  notif.unread ? 'text-[#1B1B1B]' : 'text-[#848484] group-hover:text-[#1B1B1B]'
                                }`}>
                                  {notif.action} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                              )}
                           </div>
                           {notif.unread && (
                              <div className="hidden md:block w-3 h-3 rounded-full bg-[#1B1B1B] shrink-0 mt-2"></div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </main>
  );
}

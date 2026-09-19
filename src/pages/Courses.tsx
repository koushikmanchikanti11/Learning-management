import React, { useState } from 'react';
import { Laptop, Briefcase, Layout as LayoutIcon, Code, Target, Award, Flame, Zap, Trophy, Sun, Star, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';

// ... (existing imports, but add Area, AreaChart, CartesianGrid)
const MY_COURSES = [
  { id: 1, title: "Flutter Masterclass", topic: "Development", progress: 75, bgColor: "bg-card-pink", icon: <Laptop size={16} strokeWidth={2.5} />, rating: 4.8 },
  { id: 2, title: "Powerful Business Writing", topic: "Business", progress: 100, bgColor: "bg-card-yellow", icon: <Briefcase size={16} strokeWidth={2.5} />, rating: 4.9 },
  { id: 3, title: "UI/UX Masterclass", topic: "Design", progress: 30, bgColor: "bg-[#DCDDFF]", icon: <LayoutIcon size={16} strokeWidth={2.5} />, rating: 4.7 },
  { id: 4, title: "Advanced Data Structures", topic: "Development", progress: 0, bgColor: "bg-[#B2F0D1]", icon: <Code size={16} strokeWidth={2.5} />, rating: 4.6 },
  { id: 5, title: "Agile Project Management", topic: "Business", progress: 100, bgColor: "bg-[#E8E1F5]", icon: <Target size={16} strokeWidth={2.5} />, rating: 4.9 },
  { id: 6, title: "React Performance Tuning", topic: "Development", progress: 50, bgColor: "bg-[#FBE6C2]", icon: <Laptop size={16} strokeWidth={2.5} />, rating: 4.8 },
];

const PIE_DATA = [
  { name: 'Completed', value: 2, color: '#B2F0D1' },
  { name: 'In Progress', value: 3, color: '#FACDD1' },
  { name: 'Not Started', value: 1, color: '#F4ECE3' },
];

const AREA_DATA = [
  { name: 'Mon', thisWeek: 2.5, lastWeek: 1.5 },
  { name: 'Tue', thisWeek: 3.8, lastWeek: 2.0 },
  { name: 'Wed', thisWeek: 1.5, lastWeek: 3.5 },
  { name: 'Thu', thisWeek: 4.2, lastWeek: 2.2 },
  { name: 'Fri', thisWeek: 2.0, lastWeek: 1.8 },
  { name: 'Sat', thisWeek: 5.5, lastWeek: 4.0 },
  { name: 'Sun', thisWeek: 1.0, lastWeek: 2.5 },
];

export default function Courses() {
  const [topicFilter, setTopicFilter] = useState('All Topics');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredCourses = MY_COURSES.filter(course => {
    const matchTopic = topicFilter === 'All Topics' || course.topic === topicFilter;
    let matchStatus = true;
    if (statusFilter === 'In Progress') matchStatus = course.progress > 0 && course.progress < 100;
    if (statusFilter === 'Completed') matchStatus = course.progress === 100;
    if (statusFilter === 'Not Started') matchStatus = course.progress === 0;
    return matchTopic && matchStatus;
  });

  return (
    <main className="flex-1 flex flex-col pt-10 xl:pt-[54px] px-6 md:px-[60px] xl:px-16 w-full min-w-0 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <h1 className="text-[52px] md:text-[68px] xl:text-[76px] font-semibold tracking-tight leading-[1] max-w-[500px] text-[#1B1B1B]">
          My Hub
        </h1>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <select 
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="bg-white px-5 py-3 rounded-full shadow-sm border border-transparent hover:border-black/5 text-[14px] font-bold text-[#1B1B1B] outline-none cursor-pointer appearance-none min-w-[140px] text-center"
          >
             <option>All Topics</option>
             <option>Development</option>
             <option>Business</option>
             <option>Design</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1B1B1B] px-5 py-3 rounded-full shadow-sm border border-transparent text-[14px] font-bold text-white outline-none cursor-pointer appearance-none min-w-[140px] text-center"
          >
             <option>All Status</option>
             <option>In Progress</option>
             <option>Completed</option>
             <option>Not Started</option>
          </select>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
         {/* Course Distribution */}
         <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-black/5 flex flex-col justify-between h-full">
            <h3 className="text-[18px] font-semibold text-[#1B1B1B] mb-6">Overall Progress</h3>
            <div className="flex flex-col items-center gap-6">
              <div className="w-[130px] h-[130px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA} innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value" stroke="none">
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', background: '#1B1B1B', color: '#fff', fontWeight: 'bold' }}
                       itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-[28px] font-bold text-[#1B1B1B] leading-none mb-1">{MY_COURSES.length}</span>
                  <span className="text-[10px] font-bold text-[#848484] uppercase tracking-wider">Total</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                 {PIE_DATA.map(d => (
                   <div key={d.name} className="flex flex-wrap items-center justify-between text-[14px] font-medium border-b border-black/5 pb-2 last:border-0 last:pb-0 gap-x-2">
                     <div className="flex items-center gap-3">
                       <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                       <span className="text-[#848484]">{d.name}</span>
                     </div>
                     <span className="text-[#1B1B1B] font-bold ml-auto">{d.value} courses</span>
                   </div>
                 ))}
              </div>
            </div>
         </div>

         {/* Learning Analytics */}
         <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm flex flex-col xl:col-span-2 overflow-hidden border border-black/5 relative h-full group">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4 relative z-10">
               <div>
                 <h3 className="text-[20px] font-semibold text-[#1B1B1B]">Learning Analytics</h3>
                 <p className="text-[#848484] text-[14px] font-medium mt-1">Study hours this week vs last week</p>
               </div>
               <div className="flex items-center gap-2 bg-[#F4F4F5] px-5 py-2.5 rounded-full shadow-sm shrink-0 hover:bg-[#E5E7EB] transition-colors cursor-default">
                 <Clock size={18} className="text-[#6366F1]" />
                 <span className="text-[#1B1B1B] text-[14px] font-bold">20.5 hrs</span>
               </div>
            </div>
            <div className="flex-1 w-full min-h-[160px] min-w-0 relative z-10 mt-auto">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={AREA_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                       <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#E5E7EB" stopOpacity={0.6}/>
                       <stop offset="95%" stopColor="#E5E7EB" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#848484', fontSize: 13, fontWeight: 600 }} dy={10} />
                   <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" strokeDasharray="4 4" />
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', background: '#fff', color: '#1B1B1B', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                     itemStyle={{ color: '#1B1B1B' }}
                     formatter={(val: number, name: string) => [`${val} hrs`, name === 'thisWeek' ? 'This Week' : 'Last Week']}
                     labelStyle={{ color: '#848484', marginBottom: '4px' }}
                   />
                   <Area type="monotone" dataKey="lastWeek" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorLastWeek)" />
                   <Area type="monotone" dataKey="thisWeek" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorThisWeek)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
         
         {/* Gamification Stats Column */}
         <div className="flex flex-col gap-6 xl:col-span-1 h-full">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-[#FFF4E0] to-[#FFE4E1] rounded-[28px] p-6 flex flex-col relative overflow-hidden flex-1 shadow-sm border border-black/5">
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                     <div className="flex items-center gap-1.5 mb-1.5">
                        <Flame size={18} className="text-orange-500 fill-orange-500" />
                        <span className="text-[13px] font-bold text-orange-600 uppercase tracking-wider">Streak</span>
                     </div>
                     <div className="flex items-end gap-1.5">
                        <span className="text-[36px] md:text-[42px] font-extrabold text-[#1B1B1B] leading-none tracking-tight">12</span>
                        <span className="text-[15px] font-bold text-[#1B1B1B]/60 mb-1">Days</span>
                     </div>
                  </div>
                  <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm">
                     <Zap size={20} className="text-orange-500 fill-orange-500" />
                  </div>
               </div>
               {/* Mini calendar for streak */}
               <div className="flex justify-between mt-auto relative z-10">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                     <div key={i} className="flex flex-col items-center gap-2">
                        <span className="text-[11px] font-bold text-[#1B1B1B]/40">{day}</span>
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-sm ${i < 4 ? 'bg-orange-500' : (i === 4 ? 'bg-orange-400 ring-2 ring-white scale-110' : 'bg-black/5 shadow-none')}`}>
                           {i <= 4 && <Flame size={12} className="text-white fill-white" />}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
    
            {/* Level & Rewards Card */}
            <div className="bg-gradient-to-tr from-[#E0E7FF] to-[#EDE9FE] rounded-[28px] p-6 flex flex-col relative overflow-hidden flex-1 shadow-sm border border-black/5">
               <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>
               
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                     <div className="flex items-center gap-1.5 mb-1.5">
                        <Trophy size={18} className="text-indigo-500 fill-indigo-500" />
                        <span className="text-[13px] font-bold text-indigo-600 uppercase tracking-wider">Level 8</span>
                     </div>
                     <div className="flex items-baseline gap-2">
                        <span className="text-[28px] md:text-[32px] font-extrabold text-[#1B1B1B] leading-none tracking-tight">8,450</span>
                        <span className="text-[14px] font-bold text-[#1B1B1B]/60">XP</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex flex-col gap-2 relative z-10 mb-5 mt-auto">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide">
                     <span className="text-indigo-600">Scholar Rank</span>
                     <span className="text-[#1B1B1B]/40">1.5k to next</span>
                  </div>
                  <div className="w-full bg-indigo-500/10 h-2.5 rounded-full overflow-hidden">
                     <div className="bg-indigo-500 w-[84%] h-full rounded-full relative">
                        <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 translate-x-1/2"></div>
                     </div>
                  </div>
               </div>
    
               {/* Rewards row */}
               <div className="flex items-center justify-between relative z-10 pt-4 border-t border-indigo-500/10 mt-auto">
                  <span className="text-[12px] font-bold text-[#1B1B1B]/60 uppercase tracking-wider">Latest Badges</span>
                  <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full bg-white border-2 border-[#E0E7FF] flex items-center justify-center shadow-sm z-30 transform hover:scale-110 hover:z-40 transition-transform cursor-pointer" title="Early Bird">
                        <Sun size={14} className="text-amber-500 fill-amber-500" />
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white border-2 border-[#E0E7FF] flex items-center justify-center shadow-sm z-20 transform hover:scale-110 hover:z-40 transition-transform cursor-pointer" title="Perfect Week">
                        <Star size={14} className="text-blue-500 fill-blue-500" />
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white border-2 border-[#E0E7FF] flex items-center justify-center shadow-sm z-10 transform hover:scale-110 hover:z-40 transition-transform cursor-pointer" title="Focus Master">
                        <Target size={14} className="text-emerald-500 fill-emerald-500" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <MyCourseCard key={course.id} {...course} />
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-16 text-center text-[#848484] font-medium border-2 border-dashed border-black/5 rounded-[32px]">
            No courses match the selected filters.
          </div>
        )}
      </div>
    </main>
  );
}

function MyCourseCard({ id, title, topic, progress, bgColor, icon, rating }: any) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/course/${id || 1}`)}
      className={`${bgColor} rounded-[32px] p-6 lg:p-8 relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all hover:-translate-y-1 min-h-[220px] flex flex-col border border-transparent hover:border-black/5`}
    >
      <div className="absolute -top-4 -bottom-4 -right-4 w-[60%] bg-white/40 rounded-l-[24px] transform -skew-x-[8deg] translate-x-4 pointer-events-none transition-transform duration-700 group-hover:translate-x-1"></div>
      
      <div className="flex justify-between items-start relative z-10 mb-8">
        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-[14px] text-[13px] font-semibold text-[#1B1B1B] shadow-sm">
          <span>{icon}</span> {topic}
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-[12px] text-[13px] font-bold shrink-0 shadow-sm">
          <span className="text-amber-400 text-[14px] leading-none">★</span> {rating}
        </div>
      </div>
      
      <div className="relative z-10 mt-auto">
        <h4 className="font-semibold text-[22px] leading-[1.25] mb-6 text-[#1B1B1B] max-w-[90%]">
          {title}
        </h4>
        
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-[13px] font-medium text-[#1B1B1B]">
            <span className="opacity-70">Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-black/10 h-[6px] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-[#1B1B1B]' : 'bg-[#1B1B1B]'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

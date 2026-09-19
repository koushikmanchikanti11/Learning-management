import React, { useState } from 'react';
import { Bell, Settings, ChevronRight, Laptop, Briefcase, UserRound, Bookmark, Check, ArrowRight, FileDown, Target } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ActivityChart from './ActivityChart';
import DownloadSummaryModal from './DownloadSummaryModal';
import { useCourses } from '../context/CourseContext';

export default function RightPanel({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const { savedCourses, isCourseSaved, toggleSaveCourse, getProgress, studyGoal } = useCourses();
  const [courseTab, setCourseTab] = useState<'active' | 'saved'>('active');
  const [showPdfModal, setShowPdfModal] = useState(false);

  const flutterProgress = getProgress(1);
  const writingProgress = getProgress(2);

  return (
    <aside className={`flex flex-col bg-bg-panel xl:rounded-[36px] p-[30px] lg:p-[40px] relative overflow-y-auto scrollbar-hide xl:sticky xl:top-4 xl:h-[calc(100vh-32px)] ${className}`}>
      {/* Top Header Icons */}
      <div className="flex justify-between items-center mb-10">
        <Link 
          to="/notifications" 
          aria-label="View notifications"
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
        >
          <Bell size={22} strokeWidth={1.8} className="text-[#1B1B1B]" />
        </Link>
        <Link 
          to="/settings" 
          aria-label="View profile settings"
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
        >
          <Settings size={22} strokeWidth={1.8} className="text-[#1B1B1B]" />
        </Link>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mb-[42px]">
        <Link to="/settings" className="group flex flex-col items-center">
          <div className="w-[106px] h-[106px] rounded-full bg-[#E8E1F5] flex items-center justify-center mb-4 shadow-sm relative group-hover:scale-105 transition-transform">
            <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="Annette Black" className="w-[90px] h-[90px] rounded-full object-cover overflow-hidden" />
            <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none"></div>
          </div>
          <h2 className="text-[24px] font-semibold tracking-[0.2px] text-[#1B1B1B] group-hover:underline">Annette Black</h2>
          <span className="text-[13px] font-medium text-[#848484] mt-0.5">Product Designer</span>
        </Link>
      </div>

      {/* Friends Container */}
      <div className="bg-white rounded-[24px] p-[10px] pl-4 flex items-center justify-between mb-10 shadow-sm border border-black/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-white flex-shrink-0">
            <UserRound size={18} strokeWidth={1.8} className="text-[#1B1B1B]" />
          </div>
          <span className="font-medium text-[14px] text-[#1B1B1B]">274 Friends</span>
        </div>
        <div className="flex items-center gap-[6px] cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex -space-x-[12px] mr-1">
            <img src="https://randomuser.me/api/portraits/women/11.jpg" className="w-[34px] h-[34px] rounded-full border-[3px] border-white z-10" alt="Friend 1" />
            <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-[34px] h-[34px] rounded-full border-[3px] border-white z-20" alt="Friend 2" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-[34px] h-[34px] rounded-full border-[3px] border-white z-30" alt="Friend 3" />
          </div>
          <button className="w-6 h-6 flex items-center justify-center pr-2" aria-label="View friends">
            <ChevronRight size={16} strokeWidth={2.5} className="text-[#848484]" />
          </button>
        </div>
      </div>

      {/* Activity Chart Container */}
      <div className="bg-white rounded-[32px] p-7 mb-10 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-black/5">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-[#1B1B1B] text-[15px]">Activity</h3>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Target size={11} /> {studyGoal.frequency === 'daily' ? `${studyGoal.todayMinutes}m today` : `${(studyGoal.thisWeekMinutes / 60).toFixed(1)}h this wk`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 text-[11px] font-bold bg-[#FAF9F6] border border-black/5 shadow-2xs hover:bg-black/5 px-3 py-1.5 rounded-full text-[#1B1B1B] transition-colors"
            title="Download Official PDF Learning Summary"
          >
            <FileDown size={13} className="text-amber-600" />
            <span>PDF Transcript</span>
          </button>
        </div>
        <div className="flex items-center gap-[18px] mb-8">
          <span className="text-[38px] font-semibold tracking-tight leading-none text-[#1B1B1B]">
            {(studyGoal.thisWeekMinutes / 60).toFixed(1)}h
          </span>
          <span className="text-[12px] font-bold text-[#147B44] bg-[#E8F8F0] px-3 py-[5px] rounded-[10px] flex items-center gap-[6px]">
            <span className="text-[14px]">👍</span> Great result!
          </span>
        </div>
        <div className="h-[140px] w-full mt-2">
           <ActivityChart />
        </div>
      </div>

      {/* Courses Section with Tabs: Active vs Saved */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 bg-black/5 p-1 rounded-full">
            <button
              onClick={() => setCourseTab('active')}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                courseTab === 'active'
                  ? 'bg-white text-[#1B1B1B] shadow-sm'
                  : 'text-[#848484] hover:text-[#1B1B1B]'
              }`}
            >
              My courses
            </button>
            <button
              onClick={() => setCourseTab('saved')}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                courseTab === 'saved'
                  ? 'bg-white text-[#1B1B1B] shadow-sm'
                  : 'text-[#848484] hover:text-[#1B1B1B]'
              }`}
            >
              <Bookmark size={13} className={courseTab === 'saved' ? 'fill-current' : ''} />
              <span>Saved ({savedCourses.length})</span>
            </button>
          </div>

          {courseTab === 'saved' && (
            <Link 
              to="/settings?tab=saved" 
              className="text-[12px] font-bold text-[#1B1B1B] hover:underline flex items-center gap-0.5"
            >
              All <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {courseTab === 'active' ? (
          <div className="flex flex-col gap-5">
            {/* Card 1 - Flutter Masterclass with Visual Progress Bar */}
            <div 
              onClick={() => navigate('/course/1')}
              className="bg-card-pink rounded-[32px] p-6 lg:p-[26px] relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all min-h-[210px] flex flex-col justify-between border border-transparent hover:border-black/5"
            >
              <div className="absolute -top-4 -bottom-4 -right-4 w-[60%] bg-[#F5A9B4]/40 rounded-l-[24px] transform -skew-x-[8deg] translate-x-4 pointer-events-none transition-transform duration-700 group-hover:translate-x-1"></div>
              
              <div className="flex justify-between items-start relative z-10 mb-4">
                 <div className="flex items-center gap-2 bg-white/60 px-[14px] py-[7px] rounded-[14px] text-[12px] font-semibold text-[#1B1B1B] shadow-sm">
                   <span><Laptop size={14} strokeWidth={2.5} /></span> IT & Software
                 </div>
                 <div className="flex items-center gap-2">
                   <button
                     type="button"
                     title={isCourseSaved(1) ? "Remove from Saved" : "Save to Watch Later"}
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleSaveCourse(1);
                     }}
                     className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                       isCourseSaved(1)
                         ? 'bg-[#1B1B1B] text-white shadow-sm'
                         : 'bg-white/80 hover:bg-white text-[#1B1B1B]'
                     }`}
                   >
                     <Bookmark size={14} className={isCourseSaved(1) ? 'fill-white' : ''} />
                   </button>
                   <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-[12px] text-[12px] font-bold shrink-0 shadow-sm">
                     <span className="text-amber-400 text-[14px] leading-none">★</span> 4.8
                   </div>
                 </div>
              </div>
              
              <div className="relative z-10 mt-auto">
                 <h4 className="font-semibold text-[19px] leading-[1.25] mb-4 text-[#1B1B1B] max-w-[90%]">
                   Flutter Masterclass (Dart, APIs, Firebase)
                 </h4>

                 {/* Visual Progress Bar */}
                 <div className="mb-4 bg-white/50 backdrop-blur-sm rounded-[16px] p-2.5 border border-black/5">
                   <div className="flex justify-between items-center text-[11px] font-bold text-[#1B1B1B] mb-1">
                     <span className="opacity-75">In progress</span>
                     <span>{flutterProgress}%</span>
                   </div>
                   <div className="w-full bg-black/10 h-[5px] rounded-full overflow-hidden">
                     <div 
                       className="bg-[#1B1B1B] h-full rounded-full transition-all duration-700" 
                       style={{ width: `${flutterProgress}%` }}
                     />
                   </div>
                 </div>

                 <div className="flex justify-between items-end">
                    <span className="text-[12px] font-medium text-[#1B1B1B] opacity-70">9,530 students</span>
                    <div className="flex -space-x-[12px]">
                      <img src="https://randomuser.me/api/portraits/women/12.jpg" className="w-[32px] h-[32px] rounded-full border-[2.5px] border-[#F4B4BE] object-cover" alt="Avatar" />
                      <img src="https://randomuser.me/api/portraits/men/68.jpg" className="w-[32px] h-[32px] rounded-full border-[2.5px] border-[#F4B4BE] object-cover" alt="Avatar" />
                    </div>
                 </div>
              </div>
            </div>

            {/* Card 2 - Powerful Business Writing with Visual Progress Bar (Completed) */}
            <div 
              onClick={() => navigate('/course/2')}
              className="bg-card-yellow rounded-[32px] p-6 lg:p-[26px] relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all min-h-[210px] flex flex-col justify-between border border-transparent hover:border-black/5"
            >
              <div className="absolute -top-4 -bottom-4 -right-4 w-[60%] bg-white/50 rounded-l-[24px] transform -skew-x-[8deg] translate-x-4 pointer-events-none transition-transform duration-700 group-hover:translate-x-1"></div>
              
              <div className="flex justify-between items-start relative z-10 mb-4">
                 <div className="flex items-center gap-2 bg-white/60 px-[14px] py-[7px] rounded-[14px] text-[12px] font-semibold text-[#1B1B1B] shadow-sm">
                   <span><Briefcase size={14} strokeWidth={2.5} /></span> Business
                 </div>
                 <div className="flex items-center gap-2">
                   <button
                     type="button"
                     title={isCourseSaved(2) ? "Remove from Saved" : "Save to Watch Later"}
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleSaveCourse(2);
                     }}
                     className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                       isCourseSaved(2)
                         ? 'bg-[#1B1B1B] text-white shadow-sm'
                         : 'bg-white/80 hover:bg-white text-[#1B1B1B]'
                     }`}
                   >
                     <Bookmark size={14} className={isCourseSaved(2) ? 'fill-white' : ''} />
                   </button>
                   <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-[12px] text-[12px] font-bold shrink-0 shadow-sm">
                     <span className="text-amber-400 text-[14px] leading-none">★</span> 4.9
                   </div>
                 </div>
              </div>
              
              <div className="relative z-10 mt-auto">
                 <h4 className="font-semibold text-[19px] leading-[1.25] mb-4 text-[#1B1B1B] max-w-[90%]">
                   Powerful Business Writing: Write Concisely
                 </h4>

                 {/* Visual Progress Bar (100% Completed) */}
                 <div className="mb-4 bg-white/50 backdrop-blur-sm rounded-[16px] p-2.5 border border-black/5">
                   <div className="flex justify-between items-center text-[11px] font-bold text-[#1B1B1B] mb-1">
                     <span className="text-[#147B44] flex items-center gap-1">
                       <Check size={12} strokeWidth={3} /> Completed
                     </span>
                     <span className="text-[#147B44]">{writingProgress}%</span>
                   </div>
                   <div className="w-full bg-black/10 h-[5px] rounded-full overflow-hidden">
                     <div 
                       className="bg-[#147B44] h-full rounded-full transition-all duration-700" 
                       style={{ width: `${writingProgress}%` }}
                     />
                   </div>
                 </div>

                 <div className="flex justify-between items-end">
                    <span className="text-[12px] font-medium text-[#1B1B1B] opacity-70">1,463 students</span>
                    <div className="flex -space-x-[12px]">
                      <img src="https://i.pravatar.cc/150?img=13" className="w-[32px] h-[32px] rounded-full border-[2.5px] border-card-yellow object-cover" alt="Avatar" />
                      <img src="https://i.pravatar.cc/150?img=14" className="w-[32px] h-[32px] rounded-full border-[2.5px] border-card-yellow object-cover" alt="Avatar" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          /* Saved / Watch Later Courses List in RightPanel */
          <div className="flex flex-col gap-4">
            {savedCourses.length > 0 ? (
              savedCourses.map((course) => {
                const prog = getProgress(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className={`${course.bgColor} rounded-[28px] p-5 cursor-pointer shadow-sm hover:shadow-md transition-all relative overflow-hidden group border border-black/5`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-white/70 px-3 py-1 rounded-full text-[#1B1B1B]">
                        {course.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveCourse(course.id);
                        }}
                        className="w-7 h-7 rounded-full bg-[#1B1B1B] text-white flex items-center justify-center shadow-sm"
                        title="Remove from Saved"
                      >
                        <Bookmark size={13} className="fill-white" />
                      </button>
                    </div>

                    <h5 className="text-[16px] font-semibold text-[#1B1B1B] leading-snug mb-3">
                      {course.title}
                    </h5>

                    {/* Progress Bar */}
                    <div className="bg-white/60 rounded-[14px] p-2 border border-black/5">
                      <div className="flex justify-between text-[10px] font-extrabold text-[#1B1B1B] mb-1">
                        <span>{prog === 100 ? 'Done' : prog > 0 ? 'In Progress' : 'Not Started'}</span>
                        <span>{prog}%</span>
                      </div>
                      <div className="w-full bg-black/10 h-[4px] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${prog === 100 ? 'bg-[#147B44]' : 'bg-[#1B1B1B]'}`}
                          style={{ width: `${prog}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white rounded-[28px] border border-black/5">
                <Bookmark size={24} className="mx-auto text-[#848484] mb-2" />
                <p className="text-[13px] font-bold text-[#1B1B1B] mb-1">No saved courses</p>
                <p className="text-[11px] text-[#848484] mb-3">Bookmark courses across Explore to build your watch list</p>
                <Link
                  to="/explore"
                  className="text-[12px] font-bold text-[#1B1B1B] underline hover:opacity-80"
                >
                  Browse courses
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <DownloadSummaryModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
      />
    </aside>
  );
}

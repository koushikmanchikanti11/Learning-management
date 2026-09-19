import React, { useState } from 'react';
import { Grid, Laptop, MonitorPlay, Briefcase, Box, Play, Star, Bookmark, Check, Award, FileDown, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import ContinueWatching from './ContinueWatching';
import CertificateModal from './CertificateModal';
import DownloadSummaryModal from './DownloadSummaryModal';
import StudyGoalTracker from './StudyGoalTracker';
import { ALL_COURSES } from '../constants/courses';
import { useCourses } from '../context/CourseContext';
import { Course } from '../types';

export default function MainContent() {
  const [filter, setFilter] = useState('All');
  const [selectedCertCourse, setSelectedCertCourse] = useState<Course | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const { isCourseSaved, toggleSaveCourse, getProgress, getLearningSummaryData } = useCourses();

  const summaryData = getLearningSummaryData();

  const filteredCourses = filter === 'All' 
    ? ALL_COURSES.slice(0, 4) 
    : ALL_COURSES.filter(c => c.category === filter);

  const course1Progress = getProgress(1);
  const course6Progress = getProgress(6);
  const course1 = ALL_COURSES.find(c => c.id === 1)!;
  const course6 = ALL_COURSES.find(c => c.id === 6)!;

  return (
    <main className="flex-1 flex flex-col pt-10 xl:pt-[54px] px-6 md:px-[60px] xl:px-16 w-full min-w-0 pb-12 overflow-x-hidden">
      {/* Top Header with PDF Summary Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-[36px]">
        <div>
          <h1 className="text-[48px] md:text-[64px] xl:text-[72px] font-semibold tracking-tight leading-[1.05] max-w-[500px] text-[#1B1B1B]">
            Invest in your education
          </h1>
        </div>

        {/* Downloadable PDF Summary Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <button
            type="button"
            id="download-summary-pdf-btn"
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#1B1B1B] hover:bg-black text-white text-[13px] font-bold transition-all shadow-sm hover:shadow active:scale-95 group cursor-pointer"
          >
            <FileDown size={16} className="text-amber-400 group-hover:translate-y-0.5 transition-transform" />
            <span>Download Summary (PDF)</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold">
              {summaryData.totalHoursLearned.toFixed(1)}h
            </span>
          </button>
        </div>
      </div>

      {/* Continue Watching Section */}
      <ContinueWatching />

      {/* Study Goals & Pacing Tracker */}
      <StudyGoalTracker />

      <div className="flex flex-nowrap flex-shrink-0 items-center gap-4 md:gap-[22px] mb-[45px] overflow-x-auto py-[10px] min-h-[90px] scrollbar-hide w-auto -mx-6 px-6 md:-mx-[60px] md:px-[60px] xl:-mx-16 xl:px-16">

         <FilterPill icon={<Grid size={22} fill="currentColor" />} label="All" active={filter === 'All'} onClick={() => setFilter('All')} />
         <FilterPill icon={<Laptop size={22} strokeWidth={2} />} label="IT & Software" active={filter === 'IT & Software'} onClick={() => setFilter('IT & Software')} />
         <FilterPill icon={<MonitorPlay size={22} strokeWidth={2} />} label="Media Training" active={filter === 'Media Training'} onClick={() => setFilter('Media Training')} />
         <FilterPill icon={<Briefcase size={22} strokeWidth={2} />} label="Business" active={filter === 'Business'} onClick={() => setFilter('Business')} />
         <FilterPill icon={<Box size={22} strokeWidth={2} />} label="Interior" active={filter === 'Interior'} onClick={() => setFilter('Interior')} />
      </div>

      <h2 className="text-[#848484] text-[16px] font-semibold mb-6 tracking-wide uppercase">Most popular</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-[30px] pb-12">
        {filteredCourses.length > 0 ? filteredCourses.map(course => (
          <CourseCard 
            key={course.id} 
            id={course.id}
            title={course.title}
            category={course.category}
            categoryIcon={course.categoryIcon || <MonitorPlay size={14} strokeWidth={2} />}
            rating={course.rating.toString()}
            color={course.bgColor}
            students={course.students || "0"}
            avatars={course.avatars || []}
            badge={course.badge}
          />
        )) : (
          <div className="col-span-full py-10 text-center text-[#848484] font-medium border-2 border-dashed border-black/5 rounded-[32px]">
            No courses found in this category.
          </div>
        )}
      </div>
      
      <h2 className="text-[#848484] text-[16px] font-semibold pb-6 tracking-wide uppercase">Featured courses</h2>
      
      <div className="flex flex-col gap-6">
         <div className="bg-[#E8E1F5] rounded-[32px] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between shadow-sm relative overflow-hidden group border border-black/5 hover:border-black/10 transition-colors">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none opacity-50"></div>
            <div className="flex flex-col relative z-10 w-full md:w-auto">
               <div className="flex items-center justify-between md:justify-start gap-3 mb-5">
                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-[14px] text-[13px] font-semibold text-[#1B1B1B] shadow-sm w-max">
                    <span><Star size={14} fill="currentColor" className="text-amber-400" /></span> Editor's Choice
                 </div>
                 <button
                   type="button"
                   title={isCourseSaved(1) ? "Remove from Saved" : "Save to Watch Later"}
                   onClick={() => toggleSaveCourse(1)}
                   className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                     isCourseSaved(1)
                       ? 'bg-[#1B1B1B] text-white shadow-md'
                       : 'bg-white/80 hover:bg-white text-[#1B1B1B]'
                   }`}
                 >
                   <Bookmark size={15} className={isCourseSaved(1) ? 'fill-white' : ''} />
                 </button>
               </div>
               <Link to="/course/1">
                 <h3 className="text-[#1B1B1B] text-[26px] md:text-[32px] font-semibold leading-[1.2] mb-3 max-w-[420px] hover:underline">
                   Mastering UI Principles & Animation
                 </h3>
               </Link>
               <p className="text-[#1B1B1B]/70 mb-5 max-w-[380px] text-[14px]">
                 Dive deep into interaction design and discover how to bring your UI to life with advanced animations.
               </p>

               {/* Visual Progress Bar on Dashboard */}
               <div className="mb-5 max-w-[340px] bg-white/60 backdrop-blur-sm rounded-[16px] p-3 border border-black/5">
                 <div className="flex justify-between items-center text-[12px] font-bold text-[#1B1B1B] mb-1.5">
                   <span className="opacity-75">Course progress</span>
                   <span className="font-extrabold">{course1Progress}%</span>
                 </div>
                 <div className="w-full bg-black/10 h-[6px] rounded-full overflow-hidden">
                   <div 
                     className="bg-[#1B1B1B] h-full rounded-full transition-all duration-700" 
                     style={{ width: `${course1Progress}%` }}
                   />
                 </div>
                 {course1Progress === 100 && (
                   <button
                     onClick={() => setSelectedCertCourse(course1)}
                     className="mt-3 w-full py-2 px-3 rounded-full bg-amber-100 text-amber-900 text-[12px] font-extrabold flex items-center justify-center gap-1.5 hover:bg-amber-200 transition-colors shadow-sm"
                   >
                     <Award size={14} /> View Certificate
                   </button>
                 )}
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex -space-x-[12px]">
                    <img src="https://randomuser.me/api/portraits/women/42.jpg" className="w-[38px] h-[38px] rounded-full border-[2.5px] border-white object-cover" alt="Student" />
                    <img src="https://randomuser.me/api/portraits/men/43.jpg" className="w-[38px] h-[38px] rounded-full border-[2.5px] border-white object-cover" alt="Student" />
                    <img src="https://randomuser.me/api/portraits/men/45.jpg" className="w-[38px] h-[38px] rounded-full border-[2.5px] border-white object-cover" alt="Student" />
                  </div>
                  <span className="text-[13px] font-bold text-[#1B1B1B]/70">+12k enrolled</span>
               </div>
            </div>
            <Link to="/course/1" className="relative z-10 w-[70px] h-[70px] md:w-[90px] md:h-[90px] shrink-0 bg-white rounded-full flex items-center justify-center text-[#1B1B1B] shadow-sm hover:scale-105 transition-transform duration-500 self-end md:self-center">
               <Play size={28} fill="currentColor" className="ml-2" />
            </Link>
         </div>
         
         <div className="bg-[#E7E2DF] rounded-[32px] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between shadow-sm border border-black/5 relative overflow-hidden group hover:border-black/10 transition-colors">
            <div className="flex flex-col relative z-10 w-full md:w-auto">
               <div className="flex items-center justify-between md:justify-start gap-3 mb-5">
                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-[14px] text-[13px] font-semibold text-[#1B1B1B] shadow-sm w-max">
                    <span><Laptop size={14} strokeWidth={2.5} /></span> Programming
                 </div>
                 <button
                   type="button"
                   title={isCourseSaved(6) ? "Remove from Saved" : "Save to Watch Later"}
                   onClick={() => toggleSaveCourse(6)}
                   className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                     isCourseSaved(6)
                       ? 'bg-[#1B1B1B] text-white shadow-md'
                       : 'bg-white/80 hover:bg-white text-[#1B1B1B]'
                   }`}
                 >
                   <Bookmark size={15} className={isCourseSaved(6) ? 'fill-white' : ''} />
                 </button>
               </div>
               <Link to="/course/6">
                 <h3 className="text-[#1B1B1B] text-[26px] md:text-[32px] font-semibold leading-[1.2] mb-3 max-w-[420px] hover:underline">
                   Zero to Hero with React & Next.js
                 </h3>
               </Link>
               <p className="text-[#1B1B1B]/60 mb-5 max-w-[400px] text-[14px]">
                 Learn how to build scalable and performant web applications using the latest React paradigms.
               </p>

               {/* Visual Progress Bar on Dashboard */}
               <div className="mb-5 max-w-[340px] bg-white/60 backdrop-blur-sm rounded-[16px] p-3 border border-black/5">
                 <div className="flex justify-between items-center text-[12px] font-bold text-[#1B1B1B] mb-1.5">
                   <span className="opacity-75">Course progress</span>
                   <span className="font-extrabold">{course6Progress}%</span>
                 </div>
                 <div className="w-full bg-black/10 h-[6px] rounded-full overflow-hidden">
                   <div 
                     className="bg-[#1B1B1B] h-full rounded-full transition-all duration-700" 
                     style={{ width: `${course6Progress}%` }}
                   />
                 </div>
               </div>

               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-[14px] font-bold text-[#1B1B1B]">
                    <span className="text-amber-500">★</span> 4.9 <span className="opacity-50 font-medium">(2.4k reviews)</span>
                  </span>
               </div>
            </div>
            <Link to="/course/6" className="relative z-10 w-[70px] h-[70px] md:w-[90px] md:h-[90px] shrink-0 bg-[#1B1B1B] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform duration-500 self-end md:self-center">
               <Play size={28} fill="currentColor" className="ml-2" />
            </Link>
         </div>
      </div>
      
      {selectedCertCourse && (
        <CertificateModal
          course={selectedCertCourse}
          isOpen={true}
          onClose={() => setSelectedCertCourse(null)}
        />
      )}

      <DownloadSummaryModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
      />
    </main>
  );
}

function FilterPill({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 pr-[26px] pl-[10px] py-[10px] rounded-full text-[14px] font-semibold transition-all whitespace-nowrap border-[1.5px] flex-shrink-0 ${
      active ? 'bg-[#1B1B1B] border-[#1B1B1B] text-white shadow-md' : 'bg-white border-black/5 text-[#1B1B1B] hover:border-black/10 hover:bg-black/[0.02]'
    }`}>
       <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-colors ${active ? 'bg-white/10 text-white' : 'bg-transparent text-[#1B1B1B]'}`}>
         {icon}
       </div>
       {label}
    </button>
  );
}

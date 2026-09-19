import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Pause, Maximize2, Volume2, ChevronLeft, CheckCircle2, ChevronRight, FileText, Download, MessageSquare, MoreHorizontal, Subtitles, Settings, Clock, Award, Check } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { ALL_COURSES } from '../constants/courses';
import { DEFAULT_MODULES } from '../constants/curriculums';
import { calculateLessonTime } from '../utils/lessonTime';
import CertificateModal from '../components/CertificateModal';
import FloatingLessonNotes from '../components/FloatingLessonNotes';

export default function LessonDetails() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Transcript');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  
  const { recordLessonAccess, getProgress, markCourseCompleted, updateProgress } = useCourses();

  const numericId = parseInt(id || '1', 10) || 1;
  const currentCourse = ALL_COURSES.find((c) => c.id === numericId) || ALL_COURSES[0];
  const progress = getProgress(numericId);

  // Flatten lessons from DEFAULT_MODULES
  const allLessons = DEFAULT_MODULES.flatMap((m) => m.lessons);
  const currentLessonId = parseInt(lessonId || '2', 10) || 2;
  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[1] || allLessons[0];
  
  const timeEstimate = calculateLessonTime(currentLesson);

  // Automatically record lesson access for the Dashboard's "Continue Watching" feature
  useEffect(() => {
    if (currentCourse && currentLesson) {
      recordLessonAccess(currentCourse, currentLesson);
    }
  }, [numericId, currentLesson?.id]);

  return (
    <main className="flex-1 flex flex-col pt-10 xl:pt-8 px-6 md:px-[60px] xl:px-10 w-full min-w-0 pb-10 h-[calc(100vh-2rem)] overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <Link to={`/course/${numericId}`} className="inline-flex items-center gap-2 text-[14px] font-bold text-[#848484] hover:text-[#1B1B1B] transition-colors bg-white border border-black/5 px-4 py-2 rounded-full shadow-sm">
             <ChevronLeft size={16} /> Course Overview
          </Link>
          <div className="flex items-center gap-3">
             {progress === 100 && (
               <button 
                 onClick={() => setShowCertModal(true)}
                 className="bg-amber-400 text-amber-950 font-extrabold text-[12px] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm hover:bg-amber-300 transition-colors"
               >
                 <Award size={14} /> Certificate Ready
               </button>
             )}
             <button className="bg-white border border-black/5 p-2.5 rounded-full shadow-sm text-[#848484] hover:text-[#1B1B1B] transition-colors">
                <MessageSquare size={18} />
             </button>
             <button className="bg-white border border-black/5 p-2.5 rounded-full shadow-sm text-[#848484] hover:text-[#1B1B1B] transition-colors">
                <MoreHorizontal size={18} />
             </button>
          </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 h-full min-h-0 overflow-hidden relative">
         
         {/* Main Content Area */}
         <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide pb-20">
            {/* Cinematic Video Player */}
            <div className="w-full aspect-[16/9] bg-black rounded-[32px] md:rounded-[40px] relative overflow-hidden group shadow-xl mb-10 shrink-0">
               <img src="https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1600&q=80" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" alt="lesson thumbnail" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>
               
               {/* Center Play Button */}
               <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white hover:scale-110 hover:bg-white/30 transition-all z-10 shadow-2xl">
                  <Play size={32} fill="currentColor" className="ml-2" />
               </button>

               {/* Video Controls */}
               <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="w-full h-1.5 bg-white/30 rounded-full mb-6 relative cursor-pointer hover:h-2.5 transition-all group/progress">
                     <div className="w-[35%] h-full bg-[#B2F0D1] rounded-full relative shadow-[0_0_10px_rgba(178,240,209,0.5)]">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md scale-0 group-hover/progress:scale-100 transition-transform"></div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between text-white">
                     <div className="flex items-center gap-6">
                        <button className="hover:text-[#B2F0D1] transition-colors"><Play size={24} fill="currentColor" /></button>
                        <button className="hover:text-[#B2F0D1] transition-colors"><Volume2 size={22} /></button>
                        <span className="text-[14px] font-semibold tracking-wide">04:12 <span className="opacity-50">/ 12:45</span></span>
                     </div>
                     <div className="flex items-center gap-6">
                        <button className="hover:text-[#B2F0D1] transition-colors"><Subtitles size={22} /></button>
                        <button className="hover:text-[#B2F0D1] transition-colors"><Settings size={22} /></button>
                        <button className="hover:text-[#B2F0D1] transition-colors"><Maximize2 size={22} /></button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="max-w-[800px]">
               <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-[#1B1B1B] text-white px-3 py-1 rounded-[10px] text-[12px] font-bold tracking-wide uppercase">
                    Lesson {currentLesson.id}
                  </span>
                  <span className="bg-[#E8E1F5] text-[#1B1B1B] px-3 py-1 rounded-[10px] text-[12px] font-bold tracking-wide uppercase">
                    {currentLesson.type}
                  </span>
                  {/* Estimated Time Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#1B1B1B] text-[12px] font-bold">
                    <Clock size={13} className="text-amber-600" />
                    <span>Est. {currentLesson.type === 'reading' ? 'Reading' : 'Completion'}: {timeEstimate.formattedEstimate}</span>
                  </div>
                  {timeEstimate.breakdown && (
                    <span className="text-[12px] text-[#848484] font-medium hidden sm:inline">
                      ({timeEstimate.breakdown})
                    </span>
                  )}
               </div>

               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                 <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight leading-[1.15] text-[#1B1B1B]">
                   {currentLesson.title}
                 </h1>
               </div>

               {/* Quick Progress / Complete Action */}
               <div className="mb-6 p-4 rounded-[22px] bg-white border border-black/5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[14px] ${progress === 100 ? 'bg-amber-400 text-amber-950' : 'bg-black/5 text-[#1B1B1B]'}`}>
                       {progress === 100 ? <Award size={18} /> : `${progress}%`}
                     </div>
                     <div>
                       <span className="text-[13px] font-bold text-[#1B1B1B] block">Course Progress: {progress}%</span>
                       <span className="text-[12px] text-[#848484] block">{progress === 100 ? '100% complete! Certificate unlocked' : 'Finish all lessons to claim your verified certificate.'}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     {progress === 100 ? (
                       <button
                         type="button"
                         onClick={() => setShowCertModal(true)}
                         className="px-4 py-2 rounded-full bg-amber-400 text-amber-950 text-[13px] font-extrabold hover:bg-amber-300 transition-colors shadow-xs flex items-center gap-1.5"
                       >
                         <Award size={15} /> Claim Certificate
                       </button>
                     ) : (
                       <button
                         type="button"
                         onClick={() => {
                           const nextProg = Math.min(100, progress + 25);
                           updateProgress(numericId, nextProg);
                           if (nextProg === 100) setShowCertModal(true);
                         }}
                         className="px-4 py-2 rounded-full bg-[#1B1B1B] text-white text-[13px] font-bold hover:bg-black transition-colors flex items-center gap-1.5"
                       >
                         <Check size={14} /> Mark Lesson Done (+25%)
                       </button>
                     )}
                     <button
                       type="button"
                       onClick={() => {
                         if (progress === 100) {
                           updateProgress(numericId, 0);
                         } else {
                           markCourseCompleted(numericId);
                           setShowCertModal(true);
                         }
                       }}
                       className="px-3 py-2 text-[12px] font-bold text-[#848484] hover:text-[#1B1B1B] underline"
                     >
                       {progress === 100 ? 'Reset' : 'Quick 100%'}
                     </button>
                  </div>
               </div>

               <p className="text-[#848484] font-medium text-[16px] md:text-[18px] leading-[1.6] mb-10">
                  {currentLesson.description || "In this lesson, we will cover the core concepts of declarative animations. You will learn about key principles, how to implement stagger properties, and the importance of pacing in modern interfaces."}
               </p>

               {/* Content Tabs */}
               <div className="flex items-center gap-2 bg-white border border-black/5 p-1.5 rounded-full inline-flex mb-8 shadow-sm">
                  {['Transcript', 'Notes', 'Resources'].map(tab => (
                    <button
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`px-6 py-2.5 rounded-full text-[15px] font-bold transition-all ${
                         activeTab === tab ? 'bg-[#1B1B1B] text-white shadow-md' : 'text-[#848484] hover:text-[#1B1B1B] hover:bg-transparent'
                       }`}
                    >
                       {tab}
                    </button>
                  ))}
               </div>

               <div className="bg-white border border-black/5 rounded-[32px] p-8 md:p-10 shadow-sm">
                  {activeTab === 'Transcript' && (
                     <div className="space-y-8">
                        <div className="flex gap-6 group">
                           <button className="text-[14px] font-bold text-[#848484] group-hover:text-[#1B1B1B] bg-bg-base px-3 py-1.5 rounded-lg h-8 transition-colors shrink-0">00:00</button>
                           <p className="flex-1 text-[#848484] font-medium text-[16px] leading-[1.8] group-hover:text-[#1B1B1B] transition-colors">
                              Welcome back. In this specific module we are going to dive straight into one of the most powerful animation libraries available for React today, Framer Motion. We're going to see how it radically simplifies creating complex UI transitions.
                           </p>
                        </div>
                        <div className="flex gap-6 group">
                           <button className="text-[14px] font-bold text-[#848484] group-hover:text-[#1B1B1B] bg-bg-base px-3 py-1.5 rounded-lg h-8 transition-colors shrink-0">00:45</button>
                           <p className="flex-1 text-[#848484] font-medium text-[16px] leading-[1.8] group-hover:text-[#1B1B1B] transition-colors">
                              Start by bringing in the motion component. You can think of a motion component exactly like a standard HTML element, but it has super-powers. We define our initial state, our target state, and let the library handle the interpolation automatically under the hood using Spring physics.
                           </p>
                        </div>
                        <div className="flex gap-6 group">
                           <button className="text-[14px] font-bold text-white bg-[#1B1B1B] px-3 py-1.5 rounded-lg h-8 shadow-sm shrink-0">02:15</button>
                           <p className="flex-1 text-[#1B1B1B] font-semibold text-[16px] leading-[1.8] bg-[#E8E1F5]/50 p-4 rounded-[20px] -mt-2">
                              Now, let's attach an exit property. This is crucial when components are removed from the React DOM, and allows us to animate them out smoothly instead of them disappearing abruptly, which is a common jarring experience in SPAs.
                           </p>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Resources' && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-black/5 bg-[#fafafa] rounded-[24px] p-5 flex items-center justify-between hover:bg-white hover:shadow-md hover:border-black/10 cursor-pointer transition-all group">
                           <div className="flex flex-col gap-3">
                              <div className="w-12 h-12 bg-[#DCDDFF] rounded-[14px] flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <FileText size={20} className="fill-indigo-100" />
                              </div>
                              <div>
                                 <h4 className="text-[16px] font-bold text-[#1B1B1B]">Starter_Code.zip</h4>
                                 <span className="text-[13px] font-medium text-[#848484]">ZIP • 2.4 MB</span>
                              </div>
                           </div>
                           <button className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#1B1B1B] shadow-sm"><Download size={18} /></button>
                        </div>
                        <div className="border border-black/5 bg-[#fafafa] rounded-[24px] p-5 flex items-center justify-between hover:bg-white hover:shadow-md hover:border-black/10 cursor-pointer transition-all group">
                           <div className="flex flex-col gap-3">
                              <div className="w-12 h-12 bg-card-yellow rounded-[14px] flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                <FileText size={20} className="fill-amber-100" />
                              </div>
                              <div>
                                 <h4 className="text-[16px] font-bold text-[#1B1B1B]">Animation_Guide.pdf</h4>
                                 <span className="text-[13px] font-medium text-[#848484]">PDF • 1.1 MB</span>
                              </div>
                           </div>
                           <button className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#1B1B1B] shadow-sm"><Download size={18} /></button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Floating Right Sidebar Curriculum */}
         <div className="w-full xl:w-[400px] flex-shrink-0 bg-[#f8f8f8] border border-black/5 rounded-[32px] p-2 flex flex-col h-full overflow-hidden hidden xl:flex relative">
            <div className="p-6 bg-white rounded-[24px] shadow-sm mb-2 border border-black/[0.02]">
               <h3 className="text-[20px] font-bold text-[#1B1B1B] mb-1">Up Next</h3>
               <p className="text-[14px] font-medium text-[#848484] mb-4">Module 1 • 2 of 12 lessons</p>
               <div className="w-full bg-bg-base h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1B1B1B] w-[20%] h-full rounded-full relative">
                     <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/30 to-transparent"></div>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide p-2 flex flex-col gap-2">
               {allLessons.map((lesson, i) => {
                 const isCurrent = lesson.id === currentLesson.id;
                 const est = calculateLessonTime(lesson);
                 return (
                   <div 
                     key={lesson.id} 
                     onClick={() => navigate(`/course/${numericId}/lesson/${lesson.id}`)}
                     className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all border ${
                        isCurrent 
                          ? 'bg-[#1B1B1B] text-white shadow-xl shadow-black/10 scale-[1.01] border-transparent' 
                          : 'hover:bg-white bg-white/60 border-black/5 hover:border-black/10'
                     }`}
                   >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-black/5 text-[#1B1B1B]'
                      }`}>
                         {isCurrent ? (
                            <div className="w-4 h-4 flex items-end justify-center gap-0.5">
                               <div className="w-[3px] h-[60%] bg-white rounded-full animate-[bounce_1s_infinite]"></div>
                               <div className="w-[3px] h-[100%] bg-white rounded-full animate-[bounce_1s_infinite_100ms]"></div>
                               <div className="w-[3px] h-[40%] bg-white rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                            </div>
                         ) : (
                            <Play size={16} fill="currentColor" className="ml-0.5 opacity-60" />
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-[14px] font-bold truncate ${isCurrent ? 'text-white' : 'text-[#1B1B1B]'}`}>
                              {i + 1}. {lesson.title}
                            </h4>
                         </div>
                         <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[11px] font-medium uppercase tracking-wide ${isCurrent ? 'text-white/70' : 'text-[#848484]'}`}>
                              {lesson.type} • {lesson.time}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isCurrent ? 'bg-white/20 text-white' : 'bg-black/5 text-[#1B1B1B]'
                            }`}>
                              Est: {est.formattedEstimate}
                            </span>
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>

      </div>

      <CertificateModal
        course={currentCourse}
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
      />

      <FloatingLessonNotes
        lessonId={currentLesson.id}
        lessonTitle={currentLesson.title}
        courseTitle={currentCourse.title}
        currentTime="04:12"
      />
    </main>
  );
}

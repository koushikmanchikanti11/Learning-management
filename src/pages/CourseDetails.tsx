import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Play, CheckCircle2, ChevronLeft, Globe, Award, ChevronDown, ChevronUp, FileText, Zap, Bookmark, Check, Sparkles, BookOpen } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { ALL_COURSES } from '../constants/courses';
import { DEFAULT_MODULES } from '../constants/curriculums';
import { calculateLessonTime } from '../utils/lessonTime';
import StudyPacingPlanner from '../components/StudyPacingPlanner';
import CertificateModal from '../components/CertificateModal';
import CourseSummaryModal from '../components/CourseSummaryModal';
import FlashcardDeck from '../components/FlashcardDeck';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [openModule, setOpenModule] = useState<number | null>(1);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const { isCourseSaved, toggleSaveCourse, getProgress, markCourseCompleted, updateProgress, recordLessonAccess } = useCourses();

  const numericId = parseInt(id || '1', 10) || 1;
  const currentCourse = ALL_COURSES.find((c) => c.id === numericId) || ALL_COURSES[0];
  const isSaved = isCourseSaved(numericId);
  const progress = getProgress(numericId);
  const modules = DEFAULT_MODULES;

  return (
    <main className="flex-1 flex flex-col pt-10 xl:pt-[44px] px-6 md:px-[60px] xl:px-16 w-full min-w-0 pb-20 overflow-y-auto">
       <Link to="/explore" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#848484] hover:text-[#1B1B1B] mb-8 transition-colors w-max">
          <ChevronLeft size={18} /> Back to explore
       </Link>

       <div className={`${currentCourse.bgColor || 'bg-[#E8E1F5]'} rounded-[40px] p-8 md:p-12 relative overflow-hidden mb-12 shadow-sm border border-black/5 flex flex-col md:flex-row items-center justify-between gap-12`}>
          <div className="absolute -top-10 -right-10 w-[60%] h-[150%] bg-gradient-to-l from-white/30 to-transparent transform -skew-x-[12deg] pointer-events-none"></div>
          
          <div className="flex flex-col relative z-10 w-full md:w-[55%] shrink-0">
            <div className="flex gap-3 mb-6 flex-wrap items-center">
               <span className="bg-[#1B1B1B] px-4 py-2 rounded-[14px] text-[13px] font-bold text-white shadow-sm flex items-center gap-2">
                  <Star size={14} className="text-amber-400 fill-amber-400" /> Bestseller
               </span>
               <span className="bg-white/60 px-4 py-2 rounded-[14px] text-[13px] font-bold text-[#1B1B1B] shadow-sm">
                  {currentCourse.category || 'Design'}
               </span>
               {currentCourse.topic && (
                 <span className="bg-white/40 px-3.5 py-2 rounded-[14px] text-[13px] font-bold text-[#1B1B1B] shadow-sm">
                   #{currentCourse.topic}
                 </span>
               )}
            </div>
            
            <h1 className="text-[38px] md:text-[48px] xl:text-[54px] font-semibold tracking-tight leading-[1.05] mb-5 text-[#1B1B1B]">
              {currentCourse.title}
            </h1>
            
            <p className="text-[#1B1B1B]/70 text-[16px] md:text-[17px] leading-relaxed mb-6 max-w-[500px]">
               {currentCourse.description || "Dive deep into interaction design and discover how to bring your interfaces to life with advanced motion principles and Framer animations."}
            </p>

            {/* Visual Course Progress Bar */}
            <div className="mb-8 max-w-[420px] bg-white/60 backdrop-blur-sm rounded-[20px] p-4 border border-black/5">
              <div className="flex justify-between items-center text-[13px] font-bold text-[#1B1B1B] mb-2">
                <span className="opacity-75 flex items-center gap-1.5">
                  {progress === 100 ? (
                    <span className="text-[#147B44] flex items-center gap-1">
                      <Check size={14} strokeWidth={3} /> Completed
                    </span>
                  ) : progress > 0 ? (
                    'In progress'
                  ) : (
                    'Not started'
                  )}
                </span>
                <span className="font-extrabold">{progress}% Completed</span>
              </div>
              <div className="w-full bg-black/10 h-[8px] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    progress === 100 ? 'bg-[#147B44]' : 'bg-[#1B1B1B]'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 gap-y-4 mb-8">
               <div className="flex items-center gap-2 text-[14px] font-bold text-[#1B1B1B]">
                 <Star size={16} className="fill-[#1B1B1B]" /> {currentCourse.rating} <span className="opacity-60 font-medium">(2.4k ratings)</span>
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#1B1B1B]/20 hidden sm:block"></div>
               <div className="flex items-center gap-2 text-[14px] font-bold text-[#1B1B1B]">
                 <Users size={16} /> {currentCourse.students || '12,450'} students
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#1B1B1B]/20 hidden md:block"></div>
               <div className="flex items-center gap-2 text-[14px] font-bold text-[#1B1B1B]">
                 <Clock size={16} /> 14.5 hours
               </div>
            </div>

            {/* Certificate Award Banner when 100% completed */}
            {progress === 100 && (
              <div className="mb-6 p-4 rounded-[22px] bg-amber-300/30 border border-amber-400/40 backdrop-blur-sm flex items-center justify-between gap-4 max-w-[500px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                    <Award size={22} />
                  </div>
                  <div>
                    <span className="text-[14px] font-extrabold text-[#1B1B1B] block">Course 100% Completed!</span>
                    <span className="text-[12px] font-medium text-[#1B1B1B]/70 block">Your personalized verified certificate is ready.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="px-3.5 py-2 rounded-full bg-[#1B1B1B] text-white text-[12px] font-extrabold hover:bg-black transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <Award size={14} /> View
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => navigate(`/course/${numericId}/lesson/1`)}
                className="bg-[#1B1B1B] text-white px-8 py-4 rounded-full text-[15px] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-3 group cursor-pointer"
              >
                 <Play size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" /> Start Learning
              </button>

              {/* Gemini AI Course Summary Modal Trigger */}
              <button 
                id="course-ai-summary-btn"
                type="button"
                onClick={() => setShowSummaryModal(true)}
                title="Generate brief AI summary with Gemini"
                className="bg-purple-100 hover:bg-purple-200 text-purple-950 px-6 py-4 rounded-full text-[14px] font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 border border-purple-200 cursor-pointer active:scale-95"
              >
                <Sparkles size={16} className="text-purple-600 fill-purple-300" />
                <span>AI Summary</span>
              </button>

              {/* Study Flashcards Trigger */}
              <button 
                id="course-flashcards-tab-btn"
                type="button"
                onClick={() => setActiveTab('Flashcards')}
                title="Quiz yourself with extracted terms and definitions"
                className="bg-white/90 hover:bg-white text-[#1B1B1B] px-6 py-4 rounded-full text-[14px] font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 border border-black/5 cursor-pointer active:scale-95"
              >
                <Zap size={16} className="text-amber-500 fill-amber-400" />
                <span>Study Flashcards</span>
              </button>
              
              {progress === 100 ? (
                <button 
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="bg-amber-400 text-amber-950 px-7 py-4 rounded-full text-[15px] font-extrabold shadow-md hover:bg-amber-300 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award size={18} /> View Certificate
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  title="Preview certificate of completion"
                  className="bg-white/80 hover:bg-white text-[#1B1B1B] px-5 py-4 rounded-full text-[14px] font-bold shadow-xs transition-all flex items-center gap-2 border border-black/5 cursor-pointer"
                >
                  <Award size={16} className="text-amber-600" /> Preview Certificate
                </button>
              )}

              <button 
                id="details-bookmark-btn"
                type="button"
                onClick={() => toggleSaveCourse(numericId)}
                className={`px-7 py-4 rounded-full text-[15px] font-bold shadow-sm transition-all flex items-center gap-2.5 border cursor-pointer ${
                  isSaved
                    ? 'bg-[#1B1B1B] text-white border-[#1B1B1B] shadow-md'
                    : 'bg-white text-[#1B1B1B] hover:bg-black/5 border-black/5'
                }`}
              >
                 <Bookmark size={17} className={isSaved ? 'fill-white text-white' : 'text-[#1B1B1B]'} />
                 <span>{isSaved ? 'Saved to Watch Later' : 'Save for later'}</span>
              </button>

              {/* Development/Testing Progress Simulator */}
              <button
                type="button"
                onClick={() => {
                  if (progress === 100) {
                    updateProgress(numericId, 0);
                  } else {
                    markCourseCompleted(numericId);
                  }
                }}
                className="text-[12px] font-bold text-[#1B1B1B]/60 hover:text-[#1B1B1B] underline underline-offset-4 py-2 px-1 cursor-pointer"
              >
                {progress === 100 ? "↺ Reset Progress" : "✓ Quick Test: Set 100% Complete"}
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full md:max-w-[40%] aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl group border-[6px] border-white shrink-0">
             <img src="https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=800&q=80" alt="Course Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer">
                <button className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1B1B1B] shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                   <Play size={32} fill="currentColor" className="ml-1.5" />
                </button>
             </div>
          </div>
       </div>

       {/* Floating Navigation */}
       <div className="sticky top-0 z-20 bg-bg-base/80 backdrop-blur-md pt-4 mb-10 -mx-6 px-6 md:-mx-[60px] md:px-[60px] xl:-mx-16 xl:px-16">
         <div className="flex items-center gap-8 border-b border-black/10 overflow-x-auto scrollbar-hide">
            {['Overview', 'Curriculum', 'Flashcards', 'Instructor', 'Reviews'].map(tab => (
              <button
                 key={tab}
                 id={`course-tab-${tab.toLowerCase()}`}
                 onClick={() => setActiveTab(tab)}
                 className={`pb-4 text-[16px] font-bold transition-colors relative whitespace-nowrap px-2 flex items-center gap-2 cursor-pointer ${
                   activeTab === tab ? 'text-[#1B1B1B]' : 'text-[#848484] hover:text-[#1B1B1B]'
                 }`}
              >
                 {tab === 'Flashcards' && <Zap size={14} className="text-amber-500 fill-amber-400" />}
                 <span>{tab}</span>
                 {tab === 'Flashcards' && (
                   <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                     Study
                   </span>
                 )}
                 {activeTab === tab && (
                   <div className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-full bg-[#1B1B1B]"></div>
                 )}
              </button>
            ))}
         </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative">
          <div className="xl:col-span-2 flex flex-col gap-12">
             {activeTab === 'Overview' && (
                <>
                  {/* AI Course Summary & Flashcard Highlights Banner */}
                  <div className="bg-gradient-to-r from-purple-50 via-indigo-50/40 to-amber-50/40 rounded-[30px] p-6 sm:p-7 border border-purple-200/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Sparkles size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[18px] font-bold text-[#1B1B1B]">
                            AI-Powered Course Intelligence
                          </h3>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-200 text-purple-950">
                            Gemini 3.8
                          </span>
                        </div>
                        <p className="text-[14px] text-[#1B1B1B]/70 font-medium leading-relaxed max-w-lg">
                          Get an executive synopsis in seconds or quiz yourself on key terms and definitions before jumping into the curriculum.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setShowSummaryModal(true)}
                        className="px-4 py-2.5 rounded-full bg-white hover:bg-black/5 text-[#1B1B1B] text-[13px] font-bold transition-all shadow-xs border border-black/10 cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles size={14} className="text-purple-600" />
                        <span>Brief Summary</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('Flashcards')}
                        className="px-4 py-2.5 rounded-full bg-[#1B1B1B] hover:bg-black text-white text-[13px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Zap size={14} className="fill-amber-400 text-amber-400" />
                        <span>Study Deck</span>
                      </button>
                    </div>
                  </div>

                  <section>
                     <h2 className="text-[26px] font-semibold text-[#1B1B1B] mb-6 tracking-tight">About this course</h2>
                     <p className="text-[#848484] text-[16px] leading-[1.8] font-medium">
                        This comprehensive Masterclass is designed to take you from a basic understanding of UI design to deploying complex, production-ready animations. We cover everything from foundational layout principles and typography to advanced motion choreography and micro-interactions using industry-standard tools.
                        <br /><br />
                        By the end of this course, you will have a stunning portfolio of animated components and the technical know-how to implement them in React or hand them off effectively to engineering teams.
                     </p>
                  </section>
                  
                  <section>
                     <h2 className="text-[26px] font-semibold text-[#1B1B1B] mb-6 tracking-tight">What you will learn</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                        {[
                          'Master layout design principles', 'Create complex interaction flows',
                          'Build advanced vector graphic animations', 'Perform user-centric usability testing',
                          'Develop accessible UI components', 'Export assets for developer handoff',
                          'Build an extensive motion design system', 'Master Framer Motion invariants'
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-[20px] bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                              <div className="w-8 h-8 rounded-full bg-[#B2F0D1] flex items-center justify-center shrink-0 text-green-800 mt-0.5">
                                <CheckCircle2 size={16} strokeWidth={3} />
                              </div>
                              <span className="text-[#1B1B1B]/80 font-semibold leading-snug">{item}</span>
                            </div>
                        ))}
                     </div>
                  </section>
                </>
             )}

             {activeTab === 'Curriculum' && (
                <div className="flex flex-col gap-5">
                   <StudyPacingPlanner modules={modules} courseTitle={currentCourse.title} />

                   <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                     <div>
                       <h2 className="text-[24px] font-bold text-[#1B1B1B] tracking-tight">Curriculum & Time Breakdown</h2>
                       <p className="text-[#848484] font-medium text-[14px]">
                         Estimated study times include reading speed factors and video review buffers.
                       </p>
                     </div>
                     <p className="text-[#848484] font-semibold text-[14px] mt-1 md:mt-0">
                       {modules.length} sections • {modules.reduce((acc, curr) => acc + curr.lessons.length, 0)} lessons
                     </p>
                   </div>

                   {modules.map((mod, i) => (
                      <div key={mod.id} className="bg-white border border-black/5 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                         <button 
                           type="button"
                           onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                           className="w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left outline-none"
                         >
                            <div className="flex items-center gap-5">
                               <div className="w-12 h-12 rounded-[14px] bg-[#f4f4f4] flex items-center justify-center text-[#1B1B1B] font-bold text-[16px] shrink-0">
                                  {i + 1}
                               </div>
                               <div>
                                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#1B1B1B] mb-1">{mod.title}</h3>
                                  <p className="text-[14px] font-medium text-[#848484]">{mod.lessons.length} lessons • {mod.time}</p>
                               </div>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/5 text-[#1B1B1B] transition-transform duration-300 shrink-0 ${openModule === mod.id ? 'rotate-180' : ''}`}>
                               <ChevronDown size={20} />
                            </div>
                         </button>
                         
                         {openModule === mod.id && (
                           <div className="flex flex-col border-t border-black/5 bg-[#fafafa]">
                             {mod.lessons.map((lesson) => {
                               const timeEst = calculateLessonTime(lesson);
                               return (
                                 <div 
                                   key={lesson.id} 
                                   onClick={() => {
                                     recordLessonAccess(currentCourse, lesson);
                                     navigate(`/course/${numericId}/lesson/${lesson.id}`);
                                   }}
                                   className="px-6 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#f0f0f0] cursor-pointer transition-colors border-b border-black/5 last:border-0"
                                 >
                                    <div className="flex items-start gap-4">
                                       <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                                         lesson.type === 'video' 
                                           ? 'text-indigo-600 bg-indigo-100' 
                                           : lesson.type === 'exercise' 
                                           ? 'text-amber-600 bg-amber-100' 
                                           : 'text-sky-600 bg-sky-100'
                                       } group-hover:scale-105 transition-transform`}>
                                         {lesson.type === 'video' ? (
                                           <Play size={15} fill="currentColor" />
                                         ) : lesson.type === 'exercise' ? (
                                           <Zap size={15} fill="currentColor" />
                                         ) : (
                                           <FileText size={15} />
                                         )}
                                       </div>
                                       <div>
                                         <div className="flex items-center gap-2 flex-wrap">
                                           <span className="text-[15px] font-semibold text-[#1B1B1B]/90 group-hover:text-[#1B1B1B] transition-colors">
                                             {lesson.title}
                                           </span>
                                           <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                             lesson.type === 'video' ? 'bg-indigo-50 text-indigo-700' :
                                             lesson.type === 'reading' ? 'bg-sky-50 text-sky-700' :
                                             'bg-amber-50 text-amber-700'
                                           }`}>
                                             {lesson.type}
                                           </span>
                                           {lesson.isFree && (
                                             <span className="text-[10px] font-bold bg-[#1B1B1B] text-white px-2 py-0.5 rounded-md uppercase tracking-wide">
                                               Preview
                                             </span>
                                           )}
                                         </div>
                                         {timeEst.breakdown && (
                                           <span className="text-[12px] text-[#848484] mt-0.5 block">
                                             {timeEst.breakdown}
                                           </span>
                                         )}
                                       </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                                       {/* Estimated Reading / Completion Time Badge */}
                                       <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/5 text-[#1B1B1B] text-[12px] font-bold shadow-xs">
                                         <Clock size={12} className="text-amber-600" />
                                         <span>{timeEst.formattedEstimate}</span>
                                       </div>
                                       <span className="text-[13px] font-semibold text-[#848484] min-w-[42px] text-right">
                                         {lesson.time}
                                       </span>
                                    </div>
                                 </div>
                               );
                             })}
                           </div>
                         )}
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'Flashcards' && (
                <FlashcardDeck
                  course={currentCourse}
                  modules={modules}
                  onOpenSummaryModal={() => setShowSummaryModal(true)}
                />
             )}

             {activeTab === 'Instructor' && (
                <div className="flex flex-col gap-6">
                   <div className="flex items-start gap-6">
                       <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Instructor" className="w-[120px] h-[120px] rounded-[32px] object-cover shadow-md" />
                       <div className="flex flex-col pt-2">
                          <h2 className="text-[32px] font-bold text-[#1B1B1B] leading-none mb-2">David Anderson</h2>
                          <p className="text-[16px] font-semibold text-[#848484] mb-4">Lead Motion Designer at Meta</p>
                          <div className="flex gap-4">
                             <div className="flex items-center gap-2 bg-white border border-black/5 px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#1B1B1B]">
                                <Star size={14} className="fill-amber-400 text-amber-400" /> 4.9 Instructor Rating
                             </div>
                             <div className="flex items-center gap-2 bg-white border border-black/5 px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#1B1B1B]">
                                <Users size={14} className="text-[#848484]" /> 140k Students
                             </div>
                          </div>
                       </div>
                   </div>
                   <p className="text-[16px] font-medium text-[#848484] leading-relaxed mt-4">
                      David is an award-winning designer working at the intersection of product and motion. He has helped define the interactive languages at companies like Apple, Stripe, and now Meta. He specializes in bridging the gap between static Figma designs and production engineering.
                   </p>
                </div>
             )}
          </div>

          <div className="flex flex-col gap-8 xl:sticky xl:top-[120px] xl:h-max">
             <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-xl shadow-black/[0.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8E1F5] rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
                <h3 className="text-[20px] font-bold text-[#1B1B1B] mb-8 relative z-10">This Course Includes</h3>
                <div className="flex flex-col gap-5 relative z-10">
                   <div className="flex items-center gap-4 text-[#1B1B1B]/80 hover:text-[#1B1B1B] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                         <Play size={18} fill="currentColor" />
                      </div>
                      <span className="text-[15px] font-semibold">14.5 hours on-demand video</span>
                   </div>
                   <div className="flex items-center gap-4 text-[#1B1B1B]/80 hover:text-[#1B1B1B] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                         <Globe size={18} />
                      </div>
                      <span className="text-[15px] font-semibold">English, Spanish, and French</span>
                   </div>
                   <div className="flex items-center gap-4 text-[#1B1B1B]/80 hover:text-[#1B1B1B] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                         <FileText size={18} />
                      </div>
                      <span className="text-[15px] font-semibold">15 downloadable UI Kits</span>
                   </div>
                   <div 
                      onClick={() => setShowCertModal(true)}
                      className={`flex items-center justify-between p-3.5 -mx-3.5 rounded-2xl transition-all cursor-pointer border ${
                        progress === 100 
                          ? 'bg-amber-100/70 border-amber-300 text-amber-950 shadow-xs' 
                          : 'hover:bg-black/5 text-[#1B1B1B]/80 hover:text-[#1B1B1B] border-transparent'
                      }`}
                   >
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                           progress === 100 ? 'bg-amber-500 text-white shadow-xs' : 'bg-black/5'
                         }`}>
                            <Award size={18} />
                         </div>
                         <div>
                            <span className="text-[15px] font-bold block">Certificate of completion</span>
                            <span className="text-[12px] opacity-75 block font-medium">
                              {progress === 100 ? 'Verified & Ready to Download' : 'Earn upon 100% course completion'}
                            </span>
                         </div>
                      </div>
                      <span className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        progress === 100 ? 'bg-amber-400 text-amber-950' : 'bg-black/5 text-[#848484]'
                      }`}>
                        {progress === 100 ? 'Claim' : `${progress}%`}
                      </span>
                   </div>
                </div>
                
                <hr className="my-8 border-black/5" />
                
                <button className="w-full py-4 rounded-[20px] border-2 border-black/10 text-[#1B1B1B] text-[16px] font-bold hover:border-[#1B1B1B] transition-colors">
                   Share Course
                </button>
             </div>
          </div>
       </div>

       <CertificateModal
         course={currentCourse}
         isOpen={showCertModal}
         onClose={() => setShowCertModal(false)}
       />

       <CourseSummaryModal
         course={currentCourse}
         modules={modules}
         isOpen={showSummaryModal}
         onClose={() => setShowSummaryModal(false)}
         onOpenFlashcards={() => setActiveTab('Flashcards')}
       />
    </main>
  );
}

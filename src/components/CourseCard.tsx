import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Check, Award } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { ALL_COURSES } from '../constants/courses';
import CertificateModal from './CertificateModal';

interface CourseCardProps {
  key?: React.Key;
  id?: number | string;
  color: string;
  category: string;
  categoryIcon: React.ReactNode;
  rating: string;
  title: string;
  students: string;
  avatars: string[];
  badge?: React.ReactNode;
  progress?: number;
  showProgress?: boolean;
}

export default function CourseCard({ 
  id, 
  color, 
  category, 
  categoryIcon, 
  rating, 
  title, 
  students, 
  avatars, 
  badge,
  progress: propProgress,
  showProgress = true
}: CourseCardProps) {
  const navigate = useNavigate();
  const { isCourseSaved, toggleSaveCourse, getProgress } = useCourses();
  const numericId = typeof id === 'string' ? parseInt(id, 10) || 1 : id || 1;
  const isSaved = isCourseSaved(numericId);
  const currentProgress = propProgress !== undefined ? propProgress : getProgress(numericId);

  const [showCertModal, setShowCertModal] = useState(false);
  const courseData = ALL_COURSES.find(c => c.id === numericId) || {
    id: numericId,
    title,
    topic: category,
    category,
    bgColor: color,
    rating,
  };

  const borderColorMap: Record<string, string> = {
    'bg-card-pink': 'border-[#FACDD1]',
    'bg-card-yellow': 'border-[#FBE6C2]',
    'bg-card-purple': 'border-[#DCDDFF]',
    'bg-card-green': 'border-[#B2F0D1]',
  };
  const borderColor = borderColorMap[color] || 'border-white';

  return (
    <motion.div 
      id={`course-card-${numericId}`}
      onClick={() => navigate(`/course/${numericId}`)}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", bounce: 0.2 }}
      className={`${color} rounded-[32px] p-6 lg:p-[30px] flex flex-col justify-between cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] min-h-[260px] relative overflow-hidden group`}
    >
      <div className="flex justify-between items-start mb-6 align-top">
        <div className="flex items-center gap-[10px] bg-white/60 px-4 py-[7px] rounded-[14px] text-[13px] font-semibold text-[#1B1B1B]">
          <span>{categoryIcon}</span> {category}
        </div>
        <div className="flex flex-col gap-2 items-end">
           <div className="flex items-center gap-2">
             <button
               id={`bookmark-btn-${numericId}`}
               type="button"
               title={isSaved ? "Remove from Saved" : "Save to Watch Later"}
               onClick={(e) => {
                 e.stopPropagation();
                 toggleSaveCourse(numericId);
               }}
               className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                 isSaved
                   ? 'bg-[#1B1B1B] text-white shadow-md'
                   : 'bg-white/80 hover:bg-white text-[#1B1B1B] hover:shadow-sm'
               }`}
             >
               <Bookmark 
                 size={16} 
                 strokeWidth={2.2} 
                 className={isSaved ? 'fill-white text-white' : 'text-[#1B1B1B]'} 
               />
             </button>
             <div className="flex items-center gap-[6px] bg-white px-[12px] py-[6px] rounded-[12px] text-[13px] font-bold shadow-sm text-[#1B1B1B]">
               <span className="text-amber-400 text-[14px] leading-none mb-[2px]">★</span> {rating}
             </div>
           </div>
           {badge && (
             <div className="mt-1">{badge}</div>
           )}
        </div>
      </div>
      
      <div className="mt-auto relative z-10 w-full pt-4">
        <h3 className="text-[23px] md:text-[25px] leading-[1.2] tracking-[0.2px] font-semibold text-[#1B1B1B] mb-5 pr-4">
          {title}
        </h3>

        {/* Visual Progress Bar on Course Card */}
        {showProgress && (
          <div className="mb-5 bg-white/50 backdrop-blur-sm rounded-[18px] p-3 border border-black/5">
            <div className="flex justify-between items-center text-[12px] font-bold text-[#1B1B1B] mb-1.5">
              <span className="opacity-75 flex items-center gap-1.5">
                {currentProgress === 100 ? (
                  <span className="text-[#147B44] flex items-center gap-1 font-bold">
                    <Check size={13} strokeWidth={3} /> Completed
                  </span>
                ) : currentProgress > 0 ? (
                  'In progress'
                ) : (
                  'Not started'
                )}
              </span>
              <span className="font-extrabold">{currentProgress}%</span>
            </div>
            <div className="w-full bg-black/10 h-[6px] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  currentProgress === 100 ? 'bg-[#147B44]' : 'bg-[#1B1B1B]'
                }`}
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            {currentProgress === 100 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCertModal(true);
                }}
                className="mt-2.5 w-full py-1.5 px-3 rounded-full bg-emerald-700/10 hover:bg-emerald-700/20 text-emerald-800 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Award size={13} />
                <span>View & Download Certificate</span>
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between items-end w-full">
          <span className="text-[13px] font-medium text-[#1B1B1B] opacity-[0.65]">{students} students</span>
          <div className="flex -space-x-[12px]">
             {avatars.map((avatar, i) => (
               <img key={i} src={avatar} className={`w-[36px] h-[36px] rounded-full border-[2.5px] ${borderColor} object-cover`} alt="student avatar" />
             ))}
          </div>
        </div>
      </div>

      <CertificateModal
        course={courseData}
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
      />
    </motion.div>
  );
}

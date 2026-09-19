import React, { useEffect } from 'react';
import { Award, Trophy, X, Sparkles, Flame, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { triggerCelebrationConfetti } from '../utils/confetti';
import { useNavigate } from 'react-router-dom';

export default function ConfettiCelebrationOverlay() {
  const { activeCelebration, dismissCelebration } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeCelebration) {
      // Fire festive multi-stage confetti
      triggerCelebrationConfetti();

      // Optional second burst after 1.5 seconds
      const secondaryTimer = setTimeout(() => {
        triggerCelebrationConfetti();
      }, 1400);

      // Auto dismiss after 7 seconds if not dismissed
      const autoDismiss = setTimeout(() => {
        dismissCelebration();
      }, 7000);

      return () => {
        clearTimeout(secondaryTimer);
        clearTimeout(autoDismiss);
      };
    }
  }, [activeCelebration]);

  if (!activeCelebration) return null;

  const isCourseCompletion = activeCelebration.type === 'course_completed';

  const handleAction = () => {
    const courseId = activeCelebration.courseId;
    dismissCelebration();
    if (isCourseCompletion && courseId) {
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      {/* Celebration Card */}
      <div 
        className="bg-white w-full max-w-lg rounded-[36px] overflow-hidden shadow-2xl border border-white/20 relative text-center flex flex-col p-8 sm:p-10 transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isCourseCompletion ? 'bg-amber-400/30' : 'bg-emerald-400/30'
        }`}></div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={dismissCelebration}
          aria-label="Close celebration"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 text-[#1B1B1B] flex items-center justify-center transition-colors z-20 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Center Animated Icon */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-5">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform ${
              isCourseCompletion 
                ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-amber-950 ring-8 ring-amber-100' 
                : 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white ring-8 ring-emerald-100'
            }`}>
              {isCourseCompletion ? (
                <Trophy size={40} className="animate-bounce" />
              ) : (
                <Flame size={40} className="animate-bounce" />
              )}
            </div>
            
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#1B1B1B] text-white flex items-center justify-center shadow-md">
              <Sparkles size={14} className="text-amber-400" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wider mb-3 shadow-2xs bg-[#FAF9F6] border border-black/5 text-[#1B1B1B]">
            {isCourseCompletion ? (
              <>
                <Award size={14} className="text-amber-600" />
                <span>{activeCelebration.badgeText || '100% Course Completed'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>{activeCelebration.badgeText || 'Weekly Goal Hit!'}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 id="celebration-title" className="text-[28px] sm:text-[32px] font-extrabold text-[#1B1B1B] tracking-tight leading-tight mb-2">
            {activeCelebration.title}
          </h2>

          {/* Description */}
          <p className="text-[14px] sm:text-[15px] text-[#636363] leading-relaxed max-w-sm mb-6">
            {activeCelebration.description}
          </p>

          {/* Stat Pill if available */}
          {activeCelebration.statValue && (
            <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl px-4 py-2.5 mb-6 flex items-center justify-center gap-3 w-full">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#848484]">Achievement</span>
              <span className="text-[15px] font-extrabold text-[#1B1B1B]">{activeCelebration.statValue}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              type="button"
              onClick={handleAction}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-full bg-[#1B1B1B] hover:bg-black text-white text-[14px] font-bold transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isCourseCompletion ? 'View Certificate' : 'Keep Learning'}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => triggerCelebrationConfetti()}
              className="w-full sm:w-auto py-3.5 px-4 rounded-full bg-[#FAF9F6] hover:bg-black/5 border border-black/10 text-[#1B1B1B] text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="More confetti"
            >
              <RotateCw size={14} />
              <span>More Confetti</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

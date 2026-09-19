import React from 'react';
import { Play, BookOpen, Dumbbell, CheckCircle2, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { RecentLesson } from '../types';
import { calculateLessonTime } from '../utils/lessonTime';

export default function ContinueWatching() {
  const { recentLessons, recordLessonAccess, updateProgress, getProgress } = useCourses();
  const navigate = useNavigate();

  if (!recentLessons || recentLessons.length === 0) {
    return null;
  }

  // Active or top recent lesson
  const activeLesson: RecentLesson = recentLessons[0];
  const secondaryLessons = recentLessons.slice(1, 3);
  const courseOverallProgress = getProgress(activeLesson.courseId);

  const timeEstimate = calculateLessonTime({
    type: activeLesson.lessonType,
    time: activeLesson.totalDuration,
  });

  const handleResume = () => {
    // Record refreshed access timestamp
    recordLessonAccess({
      courseId: activeLesson.courseId,
      lessonId: activeLesson.lessonId,
      currentTime: activeLesson.currentTime,
      progressPercent: activeLesson.progressPercent,
    });
    navigate(`/course/${activeLesson.courseId}/lesson/${activeLesson.lessonId}`);
  };

  const handleMarkComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Bump progress
    const newCourseProg = Math.min(100, courseOverallProgress + 15);
    updateProgress(activeLesson.courseId, newCourseProg);

    recordLessonAccess({
      courseId: activeLesson.courseId,
      lessonId: activeLesson.lessonId,
      progressPercent: 100,
      currentTime: activeLesson.totalDuration,
    });
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1B1B1B] text-white flex items-center justify-center shadow-sm">
            <Play size={14} fill="currentColor" className="ml-0.5" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold tracking-tight text-[#1B1B1B]">Continue Watching</h2>
            <p className="text-[13px] font-medium text-[#848484]">Pick up right where you left off in your active courses</p>
          </div>
        </div>

        {secondaryLessons.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold text-[#848484]">
            <span>{recentLessons.length} in progress</span>
          </div>
        )}
      </div>

      {/* Featured Primary Resume Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-black/5 hover:border-black/10 transition-all">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 xl:gap-8 justify-between">
          
          {/* Left / Main info */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full text-[12px] font-extrabold tracking-wide uppercase bg-black/5 text-[#1B1B1B]">
                {activeLesson.courseCategory}
              </span>
              <span className="text-[13px] font-bold text-[#848484]">
                {activeLesson.moduleTitle}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#848484]/40"></span>
              <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Clock size={12} /> {timeEstimate.displayEstimate}
              </span>
            </div>

            <div>
              <Link 
                to={`/course/${activeLesson.courseId}/lesson/${activeLesson.lessonId}`}
                className="group"
              >
                <h3 className="text-[24px] sm:text-[28px] font-bold text-[#1B1B1B] leading-snug group-hover:text-black/80 transition-colors">
                  {activeLesson.lessonTitle}
                </h3>
              </Link>
              <p className="text-[14px] font-medium text-[#848484] mt-1 flex items-center gap-2">
                Course: <span className="font-bold text-[#1B1B1B]">{activeLesson.courseTitle}</span>
              </p>
            </div>

            {/* Playback progress bar */}
            <div className="max-w-md pt-1">
              <div className="flex items-center justify-between text-[12px] font-bold text-[#1B1B1B] mb-1.5">
                <span className="text-[#848484]">
                  {activeLesson.currentTime} / {activeLesson.totalDuration}
                </span>
                <span className="font-extrabold">{activeLesson.progressPercent}% watched</span>
              </div>
              <div className="w-full bg-black/5 h-[7px] rounded-full overflow-hidden">
                <div 
                  className="bg-[#1B1B1B] h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeLesson.progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleResume}
              className="px-6 py-3.5 rounded-full bg-[#1B1B1B] hover:bg-black text-white text-[14px] font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all"
            >
              <Play size={16} fill="currentColor" />
              <span>Resume Lesson</span>
            </button>

            <button
              onClick={handleMarkComplete}
              title="Mark this lesson as completed"
              className="px-5 py-3.5 rounded-full border border-black/10 bg-white hover:bg-black/[0.03] text-[13px] font-bold text-[#1B1B1B] flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 size={16} className="text-green-600" />
              <span>Mark Complete</span>
            </button>

            <Link
              to={`/course/${activeLesson.courseId}`}
              className="px-4 py-3.5 rounded-full text-[13px] font-bold text-[#848484] hover:text-[#1B1B1B] flex items-center justify-center gap-1 transition-colors"
            >
              <span>Curriculum</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>

        {/* Secondary Recent Lessons Switcher if available */}
        {secondaryLessons.length > 0 && (
          <div className="mt-6 pt-5 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[12px] font-bold text-[#848484] uppercase tracking-wider">
              Other Recent In-Progress Courses:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {secondaryLessons.map((item) => (
                <button
                  key={`${item.courseId}-${item.lessonId}`}
                  onClick={() => {
                    recordLessonAccess({
                      courseId: item.courseId,
                      lessonId: item.lessonId,
                      currentTime: item.currentTime,
                      progressPercent: item.progressPercent,
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.08] text-[12px] font-bold text-[#1B1B1B] flex items-center gap-2 transition-colors"
                >
                  <span className="truncate max-w-[140px] sm:max-w-[200px]">{item.courseTitle}: {item.lessonTitle}</span>
                  <span className="text-[#848484]">({item.progressPercent}%)</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

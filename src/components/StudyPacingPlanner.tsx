import React, { useState } from 'react';
import { Calendar, Clock, Compass, Target, CheckCircle2, Flame } from 'lucide-react';
import { Module } from '../types';
import { calculateLessonTime } from '../utils/lessonTime';

interface StudyPacingPlannerProps {
  modules: Module[];
  courseTitle: string;
}

export default function StudyPacingPlanner({ modules }: StudyPacingPlannerProps) {
  const [dailyMinutes, setDailyMinutes] = useState<number>(30);

  // Calculate total study time using calculateLessonTime
  const allLessons = modules.flatMap(m => m.lessons);
  const totalEstimatedMinutes = allLessons.reduce((acc, lesson) => {
    const est = calculateLessonTime(lesson);
    return acc + est.estimatedMinutes;
  }, 0);

  const totalReadingCount = allLessons.filter(l => l.type === 'reading').length;
  const totalVideoCount = allLessons.filter(l => l.type === 'video').length;
  const totalExerciseCount = allLessons.filter(l => l.type === 'exercise').length;

  const totalHours = Math.floor(totalEstimatedMinutes / 60);
  const remainingMins = totalEstimatedMinutes % 60;

  const daysNeeded = Math.ceil(totalEstimatedMinutes / dailyMinutes);
  
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysNeeded);
  const formattedTargetDate = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const pacingOptions = [
    { mins: 15, label: 'Casual', desc: '15 min/day', badge: 'Relaxed' },
    { mins: 30, label: 'Standard', desc: '30 min/day', badge: 'Recommended' },
    { mins: 45, label: 'Intense', desc: '45 min/day', badge: 'Fast Track' },
    { mins: 60, label: 'Sprint', desc: '60 min/day', badge: 'Bootcamp' },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-[#FDFBFE] border border-black/5 rounded-[28px] p-6 lg:p-7 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-black/5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 font-bold">
            <Compass size={22} className="text-amber-700" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#1B1B1B] flex items-center gap-2">
              Study Schedule & Pacing Calculator
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Estimates
              </span>
            </h3>
            <p className="text-[13px] font-medium text-[#848484]">
              Accurate completion estimates tailored to your daily learning routine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#F8F8F9] px-4 py-2.5 rounded-2xl border border-black/5 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#848484] block">Total Study Time</span>
            <span className="text-[16px] font-extrabold text-[#1B1B1B]">
              {totalHours > 0 ? `${totalHours}h ` : ''}{remainingMins}m
            </span>
          </div>
          <div className="h-7 w-[1px] bg-black/10"></div>
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#848484] block">Curriculum</span>
            <span className="text-[16px] font-extrabold text-[#1B1B1B]">
              {allLessons.length} lessons
            </span>
          </div>
        </div>
      </div>

      {/* Content Breakdown Pills */}
      <div className="grid grid-cols-3 gap-3 my-5">
        <div className="bg-indigo-50/60 border border-indigo-100/80 rounded-2xl p-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">Video Content</span>
          <span className="text-[15px] font-extrabold text-indigo-950">{totalVideoCount} videos</span>
          <span className="text-[11px] text-indigo-600 block mt-0.5">With review buffer</span>
        </div>
        <div className="bg-sky-50/60 border border-sky-100/80 rounded-2xl p-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">Deep Readings</span>
          <span className="text-[15px] font-extrabold text-sky-950">{totalReadingCount} articles</span>
          <span className="text-[11px] text-sky-600 block mt-0.5">@ 220 words/min</span>
        </div>
        <div className="bg-amber-50/60 border border-amber-100/80 rounded-2xl p-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Hands-on Tasks</span>
          <span className="text-[15px] font-extrabold text-amber-950">{totalExerciseCount} exercises</span>
          <span className="text-[11px] text-amber-600 block mt-0.5">Practical drills</span>
        </div>
      </div>

      {/* Pacing Selector */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[13px] font-bold text-[#1B1B1B] flex items-center gap-1.5">
            <Target size={15} className="text-[#1B1B1B]" /> Select Your Daily Commitment:
          </label>
          <span className="text-[12px] font-semibold text-[#848484]">
            Finish by <strong className="text-[#1B1B1B]">{formattedTargetDate}</strong> ({daysNeeded} days)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {pacingOptions.map((opt) => {
            const isSelected = dailyMinutes === opt.mins;
            return (
              <button
                key={opt.mins}
                type="button"
                onClick={() => setDailyMinutes(opt.mins)}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-[#1B1B1B] text-white border-[#1B1B1B] shadow-md'
                    : 'bg-white hover:bg-[#F9F9F9] text-[#1B1B1B] border-black/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#848484]'
                  }`}>
                    {opt.badge}
                  </span>
                  {isSelected && <CheckCircle2 size={14} className="text-emerald-400" />}
                </div>
                <div className="text-[15px] font-extrabold mt-1">{opt.desc}</div>
                <div className={`text-[11px] font-medium ${isSelected ? 'text-white/70' : 'text-[#848484]'}`}>
                  {Math.ceil(totalEstimatedMinutes / opt.mins)} days total
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

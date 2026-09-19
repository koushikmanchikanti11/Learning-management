import React, { useState } from 'react';
import { Target, Flame, Check, Plus, Edit2, Sparkles, TrendingUp, Calendar, RotateCcw, PartyPopper } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { GoalFrequency } from '../types';

export default function StudyGoalTracker() {
  const { 
    studyGoal, 
    setGoalFrequency, 
    setDailyTarget, 
    setWeeklyTarget, 
    logStudyMinutes, 
    resetStudyProgress,
    triggerCelebration,
  } = useCourses();

  const [isEditing, setIsEditing] = useState(false);
  const [customDaily, setCustomDaily] = useState(studyGoal.dailyTargetMinutes);
  const [customWeekly, setCustomWeekly] = useState(studyGoal.weeklyTargetMinutes);
  const [showCelebration, setShowCelebration] = useState(false);

  const isDaily = studyGoal.frequency === 'daily';
  
  // Progress calculations
  const targetMinutes = isDaily ? studyGoal.dailyTargetMinutes : studyGoal.weeklyTargetMinutes;
  const currentMinutes = isDaily ? studyGoal.todayMinutes : studyGoal.thisWeekMinutes;
  const progressPercent = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));
  const isCompleted = currentMinutes >= targetMinutes;
  const remainingMinutes = Math.max(0, targetMinutes - currentMinutes);

  const handleQuickLog = (mins: number) => {
    logStudyMinutes(mins);
    if (currentMinutes + mins >= targetMinutes) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDaily) {
      setDailyTarget(Math.max(5, customDaily));
    } else {
      setWeeklyTarget(Math.max(15, customWeekly));
    }
    setIsEditing(false);
  };

  const dailyPresets = [15, 30, 45, 60];
  const weeklyPresets = [150, 300, 450, 600]; // 2.5h, 5h, 7.5h, 10h

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-7 border border-black/5 shadow-sm mb-10 relative overflow-hidden">
      {/* Background soft glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1B1B1B] text-white flex items-center justify-center shadow-xs">
            <Target size={20} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[19px] font-bold text-[#1B1B1B] tracking-tight">Study Goals & Tracker</h3>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <Flame size={12} className="fill-amber-500 text-amber-500" />
                {studyGoal.currentStreak} Day Streak
              </span>
            </div>
            <p className="text-[13px] text-[#848484]">
              {isDaily 
                ? 'Target daily habit for consistent mastery' 
                : 'Paced weekly commitment across all subjects'}
            </p>
          </div>
        </div>

        {/* Goal Frequency Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-full bg-black/5 border border-black/5">
            <button
              type="button"
              onClick={() => setGoalFrequency('daily')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                isDaily 
                  ? 'bg-white text-[#1B1B1B] shadow-xs' 
                  : 'text-[#848484] hover:text-[#1B1B1B]'
              }`}
            >
              Daily Goal
            </button>
            <button
              type="button"
              onClick={() => setGoalFrequency('weekly')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                !isDaily 
                  ? 'bg-white text-[#1B1B1B] shadow-xs' 
                  : 'text-[#848484] hover:text-[#1B1B1B]'
              }`}
            >
              Weekly Goal
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-full hover:bg-black/5 text-[#1B1B1B] transition-colors border border-black/5"
            title="Adjust goal target"
          >
            <Edit2 size={14} />
          </button>
        </div>
      </div>

      {/* Inline Goal Customization Panel */}
      {isEditing && (
        <form onSubmit={handleSaveGoal} className="mb-6 p-4 rounded-[22px] bg-[#FAF9F6] border border-black/5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-[13px] font-bold text-[#1B1B1B]">
              Set {isDaily ? 'Daily Target (minutes)' : 'Weekly Target (hours)'}:
            </span>
            <div className="flex items-center gap-2">
              {(isDaily ? dailyPresets : weeklyPresets).map((preset) => {
                const label = isDaily ? `${preset}m` : `${preset / 60}h`;
                const active = (isDaily ? customDaily : customWeekly) === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => isDaily ? setCustomDaily(preset) : setCustomWeekly(preset)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      active ? 'bg-[#1B1B1B] text-white' : 'bg-white text-[#1B1B1B] border border-black/10'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-black/10 rounded-xl px-3 py-1.5 flex-1 max-w-[180px]">
              <input
                type="number"
                min={5}
                max={1200}
                value={isDaily ? customDaily : Math.round(customWeekly / 6) / 10}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (isDaily) setCustomDaily(val);
                  else setCustomWeekly(Math.round(val * 60));
                }}
                className="w-full text-[14px] font-bold text-[#1B1B1B] outline-none"
              />
              <span className="text-[12px] text-[#848484] font-medium">{isDaily ? 'mins' : 'hrs'}</span>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1B1B1B] text-white text-[12px] font-bold hover:bg-black transition-colors"
            >
              Save Target
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 text-[12px] font-bold text-[#848484] hover:text-[#1B1B1B]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Progress Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
        {/* Progress Bar & Status */}
        <div className="md:col-span-8 flex flex-col gap-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#848484] block mb-0.5">
                {isDaily ? "Today's Study Progress" : "This Week's Progress"}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-extrabold tracking-tight text-[#1B1B1B] leading-none">
                  {isDaily 
                    ? `${currentMinutes} mins` 
                    : `${(currentMinutes / 60).toFixed(1)} hrs`}
                </span>
                <span className="text-[14px] font-bold text-[#848484]">
                  / {isDaily ? `${targetMinutes} mins` : `${(targetMinutes / 60).toFixed(1)} hrs`}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[13px] font-extrabold px-3 py-1 rounded-full ${
                isCompleted 
                  ? 'bg-[#E8F8F0] text-[#147B44]' 
                  : 'bg-black/5 text-[#1B1B1B]'
              }`}>
                {progressPercent}% Achieved
              </span>
            </div>
          </div>

          {/* Styled Dynamic Progress Bar */}
          <div className="w-full bg-black/5 h-[12px] rounded-full overflow-hidden p-0.5 border border-black/5">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isCompleted 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                  : 'bg-gradient-to-r from-amber-400 to-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Motivational Pacing Message */}
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#848484] flex items-center gap-1.5 font-medium">
              {isCompleted ? (
                <span className="text-[#147B44] font-bold flex items-center gap-1">
                  <Check size={14} strokeWidth={3} /> Goal achieved! Keep the momentum going.
                </span>
              ) : (
                <>
                  <TrendingUp size={13} className="text-amber-600" />
                  <span>
                    {isDaily 
                      ? `${remainingMinutes} mins remaining to reach today's target` 
                      : `${(remainingMinutes / 60).toFixed(1)} hrs left to complete weekly target`}
                  </span>
                </>
              )}
            </span>
            <span className="text-[#848484] text-[11px]">
              Streak Best: {studyGoal.bestStreak} days
            </span>
          </div>
        </div>

        {/* Action Controls to Log Independent Study */}
        <div className="md:col-span-4 bg-[#FAF9F6] p-4 rounded-[24px] border border-black/5 flex flex-col justify-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#848484] flex items-center justify-between">
            <span>Log Study Time</span>
            <button 
              type="button"
              onClick={resetStudyProgress}
              className="text-[10px] text-[#848484] hover:text-[#1B1B1B] underline flex items-center gap-0.5"
              title="Reset progress"
            >
              <RotateCcw size={10} /> Reset
            </button>
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLog(15)}
              className="py-2 px-3 rounded-xl bg-white border border-black/10 text-[#1B1B1B] text-[12px] font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-1 shadow-2xs active:scale-95"
            >
              <Plus size={13} /> 15 min
            </button>
            <button
              type="button"
              onClick={() => handleQuickLog(30)}
              className="py-2 px-3 rounded-xl bg-white border border-black/10 text-[#1B1B1B] text-[12px] font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-1 shadow-2xs active:scale-95"
            >
              <Plus size={13} /> 30 min
            </button>
          </div>

          {isCompleted ? (
            <button
              type="button"
              onClick={() => {
                triggerCelebration({
                  id: `goal_manual_${Date.now()}`,
                  type: 'weekly_goal',
                  title: isDaily ? 'Daily Goal Achieved!' : 'Weekly Learning Goal Hit!',
                  description: isDaily 
                    ? `Great job! You reached your ${studyGoal.dailyTargetMinutes}-minute daily goal. Current streak: ${studyGoal.currentStreak} days.`
                    : `Outstanding commitment! You logged ${(studyGoal.thisWeekMinutes / 60).toFixed(1)} hours this week, hitting your weekly target of ${(studyGoal.weeklyTargetMinutes / 60).toFixed(1)} hours.`,
                  badgeText: isDaily ? 'Daily Target Hit! ⚡' : 'Weekly Target Hit! 🏆',
                  statValue: isDaily 
                    ? `${studyGoal.todayMinutes}m / ${studyGoal.dailyTargetMinutes}m Goal` 
                    : `${(studyGoal.thisWeekMinutes / 60).toFixed(1)}h / ${(studyGoal.weeklyTargetMinutes / 60).toFixed(1)}h Goal`,
                });
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PartyPopper size={13} />
              <span>Goal Reached! (Celebrate 🎉)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleQuickLog(remainingMinutes)}
              className="w-full py-1.5 px-3 rounded-xl bg-[#1B1B1B] text-white text-[11px] font-bold hover:bg-black transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Check size={12} strokeWidth={3} /> Mark Target Done
            </button>
          )}
        </div>
      </div>

      {/* Celebration Notification */}
      {showCelebration && (
        <div className="mb-4 p-3 rounded-[18px] bg-emerald-50 border border-emerald-200 text-emerald-900 text-[13px] font-bold flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-emerald-600 shrink-0" />
          <span>Awesome job! You reached your study goal for today. Your streak increased to {studyGoal.currentStreak} days!</span>
        </div>
      )}

      {/* Weekly Habit Matrix (Mon - Sun) */}
      <div className="pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[12px] font-bold text-[#1B1B1B]">
          <Calendar size={14} className="text-[#848484]" />
          <span>Weekly Habit Matrix:</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {studyGoal.weekDays.map((d, index) => {
            const isToday = index === 4; // Friday is current day
            return (
              <div key={d.day} className="flex flex-col items-center gap-1">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all ${
                    d.completed 
                      ? 'bg-[#147B44] text-white shadow-xs' 
                      : isToday 
                        ? 'border-2 border-amber-500 text-[#1B1B1B] bg-amber-50'
                        : 'bg-black/5 text-[#848484]'
                  }`}
                  title={`${d.day}: ${d.minutes}m logged`}
                >
                  {d.completed ? <Check size={13} strokeWidth={3} /> : d.day.slice(0, 1)}
                </div>
                <span className={`text-[10px] font-bold ${isToday ? 'text-amber-900' : 'text-[#848484]'}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

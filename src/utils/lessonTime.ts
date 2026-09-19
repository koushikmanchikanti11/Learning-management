export interface LessonTimeEstimate {
  type: 'video' | 'reading' | 'exercise';
  rawTime: string;
  durationMinutes: number;
  estimatedMinutes: number;
  displayEstimate: string;
  formattedEstimate: string;
  breakdown: string;
  readingSpeedWpm?: number;
  wordCount?: number;
  explanation: string;
}

/**
 * Parses time strings like "10:00", "05:30", "1h 15m", "45 min" into minutes.
 */
export function parseDurationToMinutes(timeStr: string): number {
  if (!timeStr) return 10;

  // Case "1h 30m" or "2h"
  if (timeStr.includes('h')) {
    const hoursMatch = timeStr.match(/(\d+)\s*h/);
    const minsMatch = timeStr.match(/(\d+)\s*m/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    return hours * 60 + mins;
  }

  // Case "MM:SS" (e.g., "12:45" or "10:00")
  if (timeStr.includes(':')) {
    const parts = timeStr.split(':');
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return Math.max(1, Math.round(mins + secs / 60));
  }

  // Case "25m" or "25 min"
  const digits = parseInt(timeStr.replace(/\D/g, ''), 10);
  return Number.isNaN(digits) ? 10 : digits;
}

/**
 * Calculates accurate reading or completion time for study management.
 * Standard adult reading speed: 200 - 250 WPM (we use 220 WPM average).
 * For readings: estimated completion includes reading + conceptual absorption.
 * For videos: estimated completion includes playback + pause/notetaking (1.2x factor).
 * For exercises: estimated completion includes hands-on challenge completion.
 */
export function calculateLessonTime(lesson: {
  type: 'video' | 'reading' | 'exercise';
  time?: string;
  wordCount?: number;
}): LessonTimeEstimate {
  const rawTime = lesson.time || '10:00';
  const baseMinutes = parseDurationToMinutes(rawTime);

  if (lesson.type === 'reading') {
    // If word count is given, calculate at 220 words per minute + 1 min comprehension margin
    const wordCount = lesson.wordCount || Math.max(600, baseMinutes * 180);
    const wpm = 220;
    const readingMins = Math.max(2, Math.ceil(wordCount / wpm));

    return {
      type: 'reading',
      rawTime,
      durationMinutes: readingMins,
      estimatedMinutes: readingMins,
      displayEstimate: `~${readingMins} min read`,
      formattedEstimate: `~${readingMins}m read`,
      breakdown: `~${wordCount.toLocaleString()} words @ ${wpm} wpm`,
      readingSpeedWpm: wpm,
      wordCount,
      explanation: `Calculated for ~${wordCount.toLocaleString()} words at standard pace (${wpm} wpm) with reflection.`,
    };
  }

  if (lesson.type === 'video') {
    // Video completion: video duration + 20% allowance for pausing/taking notes
    const reviewAllowance = Math.max(1, Math.round(baseMinutes * 0.2));
    const totalEst = baseMinutes + reviewAllowance;

    return {
      type: 'video',
      rawTime,
      durationMinutes: baseMinutes,
      estimatedMinutes: totalEst,
      displayEstimate: `Est. ${totalEst} min (${baseMinutes}m watch + ${reviewAllowance}m notes)`,
      formattedEstimate: `~${totalEst}m total`,
      breakdown: `${baseMinutes}m watch + ${reviewAllowance}m notes`,
      explanation: `${baseMinutes}m on-demand lecture with ~${reviewAllowance}m buffer for code along and notes.`,
    };
  }

  // Interactive Exercise or Challenge
  const estMins = Math.max(baseMinutes, 15);
  return {
    type: 'exercise',
    rawTime,
    durationMinutes: baseMinutes,
    estimatedMinutes: estMins,
    displayEstimate: `Est. ${estMins} min hands-on`,
    formattedEstimate: `~${estMins}m hands-on`,
    breakdown: `Practice exercise & self-assessment`,
    explanation: `Interactive hands-on practical assignment and self-assessment test.`,
  };
}

/**
 * Calculates study plan timeline based on daily commitment
 */
export function calculateStudyPlan(totalMinutes: number, dailyMinutes: number): {
  daysNeeded: number;
  weeksNeeded: string;
  completionDate: string;
} {
  const days = Math.max(1, Math.ceil(totalMinutes / dailyMinutes));
  const weeks = (days / 7).toFixed(1);

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);

  const formattedDate = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    daysNeeded: days,
    weeksNeeded: weeks,
    completionDate: formattedDate,
  };
}

import React from 'react';

export interface Course {
  id: number;
  title: string;
  topic: string;
  category: string;
  tags?: string[];
  categoryIcon?: React.ReactNode;
  progress?: number;
  bgColor: string;
  icon?: React.ReactNode;
  rating: string | number;
  instructor?: string;
  description?: string;
  students?: string;
  avatars?: string[];
  badge?: React.ReactNode;
}

export interface Lesson {
  id: number;
  title: string;
  time: string;
  type: 'video' | 'reading' | 'exercise';
  isFree?: boolean;
  wordCount?: number;
  description?: string;
}

export interface Module {
  id: number;
  title: string;
  time: string;
  lessons: Lesson[];
}

export interface RecentLesson {
  courseId: number;
  courseTitle: string;
  courseCategory: string;
  courseBgColor: string;
  lessonId: number;
  lessonTitle: string;
  lessonType: 'video' | 'reading' | 'exercise';
  moduleTitle: string;
  progressPercent: number;
  currentTime: string;
  totalDuration: string;
  lastAccessedAt: number;
  thumbnailUrl?: string;
}

export type GoalFrequency = 'daily' | 'weekly';

export interface DayActivity {
  day: string; // 'Mon', 'Tue', etc.
  date: string;
  minutes: number;
  completed: boolean;
}

export interface StudyGoal {
  frequency: GoalFrequency;
  dailyTargetMinutes: number; // e.g. 45
  weeklyTargetMinutes: number; // e.g. 300 (5 hours)
  todayMinutes: number; // e.g. 35
  thisWeekMinutes: number; // e.g. 210
  currentStreak: number; // e.g. 5
  bestStreak: number;
  weekDays: DayActivity[];
}

export interface LearningSummaryData {
  studentName: string;
  generatedDate: string;
  totalHoursLearned: number;
  completedCourses: {
    id: number;
    title: string;
    category: string;
    instructor?: string;
    hours: number;
    rating: string | number;
    completedAt?: string;
    credentialId?: string;
  }[];
  inProgressCourses: {
    id: number;
    title: string;
    category: string;
    progress: number;
    hoursLogged: number;
    totalHours: number;
  }[];
  currentDailyGoal: number; // mins
  currentWeeklyGoal: number; // mins
  currentStreak: number;
}

export interface CelebrationEvent {
  id: string;
  type: 'course_completed' | 'weekly_goal';
  title: string;
  description: string;
  badgeText: string;
  courseId?: number;
  courseTitle?: string;
  statValue?: string;
}


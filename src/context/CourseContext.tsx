import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, RecentLesson, StudyGoal, GoalFrequency, LearningSummaryData, CelebrationEvent } from '../types';
import { ALL_COURSES } from '../constants/courses';

const COURSE_DURATIONS: Record<number, number> = {
  1: 14.5,
  2: 6.0,
  3: 8.5,
  4: 10.0,
  5: 7.5,
  6: 12.0,
  7: 5.5,
  8: 16.0,
  9: 8.0,
};

const DEFAULT_STUDY_GOAL: StudyGoal = {
  frequency: 'daily',
  dailyTargetMinutes: 45,
  weeklyTargetMinutes: 300, // 5 hours
  todayMinutes: 35,
  thisWeekMinutes: 210, // 3.5 hours
  currentStreak: 5,
  bestStreak: 12,
  weekDays: [
    { day: 'Mon', date: 'Mon', minutes: 45, completed: true },
    { day: 'Tue', date: 'Tue', minutes: 50, completed: true },
    { day: 'Wed', date: 'Wed', minutes: 40, completed: true },
    { day: 'Thu', date: 'Thu', minutes: 45, completed: true },
    { day: 'Fri', date: 'Fri', minutes: 35, completed: false },
    { day: 'Sat', date: 'Sat', minutes: 0, completed: false },
    { day: 'Sun', date: 'Sun', minutes: 0, completed: false },
  ],
};

const DEFAULT_RECENT_LESSONS: RecentLesson[] = [
  {
    courseId: 1,
    courseTitle: "Flutter Masterclass",
    courseCategory: "IT & Software",
    courseBgColor: "bg-card-pink",
    lessonId: 2,
    lessonTitle: "The Core Principles of Motion",
    lessonType: "video",
    moduleTitle: "Module 1: Introduction to Interaction Design",
    progressPercent: 45,
    currentTime: "11:15",
    totalDuration: "25:00",
    lastAccessedAt: Date.now() - 1000 * 60 * 35, // 35 mins ago
    thumbnailUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1200&q=80"
  },
  {
    courseId: 2,
    courseTitle: "Powerful Business Writing",
    courseCategory: "Business",
    courseBgColor: "bg-card-yellow",
    lessonId: 4,
    lessonTitle: "Executive Summary & Concise Memos",
    lessonType: "reading",
    moduleTitle: "Module 2: High-Impact Writing",
    progressPercent: 85,
    currentTime: "08:20",
    totalDuration: "12:00",
    lastAccessedAt: Date.now() - 1000 * 60 * 180, // 3 hours ago
    thumbnailUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    courseId: 6,
    courseTitle: "Zero to Hero with React & Next.js",
    courseCategory: "IT & Software",
    courseBgColor: "bg-[#E7E2DF]",
    lessonId: 5,
    lessonTitle: "Server Components & Suspense Architecture",
    lessonType: "video",
    moduleTitle: "Module 3: Advanced React 19",
    progressPercent: 30,
    currentTime: "05:40",
    totalDuration: "18:00",
    lastAccessedAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80"
  }
];

interface CourseContextType {
  savedCourseIds: number[];
  savedCourses: Course[];
  toggleSaveCourse: (id: number) => void;
  isCourseSaved: (id: number) => boolean;
  courseProgress: Record<number, number>;
  updateProgress: (id: number, progress: number) => void;
  getProgress: (id: number) => number;
  recentLessons: RecentLesson[];
  recordLessonAccess: (access: Partial<RecentLesson> & { courseId: number; lessonId: number }) => void;
  getMostRecentLesson: () => RecentLesson | null;
  studentName: string;
  setStudentName: (name: string) => void;
  markCourseCompleted: (id: number) => void;
  studyGoal: StudyGoal;
  setGoalFrequency: (frequency: GoalFrequency) => void;
  setDailyTarget: (minutes: number) => void;
  setWeeklyTarget: (minutes: number) => void;
  logStudyMinutes: (minutes: number) => void;
  resetStudyProgress: () => void;
  getLearningSummaryData: () => LearningSummaryData;
  activeCelebration: CelebrationEvent | null;
  triggerCelebration: (event: CelebrationEvent) => void;
  dismissCelebration: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('lms_student_name') || 'Annette Black';
  });

  // Initialize saved courses from localStorage or default to [1, 3] (Flutter and UI/UX)
  const [savedCourseIds, setSavedCourseIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('lms_saved_courses');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [1, 3];
  });

  // Initialize course progress from ALL_COURSES and localStorage
  const [courseProgress, setCourseProgress] = useState<Record<number, number>>(() => {
    const initialMap: Record<number, number> = {};
    ALL_COURSES.forEach((c) => {
      initialMap[c.id] = c.progress ?? 0;
    });

    try {
      const stored = localStorage.getItem('lms_course_progress');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...initialMap, ...parsed };
      }
    } catch {
      // ignore
    }
    return initialMap;
  });

  // Initialize recent lessons from localStorage or defaults
  const [recentLessons, setRecentLessons] = useState<RecentLesson[]>(() => {
    try {
      const stored = localStorage.getItem('lms_recent_lessons');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_RECENT_LESSONS;
  });

  // Initialize study goal from localStorage or defaults
  const [studyGoal, setStudyGoal] = useState<StudyGoal>(() => {
    try {
      const stored = localStorage.getItem('lms_study_goal');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEFAULT_STUDY_GOAL;
  });

  // Active Confetti & Celebration Overlay State
  const [activeCelebration, setActiveCelebration] = useState<CelebrationEvent | null>(null);

  const triggerCelebration = (event: CelebrationEvent) => {
    setActiveCelebration(event);
  };

  const dismissCelebration = () => {
    setActiveCelebration(null);
  };

  // Sync student name
  useEffect(() => {
    localStorage.setItem('lms_student_name', studentName);
  }, [studentName]);

  // Sync saved courses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lms_saved_courses', JSON.stringify(savedCourseIds));
    } catch {
      // ignore
    }
  }, [savedCourseIds]);

  // Sync course progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lms_course_progress', JSON.stringify(courseProgress));
    } catch {
      // ignore
    }
  }, [courseProgress]);

  // Sync recent lessons to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lms_recent_lessons', JSON.stringify(recentLessons));
    } catch {
      // ignore
    }
  }, [recentLessons]);

  // Sync study goal to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lms_study_goal', JSON.stringify(studyGoal));
    } catch {
      // ignore
    }
  }, [studyGoal]);

  const toggleSaveCourse = (id: number) => {
    setSavedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isCourseSaved = (id: number) => {
    return savedCourseIds.includes(id);
  };

  const updateProgress = (id: number, progress: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    setCourseProgress((prev) => {
      const current = prev[id] ?? (ALL_COURSES.find((c) => c.id === id)?.progress ?? 0);
      if (clamped === 100 && current < 100) {
        const course = ALL_COURSES.find((c) => c.id === id);
        triggerCelebration({
          id: `course_complete_${id}_${Date.now()}`,
          type: 'course_completed',
          title: 'Course Completed! 100% Mastered',
          description: `Congratulations! You've successfully finished all lessons in "${course?.title || 'the course'}". Your verified certificate is ready to claim.`,
          badgeText: '100% Course Completed',
          courseId: id,
          courseTitle: course?.title,
          statValue: '100% Mastered • Accredited Credential',
        });
      }
      return { ...prev, [id]: clamped };
    });
  };

  const markCourseCompleted = (id: number) => {
    updateProgress(id, 100);
  };

  const getProgress = (id: number) => {
    if (courseProgress[id] !== undefined) {
      return courseProgress[id];
    }
    const found = ALL_COURSES.find((c) => c.id === id);
    return found?.progress ?? 0;
  };

  const recordLessonAccess = (access: Partial<RecentLesson> & { courseId: number; lessonId: number }) => {
    const course = ALL_COURSES.find((c) => c.id === access.courseId);
    
    setRecentLessons((prev) => {
      const existing = prev.find(
        (item) => item.courseId === access.courseId && item.lessonId === access.lessonId
      );

      const updatedItem: RecentLesson = {
        courseId: access.courseId,
        courseTitle: access.courseTitle || course?.title || 'Masterclass',
        courseCategory: access.courseCategory || course?.category || 'Development',
        courseBgColor: access.courseBgColor || course?.bgColor || 'bg-card-pink',
        lessonId: access.lessonId,
        lessonTitle: access.lessonTitle || existing?.lessonTitle || `Lesson ${access.lessonId}`,
        lessonType: access.lessonType || existing?.lessonType || 'video',
        moduleTitle: access.moduleTitle || existing?.moduleTitle || 'Module 1',
        progressPercent: access.progressPercent !== undefined ? access.progressPercent : (existing?.progressPercent || 30),
        currentTime: access.currentTime || existing?.currentTime || '04:12',
        totalDuration: access.totalDuration || existing?.totalDuration || '15:00',
        lastAccessedAt: Date.now(),
        thumbnailUrl: access.thumbnailUrl || existing?.thumbnailUrl || 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1200&q=80',
      };

      const others = prev.filter(
        (item) => !(item.courseId === access.courseId && item.lessonId === access.lessonId)
      );

      return [updatedItem, ...others];
    });
  };

  const getMostRecentLesson = (): RecentLesson | null => {
    if (recentLessons.length === 0) return null;
    return recentLessons[0];
  };

  const setGoalFrequency = (frequency: GoalFrequency) => {
    setStudyGoal((prev) => ({ ...prev, frequency }));
  };

  const setDailyTarget = (minutes: number) => {
    setStudyGoal((prev) => ({ ...prev, dailyTargetMinutes: minutes }));
  };

  const setWeeklyTarget = (minutes: number) => {
    setStudyGoal((prev) => ({ ...prev, weeklyTargetMinutes: minutes }));
  };

  const logStudyMinutes = (mins: number) => {
    setStudyGoal((prev) => {
      const newToday = prev.todayMinutes + mins;
      const newWeek = prev.thisWeekMinutes + mins;
      const willComplete = newToday >= prev.dailyTargetMinutes;
      const wasCompleted = prev.todayMinutes >= prev.dailyTargetMinutes;

      const hitWeekly = newWeek >= prev.weeklyTargetMinutes && prev.thisWeekMinutes < prev.weeklyTargetMinutes;
      if (hitWeekly) {
        triggerCelebration({
          id: `weekly_goal_${Date.now()}`,
          type: 'weekly_goal',
          title: 'Weekly Learning Goal Hit!',
          description: `Outstanding commitment! You logged ${(newWeek / 60).toFixed(1)} hours this week, hitting your weekly target of ${(prev.weeklyTargetMinutes / 60).toFixed(1)} hours.`,
          badgeText: 'Weekly Target Hit! 🏆',
          statValue: `${(newWeek / 60).toFixed(1)} hrs / ${(prev.weeklyTargetMinutes / 60).toFixed(1)} hrs Target`,
        });
      }

      let newStreak = prev.currentStreak;
      if (willComplete && !wasCompleted) {
        newStreak += 1;
      }

      const updatedDays = prev.weekDays.map((d, i) => {
        if (i === 4) { // Friday (Today)
          return {
            ...d,
            minutes: newToday,
            completed: willComplete,
          };
        }
        return d;
      });

      return {
        ...prev,
        todayMinutes: newToday,
        thisWeekMinutes: newWeek,
        currentStreak: newStreak,
        weekDays: updatedDays,
      };
    });
  };

  const resetStudyProgress = () => {
    setStudyGoal(DEFAULT_STUDY_GOAL);
  };

  const getLearningSummaryData = (): LearningSummaryData => {
    const completedList: LearningSummaryData['completedCourses'] = [];
    const inProgressList: LearningSummaryData['inProgressCourses'] = [];

    let calculatedCourseHours = 0;

    ALL_COURSES.forEach((c) => {
      const prog = getProgress(c.id);
      const totalHrs = COURSE_DURATIONS[c.id] || 8.0;

      if (prog === 100) {
        completedList.push({
          id: c.id,
          title: c.title,
          category: c.category,
          instructor: c.instructor,
          hours: totalHrs,
          rating: c.rating,
          completedAt: 'March 2026',
          credentialId: `CRT-${c.id}00${c.id}X`,
        });
        calculatedCourseHours += totalHrs;
      } else if (prog > 0) {
        const loggedHrs = (prog / 100) * totalHrs;
        inProgressList.push({
          id: c.id,
          title: c.title,
          category: c.category,
          progress: prog,
          hoursLogged: Math.round(loggedHrs * 10) / 10,
          totalHours: totalHrs,
        });
        calculatedCourseHours += loggedHrs;
      }
    });

    const independentHours = Math.round((studyGoal.thisWeekMinutes / 60) * 10) / 10;
    const totalHoursLearned = Math.round((calculatedCourseHours + independentHours) * 10) / 10;

    return {
      studentName,
      generatedDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      totalHoursLearned,
      completedCourses: completedList,
      inProgressCourses: inProgressList,
      currentDailyGoal: studyGoal.dailyTargetMinutes,
      currentWeeklyGoal: studyGoal.weeklyTargetMinutes,
      currentStreak: studyGoal.currentStreak,
    };
  };

  const savedCourses = ALL_COURSES.filter((course) => savedCourseIds.includes(course.id));

  return (
    <CourseContext.Provider
      value={{
        savedCourseIds,
        savedCourses,
        toggleSaveCourse,
        isCourseSaved,
        courseProgress,
        updateProgress,
        getProgress,
        recentLessons,
        recordLessonAccess,
        getMostRecentLesson,
        studentName,
        setStudentName,
        markCourseCompleted,
        studyGoal,
        setGoalFrequency,
        setDailyTarget,
        setWeeklyTarget,
        logStudyMinutes,
        resetStudyProgress,
        getLearningSummaryData,
        activeCelebration,
        triggerCelebration,
        dismissCelebration,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}


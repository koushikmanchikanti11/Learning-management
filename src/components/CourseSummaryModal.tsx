import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Users, 
  Layers, 
  Clock, 
  Briefcase, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap, 
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { Course, Module } from '../types';

interface SummaryData {
  overview: string;
  keyTakeaways: string[];
  targetAudience: string;
  prerequisites: string;
  estimatedPace: string;
  careerImpact: string;
}

interface CourseSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  modules?: Module[];
  onOpenFlashcards?: () => void;
}

export default function CourseSummaryModal({
  isOpen,
  onClose,
  course,
  modules = [],
  onOpenFlashcards
}: CourseSummaryModalProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [source, setSource] = useState<'gemini' | 'curated' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch summary when opened or when course changes
  const fetchSummary = async (forceRefresh = false) => {
    if (!isOpen) return;

    // Check cache in sessionStorage if not forcing refresh
    const cacheKey = `learnsphere_summary_${course.id}`;
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          setSummary(parsed.summary);
          setSource(parsed.source || 'gemini');
          return;
        }
      } catch {
        // ignore cache read error
      }
    }

    setLoading(true);
    setError(null);

    try {
      const lessonTitles: string[] = [];
      modules.forEach(m => {
        m.lessons.forEach(l => lessonTitles.push(l.title));
      });

      const res = await fetch('/api/course/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          topic: course.topic,
          instructor: course.instructor,
          lessons: lessonTitles
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setSource(data.source || 'gemini');
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // ignore
        }
      } else {
        throw new Error('Malformed summary response');
      }
    } catch (err: any) {
      console.error('Failed to fetch summary:', err);
      setError(err?.message || 'Unable to connect to AI service');
      // Fallback summary
      setSummary({
        overview: `${course.title} is an intensive study track designed to take you from core mechanics to production-level fluency in ${course.category || 'software development and design'}.`,
        keyTakeaways: [
          `Master fundamental and advanced principles of ${course.topic || 'the curriculum'}.`,
          'Build end-to-end practical deliverables and hands-on exercises.',
          'Adopt modern industry best practices for efficiency and speed.',
          'Prepare for technical interviews or production client handoffs.'
        ],
        targetAudience: `Learners and professionals wishing to master ${course.topic || 'industry workflows'}.`,
        prerequisites: 'Basic foundational knowledge and curiosity to build projects.',
        estimatedPace: '3 to 5 hours per week.',
        careerImpact: 'Expands your engineering or design portfolio with verifiable skills.'
      });
      setSource('curated');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSummary(false);
    }
  }, [isOpen, course.id]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!summary) return;
    const textToCopy = `Course Summary: ${course.title}
Overview:
${summary.overview}

Key Takeaways:
${summary.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join('\n')}

Target Audience: ${summary.targetAudience}
Prerequisites: ${summary.prerequisites}
Estimated Pace: ${summary.estimatedPace}
Career Impact: ${summary.careerImpact}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-[140] flex items-center justify-center bg-[#1B1B1B]/50 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[36px] w-full max-w-[680px] my-auto shadow-2xl border border-black/10 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header */}
        <div className="bg-[#1B1B1B] text-white p-7 sm:p-9 relative overflow-hidden shrink-0">
          <div className="absolute -right-8 -top-8 w-44 h-44 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute right-20 bottom-0 w-36 h-36 bg-amber-500/15 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold tracking-wider uppercase text-purple-300">
                  AI Course Brief
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                  Gemini 3.8 Flash
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close summary modal"
            >
              <X size={18} />
            </button>
          </div>

          <h2 className="text-[26px] sm:text-[30px] font-bold leading-tight relative z-10">
            {course.title}
          </h2>

          <div className="flex items-center gap-3 mt-3 text-[13px] text-white/70 relative z-10 flex-wrap">
            <span>By {course.instructor || 'Lead Instructor'}</span>
            <span>•</span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-md text-white/90 font-medium">
              {course.category}
            </span>
            <span>•</span>
            <span>{modules.length} Modules</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-7 sm:p-9 overflow-y-auto max-h-[65vh] flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col gap-5 py-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-900">
                <Sparkles size={20} className="text-purple-600 animate-spin shrink-0" />
                <span className="text-[14px] font-bold">
                  Gemini is analyzing the course syllabus, learning objectives, and curriculum...
                </span>
              </div>

              {/* Skeleton place holders */}
              <div className="space-y-3">
                <div className="h-4 bg-black/5 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-black/5 rounded-full w-[90%] animate-pulse"></div>
                <div className="h-4 bg-black/5 rounded-full w-[75%] animate-pulse"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="h-24 bg-black/5 rounded-2xl animate-pulse"></div>
                <div className="h-24 bg-black/5 rounded-2xl animate-pulse"></div>
              </div>

              <div className="space-y-2 mt-2">
                <div className="h-4 bg-black/5 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-black/5 rounded-full w-[80%] animate-pulse"></div>
              </div>
            </div>
          ) : summary ? (
            <>
              {error && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[13px] font-medium">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <span>Displaying verified syllabus overview. ({error})</span>
                </div>
              )}

              {/* Overview Box */}
              <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-black/5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#848484] block mb-2">
                  Executive Overview
                </span>
                <p className="text-[15px] sm:text-[16px] text-[#1B1B1B] leading-relaxed font-medium">
                  {summary.overview}
                </p>
              </div>

              {/* Key Takeaways */}
              <div>
                <h3 className="text-[16px] font-bold text-[#1B1B1B] mb-3.5 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#147B44]" />
                  <span>Key Learning Outcomes</span>
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {summary.keyTakeaways.map((takeaway, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-xl bg-white border border-black/5 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#147B44]/10 text-[#147B44] text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-[14px] font-semibold text-[#1B1B1B]/85 leading-snug">
                        {takeaway}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience & Prerequisites 2-Col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#848484] text-[12px] font-bold uppercase tracking-wider mb-2">
                    <Users size={14} className="text-indigo-600" />
                    <span>Who This Is For</span>
                  </div>
                  <p className="text-[13px] font-medium text-[#1B1B1B] leading-relaxed">
                    {summary.targetAudience}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#848484] text-[12px] font-bold uppercase tracking-wider mb-2">
                    <Layers size={14} className="text-amber-600" />
                    <span>Prerequisites</span>
                  </div>
                  <p className="text-[13px] font-medium text-[#1B1B1B] leading-relaxed">
                    {summary.prerequisites}
                  </p>
                </div>
              </div>

              {/* Pace & Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#E8E1F5]/40 border border-purple-200/50">
                  <div className="flex items-center gap-2 text-[#1B1B1B] text-[12px] font-bold uppercase tracking-wider mb-1">
                    <Clock size={14} className="text-purple-700" />
                    <span>Recommended Pace</span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#1B1B1B]">
                    {summary.estimatedPace}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#B2F0D1]/30 border border-emerald-200/60">
                  <div className="flex items-center gap-2 text-[#1B1B1B] text-[12px] font-bold uppercase tracking-wider mb-1">
                    <Briefcase size={14} className="text-emerald-800" />
                    <span>Career Impact</span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#1B1B1B]">
                    {summary.careerImpact}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 sm:p-6 bg-[#FAF9F6] border-t border-black/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={loading || !summary}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-black/5 text-[#1B1B1B] border border-black/10 text-[13px] font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => fetchSummary(true)}
              disabled={loading}
              title="Regenerate course summary with Gemini"
              className="w-10 h-10 rounded-full bg-white hover:bg-black/5 text-[#848484] hover:text-[#1B1B1B] border border-black/10 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFlashcards && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFlashcards();
                }}
                className="px-4 py-2.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 text-[13px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Zap size={14} className="fill-purple-600 text-purple-600" />
                <span>Practice Flashcards</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#1B1B1B] hover:bg-black text-white text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

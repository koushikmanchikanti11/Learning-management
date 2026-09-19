import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Shuffle, 
  RotateCcw, 
  HelpCircle, 
  Lightbulb, 
  Award, 
  Flame, 
  Search, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Brain,
  ListFilter
} from 'lucide-react';
import { Course, Module } from '../types';
import { CourseFlashcard, getFlashcardsForCourse } from '../constants/flashcardData';

interface FlashcardDeckProps {
  course: Course;
  modules?: Module[];
  onOpenSummaryModal?: () => void;
}

export default function FlashcardDeck({
  course,
  modules = [],
  onOpenSummaryModal
}: FlashcardDeckProps) {
  // Storage key for per-course flashcard state
  const storageKey = `learnsphere_flashcards_${course.id}`;

  // State: Flashcard list
  const [cards, setCards] = useState<CourseFlashcard[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return getFlashcardsForCourse(course, modules);
  });

  // Mode: 'deck' | 'quiz' | 'list'
  const [viewMode, setViewMode] = useState<'deck' | 'quiz' | 'list'>('deck');

  // Deck state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);

  // Gemini extraction state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractSuccess, setExtractSuccess] = useState<string | null>(null);

  // Filter for deck: 'all' | 'unmastered' | 'review'
  const [filterType, setFilterType] = useState<'all' | 'unmastered' | 'mastered'>('all');

  // Glossary search
  const [searchQuery, setSearchQuery] = useState('');

  // Quiz Mode State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Save to local storage when cards state updates
  const saveCards = (updatedCards: CourseFlashcard[]) => {
    setCards(updatedCards);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedCards));
    } catch {
      // ignore
    }
  };

  // Reset when course changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`learnsphere_flashcards_${course.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed);
          setCurrentIndex(0);
          setIsFlipped(false);
          setShowHint(false);
          setIsDeckCompleted(false);
          return;
        }
      }
    } catch {
      // fallback
    }
    const defaultDeck = getFlashcardsForCourse(course, modules);
    setCards(defaultDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsDeckCompleted(false);
  }, [course.id]);

  // Filtered cards for the active study deck
  const activeDeckCards = useMemo(() => {
    if (filterType === 'mastered') {
      return cards.filter(c => c.mastered);
    }
    if (filterType === 'unmastered') {
      return cards.filter(c => !c.mastered);
    }
    return cards;
  }, [cards, filterType]);

  // Current active card
  const currentCard = activeDeckCards[currentIndex] || activeDeckCards[0];

  // Stats
  const masteredCount = useMemo(() => cards.filter(c => c.mastered).length, [cards]);
  const reviewCount = useMemo(() => cards.filter(c => c.needsReview && !c.mastered).length, [cards]);
  const masteryPercentage = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  // Deck Flip Handler
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Next / Previous
  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < activeDeckCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsDeckCompleted(true);
    }
  }, [currentIndex, activeDeckCards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Mark as Mastered
  const handleMarkMastered = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentCard) return;
    const updated = cards.map(c => 
      c.id === currentCard.id ? { ...c, mastered: true, needsReview: false } : c
    );
    saveCards(updated);
    handleNext();
  };

  // Mark as Needs Review
  const handleMarkNeedsReview = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentCard) return;
    const updated = cards.map(c => 
      c.id === currentCard.id ? { ...c, mastered: false, needsReview: true } : c
    );
    saveCards(updated);
    handleNext();
  };

  // Shuffle Cards
  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    saveCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsDeckCompleted(false);
  };

  // Reset Deck Progress
  const handleResetProgress = () => {
    const reset = cards.map(c => ({ ...c, mastered: false, needsReview: false }));
    saveCards(reset);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsDeckCompleted(false);
  };

  // Gemini AI Extraction
  const handleExtractWithGemini = async () => {
    setIsExtracting(true);
    setExtractSuccess(null);

    try {
      const lessonTitles: string[] = [];
      modules.forEach(m => {
        m.lessons.forEach(l => lessonTitles.push(`${l.title} (${l.description || ''})`));
      });

      const res = await fetch('/api/course/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: course.title,
          description: course.description,
          category: course.category,
          topic: course.topic,
          lessons: lessonTitles,
          count: 8
        })
      });

      const data = await res.json();
      if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
        // Merge with existing or replace
        const newCards: CourseFlashcard[] = data.cards.map((c: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          term: c.term || 'Term',
          definition: c.definition || '',
          category: c.category || course.topic || 'Core Concept',
          example: c.example || '',
          hint: c.hint || '',
          mastered: false,
          needsReview: false
        }));

        const merged = [...newCards, ...cards.filter(c => !newCards.some(nc => nc.term.toLowerCase() === c.term.toLowerCase()))];
        saveCards(merged);
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsDeckCompleted(false);
        setExtractSuccess(`Successfully extracted ${newCards.length} fresh terms using Gemini!`);
        setTimeout(() => setExtractSuccess(null), 4000);
      } else {
        setExtractSuccess('Loaded high-yield course curriculum cards.');
        setTimeout(() => setExtractSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      setExtractSuccess('Kept current curriculum study cards.');
      setTimeout(() => setExtractSuccess(null), 3000);
    } finally {
      setIsExtracting(false);
    }
  };

  // Keyboard navigation for Study Deck
  useEffect(() => {
    if (viewMode !== 'deck') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1' && isFlipped) {
        handleMarkNeedsReview();
      } else if (e.key === '2' && isFlipped) {
        handleMarkMastered();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleFlip, handleNext, handlePrev, isFlipped, currentCard]);

  // Generate 4 multiple-choice options for Quiz Mode
  const currentQuizCard = cards[quizIndex] || cards[0];
  const quizOptions = useMemo(() => {
    if (!currentQuizCard) return [];
    const otherCards = cards.filter(c => c.id !== currentQuizCard.id);
    const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5).slice(0, 3);
    const combined = [currentQuizCard, ...shuffledOthers].sort(() => Math.random() - 0.5);
    return combined;
  }, [quizIndex, cards]);

  const handleQuizAnswer = (selectedCardId: string, index: number) => {
    if (quizSelectedOption !== null) return; // already answered
    setQuizSelectedOption(index);

    const isCorrect = selectedCardId === currentQuizCard.id;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setQuizStreak(prev => prev + 1);
      // Mark as mastered in deck
      const updated = cards.map(c => 
        c.id === currentQuizCard.id ? { ...c, mastered: true, needsReview: false } : c
      );
      saveCards(updated);
    } else {
      setQuizStreak(0);
      // Mark as needs review in deck
      const updated = cards.map(c => 
        c.id === currentQuizCard.id ? { ...c, needsReview: true, mastered: false } : c
      );
      saveCards(updated);
    }
  };

  const handleQuizNext = () => {
    setQuizSelectedOption(null);
    if (quizIndex < cards.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizSelectedOption(null);
    setQuizCompleted(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Deck Header & Control Bar */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Brain size={18} />
              </span>
              <span className="text-[12px] font-extrabold uppercase tracking-wider text-purple-700">
                Active Recall Study Deck
              </span>
              <span className="bg-black/5 text-[#1B1B1B] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                {cards.length} Key Terms
              </span>
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold text-[#1B1B1B]">
              {course.title} Flashcards
            </h2>
            <p className="text-[#848484] text-[14px] font-medium mt-1">
              Test your retention with spaced repetition, extracted key concepts, and live quiz mode.
            </p>
          </div>

          {/* Action buttons on top */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Extract with Gemini Button */}
            <button
              type="button"
              id="extract-gemini-terms-btn"
              onClick={handleExtractWithGemini}
              disabled={isExtracting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-full text-[13px] font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              title="Use Gemini AI to extract new technical terms and definitions from the course syllabus"
            >
              <Sparkles size={16} className={isExtracting ? 'animate-spin' : ''} />
              <span>{isExtracting ? 'Extracting with Gemini...' : 'Extract with Gemini'}</span>
            </button>

            {onOpenSummaryModal && (
              <button
                type="button"
                onClick={onOpenSummaryModal}
                className="bg-white hover:bg-black/5 text-[#1B1B1B] border border-black/10 px-4 py-3 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Lightbulb size={16} className="text-amber-500" />
                <span>AI Summary</span>
              </button>
            )}

            {/* Mode Selector Tabs */}
            <div className="flex bg-[#f4f4f4] rounded-full p-1 border border-black/5">
              <button
                type="button"
                onClick={() => setViewMode('deck')}
                className={`px-4 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
                  viewMode === 'deck' ? 'bg-[#1B1B1B] text-white shadow-xs' : 'text-[#848484] hover:text-[#1B1B1B]'
                }`}
              >
                Study Deck
              </button>
              <button
                type="button"
                onClick={() => setViewMode('quiz')}
                className={`px-4 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
                  viewMode === 'quiz' ? 'bg-[#1B1B1B] text-white shadow-xs' : 'text-[#848484] hover:text-[#1B1B1B]'
                }`}
              >
                Quiz Mode
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#1B1B1B] text-white shadow-xs' : 'text-[#848484] hover:text-[#1B1B1B]'
                }`}
              >
                Glossary
              </button>
            </div>
          </div>
        </div>

        {/* Status Toast */}
        {extractSuccess && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-purple-900 text-[13px] font-bold flex items-center gap-2 animate-fade-in">
            <Sparkles size={16} className="text-purple-600" />
            <span>{extractSuccess}</span>
          </div>
        )}

        {/* Mastery Progress Bar */}
        <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#1B1B1B]">Mastery:</span>
              <span className="text-[16px] font-extrabold text-[#147B44]">{masteryPercentage}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-[#147B44]/10 text-[#147B44] px-2.5 py-1 rounded-full text-[12px] font-bold flex items-center gap-1">
                <Check size={12} strokeWidth={3} /> {masteredCount} Mastered
              </span>
              <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[12px] font-bold flex items-center gap-1">
                <AlertTriangle size={12} /> {reviewCount} Need Review
              </span>
              <span className="bg-black/5 text-[#848484] px-2.5 py-1 rounded-full text-[12px] font-bold">
                {cards.length - masteredCount} Remaining
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleShuffle}
              className="p-2 rounded-xl text-[#848484] hover:text-[#1B1B1B] hover:bg-black/5 transition-colors cursor-pointer"
              title="Shuffle cards"
            >
              <Shuffle size={16} />
            </button>
            <button
              type="button"
              onClick={handleResetProgress}
              className="p-2 rounded-xl text-[#848484] hover:text-[#1B1B1B] hover:bg-black/5 transition-colors cursor-pointer"
              title="Reset progress"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: STUDY DECK */}
      {viewMode === 'deck' && (
        <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
          {activeDeckCards.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-black/5 shadow-sm w-full">
              <Award size={48} className="text-amber-500 mx-auto mb-4" />
              <h3 className="text-[22px] font-bold text-[#1B1B1B] mb-2">
                {filterType === 'unmastered' ? 'All Cards Mastered!' : 'No Cards in this filter'}
              </h3>
              <p className="text-[#848484] text-[15px] mb-6">
                {filterType === 'unmastered' 
                  ? 'Outstanding job! You have marked every term in this deck as mastered.' 
                  : 'Try selecting a different deck filter above.'}
              </p>
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className="bg-[#1B1B1B] text-white px-6 py-3 rounded-full text-[14px] font-bold hover:bg-black transition-colors"
              >
                View All Cards
              </button>
            </div>
          ) : isDeckCompleted ? (
            /* Deck Completed View */
            <div className="bg-white rounded-[36px] p-10 sm:p-12 text-center border border-black/5 shadow-md w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#147B44] flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Award size={32} />
              </div>
              <span className="text-[12px] font-extrabold tracking-wider uppercase text-[#147B44] block mb-1">
                Deck Cycle Completed
              </span>
              <h3 className="text-[28px] sm:text-[32px] font-bold text-[#1B1B1B] mb-2">
                Great Study Session!
              </h3>
              <p className="text-[#848484] text-[15px] max-w-md mx-auto mb-8 font-medium">
                You've reviewed all {activeDeckCards.length} cards in this pass. You have {masteredCount} terms mastered out of {cards.length} total.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    setIsDeckCompleted(false);
                  }}
                  className="bg-[#1B1B1B] text-white px-8 py-3.5 rounded-full text-[14px] font-bold hover:bg-black transition-all shadow-sm cursor-pointer"
                >
                  Restart Deck
                </button>

                {cards.some(c => c.needsReview) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilterType('unmastered');
                      setCurrentIndex(0);
                      setIsFlipped(false);
                      setIsDeckCompleted(false);
                    }}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-6 py-3.5 rounded-full text-[14px] font-bold transition-all cursor-pointer"
                  >
                    Review Missed Cards Only
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setViewMode('quiz')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-950 px-6 py-3.5 rounded-full text-[14px] font-bold transition-all cursor-pointer"
                >
                  Take Active Quiz
                </button>
              </div>
            </div>
          ) : (
            /* Active Flip Card */
            <>
              {/* Filter Pills and Counter */}
              <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setFilterType('all'); setCurrentIndex(0); setIsFlipped(false); }}
                    className={`px-3 py-1 rounded-full text-[12px] font-bold transition-colors cursor-pointer ${
                      filterType === 'all' ? 'bg-[#1B1B1B] text-white' : 'bg-white text-[#848484] hover:text-[#1B1B1B]'
                    }`}
                  >
                    All ({cards.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFilterType('unmastered'); setCurrentIndex(0); setIsFlipped(false); }}
                    className={`px-3 py-1 rounded-full text-[12px] font-bold transition-colors cursor-pointer ${
                      filterType === 'unmastered' ? 'bg-[#1B1B1B] text-white' : 'bg-white text-[#848484] hover:text-[#1B1B1B]'
                    }`}
                  >
                    To Learn ({cards.length - masteredCount})
                  </button>
                </div>

                <span className="text-[13px] font-bold text-[#848484]">
                  Card {currentIndex + 1} of {activeDeckCards.length}
                </span>
              </div>

              {/* 3D Tactile Card Container */}
              <div 
                onClick={handleFlip}
                className="w-full min-h-[360px] sm:min-h-[400px] bg-white rounded-[36px] p-8 sm:p-12 border-2 border-black/5 shadow-lg hover:shadow-xl transition-all cursor-pointer relative flex flex-col justify-between select-none group"
              >
                {/* Status Badges on Top of Card */}
                <div className="flex items-center justify-between gap-4">
                  <span className="px-3.5 py-1 rounded-full bg-[#f4f4f4] text-[#1B1B1B] text-[12px] font-extrabold uppercase tracking-wider">
                    {currentCard?.category || 'Key Concept'}
                  </span>

                  <div className="flex items-center gap-2">
                    {currentCard?.mastered && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#147B44] text-[11px] font-bold flex items-center gap-1">
                        <Check size={12} strokeWidth={3} /> Mastered
                      </span>
                    )}
                    {currentCard?.needsReview && !currentCard.mastered && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Review
                      </span>
                    )}
                    <span className="text-[12px] font-semibold text-[#848484] group-hover:text-[#1B1B1B] transition-colors flex items-center gap-1">
                      <RotateCw size={13} /> Flip
                    </span>
                  </div>
                </div>

                {/* Card Center Content */}
                <div className="my-auto py-8 text-center flex flex-col items-center justify-center">
                  {!isFlipped ? (
                    /* FRONT OF CARD */
                    <div className="animate-fade-in flex flex-col items-center max-w-xl">
                      <span className="text-[12px] font-bold text-[#848484] uppercase tracking-wider mb-3">
                        Key Term / Concept
                      </span>
                      <h3 className="text-[28px] sm:text-[38px] font-extrabold text-[#1B1B1B] leading-tight mb-6">
                        {currentCard?.term}
                      </h3>

                      {currentCard?.hint && (
                        <div>
                          {showHint ? (
                            <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-2xl text-[13px] font-medium flex items-center gap-2 animate-fade-in max-w-md">
                              <Lightbulb size={16} className="text-purple-600 shrink-0" />
                              <span>{currentCard.hint}</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowHint(true);
                              }}
                              className="text-[12px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors"
                            >
                              <HelpCircle size={14} /> Need a hint?
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* BACK OF CARD */
                    <div className="animate-fade-in flex flex-col items-center max-w-xl text-left sm:text-center w-full">
                      <span className="text-[12px] font-extrabold text-purple-700 uppercase tracking-wider mb-2 block">
                        Definition & Application
                      </span>
                      <h4 className="text-[20px] sm:text-[22px] font-bold text-[#1B1B1B] mb-3">
                        {currentCard?.term}
                      </h4>
                      <p className="text-[16px] sm:text-[17px] text-[#1B1B1B]/85 font-medium leading-relaxed mb-5">
                        {currentCard?.definition}
                      </p>

                      {currentCard?.example && (
                        <div className="w-full bg-[#FAF9F6] p-4 rounded-2xl border border-black/5 text-left mb-2">
                          <span className="text-[11px] font-extrabold uppercase text-[#848484] block mb-1">
                            Practical Example
                          </span>
                          <p className="text-[13px] font-semibold text-[#1B1B1B] font-mono leading-relaxed">
                            {currentCard.example}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom Controls */}
                <div className="border-t border-black/5 pt-4 flex items-center justify-between gap-4">
                  <span className="text-[12px] text-[#848484] font-medium hidden sm:inline">
                    {!isFlipped ? 'Click card or press Space to reveal definition' : 'Rate your recall:'}
                  </span>

                  {isFlipped ? (
                    /* Self Evaluation buttons */
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        type="button"
                        onClick={handleMarkNeedsReview}
                        className="px-5 py-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 text-[13px] font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                        title="Mark as needing more practice"
                      >
                        <X size={15} />
                        <span>Still Learning</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleMarkMastered}
                        className="px-6 py-2.5 rounded-full bg-[#147B44] hover:bg-emerald-700 text-white text-[13px] font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                        title="Mark as mastered"
                      >
                        <Check size={15} strokeWidth={3} />
                        <span>Got It!</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[12px] font-bold text-[#1B1B1B]/70 ml-auto">
                      Space to flip →
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Controls Bar */}
              <div className="flex items-center justify-between w-full gap-4 mt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-5 py-3 rounded-full bg-white hover:bg-black/5 text-[#1B1B1B] border border-black/10 text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="px-6 py-3 rounded-full bg-[#1B1B1B] hover:bg-black text-white text-[13px] font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <RotateCw size={15} />
                    <span>Flip Card</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-white hover:bg-black/5 text-[#1B1B1B] border border-black/10 text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>{currentIndex === activeDeckCards.length - 1 ? 'Finish' : 'Next'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Keyboard shortcuts helper */}
              <div className="flex items-center justify-center gap-6 text-[12px] text-[#848484] font-medium mt-2">
                <span><kbd className="px-2 py-0.5 bg-black/5 rounded text-[11px] font-mono">←</kbd> Prev</span>
                <span><kbd className="px-2 py-0.5 bg-black/5 rounded text-[11px] font-mono">Space</kbd> Flip</span>
                <span><kbd className="px-2 py-0.5 bg-black/5 rounded text-[11px] font-mono">→</kbd> Next</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW MODE 2: MULTIPLE CHOICE QUIZ */}
      {viewMode === 'quiz' && (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
          {quizCompleted ? (
            /* Quiz Score Card */
            <div className="bg-white rounded-[36px] p-10 sm:p-12 text-center border border-black/5 shadow-md w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Award size={32} />
              </div>
              <span className="text-[12px] font-extrabold tracking-wider uppercase text-purple-700 block mb-1">
                Quiz Results
              </span>
              <h3 className="text-[30px] font-bold text-[#1B1B1B] mb-2">
                {quizScore === cards.length ? 'Perfect Score!' : 'Quiz Finished!'}
              </h3>
              <p className="text-[#848484] text-[15px] max-w-md mx-auto mb-6">
                You scored <strong className="text-[#1B1B1B]">{quizScore}</strong> out of <strong className="text-[#1B1B1B]">{cards.length}</strong> ({Math.round((quizScore / cards.length) * 100)}%).
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="bg-[#1B1B1B] text-white px-8 py-3.5 rounded-full text-[14px] font-bold hover:bg-black transition-all shadow-sm cursor-pointer"
                >
                  Retake Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('deck')}
                  className="bg-white hover:bg-black/5 text-[#1B1B1B] border border-black/10 px-6 py-3.5 rounded-full text-[14px] font-bold transition-all shadow-xs cursor-pointer"
                >
                  Return to Study Deck
                </button>
              </div>
            </div>
          ) : (
            /* Active Quiz Question */
            <div className="bg-white rounded-[36px] p-8 sm:p-10 border border-black/5 shadow-sm flex flex-col gap-6 animate-fade-in">
              {/* Question Header */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                    Question {quizIndex + 1} of {cards.length}
                  </span>
                  {quizStreak > 1 && (
                    <span className="text-[12px] font-extrabold text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                      <Flame size={14} className="fill-amber-500" /> {quizStreak} Streak
                    </span>
                  )}
                </div>

                <span className="text-[13px] font-bold text-[#848484]">
                  Score: {quizScore}
                </span>
              </div>

              {/* Prompt */}
              <div>
                <span className="text-[12px] font-bold text-[#848484] uppercase tracking-wider block mb-2">
                  Select the correct definition for:
                </span>
                <h3 className="text-[26px] sm:text-[30px] font-bold text-[#1B1B1B] leading-tight">
                  {currentQuizCard.term}
                </h3>
              </div>

              {/* 4 Multiple Choice Options */}
              <div className="flex flex-col gap-3">
                {quizOptions.map((opt, idx) => {
                  const isSelected = quizSelectedOption === idx;
                  const isCorrect = opt.id === currentQuizCard.id;
                  const hasAnswered = quizSelectedOption !== null;

                  let style = 'bg-[#FAF9F6] border-black/5 hover:border-black/20 hover:bg-white text-[#1B1B1B]';
                  if (hasAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs';
                    } else if (isSelected) {
                      style = 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs';
                    } else {
                      style = 'bg-white/50 opacity-40 border-black/5';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleQuizAnswer(opt.id, idx)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-4 cursor-pointer ${style}`}
                    >
                      <span className={`w-7 h-7 rounded-full text-[12px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                        hasAnswered && isCorrect ? 'bg-emerald-600 text-white' :
                        hasAnswered && isSelected ? 'bg-rose-600 text-white' :
                        'bg-black/5 text-[#1B1B1B]'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] sm:text-[15px] leading-snug">
                          {opt.definition}
                        </p>
                      </div>
                      {hasAnswered && isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question / Feedback Bar */}
              {quizSelectedOption !== null && (
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-black/5 animate-fade-in">
                  <span className="text-[14px] font-bold">
                    {quizOptions[quizSelectedOption]?.id === currentQuizCard.id ? (
                      <span className="text-[#147B44] flex items-center gap-1.5">
                        <Check size={16} strokeWidth={3} /> Correct!
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1.5">
                        <X size={16} /> Incorrect. Review this term!
                      </span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={handleQuizNext}
                    className="bg-[#1B1B1B] hover:bg-black text-white px-7 py-3 rounded-full text-[13px] font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>{quizIndex === cards.length - 1 ? 'See Results' : 'Next Question'}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 3: ALL CARDS GLOSSARY */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848484]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search terms, definitions, or tags..."
                className="w-full bg-[#f4f4f4] border border-transparent rounded-full pl-11 pr-4 py-3 text-[14px] font-medium text-[#1B1B1B] focus:bg-white focus:border-black/20 focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2 text-[13px] text-[#848484] font-semibold">
              <ListFilter size={15} />
              <span>Showing {cards.filter(c => 
                c.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.definition.toLowerCase().includes(searchQuery.toLowerCase())
              ).length} terms</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards
              .filter(c => 
                c.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(c => (
                <div 
                  key={c.id} 
                  className="p-5 rounded-2xl bg-[#FAF9F6] border border-black/5 hover:border-black/20 hover:bg-white transition-all flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                        {c.category}
                      </span>
                      {c.mastered && (
                        <span className="text-[11px] font-bold text-[#147B44] flex items-center gap-1">
                          <Check size={12} strokeWidth={3} /> Mastered
                        </span>
                      )}
                    </div>
                    <h4 className="text-[18px] font-bold text-[#1B1B1B] mb-2">
                      {c.term}
                    </h4>
                    <p className="text-[14px] text-[#1B1B1B]/80 font-medium leading-relaxed">
                      {c.definition}
                    </p>
                  </div>

                  {c.example && (
                    <div className="p-3 bg-white rounded-xl border border-black/5 text-[12px] font-mono text-[#1B1B1B]/80">
                      {c.example}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

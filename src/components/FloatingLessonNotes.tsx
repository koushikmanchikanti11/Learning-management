import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Sparkles, 
  Clock, 
  Code, 
  List, 
  Save, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface FloatingLessonNotesProps {
  lessonId: number;
  lessonTitle: string;
  courseTitle?: string;
  currentTime?: string;
}

export default function FloatingLessonNotes({
  lessonId,
  lessonTitle,
  courseTitle = 'Course',
  currentTime = '04:12',
}: FloatingLessonNotesProps) {
  const storageKey = `lesson_notes_${lessonId}`;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load notes whenever lessonId changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setNoteContent(saved);
        setLastSavedTime('Loaded');
      } else {
        setNoteContent('');
        setLastSavedTime(null);
      }
      setSaveStatus('saved');
    } catch {
      setNoteContent('');
    }
  }, [lessonId, storageKey]);

  // Handle text input and auto-save
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteContent(text);
    setSaveStatus('saving');

    try {
      localStorage.setItem(storageKey, text);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(now);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to auto-save note:', err);
      setSaveStatus('saved');
    }
  };

  const handleCopy = () => {
    if (!noteContent) return;
    navigator.clipboard.writeText(noteContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!noteContent) return;
    const header = `Notes for Lesson ${lessonId}: ${lessonTitle}\n${courseTitle}\nSaved: ${new Date().toLocaleString()}\n----------------------------------------\n\n`;
    const blob = new Blob([header + noteContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lesson-${lessonId}-Notes.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setNoteContent('');
    localStorage.removeItem(storageKey);
    setLastSavedTime(null);
    setShowClearConfirm(false);
    setSaveStatus('saved');
  };

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = noteContent.substring(0, start);
    const after = noteContent.substring(end);
    const newText = before + snippet + after;
    
    setNoteContent(newText);
    try {
      localStorage.setItem(storageKey, newText);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSaveStatus('saved');
    } catch {
      // ignore
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  const wordCount = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;
  const charCount = noteContent.length;

  return (
    <>
      {/* Minimized Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
          <button
            type="button"
            id="open-floating-notes-btn"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1B1B1B] text-white hover:bg-black shadow-xl hover:shadow-2xl border border-white/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={`Open Notes for Lesson ${lessonId}`}
          >
            <div className="relative">
              <FileText size={18} className="text-amber-400 group-hover:rotate-12 transition-transform" />
              {noteContent.trim().length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1B1B1B]"></span>
              )}
            </div>
            <div className="text-left">
              <span className="text-[13px] font-bold block leading-none">Lesson Notes</span>
              <span className="text-[10px] text-white/60 block leading-none mt-1">
                {noteContent.trim().length > 0 ? `${wordCount} words saved` : `Lesson ${lessonId}`}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Expanded Floating Notes Panel */}
      {isOpen && (
        <div 
          className={`fixed z-40 transition-all duration-300 shadow-2xl ${
            isExpanded 
              ? 'bottom-6 right-6 left-6 md:left-auto md:w-[620px] h-[580px] max-h-[85vh]' 
              : 'bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-[390px] h-[460px] max-h-[80vh]'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border border-black/10 rounded-[28px] overflow-hidden flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-[#1B1B1B] text-white flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-amber-400">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Lesson {lessonId}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/30"></span>
                    <span className="text-[11px] text-white/60 truncate max-w-[150px]">
                      {lessonTitle}
                    </span>
                  </div>
                  <h4 className="text-[14px] font-bold text-white tracking-tight leading-tight truncate">
                    Study Notes
                  </h4>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title={isExpanded ? 'Collapse size' : 'Expand panel'}
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  title="Minimize notes"
                >
                  <ChevronDown size={17} />
                </button>
              </div>
            </div>

            {/* Quick Formatting Toolbar */}
            <div className="px-3.5 py-2 bg-[#FAF9F6] border-b border-black/5 flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-semibold text-[#848484] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertSnippet(`\n[${currentTime}] `)}
                  className="px-2 py-1 rounded-md bg-white border border-black/5 hover:bg-black/5 text-[#1B1B1B] flex items-center gap-1 transition-colors"
                  title="Insert current video timestamp"
                >
                  <Clock size={12} className="text-amber-600" />
                  <span>{currentTime}</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertSnippet('\n• ')}
                  className="px-2 py-1 rounded-md bg-white border border-black/5 hover:bg-black/5 text-[#1B1B1B] flex items-center gap-1 transition-colors"
                  title="Add bullet point"
                >
                  <List size={12} />
                  <span>Bullet</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertSnippet('\n```\n// code snippet\n```\n')}
                  className="px-2 py-1 rounded-md bg-white border border-black/5 hover:bg-black/5 text-[#1B1B1B] flex items-center gap-1 transition-colors"
                  title="Add code block"
                >
                  <Code size={12} />
                  <span>Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => insertSnippet('\n⭐ Key Takeaway: ')}
                  className="px-2 py-1 rounded-md bg-white border border-black/5 hover:bg-black/5 text-[#1B1B1B] flex items-center gap-1 transition-colors hidden sm:flex"
                  title="Add Key Takeaway label"
                >
                  <Sparkles size={12} className="text-amber-500" />
                  <span>Key Point</span>
                </button>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold shrink-0">
                <Check size={12} strokeWidth={3} />
                <span>{saveStatus === 'saving' ? 'Saving...' : 'Auto-saved'}</span>
              </div>
            </div>

            {/* Note Textarea Area */}
            <div className="flex-1 p-3.5 flex flex-col min-h-0 bg-white">
              <textarea
                ref={textareaRef}
                id={`lesson-notes-textarea-${lessonId}`}
                value={noteContent}
                onChange={handleTextChange}
                placeholder={`Write your personal notes for Lesson ${lessonId} here...\n\n• Key concepts & definitions\n• Implementation snippets\n• Questions for instructor\n\nAutomatically saved to local storage for this lesson.`}
                className="w-full flex-1 resize-none bg-transparent outline-none text-[13px] md:text-[14px] text-[#1B1B1B] leading-relaxed placeholder:text-[#848484]/60 font-mono sm:font-sans selection:bg-amber-100"
              />

              {/* Clear confirmation alert */}
              {showClearConfirm && (
                <div className="p-2.5 mb-2 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-[11px] text-red-900 animate-fade-in">
                  <span>Clear all notes for this lesson?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-2 py-0.5 rounded bg-red-600 text-white font-bold hover:bg-red-700"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-0.5 rounded bg-white text-[#1B1B1B] font-bold border border-black/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="p-3 bg-[#FAF9F6] border-t border-black/5 flex items-center justify-between text-[11px] text-[#848484] shrink-0">
              <div className="flex items-center gap-2">
                <span>{wordCount} words</span>
                <span className="w-1 h-1 rounded-full bg-black/20"></span>
                <span>{charCount} chars</span>
                {lastSavedTime && (
                  <span className="hidden sm:inline text-[#848484]/80">
                    • Saved {lastSavedTime}
                  </span>
                )}
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!noteContent}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-[#1B1B1B] transition-colors disabled:opacity-30 flex items-center gap-1"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!noteContent}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-[#1B1B1B] transition-colors disabled:opacity-30"
                  title="Download .txt"
                >
                  <Download size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  disabled={!noteContent}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-30"
                  title="Clear notes"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

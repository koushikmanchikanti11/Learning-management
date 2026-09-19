import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Download, 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Filter,
  CalendarCheck
} from 'lucide-react';
import { 
  ScheduledEvent, 
  generateICSContent, 
  downloadICSFile, 
  generateGoogleCalendarUrl 
} from '../utils/icsExport';

interface ExportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: ScheduledEvent[];
  currentView: 'Today' | 'Week' | 'Month';
  selectedDateStr?: string;
}

export default function ExportCalendarModal({
  isOpen,
  onClose,
  events,
  currentView,
  selectedDateStr = 'Current Selection',
}: ExportCalendarModalProps) {
  const [scope, setScope] = useState<'all' | 'current_view' | 'courses_only'>('all');
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'google' | 'apple' | 'outlook'>('google');

  // Filter events based on selected scope
  const filteredEvents = useMemo(() => {
    if (scope === 'courses_only') {
      return events.filter(e => e.type.toLowerCase().includes('course') || e.type.toLowerCase().includes('webinar'));
    }
    if (scope === 'current_view') {
      if (currentView === 'Today') {
        const todayStr = new Date().toISOString().split('T')[0];
        return events.filter(e => e.date === todayStr || e.day === undefined);
      }
      return events; // in Week or Month it already includes the range
    }
    return events;
  }, [events, scope, currentView]);

  if (!isOpen) return null;

  const handleDownload = () => {
    try {
      const icsString = generateICSContent(filteredEvents, {
        calendarName: 'LearnSphere LMS Study Schedule',
        calendarDescription: `Exported on ${new Date().toLocaleDateString()} with ${filteredEvents.length} scheduled sessions`,
      });
      const filename = `LearnSphere-Schedule-${scope}-${new Date().toISOString().slice(0, 10)}.ics`;
      downloadICSFile(filename, icsString);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to export .ics file:', err);
    }
  };

  const handleCopy = () => {
    try {
      const icsString = generateICSContent(filteredEvents);
      navigator.clipboard.writeText(icsString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy .ics content:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-[36px] overflow-hidden shadow-2xl border border-black/10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-8 bg-[#1B1B1B] text-white flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                iCalendar (.ics) Sync
              </span>
            </div>
            <h2 id="export-modal-title" className="text-[24px] md:text-[28px] font-bold text-white tracking-tight leading-tight">
              Export Scheduled Lessons
            </h2>
            <p className="text-[13px] md:text-[14px] text-white/70 mt-1 max-w-md">
              Download your schedule as an universal .ics file to automatically sync with Google Calendar, Apple Calendar, or Outlook.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export dialog"
            className="relative z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Scope Selector */}
          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#848484] block mb-2.5">
              Select Export Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  scope === 'all'
                    ? 'bg-[#E8E1F5] border-purple-300 text-[#1B1B1B] shadow-xs'
                    : 'bg-[#FAF9F6] border-black/5 hover:border-black/15 text-[#1B1B1B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-bold">All Lessons</span>
                  {scope === 'all' && <Check size={14} className="text-[#1B1B1B]" />}
                </div>
                <span className="text-[11px] text-[#848484] block leading-tight">
                  {events.length} total scheduled events
                </span>
              </button>

              <button
                type="button"
                onClick={() => setScope('current_view')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  scope === 'current_view'
                    ? 'bg-[#E8E1F5] border-purple-300 text-[#1B1B1B] shadow-xs'
                    : 'bg-[#FAF9F6] border-black/5 hover:border-black/15 text-[#1B1B1B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-bold">{currentView} View</span>
                  {scope === 'current_view' && <Check size={14} className="text-[#1B1B1B]" />}
                </div>
                <span className="text-[11px] text-[#848484] block leading-tight">
                  Active view schedule
                </span>
              </button>

              <button
                type="button"
                onClick={() => setScope('courses_only')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  scope === 'courses_only'
                    ? 'bg-[#E8E1F5] border-purple-300 text-[#1B1B1B] shadow-xs'
                    : 'bg-[#FAF9F6] border-black/5 hover:border-black/15 text-[#1B1B1B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-bold">Courses & Live</span>
                  {scope === 'courses_only' && <Check size={14} className="text-[#1B1B1B]" />}
                </div>
                <span className="text-[11px] text-[#848484] block leading-tight">
                  Formal classes only
                </span>
              </button>
            </div>
          </div>

          {/* Event Preview Summary */}
          <div className="bg-[#FAF9F6] border border-black/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck size={16} className="text-emerald-600" />
                <span className="text-[13px] font-bold text-[#1B1B1B]">
                  Included Sessions ({filteredEvents.length})
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#848484]">
                15-min notification alarms enabled
              </span>
            </div>

            <div className="max-h-[190px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-6 text-[13px] text-[#848484]">
                  No sessions found for this filter.
                </div>
              ) : (
                filteredEvents.map((evt, idx) => (
                  <div 
                    key={evt.id || idx}
                    className="bg-white rounded-xl p-3 border border-black/5 flex items-center justify-between gap-3 text-[12px]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[#1B1B1B] truncate">
                          {evt.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-black/5 text-[10px] font-bold text-[#848484] uppercase">
                          {evt.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#848484] text-[11px]">
                        <span>{evt.day ? `${evt.day}, ` : ''}{evt.date}</span>
                        <span>•</span>
                        <span>{evt.time}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {evt.duration}
                        </span>
                      </div>
                    </div>

                    <a
                      href={generateGoogleCalendarUrl(evt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-black/5 text-[#1B1B1B] text-[11px] font-semibold transition-colors flex items-center gap-1 shrink-0"
                      title="Add single event to Google Calendar"
                    >
                      <span>Google Cal</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sync Compatibility & Instructions Toggle */}
          <div className="border border-black/5 rounded-2xl p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={15} className="text-purple-600" />
                <span className="text-[13px] font-bold text-[#1B1B1B]">
                  External Calendar Compatibility
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-[12px] font-bold text-purple-700 hover:underline cursor-pointer"
              >
                {showInstructions ? 'Hide Guide' : 'How to import?'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-black/5 text-[11px] font-semibold text-[#1B1B1B]">
                Google Calendar
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-black/5 text-[11px] font-semibold text-[#1B1B1B]">
                Apple Calendar (iCal)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-black/5 text-[11px] font-semibold text-[#1B1B1B]">
                Microsoft Outlook
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-black/5 text-[11px] font-semibold text-[#1B1B1B]">
                Notion Calendar
              </span>
            </div>

            {showInstructions && (
              <div className="mt-4 pt-4 border-t border-black/5 animate-fade-in text-[12px]">
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveGuideTab('google')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      activeGuideTab === 'google' ? 'bg-[#1B1B1B] text-white' : 'bg-[#FAF9F6] text-[#848484]'
                    }`}
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGuideTab('apple')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      activeGuideTab === 'apple' ? 'bg-[#1B1B1B] text-white' : 'bg-[#FAF9F6] text-[#848484]'
                    }`}
                  >
                    Apple iCal
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGuideTab('outlook')}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      activeGuideTab === 'outlook' ? 'bg-[#1B1B1B] text-white' : 'bg-[#FAF9F6] text-[#848484]'
                    }`}
                  >
                    Outlook
                  </button>
                </div>

                {activeGuideTab === 'google' && (
                  <ol className="list-decimal list-inside space-y-1 text-[#636363] leading-relaxed">
                    <li>Download the <strong>.ics</strong> file using the button below.</li>
                    <li>Open <a href="https://calendar.google.com" target="_blank" rel="noreferrer" className="text-purple-600 underline">Google Calendar</a>.</li>
                    <li>Click the <strong>Settings (gear icon)</strong> → <strong>Import & Export</strong>.</li>
                    <li>Select the downloaded .ics file and pick your desired calendar to import.</li>
                  </ol>
                )}

                {activeGuideTab === 'apple' && (
                  <ol className="list-decimal list-inside space-y-1 text-[#636363] leading-relaxed">
                    <li>Download the <strong>.ics</strong> file.</li>
                    <li>Double-click the downloaded file in Finder (macOS) or tap it in Files (iOS).</li>
                    <li>Select which calendar (e.g. Work, Study, or Personal) to add the events to.</li>
                  </ol>
                )}

                {activeGuideTab === 'outlook' && (
                  <ol className="list-decimal list-inside space-y-1 text-[#636363] leading-relaxed">
                    <li>Download the <strong>.ics</strong> file.</li>
                    <li>In Outlook, click <strong>File</strong> → <strong>Open & Export</strong> → <strong>Import/Export</strong>.</li>
                    <li>Choose <strong>Import an iCalendar (.ics) or vCalendar file</strong> and select your downloaded file.</li>
                  </ol>
                )}
              </div>
            )}
          </div>

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-emerald-900 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span className="text-[12px] font-bold">
                  .ics file downloaded successfully! Ready to import into your calendar.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 md:p-6 bg-[#FAF9F6] border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            disabled={filteredEvents.length === 0}
            className="w-full sm:w-auto py-3 px-4 rounded-full border border-black/10 bg-white hover:bg-black/5 text-[#1B1B1B] text-[13px] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            <span>{copied ? 'Copied iCal Data!' : 'Copy .ics Code'}</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none py-3 px-5 rounded-full border border-black/10 bg-white hover:bg-black/5 text-[#1B1B1B] text-[13px] font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            
            <button
              type="button"
              onClick={handleDownload}
              disabled={filteredEvents.length === 0}
              className="flex-1 sm:flex-none py-3 px-6 rounded-full bg-[#1B1B1B] hover:bg-black text-white text-[13px] font-bold transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <Download size={16} />
              <span>Download .ics File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

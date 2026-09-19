import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Download, 
  ExternalLink,
  CalendarCheck
} from 'lucide-react';
import ExportCalendarModal from '../components/ExportCalendarModal';
import { 
  ScheduledEvent, 
  generateICSContent, 
  downloadICSFile, 
  generateGoogleCalendarUrl 
} from '../utils/icsExport';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const INITIAL_SCHEDULE_EVENTS: ScheduledEvent[] = [
  { 
    id: 'evt-today-1',
    time: '09:00 AM', 
    title: 'UX Research Sync', 
    type: 'Design', 
    duration: '45m', 
    color: 'bg-card-pink',
    date: '2026-09-04',
    day: 'Today',
    description: 'Weekly design sprint synchronization with cross-functional UX leads.',
    courseTitle: 'Interaction Design & User Research',
    location: 'LearnSphere Studio A'
  },
  { 
    id: 'evt-today-2',
    time: '11:30 AM', 
    title: 'Advanced React Patterns', 
    type: 'Course', 
    duration: '2h', 
    color: 'bg-[#DCDDFF]',
    date: '2026-09-04',
    day: 'Today',
    description: 'Live interactive coding workshop covering compound components and state machines.',
    courseTitle: 'Advanced React 19 Patterns',
    instructor: 'Alex Rivera',
    location: 'Virtual Classroom 3'
  },
  { 
    id: 'evt-today-3',
    time: '02:00 PM', 
    title: '1-on-1 Mentoring', 
    type: 'Call', 
    duration: '30m', 
    color: 'bg-card-yellow',
    date: '2026-09-04',
    day: 'Today',
    description: 'Personalized portfolio review and career growth mentoring session.',
    instructor: 'Sarah Jenkins',
    location: 'Google Meet / LearnSphere Room'
  },
  { 
    id: 'evt-today-4',
    time: '04:00 PM', 
    title: 'System Design Q&A', 
    type: 'Webinar', 
    duration: '1h', 
    color: 'bg-[#B2F0D1]',
    date: '2026-09-04',
    day: 'Today',
    description: 'Open Q&A on distributed cache architectures and high-throughput databases.',
    courseTitle: 'Enterprise System Architecture',
    location: 'Webinar Hall 1'
  },
  { 
    id: 'evt-week-mon',
    day: 'Mon', 
    time: '10:00 AM', 
    title: 'Weekly Sync', 
    type: 'Meeting', 
    duration: '30m', 
    color: 'bg-[#DCDDFF]',
    date: '2026-08-31',
    description: 'Review study targets, weekly milestones, and assignment deadlines.',
    location: 'LearnSphere Main Stage'
  },
  { 
    id: 'evt-week-tue',
    day: 'Tue', 
    time: '01:00 PM', 
    title: 'Flutter Basics', 
    type: 'Course', 
    duration: '3h', 
    color: 'bg-card-pink',
    date: '2026-09-01',
    description: 'Core state management with Provider and widget tree rendering lifecycle.',
    courseTitle: 'Flutter & Dart Complete Masterclass',
    location: 'Lab Room B'
  },
  { 
    id: 'evt-week-wed',
    day: 'Wed', 
    time: '09:00 AM', 
    title: 'Design Review', 
    type: 'Design', 
    duration: '1h', 
    color: 'bg-[#B2F0D1]',
    date: '2026-09-02',
    description: 'Critique and heuristic evaluation of student prototype submissions.',
    location: 'Design Studio 2'
  },
  { 
    id: 'evt-week-thu',
    day: 'Thu', 
    time: '03:00 PM', 
    title: 'Networking 101', 
    type: 'Webinar', 
    duration: '45m', 
    color: 'bg-card-yellow',
    date: '2026-09-03',
    description: 'Industry guest lecture on tech recruiter outreach and portfolio positioning.',
    location: 'Webinar Hall 2'
  },
  { 
    id: 'evt-week-fri',
    day: 'Fri', 
    time: '11:00 AM', 
    title: 'Tech Talk', 
    type: 'Call', 
    duration: '1h', 
    color: 'bg-[#DCDDFF]',
    date: '2026-09-04',
    description: 'Deep dive into module federation, shared dependencies, and microfrontends.',
    location: 'Virtual Classroom 1'
  },
];

function generateMockEvents(date: number | null, year: number = 2026, month: number = 9): ScheduledEvent[] {
  if (!date) return [];
  const events: ScheduledEvent[] = [];
  const monthStr = String(month).padStart(2, '0');
  const dayStr = String(date).padStart(2, '0');
  const dateStr = `${year}-${monthStr}-${dayStr}`;
  
  if (date % 3 === 0 || date === 4 || date === 24) {
    events.push({ 
      id: `m-sync-${date}`,
      time: '09:00 AM', 
      duration: '45m', 
      title: 'Morning Sync', 
      type: 'Meeting',
      color: 'bg-card-pink',
      date: dateStr,
      description: 'Daily team alignment on sprint deliverables and blocker resolution.'
    });
  }
  if (date % 5 === 0 || date === 4 || date === 24) {
    events.push({ 
      id: `m-deep-${date}`,
      time: '01:00 PM', 
      duration: '1h 30m', 
      title: 'Deep Work Session', 
      type: 'Course',
      color: 'bg-card-yellow',
      date: dateStr,
      description: 'Focused coding and architectural practice session with TA support.'
    });
  }
  if (date % 7 === 0 || date === 24) {
    events.push({ 
      id: `m-review-${date}`,
      time: '04:30 PM', 
      duration: '1h', 
      title: 'Project Review', 
      type: 'Design',
      color: 'bg-card-green',
      date: dateStr,
      description: 'Comprehensive code and design critique before weekly submission.'
    });
  }
  if (events.length === 0) {
    events.push({ 
      id: `m-catchup-${date}`,
      time: '10:00 AM', 
      duration: '30m', 
      title: 'Quick Catch Up', 
      type: 'Call',
      color: 'bg-[#DCDDFF]',
      date: dateStr,
      description: '1-on-1 check-in on course progress and study goals.'
    });
  }
  return events;
}

function NewEventModal({ 
  isOpen, 
  onClose,
  onAddEvent 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onAddEvent: (evt: ScheduledEvent) => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-04');
  const [time, setTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('1h');
  const [type, setType] = useState('Live Course');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const colors: Record<string, string> = {
      'Live Course': 'bg-[#DCDDFF]',
      'Design Sync': 'bg-card-pink',
      'Mentorship': 'bg-card-yellow',
      'Webinar': 'bg-[#B2F0D1]',
    };

    const newEvt: ScheduledEvent = {
      id: `evt-custom-${Date.now()}`,
      title: title.trim(),
      date: date || '2026-09-04',
      time: time || '10:00 AM',
      duration: duration || '1h',
      type: type,
      color: colors[type] || 'bg-[#DCDDFF]',
      description: `Custom scheduled session: ${title}`,
      location: 'LearnSphere Virtual Classroom'
    };

    onAddEvent(newEvt);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1B1B1B]/40 backdrop-blur-sm px-4 animate-fade-in">
      <div className="bg-white rounded-[40px] w-full max-w-[500px] p-8 md:p-10 shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 text-[#848484] hover:text-[#1B1B1B] transition-colors bg-black/5 hover:bg-black/10 rounded-full p-2 focus:outline-none cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="text-[28px] font-bold text-[#1B1B1B] mb-8">Schedule Lesson / Event</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
           <div>
              <label className="text-[13px] font-bold text-[#848484] uppercase tracking-wider mb-2 block">Lesson / Event Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced State Management Workshop" 
                required
                className="w-full bg-[#f4f4f4] border border-transparent rounded-[20px] px-5 py-4 text-[16px] font-medium text-[#1B1B1B] focus:border-black/10 focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 transition-all" 
              />
           </div>
           
           <div className="flex gap-4">
              <div className="flex-1">
                 <label className="text-[13px] font-bold text-[#848484] uppercase tracking-wider mb-2 block">Date</label>
                 <input 
                   type="date" 
                   value={date}
                   onChange={(e) => setDate(e.target.value)}
                   className="w-full bg-[#f4f4f4] border border-transparent rounded-[20px] px-5 py-4 text-[15px] font-medium text-[#1B1B1B] focus:border-black/10 focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 transition-all" 
                 />
              </div>
              <div className="flex-1">
                 <label className="text-[13px] font-bold text-[#848484] uppercase tracking-wider mb-2 block">Time</label>
                 <input 
                   type="text" 
                   value={time}
                   onChange={(e) => setTime(e.target.value)}
                   placeholder="10:00 AM"
                   className="w-full bg-[#f4f4f4] border border-transparent rounded-[20px] px-5 py-4 text-[15px] font-medium text-[#1B1B1B] focus:border-black/10 focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 transition-all" 
                 />
              </div>
           </div>

           <div className="flex gap-4">
              <div className="flex-1">
                 <label className="text-[13px] font-bold text-[#848484] uppercase tracking-wider mb-2 block">Duration</label>
                 <select 
                   value={duration}
                   onChange={(e) => setDuration(e.target.value)}
                   className="w-full bg-[#f4f4f4] border border-transparent rounded-[20px] px-5 py-4 text-[15px] font-medium text-[#1B1B1B] focus:border-black/10 focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 transition-all cursor-pointer"
                 >
                    <option value="30m">30 minutes</option>
                    <option value="45m">45 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="1h 30m">1.5 hours</option>
                    <option value="2h">2 hours</option>
                    <option value="3h">3 hours</option>
                 </select>
              </div>
              <div className="flex-1">
                 <label className="text-[13px] font-bold text-[#848484] uppercase tracking-wider mb-2 block">Event Type</label>
                 <select 
                   value={type}
                   onChange={(e) => setType(e.target.value)}
                   className="w-full bg-[#f4f4f4] border border-transparent rounded-[20px] px-5 py-4 text-[15px] font-medium text-[#1B1B1B] focus:border-black/10 focus:bg-white focus:outline-none focus:ring-4 focus:ring-black/5 transition-all cursor-pointer"
                 >
                    <option value="Live Course">Live Course</option>
                    <option value="Design Sync">Design Sync</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Webinar">Webinar</option>
                 </select>
              </div>
           </div>
           
           <button 
             type="submit" 
             className="w-full bg-[#1B1B1B] text-white py-4 rounded-[20px] text-[16px] font-bold mt-2 hover:bg-[#1B1B1B]/90 transition-colors hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
           >
              Add to Schedule
           </button>
        </form>
      </div>
    </div>
  );
}

export default function Calendar() {
  const [view, setView] = useState<'Today' | 'Week' | 'Month'>('Today');
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // September (0-indexed: 8)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<number | null>(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scheduled events state with persistence
  const [allEvents, setAllEvents] = useState<ScheduledEvent[]>(() => {
    try {
      const saved = localStorage.getItem('learnsphere_calendar_events');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_SCHEDULE_EVENTS;
  });

  const handleAddEvent = (newEvent: ScheduledEvent) => {
    setAllEvents((prev) => {
      const updated = [newEvent, ...prev];
      try {
        localStorage.setItem('learnsphere_calendar_events', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(`Added "${newEvent.title}" to your schedule!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const prevAction = () => {
     if (view === 'Month') {
       if (currentMonthIndex === 0) {
         setCurrentMonthIndex(11);
         setCurrentYear(y => y - 1);
       } else {
         setCurrentMonthIndex(prev => prev - 1);
       }
     } else if (view === 'Today') {
       setSelectedDate(prev => prev && prev > 1 ? prev - 1 : 30);
     } else if (view === 'Week') {
       setSelectedDate(prev => prev && prev > 7 ? prev - 7 : 30);
     }
  };

  const nextAction = () => {
     if (view === 'Month') {
       if (currentMonthIndex === 11) {
         setCurrentMonthIndex(0);
         setCurrentYear(y => y + 1);
       } else {
         setCurrentMonthIndex(prev => prev + 1);
       }
     } else if (view === 'Today') {
       setSelectedDate(prev => prev && prev < 30 ? prev + 1 : 1);
     } else if (view === 'Week') {
       setSelectedDate(prev => prev && prev < 24 ? prev + 7 : 1);
     }
  };

  // Quick 1-click export of the entire calendar
  const handleQuickExportICS = () => {
    try {
      const icsString = generateICSContent(allEvents, {
        calendarName: 'LearnSphere LMS Schedule',
        calendarDescription: 'Scheduled lessons and study sessions from LearnSphere LMS',
      });
      downloadICSFile(`LearnSphere-Schedule-${new Date().toISOString().slice(0, 10)}.ics`, icsString);
      showToast('LearnSphere-Schedule.ics downloaded! Ready for Google Calendar, Apple iCal, or Outlook.');
    } catch (err) {
      console.error('Error exporting calendar:', err);
    }
  };

  // Quick single event export
  const handleExportSingleEvent = (e: React.MouseEvent, evt: ScheduledEvent) => {
    e.stopPropagation();
    try {
      const icsString = generateICSContent([evt], {
        calendarName: evt.title,
        calendarDescription: evt.description || `Lesson session for ${evt.title}`,
      });
      const safeTitle = evt.title.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
      downloadICSFile(`${safeTitle}.ics`, icsString);
      showToast(`Exported "${evt.title}.ics" for calendar sync!`);
    } catch (err) {
      console.error('Error exporting single event:', err);
    }
  };

  const getSubHeader = () => {
    if (view === 'Today') return `${MONTHS[currentMonthIndex]} ${selectedDate}, ${currentYear}`;
    if (view === 'Week') {
      const end = (selectedDate || 1) + 6 > 30 ? ((selectedDate || 1) + 6) % 30 : (selectedDate || 1) + 6;
      return `${MONTHS[currentMonthIndex].substring(0, 3)} ${selectedDate} - ${MONTHS[currentMonthIndex].substring(0, 3)} ${end}, ${currentYear}`;
    }
    return `30 Days, ${allEvents.length} Events Scheduled`;
  };

  const getHeader = () => {
    if (view === 'Today') return "Today's Agenda";
    if (view === 'Week') return "This Week";
    return `${MONTHS[currentMonthIndex]} ${currentYear}`;
  };

  // Filter events based on view
  const currentViewEvents = useMemo(() => {
    if (view === 'Today') {
      return allEvents.filter(e => e.day === 'Today' || e.date === '2026-09-04');
    }
    if (view === 'Week') {
      return allEvents.filter(e => e.day && e.day !== 'Today');
    }
    return allEvents;
  }, [view, allEvents]);

  const monthSelectedEvents = useMemo(() => {
    return generateMockEvents(selectedDate, currentYear, currentMonthIndex + 1);
  }, [selectedDate, currentYear, currentMonthIndex]);

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] bg-[#1B1B1B] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 animate-fade-in text-[13px] font-medium">
          <CalendarCheck size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <NewEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddEvent={handleAddEvent}
      />

      <ExportCalendarModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        events={allEvents}
        currentView={view}
        selectedDateStr={`${MONTHS[currentMonthIndex]} ${selectedDate}, ${currentYear}`}
      />

      <main className="flex-1 flex flex-col pt-10 xl:pt-[54px] px-6 md:px-[60px] xl:px-16 w-full min-w-0 pb-10">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-[50px]">
          <div>
            <h1 className="text-[52px] md:text-[68px] xl:text-[76px] font-semibold tracking-tight leading-[1] text-[#1B1B1B]">
              Schedule
            </h1>
            <p className="text-[15px] text-[#848484] mt-2 font-medium">
              Synchronize live classes, mentoring calls, and study sessions with your personal calendar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             {/* Export .ics Button */}
             <button 
               type="button"
               id="export-calendar-ics-btn"
               onClick={() => setIsExportModalOpen(true)} 
               className="bg-white hover:bg-black/5 text-[#1B1B1B] border border-black/10 px-5 py-3 rounded-full text-[14px] font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
               title="Export schedule as .ics file for Google Calendar, Apple Calendar, or Outlook"
             >
               <Download size={16} className="text-[#1B1B1B]" />
               <span>Export .ics</span>
             </button>

             {/* Add Event Button */}
             <button 
               type="button"
               onClick={() => setIsModalOpen(true)} 
               className="bg-[#1B1B1B] hover:bg-black text-white px-6 py-3 rounded-full text-[14px] font-bold shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
             >
               <Plus size={17} /> 
               <span>New Event</span>
             </button>

             {/* View Switcher Pills */}
             <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-black/5 overflow-x-auto scrollbar-hide">
               <button 
                 type="button"
                 onClick={() => setView('Today')} 
                 className={`px-6 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
                   view === 'Today' ? 'bg-[#E8E1F5] text-[#1B1B1B]' : 'text-[#848484] hover:text-[#1B1B1B]'
                 }`}
               >
                 Today
               </button>
               <button 
                 type="button"
                 onClick={() => setView('Week')} 
                 className={`px-6 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
                   view === 'Week' ? 'bg-[#E8E1F5] text-[#1B1B1B]' : 'text-[#848484] hover:text-[#1B1B1B]'
                 }`}
               >
                 Week
               </button>
               <button 
                 type="button"
                 onClick={() => setView('Month')} 
                 className={`px-6 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
                   view === 'Month' ? 'bg-[#E8E1F5] text-[#1B1B1B]' : 'text-[#848484] hover:text-[#1B1B1B]'
                 }`}
               >
                 Month
               </button>
             </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <div className="bg-white rounded-[40px] px-6 md:px-10 py-10 shadow-sm border border-black/5 min-h-[600px] flex-1 w-full overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div className="flex items-center gap-5">
                <div className="w-[64px] h-[64px] bg-[#E8E1F5] rounded-[22px] flex items-center justify-center text-[#1B1B1B] shrink-0">
                  <CalendarIcon size={26} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[26px] font-semibold text-[#1B1B1B] truncate">
                    {getHeader()}
                  </h2>
                  <p className="text-[#848484] font-medium text-[15px] truncate">
                    {getSubHeader()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                 {/* Quick .ics export button right on the header */}
                 <button 
                   type="button"
                   onClick={handleQuickExportICS}
                   className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-black/10 hover:bg-black/5 text-[#1B1B1B] text-[13px] font-bold transition-colors cursor-pointer"
                   title="Quick download all lessons as .ics file"
                 >
                   <Download size={14} />
                   <span>Download .ics</span>
                 </button>

                 <div className="flex gap-2">
                   <button 
                     type="button"
                     onClick={prevAction} 
                     className="w-11 h-11 rounded-full border-2 border-black/5 flex items-center justify-center hover:bg-black/5 text-[#1B1B1B] transition-colors cursor-pointer"
                     aria-label="Previous date range"
                   >
                      <ChevronLeft size={20} />
                   </button>
                   <button 
                     type="button"
                     onClick={nextAction} 
                     className="w-11 h-11 rounded-full border-2 border-black/5 flex items-center justify-center hover:bg-black/5 text-[#1B1B1B] transition-colors cursor-pointer"
                     aria-label="Next date range"
                   >
                      <ChevronRight size={20} />
                   </button>
                 </div>
              </div>
            </div>

            {view === 'Month' ? (
              <MonthGrid 
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate} 
              />
            ) : (
              <div className="flex flex-col gap-8">
                {currentViewEvents.length === 0 ? (
                  <div className="text-center py-16 text-[#848484] text-[15px]">
                    No scheduled sessions for this period. Click "New Event" to schedule one!
                  </div>
                ) : (
                  currentViewEvents.map((session, i) => (
                    <div key={session.id || i} className="flex relative z-10 items-stretch group">
                      {/* Left Column Text */}
                      <div className="flex flex-col items-start md:items-end w-[80px] shrink-0 pt-0 md:pt-[34px]">
                        {session.day && (
                          <div className="text-[16px] font-bold text-[#1B1B1B] mb-1 mr-0 md:mr-4">
                            {session.day}
                          </div>
                        )}
                        <div className="mr-0 md:mr-4 pr-2 md:pr-0">
                            <span className="text-[15px] font-bold text-[#848484] tracking-tight">{session.time.split(' ')[0]}</span>
                            <span className="text-[12px] font-semibold text-[#848484] ml-1">{session.time.split(' ')[1]}</span>
                        </div>
                      </div>
                      
                      {/* Timeline Divider and Dot */}
                      <div className="flex flex-col items-center w-[40px] shrink-0 relative">
                         <div className="absolute top-0 bottom-[-40px] w-[2px] bg-black/5 z-0"></div>
                         <div className={`w-[14px] h-[14px] rounded-full ${(session.color || 'bg-card-pink').replace('bg-', 'bg-')} shadow-[0_0_0_6px_white] relative z-10 md:mt-[38px] mt-1 shrink-0`}></div>
                      </div>

                      {/* Card Content */}
                      <div className={`flex-1 w-full ${session.color || 'bg-[#FAF9F6]'} rounded-[32px] p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:shadow-md transition-all cursor-pointer min-w-0 border-2 border-transparent hover:border-black/5 ml-4 md:ml-0`}>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5 mb-3">
                            <span className="bg-white/90 px-3.5 py-1 rounded-[10px] text-[12px] font-bold text-[#1B1B1B] shadow-2xs whitespace-nowrap">
                              {session.type}
                            </span>
                            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1B1B1B] opacity-80 whitespace-nowrap">
                              <Clock size={15} /> {session.duration}
                            </span>
                            {session.courseTitle && (
                              <span className="text-[12px] text-[#1B1B1B]/70 font-medium truncate max-w-[200px] hidden sm:inline">
                                • {session.courseTitle}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-[20px] md:text-[23px] font-bold text-[#1B1B1B] leading-tight break-words">
                            {session.title}
                          </h3>
                          
                          {session.description && (
                            <p className="text-[13px] text-[#1B1B1B]/75 mt-1 line-clamp-1 max-w-xl">
                              {session.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Right controls: Export .ics, Google Cal & Action button */}
                        <div className="flex items-center justify-between xl:justify-end gap-3 w-full xl:w-auto shrink-0 mt-2 xl:mt-0">
                          {/* Single-lesson .ics export button */}
                          <button
                            type="button"
                            onClick={(e) => handleExportSingleEvent(e, session)}
                            className="px-3 py-2 rounded-full bg-white/90 hover:bg-white text-[#1B1B1B] text-[12px] font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105"
                            title="Export this lesson as .ics file"
                          >
                            <Download size={14} />
                            <span className="hidden sm:inline">.ics</span>
                          </button>

                          {/* Quick Google Calendar link */}
                          <a
                            href={generateGoogleCalendarUrl(session)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-2 rounded-full bg-white/90 hover:bg-white text-[#1B1B1B] text-[12px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer hover:scale-105"
                            title="Add directly to Google Calendar"
                          >
                            <span className="hidden sm:inline">G-Cal</span>
                            <ExternalLink size={13} />
                          </a>

                          <div className="flex -space-x-[12px]">
                            <img src={`https://randomuser.me/api/portraits/women/${10 + i}.jpg`} className="w-[38px] h-[38px] rounded-full border-[2.5px] border-white object-cover shadow-xs" alt="Attendee" />
                            <img src={`https://randomuser.me/api/portraits/men/${30 + i}.jpg`} className="w-[38px] h-[38px] rounded-full border-[2.5px] border-white object-cover shadow-xs" alt="Attendee" />
                          </div>

                          <button 
                            type="button"
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1B1B1B] hover:scale-105 transition-transform shadow-md cursor-pointer"
                            title="Join video session"
                          >
                            <Video size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Month view sidebar panel */}
          {view === 'Month' && selectedDate && (
             <div className="w-full xl:w-[370px] bg-white rounded-[40px] shadow-sm border border-black/5 flex-shrink-0 flex flex-col overflow-hidden">
                <div className="bg-[#1B1B1B] p-8 pb-9 text-white relative z-10">
                   <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none skew-x-12 translate-x-10"></div>
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">Selected Date</span>
                     <button
                       type="button"
                       onClick={() => {
                         const ics = generateICSContent(monthSelectedEvents, {
                           calendarName: `Schedule for ${MONTHS[currentMonthIndex]} ${selectedDate}`
                         });
                         downloadICSFile(`Schedule-${selectedDate}-${MONTHS[currentMonthIndex]}.ics`, ics);
                         showToast(`Exported ${monthSelectedEvents.length} events for ${MONTHS[currentMonthIndex]} ${selectedDate}!`);
                       }}
                       className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                       title="Export events for this day"
                     >
                       <Download size={13} />
                       <span>Export Day</span>
                     </button>
                   </div>
                   <h2 className="text-[30px] font-bold leading-[1.1] mb-1">
                     {MONTHS[currentMonthIndex]} {selectedDate}, {currentYear}
                   </h2>
                   <p className="text-white/70 font-medium text-[13px]">
                     {monthSelectedEvents.length} Scheduled Lessons & Events
                   </p>
                </div>

                <div className="p-6 flex flex-col gap-3.5 bg-white">
                   {monthSelectedEvents.map((session, i) => (
                      <div 
                        key={session.id || i} 
                        className={`p-4 rounded-[22px] ${session.color || 'bg-card-pink'} border border-transparent shadow-xs relative overflow-hidden group hover:shadow-md cursor-pointer transition-all`}
                      >
                         <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[#1B1B1B] bg-white/70 px-2.5 py-0.5 rounded-md">
                                {session.time}
                              </span>
                              <span className="text-[11px] font-semibold text-[#1B1B1B]/70">
                                {session.duration}
                              </span>
                            </div>

                            {/* Export single event */}
                            <button
                              type="button"
                              onClick={(e) => handleExportSingleEvent(e, session)}
                              className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#1B1B1B] flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                              title="Export .ics for this lesson"
                            >
                              <Download size={13} />
                            </button>
                         </div>

                         <h4 className="text-[15px] font-bold text-[#1B1B1B]">
                           {session.title}
                         </h4>
                         {session.description && (
                           <p className="text-[12px] text-[#1B1B1B]/70 mt-1 line-clamp-1">
                             {session.description}
                           </p>
                         )}
                      </div>
                   ))}

                   <div className="flex flex-col gap-2 mt-2">
                     <button 
                       type="button"
                       onClick={() => setIsExportModalOpen(true)}
                       className="w-full py-3.5 rounded-[18px] bg-[#1B1B1B] text-white text-[13px] font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                     >
                       <Download size={15} /> 
                       <span>Export Full Schedule (.ics)</span>
                     </button>

                     <button 
                       type="button"
                       onClick={() => setIsModalOpen(true)} 
                       className="w-full py-3.5 rounded-[18px] border-2 border-dashed border-black/15 text-[#1B1B1B] text-[13px] font-bold hover:border-[#1B1B1B] hover:bg-black/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                     >
                       <Plus size={16} /> 
                       <span>Schedule Call / Lesson</span>
                     </button>
                   </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </>
  );
}

function MonthGrid({ 
  selectedDate, 
  setSelectedDate 
}: { 
  selectedDate: number | null; 
  setSelectedDate: (d: number) => void;
}) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);
  const offset = 2; // Starts on Tuesday for September 2026

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
        {days.map(d => (
          <div key={d} className="text-center text-[13px] font-bold text-[#848484] uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 gap-x-2 md:gap-y-4 md:gap-x-4">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-[80px] md:h-[100px] rounded-[16px] bg-transparent"></div>
        ))}
        {dates.map((date) => {
          const isSelected = selectedDate === date;
          const isToday = date === 4;
          const hasEvent1 = date % 3 === 0 || date === 4 || date === 24;
          const hasEvent2 = date % 5 === 0 || date === 4 || date === 24;
          
          return (
            <div 
              key={date} 
              onClick={() => setSelectedDate(date)}
              className={`h-[80px] md:h-[100px] rounded-[16px] md:rounded-[20px] p-2 flex flex-col items-center justify-start transition-all cursor-pointer border-[2px] ${
                isSelected ? 'bg-[#1B1B1B] text-white border-[#1B1B1B] shadow-md scale-105 z-10 relative' : 
                isToday ? 'bg-[#E8E1F5] border-purple-300 text-[#1B1B1B] hover:border-black/20 font-bold' : 
                'bg-bg-base/30 border-black/5 text-[#1B1B1B] hover:bg-white hover:border-black/20 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-1 mt-1 md:mt-2">
                <span className={`text-[15px] font-bold ${isSelected ? 'text-white' : 'text-[#1B1B1B]'}`}>
                  {date}
                </span>
                {isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                )}
              </div>

              <div className="flex gap-1 md:gap-1.5 mt-auto mb-1 md:mb-2 flex-wrap justify-center px-1">
                {hasEvent1 && <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-card-pink'}`}></div>}
                {hasEvent2 && <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-card-yellow'}`}></div>}
                {date % 7 === 0 && <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-purple-300' : 'bg-card-green'}`}></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

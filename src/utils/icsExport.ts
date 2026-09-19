/**
 * iCalendar (.ics) RFC 5545 generator and calendar syncing utilities
 */

export interface ScheduledEvent {
  id: string;
  title: string;
  type: string; // 'Course' | 'Design' | 'Call' | 'Webinar' | 'Meeting' | 'Review' | 'Exercise'
  duration: string; // e.g. '45m', '1h', '1h 30m', '2h', '3h'
  date: string; // 'YYYY-MM-DD'
  time: string; // e.g. '09:00 AM', '02:00 PM', '14:30'
  color?: string;
  description?: string;
  location?: string;
  courseTitle?: string;
  instructor?: string;
  meetingUrl?: string;
  day?: string; // 'Mon', 'Tue', etc.
}

/**
 * Converts a duration string like '45m', '1h', '1h 30m', '2h' into minutes
 */
export function parseDurationMinutes(durationStr: string): number {
  if (!durationStr) return 60;
  
  let total = 0;
  const hoursMatch = durationStr.match(/(\d+)\s*h/i);
  const minsMatch = durationStr.match(/(\d+)\s*m/i);

  if (hoursMatch) {
    total += parseInt(hoursMatch[1], 10) * 60;
  }
  if (minsMatch) {
    total += parseInt(minsMatch[1], 10);
  }

  // If no units specified but contains a plain number, assume minutes
  if (total === 0) {
    const num = parseInt(durationStr, 10);
    return isNaN(num) ? 60 : num;
  }

  return total;
}

/**
 * Parses time strings like '09:00 AM', '2:30 PM', '14:00' into hour and minute integers (24-hour)
 */
export function parseTime(timeStr: string): { hour: number; minute: number } {
  const clean = timeStr.trim();
  const isPM = /pm/i.test(clean);
  const isAM = /am/i.test(clean);
  
  const numbers = clean.replace(/[^0-9:]/g, '').split(':');
  let hour = parseInt(numbers[0] || '9', 10);
  const minute = parseInt(numbers[1] || '0', 10);

  if (isPM && hour < 12) {
    hour += 12;
  } else if (isAM && hour === 12) {
    hour = 0;
  }

  return { hour, minute };
}

/**
 * Combines date string 'YYYY-MM-DD' and time string into a Date object
 */
export function createEventDateTime(dateStr: string, timeStr: string): { start: Date; end: Date } {
  let [year, month, day] = [2026, 9, 4]; // default safe fallback

  if (dateStr && dateStr.includes('-')) {
    const parts = dateStr.split('-').map(p => parseInt(p, 10));
    if (parts.length === 3) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    }
  }

  const { hour, minute } = parseTime(timeStr);
  const start = new Date(year, month - 1, day, hour, minute, 0);

  // default duration 60 mins if uncalculated
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return { start, end };
}

/**
 * Formats a Date object into iCalendar UTC ISO format YYYYMMDDTHHmmssZ
 */
export function formatICSDate(d: Date): string {
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Escapes characters per RFC 5545 specifications (\, ;, ,, and newlines)
 */
export function escapeICSText(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generates a full RFC 5545 compliant .ics file string
 */
export function generateICSContent(
  events: ScheduledEvent[],
  options?: {
    calendarName?: string;
    calendarDescription?: string;
  }
): string {
  const calName = options?.calendarName || 'LearnSphere Study Schedule';
  const calDesc = options?.calendarDescription || 'Scheduled lessons, webinars, and study sessions from LearnSphere LMS';
  const now = new Date();
  const dtStamp = formatICSDate(now);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LearnSphere LMS//Course Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICSText(calName)}`,
    `X-WR-CALDESC:${escapeICSText(calDesc)}`,
    'X-WR-TIMEZONE:UTC',
  ];

  events.forEach((evt) => {
    const { start } = createEventDateTime(evt.date, evt.time);
    const durationMins = parseDurationMinutes(evt.duration);
    const end = new Date(start.getTime() + durationMins * 60 * 1000);

    const uid = evt.id 
      ? `learnsphere-${evt.id.replace(/[^a-zA-Z0-9_-]/g, '')}@learnsphere.app` 
      : `learnsphere-${Math.random().toString(36).substring(2, 11)}@learnsphere.app`;

    const descriptionParts = [
      `Lesson / Session: ${evt.title}`,
      `Type: ${evt.type}`,
      `Duration: ${evt.duration}`,
    ];

    if (evt.courseTitle) {
      descriptionParts.push(`Course: ${evt.courseTitle}`);
    }
    if (evt.instructor) {
      descriptionParts.push(`Instructor: ${evt.instructor}`);
    }
    if (evt.description) {
      descriptionParts.push(`Notes: ${evt.description}`);
    }
    if (evt.meetingUrl) {
      descriptionParts.push(`Join Link: ${evt.meetingUrl}`);
    }
    descriptionParts.push('Platform: LearnSphere LMS (https://learnsphere.app)');

    const fullDescription = descriptionParts.join('\n');
    const location = evt.location || evt.meetingUrl || 'LearnSphere Virtual Classroom';

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `SUMMARY:${escapeICSText(evt.title)}`,
      `DESCRIPTION:${escapeICSText(fullDescription)}`,
      `LOCATION:${escapeICSText(location)}`,
      `CATEGORIES:${escapeICSText(evt.type.toUpperCase())},EDUCATION,LEARNSPHERE`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      // Standard 15-minute advance reminder
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${escapeICSText(evt.title)} starts in 15 minutes`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');

  // RFC 5545 requires CRLF line endings
  return lines.join('\r\n');
}

/**
 * Triggers a browser download of the generated .ics file
 */
export function downloadICSFile(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Generates a direct "Add to Google Calendar" web link for a specific event
 */
export function generateGoogleCalendarUrl(evt: ScheduledEvent): string {
  const { start } = createEventDateTime(evt.date, evt.time);
  const durationMins = parseDurationMinutes(evt.duration);
  const end = new Date(start.getTime() + durationMins * 60 * 1000);

  const startStr = formatICSDate(start);
  const endStr = formatICSDate(end);

  const title = encodeURIComponent(evt.title);
  const details = encodeURIComponent(
    `${evt.type} • Duration: ${evt.duration}\n${evt.description || 'LearnSphere LMS Scheduled Session'}\nPlatform: LearnSphere`
  );
  const location = encodeURIComponent(evt.location || 'LearnSphere Virtual Classroom');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
}

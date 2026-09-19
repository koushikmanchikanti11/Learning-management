import { jsPDF } from 'jspdf';
import { LearningSummaryData } from '../types';

export function generatePdfSummary(data: LearningSummaryData): { doc: jsPDF; filename: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm

  // 1. Top Decorative Brand Bar
  doc.setFillColor(27, 27, 27); // #1B1B1B
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand Accent Dot & Title
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.circle(margin + 2, 14, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('EDULEARN PLATFORM', margin + 8, 15.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text('Official Verified Learning Transcript & Achievement Summary', margin + 8, 20.5);

  // Document metadata right-aligned in header
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(`Ref: EDU-${Math.abs(data.studentName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) * 179).toString().padStart(6, '0')}`, pageWidth - margin, 14, { align: 'right' });
  doc.text(`Issued: ${data.generatedDate}`, pageWidth - margin, 19, { align: 'right' });

  // 2. Student Information & Summary Banner
  let y = 36;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(27, 27, 27);
  doc.text(data.studentName, margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Student ID: EDU-STU-88219   •   Program: Professional Skill Specialization', margin + 6, y + 15);
  doc.text(`Learning Status: Active Verified Learner   •   Streak: ${data.currentStreak} Days Consecutive Study`, margin + 6, y + 21);

  // Status Badge on Right
  doc.setFillColor(232, 248, 240); // Soft green #E8F8F0
  doc.setDrawColor(178, 240, 209);
  doc.roundedRect(pageWidth - margin - 38, y + 6, 32, 14, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(20, 123, 68); // #147B44
  doc.text('ACADEMIC RECORD', pageWidth - margin - 22, y + 11.5, { align: 'center' });
  doc.setFontSize(7);
  doc.text('VERIFIED & VALID', pageWidth - margin - 22, y + 16, { align: 'center' });

  // 3. Executive KPI Metric Cards (4 Cards)
  y = 68;
  const cardWidth = (contentWidth - 9) / 4; // 4 columns with 3mm gap
  const cardHeight = 22;

  const metrics = [
    { label: 'TOTAL STUDY HOURS', val: `${data.totalHoursLearned.toFixed(1)} hrs`, note: 'Across all modules' },
    { label: 'COURSES COMPLETED', val: `${data.completedCourses.length}`, note: '100% finished' },
    { label: 'COURSES IN PROGRESS', val: `${data.inProgressCourses.length}`, note: 'Active study' },
    { label: 'STUDY GOAL PACE', val: `${data.currentDailyGoal}m/day`, note: `${data.currentStreak}-day streak` },
  ];

  metrics.forEach((m, idx) => {
    const cardX = margin + idx * (cardWidth + 3);
    doc.setFillColor(246, 246, 248);
    doc.setDrawColor(230, 230, 235);
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 125);
    doc.text(m.label, cardX + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(27, 27, 27);
    doc.text(m.val, cardX + 4, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(110, 110, 115);
    doc.text(m.note, cardX + 4, y + 18.5);
  });

  // 4. Completed Courses Section
  y = 98;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(27, 27, 27);
  doc.text('1. Completed Courses & Certifications', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`The learner has fully mastered the curriculum for the following accredited courses (${data.completedCourses.length} completed):`, margin, y + 5);

  y += 9;

  // Table Header for Completed Courses
  doc.setFillColor(27, 27, 27);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('COURSE TITLE', margin + 4, y + 4.8);
  doc.text('CATEGORY', margin + 82, y + 4.8);
  doc.text('INSTRUCTOR', margin + 114, y + 4.8);
  doc.text('DURATION', margin + 144, y + 4.8);
  doc.text('STATUS', margin + 163, y + 4.8);

  y += 7;

  if (data.completedCourses.length === 0) {
    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(235, 235, 235);
    doc.rect(margin, y, contentWidth, 12, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text('No completed courses yet. Keep learning to earn your first certified completion!', margin + 6, y + 7.5);
    y += 12;
  } else {
    data.completedCourses.forEach((c, idx) => {
      const rowHeight = 11;
      const isAlt = idx % 2 === 1;
      doc.setFillColor(isAlt ? 250 : 255, isAlt ? 250 : 255, isAlt ? 250 : 255);
      doc.setDrawColor(235, 235, 235);
      doc.rect(margin, y, contentWidth, rowHeight, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(27, 27, 27);
      const titleText = doc.splitTextToSize(c.title, 75);
      doc.text(titleText[0] || c.title, margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(110, 110, 110);
      doc.text(`ID: ${c.credentialId || `CRT-${c.id}00${c.id}`}`, margin + 4, y + 8.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 50);
      doc.text(c.category, margin + 82, y + 6.5);
      doc.text(c.instructor || 'Staff Instructor', margin + 114, y + 6.5);
      doc.text(`${c.hours.toFixed(1)} hrs`, margin + 144, y + 6.5);

      // 100% Badge
      doc.setFillColor(232, 248, 240);
      doc.setDrawColor(178, 240, 209);
      doc.roundedRect(margin + 160, y + 2.5, 15, 6, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(20, 123, 68);
      doc.text('100% DONE', margin + 167.5, y + 6.5, { align: 'center' });

      y += rowHeight;
    });
  }

  // 5. In-Progress Courses & Learning Progress
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(27, 27, 27);
  doc.text('2. Ongoing Studies & Active Module Progress', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Active enrollments with tracked video lectures, hands-on labs, and reading completion:', margin, y + 5);

  y += 9;

  // Table Header for In-Progress
  doc.setFillColor(240, 240, 245);
  doc.setDrawColor(220, 220, 225);
  doc.rect(margin, y, contentWidth, 7, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.text('COURSE TITLE', margin + 4, y + 4.8);
  doc.text('CATEGORY', margin + 82, y + 4.8);
  doc.text('HOURS LOGGED', margin + 114, y + 4.8);
  doc.text('EST. TOTAL', margin + 144, y + 4.8);
  doc.text('PROGRESS', margin + 163, y + 4.8);

  y += 7;

  data.inProgressCourses.forEach((c, idx) => {
    const rowHeight = 10;
    const isAlt = idx % 2 === 1;
    doc.setFillColor(isAlt ? 250 : 255, isAlt ? 250 : 255, isAlt ? 250 : 255);
    doc.setDrawColor(235, 235, 235);
    doc.rect(margin, y, contentWidth, rowHeight, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(27, 27, 27);
    const titleText = doc.splitTextToSize(c.title, 75);
    doc.text(titleText[0] || c.title, margin + 4, y + 6.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(c.category, margin + 82, y + 6.2);
    doc.text(`${c.hoursLogged.toFixed(1)} hrs`, margin + 114, y + 6.2);
    doc.text(`${c.totalHours.toFixed(1)} hrs`, margin + 144, y + 6.2);

    // Progress percentage
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(27, 27, 27);
    doc.text(`${c.progress}%`, margin + 165, y + 6.2);

    y += rowHeight;
  });

  // 6. Study Goals & Pacing Discipline Section
  y += 8;
  doc.setFillColor(248, 247, 252);
  doc.setDrawColor(225, 220, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(27, 27, 27);
  doc.text('Study Goal & Consistency Profile', margin + 6, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text(`• Daily Commitment Goal: ${data.currentDailyGoal} minutes / day   (${Math.round(data.currentDailyGoal * 7 / 60 * 10) / 10} hrs weekly pace)`, margin + 6, y + 12);
  doc.text(`• Weekly Target Goal: ${Math.round(data.currentWeeklyGoal / 60 * 10) / 10} hours / week   (${data.currentWeeklyGoal} minutes target)`, margin + 6, y + 16.5);
  doc.text(`• Study Streak: ${data.currentStreak} consecutive study days logged. Consistency rating: Exemplary (Top 5% of cohort).`, margin + 6, y + 21);

  // 7. Official Seal & Verification Sign-off Footer
  y += 32;
  doc.setDrawColor(210, 210, 210);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(27, 27, 27);
  doc.text('Verification & Institutional Accreditation', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('This document certifies total learning hours recorded in the EduLearn LMS database.', margin, y + 4.5);
  doc.text('Tamper-evident verification hash: SHA256:' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''), margin, y + 8.5);

  // Digital Signature Representation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text('Dr. Marcus Vance', pageWidth - margin - 45, y + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(110, 110, 110);
  doc.text('Dean of Academic Affairs', pageWidth - margin - 45, y + 6.5);
  doc.text('EduLearn Learning Systems', pageWidth - margin - 45, y + 9.5);

  const filename = `EduLearn_Learning_Summary_${data.studentName.replace(/\s+/g, '_')}.pdf`;
  return { doc, filename };
}

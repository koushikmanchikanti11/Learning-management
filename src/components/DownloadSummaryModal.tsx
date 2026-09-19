import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Award, Clock, BookOpen, X, Sparkles, Printer } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { generatePdfSummary } from '../utils/generatePdfSummary';

interface DownloadSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadSummaryModal({ isOpen, onClose }: DownloadSummaryModalProps) {
  const { getLearningSummaryData } = useCourses();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const data = getLearningSummaryData();

  const handleDownload = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const { doc, filename } = generatePdfSummary(data);
      doc.save(filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    try {
      const { doc } = generatePdfSummary(data);
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } catch (err) {
      console.error("Failed to print PDF:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-black/10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-8 bg-[#1B1B1B] text-white flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                Official Transcript
              </span>
            </div>
            <h3 className="text-[24px] md:text-[28px] font-bold text-white tracking-tight">
              Learning Summary & Hours
            </h3>
            <p className="text-[13px] text-white/70 mt-1 max-w-md">
              Download your verified record of completed courses, study pacing, and accredited learning hours.
            </p>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors relative z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Key Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FAF9F6] p-3.5 rounded-[20px] border border-black/5">
              <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Clock size={13} />
                <span>Total Hours</span>
              </div>
              <div className="text-[24px] font-extrabold text-[#1B1B1B]">
                {data.totalHoursLearned.toFixed(1)}h
              </div>
              <div className="text-[11px] text-[#848484]">Logged learning</div>
            </div>

            <div className="bg-[#FAF9F6] p-3.5 rounded-[20px] border border-black/5">
              <div className="flex items-center gap-1.5 text-green-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Award size={13} />
                <span>Completed</span>
              </div>
              <div className="text-[24px] font-extrabold text-[#1B1B1B]">
                {data.completedCourses.length}
              </div>
              <div className="text-[11px] text-[#848484]">100% finished</div>
            </div>

            <div className="bg-[#FAF9F6] p-3.5 rounded-[20px] border border-black/5">
              <div className="flex items-center gap-1.5 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <BookOpen size={13} />
                <span>In Progress</span>
              </div>
              <div className="text-[24px] font-extrabold text-[#1B1B1B]">
                {data.inProgressCourses.length}
              </div>
              <div className="text-[11px] text-[#848484]">Active courses</div>
            </div>

            <div className="bg-[#FAF9F6] p-3.5 rounded-[20px] border border-black/5">
              <div className="flex items-center gap-1.5 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles size={13} />
                <span>Study Streak</span>
              </div>
              <div className="text-[24px] font-extrabold text-[#1B1B1B]">
                {data.currentStreak} Days
              </div>
              <div className="text-[11px] text-[#848484]">{data.currentDailyGoal}m daily goal</div>
            </div>
          </div>

          {/* Completed Courses Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#1B1B1B] flex items-center gap-2">
                <Award size={16} className="text-amber-600" />
                Completed Courses ({data.completedCourses.length})
              </h4>
              <span className="text-[12px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                Accredited Records
              </span>
            </div>

            {data.completedCourses.length > 0 ? (
              <div className="space-y-2.5">
                {data.completedCourses.map((c) => (
                  <div 
                    key={c.id}
                    className="p-3.5 rounded-[20px] bg-white border border-black/5 flex items-center justify-between gap-3 shadow-2xs hover:border-black/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[14px] font-bold text-[#1B1B1B] truncate">{c.title}</h5>
                        <p className="text-[12px] text-[#848484]">{c.category} • Instructor: {c.instructor || 'Staff'} • {c.hours}h credit</p>
                      </div>
                    </div>
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F8F0] text-[#147B44]">
                      100% Verified
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-[20px] bg-black/5 text-center text-[13px] text-[#848484]">
                No completed courses yet. Once you complete a course, it will appear here and in your PDF.
              </div>
            )}
          </div>

          {/* In-Progress Preview */}
          <div>
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#1B1B1B] mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              Active Ongoing Courses ({data.inProgressCourses.length})
            </h4>
            <div className="space-y-2">
              {data.inProgressCourses.slice(0, 3).map((c) => (
                <div key={c.id} className="p-3 rounded-[16px] bg-[#FAF9F6] border border-black/5 flex items-center justify-between text-[13px]">
                  <span className="font-bold text-[#1B1B1B] truncate max-w-[240px]">{c.title}</span>
                  <div className="flex items-center gap-3 text-[#848484] shrink-0 font-medium">
                    <span>{c.hoursLogged}h logged</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#1B1B1B] font-bold text-[11px]">
                      {c.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Details Notice */}
          <div className="p-4 rounded-[22px] bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
            <FileText size={20} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[12px] text-amber-900 leading-relaxed">
              <strong className="block font-bold mb-0.5">Official Download Format:</strong>
              The generated PDF includes student credentials, verification hash, course breakdown table, study pacing metrics, and academic sign-off. Suitable for employer reimbursement or LinkedIn portfolio verification.
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-[#FAF9F6] border-t border-black/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-full bg-white border border-black/10 text-[#1B1B1B] text-[13px] font-bold hover:bg-black/5 transition-colors flex items-center gap-2"
            >
              <Printer size={15} />
              <span>Print Preview</span>
            </button>
            {downloadSuccess && (
              <span className="text-[12px] font-bold text-green-700 flex items-center gap-1">
                <CheckCircle2 size={14} /> PDF Downloaded!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-[#848484] hover:text-[#1B1B1B] text-[13px] font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-full bg-[#1B1B1B] text-white text-[13px] font-bold hover:bg-black transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Download size={15} />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

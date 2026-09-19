import React, { useState, useRef } from 'react';
import { Award, Download, Printer, Check, X, Share2, Sparkles, User, ExternalLink, ShieldCheck } from 'lucide-react';
import { Course } from '../types';
import { useCourses } from '../context/CourseContext';

interface CertificateModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ course, isOpen, onClose }: CertificateModalProps) {
  const { studentName, setStudentName } = useCourses();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(studentName);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const certificateId = `RA-2026-${String(course.id).padStart(3, '0')}-9841`;
  const completionDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const instructorName = course.instructor || 'David Anderson';

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setStudentName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify/${certificateId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  /**
   * Generates a high-res PNG download of the certificate using HTML5 Canvas
   */
  const handleDownloadImage = () => {
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 1600;
      const height = 1100;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsDownloading(false);
        return;
      }

      // Background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.5, '#FBFBFB');
      gradient.addColorStop(1, '#F7F6F2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Outer Decorative Border
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#1B1B1B';
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Inner Gold/Accent Border
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#D4AF37';
      ctx.strokeRect(60, 60, width - 120, height - 120);

      // Corner embellishments
      const cornerSize = 40;
      ctx.fillStyle = '#D4AF37';
      // Top-left
      ctx.fillRect(60, 60, cornerSize, cornerSize);
      // Top-right
      ctx.fillRect(width - 60 - cornerSize, 60, cornerSize, cornerSize);
      // Bottom-left
      ctx.fillRect(60, height - 60 - cornerSize, cornerSize, cornerSize);
      // Bottom-right
      ctx.fillRect(width - 60 - cornerSize, height - 60 - cornerSize, cornerSize, cornerSize);

      // Watermark Crest in background
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.fillStyle = '#1B1B1B';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 280, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Header Academy Brand
      ctx.textAlign = 'center';
      ctx.fillStyle = '#848484';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('REMIX LEARNING ACADEMY', width / 2, 170);

      // Title
      ctx.fillStyle = '#1B1B1B';
      ctx.font = 'bold 54px Georgia, serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('Certificate of Completion', width / 2, 250);

      // Subtitle
      ctx.fillStyle = '#666666';
      ctx.font = 'italic 24px Georgia, serif';
      ctx.letterSpacing = '0px';
      ctx.fillText('This is proudly awarded to', width / 2, 330);

      // Student Name
      ctx.fillStyle = '#1B1B1B';
      ctx.font = 'bold 64px Georgia, serif';
      ctx.fillText(studentName, width / 2, 430);

      // Line under name
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#D4AF37';
      ctx.beginPath();
      ctx.moveTo(width / 2 - 250, 460);
      ctx.lineTo(width / 2 + 250, 460);
      ctx.stroke();

      // Description text
      ctx.fillStyle = '#555555';
      ctx.font = '24px system-ui, sans-serif';
      ctx.fillText('for successfully completing the curriculum and demonstrating verified mastery in', width / 2, 530);

      // Course Title
      ctx.fillStyle = '#1B1B1B';
      ctx.font = 'bold 44px system-ui, sans-serif';
      ctx.fillText(course.title, width / 2, 610);

      // Category and honors badge
      ctx.fillStyle = '#777777';
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillText(`Specialization: ${course.category} • Grade: Passed with Distinction (100%)`, width / 2, 665);

      // Gold Seal Badge in center bottom
      const sealX = width / 2;
      const sealY = 820;

      // Outer gold circle
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(sealX, sealY, 65, 0, Math.PI * 2);
      ctx.fill();

      // Inner ring
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 55, 0, Math.PI * 2);
      ctx.stroke();

      // Seal text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('VERIFIED', sealX, sealY - 8);
      ctx.fillText('EXCELLENCE', sealX, sealY + 16);

      // Signatures
      // Left: Instructor
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1B1B1B';
      ctx.font = 'italic bold 32px "Brush Script MT", cursive, serif';
      ctx.fillText(instructorName, 320, 840);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#BBBBBB';
      ctx.beginPath();
      ctx.moveTo(180, 860);
      ctx.lineTo(460, 860);
      ctx.stroke();

      ctx.fillStyle = '#1B1B1B';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText(instructorName, 320, 890);
      ctx.fillStyle = '#848484';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Lead Instructor', 320, 915);

      // Right: Dean of Academic Affairs
      ctx.fillStyle = '#1B1B1B';
      ctx.font = 'italic bold 32px "Brush Script MT", cursive, serif';
      ctx.fillText('Dr. Sophia Vanderbilt', width - 320, 840);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#BBBBBB';
      ctx.beginPath();
      ctx.moveTo(width - 460, 860);
      ctx.lineTo(width - 180, 860);
      ctx.stroke();

      ctx.fillStyle = '#1B1B1B';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('Dr. Sophia Vanderbilt', width - 320, 890);
      ctx.fillStyle = '#848484';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Director of Academic Affairs', width - 320, 915);

      // Footer Meta
      ctx.textAlign = 'left';
      ctx.fillStyle = '#848484';
      ctx.font = '15px monospace';
      ctx.fillText(`Certificate ID: ${certificateId}`, 100, 1020);
      ctx.fillText(`Issued: ${completionDate}`, 100, 1045);

      ctx.textAlign = 'right';
      ctx.fillText(`Verified via Remix Academic Credential Registry`, width - 100, 1045);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Certificate-${course.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating certificate image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[36px] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-black/10 overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-black/5 bg-[#FBFBFB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
              <Award size={22} />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1B1B1B]">Official Course Certificate</h3>
              <p className="text-[13px] font-medium text-[#848484]">Verified credential of 100% course completion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1B1B1B] transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Recipient Name Customizer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[22px] bg-[#F7F6F2] border border-black/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1B1B1B] shadow-sm">
                <User size={18} />
              </div>
              <div>
                <span className="text-[12px] font-bold text-[#848484] uppercase tracking-wider block">Awarded To</span>
                <span className="text-[16px] font-bold text-[#1B1B1B]">{studentName}</span>
              </div>
            </div>

            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 w-full sm:w-auto">
                <input 
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter full name"
                  className="px-4 py-2 rounded-full border border-black/20 text-[14px] font-semibold text-[#1B1B1B] outline-none focus:border-[#1B1B1B]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B1B1B] text-white rounded-full text-[13px] font-bold shadow-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-3 py-2 text-[13px] font-semibold text-[#848484]"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setNameInput(studentName);
                  setIsEditingName(true);
                }}
                className="text-[13px] font-bold text-[#1B1B1B] underline hover:opacity-80"
              >
                Change Name
              </button>
            )}
          </div>

          {/* Certificate Preview Card */}
          <div 
            ref={certRef}
            id="printable-certificate"
            className="relative bg-gradient-to-b from-[#FFFFFF] via-[#FCFBF8] to-[#F7F6F2] rounded-[28px] p-6 sm:p-12 border-[8px] border-[#1B1B1B] shadow-xl text-center overflow-hidden"
          >
            {/* Inner Gold Inset Frame */}
            <div className="absolute inset-3 border-2 border-[#D4AF37] pointer-events-none rounded-[18px]"></div>

            {/* Corner Blocks */}
            <div className="absolute top-3 left-3 w-6 h-6 bg-[#D4AF37]"></div>
            <div className="absolute top-3 right-3 w-6 h-6 bg-[#D4AF37]"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 bg-[#D4AF37]"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 bg-[#D4AF37]"></div>

            {/* Certificate Header */}
            <div className="mb-6 relative z-10">
              <div className="flex items-center justify-center gap-2 text-[#848484] text-[12px] font-extrabold tracking-[0.25em] uppercase mb-3">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span>Remix Learning Academy</span>
                <Sparkles size={14} className="text-[#D4AF37]" />
              </div>
              <h2 className="text-[28px] sm:text-[42px] font-bold text-[#1B1B1B] tracking-tight font-serif">
                Certificate of Completion
              </h2>
              <p className="text-[#848484] italic text-[15px] sm:text-[17px] font-serif mt-1">
                This verified credential is proud to certify that
              </p>
            </div>

            {/* Recipient Display */}
            <div className="my-6 relative z-10">
              <span className="text-[32px] sm:text-[48px] font-extrabold text-[#1B1B1B] font-serif tracking-wide block pb-2">
                {studentName}
              </span>
              <div className="w-48 h-[2px] bg-[#D4AF37] mx-auto mb-4"></div>
              <p className="text-[14px] sm:text-[15px] text-[#555] max-w-xl mx-auto leading-relaxed">
                has successfully completed all lecture coursework, applied projects, and assessment modules with outstanding achievement in
              </p>
            </div>

            {/* Course Title */}
            <div className="my-4 relative z-10">
              <h3 className="text-[22px] sm:text-[30px] font-extrabold text-[#1B1B1B] max-w-2xl mx-auto leading-snug">
                {course.title}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="bg-[#B2F0D1] text-green-900 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase inline-flex items-center gap-1">
                  <ShieldCheck size={13} /> Verified Completion
                </span>
                <span className="text-[12px] font-bold text-[#848484]">
                  • {course.category}
                </span>
              </div>
            </div>

            {/* Bottom Seal and Signatures */}
            <div className="mt-10 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
              {/* Instructor signature */}
              <div className="text-center sm:text-left">
                <div className="text-[24px] font-serif italic font-bold text-[#1B1B1B] leading-none mb-1">
                  {instructorName}
                </div>
                <div className="w-36 h-[1.5px] bg-black/20 my-1 mx-auto sm:mx-0"></div>
                <p className="text-[12px] font-bold text-[#1B1B1B]">{instructorName}</p>
                <p className="text-[11px] text-[#848484]">Lead Instructor</p>
              </div>

              {/* Gold Seal Badge */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#AA820A] p-1 shadow-lg flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center text-white text-center p-1">
                  <Award size={22} className="mb-0.5" />
                  <span className="text-[9px] font-extrabold uppercase tracking-widest leading-tight">Official</span>
                  <span className="text-[8px] font-bold tracking-wider opacity-90">Verified</span>
                </div>
              </div>

              {/* Academic Director signature */}
              <div className="text-center sm:text-right">
                <div className="text-[24px] font-serif italic font-bold text-[#1B1B1B] leading-none mb-1">
                  Dr. S. Vanderbilt
                </div>
                <div className="w-36 h-[1.5px] bg-black/20 my-1 mx-auto sm:ml-auto"></div>
                <p className="text-[12px] font-bold text-[#1B1B1B]">Dr. Sophia Vanderbilt</p>
                <p className="text-[11px] text-[#848484]">Academic Dean</p>
              </div>
            </div>

            {/* Certificate ID & Metadata Footer */}
            <div className="mt-8 pt-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#848484] font-mono gap-2 relative z-10">
              <span>ID: {certificateId}</span>
              <span>Issued: {completionDate}</span>
              <span className="hidden sm:inline">remix-academy.edu/verify</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 sm:px-8 py-5 bg-[#FBFBFB] border-t border-black/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-full border border-black/10 bg-white hover:bg-black/5 text-[13px] font-bold text-[#1B1B1B] shadow-sm flex items-center gap-2 transition-colors"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
              <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-full border border-black/10 bg-white hover:bg-black/5 text-[13px] font-bold text-[#1B1B1B] shadow-sm flex items-center gap-2 transition-colors"
            >
              <Printer size={16} />
              <span>Print / PDF</span>
            </button>
          </div>

          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="px-7 py-3 rounded-full bg-[#1B1B1B] hover:bg-black text-white text-[14px] font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2.5"
          >
            <Download size={17} />
            <span>{isDownloading ? 'Generating...' : 'Download Certificate (PNG)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

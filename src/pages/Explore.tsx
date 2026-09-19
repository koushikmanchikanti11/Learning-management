import React, { useState, useMemo } from 'react';
import { Grid, Laptop, MonitorPlay, Briefcase, Box, User, Code, Palette, DollarSign, Megaphone } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { ALL_COURSES } from '../constants/courses';
import ExploreFilters from '../components/ExploreFilters';
import { useCourses } from '../context/CourseContext';

export default function Explore() {
  const [filter, setFilter] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [onlySaved, setOnlySaved] = useState(false);
  const { isCourseSaved, getProgress } = useCourses();

  const filteredCourses = useMemo(() => {
    return ALL_COURSES.filter((course) => {
      // Category filter
      const matchesCategory = filter === 'All' || course.category === filter;

      // Tag filter (specifically handles 'Design', 'Development', 'Business', etc.)
      const matchesTag =
        selectedTag === 'All' ||
        (course.tags && course.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) ||
        course.topic.toLowerCase() === selectedTag.toLowerCase() ||
        course.category.toLowerCase().includes(selectedTag.toLowerCase());

      // Saved filter
      const matchesSaved = !onlySaved || isCourseSaved(course.id);

      // Status/Progress filter
      const progress = getProgress(course.id);
      let matchesStatus = true;
      if (statusFilter === 'In Progress') {
        matchesStatus = progress > 0 && progress < 100;
      } else if (statusFilter === 'Completed') {
        matchesStatus = progress === 100;
      } else if (statusFilter === 'Not Started') {
        matchesStatus = progress === 0;
      }

      return matchesCategory && matchesTag && matchesSaved && matchesStatus;
    });
  }, [filter, selectedTag, statusFilter, onlySaved, isCourseSaved, getProgress]);

  const handleResetFilters = () => {
    setFilter('All');
    setSelectedTag('All');
    setStatusFilter('All');
    setOnlySaved(false);
  };

  return (
    <main className="flex-1 flex flex-col pt-10 xl:pt-[54px] px-6 md:px-[60px] xl:px-16 w-full min-w-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-[52px] md:text-[68px] xl:text-[76px] font-semibold tracking-tight leading-[1] mb-3 text-[#1B1B1B]">
            Explore new skills
          </h1>
          <p className="text-[16px] text-[#848484] font-medium max-w-[600px]">
            Discover expert-led masterclasses, industry certifications, and interactive workshops.
          </p>
        </div>
      </div>

      {/* Top category navigation */}
      <div className="flex flex-nowrap flex-shrink-0 items-center gap-4 md:gap-[22px] mb-8 overflow-x-auto py-[10px] min-h-[70px] scrollbar-hide w-auto -mx-6 px-6 md:-mx-[60px] md:px-[60px] xl:-mx-16 xl:px-16">
         <FilterPill icon={<Grid size={20} fill="currentColor" />} label="All Categories" active={filter === 'All'} onClick={() => setFilter('All')} />
         <FilterPill icon={<Palette size={20} strokeWidth={2} />} label="Design" active={filter === 'Design'} onClick={() => setFilter('Design')} />
         <FilterPill icon={<Code size={20} strokeWidth={2} />} label="Programming" active={filter === 'Programming'} onClick={() => setFilter('Programming')} />
         <FilterPill icon={<Megaphone size={20} strokeWidth={2} />} label="Marketing" active={filter === 'Marketing'} onClick={() => setFilter('Marketing')} />
         <FilterPill icon={<MonitorPlay size={20} strokeWidth={2} />} label="Media Training" active={filter === 'Media Training'} onClick={() => setFilter('Media Training')} />
         <FilterPill icon={<Briefcase size={20} strokeWidth={2} />} label="Business" active={filter === 'Business'} onClick={() => setFilter('Business')} />
      </div>

      {/* Dedicated Filter Component for Tags (Design, Development, Business, etc.) & Status */}
      <ExploreFilters 
        selectedTag={selectedTag}
        onSelectTag={(tag) => setSelectedTag(tag)}
        statusFilter={statusFilter}
        onSelectStatus={(status) => setStatusFilter(status)}
        onlySaved={onlySaved}
        onToggleOnlySaved={() => setOnlySaved(!onlySaved)}
        onReset={handleResetFilters}
        totalResults={filteredCourses.length}
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#848484] text-[15px] font-semibold tracking-wide uppercase">
          {selectedTag !== 'All' 
            ? `Tag: #${selectedTag}` 
            : filter !== 'All' 
            ? `${filter} Courses` 
            : 'All Courses'}
        </h2>
        <span className="text-[14px] font-bold text-[#1B1B1B]/60">
          Showing {filteredCourses.length} of {ALL_COURSES.length} courses
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7 lg:gap-[30px]">
        {filteredCourses.map((course) => (
          <CourseCard 
            key={course.id}
            id={course.id}
            title={course.title}
            category={course.category}
            categoryIcon={course.categoryIcon || <Box size={14} strokeWidth={2.5} />}
            rating={course.rating.toString()}
            color={course.bgColor}
            avatars={course.avatars || []}
            students={course.students || "0"}
            badge={course.badge}
          />
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-16 px-6 text-center bg-white rounded-[32px] border-2 border-dashed border-black/5">
            <h3 className="text-[20px] font-bold text-[#1B1B1B] mb-2">No courses match your active filters</h3>
            <p className="text-[#848484] text-[14px] max-w-[400px] mx-auto mb-6">
              Try resetting the tag filter or switching your category selection to see more courses.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 bg-[#1B1B1B] text-white rounded-full text-[14px] font-bold shadow-md hover:scale-105 transition-transform"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterPill({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-[10px] px-5 py-[12px] rounded-full text-[14px] font-semibold whitespace-nowrap transition-all shadow-sm ${
        active 
          ? 'bg-[#1B1B1B] text-white shadow-md' 
          : 'bg-white text-[#848484] hover:bg-black/5 hover:text-[#1B1B1B]'
      }`}
    >
      <span className={active ? 'text-white' : 'text-[#1B1B1B]'}>{icon}</span>
      {label}
    </button>
  );
}

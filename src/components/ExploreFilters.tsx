import React from 'react';
import { Tag, Sparkles, X, Bookmark, CheckCircle2, SlidersHorizontal } from 'lucide-react';

interface ExploreFiltersProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  statusFilter: string;
  onSelectStatus: (status: string) => void;
  onlySaved: boolean;
  onToggleOnlySaved: () => void;
  onReset: () => void;
  totalResults: number;
}

export const POPULAR_TAGS = [
  'All',
  'Design',
  'Development',
  'Business',
  'UI/UX',
  'React',
  'Marketing',
  'Algorithms'
];

export default function ExploreFilters({
  selectedTag,
  onSelectTag,
  statusFilter,
  onSelectStatus,
  onlySaved,
  onToggleOnlySaved,
  onReset,
  totalResults,
}: ExploreFiltersProps) {
  const isFiltered = selectedTag !== 'All' || statusFilter !== 'All' || onlySaved;

  return (
    <div className="bg-white rounded-[28px] p-5 md:p-6 mb-8 border border-black/5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1B1B1B] text-white flex items-center justify-center">
            <Tag size={15} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#1B1B1B]">Filter by Tag</h3>
            <p className="text-[12px] font-medium text-[#848484]">
              Select tags like Design, Development, or Business to refine courses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Saved only toggle */}
          <button
            type="button"
            id="explore-saved-toggle"
            onClick={onToggleOnlySaved}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${
              onlySaved
                ? 'bg-[#1B1B1B] text-white border-[#1B1B1B] shadow-sm'
                : 'bg-bg-base/60 text-[#1B1B1B] border-black/5 hover:border-black/15'
            }`}
          >
            <Bookmark size={14} className={onlySaved ? 'fill-white' : ''} />
            <span>Saved Only</span>
          </button>

          {/* Status selector */}
          <div className="flex items-center gap-2 bg-bg-base/60 px-3 py-1.5 rounded-full border border-black/5">
            <span className="text-[12px] font-bold text-[#848484] pl-1">Progress:</span>
            <select
              id="explore-status-select"
              value={statusFilter}
              onChange={(e) => onSelectStatus(e.target.value)}
              className="bg-transparent text-[13px] font-bold text-[#1B1B1B] outline-none cursor-pointer pr-2"
            >
              <option value="All">All Courses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              id="explore-reset-filters"
              onClick={onReset}
              className="flex items-center gap-1.5 text-[12px] font-bold text-[#848484] hover:text-[#1B1B1B] px-3 py-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Tag Pills */}
      <div className="pt-4 flex flex-wrap items-center gap-2.5">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[#848484] mr-1 hidden sm:inline">
          Tags:
        </span>
        {POPULAR_TAGS.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <button
              key={tag}
              id={`filter-tag-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              type="button"
              onClick={() => onSelectTag(tag)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#1B1B1B] text-white shadow-sm ring-2 ring-black/10'
                  : 'bg-bg-base text-[#1B1B1B]/80 hover:bg-black/5 hover:text-[#1B1B1B] border border-black/5'
              }`}
            >
              <span>{tag === 'All' ? '✨ All Tags' : `#${tag}`}</span>
            </button>
          );
        })}

        <div className="ml-auto text-[13px] font-bold text-[#848484] hidden md:block">
          {totalResults} {totalResults === 1 ? 'course' : 'courses'} found
        </div>
      </div>
    </div>
  );
}

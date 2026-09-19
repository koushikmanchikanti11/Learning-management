import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_COURSES } from '../constants/courses';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<typeof ALL_COURSES>([]);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = ALL_COURSES.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.category.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full max-w-[400px]" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative group">
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-[#1B1B1B]' : 'text-[#848484]'}`}>
          <SearchIcon size={18} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search courses, instructors..."
          className={`w-full bg-white pl-12 pr-12 py-3.5 rounded-full shadow-sm border transition-all duration-300 outline-none text-[14px] font-medium placeholder:text-[#848484]/60 ${
            isFocused ? 'border-black/20 ring-4 ring-black/5' : 'border-transparent hover:border-black/5'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 text-[#848484] transition-colors"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {isFocused && (query.trim().length > 1) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 z-[100] overflow-hidden p-2">
          <div className="px-4 py-3 border-b border-black/5">
             <span className="text-[12px] font-bold text-[#848484] uppercase tracking-wider">Search Results</span>
          </div>
          {results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    navigate(`/course/${course.id}`);
                    setIsFocused(false);
                    setQuery('');
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-black/[0.03] rounded-[18px] transition-colors text-left group"
                >
                  <div className={`w-11 h-11 ${course.bgColor} rounded-[14px] flex items-center justify-center text-[#1B1B1B] shrink-0 transform group-hover:scale-105 transition-transform`}>
                    {course.icon || (course.categoryIcon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-[#1B1B1B] leading-tight truncate">{course.title}</h4>
                    <p className="text-[12px] font-medium text-[#848484] mt-0.5">{course.category} • {course.instructor}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSearch}
                className="w-full text-center py-3 text-[13px] font-bold text-[#1B1B1B] hover:bg-black/[0.03] rounded-b-[18px] transition-colors border-t border-black/5 mt-1"
              >
                View all results for "{query}"
              </button>
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-[14px] font-medium text-[#848484]">No courses found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

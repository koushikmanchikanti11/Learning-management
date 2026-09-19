import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft, Filter } from 'lucide-react';
import { ALL_COURSES } from '../constants/courses';
import CourseCard from '../components/CourseCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return ALL_COURSES.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.category.toLowerCase().includes(query.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(query.toLowerCase()) ||
      course.topic.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <main className="flex-1 flex flex-col pt-10 xl:pt-[54px] px-6 md:px-[60px] xl:px-16 w-full min-w-0 pb-10">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-black/5 hover:bg-black/5 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-[28px] md:text-[36px] font-semibold text-[#1B1B1B]">
          Search results for "<span className="text-indigo-600">{query}</span>"
        </h1>
      </div>

      <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5">
        <div className="flex items-center gap-6">
          <span className="text-[14px] font-bold text-[#1B1B1B]">{results.length} courses found</span>
          <div className="h-4 w-[1px] bg-black/10"></div>
          <button className="flex items-center gap-2 text-[14px] font-bold text-[#848484] hover:text-[#1B1B1B] transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-[#848484]">Sort by:</span>
          <select className="bg-transparent text-[14px] font-bold text-[#1B1B1B] outline-none cursor-pointer">
            <option>Most Relevant</option>
            <option>Newest</option>
            <option>Highest Rated</option>
          </select>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((course) => (
            <CourseCard 
              key={course.id}
              {...course}
              color={course.bgColor}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[40px] border-2 border-dashed border-black/5">
          <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6 text-[#848484]">
            <SearchIcon size={32} />
          </div>
          <h3 className="text-[22px] font-semibold text-[#1B1B1B] mb-2">No courses found</h3>
          <p className="text-[#848484] text-center max-w-[400px]">
            We couldn't find any courses matching your search. Try different keywords or browse our categories.
          </p>
          <Link to="/explore" className="mt-8 px-8 py-3.5 bg-[#1B1B1B] text-white rounded-full font-bold text-[15px] shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all">
            Explore All Courses
          </Link>
        </div>
      )}
    </main>
  );
}

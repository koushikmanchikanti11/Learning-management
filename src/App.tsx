import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Calendar from './pages/Calendar';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import CourseDetails from './pages/CourseDetails';
import LessonDetails from './pages/LessonDetails';
import SearchResults from './pages/SearchResults';
import SearchBar from './components/SearchBar';
import ConfettiCelebrationOverlay from './components/ConfettiCelebrationOverlay';
import { CourseProvider } from './context/CourseContext';

function Layout() {
  return (
    <div className="min-h-screen bg-bg-base flex font-sans text-text-main w-full relative selection:bg-black/10 items-start pt-4 pb-[90px] xl:pb-4 xl:py-4 px-4 xl:pr-4">
      <ConfettiCelebrationOverlay />
      <div className="max-w-[1600px] w-full mx-auto flex flex-col xl:flex-row xl:items-start gap-6 xl:gap-0">
        <Sidebar className="" />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="w-full flex justify-end px-6 md:px-[60px] xl:px-16 pt-4 mb-2">
            <SearchBar />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CourseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="course/:id" element={<CourseDetails />} />
            <Route path="course/:id/lesson/:lessonId" element={<LessonDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CourseProvider>
  );
}

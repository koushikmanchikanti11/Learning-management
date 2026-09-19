import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Wallet, Monitor, HelpCircle, Bookmark, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'saved' ? 'Saved & Watch Later' : 'Profile & Account';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { savedCourses, savedCourseIds, toggleSaveCourse } = useCourses();

  useEffect(() => {
    if (searchParams.get('tab') === 'saved') {
      setActiveTab('Saved & Watch Later');
    }
  }, [searchParams]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === 'Saved & Watch Later') {
      setSearchParams({ tab: 'saved' });
    } else {
      setSearchParams({});
    }
  };

  const menuItems = [
    { name: 'Profile & Account', icon: <User size={20} /> },
    { 
      name: 'Saved & Watch Later', 
      icon: <Bookmark size={20} />, 
      badge: savedCourses.length > 0 ? savedCourses.length : undefined 
    },
    { name: 'Notifications', icon: <Bell size={20} /> },
    { name: 'Privacy & Security', icon: <Shield size={20} /> },
    { name: 'Billing & Payments', icon: <Wallet size={20} /> },
    { name: 'Appearance', icon: <Monitor size={20} /> },
    { name: 'Help & Support', icon: <HelpCircle size={20} /> },
  ];

  return (
    <main className="flex-1 flex flex-col pt-10 xl:pt-[54px] px-6 md:px-[60px] xl:px-16 w-full min-w-0 pb-12">
      <h1 className="text-[52px] md:text-[68px] xl:text-[76px] font-semibold tracking-tight leading-[1] mb-[40px] text-[#1B1B1B]">
        Profile & Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button 
                key={item.name}
                id={`settings-tab-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleTabChange(item.name)}
                className={`flex items-center justify-between px-6 py-4 rounded-[20px] font-semibold text-[15px] transition-all text-left ${
                  isActive 
                    ? 'bg-[#1B1B1B] text-white shadow-md' 
                    : 'bg-transparent text-[#848484] hover:bg-white hover:text-[#1B1B1B] hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[12px] px-2.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#1B1B1B]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'Saved & Watch Later' ? (
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-[36px] p-8 md:p-10 shadow-sm border border-black/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1B1B1B] text-white flex items-center justify-center">
                      <Bookmark size={18} className="fill-white" />
                    </div>
                    <div>
                      <h2 className="text-[24px] font-bold text-[#1B1B1B]">Saved & Watch Later</h2>
                      <p className="text-[14px] text-[#848484] font-medium">
                        Courses bookmarked to study at your own pace
                      </p>
                    </div>
                  </div>
                  <span className="text-[13px] font-bold text-[#1B1B1B] bg-bg-base px-4 py-2 rounded-full border border-black/5 self-start sm:self-auto">
                    {savedCourses.length} {savedCourses.length === 1 ? 'course' : 'courses'} saved
                  </span>
                </div>

                {savedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                    {savedCourses.map((course) => (
                      <div key={course.id} className="relative group">
                        <CourseCard 
                          id={course.id}
                          title={course.title}
                          category={course.category}
                          categoryIcon={course.categoryIcon}
                          rating={course.rating.toString()}
                          color={course.bgColor}
                          avatars={course.avatars || []}
                          students={course.students || "0"}
                          badge={course.badge}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center mb-4 text-[#848484]">
                      <Bookmark size={28} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-[20px] font-bold text-[#1B1B1B] mb-2">No saved courses yet</h3>
                    <p className="text-[14px] text-[#848484] max-w-[360px] mb-6">
                      Click the bookmark icon on any course card across Explore or Dashboard to add it to your Watch Later list.
                    </p>
                    <Link
                      to="/explore"
                      className="px-6 py-3 bg-[#1B1B1B] text-white rounded-full text-[14px] font-bold shadow-md hover:scale-105 transition-transform inline-flex items-center gap-2"
                    >
                      <span>Explore Courses</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'Profile & Account' ? (
            <div className="flex flex-col gap-8">
              {/* Profile Card */}
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-black/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-black/5">
                  <div className="flex items-center gap-6">
                    <div className="w-[96px] h-[96px] rounded-full overflow-hidden border-[4px] border-bg-base shadow-sm relative shrink-0">
                      <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="Annette Black" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-[26px] font-bold text-[#1B1B1B] mb-1">Annette Black</h2>
                      <p className="text-[14px] font-medium text-[#848484] mb-3">Product Designer & Developer</p>
                      <div className="flex gap-2.5">
                        <button className="bg-[#1B1B1B] text-white px-4 py-2 rounded-full text-[12px] font-semibold shadow-sm hover:scale-105 transition-transform">
                          Upload new
                        </button>
                        <button className="bg-bg-panel text-[#1B1B1B] px-4 py-2 rounded-full text-[12px] font-semibold hover:bg-black/5 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Shortcut to Saved Courses in Profile */}
                  <button
                    onClick={() => handleTabChange('Saved & Watch Later')}
                    className="flex items-center gap-3 bg-bg-base hover:bg-[#1B1B1B] hover:text-white transition-all p-3.5 px-5 rounded-[20px] border border-black/5 group text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-white group-hover:bg-white/20 flex items-center justify-center text-[#1B1B1B] group-hover:text-white transition-colors">
                      <Bookmark size={16} className="fill-current" />
                    </div>
                    <div>
                      <span className="text-[13px] font-bold block">Watch Later List</span>
                      <span className="text-[12px] opacity-70 block">{savedCourses.length} courses saved</span>
                    </div>
                    <ArrowRight size={16} className="ml-1 text-[#848484] group-hover:text-white transition-colors" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[14px] font-bold text-[#1B1B1B]">First Name</label>
                    <input type="text" defaultValue="Annette" className="bg-bg-base/50 border border-black/5 rounded-[16px] px-5 py-3.5 outline-none focus:border-black/20 text-[#1B1B1B] font-medium" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[14px] font-bold text-[#1B1B1B]">Last Name</label>
                    <input type="text" defaultValue="Black" className="bg-bg-base/50 border border-black/5 rounded-[16px] px-5 py-3.5 outline-none focus:border-black/20 text-[#1B1B1B] font-medium" />
                  </div>
                  <div className="flex flex-col gap-2.5 md:col-span-2">
                    <label className="text-[14px] font-bold text-[#1B1B1B]">Email Address</label>
                    <input type="email" defaultValue="annette.black@example.com" className="bg-bg-base/50 border border-black/5 rounded-[16px] px-5 py-3.5 outline-none focus:border-black/20 text-[#1B1B1B] font-medium" />
                  </div>
                  <div className="flex flex-col gap-2.5 md:col-span-2">
                    <label className="text-[14px] font-bold text-[#1B1B1B]">Bio</label>
                    <textarea rows={3} className="bg-bg-base/50 border border-black/5 rounded-[16px] px-5 py-3.5 outline-none focus:border-black/20 text-[#1B1B1B] font-medium resize-none" defaultValue="Product Designer and aspiring Developer looking to build modern frontends."></textarea>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button className="bg-[#1B1B1B] text-white px-8 py-3.5 rounded-full text-[14px] font-semibold shadow-md hover:scale-105 transition-transform">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Other Settings Tabs */
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-black/5">
              <h2 className="text-[24px] font-bold text-[#1B1B1B] mb-2">{activeTab}</h2>
              <p className="text-[14px] text-[#848484] mb-8 font-medium">Manage preferences and configurations for {activeTab.toLowerCase()}.</p>
              <div className="p-8 bg-bg-base/50 rounded-[24px] border border-black/5 text-center">
                <p className="text-[14px] font-semibold text-[#1B1B1B]">All settings in this section are currently active and up to date.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

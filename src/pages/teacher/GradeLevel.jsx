import React, { useState } from "react";
import { 
  BookOpenIcon, 
  UsersIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  ArrowPathIcon
} from "@heroicons/react/24/solid";

export default function GradeLevel() {
  const [editing, setEditing] = useState(false);

  const getColors = (headerColor) => {
    switch (headerColor) {
      case "bg-purple-600":
        return {
          bar: "from-purple-500 to-pink-500",
          text: "text-purple-700",
          pillBg: "bg-purple-100",
          pillText: "text-purple-800",
          pillHover: "hover:bg-purple-200",
          icon: "text-purple-600"
        };
      case "bg-blue-600":
        return {
          bar: "from-blue-500 to-cyan-500",
          text: "text-blue-700",
          pillBg: "bg-blue-100",
          pillText: "text-blue-800",
          pillHover: "hover:bg-blue-200",
          icon: "text-blue-600"
        };
      case "bg-green-600":
        return {
          bar: "from-green-500 to-emerald-500",
          text: "text-green-700",
          pillBg: "bg-green-100",
          pillText: "text-green-800",
          pillHover: "hover:bg-green-200",
          icon: "text-green-600"
        };
      case "bg-yellow-600":
        return {
          bar: "from-yellow-400 to-orange-500",
          text: "text-yellow-700",
          pillBg: "bg-yellow-100",
          pillText: "text-yellow-800",
          pillHover: "hover:bg-yellow-200",
          icon: "text-yellow-600"
        };
      default:
        return {
          bar: "from-purple-500 to-pink-500",
          text: "text-purple-700",
          pillBg: "bg-purple-100",
          pillText: "text-purple-800",
          pillHover: "hover:bg-purple-200",
          icon: "text-purple-600"
        };
    }
  };

  const gradeLevels = [
    {
      id: 1,
      name: "Kindergarten",
      sectionCount: 1,
      totalStudents: 35,
      attendanceRate: 96.5,
      color: "bg-purple-600",
      sections: ["Love"],
      icon: (
        <div className="relative w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
          <svg className="w-12 h-12 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6 15.428M19 12V4a1 1 0 00-1-1H6a1 1 0 00-1 1v8" />
            <circle cx="8" cy="19" r="2" fill="currentColor" />
            <circle cx="12" cy="19" r="2" fill="currentColor" />
            <circle cx="16" cy="19" r="2" fill="currentColor" />
          </svg>
        </div>
      )
    },
    {
      id: 2,
      name: "Grade 1",
      sectionCount: 1,
      totalStudents: 36,
      attendanceRate: 95.65,
      color: "bg-blue-600",
      sections: ["Humility"],
      icon: (
        <div className="relative w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
          <svg className="w-12 h-12 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      )
    },
    {
      id: 3,
      name: "Grade 2",
      sectionCount: 1,
      totalStudents: 50,
      attendanceRate: 95.65,
      color: "bg-green-600",
      sections: ["Kindness"],
      icon: (
        <div className="relative w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
          <svg className="w-12 h-12 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )
    },
    {
      id: 4,
      name: "Grade 3",
      sectionCount: 2,
      totalStudents: 50,
      attendanceRate: 95.65,
      color: "bg-yellow-600",
      sections: ["Diligence", "Wisdom"],
      icon: (
        <div className="relative w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
          <svg className="w-12 h-12 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6 15.428M19 12V4a1 1 0 00-1-1H6a1 1 0 00-1 1v8" />
          </svg>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <main className="p-0">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpenIcon className="w-10 h-10 text-red-800" />
            Grade Level Management
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search grade level"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            />
          </div>
          <button className="px-6 py-3 bg-gray-100 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition">
            <FunnelIcon className="w-5 h-5" />
            Filter
          </button>
        </div>

        <h3 className="text-lg pl-20 font-semibold text-gray-700 mb-6">All Grade Levels</h3>
    
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-10">
            {gradeLevels.map((level) => {
              const colors = getColors(level.color);

              return (
                <div key={level.id} className="rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-200">

                  <div className={`${level.color} px-8 py-7 flex items-center justify-between`}>
                    <div className="flex items-center gap-7">
                      {level.icon}
                      <div>
                        <h3 className="text-3xl font-bold text-white leading-tight">{level.name}</h3>
                        <p className="text-white/80 text-base">
                          {level.sectionCount} Section{level.sectionCount > 1 ? "s" : ""} Available
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {editing ? (
                        <>
                          <button className="px-5 py-2.5 bg-white/20 rounded-lg hover:bg-white/30 transition">
                            <ArrowPathIcon className="w-5 h-5" />
                          </button>
                          <button className="px-9 py-2.5 bg-white text-purple-700 rounded-lg font-bold text-sm hover:bg-gray-100 transition">
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditing(true)}
                          className="px-7 py-2.5 bg-white/20 rounded-lg font-medium text-white hover:bg-white/30 transition flex items-center gap-2 text-sm"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="px-8 pt-8 pb-10">

                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">Total of Students</p>
                        <p className="text-6xl font-bold text-gray-900 mt-1">{level.totalStudents}</p>
                      </div>
                      <UsersIcon className={`w-14 h-14 ${colors.icon} opacity-90`} />
                    </div>

                    <div className="mb-9">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Attendance Rate</span>
                        <span className={`font-bold ${colors.text}`}>{level.attendanceRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-7">
                        <div
                          className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-1000`}
                          style={{ width: `${level.attendanceRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Sections</p>
                      <div className="flex flex-col gap-4">
                        {level.sections.map((sec, i) => (
                          <div
                            key={i}
                            className={`px-6 py-3 ${colors.pillBg} rounded-full ${colors.pillText} font-semibold text-lg ${colors.pillHover} transition text-left`}
                          >
                            {sec}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <button className="w-[50%] px-5 py-3 bg-red-700 hover:bg-red-800 rounded-xl text-white font-bold text-xl transition shadow-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
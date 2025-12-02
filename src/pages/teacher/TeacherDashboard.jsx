import React, { useEffect, useState } from "react";
import {
  UserCircleIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/solid";

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/students");
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load students for teacher dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const totalStudents = students.length;

  const activeClasses = (() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.gradeLevel && s.section) {
        set.add(`${s.gradeLevel}|||${s.section}`);
      }
    });
    return set.size;
  })();

  const averageAttendance = (() => {
    if (!students.length) return 0;
    const sum = students.reduce(
      (acc, s) => acc + (typeof s.attendance === "number" ? s.attendance : 0),
      0
    );
    return sum / students.length;
  })();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <UserCircleIcon className="w-30 h-30 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-6xl pl-5 font-bold text-gray-900">Dashboard</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center shadow border border-gray-300 border-l-red-800 border-l-8 hover:shadow-md transition">
          <UsersIcon className="w-6 h-6 flex mx-auto text-[#8f0303]" />
          <p className="text-sm text-gray-500">Total Students</p>
          <h3 className="text-2xl font-semibold text-[#b30000]">
            {loading ? "..." : totalStudents}
          </h3>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center shadow border border-gray-300 border-l-red-800 border-l-8 hover:shadow-md transition">
          <CalendarIcon className="w-6 h-6 flex mx-auto text-[#8f0303]" />
          <p className="text-sm text-gray-500">Active Classes</p>
          <h3 className="text-2xl font-semibold text-[#b30000]">
            {loading ? "..." : activeClasses}
          </h3>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg text-center shadow border border-gray-300 border-l-red-800 border-l-8 hover:shadow-md transition">
          <ChartBarSquareIcon className="w-6 h-6 flex mx-auto text-[#8f0303]" />
          <p className="text-sm text-gray-500">Average Attendance</p>
          <h3 className="text-2xl font-semibold text-[#b30000]">
            {loading ? "..." : `${averageAttendance.toFixed(1)}%`}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-300">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">Recent Activity</h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-md border border-gray-200 hover:shadow-sm transition">
            <p className="font-medium">
              New grades uploaded for Grade 1-A: Mathematics
            </p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-md border border-gray-200 hover:shadow-sm transition">
            <p className="font-medium">
              Attendance recorded for Grade 3-B (October 23, 2025)
            </p>
            <p className="text-xs text-gray-500">5 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}

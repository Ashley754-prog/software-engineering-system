import React, { useState, useEffect } from "react";
import { UsersIcon, BookOpenIcon, ClipboardDocumentListIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import AdminTeachers from "./AdminTeachers";
import { useNavigate } from "react-router-dom";
import AdminStudents from "./AdminStudents";
import AdminClasses from "./AdminClasses";
import AdminReports from "./AdminReports";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch students count
      const studentsResponse = await fetch('http://localhost:3001/api/students/count');
      const studentsData = await studentsResponse.json();
      
      // Fetch teachers count
      const teachersResponse = await fetch('http://localhost:3001/api/teachers/count');
      const teachersData = await teachersResponse.json();
      
      // Fetch classes count (you might need to create this endpoint)
      const classesResponse = await fetch('http://localhost:3001/api/classes/count');
      const classesData = await classesResponse.json();
      
      // For reports, we'll use a placeholder for now
      const reportsCount = 80; // This could be fetched from a reports endpoint

      setStats({
        totalStudents: studentsData.count || 0,
        totalTeachers: teachersData.count || 0,
        totalClasses: classesData.count || 0,
        totalReports: reportsCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values if API calls fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <Cog6ToothIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-6xl pl-5 font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-400 ml-80 mt-6">Welcome, Admin!</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3 bg-white rounded-lg shadow p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === "overview" ? "bg-blue-500 text-white" : "hover:bg-blue-50 text-gray-700"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("teachers")}
              className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === "teachers" ? "bg-blue-500 text-white" : "hover:bg-blue-50 text-gray-700"}`}
            >
              Manage Teachers
            </button>
            <button
              onClick={() => setActiveSection("students")}
              className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === "students" ? "bg-blue-500 text-white" : "hover:bg-blue-50 text-gray-700"}`}
            >
              Manage Students
            </button>
            <button
              onClick={() => setActiveSection("classes")}
              className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === "classes" ? "bg-blue-500 text-white" : "hover:bg-blue-50 text-gray-700"}`}
            >
              Manage Classes
            </button>
            <button
              onClick={() => setActiveSection("reports")}
              className={`w-full text-left px-4 py-2 rounded-lg ${activeSection === "reports" ? "bg-blue-500 text-white" : "hover:bg-blue-50 text-gray-700"}`}
            >
              Reports & Analytics
            </button>
          </nav>
        </aside>

        <main className="col-span-9 bg-white rounded-lg shadow p-6">
          {activeSection === "overview" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">System Overview</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">Loading statistics...</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500">Total Students</h3>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalStudents.toLocaleString()}</p>
                    </div>
                    <UsersIcon className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500">Teachers</h3>
                      <p className="text-2xl font-bold text-green-600">{stats.totalTeachers}</p>
                    </div>
                    <BookOpenIcon className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500">Classes</h3>
                      <p className="text-2xl font-bold text-yellow-600">{stats.totalClasses}</p>
                    </div>
                    <ClipboardDocumentListIcon className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500">Reports</h3>
                      <p className="text-2xl font-bold text-purple-600">{stats.totalReports}</p>
                    </div>
                    <ChartBarIcon className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "teachers" && <AdminTeachers />}
          {activeSection === "students" && <AdminStudents />}
          {activeSection === "classes" && <AdminClasses />}
          {activeSection === "reports" && <AdminReports />}
        </main>
      </div>
    </div>
  );
}

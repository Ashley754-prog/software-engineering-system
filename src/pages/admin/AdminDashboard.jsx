import React, { useState } from "react";
import { UsersIcon, BookOpenIcon, ClipboardDocumentListIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import AdminTeachers from "./AdminTeachers";
import AdminStudents from "./AdminStudents";
import AdminClasses from "./AdminClasses";
import AdminReports from "./AdminReports";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Total Students</h3>
                    <p className="text-2xl font-bold text-blue-600">3,000</p>
                  </div>
                  <UsersIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Teachers</h3>
                    <p className="text-2xl font-bold text-green-600">45</p>
                  </div>
                  <BookOpenIcon className="h-8 w-8 text-green-500" />
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Classes</h3>
                    <p className="text-2xl font-bold text-yellow-600">25</p>
                  </div>
                  <ClipboardDocumentListIcon className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="bg-purple-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-gray-500">Reports</h3>
                    <p className="text-2xl font-bold text-purple-600">80</p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
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

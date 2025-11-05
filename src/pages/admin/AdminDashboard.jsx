import React, { useState } from "react";
import {
  BellIcon,
  UserCircleIcon,
  UsersIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
} from "@heroicons/react/24/solid";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // mock stats (replace with API data)
  const stats = {
    totalStudents: 3024,
    totalTeachers: 72,
    totalClasses: 45,
    attendanceRate: 96,
  };

  const recent = [
    { id: 1, text: "Teacher A submitted Grade 6 - Loyalty grades", time: "2h ago" },
    { id: 2, text: "Attendance synced for 2025-11-05", time: "4h ago" },
    { id: 3, text: "New student added: Maria Lopez (LRN: 987654)", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <ChartBarIcon className="w-6 h-6 text-red-800" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-md hover:bg-gray-100">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">3</span>
            </button>

            <div className="flex items-center gap-2">
              <UserCircleIcon className="w-8 h-8 text-gray-600" />
              <div className="text-sm">
                <div className="font-medium">Admin Name</div>
                <div className="text-gray-500">Principal</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          {sidebarOpen && (
            <aside className="col-span-12 md:col-span-3 lg:col-span-2">
              <nav className="space-y-2">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <ul className="space-y-1">
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
                        <ChartBarIcon className="w-5 h-5 text-red-800" />
                        <span>Dashboard</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
                        <UsersIcon className="w-5 h-5 text-gray-600" />
                        <span>Teachers</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
                        <AcademicCapIcon className="w-5 h-5 text-gray-600" />
                        <span>Students</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
                        <BuildingLibraryIcon className="w-5 h-5 text-gray-600" />
                        <span>Classes</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
                        <DocumentChartBarIcon className="w-5 h-5 text-gray-600" />
                        <span>Grades</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
                        <UsersIcon className="w-5 h-5 text-gray-600" />
                        <span>Attendance</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
                        <ChartBarIcon className="w-5 h-5 text-gray-600" />
                        <span>Reports</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
                        <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                        <span>Settings</span>
                      </button>
                    </li>
                    <li>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 text-red-700">
                        <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>
            </aside>
          )}

          {/* Main content */}
          <main className={`col-span-12 ${sidebarOpen ? "md:col-span-9 lg:col-span-10" : "md:col-span-12"}`}>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-5 border-l-8 border-l-red-800">
                <div className="text-sm text-gray-500">Total Students</div>
                <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-5 border-l-8 border-l-red-800">
                <div className="text-sm text-gray-500">Total Teachers</div>
                <div className="text-2xl font-bold">{stats.totalTeachers}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-5 border-l-8 border-l-red-800">
                <div className="text-sm text-gray-500">Total Classes</div>
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
              </div>

              <div className="bg-white rounded-lg shadow p-5 border-l-8 border-l-red-800">
                <div className="text-sm text-gray-500">Attendance Rate</div>
                <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              </div>
            </div>

            {/* Charts + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Charts area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Attendance Overview</h3>
                    <div className="text-sm text-gray-500">Last 30 days</div>
                  </div>
                  <div className="h-56 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                    {/* Replace with a chart */}
                    <span>Bar chart placeholder</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Academic Performance</h3>
                    <div className="text-sm text-gray-500">Average by Grade</div>
                  </div>
                  <div className="h-56 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                    {/* Replace with a chart */}
                    <span>Line chart placeholder</span>
                  </div>
                </div>
              </div>

              {/* Recent updates + exports */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Recent Updates</h3>
                  <ul className="space-y-2">
                    {recent.map((r) => (
                      <li key={r.id} className="text-sm">
                        <div className="flex justify-between">
                          <div className="text-gray-800">{r.text}</div>
                          <div className="text-gray-400 text-xs">{r.time}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Exports</h3>
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-2 justify-center bg-red-800 text-white px-3 py-2 rounded hover:bg-red-900">
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      Download SF2 Summary
                    </button>
                    <button className="flex items-center gap-2 justify-center bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-900">
                      <PrinterIcon className="w-5 h-5" />
                      Print Report Cards
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* bottom area - action tiles or tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 px-4 bg-white rounded border hover:shadow-sm text-left">
                    <div className="text-sm text-gray-500">Add Student</div>
                    <div className="font-medium">Create new student record</div>
                  </button>
                  <button className="py-3 px-4 bg-white rounded border hover:shadow-sm text-left">
                    <div className="text-sm text-gray-500">Add Teacher</div>
                    <div className="font-medium">Create new teacher account</div>
                  </button>
                  <button className="py-3 px-4 bg-white rounded border hover:shadow-sm text-left">
                    <div className="text-sm text-gray-500">Create Class</div>
                    <div className="font-medium">Create grade/section</div>
                  </button>
                  <button className="py-3 px-4 bg-white rounded border hover:shadow-sm text-left">
                    <div className="text-sm text-gray-500">Sync Attendance</div>
                    <div className="font-medium">Sync to SF2 template</div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Notifications / Alerts</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>- Missing grades for Grade 4 – Section B</li>
                  <li>- Attendance not synced for 2 sections</li>
                  <li>- Template update available</li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

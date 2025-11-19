import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { DocumentChartBarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function AdminReports() {
  const gradeTrendData = [
    { month: "Jan", average: 85 },
    { month: "Feb", average: 88 },
    { month: "Mar", average: 90 },
    { month: "Apr", average: 89 },
    { month: "May", average: 92 },
    { month: "Jun", average: 94 },
  ];

  const attendanceTrendData = [
    { month: "Jan", present: 2800 },
    { month: "Feb", present: 2900 },
    { month: "Mar", present: 3000 },
    { month: "Apr", present: 2950 },
    { month: "May", present: 3050 },
    { month: "Jun", present: 3100 },
  ];

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <DocumentChartBarIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Reports & Analytics</h2>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Generate performance reports, visualize trends, and assess attendance and grade patterns across all grade levels.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
          <h3 className="text-lg font-semibold text-red-800">Top Performing Class</h3>
          <p className="text-3xl font-bold mt-2">Grade 6 – Section A</p>
        </div>
        <div className="bg-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
          <h3 className="text-lg font-semibold text-red-800">Schoolwide Average</h3>
          <p className="text-3xl font-bold mt-2">88.7%</p>
        </div>
        <div className="bg-red-50 p-5 rounded-lg border border-red-100 shadow-sm">
          <h3 className="text-lg font-semibold text-red-800">Attendance Rate</h3>
          <p className="text-3xl font-bold mt-2">94%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white border rounded-lg shadow p-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">📈 Grades Trend (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gradeTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ReTooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-lg shadow p-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">📊 Attendance Trend (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ReTooltip />
              <Legend />
              <Bar dataKey="present" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-red-50 p-6 rounded-lg border border-red-100 shadow-sm">
        <h3 className="text-xl font-semibold text-red-800 mb-4">Available Reports</h3>
        <ul className="text-gray-700 space-y-2 ml-3">
          <li>• Class performance summary</li>
          <li>• Individual student academic report</li>
          <li>• Attendance summary (daily, weekly, monthly)</li>
          <li>• Ranking and percentile comparison</li>
          <li>• Subject difficulty analysis</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button className="flex items-center gap-2 bg-red-800 text-white px-5 py-3 rounded-lg shadow hover:bg-red-900 transition">
          <ArrowDownTrayIcon className="w-6 h-6" />
          Download PDF Report
        </button>
        <button className="flex items-center gap-2 bg-gray-700 text-white px-5 py-3 rounded-lg shadow hover:bg-gray-800 transition">
          <ArrowDownTrayIcon className="w-6 h-6" />
          Export CSV
        </button>
      </div>
    </div>
  );
}

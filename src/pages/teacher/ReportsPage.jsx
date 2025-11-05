import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { UserGroupIcon } from "@heroicons/react/24/solid";

export default function ReportsPage() {
  const [section, setSection] = useState("Grade 1 - Section A");

  const attendanceData = [
    { date: "2025-10-25", present: 28 },
    { date: "2025-10-26", present: 27 },
    { date: "2025-10-27", present: 29 },
    { date: "2025-10-28", present: 30 },
    { date: "2025-10-29", present: 28 },
  ];

  const gradesData = [
    { student: "John Doe", math: 88, english: 92 },
    { student: "Jane Smith", math: 95, english: 90 },
    { student: "Alice Tan", math: 78, english: 85 },
  ];

  return (
    <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserGroupIcon className="w-10 h-10 text-red-800" />
            Reports
            </h2>
        </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Section:</label>
        <select
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option>Grade 1 - Section A</option>
          <option>Grade 1 - Section B</option>
          <option>Grade 2 - Section A</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Attendance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="present" stroke="#CC3333" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Grades Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-red-800 text-white">
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Math</th>
                <th className="px-4 py-2 text-left">English</th>
              </tr>
            </thead>
            <tbody>
              {gradesData.map((record, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-2">{record.student}</td>
                  <td className="px-4 py-2">{record.math}</td>
                  <td className="px-4 py-2">{record.english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

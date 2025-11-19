import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  CalendarIcon,
  AcademicCapIcon,
  TrophyIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

export default function ReportsPage() {
  const [showDropdown, setShowDropdown] = useState(false);

  const attendanceData = [
    { day: "Mon", present: 38, absent: 2 },
    { day: "Tue", present: 37, absent: 3 },
    { day: "Wed", present: 39, absent: 1 },
    { day: "Thu", present: 36, absent: 4 },
    { day: "Fri", present: 40, absent: 0 },
    { day: "Sat", present: 35, absent: 5 },
    { day: "Sun", present: 38, absent: 2 },
  ];

  const subjectsData = [
    { subject: "Mathematics", average: 88 },
    { subject: "English", average: 92 },
    { subject: "Science", average: 85 },
    { subject: "Filipino", average: 90 },
    { subject: "Araling Panlipunan", average: 87 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <AcademicCapIcon className="w-12 h-12 text-red-800" />
          Reports & Analytics
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-red-700" />
            <span className="font-semibold text-gray-800">Section:</span>
          </div>

          <div className="relative">
            <select
              defaultValue=""
              onClick={() => setShowDropdown(!showDropdown)}
              onChange={() => setShowDropdown(false)}      
              onBlur={() => setShowDropdown(false)}    
              className="px-5 py-3 pr-12 bg-red-50 border-2 border-red-300 rounded-xl font-bold text-red-800 text-base focus:outline-none focus:ring-3 focus:ring-red-100 appearance-none cursor-pointer transition-all"
            >
              <option value="" disabled>Select section</option>
              <option value="Grade 1 - Humility">Grade 1 - Humility</option>
              <option value="Grade 2 - Kindness">Grade 2 - Kindness</option>
              <option value="Grade 3 - Wisdom">Grade 3 - Wisdom</option>
              <option value="Grade 3 - Diligence">Grade 3 - Diligence</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <ChevronDownIcon
                className="w-5 h-5 text-red-800 transition-transform duration-300 ease-in-out"
                style={{
                  transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-4xl font-bold">95.8%</p>
          <p className="text-lg mt-2 opacity-90">Attendance Rate</p>
          <p className="text-sm opacity-80">This week</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-4xl font-bold">89.4</p>
          <p className="text-lg mt-2 opacity-90">Class Average</p>
          <p className="text-sm opacity-80">All subjects</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-4xl font-bold">12</p>
          <p className="text-lg mt-2 opacity-90">Late Students</p>
          <p className="text-sm opacity-80">This week</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-xl">
          <p className="text-4xl font-bold">3</p>
          <p className="text-lg mt-2 opacity-90">Honor Students</p>
          <p className="text-sm opacity-80">With honors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-2xl p-5 border border-gray-200 h-[400px] w-[550px]">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Weekly Attendance Trend</h3>
          <ResponsiveContainer width={"100%"} height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
              <XAxis dataKey="day" stroke="#374151" fontSize={12} />
              <YAxis domain={[0, 40]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "2px solid #dc2626", borderRadius: "12px" }}
                labelStyle={{ color: "#dc2626", fontWeight: "bold" }}
              />
              <Line type="monotone" dataKey="present" stroke="#dc2626" strokeWidth={3} dot={{ fill: "#dc2626", r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 h-[400px] w-[550px]">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectsData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
              <XAxis dataKey="subject" angle={-15} textAnchor="end" height={60} fontSize={13} />
              <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />
              <Tooltip />
              <Bar dataKey="average" radius={[12, 12, 0, 0]} fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

<div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 h-[400px] w-full">
  <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-5 text-center">
    <h3 className="text-2xl font-bold flex items-center justify-center gap-4">
      <TrophyIcon className="w-6 h-6" />
      Top Performing Students
    </h3>
  </div>

  <div className="p-6 h-[calc(100%-90px)] overflow-y-auto">
    <div className="space-y-6">
      {[
        { rank: 1, name: "Bautista, Juan Miguel Mortel", avg: 94.8 },
        { rank: 2, name: "Santos, Maria Clara", avg: 93.2 },
        { rank: 3, name: "Reyes, Pedro Juan", avg: 91.5 },
      ].map((student) => (
        <div
          key={student.rank}
          className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 hover:shadow-lg transition h-[80px]"
        >
          <div className="flex items-center gap-6">
            <div
              className={`text-xl font-bold ${
                student.rank === 1
                  ? "text-yellow-500"
                  : student.rank === 2
                  ? "text-gray-400"
                  : "text-orange-600"
              }`}
            >
              #{student.rank}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{student.name}</p>
              <p className="text-base text-gray-600">General Average</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xl font-bold text-red-700">{student.avg}</p>
            <p className="text-base font-semibold text-red-800">With Honors</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
    </div>
  );
}
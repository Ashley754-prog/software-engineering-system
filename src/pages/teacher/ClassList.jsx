import { useState } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";

export default function StudentDashboard() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All Grades");
  const [sectionFilter, setSectionFilter] = useState("All Sections");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [gradeOpen, setGradeOpen] = useState(false);
const [sectionOpen, setSectionOpen] = useState(false);
const [statusOpen, setStatusOpen] = useState(false);


  const students = [
    {
      id: 1,
      name: "John Doe",
      studentId: "12345",
      grade: "Grade 3",
      section: "Wisdom",
      contact: "0907263553",
      attendance: "95%",
      average: 90,
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      name: "Maria Santos",
      studentId: "12345",
      grade: "Grade 3",
      section: "Wisdom",
      contact: "0907263553",
      attendance: "96%",
      average: 80,
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: 3,
      name: "Juan Pedro",
      studentId: "12345",
      grade: "Grade 3",
      section: "Wisdom",
      contact: "0907263553",
      attendance: "96%",
      average: 80,
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
  ];

  return (
      <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ViewColumnsIcon className="w-10 h-10 text-red-800" />
          Manage Students
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-semibold">Total Students</p>
              <h2 className="text-2xl font-bold">223</h2>
            </div>
            <div className="text-gray-800 text-2xl">👤</div>
          </div>
          <p className="text-green-500 text-sm mt-2">↑ 12 from last month</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-semibold">Active Students</p>
              <h2 className="text-2xl font-bold">220</h2>
              <p className="text-gray-500 text-sm">97.0% of total</p>
            </div>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-semibold">Average Grade</p>
              <h2 className="text-2xl font-bold">95</h2>
            </div>
            <div className="text-gray-800 text-2xl">🏅</div>
          </div>
          <p className="text-green-500 text-sm mt-2">↑ 2.3% improvement</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-semibold">Attendance Rate</p>
              <h2 className="text-2xl font-bold">92</h2>
            </div>
            <div className="text-gray-800 text-2xl">📊</div>
          </div>
          <p className="text-gray-500 text-sm mt-2">This month</p>
        </div>
      </div>

    <div className="bg-white p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
      <input
        type="text"
        placeholder="Search by name, LRN, email..."
        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-1 focus:ring-red-600"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="relative w-48">
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          onFocus={() => setGradeOpen(true)}
          onBlur={() => setGradeOpen(false)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 appearance-none"
        >
          <option>All Grades</option>
          <option>Grade 1</option>
          <option>Grade 2</option>
          <option>Grade 3</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              gradeOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="relative w-48">
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          onFocus={() => setSectionOpen(true)}
          onBlur={() => setSectionOpen(false)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 appearance-none"
        >
          <option>All Sections</option>
          <option>Section A</option>
          <option>Section B</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              sectionOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="relative w-48">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          onFocus={() => setStatusOpen(true)}
          onBlur={() => setStatusOpen(false)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 appearance-none"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              statusOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>


    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Grade & Section</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Attendance</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Average</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 flex items-center gap-3">
                <img className="w-8 h-8 rounded-full" src={student.avatar} alt="" />
                <span>{student.name}</span>
              </td>
              <td className="px-6 py-4">{student.studentId}</td>
              <td className="px-6 py-4">{student.grade} {student.section}</td>
              <td className="px-6 py-4">{student.contact}</td>
              <td className="px-6 py-4">{student.attendance}</td>
              <td className="px-6 py-4">{student.average}</td>
              <td className="px-6 py-4">{student.status}</td>
              <td className="px-6 py-4 flex items-center gap-2">
                <button className="text-blue-500"><EyeIcon className="w-5 h-5" /></button>
                <button className="text-green-500"><PencilSquareIcon className="w-5 h-5" /></button>
                <button className="text-red-500"><TrashIcon className="w-5 h-5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

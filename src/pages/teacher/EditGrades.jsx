import React, { useState } from "react";
import {
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  Bars3BottomLeftIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

export default function EditGrades() {
  const [isEditing, setIsEditing] = useState(false);

  const students = [
    { rank: 1, id: "2023001", name: "Maria Santos", lrn: "123456789012", q1: 95, q2: 94, q3: 96, q4: 97, remarks: "Excellent" },
    { rank: 2, id: "2023002", name: "Juan Dela Cruz", lrn: "123456789013", q1: 92, q2: 90, q3: 93, q4: 94, remarks: "Very Good" },
    { rank: 3, id: "2023003", name: "Ana Lim", lrn: "123456789014", q1: 88, q2: 89, q3: 87, q4: 90, remarks: "Good" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpenIcon className="w-10 h-10 text-red-800" />
          Edit Grades
        </h2>

        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm font-medium shadow-md">
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export Grade
          </button>
          <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm font-medium shadow-md">
            <PrinterIcon className="w-5 h-5" />
            Print Report
          </button>
        </div>
      </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">36</p>
                <p className="text-xs text-gray-500 mt-1">Grade 3 - Wisdom</p>
              </div>
              <UserGroupIcon className="w-12 h-12 text-red-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Class Average</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">89.78</p>
                <p className="text-xs text-gray-500 mt-1">Mathematics</p>
              </div>
              <ArrowTrendingUpIcon className="w-12 h-12 text-orange-600 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Highest Grade</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">96</p>
                <p className="text-xs text-gray-600 mt-1">Maria Santos</p>
              </div>
              <AcademicCapIcon className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">General Average</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">92.45</p>
                <p className="text-xs text-gray-500 mt-1">All Subjects Combined</p>
              </div>
              <Bars3BottomLeftIcon className="w-12 h-12 text-purple-600 opacity-80" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="grid grid-row-1 md:grid-row-2 lg:grid-row-4 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black-500">
                <option>Mathematics</option>
                <option>English</option>
                <option>Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quarter</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black-500">
                <option>Q1</option>
                <option>Q2</option>
                <option>Q3</option>
                <option>Q4</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Student</label>
              <input
                type="text"
                placeholder="Name or LRN..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-black-500"
              />
            </div>
            <div className="flex justify-center">
              {isEditing ? (
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-[50%] py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-6 h-6" />
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-[50%] py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
                >
                  <PencilIcon className="w-6 h-6" />
                  Edit Grades
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Student Grades - Mathematics</h3>
            {isEditing && (
              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium">
                Editing Mode
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">LRN</th>
                  <th className="px-6 py-4 text-center">Q1</th>
                  <th className="px-6 py-4 text-center">Q2</th>
                  <th className="px-6 py-4 text-center">Q3</th>
                  <th className="px-6 py-4 text-center">Q4</th>
                  <th className="px-6 py-4 text-center">Average</th>
                  <th className="px-6 py-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">{student.rank}</td>
                    <td className="px-6 py-5 text-sm text-gray-700">{student.id}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{student.lrn}</td>
                    {["q1", "q2", "q3", "q4"].map((q) => (
                      <td key={q} className="px-6 py-5 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            defaultValue={student[q]}
                            className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <span className="font-medium">{student[q]}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-5 text-center font-bold text-gray-900">
                      {((student.q1 + student.q2 + student.q3 + student.q4) / 4).toFixed(2)}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.remarks === "Excellent" ? "bg-green-100 text-green-800" :
                        student.remarks === "Very Good" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {student.remarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-600">Showing 1-10 of 36 students</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Class Average:</span>
              <span className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold">89.78</span>
            </div>
          </div>
        </div>
      </div>

  );
}
import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

export default function AdminAttendance() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <ClipboardDocumentCheckIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Attendance Monitoring</h2>
        </div>
      </div>

      <p className="text-gray-600">
        Track daily attendance, verify scanned QR codes from teachers, and monitor absence notifications sent to parents.
      </p>

      <div className="bg-red-50 p-6 rounded-lg border border-red-100">
        <h3 className="text-xl font-semibold text-red-800 mb-3">Today's Summary</h3>
        <ul className="text-gray-700 text-sm list-disc ml-5 space-y-1">
          <li>Present: 2,760 students</li>
          <li>Absent: 150 students</li>
          <li>Late: 90 students</li>
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 mt-6">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Daily Attendance List</h3>
          <input
            type="text"
            placeholder="Search LRN or name..."
            className="px-3 py-2 border rounded-lg w-64 outline-none"
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">LRN</th>
              <th className="p-4">Name</th>
              <th className="p-4">Grade & Section</th>
              <th className="p-4">Status</th>
              <th className="p-4">Time In</th>
              <th className="p-4">Time Out</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="p-4">123456789001</td>
              <td className="p-4">Juan Dela Cruz</td>
              <td className="p-4">3 - Acacia</td>
              <td className="p-4 font-semibold text-green-700">Present</td>
              <td className="p-4">7:31 AM</td>
              <td className="p-4">—</td>
            </tr>

            <tr className="border-b">
              <td className="p-4">123456789002</td>
              <td className="p-4">Maria Santos</td>
              <td className="p-4">3 - Acacia</td>
              <td className="p-4 font-semibold text-red-700">Absent</td>
              <td className="p-4">—</td>
              <td className="p-4">—</td>
            </tr>

            <tr className="border-b">
              <td className="p-4">123456789003</td>
              <td className="p-4">Mark Reyes</td>
              <td className="p-4">3 - Acacia</td>
              <td className="p-4 font-semibold text-yellow-600">Late</td>
              <td className="p-4">8:02 AM</td>
              <td className="p-4">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

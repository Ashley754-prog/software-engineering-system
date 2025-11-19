import React from "react";
import { ClipboardDocumentIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function AdminGrades() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <ClipboardDocumentIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Grades Management</h2>
        </div>
      </div>

      <p className="text-gray-600">
        Monitor, update, verify, and review student grades across all subjects. Teachers input grades, 
        and the system automatically computes the final average and ranking.
      </p>

      <div className="bg-red-50 p-6 rounded-lg border border-red-100">
        <h3 className="text-xl font-semibold text-red-800 mb-3">Recent Grade Updates</h3>
        <ul className="text-gray-700 text-sm list-disc ml-5 space-y-1">
          <li>Juan Dela Cruz — Math 95 → 97</li>
          <li>Maria Santos — English 89 → 91</li>
          <li>Mark Reyes — Science 92 → 90</li>
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 mt-6">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">All Students Grades</h3>
          <input
            type="text"
            placeholder="Search student..."
            className="px-3 py-2 border rounded-lg w-64 outline-none"
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">LRN</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Section</th>
              <th className="p-4">Final Average</th>
              <th className="p-4">Rank</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="p-4">123456789001</td>
              <td className="p-4">Juan Dela Cruz</td>
              <td className="p-4">4 - Mahogany</td>
              <td className="p-4 font-semibold">92.4</td>
              <td className="p-4 font-semibold">1</td>
              <td className="p-4 flex justify-center gap-4">
                <PencilSquareIcon className="w-6 h-6 text-blue-600 cursor-pointer" />
                <TrashIcon className="w-6 h-6 text-red-600 cursor-pointer" />
              </td>
            </tr>

            <tr className="border-b">
              <td className="p-4">123456789002</td>
              <td className="p-4">Maria Santos</td>
              <td className="p-4">4 - Mahogany</td>
              <td className="p-4 font-semibold">91.1</td>
              <td className="p-4 font-semibold">2</td>
              <td className="p-4 flex justify-center gap-4">
                <PencilSquareIcon className="w-6 h-6 text-blue-600 cursor-pointer" />
                <TrashIcon className="w-6 h-6 text-red-600 cursor-pointer" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

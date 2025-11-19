import React from "react";
import { UsersIcon, CheckIcon, XMarkIcon, PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";

export default function AdminTeachers() {
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <UsersIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Teachers Management</h2>
        </div>
      </div>

      <p className="text-gray-600 mb-4">
        View, verify, edit, or remove teacher accounts. Assign subjects and classes.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-red-50 rounded-lg text-center shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Total Teachers</h3>
          <p className="text-2xl font-bold">45</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg text-center shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Active Teachers</h3>
          <p className="text-2xl font-bold">39</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg text-center shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Pending Verification</h3>
          <p className="text-2xl font-bold">6</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-red-800 mb-2">Teacher Actions</h3>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Verify new teacher registrations</li>
          <li>Add new teacher manually</li>
          <li>Edit teacher information</li>
          <li>Remove teacher account</li>
          <li>Assign subjects and grade levels</li>
        </ul>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-red-800 mb-4">Pending Teacher Verification</h3>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="p-3 border">Teacher ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Department</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">T-00123</td>
                <td className="p-3 border">Ma’am Jessa Lopez</td>
                <td className="p-3 border">jessalopez@wmsu.edu.ph</td>
                <td className="p-3 border">Elementary</td>
                <td className="p-3 border flex gap-3">
                  <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">T-00125</td>
                <td className="p-3 border">Ma’am Trina Uy</td>
                <td className="p-3 border">trina.uy@wmsu.edu.ph</td>
                <td className="p-3 border">Elementary</td>
                <td className="p-3 border flex gap-3">
                  <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-red-800 mb-4">Active Teachers</h3>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Teacher ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Assigned Grades</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">T-00124</td>
                <td className="p-3 border">Sir Mark Punzalan</td>
                <td className="p-3 border">G5 – Math</td>
                <td className="p-3 border text-green-700 font-semibold">Active</td>
                <td className="p-3 border flex gap-3">
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { AcademicCapIcon, PencilSquareIcon, TrashIcon, CheckIcon, XMarkIcon, QrCodeIcon, EyeIcon } from "@heroicons/react/24/solid";

export default function AdminStudents() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <AcademicCapIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Students Management</h2>
        </div>
      </div>

      <p className="text-gray-600">
        Manage student records, verify accounts, and generate QR codes.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Total Students</h3>
          <p className="text-2xl font-bold">3,000</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Pending Verification</h3>
          <p className="text-2xl font-bold">120</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-red-800 mb-2">Student Actions</h3>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Create accounts for Kinder–Grade 3</li>
          <li>Verify Grade 4–6 student self-registration</li>
          <li>Edit student details</li>
          <li>Delete student accounts</li>
          <li>Regenerate or download QR codes</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/admin/admin/create-k3")}
          className="bg-red-800 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
        >
          + Create Kinder–Grade 3 Account
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-red-800 mb-4">Kinder to Grade 3 Students (Admin Created)</h3>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="p-3 border">LRN</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Grade</th>
                <th className="p-3 border">Section</th>
                <th className="p-3 border">QR</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">204567891234</td>
                <td className="p-3 border">Juan Dela Cruz</td>
                <td className="p-3 border">Grade 1</td>
                <td className="p-3 border">A</td>
                <td className="p-3 border">
                  <button className="p-2 bg-gray-700 text-white rounded-lg hover:bg-black flex items-center gap-1">
                    <QrCodeIcon className="w-5 h-5" /> View
                  </button>
                </td>
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

      <div className="mt-10">
        <h3 className="text-xl font-bold text-red-800 mb-4">Grade 4–6 Students (Pending Verification)</h3>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">LRN</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Grade</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border">305789123456</td>
                <td className="p-3 border">Ana Dela Cruz</td>
                <td className="p-3 border">ana123@gmail.com</td>
                <td className="p-3 border">Grade 4</td>
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
    </div>
  );
}

import React from "react";
import { useParams } from "react-router-dom";
import { UsersIcon } from "@heroicons/react/24/solid";

export default function AdminClassList() {
  const { id } = useParams(); 

  const classInfo = {
    grade: "Grade 2",
    section: "Section B",
  };

  const students = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      lrn: "123456789012",
      sex: "Male",
      grade: "Grade 2",
      section: "B",
    },
    {
      id: 2,
      name: "Maria Santos",
      lrn: "987654321098",
      sex: "Female",
      grade: "Grade 2",
      section: "B",
    },
    {
      id: 3,
      name: "Mark Rivera",
      lrn: "112233445566",
      sex: "Male",
      grade: "Grade 2",
      section: "B",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <UsersIcon className="w-16 h-16 text-red-800" />
          <h2 className="text-4xl font-bold text-gray-900">
            {classInfo.grade} – {classInfo.section} Class List
          </h2>
        </div>
        <p className="text-gray-600">Showing all students enrolled in this class.</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border-b">Student Name</th>
              <th className="p-3 border-b">LRN</th>
              <th className="p-3 border-b">Sex</th>
              <th className="p-3 border-b">Grade Level</th>
              <th className="p-3 border-b">Section</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{student.name}</td>
                <td className="p-3 border-b">{student.lrn}</td>
                <td className="p-3 border-b">{student.sex}</td>
                <td className="p-3 border-b">{student.grade}</td>
                <td className="p-3 border-b">{student.section}</td>

                <td className="p-3 border-b text-center space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">
                    View
                  </button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-700 text-white rounded hover:bg-red-600">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right">
        <button className="bg-red-800 text-white px-5 py-2 rounded-lg hover:bg-red-700">
          + Add Student
        </button>
      </div>
    </div>
  );
}

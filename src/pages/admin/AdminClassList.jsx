import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { UsersIcon } from "@heroicons/react/24/solid";

export default function AdminClassList() {
  const { id } = useParams();
  const location = useLocation();
  const { grade, section } = location.state || {};

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/students");
        const data = await response.json();
        setStudents(data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const classStudents = students.filter(
    (s) =>
      (s.gradeLevel === grade || s.grade === grade) &&
      s.section === section
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <UsersIcon className="w-16 h-16 text-red-800" />
          <h2 className="text-4xl font-bold text-gray-900">
            {grade && section ? `${grade} – ${section} Class List` : "Class List"}
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
            {loading && (
              <tr>
                <td className="p-3 border-b text-gray-600" colSpan={6}>
                  Loading students...
                </td>
              </tr>
            )}
            {!loading && classStudents.length === 0 && (
              <tr>
                <td className="p-3 border-b text-gray-600" colSpan={6}>
                  No students found for this class.
                </td>
              </tr>
            )}
            {!loading && classStudents.map((student) => (
              <tr key={student.id || student.lrn} className="hover:bg-gray-50">
                <td className="p-3 border-b">{student.fullName || student.name}</td>
                <td className="p-3 border-b">{student.lrn}</td>
                <td className="p-3 border-b">{student.sex}</td>
                <td className="p-3 border-b">{student.gradeLevel || student.grade}</td>
                <td className="p-3 border-b">{student.section}</td>

                <td className="p-3 border-b text-center space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">
                    View
                  </button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400">
                    Edit
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

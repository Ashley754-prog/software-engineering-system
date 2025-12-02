import React, { useEffect, useState } from "react";
import { BuildingLibraryIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function AdminClasses() {
  const navigate = useNavigate();
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

  const classMap = new Map();

  students.forEach((s) => {
    const grade = s.gradeLevel || s.grade || "";
    const section = s.section || "";
    if (!grade || !section) return;

    const key = `${grade}__${section}`;
    if (!classMap.has(key)) {
      classMap.set(key, {
        id: key,
        grade,
        section,
        students: 0,
      });
    }
    const cls = classMap.get(key);
    cls.students += 1;
  });

  const classesData = Array.from(classMap.values());

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <BuildingLibraryIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">
            Classes Management
          </h2>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Manage class sections, subjects, and teacher assignments.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
          <h3 className="text-lg font-semibold text-red-800">Total Classes</h3>
          <p className="text-2xl font-bold">{classesData.length}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
          <h3 className="text-lg font-semibold text-red-800">Active Sections</h3>
          <p className="text-2xl font-bold">23</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
          <h3 className="text-lg font-semibold text-red-800">Subjects Offered</h3>
          <p className="text-2xl font-bold">62</p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Class Sections</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && (
            <div className="text-gray-600 col-span-full">Loading classes...</div>
          )}
          {!loading && classesData.length === 0 && (
            <div className="text-gray-600 col-span-full">No classes found.</div>
          )}
          {!loading && classesData.map((cls) => (
            <div
              key={cls.id}
              className="bg-white p-5 rounded-xl border shadow hover:shadow-md transition cursor-pointer"
            >
              <h4 className="text-xl font-bold text-red-800">
                {cls.grade} – {cls.section}
              </h4>
              <p className="text-gray-600 mt-2">
                Students Enrolled: <span className="font-semibold">{cls.students}</span>
              </p>

              <button
                onClick={() =>
                  navigate(`/admin/admin/classlist/${encodeURIComponent(cls.id)}`, {
                    state: { grade: cls.grade, section: cls.section },
                  })
                }
                className="mt-4 w-full bg-red-800 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                View Class List
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

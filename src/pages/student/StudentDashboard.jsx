import React from "react";
import StudentTopbar from "../../layouts/student/StudentTopbar";
import GradesTable from "../../components/student/GradesTable";
import AttendanceCalendar from "../../components/student/AttendanceCalendar";

export default function StudentDashboard() {
  const student = {
    name: "Juan M. Dela Cruz",
    gradeLevel: "Grade 6",
    section: "Honesty",
    age: 12,
    sex: "Male",
    lrn: "123456789012",
    profilePic: "/student-avatar.jpg", 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-montserrat">
      <StudentTopbar studentName={student.name} />
      <main className="pt-20 px-6 lg:px-10 pb-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-200 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <img
                src={student.profilePic}
                alt="Student Profile"
                className="w-45 h-45 rounded-full object-cover border-8 border-red-800 shadow-2xl"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200/4B5565/FFFFFF?text=Student";
                }}
              />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                {student.name}
              </h1>
                <div className="space-y-2 text-lg font-medium text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-10">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-16">Grade:</span>
                      <span className="text-red-800 font-bold text-xl">
                        {student.gradeLevel}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-20">Section:</span>
                      <span className="text-red-800 font-bold text-xl">
                        {student.section}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-12">Age:</span>
                      <span className="text-xl">{student.age} years old</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-10">Sex:</span>
                      <span className="text-xl">{student.sex}</span>
                    </div>
                  </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-10">
                  <span className="text-gray-600 w-1">LRN:</span>
                  <span className="font-mono text-red-800 px-4 rounded-lg text-xl tracking-wider">
                    {student.lrn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
            <div className="p-4 lg:p-8">
              <GradesTable />
            </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-red-800 text-white p-6 text-center">
              <h2 className="text-3xl font-bold tracking-wide">My Attendance Record</h2>
              <p className="text-sm opacity-90 mt-1">Daily Attendance Summary</p>
            </div>
            <div className="p-6">
              <AttendanceCalendar />
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            For inquiries, contact your class adviser or visit the Registrar's Office.
          </p>
          <p className="text-xs mt-2">© 2025 WMSU ILS - Elementary Department</p>
        </div>
      </main>
    </div>
  );
}
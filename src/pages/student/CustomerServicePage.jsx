import React, { useState, useEffect } from "react";
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon,
  XMarkIcon 
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import StudentTopbar from "../../layouts/student/StudentTopbar";

export default function CustomerService() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId || studentId === 'null') {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/student/portal?studentId=${studentId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        setStudentData(result.profile); // ← This is the real student
      } catch (err) {
        console.error('Error loading student data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // LOADING STATE — same style as dashboard
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-8 border-red-900 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-xl text-gray-700">Loading help center...</p>
        </div>
      </div>
    );
  }

  // NO DATA FOUND — helpful message
  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-10 max-w-md">
          <p className="text-2xl font-bold text-red-800 mb-4">No Student Logged In</p>
          <p className="text-gray-600">Please log in first to access this page.</p>
          <button 
            onClick={() => navigate("/student-login")}
            className="mt-6 bg-red-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-800 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-montserrat">
      {/* NOW SHOWS REAL NAME, GRADE, LRN */}
      <StudentTopbar
        studentName={studentData.fullName}
        gradeLevel={studentData.gradeLevel}
        lrn={studentData.lrn}
      />

      <main className="pt-20 px-6 lg:px-12 pb-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-300 overflow-hidden relative">

          <button
            onClick={() => navigate("/student/student-dashboard")}
            className="absolute top-6 right-6 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-10"
            aria-label="Close"
          >
            <XMarkIcon className="w-7 h-7 text-gray-700 hover:text-gray-900 transition-colors duration-200" />
          </button>

          <div className="text-center py-12 px-8 border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
            <h1 className="text-5xl font-bold text-red-900 mb-3">
              Need Help, {studentData.fullName.split(" ")[0]}?
            </h1>
            <p className="text-xl text-gray-700">
              We're here to assist you! Choose the best way to reach us.
            </p>
          </div>

          <div className="p-8 lg:p-12">
            <div className="grid gap-10 md:grid-cols-2">

              <div className="bg-gray-50 rounded-2xl p-8 border-t-8 border-red-800 hover:shadow-xl transition transform hover:-translate-y-1">
                <UserGroupIcon className="w-16 h-16 text-red-800 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Talk to Your Class Adviser</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  For questions about grades, attendance, homework, or behavior — your class adviser is the best person to help!
                </p>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Ask during class time</li>
                  <li>• Write a note in your notebook</li>
                  <li>• Ask your parent to message your adviser</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border-t-8 border-blue-700 hover:shadow-xl transition transform hover:-translate-y-1">
                <MapPinIcon className="w-16 h-16 text-blue-700 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Guidance Office</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Feeling sad? Being bullied? Need someone to talk to?<br />
                  <strong>Go to the Guidance Office</strong> — we care about you!
                </p>
                <p className="text-sm font-bold text-blue-700">Location: Faculty Room (2nd Floor)</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border-t-8 border-green-700 hover:shadow-xl transition transform hover:-translate-y-1">
                <EnvelopeIcon className="w-16 h-16 text-green-700 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Registrar's Office</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Need Form 137, Good Moral Certificate, or enrollment papers?
                </p>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-center gap-3"><PhoneIcon className="w-6 h-6 text-green-600" />(062) 991-1234 loc. 123</p>
                  <p className="flex items-center gap-3"><EnvelopeIcon className="w-6 h-6 text-green-600" />registrar@wmsu-ils.edu.ph</p>
                  <p className="flex items-center gap-3"><ClockIcon className="w-6 h-6 text-green-600" />Mon–Fri: 8:00 AM – 5:00 PM</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border-t-8 border-orange-600 hover:shadow-xl transition transform hover:-translate-y-1">
                <PhoneIcon className="w-16 h-16 text-orange-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Emergency / Principal's Office</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  For accidents, lost items, or any urgent safety concerns
                </p>
                <p className="text-3xl font-bold text-orange-600">Call:Call (062) 991-5678</p>
              </div>

            </div>
          </div>

          <div className="text-center py-8 bg-gradient-to-r from-red-50 to-pink-50 border-t border-gray-200">
            <p className="text-xl font-bold text-red-900">
              Your safety and happiness are important to us, {studentData.fullName.split(" ")[0]}!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
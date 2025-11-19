import React from "react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-montserrat">
      <StudentTopbar studentName="Juan M. Dela Cruz" />

      <main className="pt-20 px-6 lg:px-12 pb-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-300 overflow-hidden relative">

          <button
            onClick={() => navigate("/student/student-dashboard")}
            className="absolute top-6 right-6 p-3 transition-all z-10"
            aria-label="Close"
          >
            <XMarkIcon className="w-7 h-7 text-gray-700 hover:text-gray-900 transition-colors duration-200" />
          </button>

          <div className="text-center py-12 px-8 border-b border-gray-200">
            <h1 className="text-5xl font-bold text-red-900 mb-3">
              Need Help?
            </h1>
            <p className="text-xl text-gray-700">
              We're here to assist you! Choose the best way to reach us.
            </p>
          </div>

          <div className="p-8 lg:p-12">
            <div className="grid gap-10 md:grid-cols-2">

              <div className="bg-gray-50 rounded-2xl p-8 border-t-8 border-red-800 hover:shadow-xl transition">
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

              <div className="bg-gray-50 rounded-2xl p-8 border-t-8 border-blue-700 hover:shadow-xl transition">
                <MapPinIcon className="w-16 h-16 text-blue-700 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Guidance Office</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Feeling sad? Being bullied? Need someone to talk to?<br />
                  <strong>Go to the Guidance Office</strong> — we care about you!
                </p>
                <p className="text-sm font-bold text-blue-700">Location: Faculty Room (2nd Floor)</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border-t-8 border-green-700 hover:shadow-xl transition">
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

              <div className="bg-gray-50 rounded-2xl p-8 border-t-8 border-orange-600 hover:shadow-xl transition">
                <PhoneIcon className="w-16 h-16 text-orange-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Emergency / Principal's Office</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  For accidents, lost items, or any urgent safety concerns
                </p>
                <p className="text-3xl font-bold text-orange-600">Call: (062) 991-5678</p>
              </div>

            </div>
          </div>

          <div className="text-center py-8 bg-gray-50 border-t border-gray-200">
            <p className="text-gray-600 font-medium">
              Your safety and happiness are important to us!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
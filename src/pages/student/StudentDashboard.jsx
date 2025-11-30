import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Calendar, BookOpen } from 'lucide-react';
import authService from '../../api/userService';

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const navigate = useNavigate();

  const gradesData = [
    { subject: 'Mathematics', teacher: 'Ms. Santos', grade: '92', remarks: 'Passed' },
    { subject: 'Science', teacher: 'Mr. Cruz', grade: '88', remarks: 'Passed' },
    { subject: 'English', teacher: 'Mrs. Reyes', grade: '90', remarks: 'Passed' },
    { subject: 'Filipino', teacher: 'Ms. Garcia', grade: '95', remarks: 'Passed' },
    { subject: 'MAPEH', teacher: 'Mr. Torres', grade: '91', remarks: 'Passed' },
  ];

  const attendanceData = [
    { date: 'Nov 18, 2024', day: 'Monday', status: 'Present' },
    { date: 'Nov 19, 2024', day: 'Tuesday', status: 'Present' },
    { date: 'Nov 20, 2024', day: 'Wednesday', status: 'Absent' },
    { date: 'Nov 21, 2024', day: 'Thursday', status: 'Present' },
    { date: 'Nov 22, 2024', day: 'Friday', status: 'Present' },
  ];

  const scheduleData = [
    { time: '8:00 AM - 9:00 AM', subject: 'Mathematics', teacher: 'Ms. Santos' },
    { time: '9:00 AM - 10:00 AM', subject: 'Science', teacher: 'Mr. Cruz' },
    { time: '10:00 AM - 11:00 AM', subject: 'English', teacher: 'Mrs. Reyes' },
    { time: '11:00 AM - 12:00 PM', subject: 'Filipino', teacher: 'Ms. Garcia' },
    { time: '1:00 PM - 2:00 PM', subject: 'MAPEH', teacher: 'Mr. Torres' },
  ];

  const downloadGrades = () => {
    const csvContent = "Subject,Teacher,Grade,Remarks\n" + 
      gradesData.map(row => `${row.subject},${row.teacher},${row.grade},${row.remarks}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grades_grade3_wisdom.csv';
    a.click();
  };

  const downloadAttendance = () => {
    const csvContent = "Date,Day,Status\n" + 
      attendanceData.map(row => `${row.date},${row.day},${row.status}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_grade3_wisdom.csv';
    a.click();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-red-900 to-red-800 text-white rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-red-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Grade 3 - Wisdom</h2>
              <p className="text-red-100">Student Name: Juan Dela Cruz</p>
              <p className="text-red-100">Student ID: 2024-00123</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-red-900 font-semibold px-4 py-2 rounded-md shadow-sm hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('grades')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition ${
              activeTab === 'grades'
                ? 'bg-red-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Grades
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition ${
              activeTab === 'attendance'
                ? 'bg-red-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition ${
              activeTab === 'schedule'
                ? 'bg-red-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Schedule
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">

          {activeTab === 'grades' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Student Grades (View Only)</h3>
                <button
                  onClick={downloadGrades}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  Download Grades
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Teacher</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradesData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{item.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.teacher}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {item.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {item.remarks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Grades are view-only and cannot be modified. For any concerns, please contact your teacher.
                </p>
              </div>
            </div>
          )}


          {activeTab === 'attendance' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Student Attendance</h3>
                <button
                  onClick={downloadAttendance}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  Download Attendance
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Day</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{item.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.day}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === 'Present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Present</p>
                  <p className="text-2xl font-bold text-green-700">18</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Absent</p>
                  <p className="text-2xl font-bold text-red-700">2</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-blue-700">90%</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Student Schedule</h3>
              <div className="space-y-3">
                {scheduleData.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{item.subject}</p>
                        <p className="text-sm text-gray-600">{item.teacher}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-900">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
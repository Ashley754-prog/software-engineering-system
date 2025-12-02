import React, { useState, useEffect } from "react";
import {
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  Bars3BottomLeftIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function EditGrades() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedQuarter, setSelectedQuarter] = useState("All Quarters");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("All Grades");
  const [selectedSection, setSelectedSection] = useState("All Sections");

  // Modal state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeData, setGradeData] = useState({});

  // CORRECT SUBJECTS PER GRADE LEVEL — CLIENT-APPROVED
  const subjectsByGrade = {
    "Kindergarten": ["Reading", "Writing", "Math Readiness", "Arts", "Physical Education"], // As is for now
    "Grade 1": ["GMRC", "Reading", "Math", "Makabansa", "Language"],
    "Grade 2": ["GMRC", "Filipino", "Makabansa", "Math", "English"],
    "Grade 3": ["GMRC", "Filipino", "Math", "Makabansa", "English", "Science"],
    "Grade 4": ["GMRC", "English", "Araling Panlipunan", "Math", "Filipino", "EPP", "Science", "MAPEH"],
    "Grade 5": ["GMRC", "English", "Araling Panlipunan", "Math", "Filipino", "EPP", "Science", "MAPEH"],
    "Grade 6": ["GMRC", "English", "Araling Panlipunan", "Math", "Filipino", "EPP", "Science", "MAPEH"],
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/students');
      const data = await response.json();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  // Open grade modal for a student
  const openGradeModal = (student) => {
    setSelectedStudent(student);
    
    const subjects = subjectsByGrade[student.gradeLevel] || [];
    const initialGrades = {};
    
    subjects.forEach(subject => {
      initialGrades[subject] = {
        q1: student.grades?.[subject]?.q1 || 0,
        q2: student.grades?.[subject]?.q2 || 0,
        q3: student.grades?.[subject]?.q3 || 0,
        q4: student.grades?.[subject]?.q4 || 0,
      };
    });
    
    setGradeData(initialGrades);
    setShowGradeModal(true);
  };

  // Calculate average for a subject
  const calculateSubjectAverage = (subject) => {
    const grades = gradeData[subject];
    if (!grades) return 0;
    const sum = grades.q1 + grades.q2 + grades.q3 + grades.q4;
    return (sum / 4).toFixed(2);
  };

  // Calculate final average (all subjects)
  const calculateFinalAverage = () => {
    const subjects = Object.keys(gradeData);
    if (subjects.length === 0) return 0;
    
    const total = subjects.reduce((sum, subject) => {
      return sum + parseFloat(calculateSubjectAverage(subject));
    }, 0);
    
    return (total / subjects.length).toFixed(2);
  };

  // Get remarks based on average
  const getRemarks = (average) => {
    if (average >= 90) return "Outstanding";
    if (average >= 85) return "Very Satisfactory";
    if (average >= 80) return "Satisfactory";
    if (average >= 75) return "Fairly Satisfactory";
    return "Did Not Meet Expectations";
  };

// Handle grade input change — NOW PERFECT
const handleGradeChange = (subject, quarter, value) => {
  // Allow empty string (when user clears), but convert to 0 for storage
  const numValue = value === "" ? 0 : Math.min(100, Math.max(0, parseInt(value) || 0));

  setGradeData(prev => ({
    ...prev,
    [subject]: {
      ...prev[subject],
      [quarter]: numValue
    }
  }));
};

  // Save grades to backend
  const saveGrades = async () => {
    try {
      const finalAverage = calculateFinalAverage();
      
      const response = await fetch(`http://localhost:3001/api/students/${selectedStudent.id}/grades`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grades: gradeData,
          average: parseFloat(finalAverage)
        })
      });

      if (response.ok) {
        alert('Grades saved successfully!');
        fetchStudents();
        setShowGradeModal(false);
      } else {
        alert('Failed to save grades');
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Error: ' + error.message);
    }
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesGrade =
      selectedGradeLevel === "All Grades" ||
      student.gradeLevel === selectedGradeLevel;

    const matchesSection =
      selectedSection === "All Sections" ||
      student.section === selectedSection;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      student.fullName.toLowerCase().includes(query) ||
      student.lrn.includes(searchQuery);

    return matchesGrade && matchesSection && matchesSearch;
  });

  // Class statistics
  const classAverage = students.length > 0
    ? (students.reduce((sum, s) => sum + (s.average || 0), 0) / students.length).toFixed(2)
    : 0;

  const highestGrade = students.length > 0
    ? Math.max(...students.map(s => s.average || 0))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpenIcon className="w-10 h-10 text-red-800" />
          Edit Grades
        </h2>

        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 text-sm font-medium shadow-md">
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export Grades
          </button>
          <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm font-medium shadow-md">
            <PrinterIcon className="w-5 h-5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{students.length}</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-red-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Class Average</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{classAverage}</p>
            </div>
            <ArrowTrendingUpIcon className="w-12 h-12 text-orange-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Highest Grade</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{highestGrade}</p>
            </div>
            <AcademicCapIcon className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Graded Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {students.filter(s => s.average > 0).length}
              </p>
            </div>
            <Bars3BottomLeftIcon className="w-12 h-12 text-purple-600 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filter Section — NOW INCLUDES GRADE 4-6 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedGradeLevel}
              onChange={(e) => setSelectedGradeLevel(e.target.value)}
            >
              <option>All Grades</option>
              <option>Kindergarten</option>
              <option>Grade 1</option>
              <option>Grade 2</option>
              <option>Grade 3</option>
              <option>Grade 4</option>
              <option>Grade 5</option>
              <option>Grade 6</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option>All Sections</option>
              <option>Love</option>
              <option>Humility</option>
              <option>Kindness</option>
              <option>Diligence</option>
              <option>Wisdom</option>
              <option>Section A</option>
              <option>Section B</option>
              <option>Section C</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Student</label>
            <input
              type="text"
              placeholder="Name or LRN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Students Table & Modal — UNCHANGED LOGIC, JUST CORRECT SUBJECTS */}
      {/* ... [rest of your table and modal code is 100% the same as before] ... */}

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Student List - Click Name to Edit Grades</h3>
          <p className="text-sm text-gray-600 mt-1">Click on any student's name to edit their grades</p>
        </div>

        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">LRN</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Grade & Section</th>
                <th className="px-6 py-4 text-center">Final Average</th>
                <th className="px-6 py-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading students...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No students found</td></tr>
              ) : (
                filteredStudents
                  .sort((a, b) => (b.average || 0) - (a.average || 0))
                  .map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-mono">{student.lrn}</td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => openGradeModal(student)}
                          className="font-medium text-red-600 hover:text-red-800 hover:underline transition"
                        >
                          {student.fullName}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {student.gradeLevel} - {student.section}
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-gray-900">
                        {student.average || "No grades yet"}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (student.average || 0) >= 90 ? "bg-green-100 text-green-800" :
                          (student.average || 0) >= 85 ? "bg-blue-100 text-blue-800" :
                          (student.average || 0) >= 80 ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {student.average ? getRemarks(student.average) : "Not graded"}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {filteredStudents.length} student(s)
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Class Average:</span>
            <span className="px-6 py-2 bg-red-100 text-red-800 rounded-lg font-bold">{classAverage}</span>
          </div>
        </div>
      </div>

      {/* Grade Edit Modal — NOW SHOWS CORRECT SUBJECTS */}
      {showGradeModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="sticky top-0 bg-red-600 text-white px-8 py-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h3 className="text-2xl font-bold">{selectedStudent.fullName}</h3>
                <p className="text-red-100 text-sm mt-1">
                  {selectedStudent.gradeLevel} - {selectedStudent.section} | LRN: {selectedStudent.lrn}
                </p>
              </div>
              <button onClick={() => setShowGradeModal(false)} className="text-white hover:text-red-200 transition">
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border">Subject</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700 border">Q1</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700 border">Q2</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700 border">Q3</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700 border">Q4</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700 border bg-blue-50">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(gradeData).map((subject) => (
                      <tr key={subject} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 border">{subject}</td>
                        {['q1', 'q2', 'q3', 'q4'].map((quarter) => (
                          <td key={quarter} className="px-4 py-3 border">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              value={gradeData[subject][quarter] === 0 ? "" : gradeData[subject][quarter]}
                              onChange={(e) => handleGradeChange(subject, quarter, e.target.value)}
                              className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition font-medium"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center font-bold text-blue-700 border bg-blue-50">
                          {calculateSubjectAverage(subject)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td colSpan="5" className="px-4 py-4 text-right font-bold text-gray-900 border">
                        Final Average:
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-green-700 border text-2xl">
                        {calculateFinalAverage()}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="px-4 py-3 text-right font-semibold text-gray-700 border">
                        Remarks:
                      </td>
                      <td className="px-4 py-3 text-center font-semibold border">
                        <span className={`px-4 py-2 rounded-full text-sm ${
                          parseFloat(calculateFinalAverage()) >= 90 ? "bg-green-100 text-green-800" :
                          parseFloat(calculateFinalAverage()) >= 85 ? "bg-blue-100 text-blue-800" :
                          parseFloat(calculateFinalAverage()) >= 80 ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {getRemarks(parseFloat(calculateFinalAverage()))}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={saveGrades}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
                >
                  Save Grades
                </button>
                <button
                  onClick={() => setShowGradeModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
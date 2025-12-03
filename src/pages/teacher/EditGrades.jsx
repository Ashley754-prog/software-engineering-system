import React, { useState, useEffect } from "react";
import {
  BookOpenIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  Bars3BottomLeftIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  LockClosedIcon as LockClosedSolidIcon,
} from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/24/outline";

// Function to determine current quarter based on date
const getCurrentQuarter = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  // Adjust these month ranges based on your academic calendar
  if (month >= 6 && month <= 8) return 1; // Q1: June-August
  if (month >= 9 && month <= 11) return 2; // Q2: September-November
  if (month === 12 || month <= 2) return 3; // Q3: December-February
  return 4; // Q4: March-May
};

// Mock current quarter - In a real app, this would come from your backend
const CURRENT_QUARTER = getCurrentQuarter(); // 1, 2, 3, or 4

export default function EditGrades() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("All Grades");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [currentQuarter, setCurrentQuarter] = useState(1);

  // User context - In a real app, this would come from your auth context
  const [currentUser, setCurrentUser] = useState({
    role: 'adviser', // 'adviser' or 'subject_teacher'
    subjects: ['Mathematics', 'Science'], // Subjects this teacher handles
    section: 'Love', // Only for adviser role
    gradeLevel: 'Grade 4' // Only for adviser role
  });

  // Modal state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeData, setGradeData] = useState({});
  const [editHistory, setEditHistory] = useState({});
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [requestType, setRequestType] = useState('edit'); // 'edit' or 'rewrite'

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
      return data;
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
      return [];
    }
  };

  const openGradeModal = async (student) => {
  try {
    // Fetch fresh student data from backend to get latest grades
    const res = await fetch(`http://localhost:3001/api/students/${student.id}/with-grades`);
    const freshStudent = await res.json();
    setSelectedStudent(freshStudent);

    // Get subjects based on user role
    let subjectsToShow = [];
    if (currentUser.role === 'adviser') {
      subjectsToShow = subjectsByGrade[freshStudent.gradeLevel] || [];
    } else {
      subjectsToShow = (subjectsByGrade[freshStudent.gradeLevel] || [])
        .filter(subject => currentUser.subjects.includes(subject));
    }

    const initialGrades = {};
    const initialEditHistory = {};

    subjectsToShow.forEach(subject => {
      // Use saved grades from backend, treating null as not yet graded
      initialGrades[subject] = {
        q1: freshStudent.grades?.[subject]?.q1 !== null && freshStudent.grades?.[subject]?.q1 !== undefined 
          ? freshStudent.grades[subject].q1 
          : undefined,
        q2: freshStudent.grades?.[subject]?.q2 !== null && freshStudent.grades?.[subject]?.q2 !== undefined 
          ? freshStudent.grades[subject].q2 
          : undefined,
        q3: freshStudent.grades?.[subject]?.q3 !== null && freshStudent.grades?.[subject]?.q3 !== undefined 
          ? freshStudent.grades[subject].q3 
          : undefined,
        q4: freshStudent.grades?.[subject]?.q4 !== null && freshStudent.grades?.[subject]?.q4 !== undefined 
          ? freshStudent.grades[subject].q4 
          : undefined,
      };

      initialEditHistory[subject] = {
        q1: freshStudent.grades?.[subject]?.q1 !== null && freshStudent.grades?.[subject]?.q1 !== undefined,
        q2: freshStudent.grades?.[subject]?.q2 !== null && freshStudent.grades?.[subject]?.q2 !== undefined,
        q3: freshStudent.grades?.[subject]?.q3 !== null && freshStudent.grades?.[subject]?.q3 !== undefined,
        q4: freshStudent.grades?.[subject]?.q4 !== null && freshStudent.grades?.[subject]?.q4 !== undefined,
      };
    });

    setGradeData(initialGrades);
    setEditHistory(initialEditHistory);
    
    // Find the first incomplete quarter to set as current
    // But if the current quarter is already complete, move to the next one
    const incompleteQuarter = [1, 2, 3, 4].find(q => 
      !subjectsToShow.every(subject => 
        freshStudent.grades?.[subject]?.[`q${q}`] !== null && 
        freshStudent.grades?.[subject]?.[`q${q}`] !== undefined
      )
    );
    
    // If all quarters are complete, set to 5 (beyond Q4) so all quarters show as "Submitted"
    // Otherwise, use the incomplete quarter found
    const newCurrentQuarter = incompleteQuarter || 5;
    console.log('=== DEBUGGING ===');
    console.log('Fresh student grades:', freshStudent.grades);
    console.log('Incomplete quarter found:', incompleteQuarter);
    console.log('Setting currentQuarter to:', newCurrentQuarter);
    setCurrentQuarter(newCurrentQuarter);
    setShowGradeModal(true);
  } catch (err) {
    console.error("Failed to fetch student data:", err);
    alert("Failed to load student data. Please try again.");
  }
};

  // Calculate average for a subject (DepEd Formula: Q1 + Q2 + Q3 + Q4) / 4
  const calculateSubjectAverage = (subject) => {
    const grades = gradeData[subject];
    if (!grades) return "0.00";
    
    // Get all quarter grades, treating undefined as 0 for calculation
    const q1 = typeof grades.q1 === 'number' ? grades.q1 : 0;
    const q2 = typeof grades.q2 === 'number' ? grades.q2 : 0;
    const q3 = typeof grades.q3 === 'number' ? grades.q3 : 0;
    const q4 = typeof grades.q4 === 'number' ? grades.q4 : 0;
    
    // DepEd Formula: (Q1 + Q2 + Q3 + Q4) / 4
    const sum = q1 + q2 + q3 + q4;
    return (sum / 4).toFixed(2);
  };

  // Calculate final average (DepEd Formula: Average of all subject final grades)
  const calculateFinalAverage = () => {
    const subjects = Object.keys(gradeData);
    if (subjects.length === 0) return "0.00";

    // Calculate final grade for each subject using DepEd formula
    const subjectFinalGrades = subjects.map(subject => {
      const grades = gradeData[subject];
      if (!grades) return null;
      
      // Get all quarter grades, treating undefined as 0 for calculation
      const q1 = typeof grades.q1 === 'number' ? grades.q1 : 0;
      const q2 = typeof grades.q2 === 'number' ? grades.q2 : 0;
      const q3 = typeof grades.q3 === 'number' ? grades.q3 : 0;
      const q4 = typeof grades.q4 === 'number' ? grades.q4 : 0;
      
      // DepEd Formula: (Q1 + Q2 + Q3 + Q4) / 4
      const finalGrade = (q1 + q2 + q3 + q4) / 4;
      return finalGrade;
    }).filter(grade => grade !== null);

    if (subjectFinalGrades.length === 0) return "0.00";

    // Final Average: Average of all subject final grades
    const total = subjectFinalGrades.reduce((sum, grade) => sum + grade, 0);
    return (total / subjectFinalGrades.length).toFixed(2);
  };

  // Get remarks based on average
  const getRemarks = (average) => {
    if (average >= 90) return "Outstanding";
    if (average >= 85) return "Very Satisfactory";
    if (average >= 80) return "Satisfactory";
    if (average >= 75) return "Fairly Satisfactory";
    return "Did Not Meet Expectations";
  };

  // Handle grade input change with quarter validation
  const handleGradeChange = (subject, quarter, value) => {
    const quarterNum = parseInt(quarter.substring(1));
    
    // Only allow editing the currently selected quarter
    if (quarterNum !== currentQuarter) return;

    // Allow empty string (when user clears) -> set to undefined so it shows blank
    if (value === "") {
      setGradeData(prev => ({
        ...prev,
        [subject]: {
          ...(prev[subject] || {}),
          [quarter]: undefined
        }
      }));

      setEditHistory(prev => ({
        ...prev,
        [subject]: {
          ...(prev[subject] || {}),
          [quarter]: false
        }
      }));
      return;
    }

    // convert to number and clamp
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));

    // Update the grade data
    setGradeData(prev => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || {}),
        [quarter]: numValue
      }
    }));

    // Update edit history to mark this quarter as edited
    setEditHistory(prev => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || {}),
        [quarter]: true
      }
    }));
  };

  // Check if a grade field should be disabled
  const isGradeDisabled = (quarter) => {
    const quarterNum = parseInt(quarter.substring(1));
    // Only disable if it's not the current quarter
    return quarterNum !== currentQuarter;
  };

  // Get status text for a grade field
  const getGradeStatus = (subject, quarter) => {
    const quarterNum = parseInt(quarter.substring(1));
    const present = editHistory[subject]?.[quarter] || (gradeData[subject]?.[quarter] !== undefined);

    console.log(`=== STATUS DEBUG ===`);
    console.log(`Subject: ${subject}, Quarter: ${quarter}`);
    console.log(`QuarterNum: ${quarterNum}, CurrentQuarter: ${currentQuarter}`);
    console.log(`Present: ${present}, EditHistory: ${editHistory[subject]?.[quarter]}`);
    console.log(`GradeData: ${gradeData[subject]?.[quarter]}`);

    if (quarterNum === currentQuarter) {
      return present ? 'Editable' : 'Pending';
    }

    return present ? 'Submitted (View Only)' : 'Not Submitted';
  };

  const saveGrades = async () => {
    try {
      const finalAverage = calculateFinalAverage();

      const updatedGrades = { ...(selectedStudent.grades || {}) };

      Object.keys(gradeData).forEach(subject => {
        if (!updatedGrades[subject]) updatedGrades[subject] = {};
        // Save the actual value, don't convert undefined to 0
        const val = gradeData[subject][`q${currentQuarter}`];
        if (typeof val === 'number') {
          updatedGrades[subject][`q${currentQuarter}`] = val;
        }
      });

      const allQuartersComplete = [1, 2, 3, 4].every(q => {
        const key = `q${q}`;
        return Object.values(updatedGrades).every(subj => 
          subj[key] !== null && subj[key] !== undefined
        );
      });

      const saveData = {
        grades: updatedGrades,
        average: parseFloat(finalAverage),
        updatedBy: currentUser.role,
        updatedAt: new Date().toISOString()
      };

      if (allQuartersComplete) {
        saveData.status = 'completed';
      }

      const response = await fetch(`http://localhost:3001/api/students/${selectedStudent.id}/grades`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        
        // Update selectedStudent with fresh data from backend
        setSelectedStudent(updatedStudent);
        
        // Update students list
        setStudents(prev =>
          prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
        );

        // Show appropriate message
        if (allQuartersComplete) {
          alert('All quarters completed! Grades are now visible in Student Dashboard.');
        } else {
          alert(`Quarter ${currentQuarter} grades saved! Grades are now visible in Student Dashboard.`);
        }
        
        // Close modal after saving
        setShowGradeModal(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save grades');
      }
    } catch (error) {
      console.error('Error saving grades:', error);
      alert(`Error: ${error.message || 'Failed to save grades. Please try again.'}`);
    }
  };

  // Submit grade edit request to admin
  const submitGradeRequest = async () => {
    try {
      if (!requestReason.trim()) {
        alert('Please provide a reason for your request.');
        return;
      }

      const requestData = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        gradeLevel: selectedStudent.gradeLevel,
        section: selectedStudent.section,
        teacherName: currentUser.role === 'adviser' ? 'Adviser' : 'Subject Teacher',
        requestType: requestType, // 'edit' or 'rewrite'
        reason: requestReason,
        quarter: currentQuarter,
        subject: currentUser.role === 'subject_teacher' ? currentUser.subjects.join(', ') : 'All Subjects',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3001/api/grade-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('Grade edit request submitted successfully! Admin will review your request.');
        setShowRequestModal(false);
        setRequestReason('');
        setRequestType('edit');
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  // Filter students based on user role and filters
  const filteredStudents = students.filter(student => {
    // For subject teachers, only show students in their grade level and section
    if (currentUser.role === 'subject_teacher') {
      if (student.gradeLevel !== currentUser.gradeLevel) return false;
      if (student.section !== currentUser.section) return false;
    }

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

      {/* Filter Section with Quarter Selection */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Quarter Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quarter</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((q) => (
                <button
                  key={q}
                  onClick={() => setCurrentQuarter(q)}
                  className={`py-2 rounded-lg font-medium transition ${
                    q === currentQuarter
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                  title={`Switch to Q${q}`}
                >
                  Q{q}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentQuarter === 1 && 'Q1: August - September'}
              {currentQuarter === 2 && 'Q2: October - December'}
              {currentQuarter === 3 && 'Q3: January - March'}
              {currentQuarter === 4 && 'Q4: March - May'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedGradeLevel}
              onChange={(e) => setSelectedGradeLevel(e.target.value)}
              disabled={currentUser.role === 'subject_teacher'}
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
              disabled={currentUser.role === 'subject_teacher'}
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

{/* Grade Edit Modal - FULLY RESTORED UI + PERFECT LOGIC */}
{showGradeModal && selectedStudent && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[95vh] flex flex-col overflow-hidden">

      {/* HEADER - YOUR ORIGINAL RED HEADER */}
      <div className="bg-red-600 text-white px-8 py-6 flex justify-between items-center rounded-t-2xl z-10 shrink-0">
        <div>
          <h3 className="text-2xl font-bold">{selectedStudent.fullName}</h3>
          <p className="text-red-100 text-sm mt-1">
            {selectedStudent.gradeLevel} - {selectedStudent.section} | LRN: {selectedStudent.lrn}
          </p>
        </div>
      </div>

      {/* QUARTER TABS INSIDE MODAL - YOUR ORIGINAL STYLE */}
      <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 shrink-0">
        <div className="flex gap-3 justify-center">
          {[1, 2, 3, 4].map((q) => (
            <button
              key={q}
              onClick={() => setCurrentQuarter(q)}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                q === currentQuarter
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Quarter {q}
            </button>
          ))}
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-8">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-100 sticky top-0 z-10">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border">Subject</th>
                {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                  <th key={q} className="px-4 py-3 text-center font-semibold text-gray-700 border">{q}</th>
                ))}
                <th className="px-4 py-3 text-center font-semibold text-gray-700 border bg-blue-50">Average</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(gradeData).map(subject => (
                <tr key={subject} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 border">{subject}</td>

                  {['q1', 'q2', 'q3', 'q4'].map((quarter) => {
                    const quarterNum = parseInt(quarter.substring(1));
                    const rawVal = gradeData[subject]?.[quarter];
                    const value = rawVal !== undefined ? rawVal : undefined;
                    const isCurrent = quarterNum === currentQuarter;
                    const hasGrade = typeof value === 'number' && value >= 0; // Changed from > 0 to >= 0

                    return (
                      <td key={quarter} className="px-4 py-3 border text-center">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={value !== undefined ? value : ''}
                            onChange={(e) => handleGradeChange(subject, quarter, e.target.value)}
                            disabled={!isCurrent}
                            className={`w-20 h-10 text-center border rounded-lg px-3 py-2 font-medium transition-all ${
                              isCurrent
                                ? "bg-white border-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-text"
                                : hasGrade
                                ? "bg-green-50 text-green-800 border-green-300 cursor-default"
                                : "bg-yellow-50 text-gray-600 border-yellow-200 cursor-not-allowed"
                            }`}
                            placeholder={isCurrent ? "0" : ""}
                          />
                        </div>
                        <div className={`text-xs mt-1 ${
                          hasGrade ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {isCurrent ? 'Editable' : hasGrade ? 'Submitted' : 'Not Submitted'}
                        </div>
                      </td>
                    );
                  })}

                  <td className="px-4 py-3 text-center font-bold text-blue-700 border bg-blue-50">
                    {calculateSubjectAverage(subject)}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan="5" className="px-4 py-4 text-right text-gray-900 border">
                  Final Average:
                </td>
                <td className="px-4 py-4 text-center text-green-700 border text-2xl">
                  {calculateFinalAverage()}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan="5" className="px-4 py-3 text-right font-semibold text-gray-700 border">
                  Remarks:
                </td>
                <td className="px-4 py-3 text-center border">
                  <span className={`px-6 py-3 rounded-full text-lg font-bold ${
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

        {/* YOUR ORIGINAL SAVE BUTTONS */}
        <div className="flex gap-4 mt-8 pb-8">
          <button
            onClick={saveGrades}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
          >
            Save Grades (Q{currentQuarter})
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
          >
            Request Grade Edit
          </button>
          <button
            onClick={() => setShowGradeModal(false)}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Grade Edit Request Modal */}
{showRequestModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
      <div className="bg-orange-600 text-white px-8 py-6 rounded-t-2xl">
        <h3 className="text-2xl font-bold">Request Grade Edit</h3>
        <p className="text-orange-100 text-sm mt-1">
          {selectedStudent?.fullName} - {selectedStudent?.gradeLevel} - {selectedStudent?.section}
        </p>
      </div>

      <div className="p-8">
        <div className="space-y-6">
          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="edit"
                  checked={requestType === 'edit'}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mr-2"
                />
                <span>Edit Existing Grades</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="rewrite"
                  checked={requestType === 'rewrite'}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mr-2"
                />
                <span>Rewrite All Grades</span>
              </label>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Request <span className="text-red-500">*</span>
            </label>
            <textarea
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Please explain why you need to edit/rewrite these grades..."
            />
          </div>

          {/* Request Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Request Details:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Student:</strong> {selectedStudent?.fullName}</p>
              <p><strong>Grade Level:</strong> {selectedStudent?.gradeLevel}</p>
              <p><strong>Section:</strong> {selectedStudent?.section}</p>
              <p><strong>Quarter:</strong> Q{currentQuarter}</p>
              <p><strong>Teacher:</strong> {currentUser.role === 'adviser' ? 'Adviser' : 'Subject Teacher'}</p>
              <p><strong>Subjects:</strong> {currentUser.role === 'subject_teacher' ? currentUser.subjects.join(', ') : 'All Subjects'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={submitGradeRequest}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold transition shadow-lg"
          >
            Submit Request
          </button>
          <button
            onClick={() => {
              setShowRequestModal(false);
              setRequestReason('');
              setRequestType('edit');
            }}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition shadow-lg"
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

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CreateAccount from "./pages/auth/CreateAccount";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import StudentsLogin from "./pages/auth/StudentsLogin.jsx";

import StudentTopbar from "./layouts/student/StudentTopbar.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentProfile from "./pages/student/StudentProfile.jsx";
import GradesTable from "./components/student/GradesTable.jsx";
import AttendanceCalendar from "./components/student/AttendanceCalendar.jsx";
import CustomerServicePage from "./pages/student/CustomerServicePage.jsx";

import TeacherLayout from "./layouts/teacher/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import GradeLevel from "./pages/teacher/GradeLevel.jsx";
import EditGrades from "./pages/teacher/EditGrades.jsx";
import ClassList from "./pages/teacher/ClassList";
import ReportsPage from "./pages/teacher/ReportsPage";
import CustomerService from "./pages/teacher/CustomerService";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import TeacherSettings from "./pages/teacher/TeacherSettings.jsx";
import QRPortal from "./pages/teacher/QRPortal.jsx";

import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCreateStudentAccounts from "./pages/admin/AdminCreateStudentAccounts.jsx";
import AdminGrades from "./pages/admin/AdminGrades";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminClassList from "./pages/admin/AdminClassList.jsx";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminCreateTeacher from "./pages/admin/AdminCreateTeacher.jsx";

// ONLY THIS PART IS NEW — PROTECTS STUDENT PAGES ONLY
const StudentRoute = ({ children }) => {
  const studentId = localStorage.getItem("studentId");
  return studentId ? children : <Navigate to="/students-login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ROOT — TEACHER/ADMIN SEE CREATE ACCOUNT FIRST */}
        <Route path="/" element={<Navigate to="/create-account" replace />} />

        {/* THESE ARE FOR TEACHER & ADMIN — UNTOUCHED */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* STUDENT LOGIN — ONLY STUDENTS SEE THIS */}
        <Route path="/students-login" element={<StudentsLogin />} />

        {/* STUDENT PAGES — WRAPPED WITH PROTECTION */}
        <Route
          path="/student/student-dashboard"
          element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          }
        />
        <Route
          path="/student/student-profile"
          element={
            <StudentRoute>
              <StudentProfile />
            </StudentRoute>
          }
        />
        <Route
          path="/student/grades-table"
          element={
            <StudentRoute>
              <GradesTable />
            </StudentRoute>
          }
        />
        <Route
          path="/student/attendance-calendar"
          element={
            <StudentRoute>
              <AttendanceCalendar />
            </StudentRoute>
          }
        />
        <Route
          path="/student/customer-service-page"
          element={
            <StudentRoute>
              <CustomerServicePage />
            </StudentRoute>
          }
        />

        {/* TEACHER ROUTES — 100% UNTOUCHED */}
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/teacher-profile" element={<TeacherProfile />} />
          <Route path="/grade-level" element={<GradeLevel />} />
          <Route path="/edit-grades" element={<EditGrades />} />
          <Route path="/class-list" element={<ClassList />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/teacher-settings" element={<TeacherSettings />} />
          <Route path="/qr-portal" element={<QRPortal />} />
        </Route>

        {/* ADMIN ROUTES — 100% UNTOUCHED */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/admin-teachers" element={<AdminTeachers />} />
          <Route path="/admin/admin-students" element={<AdminStudents />} />
          <Route path="/admin/admin/create-students-accounts" element={<AdminCreateStudentAccounts />} />
          <Route path="/admin/admin-grades" element={<AdminGrades />} />
          <Route path="/admin/admin-classes" element={<AdminClasses />} />
          <Route path="/admin/admin/classlist/:id" element={<AdminClassList />} />
          <Route path="/admin/admin-attendance" element={<AdminAttendance />} />
          <Route path="/admin/admin-reports" element={<AdminReports />} />
          <Route path="/admin/admin-settings" element={<AdminSettings />} />
          <Route path="/admin/create-teacher" element={<AdminCreateTeacher />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-20 text-center text-3xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
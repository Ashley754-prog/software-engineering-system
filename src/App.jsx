import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoleSelection from "./pages/auth/RoleSelection";
import ForgotPassword from "./pages/auth/ForgotPassword";
import StudentLoginPage from "./pages/student/StudentLoginPage";
import StudentCreateAccount from "./pages/student/StudentCreateAccount";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherLoginPage from "./pages/teacher/TeacherLoginPage";
import TeacherCreateAccount from "./pages/teacher/TeacherCreateAccount";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import GradesPortal from "./pages/teacher/GradesPortal";
import ClassList from "./pages/teacher/ClassList";
import AttendancePage from "./pages/teacher/AttendancePage";
import ReportsPage from "./pages/teacher/ReportsPage";
import CustomerService from "./pages/teacher/CustomerService";

function App() {
return ( <Router> <Routes>
<Route path="/" element={<Navigate to="/role-selection" />} />
    <Route path="/role-selection" element={<RoleSelection />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    <Route path="/student/student-login" element={<StudentLoginPage />} />
    <Route path="/student/student-create-account" element={<StudentCreateAccount />} />
    <Route path="/student/student-dashboard" element={<StudentDashboard />} />

    <Route path="/teacher/teacher-login" element={<TeacherLoginPage />} />
    <Route path="/teacher/teacher-create-account" element={<TeacherCreateAccount />} />
    <Route element={<TeacherLayout />}>
      <Route path="/teacher/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/grades-portal" element={<GradesPortal />} />
      <Route path="/class-list" element={<ClassList />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/customer-service" element={<CustomerService />} />
    </Route>
  </Routes>
</Router>

);
}

export default App;

import { useNavigate } from "react-router-dom";
import { UserIcon, UserGroupIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

export default function RoleSelection() {
const navigate = useNavigate();

const handleSelectRole = (role) => {
if (role === "student") navigate("/student/student-create-account");
else if (role === "teacher") navigate("/teacher/teacher-create-account");
else if (role === "admin") navigate("/admin/admin-create-account");
};

const handleLogin = (role) => {
navigate(`/${role}/${role}-login`);
};

return ( 
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center font-montserrat"
      style={{ backgroundImage: "url('/wmsu-bg-se.png')" }}
    > 
    <div className="relative bg-white border border-gray-300 rounded-xl shadow-lg w-[740px] p-10 text-center animate-fadeIn">
    <div className="flex flex-row gap-6 items-center mb-6 justify-center">
      <img
        src="/wmsu-logo.jpg"
        alt="WMSU Logo"
        className="w-26 h-26 rounded-full object-cover"
      />
      <h2 className="text-[17px] text-red-800 font-bold leading-snug text-center">
        WMSU ILS-Elementary Department: <br />
        Automated Grades Portal and Students Attendance using QR Code
      </h2>
    </div>

    <hr className="border-gray-400 mb-8" />

    <p className="text-sm text-gray-600 mb-3">Create new account first to access the system.</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[600px] mx-auto mb-8">
      <button
        onClick={() => handleSelectRole("student")}
        className="bg-red-800 hover:bg-red-700 text-white font-semibold py-6 rounded-lg shadow-md flex flex-col items-center gap-2 transform transition duration-300 hover:scale-105"
      >
        <UserIcon className="w-10 h-10" />
        <span className="text-lg">Student</span>
      </button>

      <button
        onClick={() => handleSelectRole("teacher")}
        className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-6 rounded-lg shadow-md flex flex-col items-center gap-2 transform transition duration-300 hover:scale-105"
      >
        <UserGroupIcon className="w-10 h-10" />
        <span className="text-lg">Teacher</span>
      </button>

      <button
        onClick={() => handleSelectRole("admin")}
        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-6 rounded-lg shadow-md flex flex-col items-center gap-2 transform transition duration-300 hover:scale-105"
      >
        <Cog6ToothIcon className="w-10 h-10" />
        <span className="text-lg">Admin</span>
      </button>
    </div>

    <div className="mt-6">
      <p className="text-sm text-gray-600 mb-3 pt-5">Already have an account? Log in as:</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[600px] mx-auto">
        <button
          onClick={() => handleLogin("student")}
          className="bg-red-200 hover:bg-red-300 text-red-800 font-semibold py-6 rounded-lg shadow-md flex flex-col items-center gap-2 transform transition duration-300 hover:scale-105"
        >
          <UserIcon className="w-10 h-10" />
          <span className="text-base">Student</span>
        </button>

        <button
          onClick={() => handleLogin("teacher")}
          className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-6 rounded-lg shadow-md flex flex-col items-center gap-2 transform transition duration-300 hover:scale-105"
        >
          <UserGroupIcon className="w-10 h-10" />
          <span className="text-base">Teacher</span>
        </button>

        <button
          onClick={() => handleLogin("admin")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-6 rounded-lg shadow-md flex flex-col items-center gap-2 transform transition duration-300 hover:scale-105"
        >
          <Cog6ToothIcon className="w-10 h-10" />
          <span className="text-base">Admin</span>
        </button>
      </div>
    </div>
  </div>
</div>

);
}

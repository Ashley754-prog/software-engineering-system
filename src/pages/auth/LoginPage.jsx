import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { authService } from "../../api/userService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    const emailLower = email.toLowerCase().trim();

    if (!emailLower.endsWith("@wmsu.edu.ph")) {
      setError("Please use your official WMSU email (@wmsu.edu.ph)");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await authService.login({
        email: emailLower,
        password,
      });

      const user = response?.data?.user;
      const role = user?.role?.toLowerCase();

      if (!role) {
        setError("Login succeeded but no role was returned.");
        return;
      }

      if (role === "admin") {
        navigate("/admin/admin-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher/teacher-dashboard");
      } else if (role === "student") {
        try {
          const res = await fetch(`http://localhost:3001/api/students/by-email?email=${encodeURIComponent(emailLower)}`);
          if (res.ok) {
            const student = await res.json();
            if (student?.id) {
              localStorage.setItem("studentId", String(student.id));
            }
          }
        } catch (fetchErr) {
          console.error("Failed to fetch student by email:", fetchErr);
        }

        navigate("/student/student-dashboard");
      } else {
        navigate("/student/student-dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center font-montserrat"
      style={{ backgroundImage: "url('/wmsu-bg-se.png')" }}
    >
      <div className="relative bg-white/95 p-10 rounded-2xl shadow-xl w-[420px] h-auto text-center border border-gray-200">
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <img
          src="/wmsu-logo.jpg"
          alt="WMSU Logo"
          className="mx-auto mb-3 w-25 h-25"
        />

        <h2 className="text-sm text-red-800 font-bold mb-6 leading-snug">
          WMSU ILS-Elementary Department:
          <br />
          Automated Grades Portal and Students Attendance using QR Code
        </h2>

        {error && (
          <p className="text-red-600 text-sm font-medium mb-4 bg-red-50 px-4 py-2 rounded-md border border-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="teacher@wmsu.edu.ph or student@wmsu.edu.ph"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-1 p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-red-800 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition duration-200 transform hover:scale-105 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between text-sm mt-5 text-gray-600">
          <Link to="/create-account" className="hover:text-red-800 underline">
            Create an Account
          </Link>
          <Link to="/forgot-password" className="text-red-800 hover:underline font-medium">
            Forgot Password?
          </Link>
        </div>

      </div>
    </div>
  );
}
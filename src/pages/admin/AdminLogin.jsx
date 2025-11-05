import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      navigate("/admin/admin-dashboard"); 
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
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
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

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-1 p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
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
            className="w-full bg-red-800 hover:bg-red-700 text-white font-semibold py-2.5 rounded-md transition"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between text-sm mt-5 text-gray-600">
          <Link to="/admin/admin-create-account" className="hover:text-gray-800">
            Create an Account
          </Link>
          <Link to="/forgot-password" className="text-red-800 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
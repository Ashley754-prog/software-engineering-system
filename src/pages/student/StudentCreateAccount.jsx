import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function StudentCreateAccount() {
const navigate = useNavigate();
const location = useLocation();

const role = location.pathname.includes("student")
? "Student"
: location.pathname.includes("teacher")
? "Teacher"
: "Admin";

const [formData, setFormData] = useState({
firstName: "",
lastName: "",
username: "",
email: "",
password: "",
confirmPassword: "",
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
e.preventDefault();
setError("");
setSuccess("");

if (!formData.email.endsWith("@wmsu.edu.ph")) {
  setError("Please use your official WMSU email address.");
  return;
}

if (formData.password !== formData.confirmPassword) {
  setError("Passwords do not match.");
  return;
}

const captchaChecked = document.getElementById("captcha").checked;
if (!captchaChecked) {
  setError("Please verify that you are not a robot.");
  return;
}

console.log("Account Created:", { ...formData, role });
setSuccess(`✅ ${role} account created successfully!`);

setTimeout(() => {
  if (role === "Student") navigate("/student/student-dashboard");
  else if (role === "Teacher") navigate("/teacher/teacher-dashboard");
  else navigate("/admin/admin-dashboard");
}, 1000); 

};

return ( 
<div
  className="min-h-screen flex items-center justify-center px-6 py-12 font-montserrat"
  style={{
    background: `linear-gradient(to bottom, #800000 30%, #D3D3D3 50%, #ffffff 100%)`
  }}
>
<div className="bg-white border border-gray-300 rounded-md shadow-lg w-[740px] p-10 text-center"> 
    <div className="flex flex-row gap-6 items-center mb-6"> <img
         src="/wmsu-logo.jpg"
         alt="WMSU Logo"
         className="w-25 h-25 rounded-full object-cover mb-2"
       /> <h2 className="text-[15px] text-red-800 font-bold leading-snug">
WMSU ILS-Elementary Department: <br />
Automated Grades Portal and Students Attendance using QR Code </h2> </div>


    <hr className="border-gray-400 mb-8" />

    <h3 className="text-xl font-semibold text-gray-800 mb-6">
      Create New {role} Account
    </h3>

    {error && <p className="text-red-700 mb-3 font-medium">{error}</p>}
    {success && <p className="text-green-600 mb-3 font-medium">{success}</p>}

    <form
      onSubmit={handleSubmit}
      className="space-y-4 text-left mx-auto max-w-[600px]"
    >
      <div>
        <label className="text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="example@wmsu.edu.ph"
          className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
        />
      </div>

      <div className="relative">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mt-1 p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative">
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full mt-1 p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
        >
          {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
      </div>

      <hr className="border-gray-400 mt-8 mb-5" />
      <div className="flex items-center justify-center space-x-3 border border-gray-400 rounded-md p-3 w-[280px] mx-auto">
        <input id="captcha" type="checkbox" />
        <span className="text-sm">I’m not a robot</span>
        <div className="border border-gray-400 p-2 text-[10px] text-gray-500">reCAPTCHA</div>
      </div>

      <div className="flex justify-center space-x-3 mt-8">
        <button
          type="submit"
          className="bg-red-800 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-md"
        >
          Create New Account
        </button>
        <button
          type="button"
          className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-md"
          onClick={() => navigate("/role-selection")}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>

);
}

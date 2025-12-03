import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { authService } from "../../api/userService";
import { toast } from 'react-toastify';

export default function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  const isStudent = location.pathname.includes("/student");
  const isTeacher = location.pathname.includes("/teacher");
  const isAdmin = location.pathname.includes("/admin");
  
  // Only allow Teacher and Admin registration
  if (isStudent) {
    navigate("/students-login");
    return null;
  }
  
  const role = isTeacher ? "Teacher" : isAdmin ? "Admin" : "Teacher";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "teacher", // Default to teacher
    subjects: [], // Array to store selected subjects
    gradeLevels: [], // Array to store selected grade levels
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generateUsername = (firstName, lastName) => {
    const cleanFirst = firstName.toLowerCase().replace(/\s/g, '');
    const cleanLast = lastName.toLowerCase().replace(/\s/g, '');
    const randomNum = Math.floor(Math.random() * 1000);
    return `${cleanFirst}.${cleanLast}${randomNum}`;
  };

  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const username = generateUsername(formData.firstName, formData.lastName);
      setFormData(prev => ({ ...prev, username }));
    }
  }, [formData.firstName, formData.lastName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData(prev => ({ ...prev, password: newPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email.endsWith("@wmsu.edu.ph")) {
      setError("Please use your official WMSU email address ending in @wmsu.edu.ph");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const captchaChecked = document.getElementById("captcha")?.checked;
    if (!captchaChecked) {
      setError("Please verify that you are not a robot.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const teacherPayload = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        subjects: formData.subjects,
        gradeLevels: formData.gradeLevels
      };

      const response = await fetch('http://localhost:3001/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create ${formData.role} account: ${errorData.error || errorData.details || 'Unknown error'}`);
      }

      if (formData.role === "admin") {
        // Admin accounts can login immediately
        setSuccess("Admin account created successfully! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/admin/admin-dashboard");
        }, 2000);
      } else if (formData.role === "teacher") {
        // Teacher accounts need approval - show waiting message
        setSuccess("Teacher account created successfully! Your account is now pending admin approval. You will be redirected to the login page.");
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 font-montserrat"
      style={{
        background: `linear-gradient(to bottom, #800000 30%, #D3D3D3 50%, #ffffff 100%)`,
      }}
    >
      <div className="bg-white border border-gray-300 rounded-md shadow-lg w-[740px] p-10 text-center">
        <div className="flex flex-row gap-6 items-center mb-6">
          <img
            src="/wmsu-logo.jpg"
            alt="WMSU Logo"
            className="w-25 h-25 rounded-full object-cover mb-2"
          />
          <h2 className="text-[15px] text-red-800 font-bold leading-snug">
            WMSU ILS-Elementary Department: <br />
            Automated Grades Portal and Students Attendance using QR Code
          </h2>
        </div>

        <hr className="border-gray-400 mb-8" />

        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Create New Account
        </h3>

        {error && <p className="text-red-700 mb-3 font-medium">{error}</p>}
        {success && <p className="text-green-600 mb-3 font-medium">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left mx-auto max-w-[600px]">
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

          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === "teacher" && (
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Grade Level to Handle</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="grade1"
                      name="gradeLevels"
                      value="Grade 1"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          gradeLevels: checked 
                            ? [...prev.gradeLevels, value]
                            : prev.gradeLevels.filter(level => level !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="grade1" className="text-sm">Grade 1</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="grade2"
                      name="gradeLevels"
                      value="Grade 2"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          gradeLevels: checked 
                            ? [...prev.gradeLevels, value]
                            : prev.gradeLevels.filter(level => level !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="grade2" className="text-sm">Grade 2</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="grade3"
                      name="gradeLevels"
                      value="Grade 3"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          gradeLevels: checked 
                            ? [...prev.gradeLevels, value]
                            : prev.gradeLevels.filter(level => level !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="grade3" className="text-sm">Grade 3</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="grade4"
                      name="gradeLevels"
                      value="Grade 4"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          gradeLevels: checked 
                            ? [...prev.gradeLevels, value]
                            : prev.gradeLevels.filter(level => level !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="grade4" className="text-sm">Grade 4</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="grade5"
                      name="gradeLevels"
                      value="Grade 5"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          gradeLevels: checked 
                            ? [...prev.gradeLevels, value]
                            : prev.gradeLevels.filter(level => level !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="grade5" className="text-sm">Grade 5</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="grade6"
                      name="gradeLevels"
                      value="Grade 6"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          gradeLevels: checked 
                            ? [...prev.gradeLevels, value]
                            : prev.gradeLevels.filter(level => level !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="grade6" className="text-sm">Grade 6</label>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Subjects to Handle</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="math"
                      name="subjects"
                      value="Mathematics"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          subjects: checked 
                            ? [...prev.subjects, value]
                            : prev.subjects.filter(subject => subject !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="math" className="text-sm">Mathematics</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="english"
                      name="subjects"
                      value="English"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          subjects: checked 
                            ? [...prev.subjects, value]
                            : prev.subjects.filter(subject => subject !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="english" className="text-sm">English</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="science"
                      name="subjects"
                      value="Science"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          subjects: checked 
                            ? [...prev.subjects, value]
                            : prev.subjects.filter(subject => subject !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="science" className="text-sm">Science</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="filipino"
                      name="subjects"
                      value="Filipino"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          subjects: checked 
                            ? [...prev.subjects, value]
                            : prev.subjects.filter(subject => subject !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="filipino" className="text-sm">Filipino</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="araling-pilipinas"
                      name="subjects"
                      value="Araling Panlipunan"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          subjects: checked 
                            ? [...prev.subjects, value]
                            : prev.subjects.filter(subject => subject !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="araling-pilipinas" className="text-sm">Araling Panlipunan</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="esp"
                      name="subjects"
                      value="Edukasyon sa Pagpapakatao"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          subjects: checked 
                            ? [...prev.subjects, value]
                            : prev.subjects.filter(subject => subject !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="esp" className="text-sm">Edukasyon sa Pagpapakatao</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="mapeh"
                      name="subjects"
                      value="MAPEH"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          subjects: checked 
                            ? [...prev.subjects, value]
                            : prev.subjects.filter(subject => subject !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="mapeh" className="text-sm">MAPEH</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tle"
                      name="subjects"
                      value="TLE"
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setFormData(prev => ({
                          ...prev,
                          subjects: checked 
                            ? [...prev.subjects, value]
                            : prev.subjects.filter(subject => subject !== value)
                        }));
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="tle" className="text-sm">TLE</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="flex gap-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 border p-3 rounded-lg"
                placeholder="Click 'Generate Password'"
                required
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Generate Password
              </button>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

<hr className="border-gray-400 mt-8 mb-5" />
          <div className="flex items-center justify-center space-x-3 border border-gray-400 rounded-md p-3 w-[280px] mx-auto">
            <input id="captcha" type="checkbox" />
            <span className="text-sm">I'm not a robot</span>
            <div className="border border-gray-400 p-2 text-[10px] text-gray-500">reCAPTCHA</div>
          </div>

          <div className="flex justify-center space-x-3 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-opacity-50 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-md"
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
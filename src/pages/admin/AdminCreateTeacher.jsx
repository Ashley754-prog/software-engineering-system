import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/userService";

export default function AdminCreateTeacher() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email.endsWith("@wmsu.edu.ph")) {
      setError("Please use an official WMSU email address ending in @wmsu.edu.ph");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const teacherData = {
        ...formData,
        role: "teacher",
      };

      const response = await authService.register(teacherData);

      setSuccess("Teacher account created successfully.");
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to create teacher account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat">
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Teacher Account</h1>

        {error && (
          <p className="mb-4 px-4 py-2 rounded-md bg-red-50 text-red-700 border border-red-200 text-sm font-medium">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 px-4 py-2 rounded-md bg-green-50 text-green-700 border border-green-200 text-sm font-medium">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
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
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
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
              placeholder="teacher@wmsu.edu.ph"
              className="mt-1 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-md text-white font-semibold bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-1 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

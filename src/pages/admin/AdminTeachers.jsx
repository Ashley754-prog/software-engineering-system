import React, { useState, useEffect } from "react";
import { UsersIcon, CheckIcon, XMarkIcon, PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function AdminTeachers() {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [teacherForm, setTeacherForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    subjects: "",
    gradeLevel: "",
    email: "",
    password: "",
    username: "",
    passwordOption: "auto" // "auto" or "manual"
  });

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
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (teacherForm.firstName && teacherForm.lastName) {
      const username = generateUsername(teacherForm.firstName, teacherForm.lastName);
      setTeacherForm(prev => ({ ...prev, username }));
    }
  }, [teacherForm.firstName, teacherForm.lastName]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      
      // Fetch pending teachers
      const pendingResponse = await fetch('http://localhost:3001/api/teachers/pending');
      const pendingData = await pendingResponse.json();
      
      // Fetch approved teachers
      const approvedResponse = await fetch('http://localhost:3001/api/teachers/approved');
      const approvedData = await approvedResponse.json();
      
      setPendingTeachers(pendingData.teachers || []);
      setApprovedTeachers(approvedData.teachers || []);
    } catch (err) {
      setError('Failed to fetch teachers');
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/teachers/${teacherId}/approve`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        // Refresh the lists
        fetchTeachers();
        alert('Teacher approved successfully!');
      } else {
        throw new Error('Failed to approve teacher');
      }
    } catch (err) {
      alert('Error approving teacher: ' + err.message);
    }
  };

  const handleReject = async (teacherId) => {
    if (confirm('Are you sure you want to reject this teacher?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/teachers/${teacherId}/reject`, {
          method: 'PATCH'
        });
        
        if (response.ok) {
          // Refresh the lists
          fetchTeachers();
          alert('Teacher rejected successfully!');
        } else {
          throw new Error('Failed to reject teacher');
        }
      } catch (err) {
        alert('Error rejecting teacher: ' + err.message);
      }
    }
  };

  const handleCreateTeacher = () => {
    setShowCreateModal(true);
    setCreateError("");
    setCreateSuccess("");
    // Generate initial password if auto mode
    if (teacherForm.passwordOption === "auto") {
      const newPassword = generatePassword();
      setTeacherForm(prev => ({ ...prev, password: newPassword }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTeacherForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setTeacherForm(prev => ({ ...prev, password: newPassword }));
  };

  const handlePasswordOptionChange = (option) => {
    setTeacherForm(prev => ({
      ...prev,
      passwordOption: option,
      password: option === "auto" ? generatePassword() : ""
    }));
  };

  const handleSubmitTeacher = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    // Validation
    if (!teacherForm.firstName || !teacherForm.lastName || !teacherForm.email || 
        !teacherForm.subjects || !teacherForm.gradeLevel || !teacherForm.password) {
      setCreateError("Please fill in all required fields");
      return;
    }

    if (teacherForm.passwordOption === "manual" && teacherForm.password.length < 8) {
      setCreateError("Password must be at least 8 characters long");
      return;
    }

    if (!teacherForm.email.endsWith("@wmsu.edu.ph")) {
      setCreateError("Please use a valid WMSU email address");
      return;
    }

    try {
      setIsCreating(true);

      const teacherPayload = {
        firstName: teacherForm.firstName,
        middleName: teacherForm.middleName,
        lastName: teacherForm.lastName,
        email: teacherForm.email,
        username: teacherForm.username,
        password: teacherForm.password,
        role: "teacher",
        subjects: teacherForm.subjects,
        gradeLevel: teacherForm.gradeLevel
      };

      const response = await fetch('http://localhost:3001/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create teacher account');
      }

      setCreateSuccess("Teacher account created successfully! The account is now pending approval.");
      
      // Reset form
      setTeacherForm({
        firstName: "",
        middleName: "",
        lastName: "",
        subjects: "",
        gradeLevel: "",
        email: "",
        password: "",
        username: "",
        passwordOption: "auto"
      });

      // Refresh teachers list
      fetchTeachers();

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowCreateModal(false);
      }, 2000);

    } catch (err) {
      setCreateError(err.message || "Failed to create teacher account");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
          <div className="flex items-center gap-4 mb-4">
            <UsersIcon className="w-20 h-20 text-red-800" />
            <h2 className="text-5xl pl-5 font-bold text-gray-900">Teachers Management</h2>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-600">Loading teachers...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-10">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <UsersIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Teachers Management</h2>
        </div>
      </div>

      <p className="text-gray-600 mb-4">
        View, verify, edit, or remove teacher accounts. Assign subjects and classes.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-red-50 rounded-lg text-center shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Total Teachers</h3>
          <p className="text-2xl font-bold">{pendingTeachers.length + approvedTeachers.length}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center shadow-sm border border-green-100">
          <h3 className="text-lg font-semibold text-green-800">Active Teachers</h3>
          <p className="text-2xl font-bold">{approvedTeachers.length}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg text-center shadow-sm border border-yellow-100">
          <h3 className="text-lg font-semibold text-yellow-800">Pending Verification</h3>
          <p className="text-2xl font-bold">{pendingTeachers.length}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-8 mb-6">
        <button
          onClick={handleCreateTeacher}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold shadow-lg"
        >
          <UsersIcon className="w-5 h-5" />
          + Create Teacher Account
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-red-800 mb-4">Pending Teacher Verification</h3>

        {pendingTeachers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No pending teacher verifications
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left border-collapse">
              <thead className="bg-yellow-100 text-yellow-800">
                <tr>
                  <th className="border border-gray-300 px-4 py-3">Name</th>
                  <th className="border border-gray-300 px-4 py-3">Username</th>
                  <th className="border border-gray-300 px-4 py-3">Email</th>
                  <th className="border border-gray-300 px-4 py-3">Role</th>
                  <th className="border border-gray-300 px-4 py-3">Applied Date</th>
                  <th className="border border-gray-300 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      {teacher.first_name} {teacher.last_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">{teacher.username}</td>
                    <td className="border border-gray-300 px-4 py-3">{teacher.email}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {teacher.role}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {new Date(teacher.created_at).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(teacher.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition flex items-center gap-1"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(teacher.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-green-800 mb-4">Active Teachers</h3>

        {approvedTeachers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No approved teachers
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="border border-gray-300 px-4 py-3">Name</th>
                  <th className="border border-gray-300 px-4 py-3">Username</th>
                  <th className="border border-gray-300 px-4 py-3">Email</th>
                  <th className="border border-gray-300 px-4 py-3">Role</th>
                  <th className="border border-gray-300 px-4 py-3">Department</th>
                  <th className="border border-gray-300 px-4 py-3">Subject</th>
                  <th className="border border-gray-300 px-4 py-3">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {approvedTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      {teacher.first_name} {teacher.last_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">{teacher.username}</td>
                    <td className="border border-gray-300 px-4 py-3">{teacher.email}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {teacher.role}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">{teacher.department}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      {teacher.subjects && Array.isArray(teacher.subjects) 
                        ? teacher.subjects.join(', ') 
                        : teacher.subjects || 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {new Date(teacher.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Teacher Modal */}
      {showCreateModal && (
        <div
          className="min-h-screen flex items-center justify-center px-6 py-12 font-montserrat fixed inset-0 z-50"
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

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Create New Teacher Account</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {createError && <p className="text-red-700 mb-3 font-medium">{createError}</p>}
            {createSuccess && <p className="text-green-600 mb-3 font-medium">{createSuccess}</p>}

            <form onSubmit={handleSubmitTeacher} className="space-y-4 text-left mx-auto max-w-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={teacherForm.firstName}
                    onChange={handleFormChange}
                    required
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    value={teacherForm.middleName}
                    onChange={handleFormChange}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={teacherForm.lastName}
                    onChange={handleFormChange}
                    required
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Subjects to Handle</label>
                  <input
                    type="text"
                    name="subjects"
                    value={teacherForm.subjects}
                    onChange={handleFormChange}
                    placeholder="e.g., Math, Science, English"
                    required
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Grade Level to Handle</label>
                  <select
                    name="gradeLevel"
                    value={teacherForm.gradeLevel}
                    onChange={handleFormChange}
                    required
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                  >
                    <option value="">Select Grade Level</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">WMSU Email</label>
                  <input
                    type="email"
                    name="email"
                    value={teacherForm.email}
                    onChange={handleFormChange}
                    placeholder="teacher@wmsu.edu.ph"
                    required
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Username (Auto-generated)</label>
                  <input
                    type="text"
                    name="username"
                    value={teacherForm.username}
                    readOnly
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="relative">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="passwordOption"
                          value="auto"
                          checked={teacherForm.passwordOption === "auto"}
                          onChange={() => handlePasswordOptionChange("auto")}
                          className="mr-2"
                        />
                        <span className="text-sm">Auto-generate password</span>
                      </label>
                      
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="passwordOption"
                          value="manual"
                          checked={teacherForm.passwordOption === "manual"}
                          onChange={() => handlePasswordOptionChange("manual")}
                          className="mr-2"
                        />
                        <span className="text-sm">Set password manually</span>
                      </label>
                    </div>

                    {teacherForm.passwordOption === "auto" ? (
                      <div className="flex gap-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={teacherForm.password}
                          readOnly
                          className="flex-1 mt-1 p-3 pr-10 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                          placeholder="Click 'Generate Password'"
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
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={teacherForm.password}
                          onChange={handleFormChange}
                          placeholder="Enter password (min 8 characters)"
                          className="flex-1 mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <hr className="border-gray-400 mt-8 mb-5" />

              <div className="flex justify-center space-x-3 mt-8">
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-opacity-50 ${isCreating ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isCreating ? 'Creating Account...' : 'Create Teacher Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { UsersIcon, CheckIcon, XMarkIcon, PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function AdminTeachers() {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [gradeRequests, setGradeRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showRequestHistory, setShowRequestHistory] = useState(false);
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
    fetchGradeRequests();
    fetchNotifications();
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

  const fetchGradeRequests = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/grade-requests');
      const data = await response.json();
      setGradeRequests(data);
    } catch (err) {
      console.error('Error fetching grade requests:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/grade-requests/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
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

  const handleApproveGradeRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/grade-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', adminNotes: 'Approved by admin' })
      });
      
      if (response.ok) {
        fetchGradeRequests();
        fetchNotifications();
        alert('Grade request approved successfully!');
      } else {
        throw new Error('Failed to approve request');
      }
    } catch (err) {
      alert('Error approving request: ' + err.message);
    }
  };

  const handleRejectGradeRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/grade-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', adminNotes: 'Rejected by admin' })
      });
      
      if (response.ok) {
        fetchGradeRequests();
        fetchNotifications();
        alert('Grade request rejected successfully!');
      } else {
        throw new Error('Failed to reject request');
      }
    } catch (err) {
      alert('Error rejecting request: ' + err.message);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:3001/api/grade-requests/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
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

      {/* Notifications Bell */}
      {notifications.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <h4 className="font-semibold text-orange-800">
                {notifications.length} New Notification{notifications.length > 1 ? 's' : ''}
              </h4>
            </div>
            <button
              onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
              className="text-orange-600 hover:text-orange-800 text-sm"
            >
              Mark all as read
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {notifications.slice(0, 3).map(notification => (
              <div key={notification.id} className="text-sm text-orange-700">
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}

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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead className="bg-yellow-100 text-yellow-800">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Name</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Username</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Email</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Role</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Applied Date</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div>
                          <div className="font-medium text-sm">{teacher.first_name} {teacher.last_name}</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{teacher.username}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div className="truncate max-w-[150px]" title={teacher.email}>
                          {teacher.email}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          {teacher.role}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {new Date(teacher.created_at).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleApprove(teacher.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition flex items-center gap-1 text-xs"
                          >
                            <CheckIcon className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(teacher.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex items-center gap-1 text-xs"
                          >
                            <XMarkIcon className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full min-w-[900px] text-left border-collapse">
                <thead className="bg-green-100 text-green-800">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Name</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Username</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Email</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Role</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Department</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Subject</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div className="font-medium text-sm">{teacher.first_name} {teacher.last_name}</div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{teacher.username}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div className="truncate max-w-[150px]" title={teacher.email}>
                          {teacher.email}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {teacher.role}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{teacher.department}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {teacher.subjects && Array.isArray(teacher.subjects)
                          ? teacher.subjects.join(', ')
                          : teacher.subjects || 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {new Date(teacher.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* Request History Button */}
      <div className="mt-8">
        <button
          onClick={() => setShowRequestHistory(!showRequestHistory)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2"
        >
          <EyeIcon className="w-5 h-5" />
          {showRequestHistory ? 'Hide' : 'Show'} Request History
        </button>
      </div>

      {/* Grade Requests Section - Only Pending */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-orange-800 mb-4">Pending Grade Edit Requests</h3>

        {gradeRequests.filter(r => r.status === 'pending').length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No pending grade edit requests
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full min-w-[1000px] text-left border-collapse">
                <thead className="bg-orange-100 text-orange-800">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Student</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Grade/Section</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Teacher</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Type</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Quarter</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Subject</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Reason</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Date</th>
                    <th className="border border-gray-300 px-3 py-2 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeRequests.filter(r => r.status === 'pending').map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div>
                          <div className="font-medium text-sm">{request.student_name}</div>
                          <div className="text-xs text-gray-500">ID: {request.student_id}</div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {request.grade_level} - {request.section}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{request.teacher_name}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.request_type === 'edit' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {request.request_type === 'edit' ? 'Edit' : 'Rewrite'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">Q{request.quarter}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{request.subject}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div className="truncate max-w-[120px]" title={request.reason}>
                          {request.reason}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleApproveGradeRequest(request.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition flex items-center gap-1 text-xs"
                          >
                            <CheckIcon className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectGradeRequest(request.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition flex items-center gap-1 text-xs"
                          >
                            <XMarkIcon className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Request History Section */}
      {showRequestHistory && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-purple-800 mb-4">Complete Request History</h3>

          {gradeRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No request history available
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto max-w-full">
                <table className="w-full min-w-[1200px] text-left border-collapse">
                  <thead className="bg-purple-100 text-purple-800">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Date</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Student</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Grade/Section</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Teacher</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Type</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Quarter</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Subject</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Reason</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Status</th>
                      <th className="border border-gray-300 px-3 py-2 text-sm">Admin Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeRequests
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <div className="text-xs">
                            <div>{new Date(request.created_at).toLocaleDateString()}</div>
                            <div className="text-gray-500">{new Date(request.created_at).toLocaleTimeString()}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <div>
                            <div className="font-medium text-sm">{request.student_name}</div>
                            <div className="text-xs text-gray-500">ID: {request.student_id}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          {request.grade_level} - {request.section}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">{request.teacher_name}</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.request_type === 'edit' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {request.request_type === 'edit' ? 'Edit' : 'Rewrite'}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">Q{request.quarter}</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">{request.subject}</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <div className="truncate max-w-[120px]" title={request.reason}>
                            {request.reason}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <div className="text-xs">
                            {request.admin_notes ? (
                              <div className="text-gray-700">{request.admin_notes}</div>
                            ) : (
                              <div className="text-gray-400 italic">No notes</div>
                            )}
                            {request.updated_at && request.updated_at !== request.created_at && (
                              <div className="text-xs text-gray-500 mt-1">
                                Updated: {new Date(request.updated_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Summary Statistics */}
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">Request Summary</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-800">{gradeRequests.length}</div>
                      <div className="text-gray-600">Total Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {gradeRequests.filter(r => r.status === 'pending').length}
                      </div>
                      <div className="text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {gradeRequests.filter(r => r.status === 'approved').length}
                      </div>
                      <div className="text-gray-600">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {gradeRequests.filter(r => r.status === 'rejected').length}
                      </div>
                      <div className="text-gray-600">Rejected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

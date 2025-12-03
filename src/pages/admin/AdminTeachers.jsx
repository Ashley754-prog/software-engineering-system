import React, { useState, useEffect } from "react";
import { UsersIcon, CheckIcon, XMarkIcon, PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";

export default function AdminTeachers() {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [gradeRequests, setGradeRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showRequestHistory, setShowRequestHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeachers();
    fetchGradeRequests();
    fetchNotifications();
  }, []);

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
                    <th className="border border-gray-300 px-3 py-2 text-sm">Position</th>
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
                      <td className="border border-gray-300 px-3 py-2 text-sm">{teacher.position}</td>
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

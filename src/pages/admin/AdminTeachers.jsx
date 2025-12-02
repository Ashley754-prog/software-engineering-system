import React, { useState, useEffect } from "react";
import { UsersIcon, CheckIcon, XMarkIcon, PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";

export default function AdminTeachers() {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeachers();
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
                  <th className="border border-gray-300 px-4 py-3">Position</th>
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
                    <td className="border border-gray-300 px-4 py-3">{teacher.position}</td>
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
    </div>
  );
}

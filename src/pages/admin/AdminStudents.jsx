import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AcademicCapIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon, 
  QrCodeIcon, 
  EyeIcon 
} from "@heroicons/react/24/solid";
import ViewStudentModal from '@/components/modals/ViewStudentModal'
import EditStudentModal from '@/components/modals/EditStudentModal'

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/students');
      const data = await response.json();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  // NOW ALL STUDENTS (Kinder to Grade 6) IN ONE TABLE
  const allStudents = students; // No filtering anymore — show everyone

  // VIEW QR CODE
  const handleViewQR = (student) => {
    setSelectedStudent(student);
    setShowQRModal(true);
  };

  // EDIT STUDENT
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({ ...student });
    setShowEditModal(true);
  };

  const handleUpdateStudent = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        alert('Student updated successfully!');
        fetchStudents();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student');
    }
  };

  // DELETE STUDENT
  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/students/${studentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Student deleted successfully!');
        fetchStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  // VIEW DETAILS
  const handleView = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  // DOWNLOAD QR CODE
  const handleDownloadQR = (student) => {
    const link = document.createElement('a');
    link.href = student.qrCode;
    link.download = `QR_${student.lrn}_${student.fullName}.png`;
    link.click();
  };

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-lg shadow p-5 border border-gray-300 border-b-red-800 border-b-4">
        <div className="flex items-center gap-4 mb-4">
          <AcademicCapIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105 translate-x-[5px]" />
          <h2 className="text-5xl pl-5 font-bold text-gray-900">Students Management</h2>
        </div>
      </div>

      <p className="text-gray-600">
        Manage student records, edit details, and generate QR codes.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-800">Total Students</h3>
          <p className="text-2xl font-bold">{students.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
          <h3 className="text-lg font-semibold text-green-800">Active Students</h3>
          <p className="text-2xl font-bold">{students.length}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-red-800 mb-2">Student Actions</h3>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Create accounts for Kinder–Grade 6</li>
          <li>Edit student details</li>
          <li>Delete student accounts</li>
          <li>View and download QR codes</li>
        </ul>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/admin/admin/create-students-accounts")}
          className="bg-red-800 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
        >
          + Create Student Account (K to Grade 6)
        </button>
      </div>

      {/* ONE TABLE FOR ALL STUDENTS — K TO G6 */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-red-800 mb-4">
          All Students (Kindergarten to Grade 6) - {allStudents.length} students
        </h3>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="p-3 border">LRN</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Sex</th>
                <th className="p-3 border">Grade</th>
                <th className="p-3 border">Section</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">QR</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : allStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No students found. Create your first student account!
                  </td>
                </tr>
              ) : (
                allStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{student.lrn}</td>
                    <td className="p-3 border font-semibold">{student.fullName}</td>
                    <td className="p-3 border">{student.sex}</td>
                    <td className="p-3 border">{student.gradeLevel}</td>
                    <td className="p-3 border">{student.section}</td>
                    <td className="p-3 border">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-3 border">
                      <button 
                        onClick={() => handleViewQR(student)}
                        className="p-2 bg-gray-700 text-white rounded-lg hover:bg-black flex items-center gap-1"
                      >
                        <QrCodeIcon className="w-5 h-5" /> View
                      </button>
                    </td>
                    <td className="p-3 border flex gap-3">
                      <button 
                        onClick={() => handleView(student)}
                        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(student)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        title="Edit Student"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Delete Student"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === ALL MODALS BELOW ARE 100% UNCHANGED === */}
      {/* QR CODE MODAL */}
      {showQRModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">QR Code - {selectedStudent.fullName}</h3>
            <div className="flex justify-center mb-4">
              <img src={selectedStudent.qrCode} alt="QR Code" className="w-64 h-64 border-4 border-gray-300 rounded-lg" />
            </div>
            <p className="text-center text-gray-600 mb-4">LRN: {selectedStudent.lrn}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDownloadQR(selectedStudent)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Download QR
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedStudent && (
        <ViewStudentModal student={selectedStudent} onClose={() => setShowViewModal(false)} />
      )}
      {showEditModal && selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          formData={editFormData}
          setFormData={setEditFormData}
          onSave={handleUpdateStudent}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
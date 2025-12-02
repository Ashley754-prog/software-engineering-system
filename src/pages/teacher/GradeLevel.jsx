import React, { useState, useEffect } from "react";
import {
  BookOpenIcon,
  UsersIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import QRCode from "qrcode";
import ViewStudentModal from '@/components/modals/ViewStudentModal'
import EditStudentModal from '@/components/modals/EditStudentModal'
import DeleteRequestModal from '@/components/modals/DeleteRequestModal'

export default function GradeLevel() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteRequestModal, setShowDeleteRequestModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [deleteReason, setDeleteReason] = useState("");
  const [viewingClass, setViewingClass] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/students");
      const data = await response.json();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const getStudentsByGrade = (grade) => students.filter((s) => s.gradeLevel === grade);
  const getStudentsInSection = (grade, section) =>
    students.filter((s) => s.gradeLevel === grade && s.section === section);

  const getColors = (headerColor) => {
    const map = {
      "bg-purple-600": { bar: "from-purple-500 to-pink-500", text: "text-purple-700", pillBg: "bg-purple-100", pillText: "text-purple-800", pillHover: "hover:bg-purple-200", icon: "text-purple-600" },
      "bg-blue-600":   { bar: "from-blue-500 to-cyan-500",   text: "text-blue-700",   pillBg: "bg-blue-100",   pillText: "text-blue-800",   pillHover: "hover:bg-blue-200",   icon: "text-blue-600" },
      "bg-green-600":  { bar: "from-green-500 to-emerald-500", text: "text-green-700", pillBg: "bg-green-100", pillText: "text-green-800", pillHover: "hover:bg-green-200", icon: "text-green-600" },
      "bg-yellow-600": { bar: "from-yellow-400 to-orange-500", text: "text-yellow-700", pillBg: "bg-yellow-100", pillText: "text-yellow-800", pillHover: "hover:bg-yellow-200", icon: "text-yellow-600" },
      "bg-red-600":    { bar: "from-red-500 to-pink-500",     text: "text-red-700",    pillBg: "bg-red-100",    pillText: "text-red-800",    pillHover: "hover:bg-red-200",    icon: "text-red-600" },
      "bg-indigo-600": { bar: "from-indigo-500 to-purple-500", text: "text-indigo-700", pillBg: "bg-indigo-100", pillText: "text-indigo-800", pillHover: "hover:bg-indigo-200", icon: "text-indigo-600" },
      "bg-pink-600":   { bar: "from-pink-500 to-rose-500",    text: "text-pink-700",   pillBg: "bg-pink-100",   pillText: "text-pink-800",   pillHover: "hover:bg-pink-200",   icon: "text-pink-600" },
    };
    return map[headerColor] || map["bg-purple-600"];
  };

  // ADDED GRADE 4, 5, 6 WITH SECTIONS AND COLORS
  const gradeLevels = [
    { name: "Kindergarten", color: "bg-purple-600", sections: ["Love"] },
    { name: "Grade 1",       color: "bg-blue-600",   sections: ["Humility"] },
    { name: "Grade 2",       color: "bg-green-600",  sections: ["Kindness"] },
    { name: "Grade 3",       color: "bg-yellow-600", sections: ["Diligence", "Wisdom"] },
    { name: "Grade 4",       color: "bg-red-600",    sections: ["Section A", "Section B"] },
    { name: "Grade 5",       color: "bg-indigo-600", sections: ["Section A", "Section B"] },
    { name: "Grade 6",       color: "bg-pink-600",   sections: ["Section A", "Section B", "Section C"] },
  ];

  // Handlers (unchanged)
  const handleView = (student) => { setSelectedStudent(student); setShowViewModal(true); };
  const handleEdit = (student) => { setSelectedStudent(student); setEditFormData({ ...student }); setShowEditModal(true); };
  const handleDeleteRequest = (student) => { setSelectedStudent(student); setDeleteReason(""); setShowDeleteRequestModal(true); };

  const handleUpdateStudent = async () => {
    try {
      const fullName = `${editFormData.firstName || ""} ${editFormData.middleName || ""} ${editFormData.lastName || ""}`.trim();
      const qrNeedsUpdate = editFormData.lrn !== selectedStudent.lrn || fullName !== selectedStudent.fullName || editFormData.gradeLevel !== selectedStudent.gradeLevel || editFormData.section !== selectedStudent.section;

      let newQrCode = editFormData.qrCode;
      if (qrNeedsUpdate) {
        newQrCode = await QRCode.toDataURL(JSON.stringify({
          lrn: editFormData.lrn,
          name: fullName,
          gradeLevel: editFormData.gradeLevel,
          section: editFormData.section,
          email: editFormData.wmsuEmail,
        }), { width: 300, margin: 2 });
      }

      const updatedData = { ...editFormData, fullName, qrCode: newQrCode };
      const res = await fetch(`http://localhost:3001/api/students/${selectedStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        alert("Student updated successfully!");
        fetchStudents();
        setShowEditModal(false);
      }
    } catch (err) {
      alert("Failed to update");
    }
  };

  const submitDeleteRequest = async () => {
    if (!deleteReason.trim()) return alert("Reason required");
    try {
      await fetch("http://localhost:3001/api/delete-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          studentName: selectedStudent.fullName,
          studentLRN: selectedStudent.lrn,
          requestedBy: "Teacher",
          reason: deleteReason,
        }),
      });
      alert("Delete request sent!");
      setShowDeleteRequestModal(false);
    } catch (err) {
      alert("Failed");
    }
  };

  return (
    <>
      {viewingClass ? (
        // CLASS TABLE VIEW (unchanged)
        <div className="space-y-6 p-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center gap-4">
            <button onClick={() => setViewingClass(null)} className="text-gray-600 hover:text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold text-gray-900">
              {viewingClass.grade} - {viewingClass.section}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-12">No.</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 tracking-wider">Student Name</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 tracking-wider w-28">LRN</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 tracking-wider w-37">Grade & Section</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 tracking-wider w-16">Age</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 tracking-wider w-16">Sex</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 tracking-wider">WMSU Email</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 tracking-wider w-20">Status</th>
                    <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 tracking-wider w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getStudentsInSection(viewingClass.grade, viewingClass.section).length === 0 ? (
                    <tr><td colSpan="9" className="text-center py-12 text-gray-500">No students in this class yet</td></tr>
                  ) : (
                    getStudentsInSection(viewingClass.grade, viewingClass.section).map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-5 py-2 text-sm font-semibold text-center">{index + 1}</td>
                        <td className="px-3 py-2 text-sm font-medium">{student.fullName}</td>
                        <td className="px-3 py-2 text-sm font-mono">{student.lrn}</td>
                        <td className="px-3 py-2 text-sm">{student.gradeLevel} - {student.section}</td>
                        <td className="px-3 py-2 text-sm text-center">{student.age}</td>
                        <td className="px-3 py-2 text-sm text-center">{student.sex}</td>
                        <td className="px-3 py-2 text-sm text-blue-600 font-mono truncate max-w-xs">{student.wmsuEmail}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${student.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center gap-3">
                            <button onClick={() => handleView(student)} className="text-blue-600 hover:text-blue-800"><EyeIcon className="w-5 h-5" /></button>
                            <button onClick={() => handleEdit(student)} className="text-green-600 hover:text-green-800"><PencilSquareIcon className="w-5 h-5" /></button>
                            <button onClick={() => handleDeleteRequest(student)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // MAIN GRADE LEVEL CARDS VIEW — NOW INCLUDES G4-G6
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpenIcon className="w-10 h-10 text-red-800" />
              Grade Level Management
            </h2>
          </div>

          <div className="max-w-max-w-6xl mx-auto px-4">
            <div className="space-y-10">
              {gradeLevels.map((level) => {
                const colors = getColors(level.color);
                const gradeStudents = getStudentsByGrade(level.name);

                return (
                  <div key={level.name} className="rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-200">
                    <div className={`${level.color} px-8 py-7 flex items-center justify-between`}>
                      <div className="flex items-center gap-7">
                        <div className="relative w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center shadow-inner">
                          <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
                          <BookOpenIcon className="w-12 h-12 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white leading-tight">{level.name}</h3>
                          <p className="text-white/80 text-base">
                            {level.sections.length} Section{level.sections.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-8 pt-8 pb-10">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-widest">Total of Students</p>
                          <p className="text-6xl font-bold text-gray-900 mt-1">{gradeStudents.length}</p>
                        </div>
                        <UsersIcon className={`w-14 h-14 ${colors.icon} opacity-90`} />
                      </div>

                      <div className="space-y-5">
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Sections</p>
                        {level.sections.map((section) => {
                          const sectionStudents = getStudentsInSection(level.name, section);
                          return (
                            <div key={section} className={`px-6 py-4 ${colors.pillBg} rounded-full ${colors.pillText} font-semibold text-lg flex items-center justify-between transition ${colors.pillHover}`}>
                              <span>{section} ({sectionStudents.length} student{sectionStudents.length !== 1 ? "s" : ""})</span>
                              <button
                                onClick={() => setViewingClass({ grade: level.name, section })}
                                className="px-8 py-2.5 bg-white text-red-700 rounded-lg font-bold hover:bg-gray-100 transition shadow"
                              >
                                View Class
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-10">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Attendance Rate</span>
                          <span className={`font-bold ${colors.text}`}>95.65%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-7">
                          <div className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-1000`} style={{ width: "95.65%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODALS — UNTOUCHED */}
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
      {showDeleteRequestModal && selectedStudent && (
        <DeleteRequestModal
          student={selectedStudent}
          reason={deleteReason}
          setReason={setDeleteReason}
          onSubmit={submitDeleteRequest}
          onClose={() => setShowDeleteRequestModal(false)}
        />
      )}
    </>
  );
}
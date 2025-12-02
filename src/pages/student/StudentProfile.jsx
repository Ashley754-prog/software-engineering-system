import React, { useEffect, useState } from "react";
import { UserCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import StudentTopbar from "../../layouts/student/StudentTopbar"; // Adjust path if needed

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gradeLevel: "",
    section: "",
    contact: "",
    wmsuEmail: "",
    lrn: "",
    profilePic: "",
  });

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) {
        setError("No studentId found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/students/${studentId}`);
        if (!res.ok) throw new Error("Failed to load student profile");
        const data = await res.json();
        setProfile({
          fullName: data.fullName || "",
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          gradeLevel: data.gradeLevel || "",
          section: data.section || "",
          contact: data.contact || "",
          wmsuEmail: data.wmsuEmail || "",
          lrn: data.lrn || "",
          profilePic: data.profilePic || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, profilePic: reader.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!studentId) return;

    try {
      setError("");
      const updates = {
        firstName: profile.firstName,
        middleName: profile.middleName,
        lastName: profile.lastName,
        gradeLevel: profile.gradeLevel,
        section: profile.section,
        contact: profile.contact,
        wmsuEmail: profile.wmsuEmail,
        profilePic: profile.profilePic,
      };

      const res = await fetch(`http://localhost:3001/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update profile");
      }

      const result = await res.json();
      const s = result.student || result;
      setProfile((prev) => ({
        ...prev,
        fullName: s.fullName || prev.fullName,
        firstName: s.firstName || prev.firstName,
        middleName: s.middleName || prev.middleName,
        lastName: s.lastName || prev.lastName,
        gradeLevel: s.gradeLevel || prev.gradeLevel,
        section: s.section || prev.section,
        contact: s.contact || prev.contact,
        wmsuEmail: s.wmsuEmail || prev.wmsuEmail,
        lrn: s.lrn || prev.lrn,
        profilePic: s.profilePic || prev.profilePic,
      }));

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  // LOADING STATE WITH TOPBAR
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentTopbar studentName="Loading..." />
        <div className="pt-20 px-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-8 border-red-900 border-t-transparent mx-auto mb-6"></div>
            <p className="text-xl text-gray-700">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* TOPBAR — NOW VISIBLE & CONSISTENT */}
      <StudentTopbar
        studentName={profile.fullName || "Student"}
        gradeLevel={profile.gradeLevel}
        lrn={profile.lrn}
      />

      {/* MAIN CONTENT */}
      <div className="pt-20 px-6 lg:px-12 pb-12 max-w-5xl mx-auto">
        <div className="space-y-8">

          {/* HEADER CARD */}
          <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-3xl shadow-2xl p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  <UserCircleIcon className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold">My Profile</h2>
                  <p className="text-red-100 text-lg">Update your personal information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-red-800 px-8 py-4 rounded-xl hover:bg-gray-100 transition flex items-center gap-3 font-bold shadow-xl text-lg"
              >
                <PencilIcon className="w-6 h-6" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden">
            {error && (
              <div className="m-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            <div className="p-8 lg:p-12">
              {/* Profile Pic + Info */}
              <div className="flex flex-col md:flex-row items-start gap-10 mb-10">
                <div className="relative group">
                  <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-full h-full text-gray-500" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-4 right-4 bg-red-800 text-white p-4 rounded-full hover:bg-red-900 transition shadow-2xl cursor-pointer transform hover:scale-110">
                      <PencilIcon className="w-6 h-6" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-4xl font-bold text-gray-900 mb-3">
                    {profile.fullName || "Student Name"}
                  </h3>
                  <div className="space-y-2 text-lg">
                    <p className="text-gray-600">
                      <strong>LRN:</strong> {profile.lrn || "N/A"}
                    </p>
                    <p className="text-gray-700 font-semibold text-xl">
                      {profile.gradeLevel} {profile.section && `- ${profile.section}`}
                    </p>
                    <p className="text-gray-600">
                      <strong>Email:</strong> {profile.wmsuEmail || "Not set"}
                    </p>
                    <p className="text-gray-600">
                      <strong>Contact:</strong> {profile.contact || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* EDIT FORM */}
              {isEditing && (
                <div className="border-t-2 border-gray-200 pt-10 mt-10">
                  <h4 className="text-2xl font-bold text-gray-800 mb-8">Edit Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-800 transition text-lg"
                        placeholder="Juan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Middle Name</label>
                      <input
                        type="text"
                        name="middleName"
                        value={profile.middleName}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-800 transition text-lg"
                        placeholder="Mabini"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-800 transition text-lg"
                        placeholder="Dela Cruz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Grade Level</label>
                      <input
                        type="text"
                        name="gradeLevel"
                        value={profile.gradeLevel}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-800 transition text-lg"
                        placeholder="Grade 5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
                      <input
                        type="text"
                        name="section"
                        value={profile.section}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-800 transition text-lg"
                        placeholder="Love"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                      <input
                        type="text"
                        name="contact"
                        value={profile.contact}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-800 transition text-lg"
                        placeholder="09xxxxxxxxx"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">WMSU Email</label>
                      <input
                        type="email"
                        name="wmsuEmail"
                        value={profile.wmsuEmail}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-800 transition text-lg"
                        placeholder="123456789@wmsu.edu.ph"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex gap-6 justify-center">
                    <button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-red-800 to-red-900 text-white px-10 py-5 rounded-xl hover:shadow-2xl transition font-bold text-xl shadow-xl"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 text-gray-800 px-10 py-5 rounded-xl hover:bg-gray-300 transition font-bold text-xl shadow-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
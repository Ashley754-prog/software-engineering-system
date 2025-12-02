import React, { useEffect, useState } from "react";
import { UserCircleIcon, PencilIcon } from "@heroicons/react/24/solid";

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full">
              <UserCircleIcon className="w-12 h-12 text-red-800" />
            </div>
            <h2 className="text-3xl font-bold text-white">Student Profile</h2>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full">
              <UserCircleIcon className="w-12 h-12 text-red-800" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Student Profile</h2>
              <p className="text-sm text-red-100">Manage your information and profile picture</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-red-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 font-semibold shadow-md"
          >
            <PencilIcon className="w-5 h-5" />
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded border border-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-20 h-20 text-gray-500" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-2 right-2 bg-red-800 text-white p-2 rounded-full hover:bg-red-900 transition shadow-lg cursor-pointer">
                <PencilIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{profile.fullName}</h3>
            {profile.lrn && (
              <p className="text-sm text-gray-600 mb-2">LRN: {profile.lrn}</p>
            )}
            <p className="text-sm text-gray-700">
              {profile.gradeLevel} {profile.section && `- ${profile.section}`}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="border-t pt-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={profile.middleName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
                <input
                  type="text"
                  name="gradeLevel"
                  value={profile.gradeLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                <input
                  type="text"
                  name="section"
                  value={profile.section}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                <input
                  type="text"
                  name="contact"
                  value={profile.contact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">WMSU Email</label>
                <input
                  type="email"
                  name="wmsuEmail"
                  value={profile.wmsuEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSave}
                className="bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-900 transition font-semibold shadow-md"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { UserCircleIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Maria",
    lastName: "Mercedes",
    email: "maria.mercedes@wmsu.edu.ph",
    department: "WMSU-ILS Department",
    position: "Grade 3 Adviser",
    subjects: "English, Filipino, Arpan",
    bio: "Dedicated educator with a passion for teaching and student development."
  });

  const [schedules, setSchedules] = useState([
    { id: 1, day: "Monday - Friday", time: "8:00 AM - 9:00 AM", subject: "English", gradeSection: "Grade 3 - Wisdom" },
    { id: 2, day: "Monday - Friday", time: "10:00 AM - 11:00 AM", subject: "Filipino", gradeSection: "Grade 3 - Diligence" },
    { id: 3, day: "Monday - Friday", time: "11:00 AM - 12:00 NOON", subject: "Arpan", gradeSection: "Grade 3 - Diligence" },
    { id: 4, day: "Monday - Friday", time: "1:00 PM - 2:00 PM", subject: "English", gradeSection: "Grade 3 - Wisdom" }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (id, field, value) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, [field]: value } : schedule
    ));
  };

  const addSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      day: "Monday - Friday",
      time: "",
      subject: "",
      gradeSection: ""
    };
    setSchedules([...schedules, newSchedule]);
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full">
              <UserCircleIcon className="w-12 h-12 text-red-800" />
            </div>
            <h2 className="text-4xl font-bold text-white">Teacher Profile</h2>
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

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="flex items-start gap-8 mb-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
              <UserCircleIcon className="w-32 h-32 text-gray-500" />
            </div>
            {isEditing && (
              <button className="absolute bottom-2 right-2 bg-red-800 text-white p-3 rounded-full hover:bg-red-900 transition shadow-lg">
                <PencilIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-grow">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Ms. {profileData.firstName} {profileData.lastName}
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-semibold">
                {profileData.position}
              </span>
              <span className="text-gray-600 text-sm">{profileData.department}</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-1">Subject Taught</p>
              <p className="text-gray-900 font-medium">{profileData.subjects}</p>
            </div>
          </div>
        </div>

        {/* Class Schedule */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-red-800 w-1 h-8 rounded"></span>
              Class Schedule
            </h4>
            {isEditing && (
              <button
                onClick={addSchedule}
                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition flex items-center gap-2 text-sm font-semibold"
              >
                <PlusIcon className="w-4 h-4" />
                Add Schedule
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-red-800 to-red-900 text-white">
                <tr>
                  <th className="border border-red-700 px-4 py-3 text-left font-semibold">DAY</th>
                  <th className="border border-red-700 px-4 py-3 text-left font-semibold">TIME</th>
                  <th className="border border-red-700 px-4 py-3 text-left font-semibold">SUBJECT</th>
                  <th className="border border-red-700 px-4 py-3 text-left font-semibold">GRADE/SECTION</th>
                  {isEditing && <th className="border border-red-700 px-4 py-3 text-center font-semibold">ACTION</th>}
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr key={schedule.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border border-gray-300 px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={schedule.day}
                          onChange={(e) => handleScheduleChange(schedule.id, 'day', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-800 focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-800">{schedule.day}</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={schedule.time}
                          onChange={(e) => handleScheduleChange(schedule.id, 'time', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-800 focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-800">{schedule.time}</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={schedule.subject}
                          onChange={(e) => handleScheduleChange(schedule.id, 'subject', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-800 focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-800">{schedule.subject}</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={schedule.gradeSection}
                          onChange={(e) => handleScheduleChange(schedule.id, 'gradeSection', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-800 focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-800">{schedule.gradeSection}</span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <TrashIcon className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Profile Information Form - Only show when editing */}
        {isEditing && (
          <div className="border-t-2 border-gray-200 pt-8">
            <h4 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="bg-red-800 w-1 h-8 rounded"></span>
              Edit Profile Information
            </h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none shadow-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none shadow-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none shadow-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={profileData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none shadow-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subjects Taught
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={profileData.subjects}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none shadow-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                className="bg-red-800 text-white px-8 py-3 rounded-lg hover:bg-red-900 transition font-semibold shadow-md"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition font-semibold shadow-md"
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
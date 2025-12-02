import React, { useState } from "react";
import {
  UserCircleIcon,
  PencilIcon,
  PhotoIcon,
  BellIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  CheckIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

export default function AdminSettings({ sidebarOpen }) {
  const [isEditing, setIsEditing] = useState(false);

  const adminData = {
    fullName: "Juan Dela Cruz",
    email: "admin@wmsu-ils.edu.ph",
    contact: "0917-987-6543",
    role: "School Administrator",
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-all duration-300 ${
        sidebarOpen ? "ml-64" : "ml-20"
      }`}
    >
      <div className="space-y-6">
        
        {/* HEADER CARD — identical structure to Reports header */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4">
          <div className="flex items-center gap-4">
            <Cog6ToothIcon className="w-20 h-20 text-red-800 transition-transform duration-300 hover:scale-105" />
            <h2 className="text-5xl font-bold text-gray-900">Admin Settings</h2>
          </div>
        </div>

        {/* OPTIONAL SMALL DESCRIPTION (same style as Reports) */}
        <p className="text-gray-600">
          Manage your admin profile, privacy, notifications, and account preferences.
        </p>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <UserCircleIcon className="w-20 h-20 text-gray-400" />
              </div>

              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-red-800 text-white p-2 rounded-full cursor-pointer hover:bg-red-900 transition">
                  <PhotoIcon className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {adminData.fullName}
              </h2>
              <p className="text-gray-600">{adminData.role}</p>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 text-red-700" />
                  <span>{adminData.email}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-red-700" />
                  <span>{adminData.contact}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition text-sm font-medium flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* EDIT FORM */}
          {isEditing && (
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={adminData.fullName}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-600 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  defaultValue={adminData.contact}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-600 transition"
                />
              </div>

              <div className="flex gap-3">
                <button className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition font-medium flex items-center gap-2">
                  <CheckIcon className="w-5 h-5" />
                  Save Changes
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SETTINGS LIST — spaced just like sections in Reports page */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow border border-gray-200 divide-y divide-gray-200">

            {/* Notifications */}
            <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <BellIcon className="w-10 h-10 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">
                    System-wide alerts and updates
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all"></div>
              </label>
            </div>

            {/* Password */}
            <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <LockClosedIcon className="w-10 h-10 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600">
                    Update your administrator password
                  </p>
                </div>
              </div>
              <button className="text-purple-600 hover:text-purple-800 font-medium text-sm">
                Change →
              </button>
            </div>

            {/* Security */}
            <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <ShieldCheckIcon className="w-10 h-10 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Security</h3>
                  <p className="text-sm text-gray-600">
                    Manage access & permissions
                  </p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                Open →
              </button>
            </div>

          </div>
        </div>

        {/* Sign Out */}
        <div className="text-center pt-4 pb-10">
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            Sign Out of Account
          </button>
        </div>

      </div>
    </div>
  );
}

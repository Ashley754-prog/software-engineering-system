import React, { useState } from "react";

export default function AdminCreateK3() {
  const [formData, setFormData] = useState({
    lrn: "",
    firstName: "",
    lastName: "",
    sex: "",
    gradeLevel: "",
    section: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Student account created + QR generated!");
  };

  return (
    <div className="space-y-8">

      <div className="bg-white shadow rounded-lg p-6 border-b-4 border-b-red-800">
        <h2 className="text-4xl font-bold text-gray-900">Create K–3 Student Account</h2>
        <p className="text-gray-600 mt-2">
          Admin-only form for generating student accounts and QR codes.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-6 rounded-lg shadow mx-auto space-y-5"
      >
        <div>
          <label className="block font-semibold mb-1">LRN</label>
          <input
            type="text"
            name="lrn"
            value={formData.lrn}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Sex</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select Sex</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Grade Level</label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            >
              <option value="">Select Grade</option>
              <option>Kinder</option>
              <option>Grade 1</option>
              <option>Grade 2</option>
              <option>Grade 3</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Section</label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-800 text-white py-3 rounded-lg hover:bg-red-700 transition"
        >
          Create Account + Generate QR
        </button>
      </form>
    </div>
  );
}

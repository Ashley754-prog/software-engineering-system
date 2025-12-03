import React, { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import QRCode from 'qrcode';
import Papa from "papaparse";
import authService from "../../api/userService";

export default function AdminCreateStudentAccounts() {
  const [formData, setFormData] = useState({
    profilePic: "",

    lrn: "",
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    sex: "",
    gradeLevel: "",
    section: "",
    contact: "",
    wmsuEmail: "",
    password: "",
  });

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvResults, setCsvResults] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLRNChange = (e) => {
    const lrn = e.target.value;
    setFormData({ 
      ...formData, 
      lrn: lrn,
      wmsuEmail: lrn ? `${lrn}@wmsu.edu.ph` : ""
    });
  };

  const generatePassword = () => {
    const password = `WMSU${formData.lrn.slice(-4)}${Math.floor(Math.random() * 1000)}`;
    setFormData({ ...formData, password: password });
    setGeneratedPassword(password);
    setShowPassword(true);
  };

  const downloadSampleCsv = () => {
    const header = "lrn,full_name,section,grade,email,password,age,sex,contact\n";
    const sample = "2025000002,Juana Dela Cruz,10-A,10,2025000002@wmsu.edu.ph,Temp1234,10,Male,09123456789\n";
    const blob = new Blob([header + sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students-sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setCsvFile(file);
    setCsvResults([]);
    setUploadError("");
  };

  const processCsvRows = async (rows) => {
    setIsUploading(true);
    setUploadError("");
    const results = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNumber = index + 2;

      try {
        const lrn = (row.lrn || "").toString().trim();
        const fullName = (row.full_name || "").toString().trim();
        const section = (row.section || "").toString().trim();
        const grade = (row.grade || "").toString().trim();
        const email = (row.email || "").toString().trim();
        const password = (row.password || "").toString().trim();
        const ageStr = (row.age ?? "").toString().trim();
        const sex = (row.sex || "").toString().trim();
        const contact = (row.contact || "").toString().trim();

        if (!lrn || !fullName || !section || !grade || !email || !password || !ageStr || !sex || !contact) {
          throw new Error("Missing required fields (lrn, full_name, section, grade, email, password, age, sex, contact)");
        }

        if (!email.toLowerCase().endsWith("@wmsu.edu.ph")) {
          throw new Error("Email must end with @wmsu.edu.ph");
        }

        const age = parseInt(ageStr, 10);
        if (Number.isNaN(age)) {
          throw new Error(`Invalid age value: "${ageStr}"`);
        }

        // Split full_name into first, middle, last (best-effort)
        const nameParts = fullName.split(" ").filter(Boolean);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
        const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

        const gradeLevel = grade; // Map CSV "grade" to backend "gradeLevel"

        const studentData = {
          lrn,
          firstName,
          middleName,
          lastName,
          age,
          sex,

          gradeLevel,
          section,
          contact,
          wmsuEmail: email,
          password,
          profilePic: null
        };

        const response = await fetch('http://localhost:3001/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create student');
        }

        try {
          await authService.register({
            email: email,
            password: password,
            confirmPassword: password,
            firstName: firstName,
            lastName: lastName,
            username: lrn,
            role: "student",
          });
        } catch (err) {
          console.error("Failed to create auth user for student from CSV:", err);
        }

        results.push({
          row: rowNumber,
          lrn,
          email,
          password,
          status: "Success",
          error: ""
        });
      } catch (error) {
        console.error("CSV row error:", error);
        results.push({
          row: rowNumber,
          lrn: row.lrn || "",
          email: row.email || "",
          password: "",
          status: "Failed",
          error: error.message || "Unknown error"
        });
      }
    }

    setCsvResults(results);
    setIsUploading(false);
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      setUploadError("Please select a CSV file first.");
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results || !results.data) {
          setUploadError("CSV file is empty or invalid.");
          return;
        }
        processCsvRows(results.data);
      },
      error: (error) => {
        console.error("CSV parse error:", error);
        setUploadError(error.message || "Failed to parse CSV file.");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.password) {
        alert('Please generate a password first!');
        return;
      }

      const qrData = JSON.stringify({
        lrn: formData.lrn,
        name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`,
        gradeLevel: formData.gradeLevel,
        section: formData.section,
        email: formData.wmsuEmail
      });

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' }
      });

      const studentData = {
        lrn: formData.lrn,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        sex: formData.sex,
        gradeLevel: formData.gradeLevel,
        section: formData.section,
        contact: formData.contact,
        wmsuEmail: formData.wmsuEmail,
        password: formData.password,
        profilePic: formData.profilePic || null
      };

      const response = await fetch('http://localhost:3001/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      const result = await response.json();

      if (response.ok) {
        try {
          await authService.register({
            email: formData.wmsuEmail,
            password: formData.password,
            confirmPassword: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.lrn,
            role: "student",
          });
        } catch (err) {
          console.error("Failed to create auth user for student:", err);
        }

        alert(`Student account created successfully!\n\nEmail: ${formData.wmsuEmail}\nPassword: ${formData.password}\n\nPlease save this password!`);
        
        setFormData({
          profilePic: "", lrn: "", firstName: "", middleName: "", lastName: "",
          age: "", sex: "", gradeLevel: "", section: "", contact: "",
          wmsuEmail: "", password: ""
        });
        setGeneratedPassword("");
        setShowPassword(false);
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6 border-b-4 border-b-red-800">
        <h2 className="text-4xl font-bold text-gray-900">Create Student Account (K to Grade 6)</h2>
        <p className="text-gray-600 mt-2">Admin-only form for generating student accounts and QR codes.</p>
      </div>
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow mx-auto space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900">Bulk Upload Student Accounts via CSV</h3>
        <p className="text-gray-600 text-sm">
          Upload a CSV file to create multiple student accounts at once. Make sure the file follows the required format.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={downloadSampleCsv}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold"
          >
            Download Sample CSV
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvFileChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleCsvUpload}
            disabled={isUploading}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${isUploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isUploading ? "Uploading..." : "Upload & Create Accounts"}
          </button>
        </div>
        {uploadError && (
          <p className="text-red-600 text-sm mt-2">
            {uploadError}
          </p>
        )}
        {csvResults.length > 0 && (
          <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded-md">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="px-3 py-2 border">Row</th>
                  <th className="px-3 py-2 border">LRN</th>
                  <th className="px-3 py-2 border">Email</th>
                  <th className="px-3 py-2 border">Password</th>
                  <th className="px-3 py-2 border">Status</th>
                  <th className="px-3 py-2 border">Error</th>
                </tr>
              </thead>
              <tbody>
                {csvResults.map((result) => (
                  <tr key={result.row} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{result.row}</td>
                    <td className="px-3 py-2 border">{result.lrn}</td>
                    <td className="px-3 py-2 border">{result.email}</td>
                    <td className="px-3 py-2 border">{result.password}</td>
                    <td className="px-3 py-2 border">
                      <span className={result.status === "Success" ? "text-green-700" : "text-red-700"}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 border text-xs text-red-700">{result.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white p-6 rounded-lg shadow mx-auto space-y-5">
        {/* Profile Picture Upload - UNCHANGED */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-xl">
              {formData.profilePic ? (
                <img src={formData.profilePic} alt="Student" className="w-full h-full rounded-full object-cover border-4 border-white" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                  <UserCircleIcon className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-red-800 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-red-700 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, profilePic: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
          <p className="mt-3 text-sm text-gray-600">Upload Student Photo</p>
        </div>

        {/* LRN - UNCHANGED */}
        <div>
          <label className="block font-semibold mb-1">LRN (Learner Reference Number)</label>
          <input type="text" name="lrn" value={formData.lrn} onChange={handleLRNChange} className="w-full border p-3 rounded-lg" placeholder="e.g., 123456789012" maxLength="12" required />
          <p className="text-xs text-gray-500 mt-1">12-digit unique identifier</p>
        </div>

        {/* Name Fields - UNCHANGED */}
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block font-semibold mb-1">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border p-3 rounded-lg" required /></div>
          <div><label className="block font-semibold mb-1">Middle Name</label><input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full border p-3 rounded-lg" required /></div>
          <div><label className="block font-semibold mb-1">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border p-3 rounded-lg" required /></div>
        </div>

        {/* Age & Sex - UNCHANGED */}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block font-semibold mb-1">Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border p-3 rounded-lg" min="3" max="12" required /></div>
          <div><label className="block font-semibold mb-1">Sex</label>
            <select name="sex" value={formData.sex} onChange={handleChange} className="w-full border p-3 rounded-lg" required>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* ONLY THIS PART CHANGED: Grade Level + Section with G4-G6 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Grade Level</label>
            <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} className="w-full border p-3 rounded-lg" required>
              <option value="">Select Grade</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Section</label>
            <select name="section" value={formData.section} onChange={handleChange} className="w-full border p-3 rounded-lg" required>
              <option value="">Select Section</option>
              
              {formData.gradeLevel === "Kindergarten" && <option value="Love">Love</option>}
              {formData.gradeLevel === "Grade 1" && <option value="Humility">Humility</option>}
              {formData.gradeLevel === "Grade 2" && <option value="Kindness">Kindness</option>}
              {formData.gradeLevel === "Grade 3" && (
                <>
                  <option value="Diligence">Diligence</option>
                  <option value="Wisdom">Wisdom</option>
                </>
              )}
              {formData.gradeLevel === "Grade 4" && (
                <>
                  <option value="Section A">Section A (TBA)</option>
                  <option value="Section B">Section B (TBA)</option>
                </>
              )}
              {formData.gradeLevel === "Grade 5" && (
                <>
                  <option value="Section A">Section A (TBA)</option>
                  <option value="Section B">Section B (TBA)</option>
                </>
              )}
              {formData.gradeLevel === "Grade 6" && (
                <>
                  <option value="Section A">Section A (TBA)</option>
                  <option value="Section B">Section B (TBA)</option>
                  <option value="Section C">Section C (TBA)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Everything below is 100% YOUR ORIGINAL */}
        <div>
          <label className="block font-semibold mb-1">Contact Number (Parent/Guardian)</label>
          <input type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full border p-3 rounded-lg" placeholder="e.g., 09123456789" pattern="[0-9]{11}" required />
          <p className="text-xs text-gray-500 mt-1">11-digit mobile number</p>
        </div>

        <div>
          <label className="block font-semibold mb-1">WMSU Email</label>
          <input type="email" value={formData.wmsuEmail} className="w-full border p-3 rounded-lg bg-gray-100" readOnly />
          <p className="text-xs text-gray-500 mt-1">Auto-generated based on LRN</p>
        </div>

        <div>
          <label className="block font-semibold mb-1">Password</label>
          <div className="flex gap-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 border p-3 rounded-lg"
              placeholder="Click 'Generate Password'"
              required
            />
            <button
              type="button"
              onClick={generatePassword}
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
          {generatedPassword && (
            <p className="text-sm text-green-600 mt-2 font-semibold">
              Password generated: {generatedPassword}
            </p>
          )}
        </div>

        <button type="submit" className="w-full bg-red-800 text-white py-3 rounded-lg hover:bg-red-700 font-semibold text-lg">
          Create Account + Generate QR Code
        </button>
      </form>
    </div>
  );
}
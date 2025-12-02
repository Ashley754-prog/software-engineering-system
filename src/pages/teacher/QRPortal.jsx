import React, { useState, useEffect, useRef } from "react";
import { QrCodeIcon, CameraIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function QRPortal() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Fetch students for display
    fetchStudents();
    
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // This would typically fetch from your API
      // For now, using mock data
      const mockStudents = [
        { id: 1, lrn: "123456789012", name: "Juan Dela Cruz", grade: "Grade 3", section: "Wisdom", status: "Present" },
        { id: 2, lrn: "123456789013", name: "Maria Santos", grade: "Grade 3", section: "Diligence", status: "Absent" },
        { id: 3, lrn: "123456789014", name: "Jose Reyes", grade: "Grade 3", section: "Wisdom", status: "Present" },
      ];
      setStudents(mockStudents);
    } catch (err) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError("");
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      // Simulate QR code scanning (in real app, you'd use a QR scanning library)
      setTimeout(() => {
        simulateQRScan();
      }, 3000);
      
    } catch (err) {
      setError("Failed to access camera");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate finding a QR code
    const mockQRData = JSON.stringify({
      lrn: "123456789012",
      name: "Juan Dela Cruz",
      grade: "Grade 3",
      section: "Wisdom"
    });
    
    setScannedData(mockQRData);
    
    // Update student attendance
    setStudents(prev => prev.map(student => 
      student.lrn === "123456789012" 
        ? { ...student, status: "Present", lastScan: new Date().toLocaleTimeString() }
        : student
    ));
    
    stopScanning();
  };

  const handleManualInput = (lrn) => {
    const student = students.find(s => s.lrn === lrn);
    if (student) {
      setStudents(prev => prev.map(s => 
        s.lrn === lrn 
          ? { ...s, status: s.status === "Present" ? "Absent" : "Present", lastScan: new Date().toLocaleTimeString() }
          : s
      ));
      setScannedData(`Manual check-in: ${student.name}`);
    } else {
      setError("Student not found");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full">
            <QrCodeIcon className="w-12 h-12 text-red-800" />
          </div>
          <h2 className="text-4xl font-bold text-white">QR Code Portal</h2>
        </div>
      </div>

      {/* Scanner Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera/Scanner */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">QR Scanner</h3>
            
            {!isScanning ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Click to start scanning QR codes</p>
                <button
                  onClick={startScanning}
                  className="bg-red-800 text-white px-6 py-3 rounded-lg hover:bg-red-900 transition font-semibold"
                >
                  Start Scanner
                </button>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 border-2 border-red-800 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 border-2 border-white rounded-lg"></div>
                  </div>
                </div>
                <button
                  onClick={stopScanning}
                  className="absolute top-4 right-4 bg-red-800 text-white p-2 rounded-full hover:bg-red-900 transition"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
                  Scanning...
                </div>
              </div>
            )}

            {scannedData && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
                <h4 className="font-semibold text-green-800">Last Scan:</h4>
                <p className="text-sm text-green-700">{scannedData}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Manual Input */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Manual Check-in</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter LRN (Learning Reference Number)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualInput(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <p className="text-sm text-gray-600">Enter LRN and press Enter to check in/out</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Today's Attendance</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading students...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">LRN</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Grade & Section</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Last Scan</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">{student.lrn}</td>
                    <td className="border border-gray-300 px-4 py-3">{student.name}</td>
                    <td className="border border-gray-300 px-4 py-3">{student.grade} - {student.section}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.status === "Present" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {student.lastScan || "-"}
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

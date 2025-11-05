import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { CalendarDateRangeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AttendancePage() {
  const [studentId, setStudentId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [section, setSection] = useState("Grade 6 - LOYALTY");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");

  const [students, setStudents] = useState([
    { id: "202501", name: "Juan Dela Cruz" },
    { id: "202502", name: "Maria Santos" },
    { id: "202503", name: "Pedro Reyes" },
  ]);

  const [attendanceSheet, setAttendanceSheet] = useState({});

  const videoRef = useRef(null);
  const totalStudents = students.length;

  const handleCheckIn = (id) => {
    if (!id) return;
    const newRecord = { id, section, date, time: new Date().toLocaleTimeString() };
    setAttendanceRecords([newRecord, ...attendanceRecords]);
    setAttendanceSheet((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [date]: "P" },
    }));
    setStudentId("");
    setScanResult(id);
  };

  useEffect(() => {
    if (!scannerOpen) return;
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (result) handleCheckIn(result.text);
        if (error) console.error(error);
      })
      .catch(console.error);
    return () => codeReader.reset();
  }, [scannerOpen]);

  const allDates = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    return d.toISOString().slice(0, 10);
  });

  const computeTotals = (id) => {
    const records = attendanceSheet[id] || {};
    const presentDays = Object.values(records).filter((v) => v === "P").length;
    const totalDays = allDates.length;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
    return { presentDays, percentage };
  };

  const handleExportExcel = () => {
    const header = ["Student ID", "Name", ...allDates, "Total Present", "Attendance %"];
    const rows = students.map((s) => {
      const totals = computeTotals(s.id);
      const attendanceRow = allDates.map((d) => attendanceSheet[s.id]?.[d] || "");
      return [s.id, s.name, ...attendanceRow, totals.presentDays, `${totals.percentage}%`];
    });
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SF2_Attendance");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `SF2_${section}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const presentCount = attendanceRecords.filter(
    (r) => r.section === section && r.date === date
  ).length;
  const absentCount = totalStudents - presentCount;
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().slice(0, 10);
    const present = attendanceRecords.filter((r) => r.section === section && r.date === dayStr).length;
    return { date: dayStr, present };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CalendarDateRangeIcon className="w-10 h-10 text-red-800" />
          Students Attendance
        </h2>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Export SF2 Excel
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Section</label>
            <select
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-700"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option>Grade 6 - LOYALTY</option>
              <option>Grade 6 - HONESTY</option>
              <option>Grade 6 - PERSEVERANCE</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-700"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-700"
              placeholder="Scan or type ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <button
            onClick={() => handleCheckIn(studentId)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition"
          >
            Check In
          </button>
        </div>

        <button
          onClick={() => setScannerOpen(!scannerOpen)}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          {scannerOpen ? "Close QR Scanner" : "Open QR Scanner"}
        </button>

        {scannerOpen && (
          <div className="mt-4 border rounded-md overflow-hidden">
            <video ref={videoRef} style={{ width: "100%", borderRadius: "12px" }} />
            <p className="mt-2 text-gray-700">Last scanned ID: {scanResult}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex justify-around">
        <div className="text-center">
          <h3 className="text-gray-700 font-medium">Section: {section}</h3>
        </div>
        <div className="text-center">
          <h3 className="text-red-600 font-semibold text-lg">{presentCount}</h3>
          <p className="text-gray-600 text-sm">Present</p>
        </div>
        <div className="text-center">
          <h3 className="text-gray-800 font-semibold text-lg">{absentCount}</h3>
          <p className="text-gray-600 text-sm">Absent</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Attendance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="present" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          SF2-style Attendance Encoding
        </h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-red-700 text-white">
              <th className="p-2 text-left">Student ID</th>
              <th className="p-2 text-left">Name</th>
              {allDates.map((d) => (
                <th key={d} className="p-2 text-center">{d}</th>
              ))}
              <th className="p-2 text-center">Total Present</th>
              <th className="p-2 text-center">%</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const totals = computeTotals(s.id);
              return (
                <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">{s.name}</td>
                  {allDates.map((d) => (
                    <td key={d} className="p-1 text-center">
                      <input
                        type="text"
                        value={attendanceSheet[s.id]?.[d] || ""}
                        onChange={(e) =>
                          setAttendanceSheet((prev) => ({
                            ...prev,
                            [s.id]: { ...(prev[s.id] || {}), [d]: e.target.value.toUpperCase() },
                          }))
                        }
                        maxLength={1}
                        className="w-10 text-center border rounded-md p-1 focus:ring-1 focus:ring-red-700"
                      />
                    </td>
                  ))}
                  <td className="p-2 text-center font-semibold">{totals.presentDays}</td>
                  <td className="p-2 text-center font-semibold text-red-700">{totals.percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

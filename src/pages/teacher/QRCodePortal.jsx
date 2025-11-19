import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  QrCodeIcon,
  CameraIcon,
  UsersIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,    
  FunnelIcon,             
  IdentificationIcon,  
  UserCircleIcon,   
  CalendarIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  DocumentArrowDownIcon,
  PrinterIcon as PrinterIconSolid,
} from "@heroicons/react/24/solid";

export default function QRCodePortal() {
  const [scannerActive, setScannerActive] = useState(false);
  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState("scanner");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All Status");
  const options = ["Present", "Late", "Absent"];

  const todayScans = 23;
  const presentStudents = 235;
  const lateStudents = 12;
  const absentStudents = 15;

  useEffect(() => {
    if (!scannerActive || !videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(null, videoRef.current, (result) => {
      if (result) {
        console.log("QR Scanned:", result.text);
        alert(`Student checked in: ${result.text}`);
      }
    });

    return () => codeReader.reset();
  }, [scannerActive]);

  return (
    <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <QrCodeIcon className="w-10 h-10 text-red-800" />
            QR Code Portal
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{todayScans}</p>
                <p className="text-sm opacity-90 mt-1">Today's Scans</p>
                <p className="text-xs opacity-80">Total check-ins today</p>
              </div>
              <QrCodeIcon className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{presentStudents}</p>
                <p className="text-sm opacity-90 mt-1">Present</p>
                <p className="text-xs opacity-80">95.1% attendance</p>
              </div>
              <ClockIcon className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{lateStudents}</p>
                <p className="text-sm opacity-90 mt-1">Late</p>
                <p className="text-xs opacity-80">Students arrived late</p>
              </div>
              <ExclamationTriangleIcon className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{absentStudents}</p>
                <p className="text-sm opacity-90 mt-1">Absent</p>
                <p className="text-xs opacity-80">Notifications sent</p>
              </div>
              <UsersIcon className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 border-b border-gray-300 pb-6">
          <button
            onClick={() => setActiveTab("scanner")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === "scanner"
                ? "bg-red-700 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <QrCodeIcon className="w-8 h-8" />
            Scan QR Code
          </button>

          <button
            onClick={() => setActiveTab("idcards")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === "idcards"
                ? "bg-red-700 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <IdentificationIcon className="w-8 h-8" />
            Generate ID Cards
          </button>

          <button
            onClick={() => setActiveTab("log")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === "log"
                ? "bg-red-700 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <UsersIcon className="w-8 h-8" />
            Attendance Log
          </button>
        </div>

        {activeTab === "scanner" && (
          <div className="space-y-12">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200 max-w-xl mx-auto">
              <div className="bg-gray-800 rounded-3xl w-full h-[450px] relative overflow-hidden">
                {scannerActive ? (
                  <video ref={videoRef} className="w-3xl object-cover rounded-3xl" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="bg-gray-700 border-4 border-dashed border-gray-600 rounded-3xl w-48 h-48 mx-auto flex items-center justify-center mb-6">
                        <CameraIcon className="w-20 h-20 text-gray-500" />
                      </div>
                      <p className="text-gray-400 text-lg">Camera view will appear here</p>
                      <p className="text-gray-500 text-sm mt-2">Position the QR code within the frame</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-6 mt-10">
                <button
                  onClick={() => setScannerActive(!scannerActive)}
                  className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-sm flex items-center gap-4 shadow-lg transition"
                >
                  <CameraIcon className="w-5 h-5" />
                  {scannerActive ? "Stop Camera" : "Start Camera"}
                </button>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm flex items-center gap-4 shadow-md transition">
                  <CloudArrowUpIcon className="w-5 h-5" />
                  Upload QR Code
                </button>
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-8 max-w-xl mx-auto">
              <h3 className="font-bold text-gray-800 mb-4">How to scan:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-700 font-bold">•</span>
                  Position the student's ID card within the scanning frame
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-700 font-bold">•</span>
                  Hold steady until the QR code is detected
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-700 font-bold">•</span>
                  Attendance will be automatically recorded
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "idcards" && (
          <div className="max-w-3xl mx-auto space-y-10">

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-12 pr-6 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                />
              </div>
              <button className="px-8 py-4 bg-white border border-gray-300 rounded-xl flex items-center gap-3 hover:bg-gray-50 transition shadow-sm">
                <FunnelIcon className="w-6 h-6 text-gray-600" />
                <span className="font-medium">Filter</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 w-[800px] h-[700px]">
              <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-10 py-8 text-center">
                <h3 className="text-2xl font-bold tracking-wide">WMSU-ILS - Elementary Department</h3>
                <p className="text-lg opacity-90 mt-1">Integrated Learning System</p>
              </div>

              <div className="p-12 bg-white">
                <div className="flex items-center gap-12 mb-16 ml-5">
                <div className="shrink-0">
                  <div className="w-30 h-30 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden border-4 border-white">
                    <UserCircleIcon className="w-25 h-25 text-blue-600" />
                  </div>
                </div>

                <div className="flex-1 space-y-3 -ml-5">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                      Bautista, Juan Miguel Mortel
                    </h2>
                    <p className="text-base text-gray-700 font-medium -mt-2">
                      LRN: <span className="font-montserrat text-lg">123456789123</span>
                    </p>
                    <p className="text-base font-semibold text-red-800 -mt-2">
                      Grade 6 - LOYALTY
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-60 h-60 -mt-10 bg-gray-100 border-4 border-dashed border-gray-400 rounded-2xl flex items-center justify-center shadow-2xl">
                    <QrCodeIcon className="w-40 h-40 text-gray-600" />
                  </div>
                </div>

                <div className="flex justify-center gap-8 mt-10">
                  <button className="px-8 py-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-base flex items-center gap-4 shadow-xl transition transform hover:scale-105">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download ID
                  </button>
                  <button className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-base flex items-center gap-4 shadow-lg transition transform hover:scale-105">
                    <PrinterIcon className="w-5 h-5" />
                    Print ID
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "log" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white rounded-3xl shadow-lg p-8 border">
              <div className="grid grid-row-1 md:grid-row-3 gap-6">

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="11/11/2025"
                      className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1"
                      readOnly
                    />
                    <CalendarIcon className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div className="relative w-240">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>

                  <button
                    type="button"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-4 pr-12 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-1 cursor-pointer"
                    onClick={() => setOpen(!open)}
                  >
                    {selected}
                    <ChevronDownIcon
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 -mr-8 ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {open && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
                      {options.map((option) => (
                        <li
                          key={option}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelected(option);
                            setOpen(false);
                          }}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search student..."
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-red-800 text-white text-left">
                      <th className="px-8 py-6 font-bold">STUDENT ID</th>
                      <th className="px-8 py-6 font-bold">NAME</th>
                      <th className="px-8 py-6 font-bold">TIME</th>
                      <th className="px-8 py-6 font-bold">STATUS</th>
                      <th className="px-8 py-6 font-bold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-8 py-6 font-medium">STU012336</td>
                      <td className="px-8 py-6">Michelle Dee</td>
                      <td className="px-8 py-6">7:20 AM</td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Present</span>
                      </td>
                      <td className="px-8 py-6">
                        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                          <PencilSquareIcon className="w-5 h-5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-8 py-6 font-medium">STU019368</td>
                      <td className="px-8 py-6">Michelle Dee-Naliligo</td>
                      <td className="px-8 py-6">7:40 AM</td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">Late</span>
                      </td>
                      <td className="px-8 py-6">
                        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                          <PencilSquareIcon className="w-5 h-5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-8 py-6 font-medium">STU012335</td>
                      <td className="px-8 py-6">Michelle Dee-Epektibo</td>
                      <td className="px-8 py-6">—</td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">Absent</span>
                      </td>
                      <td className="px-8 py-6">
                        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                          <PencilSquareIcon className="w-5 h-5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-lg transition">
                <DocumentArrowDownIcon className="w-5 h-5" />
                Export PDF
              </button>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-lg transition">
                <DocumentArrowDownIcon className="w-5 h-5" />
                Export Excel
              </button>
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-md transition">
                <PrinterIconSolid className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>
        )}
      </div>
  );
}
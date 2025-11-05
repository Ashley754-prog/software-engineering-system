import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const printRef = useRef();

  const [grades] = useState([
  { subject: "Filipino" },
  { subject: "English" },
  { subject: "Mathematics" },
  { subject: "Science" },
  { subject: "Good Manners and Right Conduct (GMRC)" },
  { subject: "ArPan" },
  { subject: "EPP" },
  { subject: "MAPEH" },
  { subject: "Music and Arts" },
  { subject: "Physical Education and Health" },
]);

  const [remedial] = useState([]); 

  const computeGeneralAverage = () => {
    if (grades.length === 0) return "";
    const sum = grades.reduce((acc, cur) => acc + cur.final, 0);
    return (sum / grades.length).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Download feature coming soon!");
  };

  const months = [
    "Aug", "Sept", "Oct", "Nov", "Dec",
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Total"
  ];

  return (
    <div className="min-h-screen bg-[#e2eaed] text-black-800 font-medium">
      <nav className="no-print bg-[#8f0303] text-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-semibold tracking-wide">
          Pupil's Progress Report Card and Report on Attendance
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-[#ffffff] font-semibold px-4 py-2 hover:bg-red-800 transition"
          >
            <PrinterIcon className="w-5 h-5" />
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-[#ffffff] font-semibold px-4 py-2 hover:bg-red-800 transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate("/student/student-login")}
            className="flex items-center gap-2 text-[#ffffff] font-semibold px-4 py-2 hover:bg-red-800 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="p-6">
        <div
          ref={printRef}
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl border p-8 scale-95 origin-top transform"
          style={{
            transform: "scale(0.90)",
            transformOrigin: "top center",
            padding: "2cm",
            marginBottom: "-6cm",
          }}
        >

          <div className="relative pb-4 mb-6 text-center">
            <img
              src="/wmsu-logo.jpg"
              alt="WMSU Logo"
              className="absolute left-12 top-4 w-25 h-25 object-contain"
            />

            <div>
              <h2 className="text-xl font-bold">
                WESTERN MINDANAO STATE UNIVERSITY
              </h2>
              <p className="text-sm leading-tight">
                College of Teacher Education <br />
                Integrated Laboratory School <br />
                <span className="font-bold">ELEMENTARY DEPARTMENT</span> <br />
                Zamboanga City
              </p>
              <h3 className="font-bold mt-2">PUPIL’S PROGRESS REPORT CARD</h3>
              <div className="flex items-center justify-center">
                <span className="text-sm mr-2">
                  School Year 20
                  <span className="inline-block w-6 border-b border-gray-400 align-bottom mx-1"></span>
                  - 20
                  <span className="inline-block w-6 border-b border-gray-400 align-bottom ml-1"></span>
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 text-sm space-y-2">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Name:</span>
              <span className="flex-1 border-b border-gray-400 mt-2.5"></span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Age:</span>
                <span className="w-16 border-b border-gray-400 block mt-2.5"></span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Sex:</span>
                <span className="w-20 border-b border-gray-400 block mt-2.5"></span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Grade:</span>
                <span className="w-24 border-b border-gray-400 block mt-2.5"></span>
              </div>
              <div className="flex items-center flex-1 min-w-[180px]">
                <span className="font-semibold mr-2">Section:</span>
                <span className="flex-1 border-b border-gray-400 mt-2.5"></span>
              </div>
            </div>

            <div className="flex items-center">
              <span className="font-semibold mr-2">LRN:</span>
              <span className="w-80 border-b border-gray-400 mt-2.5"></span>
            </div>
          </div>

          <div className="w-[98%] mx-auto -mt-5">
            <p className="text-sm mb-4 text-justify leading-relaxed">
              <span>Dear Parents,</span>
              <span className="block indent-4">
                This report card shows the ability and progress of your child has made in the different
                learning areas as well as his/her core values.
              </span>
              <span className="block indent-4">
                The school welcomes you should you desire to know more about your child’s progress.
              </span>
            </p>
          </div>

          <h4 className="font-bold text-center -mt-2 mb-1">
            REPORT ON LEARNING PROGRESS AND ACHIEVEMENT
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan="2" className="border border-gray-300 px-2 py-1">Learning Areas</th>
                  <th colSpan="4" className="border border-gray-300 px-2 py-1">Quarter</th>
                  <th rowSpan="2" className="border border-gray-300 px-2 py-1">Final Grade</th>
                  <th rowSpan="2" className="border border-gray-300 px-2 py-1">Remarks</th>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-2 py-1">1</th>
                  <th className="border border-gray-300 px-2 py-1">2</th>
                  <th className="border border-gray-300 px-2 py-1">3</th>
                  <th className="border border-gray-300 px-2 py-1">4</th>
                </tr>
              </thead>

              <tbody>
                {grades.length > 0 ? (
                  grades.map((g, i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 px-2 py-1 text-left">{g.subject}</td>
                      <td className="border border-gray-300 px-2 py-1">{g.q1}</td>
                      <td className="border border-gray-300 px-2 py-1">{g.q2}</td>
                      <td className="border border-gray-300 px-2 py-1">{g.q3}</td>
                      <td className="border border-gray-300 px-2 py-1">{g.q4}</td>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">{g.final}</td>
                      <td className="border border-gray-300 px-2 py-1">{g.remarks}</td>
                    </tr>
                  ))
                ) : (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="border border-gray-300 px-2 py-3">&nbsp;</td>
                      ))}
                    </tr>
                  ))
                )}

                <tr className="bg-gray-100 font-semibold">
                  <td className="border border-gray-300 px-2 py-1"></td>
                  <td colSpan="4" className="border border-gray-300 px-2 py-1 text-center">General Average</td>
                  <td className="border border-gray-300 px-2 py-1">
                    {grades.length > 0 ? computeGeneralAverage() : ""}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{grades.length > 0 ? "Passed" : ""}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th colSpan="1" className="border border-gray-300 px-2 py-1 text-center">
                      <span className="font-semibold">Remedial Classes</span>
                    </th>
                    <th colSpan="4" className="border border-gray-300 px-2 py-1 text-center">
                      <div className="flex justify-start items-center">
                        <span>Conducted from:</span>
                        <span className="ml-65">to:</span>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Learning Areas</th>
                    <th className="border border-gray-300 px-2 py-1">Final Rating</th>
                    <th className="border border-gray-300 px-2 py-1">Remedial Class Mark</th>
                    <th className="border border-gray-300 px-2 py-1">Recomputed Final Grade</th>
                    <th className="border border-gray-300 px-2 py-1">Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {remedial.length > 0 ? (
                    remedial.map((r, i) => (
                      <tr key={i}>
                        <td className="border border-gray-300 px-2 py-1 text-left">{r.subject}</td>
                        <td className="border border-gray-300 px-2 py-1">{r.finalRating}</td>
                        <td className="border border-gray-300 px-2 py-1">{r.classMark}</td>
                        <td className="border border-gray-300 px-2 py-1">{r.recomputed}</td>
                        <td className="border border-gray-300 px-2 py-1">{r.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="border border-gray-300 px-2 py-3">&nbsp;</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-80 text-center text-sm">
            <div>
              <p className="font-bold underline">MA. NORA D. LAI, Ed.D, JD</p>
              <p>Principal</p>
            </div>
            <div>
              <p className="font-bold underline">LEONEL D. FRANCISCO, Ph.D</p>
              <p>Teacher</p>
            </div>
          </div>

          <hr className="border-gray-900 d mt-15 mb-2" /> 

          <h2 className="text-xl font-bold text-center mt-12 mb-6">REPORT ON ATTENDANCE</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm text-center mb-8">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-2 py-1"></th>
                  {months.map((month, i) => (
                    <th key={i} className="border border-gray-300 px-2 py-1">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 text-left">No. of school days</td>
                  {months.map((_, i) => (
                    <td key={i} className="border border-gray-300 px-2 py-1"></td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 text-left">No. of days present</td>
                  {months.map((_, i) => (
                    <td key={i} className="border border-gray-300 px-2 py-1"></td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 text-left">No. of days absent</td>
                  {months.map((_, i) => (
                    <td key={i} className="border border-gray-300 px-2 py-1"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-10 mb-15 text-center justify-center">
            <h3 className="font-bold text-center mb-4">PARENT / GUARDIAN’S SIGNATURE</h3>
            <div className="space-y-3 text-sm text-center justify-center">
              <p>1<sup>st</sup> Quarter ____________________________________________</p>
              <p>2<sup>nd</sup> Quarter ____________________________________________</p>
              <p>3<sup>rd</sup> Quarter ____________________________________________</p>
              <p>4<sup>th</sup> Quarter ____________________________________________</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="font-bold text-center mt-7 mb-4">Certificate of Transfer</h3>
            <div className="text-sm space-y-2">
              <p>Admitted in Grade ___________________________ Section ___________________</p>
              <p>Eligible to Admission in Grade __________________________________________</p>
              <p>Approved:</p>
              <div className="mt-8 flex justify-center gap-100 text-center text-sm">
                <div>
                  <p className="font-semibold underline">MA. NORA D. LAI, Ed.D, JD</p>
                  <p>Principal</p>
                </div>
                <div>
                  <p className="font-semibold underline">______________________</p>
                  <p>Teacher</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm">
            <h3 className="font-bold text-center mb-4">
              Cancellation of Eligibility to Transfer
            </h3>

            <p>Admitted in: ___________________________</p>

            <div className="flex justify-between items-end mt-2">
              <p>Date: ___________________________</p>

              <div className="text-center">
                <p className="font-semibold underline leading-tight">
                  MA. NORA D. LAI, Ed.D, JD
                </p>
                <p className="leading-tight">Principal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

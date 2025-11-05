import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const printRef = useRef();

  const [studentInfo, setStudentInfo] = useState({
  name: "",
  age: "",
  sex: "",
  gradeLevel: "",
  section: "",
  lrn: "",
});


  const [grades, setGrades] = useState([
  { subject: "Filipino", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "English", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "Mathematics", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "Science", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "Good Manners and Right Conduct (GMRC)", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "ArPan", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "EPP", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "MAPEH", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "Music and Arts", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
  { subject: "Physical Education and Health", q1: "", q2: "", q3: "", q4: "", final: "", remarks: ""  },
]);

  const [remedial, setRemedial] = useState([
  { subject: "", finalRating: "", classMark: "", recomputed: "", remarks: "" },
  ]); 

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
    "Jan", "Feb", "Mar", "Apr", "May", "Jun"
  ];

  const [attendance, setAttendance] = useState({
    schoolDays: Array(10).fill(""),
    daysPresent: Array(10).fill(""),
  });

  const computeTotal = (arr) =>
    arr.map(Number).filter((n) => !isNaN(n)).reduce((a, b) => a + b, 0);

  const computeAbsent = (i) => {
    const sd = Number(attendance.schoolDays[i]);
    const dp = Number(attendance.daysPresent[i]);
    if (isNaN(sd) && isNaN(dp)) return 0; 
    const absent = (isNaN(sd) ? 0 : sd) - (isNaN(dp) ? 0 : dp);
    return absent >= 0 ? absent : 0; 
  };

const handleSaveGrades = () => {
  if (!studentInfo.lrn || !studentInfo.name) {
    alert("Please fill out the student's LRN and Name before saving.");
    return;
  }

  const finals = grades
    .map((g) => Number(g.final))
    .filter((v) => !isNaN(v));

  if (finals.length === 0) {
    alert("Please complete grades before saving.");
    return;
  }

  const generalAverage =
    finals.reduce((a, b) => a + b, 0) / finals.length;

  const studentData = {
    ...studentInfo,
    subjects: grades,
    generalAverage,
  };

  const existing = JSON.parse(localStorage.getItem("studentGrades")) || [];
  const updated = existing.filter((s) => s.lrn !== studentInfo.lrn);
  updated.push(studentData);

  localStorage.setItem("studentGrades", JSON.stringify(updated));
  alert("✅ Grades successfully saved!");
};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4 flex items-center justify-between print:hidden">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <PencilSquareIcon className="w-10 h-10 text-red-800" />
          Pupil's Progress Report Card
        </h2>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <PrinterIcon className="w-5 h-5" />
            Print
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download PDF
          </button>

          <button
            onClick={handleSaveGrades}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Save Grades
          </button>
        </div>
      </div>

      <div className="p-6">
        <div
          ref={printRef}
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl border p-8 scale-95 origin-top transform"
          style={{
            transform: "scale(0.90)",
            transformOrigin: "top center",
            padding: "1.5cm",
            marginBottom: "-6cm",
          }}
        >

          <div className="relative pb-4 mb-6 text-center">
            <img
              src="/wmsu-logo.jpg"
              alt="WMSU Logo"
              className="absolute left-12 top-4 w-28 h-28 object-contain"
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
              <div className="flex items-center justify-center mb-4">
                <span className="text-sm mr-2">
                  School Year 20
                  <input
                    type="text"
                    maxLength={2}
                    placeholder=""
                    className="inline-block w-8 border-b border-gray-900 text-center outline-none mx-1"
                  />
                  - 20
                  <input
                    type="text"
                    maxLength={2}
                    placeholder=""
                    className="inline-block w-8 border-b border-gray-900 text-center outline-none ml-1"
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 text-sm space-y-2">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Name:</span>
              <input
                type="text"
                value={studentInfo.name}
                onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                className="flex-1 border-b border-gray-900 outline-none bg-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Age:</span>
                <input
                  type="text"
                  value={studentInfo.age}
                  onChange={(e) => setStudentInfo({ ...studentInfo, age: e.target.value })}
                  className="w-16 border-b border-gray-900 outline-none bg-transparent text-center"
                />
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Sex:</span>
                <input
                  type="text"
                  value={studentInfo.sex}
                  onChange={(e) => setStudentInfo({ ...studentInfo, sex: e.target.value })}
                  className="w-20 border-b border-gray-900 outline-none bg-transparent text-center"
                />
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Grade:</span>
                <input
                  type="text"
                  value={studentInfo.gradeLevel}
                  onChange={(e) => setStudentInfo({ ...studentInfo, gradeLevel: e.target.value })}
                  className="w-24 border-b border-gray-900 outline-none bg-transparent text-center"
                />
              </div>
              <div className="flex items-center flex-1 min-w-[180px]">
                <span className="font-semibold mr-2">Section:</span>
                <input
                  type="text"
                  value={studentInfo.section}
                  onChange={(e) => setStudentInfo({ ...studentInfo, section: e.target.value })}
                  className="flex-1 border-b border-gray-900 outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center">
              <span className="font-semibold mr-2">LRN:</span>
              <input
                type="text"
                value={studentInfo.lrn}
                onChange={(e) => setStudentInfo({ ...studentInfo, lrn: e.target.value })}
                className="w-80 border-b border-gray-900 outline-none bg-transparent"
              />
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

          <h4 className="text-2xl font-bold text-center -mt-2 mb-1">
            REPORT ON LEARNING PROGRESS AND ACHIEVEMENT
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-900 text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th rowSpan="2" className="border border-gray-900 px-2 py-1">Learning Areas</th>
                  <th colSpan="4" className="border border-gray-900 px-2 py-1">Quarter</th>
                  <th rowSpan="2" className="border border-gray-900 px-2 py-1">Final Grade</th>
                  <th rowSpan="2" className="border border-gray-900 px-2 py-1">Remarks</th>
                </tr>
                <tr>
                  <th className="border border-gray-900 px-2 py-1">1</th>
                  <th className="border border-gray-900 px-2 py-1">2</th>
                  <th className="border border-gray-900 px-2 py-1">3</th>
                  <th className="border border-gray-900 px-2 py-1">4</th>
                </tr>
              </thead>

              <tbody>
                {grades.length > 0 ? (
                  grades.map((g, i) => (
                    <tr key={i}>
                      <td className="border border-gray-900 px-2 py-1 text-left">
                        {g.subject}
                      </td>

                      {["q1", "q2", "q3", "q4"].map((q) => (
                        <td key={q} className="border border-gray-900 px-2 py-1">
                          <input
                            type="number"
                            value={g[q] || ""}
                            onChange={(e) => {
                              const updated = [...grades];
                              updated[i] = { ...updated[i], [q]: e.target.value };

                              const { q1, q2, q3, q4 } = updated[i];
                              const quarters = [q1, q2, q3, q4]
                                .map(Number)
                                .filter((n) => !isNaN(n));

                              if (quarters.length === 4) {
                                const avg = (
                                  quarters.reduce((a, b) => a + b, 0) / 4
                                ).toFixed(2);
                                updated[i].final = avg;
                                updated[i].remarks = avg >= 75 ? "Passed" : "Failed";
                              } else {
                                updated[i].final = "";
                                updated[i].remarks = "";
                              }

                              setGrades(updated);
                            }}
                            className="w-full text-center bg-transparent outline-none text-gray-800 placeholder-gray-400"
                            min="0"
                            max="100"
                          />
                        </td>
                      ))}

                      <td className="border border-gray-900 px-2 py-1 font-semibold">
                        {g.final}
                      </td>
                      <td className="border border-gray-900 px-2 py-1">
                        {g.remarks}
                      </td>
                    </tr>
                  ))
                ) : (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="border border-gray-900 px-2 py-3">
                          &nbsp;
                        </td>
                      ))}
                    </tr>
                  ))
                )}

                <tr className="bg-gray-100 font-semibold">
                  <td className="border border-gray-900 px-2 py-1"></td>
                  <td colSpan="4" className="border border-gray-900 px-2 py-1 text-center">
                    General Average
                  </td>
                  <td className="border border-gray-900 px-2 py-1">
                    {(() => {
                      const finals = grades
                        .map((g) => Number(g.final))
                        .filter((v) => !isNaN(v));
                      if (finals.length === 0) return "";
                      return (finals.reduce((a, b) => a + b, 0) / finals.length).toFixed(2);
                    })()}
                  </td>
                  <td className="border border-gray-900 px-2 py-1">
                    {(() => {
                      const finals = grades
                        .map((g) => Number(g.final))
                        .filter((v) => !isNaN(v));
                      if (finals.length === 0) return "";
                      const avg = (finals.reduce((a, b) => a + b, 0) / finals.length).toFixed(2);
                      return avg >= 75 ? "Passed" : "Failed";
                    })()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-900 text-sm text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th colSpan="1" className="border border-gray-900 px-2 py-1 text-center">
                      <span className="font-semibold">Remedial Classes</span>
                    </th>
                    <th colSpan="4" className="border border-gray-900 px-2 py-1 text-center">
                      <div className="flex justify-start items-center">
                        <span>Conducted from:</span>
                        <span className="ml-8">to:</span>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-gray-900 px-2 py-1">Learning Areas</th>
                    <th className="border border-gray-900 px-2 py-1">Final Rating</th>
                    <th className="border border-gray-900 px-2 py-1">Remedial Class Mark</th>
                    <th className="border border-gray-900 px-2 py-1">Recomputed Final Grade</th>
                    <th className="border border-gray-900 px-2 py-1">Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {remedial.length > 0 ? (
                    remedial.map((r, i) => (
                      <tr key={i}>
                        {["subject", "finalRating", "classMark", "recomputed", "remarks"].map((field) => (
                          <td key={field} className="border border-gray-900 px-2 py-1">
                            <input
                              type={field === "finalRating" || field === "classMark" || field === "recomputed" ? "number" : "text"}
                              value={r[field] || ""}
                              onChange={(e) => {
                                const updated = [...remedial];
                                updated[i] = { ...updated[i], [field]: e.target.value };
                                setRemedial(updated);
                              }}
                              className="w-full text-center bg-transparent outline-none text-gray-800 placeholder-gray-400"
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="border border-gray-900 px-2 py-3">&nbsp;</td>
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

          <hr className="border-black border-1 d mt-15 mb-2" /> 

          <h2 className="text-2xl font-bold text-center mt-12 mb-6">REPORT ON ATTENDANCE</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-900 text-sm text-center mb-8">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-900 px-2 py-1 text-left">Attendance</th>
                  {months.map((m, i) => (
                    <th key={i} className="border border-gray-900 px-2 py-1">{m}</th>
                  ))}
                  <th className="border border-gray-900 px-2 py-1">Total</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border border-gray-900 px-2 py-1 text-left font-semibold">
                    No. of school days
                  </td>
                  {months.map((_, i) => (
                    <td key={i} className="border border-gray-900 px-2 py-1">
                      <input
                        type="number"
                        value={attendance.schoolDays[i] || ""}
                        onChange={(e) => {
                          const updated = { ...attendance };
                          updated.schoolDays[i] = e.target.value;
                          setAttendance(updated);
                        }}
                        className="w-full text-center bg-transparent outline-none text-gray-800 placeholder-gray-400"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-900 px-2 py-1 font-semibold bg-gray-50">
                    {computeTotal(attendance.schoolDays) || ""}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-900 px-2 py-1 text-left font-semibold">
                    No. of days present
                  </td>
                  {months.map((_, i) => (
                    <td key={i} className="border border-gray-900 px-2 py-1">
                      <input
                        type="number"
                        value={attendance.daysPresent[i] || ""}
                        onChange={(e) => {
                          const updated = { ...attendance };
                          updated.daysPresent[i] = e.target.value;
                          setAttendance(updated);
                        }}
                        className="w-full text-center bg-transparent outline-none text-gray-800 placeholder-gray-400"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-900 px-2 py-1 font-semibold bg-gray-50">
                    {computeTotal(attendance.daysPresent) || ""}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-900 px-2 py-1 text-left font-semibold">
                    No. of days absent
                  </td>
                  {months.map((_, i) => (
                    <td key={i} className="border border-gray-900 px-2 py-1 bg-gray-50 text-gray-700">
                      {computeAbsent(i)}
                    </td>
                  ))}
                  <td className="border border-gray-900 px-2 py-1 font-semibold bg-gray-100">
                    {(() => {
                      const absents = months.map((_, i) => computeAbsent(i)).filter((v) => v !== "");
                      return absents.length > 0
                        ? absents.reduce((a, b) => a + b, 0)
                        : "";
                    })()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-10 mb-15 text-center justify-center">
            <h3 className="text-2xl font-bold text-center mb-4">PARENT / GUARDIAN’S SIGNATURE</h3>
            <div className="space-y-3 text-sm text-center justify-center">
              <p>1<sup>st</sup> Quarter ____________________________________________</p>
              <p>2<sup>nd</sup> Quarter ____________________________________________</p>
              <p>3<sup>rd</sup> Quarter ____________________________________________</p>
              <p>4<sup>th</sup> Quarter ____________________________________________</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-center mt-7 mb-4">Certificate of Transfer</h3>
              <div className="mb-10 text-sm space-y-2">
                <div className="flex flex-wrap items-center gap-x-2">
                  <label className="mr-2">Admitted in Grade</label>
                  <input
                    type="text"
                    className="border-b border-gray-900 outline-none w-60 text-left bg-transparent"
                  />
                  <label className="ml-4 mr-2">Section</label>
                  <input
                    type="text"
                    className="border-b border-gray-900 outline-none w-40 text-left bg-transparent"
                  />
                </div>
                <div className="flex items-center gap-x-2">
                  <label>Eligible to Admission in Grade</label>
                  <input
                    type="text"
                    className="border-b border-gray-900 outline-none flex-1 text-left bg-transparent"
                  />
                </div>
              <p>Approved:</p>
              <div className="mt-8 flex justify-center gap-100 text-center text-sm">
                <div>
                  <p className="font-semibold underline">MA. NORA D. LAI, Ed.D, JD</p>
                  <p>Principal</p>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder=""
                    className="border-b border-gray-900 outline-none text-center bg-transparent w-48"
                  />
                  <p>Teacher</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm">
            <h3 className="text-2xl font-bold text-center mt-7 mb-4">
              Cancellation of Eligibility to Transfer
            </h3>

            <div className="flex items-center gap-x-2 mb-2">
              <label>Admitted in:</label>
              <input
                type="text"
                className="border-b border-gray-900 outline-none w-50 text-left bg-transparent"
              />
            </div>

            <div className="flex justify-between items-end mt-2">
              <div className="flex items-center gap-x-2">
                <label>Date:</label>
                <input
                  type="text"
                  className="border-b border-gray-900 outline-none w-40 text-center bg-transparent"
                />
              </div>

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
    </div>
  );
}

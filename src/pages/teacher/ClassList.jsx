import { useState, useEffect } from "react";
import { ViewColumnsIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function ClassList() {
  const [allStudents, setAllStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("studentGrades")) || [];
    setAllStudents(stored);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredClasses([]);
      return;
    }

    const parts = query.trim().split(" ");
    const gradeQuery = parts[0];
    const sectionQuery = parts.slice(1).join(" ");

    const results = allStudents.filter(
      (s) =>
        s.gradeLevel.toString().toLowerCase().includes(gradeQuery.toLowerCase()) &&
        s.section.toLowerCase().includes(sectionQuery.toLowerCase())
    );

    const uniqueClasses = Array.from(
      new Set(results.map((r) => `${r.gradeLevel}-${r.section}`))
    ).map((id, index) => {
      const [gradeLevel, section] = id.split("-");
      return { id: index + 1, gradeLevel, section };
    });

    setFilteredClasses(uniqueClasses);
  };

  const handleSelectGrade = (grade) => {
    const sections = Array.from(
      new Set(
        allStudents
          .filter((s) => s.gradeLevel === grade)
          .map((s) => s.section)
      )
    ).map((section, index) => ({ id: index + 1, gradeLevel: grade, section }));

    setFilteredClasses(sections);
  };

  const handleSelectClass = (gradeLevel, section) => {
    const storedStudents = JSON.parse(localStorage.getItem("studentGrades")) || [];
    const classStudents = storedStudents.filter(
      (s) => s.gradeLevel === gradeLevel && s.section === section
    );

    const sorted = [...classStudents].sort((a, b) => b.generalAverage - a.generalAverage);

    const ranked = sorted.map((s, i) => ({
      ...s,
      rank: i + 1,
    }));

    setSelectedClass({ gradeLevel, section });
    setStudents(ranked);
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-700 font-semibold";
    if (rank === 2) return "bg-gray-100 text-gray-700 font-semibold";
    if (rank === 3) return "bg-orange-100 text-orange-700 font-semibold";
    return "";
  };

  const totalClasses = Array.from(new Set(allStudents.map((s) => `${s.gradeLevel}-${s.section}`))).length;
  const totalStudents = allStudents.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 border border-gray-300 border-b-red-800 border-b-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ViewColumnsIcon className="w-10 h-10 text-red-800" />
          Class List
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow pt-2 pb-3 border border-gray-300">
      <div className="w-full flex justify-center mt-10">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-2 flex items-center gap-2 w-3/4 max-w-3xl">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Grade or Section (e.g., 6 LOYALTY)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            className="bg-red-800 text-white px-3 py-1 rounded-md hover:bg-red-900 transition"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-10 flex-wrap my-4 mt-10 mb-10">
        <div className="bg-gray-100 p-4 rounded-lg shadow text-center w-80 border-l-red-800 border-l-8">
          <p className="text-gray-500 text-sm">Total Classes</p>
          <p className="text-2xl font-bold">{totalClasses}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow text-center w-80 border-l-red-800 border-l-8">
          <p className="text-gray-500 text-sm">Total Students</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>
      </div>
      </div>

      {filteredClasses.length > 0 && (

        <div className="flex justify-center mt-4 ml-120">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredClasses.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectClass(c.gradeLevel, c.section)}
                className="bg-white rounded-lg shadow border border-gray-500 p-4 hover:shadow-lg transition text-center justify-center h-20 w-60"
              >
                <div className="font-semibold text-gray-800 text-lg">
                  {c.gradeLevel} - {c.section}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden mt-4">
        <div className="bg-red-800 text-white px-6 py-3 text-lg font-semibold">
          {selectedClass
            ? `${selectedClass.gradeLevel} - ${selectedClass.section}`
            : "Select a class to view students"}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold border-b">
              <tr>
                <th className="px-3 py-2 border">Rank</th>
                <th className="px-3 py-2 border">LRN</th>
                <th className="px-3 py-2 border text-left">Name</th>
                <th className="px-3 py-2 border">Grade</th>
                <th className="px-3 py-2 border">Section</th>
                <th className="px-3 py-2 border">General Average</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0
                ? students.map((s) => (
                    <tr
                      key={s.lrn}
                      className={`${getRankColor(s.rank)} hover:bg-gray-50`}
                    >
                      <td className="border px-3 py-2">{s.rank}</td>
                      <td className="border px-3 py-2">{s.lrn}</td>
                      <td className="border px-3 py-2 text-left">{s.name}</td>
                      <td className="border px-3 py-2">{s.gradeLevel}</td>
                      <td className="border px-3 py-2">{s.section}</td>
                      <td className="border px-3 py-2 font-semibold">{s.generalAverage.toFixed(2)}</td>
                    </tr>
                  ))
                :
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="border px-3 py-2 text-gray-400 italic">-</td>
                      <td className="border px-3 py-2 text-gray-400 italic">-</td>
                      <td className="border px-3 py-2 text-left text-gray-400 italic">-</td>
                      <td className="border px-3 py-2 text-gray-400 italic">-</td>
                      <td className="border px-3 py-2 text-gray-400 italic">-</td>
                      <td className="border px-3 py-2 text-gray-400 italic">-</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function GradesTable() {
  const grades = [
    { subject: "Mother Tongue", q1: 92, q2: 91, q3: 93, q4: 94, final: 93, remark: "SO" },
    { subject: "Filipino", q1: 90, q2: 92, q3: 91, q4: 93, final: 92, remark: "SO" },
    { subject: "English", q1: 93, q2: 90, q3: 94, q4: 92, final: 92, remark: "SO" },
    { subject: "Mathematics", q1: 88, q2: 91, q3: 89, q4: 95, final: 91, remark: "AO" },
    { subject: "Science", q1: 95, q2: 93, q3: 96, q4: 94, final: 95, remark: "O" },
    { subject: "Araling Panlipunan", q1: 89, q2: 90, q3: 88, q4: 92, final: 90, remark: "AO" },
    { subject: "Edukasyon sa Pagpapakatao (EsP)", q1: 94, q2: 95, q3: 96, q4: 95, final: 95, remark: "O" },
    { subject: "Music, Arts, PE and Health (MAPEH)", q1: 93, q2: 94, q3: 92, q4: 95, final: 94, remark: "SO" },
  ];

  const generalAverage = 92.75;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
      <div className="bg-gradient-to-r bg-red-800 text-center py-3 font-bold text-white">
        <p className="text-sm">S.Y. 2025-2026</p>
        <p className="text-lg">LEARNING PROGRESS AND ACHIEVEMENTS</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-400">
              <th rowSpan="2" className="py-3 px-4 text-left font-bold">Learning Areas</th>
              <th colSpan="4" className="py-2 border-x border-gray-400 font-bold">Quarter</th>
              <th rowSpan="2" className="py-3 px-4 border-x border-gray-400 font-bold">Final Grade</th>
              <th rowSpan="2" className="py-3 px-4 font-bold">REMARK</th>
            </tr>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border-x border-gray-300">Q1</th>
              <th className="py-2 px-3 border-x border-gray-300">Q2</th>
              <th className="py-2 px-3 border-x border-gray-300">Q3</th>
              <th className="py-2 px-3 border-x border-gray-300">Q4</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">{g.subject}</td>
                <td className="text-center py-3">{g.q1}</td>
                <td className="text-center py-3 border-x border-gray-300">{g.q2}</td>
                <td className="text-center py-3">{g.q3}</td>
                <td className="text-center py-3 border-x border-gray-300">{g.q4}</td>
                <td className="text-center py-3 font-bold text-red-700 text-lg">
                  {g.final}
                </td>
                <td className="text-center py-3 font-bold text-blue-700">
                  {g.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right pr-8 py-4 bg-gray-50 border-t-2 border-gray-400">
        <p className="text-lg font-bold text-gray-800">
          General Average: <span className="text-red-700 text-2xl">{generalAverage.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
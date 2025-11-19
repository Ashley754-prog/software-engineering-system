export default function AttendanceCalendar() {
  const daysInMonth = 22;
  const presentDays = 20;
  const absentDays = 1;
  const lateDays = 1;

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-bold text-gray-600 py-2">
            {d}
          </div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const day = i - 3;
          if (day > 0 && day <= daysInMonth) {
            const isPresent = Math.random() > 0.1;
            const isAbsent = !isPresent && Math.random() > 0.8;
            return (
              <div
                key={i}
                className={`p-3 rounded-lg font-medium ${
                  isAbsent
                    ? "bg-red-100 text-red-800"
                    : isPresent
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {day}
                {isAbsent}
              </div>
            );
          }
          return <div key={i} className="p-3"></div>;
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-3xl font-bold text-green-700">{presentDays}</p>
          <p className="text-sm">Present</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-3xl font-bold text-red-700">{absentDays}</p>
          <p className="text-sm">Absent</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p className="text-3xl font-bold text-yellow-700">{lateDays}</p>
          <p className="text-sm">Late</p>
        </div>
      </div>
    </div>
  );
}
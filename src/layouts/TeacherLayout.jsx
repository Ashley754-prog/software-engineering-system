import { useState } from "react";
import TeacherSidebar from "../layouts/TeacherSidebar";
import TeacherTopbar from "../layouts/TeacherTopbar";
import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50 font-montserrat">
      <TeacherSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`flex flex-col flex-1 transition-all duration-500 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <TeacherTopbar sidebarOpen={sidebarOpen} />

        <main className="pt-20 px-8 pb-6 overflow-y-auto min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

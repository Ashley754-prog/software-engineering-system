import { useState } from "react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  ChartBarIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  ViewColumnsIcon,
  UsersIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";

export default function TeacherSidebar({ sidebarOpen, setSidebarOpen }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <ChartBarIcon className="w-6 h-6" />, path: "/teacher/teacher-dashboard" },
    { name: "Grade Level", icon: <BookOpenIcon className="w-6 h-6" />, path: "/grade-level" },
    { name: "Edit Grades", icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />, path: "/edit-grades" },
    { name: "Class List", icon: <ViewColumnsIcon className="w-6 h-6" />, path: "/class-list" },
    { name: "Reports", icon: <UsersIcon className="w-6 h-6" />, path: "/reports" },
    { name: "Customer Service", icon: <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />, path: "/customer-service" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#8f0303] text-white flex flex-col justify-between transition-[width] duration-500 ease-in-out z-30 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="px-4 py-5 border-b border-red-700/50 flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white transition-transform duration-300 hover:scale-110"
        >
          <Bars3Icon className="w-6 h-6 translate-x-[10px]" />
        </button>
      </div>

      <nav className="flex flex-col mt-2 space-y-1 flex-1">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative"
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-5 py-3 w-full text-left transition-all duration-300 ease-in-out rounded-md ${
                location.pathname === item.path
                  ? "bg-red-700"
                  : "hover:bg-red-700"
              }`}
            >
              {item.icon}
              {sidebarOpen && (
                <span className="text-sm transition-all duration-300 ease-in-out">
                  {item.name}
                </span>
              )}
            </button>

            {!sidebarOpen && hoveredItem === item.name && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg"
                style={{ animation: "fadeIn 0.2s ease-in-out" }}
              >
                {item.name}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* SETTINGS — BOTTOM (CLICKABLE + ACTIVE STATE + NO COLLAPSE BUG) */}
      <div
        className="relative"
        onMouseEnter={() => setHoveredItem("Settings")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <button
          onClick={() => navigate("/teacher-settings")}
          className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-all duration-300 rounded-md ${
            location.pathname === "/teacher/teacher-settings"
              ? "bg-red-700 text-yellow-300"
              : "hover:bg-red-700"
          }`}
        >
          <Cog6ToothIcon className="w-6 h-6 flex-shrink-0 translate-x-[10px]" />
          {sidebarOpen && (
            <span className="text-sm font-medium translate-x-[10px]">Settings</span>
          )}
        </button>

        {/* Tooltip when collapsed */}
        {!sidebarOpen && hoveredItem === "Settings" && (
          <div className="absolute left-[90px] top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-3 py-1.5 whitespace-nowrap shadow-2xl">
            Settings
          </div>
        )}
      </div>
    </aside>
  );
}

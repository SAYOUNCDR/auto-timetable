import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import DataManagement from "./DataManagement";
import DashboardStats from "./DashboardStats";
import Generator from "./Generator";
import AllTimetables from "./AllTimetables";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("All details"); // Default to stats page
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* 1. Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* 2. Main Layout Area */}
      <main className="flex-1 flex flex-col h-screen relative">
        {activePage === "All details" && <DashboardStats />}
        {activePage === "data" && <DataManagement />}
        {activePage === "generator" && <Generator />}
        {activePage === "timetables" && <AllTimetables />}

        {activePage !== "All details" &&
          activePage !== "data" &&
          activePage !== "generator" &&
          activePage !== "timetables" && (
            // Placeholder for other sidebar pages
            <div className="flex items-center justify-center h-full text-gray-400">
              Content for {activePage}
            </div>
          )}
      </main>
    </div>
  );
};

export default Dashboard;

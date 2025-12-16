import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import {
  fetchStudentDashboard,
  fetchStudentTimetable,
} from "../../services/api";
import StudentSidebar from "../../components/layout/StudentSidebar";
import TimetableGrid from "../../components/TimetableGrid/TimetableGrid";
import {
  BookOpen,
  Clock,
  GraduationCap,
  User,
  Calendar as CalendarIcon,
  MapPin,
} from "lucide-react";

const DashboardView = ({ profile, subjects, timetable }) => {
  // Filter for Today's Schedule
  const jsDay = new Date().getDay(); // 0=Sun, 1=Mon...
  // App uses 0=Mon, 1=Tue... so we subtract 1.
  // If Sunday (0), it becomes -1. If Saturday (6), it becomes 5.
  const appDay = jsDay - 1;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = days[jsDay];

  const TIME_SLOTS = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
  ];

  const todaysClasses = timetable
    .filter((t) => t.day === appDay)
    .sort((a, b) => a.slot - b.slot); // slot is also a number

  return (
    <div className="space-y-6">
      {/* Welcome & Profile Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {profile?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your schedule today.
            </p>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
            <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wider">
              Batch
            </p>
            <p className="text-lg font-bold text-gray-800">{profile?.batch}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-md shadow-sm text-blue-500">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Year of Study</p>
              <p className="font-semibold text-gray-800">{profile?.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-md shadow-sm text-purple-500">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Subjects</p>
              <p className="font-semibold text-gray-800">
                {subjects?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-md shadow-sm text-green-500">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p
                className="font-semibold text-gray-800 truncate max-w-[150px]"
                title={profile?.email}
              >
                {profile?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon size={20} className="text-yellow-500" />
            Today's Schedule ({todayName})
          </h2>

          {todaysClasses.length > 0 ? (
            <div className="space-y-3">
              {todaysClasses.map((cls, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg text-blue-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {cls.subject?.subjectName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {TIME_SLOTS[cls.slot] || "Unknown Time"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {cls.faculty?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      <MapPin size={12} /> {cls.room?.className}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {cls.subject?.subjectCode}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-dashed border-gray-200 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                <CalendarIcon size={24} />
              </div>
              <h3 className="text-gray-800 font-medium">No classes today</h3>
              <p className="text-gray-500 text-sm">Enjoy your free time!</p>
            </div>
          )}
        </div>

        {/* Subject List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen size={20} className="text-purple-500" />
            My Subjects
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {subjects?.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {sub.subjectName}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        sub.type === "Practical"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {sub.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {sub.subjectCode}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <User size={12} />
                    <span>{sub.assignedTeacher?.name || "Not Assigned"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const { user } = useAuth();

  // Fetch Dashboard Data (Profile + Subjects)
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["studentDashboard", user?.id],
    queryFn: fetchStudentDashboard,
    enabled: !!user?.id, // Only fetch if user ID exists
  });

  // Fetch Timetable Data
  const { data: timetableData, isLoading: isLoadingTimetable } = useQuery({
    queryKey: ["studentTimetable", user?.id],
    queryFn: fetchStudentTimetable,
    enabled: !!user?.id,
  });

  if (isLoadingDashboard || isLoadingTimetable) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <StudentSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {activePage === "dashboard" && (
            <DashboardView
              profile={dashboardData?.studentProfile}
              subjects={dashboardData?.subjects}
              timetable={timetableData || []}
            />
          )}

          {activePage === "timetable" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  My Weekly Timetable
                </h1>
                <div className="text-sm text-gray-500">
                  Batch:{" "}
                  <span className="font-semibold text-gray-800">
                    {dashboardData?.studentProfile?.batch}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <TimetableGrid
                  timetableData={timetableData || []}
                  selectedBatchId="student" // Force "Batch View" mode
                  showControls={false} // Hide the batch selector
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

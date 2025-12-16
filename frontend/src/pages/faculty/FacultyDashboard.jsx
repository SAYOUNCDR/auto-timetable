import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import {
  fetchFacultyDashboard,
  fetchFacultyTimetable,
} from "../../services/api";
import FacultySidebar from "../../components/layout/FacultySidebar";
import TimetableGrid from "../../components/TimetableGrid/TimetableGrid";
import {
  BookOpen,
  Clock,
  Users,
  User,
  Calendar as CalendarIcon,
  MapPin,
  Briefcase,
} from "lucide-react";

const DashboardView = ({
  meta,
  profile,
  stats,
  todaysSchedule,
  qualifiedSubjects,
}) => {
  const todayName =
    meta?.day || new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayDate = meta?.date || new Date().toLocaleDateString();

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
              Here's your teaching schedule overview for{" "}
              <span className="font-medium text-gray-700">{todayDate}</span>.
            </p>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
            <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wider">
              Max Classes/Day
            </p>
            <p className="text-lg font-bold text-gray-800">
              {profile?.maxClassesPerDay}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-md shadow-sm text-blue-500">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Weekly Classes</p>
              <p className="font-semibold text-gray-800">
                {stats?.weeklyClasses || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-md shadow-sm text-purple-500">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Batches</p>
              <p className="font-semibold text-gray-800">
                {stats?.totalBatches || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-white rounded-md shadow-sm text-green-500">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Subjects</p>
              <p className="font-semibold text-gray-800">
                {stats?.activeSubjects || 0}
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

          {todaysSchedule && todaysSchedule.length > 0 ? (
            <div className="space-y-3">
              {todaysSchedule.map((cls, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg text-blue-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{cls.subject}</h3>
                      <p className="text-sm text-gray-500">{cls.time}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            cls.type === "Practical"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {cls.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {cls.batch}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      <MapPin size={12} /> {cls.room}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{cls.code}</p>
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

        {/* Qualified Subjects List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BookOpen size={20} className="text-purple-500" />
            Qualified Subjects
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {qualifiedSubjects?.map((sub, idx) => (
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
                      {sub.type || "Theory"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{sub.subjectCode}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FacultyDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const { user } = useAuth();

  // Fetch Dashboard Data
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["facultyDashboard", user?.id],
    queryFn: fetchFacultyDashboard,
    enabled: !!user?.id,
  });

  // Fetch Timetable Data
  const { data: timetableData, isLoading: isLoadingTimetable } = useQuery({
    queryKey: ["facultyTimetable", user?.id],
    queryFn: fetchFacultyTimetable,
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
      <FacultySidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {activePage === "dashboard" && (
            <DashboardView
              meta={dashboardData?.meta}
              profile={dashboardData?.profile}
              stats={dashboardData?.stats}
              todaysSchedule={dashboardData?.todaysSchedule}
              qualifiedSubjects={dashboardData?.qualifiedSubjects}
            />
          )}

          {activePage === "timetable" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  My Weekly Schedule
                </h1>
                <div className="text-sm text-gray-500">
                  Faculty:{" "}
                  <span className="font-semibold text-gray-800">
                    {dashboardData?.profile?.name}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <TimetableGrid
                  timetableData={timetableData || []}
                  selectedBatchId="student" // Reusing "student" mode for simple view (no filtering)
                  showControls={false}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;

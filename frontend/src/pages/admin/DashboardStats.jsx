import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  GraduationCap,
  BookOpen,
  School,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import { fetchDashboardStats } from "../../services/api";

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
      ) : (
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      )}
    </div>
  </div>
);

const DashboardStats = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading dashboard stats: {error.message}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Students",
      value: stats?.students || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Faculty Members",
      value: stats?.faculty || 0,
      icon: GraduationCap,
      color: "bg-green-500",
    },
    {
      title: "Active Batches",
      value: stats?.batches || 0,
      icon: LayoutGrid,
      color: "bg-purple-500",
    },
    {
      title: "Subjects",
      value: stats?.subjects || 0,
      icon: BookOpen,
      color: "bg-yellow-500",
    },
    {
      title: "Classrooms",
      value: stats?.rooms || 0,
      icon: School,
      color: "bg-pink-500",
    },
    {
      title: "Timetable Entries",
      value: stats?.timetableEntries || 0,
      icon: Calendar,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Placeholder for future charts or detailed lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col justify-center items-center text-gray-400">
          <p>Activity Chart (Coming Soon)</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col justify-center items-center text-gray-400">
          <p>Recent Actions (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

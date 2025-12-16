import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  GraduationCap,
  BookOpen,
  School,
  LayoutGrid,
  Calendar,
  Plus,
  ArrowRight,
  Activity,
  Zap,
} from "lucide-react";
import { fetchDashboardStats } from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

  // Data for Charts
  const resourceData = [
    { name: "Students", count: stats?.students || 0 },
    { name: "Faculty", count: stats?.faculty || 0 },
    { name: "Batches", count: stats?.batches || 0 },
    { name: "Subjects", count: stats?.subjects || 0 },
  ];

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((item, index) => (
          <StatCard key={index} {...item} loading={isLoading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" />
              Resource Distribution
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={resourceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          {/* System Status (Mock) */}
          <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Server Status</span>
                <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Database</span>
                <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">AI Engine</span>
                <span className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Ready
                </span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
              View System Logs <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

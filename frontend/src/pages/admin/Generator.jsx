import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Play,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Server,
  Database,
  Users,
  BookOpen,
  School,
  LayoutGrid,
} from "lucide-react";
import { fetchDashboardStats, generateTimetable } from "../../services/api";
import { Button } from "../../components/ui/Button";

const StatItem = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-md ${color} bg-opacity-10`}>
        <Icon size={20} className={color.replace("bg-", "text-")} />
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-lg font-bold text-gray-900">{value}</span>
  </div>
);

const Generator = () => {
  const queryClient = useQueryClient();
  const [generationStatus, setGenerationStatus] = useState("idle"); // idle, generating, success, error
  const [message, setMessage] = useState("");

  // Fetch current system stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  // Mutation for generating timetable
  const generateMutation = useMutation({
    mutationFn: generateTimetable,
    onMutate: () => {
      setGenerationStatus("generating");
      setMessage("Initializing AI Engine... This may take a few moments.");
    },
    onSuccess: (data) => {
      setGenerationStatus("success");
      setMessage(data.message || "Timetable generated successfully!");
      queryClient.invalidateQueries(["timetable"]);
    },
    onError: (error) => {
      setGenerationStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Failed to generate timetable. Please check constraints."
      );
    },
  });

  const handleGenerate = () => {
    if (
      window.confirm("This will overwrite the existing timetable. Continue?")
    ) {
      generateMutation.mutate();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Timetable Generator
        </h1>
        <p className="text-gray-500">
          Review system status and trigger the AI scheduling engine.
        </p>
      </div>

      {/* System Status / Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatItem
          label="Batches (Groups)"
          value={stats?.batches || 0}
          icon={LayoutGrid}
          color="bg-purple-500"
        />
        <StatItem
          label="Faculty Members"
          value={stats?.faculty || 0}
          icon={Users}
          color="bg-green-500"
        />
        <StatItem
          label="Classrooms"
          value={stats?.rooms || 0}
          icon={School}
          color="bg-pink-500"
        />
        <StatItem
          label="Subjects"
          value={stats?.subjects || 0}
          icon={BookOpen}
          color="bg-yellow-500"
        />
        <StatItem
          label="Total Students"
          value={stats?.students || 0}
          icon={Users}
          color="bg-blue-500"
        />
        <StatItem
          label="Database Status"
          value={statsLoading ? "Checking..." : "Online"}
          icon={Database}
          color="bg-indigo-500"
        />
      </div>

      {/* Action Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-2">
            <Server size={40} className="text-yellow-500" />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              Ready to Schedule
            </h2>
            <p className="text-gray-500">
              The AI engine will process all constraints, faculty availability,
              and room capacities to generate an optimal timetable.
            </p>
          </div>

          {/* Status Message Display */}
          {generationStatus !== "idle" && (
            <div
              className={`w-full max-w-lg p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
                generationStatus === "generating"
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : generationStatus === "success"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {generationStatus === "generating" && (
                <RefreshCw className="animate-spin" size={18} />
              )}
              {generationStatus === "success" && <CheckCircle size={18} />}
              {generationStatus === "error" && <AlertTriangle size={18} />}
              <span>{message}</span>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={generationStatus === "generating" || statsLoading}
            className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transform transition-all active:scale-95"
          >
            {generationStatus === "generating" ? (
              "Generating Schedule..."
            ) : (
              <>
                <Play size={20} className="mr-2 fill-current" />
                Generate Timetable
              </>
            )}
          </Button>

          <p className="text-xs text-gray-400">
            Note: This process usually takes 5-10 seconds depending on data
            size.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Generator;

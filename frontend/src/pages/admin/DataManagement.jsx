import React, { useState } from "react";
import { LayoutDashboard, FileText, User, Plus } from "lucide-react";
import RoomCard from "../../components/forms/RoomCard"; // Importing the separate component
import { Button } from "../../components/ui/Button";

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState("classrooms");

  // Configuration for tabs
  const tabs = [
    {
      id: "classrooms",
      label: "Classrooms",
      icon: <LayoutDashboard size={18} />,
    },
    { id: "subjects", label: "Subjects", icon: <FileText size={18} /> },
    { id: "faculty", label: "Faculty", icon: <User size={18} /> },
    { id: "batches", label: "Batches", icon: <User size={18} /> },
  ];

  // Dummy Data for Classrooms (In real app, this comes from API)
  const [rooms, setRooms] = useState([
    { id: 1, name: "Room 101", capacity: 120, type: "Classroom" },
    { id: 2, name: "Room 102", capacity: 60, type: "Classroom" },
    { id: 3, name: "CS Lab 1", capacity: 40, type: "Laboratory" },
  ]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header & Tabs */}
      <header className="px-8 pt-6 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200">
          <div className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Data Management
            </h1>
            <p className="text-gray-500 mt-1">
              Configure your institution's resources.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-gray-400 hover:text-yellow-600"
                }`}
              >
                {tab.icon} {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="py-6 flex justify-end">
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            <span>
              Add{" "}
              {activeTab.slice(0, -1).charAt(0).toUpperCase() +
                activeTab.slice(0, -1).slice(1)}
            </span>
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {/* VIEW: Classrooms */}
        {activeTab === "classrooms" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                name={room.name}
                capacity={room.capacity}
                type={room.type}
                onTypeChange={(newType) => {
                  console.log(`Updated ${room.name} to ${newType}`);
                }}
                onDelete={() => console.log(`Delete ${room.name}`)}
              />
            ))}
          </div>
        )}

        {/* VIEW: Subjects (Placeholder) */}
        {activeTab === "subjects" && (
          <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
            Insert SubjectForm Component Here
          </div>
        )}

        {/* VIEW: Faculty (Placeholder) */}
        {activeTab === "faculty" && (
          <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
            Insert FacultyForm Component Here
          </div>
        )}
        {/* VIEW: Batches (Placeholder) */}
        {activeTab === "batches" && (
          <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
            Insert BatchForm Component Here
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;

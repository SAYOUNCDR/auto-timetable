import React, { useState } from "react";
import { LayoutDashboard, FileText, User, Plus, Users } from "lucide-react";
import RoomCard from "../../components/cards/RoomCard"; // Importing the separate component
import BatchCard from "../../components/cards/BatchCard";
import SubjectCard from "../../components/cards/SubjectCard";
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
    { id: "batches", label: "Batches", icon: <Users size={18} /> },
  ];

  // Dummy Data for Classrooms (In real app, this comes from API)
  const [rooms, setRooms] = useState([
    { id: 1, name: "Room 101", capacity: 120, type: "Classroom" },
    { id: 2, name: "Room 102", capacity: 60, type: "Classroom" },
    { id: 3, name: "CS Lab 1", capacity: 40, type: "Laboratory" },
  ]);

  // Dummy Data for Batches
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: "CS-Sem3-A",
      students: 55,
      curriculum: [
        { name: "Data Structures", hours: 4 },
        { name: "Database Systems", hours: 3 },
        { name: "Operating Systems", hours: 3 },
        { name: "DS Lab", hours: 2 },
      ],
    },
    {
      id: 2,
      name: "CS-Sem5-B",
      students: 48,
      curriculum: [
        { name: "Computer Networks", hours: 3 },
        { name: "Software Eng", hours: 3 },
        { name: "Web Tech", hours: 4 },
      ],
    },
    {
      id: 3,
      name: "IT-Sem3-A",
      students: 52,
      curriculum: [
        { name: "Data Structures", hours: 4 },
        { name: "Database Systems", hours: 3 },
        { name: "Operating Systems", hours: 3 },
      ],
    },
  ]);

  // Dummy Data for Subjects
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      code: "CS201",
      name: "Data Structures",
      sessions: 4,
      isLab: false,
    },
    {
      id: 2,
      code: "CS202",
      name: "Database Systems",
      sessions: 3,
      isLab: false,
    },
    {
      id: 3,
      code: "CS203",
      name: "Operating Systems",
      sessions: 3,
      isLab: false,
    },
    { id: 4, code: "CS201L", name: "DS Lab", sessions: 2, isLab: true },
    { id: 5, code: "CS301", name: "Node", sessions: 4, isLab: false },
    { id: 6, code: "CS302", name: "React", sessions: 8, isLab: false },
  ]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
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
                className={`flex items-center cursor-pointer gap-2 pb-4 text-sm font-medium transition-all relative ${
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

        {/* VIEW: Batches */}
        {activeTab === "batches" && (
          <div className="flex flex-col gap-4">
            {batches.map((batch) => (
              <BatchCard
                key={batch.id}
                name={batch.name}
                students={batch.students}
                curriculum={batch.curriculum}
                onDelete={() => console.log(`Delete ${batch.name}`)}
              />
            ))}
          </div>
        )}

        {/* VIEW: Subjects */}
        {activeTab === "subjects" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-inner overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-2">Code</div>
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Sessions/Week</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div>
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  code={subject.code}
                  name={subject.name}
                  sessions={subject.sessions}
                  isLab={subject.isLab}
                  onDelete={() => console.log(`Delete ${subject.name}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW: Faculty (Placeholder) */}
        {activeTab === "faculty" && (
          <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
            Insert FacultyForm Component Here
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManagement;

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, FileText, User, Plus, Users } from "lucide-react";
import {
  fetchBatches,
  addBatch,
  fetchClassrooms,
  addClassroom,
  fetchSubjects,
  addSubject,
  fetchFaculty,
  addFaculty,
} from "../../services/api";
import RoomCard from "../../components/cards/RoomCard"; // Importing the separate component
import BatchCard from "../../components/cards/BatchCard";
import SubjectCard from "../../components/cards/SubjectCard";
import FacultyCard from "../../components/cards/FacultyCard";
import { Button } from "../../components/ui/Button";
import RoomModal from "./modals/RoomModal";
import BatchModal from "./modals/BatchModal";
import SubjectModal from "./modals/SubjectModal";
import FacultyModal from "./modals/FacultyModal";

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState("classrooms");
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

  const queryClient = useQueryClient();

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

  // --- Classrooms ---
  const { data: rooms = [], isLoading: loadingRooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: fetchClassrooms,
    enabled: activeTab === "classrooms",
  });

  const createRoomMutation = useMutation({
    mutationFn: addClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries(["classrooms"]);
      setIsRoomModalOpen(false);
    },
  });

  // --- Batches ---
  const { data: batches = [], isLoading: loadingBatches } = useQuery({
    queryKey: ["batches"],
    queryFn: fetchBatches,
    enabled: activeTab === "batches",
  });

  const createBatchMutation = useMutation({
    mutationFn: addBatch,
    onSuccess: () => {
      queryClient.invalidateQueries(["batches"]);
      setIsBatchModalOpen(false);
    },
  });

  // --- Subjects ---
  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
    enabled: activeTab === "subjects",
  });

  const createSubjectMutation = useMutation({
    mutationFn: addSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      setIsSubjectModalOpen(false);
    },
  });

  // --- Faculty ---
  const { data: faculty = [], isLoading: loadingFaculty } = useQuery({
    queryKey: ["faculty"],
    queryFn: fetchFaculty,
    enabled: activeTab === "faculty",
  });

  const createFacultyMutation = useMutation({
    mutationFn: addFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries(["faculty"]);
      setIsFacultyModalOpen(false);
    },
  });

  const handleAddRoom = (newRoom) => {
    createRoomMutation.mutate(newRoom);
  };

  const handleAddBatch = (newBatch) => {
    createBatchMutation.mutate(newBatch);
  };

  const handleAddSubject = (newSubject) => {
    createSubjectMutation.mutate(newSubject);
  };

  const handleAddFaculty = (newFaculty) => {
    createFacultyMutation.mutate(newFaculty);
  };

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
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              if (activeTab === "classrooms") setIsRoomModalOpen(true);
              if (activeTab === "batches") setIsBatchModalOpen(true);
              if (activeTab === "subjects") setIsSubjectModalOpen(true);
              if (activeTab === "faculty") setIsFacultyModalOpen(true);
            }}
          >
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
            {loadingRooms ? (
              <p>Loading classrooms...</p>
            ) : (
              rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  name={room.className}
                  capacity={room.capacity}
                  type={room.type}
                  onTypeChange={(newType) => {
                    console.log(`Updated ${room.className} to ${newType}`);
                  }}
                  onDelete={() => console.log(`Delete ${room.className}`)}
                />
              ))
            )}
          </div>
        )}

        {/* VIEW: Batches */}
        {activeTab === "batches" && (
          <div className="flex flex-col gap-4">
            {loadingBatches ? (
              <p>Loading batches...</p>
            ) : (
              batches.map((batch) => (
                <BatchCard
                  key={batch._id}
                  name={batch.batchName}
                  students={batch.strength}
                  curriculum={
                    batch.subjects
                      ? batch.subjects.map((sub) => ({
                          name: sub.subjectName,
                          hours: sub.sessionsPerWeek,
                        }))
                      : []
                  }
                  onDelete={() => console.log(`Delete ${batch.batchName}`)}
                />
              ))
            )}
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
              {loadingSubjects ? (
                <p className="p-4">Loading subjects...</p>
              ) : (
                subjects.map((subject) => (
                  <SubjectCard
                    key={subject._id}
                    code={subject.subjectCode}
                    name={subject.subjectName}
                    sessions={subject.sessionsPerWeek}
                    isLab={subject.type === "Practical"}
                    onDelete={() =>
                      console.log(`Delete ${subject.subjectName}`)
                    }
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW: Faculty */}
        {activeTab === "faculty" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loadingFaculty ? (
              <p>Loading faculty...</p>
            ) : (
              faculty.map((fac) => (
                <FacultyCard
                  key={fac._id}
                  name={fac.name}
                  maxClasses={fac.maxClassesPerDay}
                  subjects={
                    fac.qualifiedSubjects
                      ? fac.qualifiedSubjects.map((sub) =>
                          typeof sub === "object" ? sub.subjectName : sub
                        )
                      : []
                  }
                  onDelete={() => console.log(`Delete ${fac.name}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
      {/* Modals */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSubmit={handleAddRoom}
      />
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSubmit={handleAddBatch}
      />
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSubmit={handleAddSubject}
      />
      <FacultyModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSubmit={handleAddFaculty}
      />
    </div>
  );
};

export default DataManagement;

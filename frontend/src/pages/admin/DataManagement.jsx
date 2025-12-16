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
  deleteBatch,
  deleteClassroom,
  deleteSubject,
  deleteFaculty,
  updateBatch,
  updateClassroom,
  updateSubject,
  updateFaculty,
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
import ConfirmationModal from "./modals/ConfirmationModal";

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState("classrooms");
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

  // Edit State
  const [itemToEdit, setItemToEdit] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'classroom', 'batch', 'subject', 'faculty'

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

  const updateRoomMutation = useMutation({
    mutationFn: updateClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries(["classrooms"]);
      setIsRoomModalOpen(false);
      setItemToEdit(null);
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

  const updateBatchMutation = useMutation({
    mutationFn: updateBatch,
    onSuccess: () => {
      queryClient.invalidateQueries(["batches"]);
      setIsBatchModalOpen(false);
      setItemToEdit(null);
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

  const updateSubjectMutation = useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      setIsSubjectModalOpen(false);
      setItemToEdit(null);
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

  const updateFacultyMutation = useMutation({
    mutationFn: updateFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries(["faculty"]);
      setIsFacultyModalOpen(false);
      setItemToEdit(null);
    },
  });

  // --- Delete Mutations ---
  const deleteRoomMutation = useMutation({
    mutationFn: deleteClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries(["classrooms"]);
      setIsDeleteModalOpen(false);
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries(["batches"]);
      setIsDeleteModalOpen(false);
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);
      setIsDeleteModalOpen(false);
    },
  });

  const deleteFacultyMutation = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries(["faculty"]);
      setIsDeleteModalOpen(false);
    },
  });

  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (deleteType === "classroom") {
      deleteRoomMutation.mutate(itemToDelete._id);
    } else if (deleteType === "batch") {
      deleteBatchMutation.mutate(itemToDelete._id);
    } else if (deleteType === "subject") {
      deleteSubjectMutation.mutate(itemToDelete._id);
    } else if (deleteType === "faculty") {
      deleteFacultyMutation.mutate(itemToDelete._id);
    }
  };

  const handleEditClick = (item, type) => {
    setItemToEdit(item);
    if (type === "room") setIsRoomModalOpen(true);
    if (type === "batch") setIsBatchModalOpen(true);
    if (type === "subject") setIsSubjectModalOpen(true);
    if (type === "faculty") setIsFacultyModalOpen(true);
  };

  const handleAddRoom = (roomData) => {
    if (itemToEdit) {
      updateRoomMutation.mutate({ id: itemToEdit._id, ...roomData });
    } else {
      createRoomMutation.mutate(roomData);
    }
  };

  const handleAddBatch = async ({
    batchData,
    addedSubjects,
    deletedSubjectIds,
  }) => {
    try {
      if (itemToEdit) {
        // 1. Update Batch
        await updateBatchMutation.mutateAsync({
          id: itemToEdit._id,
          ...batchData,
        });

        // 2. Delete removed subjects
        if (deletedSubjectIds && deletedSubjectIds.length > 0) {
          for (const subId of deletedSubjectIds) {
            await deleteSubjectMutation.mutateAsync(subId);
          }
        }

        // 3. Add new subjects
        if (addedSubjects && addedSubjects.length > 0) {
          for (const sub of addedSubjects) {
            await createSubjectMutation.mutateAsync(sub);
          }
        }
      } else {
        // 1. Create Batch
        await createBatchMutation.mutateAsync(batchData);

        // 2. Add subjects (now that batch exists)
        if (addedSubjects && addedSubjects.length > 0) {
          for (const sub of addedSubjects) {
            await createSubjectMutation.mutateAsync(sub);
          }
        }
      }
      // Refresh all data
      queryClient.invalidateQueries(["batches"]);
      queryClient.invalidateQueries(["subjects"]);
    } catch (error) {
      console.error("Error managing batch:", error);
      // Ideally show an error toast here
    }
  };

  const handleAddSubject = (subjectData) => {
    if (itemToEdit) {
      updateSubjectMutation.mutate({ id: itemToEdit._id, ...subjectData });
    } else {
      createSubjectMutation.mutate(subjectData);
    }
  };

  const handleAddFaculty = (facultyData) => {
    if (itemToEdit) {
      updateFacultyMutation.mutate({ id: itemToEdit._id, ...facultyData });
    } else {
      createFacultyMutation.mutate(facultyData);
    }
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
              setItemToEdit(null);
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
                  onDelete={() => handleDeleteClick(room, "classroom")}
                  onEdit={() => handleEditClick(room, "room")}
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
                  onDelete={() => handleDeleteClick(batch, "batch")}
                  onEdit={() => handleEditClick(batch, "batch")}
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
                    onDelete={() => handleDeleteClick(subject, "subject")}
                    onEdit={() => handleEditClick(subject, "subject")}
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
                  onDelete={() => handleDeleteClick(fac, "faculty")}
                  onEdit={() => handleEditClick(fac, "faculty")}
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
        initialData={itemToEdit}
      />
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSubmit={handleAddBatch}
        initialData={itemToEdit}
        allSubjects={subjects}
      />
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSubmit={handleAddSubject}
        initialData={itemToEdit}
        batches={batches}
      />
      <FacultyModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSubmit={handleAddFaculty}
        initialData={itemToEdit}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${
          deleteType
            ? deleteType.charAt(0).toUpperCase() + deleteType.slice(1)
            : ""
        }`}
        message={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
        isLoading={
          deleteRoomMutation.isPending ||
          deleteBatchMutation.isPending ||
          deleteSubjectMutation.isPending ||
          deleteFacultyMutation.isPending
        }
      />
    </div>
  );
};

export default DataManagement;

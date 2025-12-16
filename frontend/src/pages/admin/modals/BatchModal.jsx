import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const BatchModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  allSubjects = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    students: "",
    yearOfStudy: "",
  });

  // IDs of existing subjects selected from the list
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  // Newly created subjects during this session
  const [newSubjects, setNewSubjects] = useState([]);

  // Form state for adding a NEW subject
  const [newSubjectInput, setNewSubjectInput] = useState({
    code: "",
    name: "",
    hours: "",
    isLab: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.batchName || "",
          students: initialData.strength || "",
          yearOfStudy: initialData.yearOfStudy || "",
        });
        // Pre-select existing subjects
        setSelectedSubjectIds(
          initialData.subjects ? initialData.subjects.map((s) => s._id) : []
        );
      } else {
        setFormData({
          name: "",
          students: "",
          yearOfStudy: "",
        });
        setSelectedSubjectIds([]);
      }
      setNewSubjects([]);
      setNewSubjectInput({ code: "", name: "", hours: "", isLab: false });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox toggle for existing subjects
  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjectIds((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  // Handle input for NEW subject form
  const handleNewSubjectChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSubjectInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add a NEW subject to the temporary list
  const addNewSubject = () => {
    if (newSubjectInput.name && newSubjectInput.hours && newSubjectInput.code) {
      setNewSubjects((prev) => [
        ...prev,
        {
          ...newSubjectInput,
          hours: parseInt(newSubjectInput.hours),
        },
      ]);
      setNewSubjectInput({ code: "", name: "", hours: "", isLab: false });
    }
  };

  // Remove a NEW subject from the temporary list
  const removeNewSubject = (index) => {
    setNewSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      batchData: {
        batchName: formData.name,
        strength: parseInt(formData.students),
        yearOfStudy: parseInt(formData.yearOfStudy),
      },
      // Only send subjects if we are in edit mode (initialData exists)
      // Or if the user wants to allow adding subjects during create (which they said NO to)
      // But wait, if I hide the UI, these arrays will be empty anyway.
      subjectIds: selectedSubjectIds,
      newSubjects: newSubjects.map((sub) => ({
        subjectCode: sub.code,
        subjectName: sub.name,
        sessionsPerWeek: sub.hours,
        type: sub.isLab ? "Practical" : "Theory",
        requiredRoomType: sub.isLab ? "Laboratory" : "Classroom",
      })),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? "Edit Batch" : "Add New Batch"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Batch Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. CS-Sem3-A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="students"
                className="text-sm font-medium text-gray-700"
              >
                Students
              </label>
              <input
                type="number"
                id="students"
                name="students"
                value={formData.students}
                onChange={handleChange}
                placeholder="e.g. 55"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                required
                min="1"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="yearOfStudy"
                className="text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <input
                type="number"
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Only show Subject Selection & Creation if Editing (initialData exists) */}
          {initialData && (
            <>
              {/* Existing Subjects Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Select Existing Subjects
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                  {allSubjects.length > 0 ? (
                    allSubjects.map((subject) => (
                      <label
                        key={subject._id}
                        className="flex items-center space-x-2 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubjectIds.includes(subject._id)}
                          onChange={() => handleSubjectToggle(subject._id)}
                          className="rounded text-yellow-500 focus:ring-yellow-400"
                        />
                        <span className="text-sm text-gray-700">
                          <span className="font-medium">
                            {subject.subjectCode}
                          </span>{" "}
                          - {subject.subjectName}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 col-span-2 text-center py-2">
                      No existing subjects found.
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Subject Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
                  Create & Add New Subject
                </h4>

                {/* New Subject Form */}
                <div className="grid grid-cols-12 gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="col-span-3">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newSubjectInput.code}
                      onChange={handleNewSubjectChange}
                      placeholder="CS101"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newSubjectInput.name}
                      onChange={handleNewSubjectChange}
                      placeholder="Subject Name"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      Hours
                    </label>
                    <input
                      type="number"
                      name="hours"
                      value={newSubjectInput.hours}
                      onChange={handleNewSubjectChange}
                      placeholder="4"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="col-span-2 flex items-center pb-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isLab"
                        checked={newSubjectInput.isLab}
                        onChange={handleNewSubjectChange}
                        className="rounded text-yellow-500 focus:ring-yellow-400"
                      />
                      <span className="text-sm text-gray-600">Lab?</span>
                    </label>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={addNewSubject}
                      className="w-full p-1.5 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition-colors flex items-center justify-center"
                      title="Add Subject"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* List of Newly Added Subjects */}
                {newSubjects.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <p className="text-xs font-medium text-gray-500">
                      New Subjects to Create:
                    </p>
                    {newSubjects.map((sub, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-sm text-gray-900">
                            {sub.code}
                          </span>
                          <span className="text-sm text-gray-600">
                            {sub.name}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-white rounded border text-gray-500">
                            {sub.hours}h
                          </span>
                          {sub.isLab && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              Lab
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewSubject(index)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Save Changes" : "Create Batch"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchModal;

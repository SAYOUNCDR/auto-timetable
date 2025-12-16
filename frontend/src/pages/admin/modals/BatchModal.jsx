import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const BatchModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    students: "",
    curriculum: [],
  });

  const [newSubject, setNewSubject] = useState({ name: "", hours: "" });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.batchName || "",
          students: initialData.strength || "",
          curriculum: initialData.subjects
            ? initialData.subjects.map((sub) => ({
                name: sub.subjectName,
                hours: sub.sessionsPerWeek,
              }))
            : [],
        });
      } else {
        setFormData({
          name: "",
          students: "",
          curriculum: [],
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({ ...prev, [name]: value }));
  };

  const addSubject = () => {
    if (newSubject.name && newSubject.hours) {
      setFormData((prev) => ({
        ...prev,
        curriculum: [
          ...prev.curriculum,
          { ...newSubject, hours: parseInt(newSubject.hours) },
        ],
      }));
      setNewSubject({ name: "", hours: "" });
    }
  };

  const removeSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      batchName: formData.name,
      strength: parseInt(formData.students),
      // curriculum is not directly supported by createBatch/updateBatch in the current backend
      // subjects need to be created separately or backend needs update
    });
    // Reset form
    setFormData({
      name: "",
      students: "",
      curriculum: [],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Batch Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
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

          {/* Student Count */}
          <div className="space-y-1.5">
            <label
              htmlFor="students"
              className="text-sm font-medium text-gray-700"
            >
              Number of Students
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

          {/* Curriculum Builder */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-gray-700">
              Curriculum
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="name"
                value={newSubject.name}
                onChange={handleSubjectChange}
                placeholder="Subject Name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
              <input
                type="number"
                name="hours"
                value={newSubject.hours}
                onChange={handleSubjectChange}
                placeholder="Hrs/Wk"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                min="1"
              />
              <button
                type="button"
                onClick={addSubject}
                className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* List of added subjects */}
            <div className="space-y-2 mt-2">
              {formData.curriculum.map((sub, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {sub.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({sub.hours} hrs)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {formData.curriculum.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  No subjects added yet.
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit">Add Batch</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchModal;

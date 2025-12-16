import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const SubjectModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    sessions: "",
    isLab: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          code: initialData.subjectCode || "",
          name: initialData.subjectName || "",
          sessions: initialData.sessionsPerWeek || "",
          isLab: initialData.type === "Practical",
        });
      } else {
        setFormData({
          code: "",
          name: "",
          sessions: "",
          isLab: false,
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      subjectCode: formData.code,
      subjectName: formData.name,
      sessionsPerWeek: parseInt(formData.sessions),
      type: formData.isLab ? "Practical" : "Theory",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? "Edit Subject" : "Add New Subject"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div className="space-y-1.5">
            <label htmlFor="code" className="text-sm font-medium text-gray-700">
              Subject Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. CS201"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Subject Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Data Structures"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Sessions */}
          <div className="space-y-1.5">
            <label
              htmlFor="sessions"
              className="text-sm font-medium text-gray-700"
            >
              Sessions Per Week
            </label>
            <input
              type="number"
              id="sessions"
              name="sessions"
              value={formData.sessions}
              onChange={handleChange}
              placeholder="e.g. 4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              required
              min="1"
            />
          </div>

          {/* Is Lab */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isLab"
              name="isLab"
              checked={formData.isLab}
              onChange={handleChange}
              className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
            />
            <label
              htmlFor="isLab"
              className="text-sm font-medium text-gray-700"
            >
              This is a Laboratory Subject
            </label>
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
            <Button type="submit">Add Subject</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;

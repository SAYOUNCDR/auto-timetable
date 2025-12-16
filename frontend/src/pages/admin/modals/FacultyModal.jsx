import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const FacultyModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    maxClasses: "",
    subjects: "", // Comma separated string for input
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          email: initialData.email || "",
          password: "", // Don't pre-fill password
          maxClasses: initialData.maxClassesPerDay || "",
          subjects: initialData.qualifiedSubjects
            ? initialData.qualifiedSubjects
                .map((sub) => (typeof sub === "object" ? sub.subjectName : sub))
                .join(", ")
            : "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          maxClasses: "",
          subjects: "",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert comma separated subjects to array
    const subjectsArray = formData.subjects
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const submitData = {
      name: formData.name,
      email: formData.email,
      maxClassesPerDay: parseInt(formData.maxClasses),
      qualifiedSubjectCodes: subjectsArray,
    };

    // Only include password if it's provided (required for new, optional for edit)
    if (formData.password) {
      submitData.password = formData.password;
    }

    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? "Edit Faculty" : "Add New Faculty"}
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
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Faculty Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Dr. A. Sharma"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. faculty@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password {initialData && "(Leave blank to keep current)"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              required={!initialData}
            />
          </div>

          {/* Max Classes */}
          <div className="space-y-1.5">
            <label
              htmlFor="maxClasses"
              className="text-sm font-medium text-gray-700"
            >
              Max Classes Per Day
            </label>
            <input
              type="number"
              id="maxClasses"
              name="maxClasses"
              value={formData.maxClasses}
              onChange={handleChange}
              placeholder="e.g. 4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              required
              min="1"
              max="10"
            />
          </div>

          {/* Subjects */}
          <div className="space-y-1.5">
            <label
              htmlFor="subjects"
              className="text-sm font-medium text-gray-700"
            >
              Qualified Subjects (comma separated)
            </label>
            <input
              type="text"
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              placeholder="e.g. CS201, CS202"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-400">
              Enter subject codes separated by commas.
            </p>
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
            <Button type="submit">Add Faculty</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyModal;

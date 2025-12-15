import React from "react";
import { Trash2, Pencil, Briefcase, BookOpen } from "lucide-react";

const FacultyCard = ({ name, maxClasses, subjects, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-inner mt-4 relative overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="font-bold text-gray-900 text-lg tracking-tight transition-colors">
            {name}
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">
            Faculty Details
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-50 mb-5"></div>

      {/* Details Section */}
      <div className="space-y-5 relative z-10">
        {/* Max Classes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Max Classes/Day
            </span>
          </div>
          <div className="font-mono font-semibold text-white bg-gray-900 px-3 py-1 rounded-md border border-gray-800 transition-colors">
            {maxClasses}
          </div>
        </div>

        {/* Qualified Subjects */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Qualified Subjects
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pl-11">
            {subjects.map((sub, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-bold bg-black text-white border border-black shadow-sm"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;

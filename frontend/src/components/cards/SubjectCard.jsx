import React from "react";
import { Trash2, Pencil, Check } from "lucide-react";

const SubjectCard = ({ code, name, sessions, isLab, onDelete }) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0 group">
      {/* Code */}
      <div className="col-span-2 font-mono text-sm font-medium text-gray-500 uppercase">
        {code}
      </div>

      {/* Name */}
      <div className="col-span-4 font-medium text-gray-900">{name}</div>

      {/* Sessions */}
      <div className="col-span-2">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-800 text-white text-sm font-bold rounded-md shadow-sm">
          {sessions}
        </span>
      </div>

      {/* Type (Lab Checkbox) */}
      <div className="col-span-2 flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            isLab
              ? "bg-yellow-400 border-yellow-400 text-black"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          {isLab && <Check size={12} strokeWidth={3} />}
        </div>
        <span
          className={`text-sm font-medium ${
            isLab ? "text-gray-900" : "text-gray-500"
          }`}
        >
          Lab
        </span>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
  );
};

export default SubjectCard;

import React from "react";
import { Trash2, Pencil } from "lucide-react";

const RoomCard = ({ name, capacity, type, onTypeChange, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4 relative group hover:shadow-md hover:border-yellow-400 transition-all duration-200">
      {/* Delete Icon */}
      <button
        onClick={onDelete}
        className="absolute top-4 right-4 text-gray-300 "
      >
        <div className="flex gap-4">
          <Pencil size={18} className="hover:text-red-500 transition-colors" />
          <Trash2 size={18} className="hover:text-red-500 transition-colors" />
        </div>
      </button>

      <h3 className="font-bold text-gray-800 text-lg">{name}</h3>

      {/* Capacity Input */}
      <div className="flex items-center justify-between">
        <label className="text-gray-500 font-medium text-sm">Capacity</label>
        <div className="flex items-center bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-md px-2 py-1 gap-2">
          <span className="font-mono font-semibold">{capacity}</span>
        </div>
      </div>

      {/* Type Dropdown */}
      <div className="flex items-center justify-between">
        <label className="text-gray-500 font-medium text-sm">Type</label>
        {type}
      </div>
    </div>
  );
};

export default RoomCard;

import React from "react";
import { Trash2 } from "lucide-react";

const RoomCard = ({ name, capacity, type, onTypeChange, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4 relative group hover:shadow-md transition-shadow">
      {/* Delete Icon */}
      <button
        onClick={onDelete}
        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
      >
        <Trash2 size={18} />
      </button>

      <h3 className="font-bold text-gray-800 text-lg">{name}</h3>

      {/* Capacity Input */}
      <div className="flex items-center justify-between">
        <label className="text-gray-500 font-medium text-sm">Capacity</label>
        <div className="flex items-center bg-gray-800 text-white rounded px-2 py-1 gap-2">
          <span className="font-mono">{capacity}</span>
          <div className="flex flex-col gap-0.5">
            <div className="w-2 h-1 bg-gray-600 rounded-t cursor-pointer hover:bg-gray-500"></div>
            <div className="w-2 h-1 bg-gray-600 rounded-b cursor-pointer hover:bg-gray-500"></div>
          </div>
        </div>
      </div>

      {/* Type Dropdown */}
      <div className="flex items-center justify-between">
        <label className="text-gray-500 font-medium text-sm">Type</label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-1.5 focus:ring-black focus:border-black block w-32 outline-none"
        >
          <option value="Classroom">Classroom</option>
          <option value="Laboratory">Laboratory</option>
          <option value="Auditorium">Auditorium</option>
        </select>
      </div>
    </div>
  );
};

export default RoomCard;

import { Trash2, Pencil, Users, Building2 } from "lucide-react";

const RoomCard = ({ name, capacity, type, onTypeChange, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-inner mt-4 relative overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="font-bold text-gray-900 text-lg tracking-tight transition-colors">
            {name}
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">
            Room Details
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={onEdit}
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
      <div className="space-y-4 relative z-10">
        {/* Capacity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <Users size={16} />
            </div>
            <span className="text-sm font-medium">Capacity</span>
          </div>
          <div className="font-mono font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-md border border-gray-100 transition-colors">
            {capacity}
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <Building2 size={16} />
            </div>
            <span className="text-sm font-medium">Type</span>
          </div>
          <span className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
            {type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

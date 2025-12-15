import { Trash2, Users, BookOpen, Pencil } from "lucide-react";

const BatchCard = ({ name, students, curriculum, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-inner mt-4 relative overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-gray-900 text-lg tracking-tight">
            {name}
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100 text-yellow-800 text-xs font-medium">
            <Users size={14} />
            <span>{students} Students</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 self-end md:self-auto">
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

      {/* Curriculum Section */}
      <div className="space-y-3 relative z-10">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-2">
          <BookOpen size={14} />
          Curriculum Requirements
        </p>

        <div className="flex flex-wrap gap-3">
          {curriculum.map((subject, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-sm text-gray-600 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
              <span className="font-medium text-gray-900">{subject.name}</span>
              <span className="text-gray-400 text-xs">
                ({subject.hours}/wk)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchCard;

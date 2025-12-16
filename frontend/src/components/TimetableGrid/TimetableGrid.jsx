import React, { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, User, Users } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
];

const ClassCard = ({ entry }) => {
  if (!entry)
    return (
      <div className="h-full w-full bg-gray-50/50 rounded-lg border border-dashed border-gray-200"></div>
    );

  return (
    <div
      className={`h-full w-full p-2 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all ${
        entry.subject?.type === "Practical"
          ? "bg-blue-50 border-blue-400"
          : "bg-yellow-50 border-yellow-400"
      }`}
    >
      <div className="flex flex-col h-full justify-between space-y-1">
        <div>
          <h4
            className="font-bold text-xs text-gray-800 line-clamp-2"
            title={entry.subject?.subjectName}
          >
            {entry.subject?.subjectName || "Unknown Subject"}
          </h4>
          <p className="text-[10px] font-mono text-gray-500">
            {entry.subject?.subjectCode}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-[10px] text-gray-600 gap-1">
            <User size={10} />
            <span className="truncate" title={entry.faculty?.name}>
              {entry.faculty?.name || "No Faculty"}
            </span>
          </div>
          <div className="flex items-center text-[10px] text-gray-600 gap-1">
            <MapPin size={10} />
            <span className="truncate">
              {entry.room?.className || "No Room"}
            </span>
          </div>
          {entry.batch && (
            <div className="flex items-center text-[10px] text-gray-600 gap-1">
              <Users size={10} />
              <span className="truncate">{entry.batch?.batchName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TimetableGrid = ({
  timetableData = [],
  batches = [],
  selectedBatchId,
  onBatchSelect,
}) => {
  const [activeDay, setActiveDay] = useState(0); // 0 = Monday

  // --- Derived State ---

  // 1. Filter data based on selection
  const filteredData = useMemo(() => {
    if (selectedBatchId === "all") {
      return timetableData;
    }
    return timetableData.filter((t) => t.batch?._id === selectedBatchId);
  }, [timetableData, selectedBatchId]);

  // 2. Organize data for the grid
  // Map: `${day}-${slot}-${batchId}` -> Entry
  const scheduleMap = useMemo(() => {
    const map = {};
    filteredData.forEach((entry) => {
      // Key depends on view mode
      // If Single Batch View: key = `${day}-${slot}`
      // If Master View: key = `${day}-${slot}-${batchId}`
      const key =
        selectedBatchId === "all"
          ? `${entry.day}-${entry.slot}-${entry.batch?._id}`
          : `${entry.day}-${entry.slot}`;
      map[key] = entry;
    });
    return map;
  }, [filteredData, selectedBatchId]);

  // --- Render Helpers ---

  const renderMasterView = () => (
    <div className="space-y-4">
      {/* Day Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-1 overflow-x-auto">
        {DAYS.map((day, index) => (
          <button
            key={day}
            onClick={() => setActiveDay(index)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeDay === index
                ? "bg-white text-yellow-600 border-b-2 border-yellow-500"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Master Grid (Rows: Batches, Cols: Slots) */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32 sticky left-0 bg-gray-50 z-10">
                Batch
              </th>
              {TIME_SLOTS.map((slot, i) => (
                <th
                  key={i}
                  className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-40"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {batches.map((batch) => (
              <tr
                key={batch._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-3 text-sm font-bold text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-100">
                  {batch.batchName}
                </td>
                {TIME_SLOTS.map((_, slotIndex) => {
                  const entry =
                    scheduleMap[`${activeDay}-${slotIndex}-${batch._id}`];
                  return (
                    <td
                      key={slotIndex}
                      className="p-2 h-32 align-top border-r border-gray-50 last:border-r-0"
                    >
                      <ClassCard entry={entry} />
                    </td>
                  );
                })}
              </tr>
            ))}
            {batches.length === 0 && (
              <tr>
                <td
                  colSpan={TIME_SLOTS.length + 1}
                  className="p-8 text-center text-gray-400"
                >
                  No batches found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBatchView = () => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-4 text-left text-sm font-semibold w-32">
                Day / Time
              </th>
              {TIME_SLOTS.map((slot, i) => (
                <th
                  key={i}
                  className="p-4 text-center text-sm font-semibold w-40 border-l border-gray-700"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {DAYS.map((day, dayIndex) => (
              <tr key={day} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-bold text-gray-900 bg-gray-50/50">
                  {day}
                </td>
                {TIME_SLOTS.map((_, slotIndex) => {
                  const entry = scheduleMap[`${dayIndex}-${slotIndex}`];
                  return (
                    <td
                      key={slotIndex}
                      className="p-2 h-32 align-top border-l border-gray-100"
                    >
                      <ClassCard entry={entry} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {selectedBatchId === "all"
                ? "Master Schedule"
                : "Batch Timetable"}
            </h2>
            <p className="text-xs text-gray-500">
              {selectedBatchId === "all"
                ? `Viewing all ${batches.length} batches for ${DAYS[activeDay]}`
                : "Viewing weekly schedule"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Filter by Batch:
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => onBatchSelect(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
          >
            <option value="all">All Batches (Master View)</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.batchName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {selectedBatchId === "all" ? renderMasterView() : renderBatchView()}
    </div>
  );
};

export default TimetableGrid;

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBatches, fetchTimetable } from "../../services/api";
import TimetableGrid from "../../components/TimetableGrid/TimetableGrid";

const AllTimetables = () => {
  const [selectedBatchId, setSelectedBatchId] = useState("all");

  const { data: batches = [], isLoading: loadingBatches } = useQuery({
    queryKey: ["batches"],
    queryFn: fetchBatches,
  });

  const { data: timetable = [], isLoading: loadingTimetable } = useQuery({
    queryKey: ["timetable"],
    queryFn: fetchTimetable,
  });

  if (loadingBatches || loadingTimetable) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50">
      <TimetableGrid
        timetableData={timetable}
        batches={batches}
        selectedBatchId={selectedBatchId}
        onBatchSelect={setSelectedBatchId}
      />
    </div>
  );
};

export default AllTimetables;

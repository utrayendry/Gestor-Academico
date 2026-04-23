// src/features/years/YearDetail.tsx
import React from "react";
import { useApp } from "../../contexts/AppContext";
import { SemesterCard } from "../semesters/SemesterCard";
import { Button } from "../../Components/ui/Button";
import { Icon } from "../../Components/ui/Icon";
import { calculateYearAverage, formatAverage } from "../../utils/gradesUtils";
import type { Year } from "../../types";

interface YearDetailProps {
  year: Year;
}

export const YearDetail: React.FC<YearDetailProps> = ({ year }) => {
  const { addSemester } = useApp();
  const yearAverage = calculateYearAverage(year.semesters);
  const canAddSemester = year.semesters.length < 2;

  const handleAddSemester = () => {
    if (canAddSemester) {
      addSemester(year.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Year header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Year {year.number}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {year.semesters.length} semester(s) • Manage your grades
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Year Average
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatAverage(yearAverage)}
            </p>
          </div>

          {canAddSemester && (
            <Button variant="outline" size="sm" onClick={handleAddSemester}>
              <Icon name="plus" className="w-4 h-4 mr-1" />
              Add Semester
            </Button>
          )}
        </div>
      </div>

      {/* Semesters grid */}
      <div className="space-y-4">
        {year.semesters.map((semester) => (
          <SemesterCard
            key={semester.id}
            yearId={year.id}
            semester={semester}
          />
        ))}
      </div>

      {/* Empty state */}
      {year.semesters.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No semesters added yet.
          </p>
          <Button variant="primary" onClick={handleAddSemester}>
            <Icon name="plus" className="w-4 h-4 mr-1" />
            Add First Semester
          </Button>
        </div>
      )}
    </div>
  );
};

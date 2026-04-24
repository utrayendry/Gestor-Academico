// src/features/semesters/SemesterCard.tsx

import React, { useState } from "react";
import { SemesterContent } from "./SemesterContent";
import { Icon } from "../../Components/ui/Icon";
import { Card } from "../../Components/ui/Card";
import {
  calculateSemesterAverage,
  formatAverage,
} from "../../utils/gradesUtils";
import type { Semester } from "../../types";

interface SemesterCardProps {
  yearId: string;
  semester: Semester;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({
  yearId,
  semester,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const semesterAverage = calculateSemesterAverage(semester.subjects);

  // Toggle card expansion
  const handleToggle = () => setIsExpanded((prev) => !prev);

  return (
    <Card variant="bordered" className="overflow-hidden">
      {/* Card header - clickable toggle */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {semester.number}
            </span>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Semestre {semester.number}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {semester.subjects.length} materias
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Promedio</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {formatAverage(semesterAverage)}
            </p>
          </div>
          <Icon
            name="chevronDown"
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expandable content with smooth animation */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-200 dark:border-gray-700">
          <SemesterContent yearId={yearId} semester={semester} />
        </div>
      </div>
    </Card>
  );
};

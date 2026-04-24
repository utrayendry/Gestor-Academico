// src/features/dashboard/StatsOverview.tsx

import React from "react";
import { useApp } from "../../contexts/AppContext";
import { calculateYearAverage } from "../../utils/gradesUtils";
import { Icon } from "../../Components/ui/Icon";

export const StatsOverview: React.FC = () => {
  const { state } = useApp();

  // Get currently selected year
  const currentYear = state.years.find((y) => y.id === state.selectedYearId);

  // Calculate year average for selected year
  const yearAverage = currentYear
    ? calculateYearAverage(currentYear.semesters)
    : null;

  // Count total subjects in selected year
  const totalSubjects = currentYear
    ? currentYear.semesters.reduce((acc, sem) => acc + sem.subjects.length, 0)
    : 0;

  // Count approved subjects in selected year (grade >= 3.0)
  const approvedSubjects = currentYear
    ? currentYear.semesters.reduce((acc, sem) => {
        return (
          acc +
          sem.subjects.filter((sub) => {
            const grade = parseFloat(sub.grade);
            return !isNaN(grade) && grade >= 3.0;
          }).length
        );
      }, 0)
    : 0;

  // Statistics cards configuration
  const stats = [
    {
      label: "Promedio",
      value: yearAverage?.toFixed(2) || "—",
      icon: "chart" as const,
      bgColor: "bg-blue-600/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Materias",
      value: totalSubjects.toString(),
      icon: "book" as const,
      bgColor: "bg-purple-600/20",
      iconColor: "text-purple-400",
    },
    {
      label: "Aprobadas",
      value: approvedSubjects.toString(),
      icon: "check" as const,
      bgColor: "bg-green-600/20",
      iconColor: "text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="
            bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700
            transition-all duration-200
          "
        >
          {/* Stat icon */}
          <div className="flex justify-center mb-2">
            <div
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center
                ${stat.bgColor}
              `}
            >
              <Icon
                name={stat.icon}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.iconColor}`}
              />
            </div>
          </div>

          {/* Stat value */}
          <p className="text-xl sm:text-2xl font-bold text-white text-center">
            {stat.value}
          </p>

          {/* Stat label */}
          <p className="text-[10px] sm:text-xs text-slate-400 text-center mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

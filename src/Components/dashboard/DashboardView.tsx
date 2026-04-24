// src/features/dashboard/DashboardView.tsx

import React from "react";
import { useApp } from "../../contexts/AppContext";
import { SemesterCard } from "../../features/semesters/SemesterCard";
import { StatsOverview } from "./StatsOverview";
import { EmptyState } from "../../Components/ui/EmptyState";

export const DashboardView: React.FC = () => {
  const { state, addYear } = useApp();
  const { years, selectedYearId, student, career } = state;

  // Show setup prompt if no student or career configured
  if (!student || !career) {
    return <EmptyState type="setup" />;
  }

  // Show empty state if no years created
  if (years.length === 0) {
    return (
      <EmptyState
        type="no-years"
        onAction={addYear}
        actionLabel="Agregar Primer Año"
      />
    );
  }

  // Get currently selected year from sidebar selection
  const selectedYear = years.find((y) => y.id === selectedYearId) || years[0];

  return (
    <div className="space-y-6">
      {/* Statistics cards - always in a row */}
      <StatsOverview />

      {/* Semester cards - always stacked vertically */}
      <div className="space-y-6">
        {selectedYear.semesters.map((semester) => (
          <SemesterCard
            key={semester.id}
            yearId={selectedYear.id}
            semester={semester}
          />
        ))}
      </div>
    </div>
  );
};

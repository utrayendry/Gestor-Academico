// src/components/layout/Header.tsx

import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { StudentModal } from "../../features/career/StudentModal";
import { AverageModal } from "../../features/career/AverageModal";
import { calculateFinalAverage } from "../../utils/gradesUtils";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarWidth: number;
  isMobile: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  sidebarWidth,
  isMobile,
}) => {
  const { state, saveToStorage } = useApp();
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [averageModalOpen, setAverageModalOpen] = useState(false);

  // Calculate final average from all years
  const finalAverage = calculateFinalAverage(state.years);
  const { student, career } = state;

  return (
    <>
      <header
        className="
        fixed top-0 left-0 right-0
        h-16
        bg-slate-900/95
        border-b border-slate-800
        z-30
        "
      >
        <div
          style={{
            marginLeft: !isMobile ? sidebarWidth : 0,
          }}
          className="
          h-full flex items-center justify-between
          px-4 sm:px-6 lg:px-8
          transition-all duration-300
          "
        >
          {/* Left section: mobile menu trigger + student profile */}
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger button */}
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Icon name="menu" className="w-5 h-5" />
              </button>
            )}

            {/* Student profile button - opens student modal */}
            {student && (
              <button
                onClick={() => setStudentModalOpen(true)}
                className="flex items-center gap-3 hover:bg-slate-800 px-3 py-2 rounded-lg transition"
              >
                {/* Student avatar circle */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {student.fullName.charAt(0)}
                  </span>
                </div>

                {/* Student name and career info */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-200">
                    {student.fullName}
                  </p>

                  {career && (
                    <p className="text-xs text-slate-400">{career.name}</p>
                  )}
                </div>

                <Icon name="chevronDown" className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>

          {/* Right section: action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Average grade button with subtle blue accent */}
            <button
              onClick={() => setAverageModalOpen(true)}
              className="
                group relative
                flex items-center gap-1.5 sm:gap-2
                px-2.5 py-1.5 sm:px-3.5 sm:py-2
                bg-blue-950/50
                hover:bg-blue-900/50
                text-blue-300
                hover:text-blue-200
                text-xs sm:text-sm font-medium
                rounded-lg
                border border-blue-800/30
                hover:border-blue-700/40
                transition-all duration-200
                active:scale-95
              "
            >
              {/* Chart icon */}
              <Icon name="chart" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

              {/* Button label - always visible */}
              <span className="text-xs sm:text-sm">Promedio</span>
            </button>

            {/* Save data button */}
            <Button variant="ghost" size="sm" onClick={saveToStorage}>
              <Icon name="save" className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Guardar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Student information modal */}
      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
      />

      {/* Final average modal */}
      <AverageModal
        isOpen={averageModalOpen}
        onClose={() => setAverageModalOpen(false)}
        finalAverage={finalAverage}
        studentName={student?.fullName}
      />

      {/* Spacer to offset fixed header height */}
      <div className="h-16" />
    </>
  );
};

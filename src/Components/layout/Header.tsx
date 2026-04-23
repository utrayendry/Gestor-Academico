// src/components/layout/Header.tsx

import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { StudentModal } from "../../features/career/StudentModal";
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
          <div className="flex items-center gap-4">
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Icon name="menu" className="w-5 h-5" />
              </button>
            )}

            {student && (
              <button
                onClick={() => setStudentModalOpen(true)}
                className="flex items-center gap-3 hover:bg-slate-800 px-3 py-2 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {student.fullName.charAt(0)}
                  </span>
                </div>

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

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Promedio
              <span className="ml-2 text-blue-400 font-semibold">
                {finalAverage ? finalAverage.toFixed(2) : "—"}
              </span>
            </Button>

            <Button variant="ghost" size="sm" onClick={saveToStorage}>
              <Icon name="save" className="w-4 h-4 mr-1" />
              Guardar
            </Button>
          </div>
        </div>
      </header>

      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
      />

      <div className="h-16" />
    </>
  );
};

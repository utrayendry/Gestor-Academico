// src/components/layout/Sidebar.tsx

import React from "react";
import { useApp } from "../../contexts/AppContext";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { calculateYearAverage, formatAverage } from "../../utils/gradesUtils";

interface SidebarProps {
  isExpanded: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  onToggleExpand: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  isMobile,
  isMobileOpen,
  onToggleExpand,
  onCloseMobile,
}) => {
  const { state, addYear, selectYear, deleteYear } = useApp();
  const { years, selectedYearId, career } = state;

  const showSidebar = isMobile ? isMobileOpen : true;

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-full z-50
        bg-slate-800 border-r border-slate-700
        transition-all duration-300
        ${isExpanded ? "w-72" : "w-20"}
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* botón original flotante */}
        {!isMobile && (
          <button
            onClick={onToggleExpand}
            className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center shadow-md hover:bg-slate-600 transition-colors"
          >
            <Icon
              name="chevronRight"
              className={`w-3 h-3 text-slate-300 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center gap-3">
              {/* tamaño fijo */}
              <div className="w-9 h-9 flex items-center justify-center bg-blue-600 rounded-xl flex-shrink-0">
                <Icon name="book" className="w-5 h-5 text-white" />
              </div>

              {isExpanded && (
                <div className="overflow-hidden">
                  <h2 className="text-white font-semibold">Grade Manager</h2>

                  {career && (
                    <p className="text-xs text-slate-400">{career.name}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Years */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isExpanded && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  Años
                </span>

                <Button variant="ghost" size="sm" onClick={addYear}>
                  <Icon name="plus" className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {years.map((year) => {
                const avg = calculateYearAverage(year.semesters);
                const selected = selectedYearId === year.id;

                return (
                  <div
                    key={year.id}
                    className={`rounded-lg transition ${
                      selected ? "bg-slate-700" : "hover:bg-slate-700/50"
                    }`}
                  >
                    {isExpanded ? (
                      <div className="flex items-center justify-between p-3">
                        <button
                          onClick={() => selectYear(year.id)}
                          className="flex-1 text-left"
                        >
                          <p className="text-sm text-white font-medium">
                            Año {year.number}
                          </p>

                          <p className="text-xs text-slate-400">
                            {year.semesters.length} semestres
                          </p>
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 text-sm font-semibold">
                            {formatAverage(avg)}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="!p-1"
                            onClick={() => deleteYear(year.id)}
                          >
                            <Icon
                              name="delete"
                              className="w-4 h-4 text-slate-400 hover:text-red-400"
                            />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => selectYear(year.id)}
                        className={`w-full h-10 flex items-center justify-center text-sm font-semibold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {year.number}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

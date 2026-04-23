// src/features/years/YearSelector.tsx
import React from "react";
import { useApp } from "../../contexts/AppContext";
import { Button } from "../../Components/ui/Button";
import { Icon } from "../../Components/ui/Icon";
import { calculateYearAverage, formatAverage } from "../../utils/gradesUtils";

export const YearSelector: React.FC = () => {
  const { state, addYear, selectYear, deleteYear } = useApp();
  const { years, selectedYearId } = state;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Academic Years
        </h3>
        <Button variant="ghost" size="sm" onClick={() => addYear()}>
          <Icon name="plus" className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">Add Year</span>
        </Button>
      </div>

      <div className="space-y-2">
        {years.map((year) => {
          const yearAverage = calculateYearAverage(year.semesters);
          const isSelected = selectedYearId === year.id;

          return (
            <div
              key={year.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                isSelected
                  ? "bg-blue-50 dark:bg-blue-900/30"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <button
                onClick={() => selectYear(year.id)}
                className="flex-1 flex items-center justify-between text-left"
              >
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Year {year.number}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {year.semesters.length} semesters
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {formatAverage(yearAverage)}
                  </p>
                </div>
              </button>

              <button
                onClick={() => deleteYear(year.id)}
                className="ml-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <Icon
                  name="delete"
                  className="w-4 h-4 text-gray-400 hover:text-red-500"
                />
              </button>
            </div>
          );
        })}
      </div>

      {years.length === 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No years added.
          </p>
        </div>
      )}
    </div>
  );
};

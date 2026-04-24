// src/features/semesters/SemesterContent.tsx

import React from "react";
import { useApp } from "../../contexts/AppContext";
import { SubjectRow } from "../subjects/SubjectRow";
import { Button } from "../../Components/ui/Button";
import { Icon } from "../../Components/ui/Icon";
import type { Semester } from "../../types";

interface SemesterContentProps {
  yearId: string;
  semester: Semester;
}

export const SemesterContent: React.FC<SemesterContentProps> = ({
  yearId,
  semester,
}) => {
  const { addSubject } = useApp();

  // Add a new subject to this semester
  const handleAddSubject = () => {
    addSubject(yearId, semester.id);
  };

  return (
    <div className="p-4">
      {/* Subjects data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                Materia
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 w-28">
                Nota
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300 w-16">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {semester.subjects.map((subject) => (
              <SubjectRow
                key={subject.id}
                yearId={yearId}
                semesterId={semester.id}
                subject={subject}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Add subject action */}
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={handleAddSubject}>
          <Icon name="plus" className="w-4 h-4 mr-1" />
          Agregar Materia
        </Button>
      </div>
    </div>
  );
};

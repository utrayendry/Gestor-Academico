// src/features/subjects/SubjectRow.tsx

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { Icon } from "../../Components/ui/Icon";
import { getGradeColor } from "../../utils/gradesUtils";
import type { Subject } from "../../types";

interface SubjectRowProps {
  yearId: string;
  semesterId: string;
  subject: Subject;
}

export const SubjectRow: React.FC<SubjectRowProps> = ({
  yearId,
  semesterId,
  subject,
}) => {
  const { updateSubjectName, updateSubjectGrade, deleteSubject } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(subject.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Enter edit mode on name click
  const handleNameClick = () => setIsEditing(true);

  // Save name on blur
  const handleNameBlur = () => {
    setIsEditing(false);
    if (tempName.trim() && tempName !== subject.name) {
      updateSubjectName(yearId, semesterId, subject.id, tempName.trim());
    } else if (!tempName.trim()) {
      setTempName(subject.name);
    }
  };

  // Handle keyboard navigation in edit mode
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      if (tempName.trim() && tempName !== subject.name) {
        updateSubjectName(yearId, semesterId, subject.id, tempName.trim());
      }
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTempName(subject.name);
    }
  };

  // Update grade on input change
  const handleGradeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      updateSubjectGrade(yearId, semesterId, subject.id, value);
    },
    [yearId, semesterId, subject.id, updateSubjectGrade],
  );

  // Delete subject with confirmation
  const handleDelete = useCallback(() => {
    if (confirm("¿Eliminar esta materia?")) {
      deleteSubject(yearId, semesterId, subject.id);
    }
  }, [yearId, semesterId, subject.id, deleteSubject]);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
      {/* Subject name cell */}
      <td className="py-3 px-4">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div
            className="cursor-text hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={handleNameClick}
          >
            {subject.name}
          </div>
        )}
      </td>

      {/* Grade input cell */}
      <td className="py-3 px-4">
        <input
          type="text"
          inputMode="decimal"
          value={subject.grade}
          onChange={handleGradeChange}
          className={`w-20 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${getGradeColor(subject.grade)}`}
          placeholder="—"
        />
      </td>

      {/* Delete action cell */}
      <td className="py-3 px-4 text-center">
        <button
          onClick={handleDelete}
          className="p-1 rounded-md lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 active:bg-red-100 dark:hover:bg-red-900/30"
          aria-label="Eliminar materia"
        >
          <Icon
            name="delete"
            className="w-4 h-4 text-gray-400 hover:text-red-500"
          />
        </button>
      </td>
    </tr>
  );
};

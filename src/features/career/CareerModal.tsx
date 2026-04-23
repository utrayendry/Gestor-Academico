// src/features/career/CareerModal.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../../Components/ui/Button";
import type { Career } from "../../types";

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  career: Career | null;
  onUpdate: (data: Partial<Career>) => void;
}

export const CareerModal: React.FC<CareerModalProps> = ({
  isOpen,
  onClose,
  career,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    startYear: new Date().getFullYear(),
    expectedEndYear: new Date().getFullYear() + 4,
  });

  useEffect(() => {
    if (career) {
      setFormData({
        name: career.name,
        institution: career.institution,
        startYear: career.startYear,
        expectedEndYear: career.expectedEndYear,
      });
    }
  }, [career]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {career ? "Edit Program Info" : "Program Info"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Program/Career Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Institution
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  institution: e.target.value,
                }))
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Year
              </label>
              <input
                type="number"
                value={formData.startYear}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startYear: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expected End Year
              </label>
              <input
                type="number"
                value={formData.expectedEndYear}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expectedEndYear: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

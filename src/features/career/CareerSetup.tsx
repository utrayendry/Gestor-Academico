// src/features/career/CareerSetup.tsx
import React, { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { Button } from "../../Components/ui/Button";
import { Card } from "../../Components/ui/Card";
import { generateId } from "../../utils/gradesUtils";

interface CareerSetupProps {
  onComplete: () => void;
}

export const CareerSetup: React.FC<CareerSetupProps> = ({ onComplete }) => {
  const { setStudent, setCareer, addYear } = useApp();

  const [step, setStep] = useState<"student" | "career">("student");

  // Student form state
  const [studentData, setStudentData] = useState({
    fullName: "",
    email: "",
    studentId: "",
  });

  // Career form state
  const [careerData, setCareerData] = useState({
    name: "",
    institution: "",
    startYear: new Date().getFullYear(),
    expectedEndYear: new Date().getFullYear() + 4,
  });

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentData.fullName.trim()) return;

    setStudent({
      id: generateId(),
      fullName: studentData.fullName.trim(),
      email: studentData.email.trim() || undefined,
      studentId: studentData.studentId.trim() || undefined,
    });

    setStep("career");
  };

  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerData.name.trim()) return;

    setCareer({
      id: generateId(),
      name: careerData.name.trim(),
      institution: careerData.institution.trim() || "Not specified",
      startYear: careerData.startYear,
      expectedEndYear: careerData.expectedEndYear,
    });

    addYear();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <Card variant="elevated" className="max-w-md w-full p-6 sm:p-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${step === "student" ? "bg-blue-600" : "bg-gray-300"}`}
          />
          <div
            className={`w-8 h-px transition-colors ${step === "career" ? "bg-blue-600" : "bg-gray-300"}`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-colors ${step === "career" ? "bg-blue-600" : "bg-gray-300"}`}
          />
        </div>

        {step === "student" ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to Grade Manager
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Let's get to know you first
              </p>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={studentData.fullName}
                  onChange={(e) =>
                    setStudentData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={studentData.email}
                  onChange={(e) =>
                    setStudentData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="student@university.edu"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Student ID (Optional)
                </label>
                <input
                  type="text"
                  value={studentData.studentId}
                  onChange={(e) =>
                    setStudentData((prev) => ({
                      ...prev,
                      studentId: e.target.value,
                    }))
                  }
                  placeholder="e.g., 20240001"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                className="mt-6"
              >
                Continue
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Academic Program
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tell us about your studies
              </p>
            </div>

            <form onSubmit={handleCareerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program/Career Name *
                </label>
                <input
                  type="text"
                  value={careerData.name}
                  onChange={(e) =>
                    setCareerData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Computer Science, Software Engineering"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Institution (Optional)
                </label>
                <input
                  type="text"
                  value={careerData.institution}
                  onChange={(e) =>
                    setCareerData((prev) => ({
                      ...prev,
                      institution: e.target.value,
                    }))
                  }
                  placeholder="e.g., University of Technology"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Year
                  </label>
                  <input
                    type="number"
                    value={careerData.startYear}
                    onChange={(e) =>
                      setCareerData((prev) => ({
                        ...prev,
                        startYear: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expected End Year
                  </label>
                  <input
                    type="number"
                    value={careerData.expectedEndYear}
                    onChange={(e) =>
                      setCareerData((prev) => ({
                        ...prev,
                        expectedEndYear: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                className="mt-6"
              >
                Start Managing Grades
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};

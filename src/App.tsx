// src/App.tsx
import React from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { AppLayout } from "./Components/layout/AppLayout";
import { YearDetail } from "./features/years/YearDetail";
import { CareerSetup } from "./features/career/CareerSetup";
import { Loader } from "./Components/ui/Loader";

const MainContent: React.FC = () => {
  const { state } = useApp();
  const { student, career, years, selectedYearId, isLoading } = state;

  const selectedYear = years.find((y) => y.id === selectedYearId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  // Show career setup if no student or career is set
  if (!student || !career) {
    return <CareerSetup onComplete={() => {}} />;
  }

  if (!selectedYear) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No academic years
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Get started by creating your first academic year
        </p>
      </div>
    );
  }

  return <YearDetail year={selectedYear} />;
};

function App() {
  return (
    <AppProvider>
      <AppLayout>
        <MainContent />
      </AppLayout>
    </AppProvider>
  );
}

export default App;

// src/App.tsx

import React from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { CareerSetup } from "./features/career/CareerSetup";
import { AppLayout } from "./Components/layout/AppLayout";
import { DashboardView } from "./Components/dashboard/DashboardView";

// Inner component that accesses app context
const AppContent: React.FC = () => {
  const { state } = useApp();
  const [setupComplete, setSetupComplete] = React.useState(
    () => !!(state.student && state.career),
  );

  // Show career setup if student or career not configured
  if (!setupComplete && (!state.student || !state.career)) {
    return <CareerSetup onComplete={() => setSetupComplete(true)} />;
  }

  // Show main dashboard layout
  return (
    <AppLayout>
      <DashboardView />
    </AppLayout>
  );
};

// Root app component with provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

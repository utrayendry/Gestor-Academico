// src/components/layout/AppLayout.tsx

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive breakpoints and sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarExpanded(true); // Keep expanded in mobile drawer mode
      } else {
        setMobileOpen(false); // Close mobile drawer on desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate sidebar width based on state
  const sidebarWidth = sidebarExpanded ? 288 : 80;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        isMobile={isMobile}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleExpand={() => setSidebarExpanded((prev) => !prev)}
      />

      {/* Top header bar */}
      <Header
        onMenuClick={() => setMobileOpen(true)}
        sidebarWidth={sidebarWidth}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <main
        style={{
          marginLeft: !isMobile ? sidebarWidth : 0,
        }}
        className="pt-16 transition-all duration-300"
      >
        {/* Content container with responsive max-width */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

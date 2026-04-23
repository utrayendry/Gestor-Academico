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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);

      if (mobile) {
        setSidebarExpanded(true);
      } else {
        setMobileOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = sidebarExpanded ? 288 : 80;

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar
        isExpanded={sidebarExpanded}
        isMobile={isMobile}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleExpand={() => setSidebarExpanded((prev) => !prev)}
      />

      <Header
        onMenuClick={() => setMobileOpen(true)}
        sidebarWidth={sidebarWidth}
        isMobile={isMobile}
      />

      <main
        style={{
          marginLeft: !isMobile ? sidebarWidth : 0,
        }}
        className="pt-20 px-6 lg:px-10 pb-10 transition-all duration-300"
      >
        {children}
      </main>
    </div>
  );
};

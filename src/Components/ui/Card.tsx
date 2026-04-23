// src/components/ui/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "bordered" | "elevated";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  variant = "default",
}) => {
  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
  };

  const variants = {
    default: "bg-slate-800",
    bordered: "bg-slate-800 border border-slate-700",
    elevated: "bg-slate-800 shadow-lg",
  };

  return (
    <div
      className={`rounded-xl ${variants[variant]} ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

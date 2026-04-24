// src/components/ui/EmptyState.tsx

import React from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";

interface EmptyStateProps {
  type: "setup" | "no-years";
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onAction,
  actionLabel,
}) => {
  // Setup prompt when no student or career configured
  if (type === "setup") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          {/* Icon container */}
          <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon name="book" className="w-10 h-10 text-blue-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Bienvenido a Gestor de Notas
          </h2>

          <p className="text-slate-400 mb-6">
            Configura tu perfil y comienza a gestionar tu progreso académico
          </p>
        </div>
      </div>
    );
  }

  // Empty state when no years created yet
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center">
        {/* Icon container */}
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name="calendar" className="w-8 h-8 text-slate-500" />
        </div>

        <h3 className="text-lg font-medium text-white mb-2">
          No hay años académicos todavía
        </h3>

        <p className="text-slate-400 text-sm mb-4">
          Agrega tu primer año para comenzar
        </p>

        {onAction && actionLabel && (
          <Button onClick={onAction} variant="primary">
            <Icon name="plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

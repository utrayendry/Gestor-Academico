// src/features/career/AverageModal.tsx

import React, { useEffect, useRef } from "react";
import { Icon } from "../../Components/ui/Icon";

interface AverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  finalAverage: number | null;
  studentName?: string;
}

export const AverageModal: React.FC<AverageModalProps> = ({
  isOpen,
  onClose,
  finalAverage,
  studentName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key and body scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Dynamic color based on grade (2.0 - 5.0 scale)
  const getAverageColor = (avg: number) => {
    if (avg >= 4.5) return "text-emerald-400";
    if (avg >= 3.5) return "text-blue-400";
    if (avg >= 2.5) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-slate-900 rounded-xl shadow-2xl border border-slate-800 w-full max-w-sm focus:outline-none"
      >
        {/* Close button - top right */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Cerrar"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Centered content */}
        <div className="flex flex-col items-center justify-center p-8 pt-12">
          {/* Modal title */}
          <h2 className="text-lg font-semibold text-white mb-2">
            Promedio Final
          </h2>

          {/* Student name */}
          {studentName && (
            <p className="text-sm text-slate-400 mb-8">{studentName}</p>
          )}

          {/* Final grade display */}
          {finalAverage !== null && finalAverage !== undefined ? (
            <div className="flex items-baseline gap-2">
              <span
                className={`text-7xl font-bold tracking-tight ${getAverageColor(finalAverage)}`}
              >
                {finalAverage.toFixed(2)}
              </span>
              <span className="text-2xl text-slate-600 font-medium">/5</span>
            </div>
          ) : (
            <p className="text-slate-500 text-lg">Sin datos</p>
          )}
        </div>
      </div>
    </div>
  );
};

// src/features/career/StudentModal.tsx
import React, { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { Button } from "../../Components/ui/Button";
import { Input } from "../../Components/ui/Input";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, setStudent, updateStudent } = useApp();
  const { student } = state;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        email: student.email || "",
        studentId: student.studentId || "",
      });
      setIsEditing(false);
    } else {
      setFormData({
        fullName: "",
        email: "",
        studentId: "",
      });
      setIsEditing(true);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (student) {
      updateStudent({
        fullName: formData.fullName.trim(),
        email: formData.email || undefined,
        studentId: formData.studentId || undefined,
      });
    } else {
      setStudent({
        id: `student-${Date.now()}`,
        fullName: formData.fullName.trim(),
        email: formData.email || undefined,
        studentId: formData.studentId || undefined,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
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
          <h2 className="text-xl font-bold text-white">
            {student ? "Editar Estudiante" : "Configurar Estudiante"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo *"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            placeholder="Ej: Juan Pérez"
            required
          />

          <Input
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="estudiante@universidad.edu"
          />

          <Input
            label="ID de Estudiante"
            value={formData.studentId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, studentId: e.target.value }))
            }
            placeholder="Ej: 20240001"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {student ? "Guardar Cambios" : "Crear Estudiante"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

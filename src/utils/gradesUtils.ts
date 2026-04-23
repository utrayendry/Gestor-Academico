// src/utils/gradesUtils.ts
import type { Subject, Semester, Year } from "../types";

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Preserve decimal values - don't auto-round or modify
export const normalizeGrade = (value: string): string => {
  if (value === "" || value === null || value === undefined) return "";

  // Remove any invalid characters except numbers and decimal point
  let cleaned = value.replace(/[^0-9.]/g, "");

  // Ensure only one decimal point
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  // Parse as float to validate range, but preserve user input format
  const num = parseFloat(cleaned);
  if (isNaN(num)) return "";

  // Only clamp if user tries to enter invalid range
  if (num < 2) return "2";
  if (num > 5) return "5";

  // Preserve the exact user input (with decimals)
  return cleaned;
};

// Calculate average with proper decimal handling
export const calculateSemesterAverage = (subjects: Subject[]): number => {
  const validGrades = subjects
    .filter((s) => s.grade !== "" && !isNaN(parseFloat(s.grade)))
    .map((s) => parseFloat(s.grade));

  if (validGrades.length === 0) return 0;
  const sum = validGrades.reduce((a, b) => a + b, 0);
  const avg = sum / validGrades.length;
  return Math.round(avg * 100) / 100; // Round to 2 decimal places
};

export const calculateYearAverage = (semesters: Semester[]): number => {
  const averages = semesters.map((s) => calculateSemesterAverage(s.subjects));
  const validAverages = averages.filter((a) => a > 0);

  if (validAverages.length === 0) return 0;
  const sum = validAverages.reduce((a, b) => a + b, 0);
  const avg = sum / validAverages.length;
  return Math.round(avg * 100) / 100;
};

export const calculateFinalAverage = (years: Year[]): number => {
  const yearAverages = years.map((y) => calculateYearAverage(y.semesters));
  const validAverages = yearAverages.filter((a) => a > 0);

  if (validAverages.length === 0) return 0;
  const sum = validAverages.reduce((a, b) => a + b, 0);
  const avg = sum / validAverages.length;
  return Math.round(avg * 100) / 100;
};

export const getGradeColor = (grade: string): string => {
  if (!grade) return "text-gray-400";
  const num = parseFloat(grade);
  if (isNaN(num)) return "text-gray-400";
  if (num >= 4.5) return "text-emerald-600";
  if (num >= 3.5) return "text-blue-600";
  if (num >= 2.5) return "text-amber-600";
  return "text-red-600";
};

export const formatAverage = (value: number): string => {
  return value > 0 ? value.toFixed(2) : "—";
};

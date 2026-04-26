// src/utils/gradesUtils.ts

import type { Subject, Semester, Year } from "../types";

/**
 * Generates a unique identifier combining timestamp and random string.
 * Timestamp prefix ensures chronological ordering when needed.
 *
 * @returns A unique ID string (e.g., "1714159200000-k4f8x2m")
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Normalizes and validates a grade input value.
 * Preserves user's decimal input while enforcing the 2.0 - 5.0 range.
 *
 * @param value - Raw grade input string
 * @returns Cleaned and validated grade string
 *
 * @example
 * normalizeGrade("4.5")   // → "4.5"
 * normalizeGrade("5.5")   // → "5"   (clamped to max)
 * normalizeGrade("1.5")   // → "2"   (clamped to min)
 * normalizeGrade("abc")   // → ""    (invalid)
 * normalizeGrade("4.5.3") // → "4.5" (single decimal)
 */
export const normalizeGrade = (value: string): string => {
  if (value === "" || value === null || value === undefined) return "";

  // Remove any invalid characters except numbers and decimal point
  let cleaned = value.replace(/[^0-9.]/g, "");

  // Ensure only one decimal point (keep the first one)
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  // Parse as float to validate range
  const num = parseFloat(cleaned);
  if (isNaN(num)) return "";

  // Clamp to valid range: 2.0 - 5.0
  if (num < 2) return "2";
  if (num > 5) return "5";

  // Preserve the exact user input format (with decimals)
  return cleaned;
};

/**
 * Calculates the average grade for a single semester.
 * Only includes subjects with valid numeric grades.
 *
 * @param subjects - Array of subjects in the semester
 * @returns The semester average rounded to 2 decimal places, or 0 if no valid grades
 */
export const calculateSemesterAverage = (subjects: Subject[]): number => {
  const validGrades = subjects
    .filter((s) => s.grade !== "" && !isNaN(parseFloat(s.grade)))
    .map((s) => parseFloat(s.grade));

  if (validGrades.length === 0) return 0;

  const sum = validGrades.reduce((a, b) => a + b, 0);
  const avg = sum / validGrades.length;
  return Math.round(avg * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculates the average grade for an entire academic year.
 * Averages all semester averages that have valid grades.
 *
 * @param semesters - Array of semesters in the year
 * @returns The year average rounded to 2 decimal places, or 0 if no valid grades
 */
export const calculateYearAverage = (semesters: Semester[]): number => {
  const averages = semesters.map((s) => calculateSemesterAverage(s.subjects));
  const validAverages = averages.filter((a) => a > 0);

  if (validAverages.length === 0) return 0;

  const sum = validAverages.reduce((a, b) => a + b, 0);
  const avg = sum / validAverages.length;
  return Math.round(avg * 100) / 100;
};

/**
 * Calculates the final average across all academic years.
 * Averages all year averages that have valid grades.
 *
 * @param years - Array of academic years
 * @returns The final average rounded to 2 decimal places, or 0 if no valid grades
 */
export const calculateFinalAverage = (years: Year[]): number => {
  const yearAverages = years.map((y) => calculateYearAverage(y.semesters));
  const validAverages = yearAverages.filter((a) => a > 0);

  if (validAverages.length === 0) return 0;

  const sum = validAverages.reduce((a, b) => a + b, 0);
  const avg = sum / validAverages.length;
  return Math.round(avg * 100) / 100;
};

/**
 * Returns Tailwind CSS color classes based on grade value.
 * Uses a 2.0 - 5.0 grading scale with appropriate color coding.
 *
 * @param grade - The grade string to evaluate
 * @returns Tailwind CSS color classes for text styling
 *
 * Grade color scale:
 * - 4.5 - 5.0: Emerald (excellent)
 * - 3.5 - 4.4: Blue (very good)
 * - 2.5 - 3.4: Amber (good/passing)
 * - 2.0 - 2.4: Red (minimum passing)
 * - Invalid: Gray (no grade/missing)
 */
export const getGradeColor = (grade: string): string => {
  // Return neutral color if no grade entered
  if (!grade) return "text-gray-400";

  const num = parseFloat(grade);

  // Invalid number
  if (isNaN(num)) return "text-gray-400";

  // Color scale based on grade value (2.0 - 5.0 range)
  if (num >= 4.5) return "text-emerald-600 font-semibold";
  if (num >= 3.5) return "text-blue-600";
  if (num >= 2.5) return "text-amber-600";
  return "text-red-600";
};

/**
 * Formats a numeric average for display purposes.
 * Returns "—" if the average is 0 (no valid grades).
 *
 * @param value - The average value to format
 * @returns Formatted string with two decimal places or em dash
 */
export const formatAverage = (value: number): string => {
  return value > 0 ? value.toFixed(2) : "—";
};

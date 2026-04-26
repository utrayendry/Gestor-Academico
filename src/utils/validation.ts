// src/utils/validation.ts

/**
 * Validates and cleans a grade input value.
 * Ensures the grade is within the valid range of 2.0 to 5.0.
 * 
 * @param value - Raw input string from the grade field
 * @returns Cleaned and validated grade string
 * 
 
 */
export const validateGrade = (value: string): string => {
  // Remove any non-numeric characters except decimal point
  let cleaned = value.replace(/[^0-9.]/g, "");

  // Prevent multiple decimal points (keep only the first one)
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  // Prevent multiple leading zeros (e.g., "00" → "0")
  if (cleaned.startsWith("00")) {
    cleaned = "0" + cleaned.slice(2);
  }

  // Parse to number for range validation
  const num = parseFloat(cleaned);

  if (!isNaN(num)) {
    // Enforce maximum grade of 5.0
    if (num > 5.0) {
      return "5.0";
    }

    // Enforce minimum grade of 2.0 (only if user has typed enough)
    if (cleaned.length >= 3 && num < 2.0) {
      return "2.0";
    }
  }

  return cleaned;
};

/**
 * Checks if a grade value is valid (within 2.0 - 5.0 range).
 * Used for visual feedback before submission.
 * 
 * @param value - The grade string to check
 * @returns True if the grade is valid or empty (not yet typed)
 * 
 
 */
export const isValidGrade = (value: string): boolean => {
  // Empty is valid (user hasn't typed yet)
  if (value === "") return true;

  // Parse to number
  const num = parseFloat(value);

  // Must be a valid number
  if (isNaN(num)) return false;

  // Must be within range
  return num >= 2.0 && num <= 5.0;
};

/** Minimum allowed grade value */
export const MIN_GRADE = 2.0;

/** Maximum allowed grade value */
export const MAX_GRADE = 5.0;

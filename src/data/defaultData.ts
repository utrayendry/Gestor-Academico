// src/data/defaultData.ts
import type { Year } from "../types";
import { generateId } from "../utils/gradesUtils";

/**
 * Default academic data structure
 * Contains predefined subjects for each semester of each year
 */
export const defaultData: Year[] = [
  {
    id: generateId(),
    number: 1,
    semesters: [
      {
        id: generateId(),
        number: 1,
        subjects: [
          { id: generateId(), name: "Mathematics I", grade: "" },
          { id: generateId(), name: "Introduction to Programming", grade: "" },
          { id: generateId(), name: "Logic", grade: "" },
          { id: generateId(), name: "Computer Fundamentals", grade: "" },
          { id: generateId(), name: "Philosophy", grade: "" },
          { id: generateId(), name: "Physical Education", grade: "" },
        ],
      },
      {
        id: generateId(),
        number: 2,
        subjects: [
          { id: generateId(), name: "Design and OOP", grade: "" },
          { id: generateId(), name: "Interface Design", grade: "" },
          { id: generateId(), name: "Physics", grade: "" },
          { id: generateId(), name: "Computational Mathematics", grade: "" },
          { id: generateId(), name: "Calculus II", grade: "" },
          { id: generateId(), name: "Cuban History", grade: "" },
        ],
      },
    ],
  },
  {
    id: generateId(),
    number: 2,
    semesters: [
      {
        id: generateId(),
        number: 1,
        subjects: [
          { id: generateId(), name: "Data Structures", grade: "" },
          { id: generateId(), name: "Algorithms", grade: "" },
          { id: generateId(), name: "Database Fundamentals", grade: "" },
          { id: generateId(), name: "Operating Systems", grade: "" },
          { id: generateId(), name: "Software Engineering I", grade: "" },
        ],
      },
      {
        id: generateId(),
        number: 2,
        subjects: [
          { id: generateId(), name: "Web Development", grade: "" },
          { id: generateId(), name: "Mobile Development", grade: "" },
          { id: generateId(), name: "Computer Networks", grade: "" },
          { id: generateId(), name: "Software Engineering II", grade: "" },
          { id: generateId(), name: "Research Methods", grade: "" },
        ],
      },
    ],
  },
];

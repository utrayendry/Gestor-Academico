// src/types/index.ts

// Student information
export interface Student {
  id: string;
  fullName: string;
  email?: string;
  studentId?: string;
}

// Career/Program information
export interface Career {
  id: string;
  name: string;
  institution: string;
  startYear: number;
  expectedEndYear: number;
}

export interface Subject {
  id: string;
  name: string;
  grade: string;
  credits?: number;
  status?: "pending" | "approved" | "failed";
}

export interface Semester {
  id: string;
  number: number;
  subjects: Subject[];
}

export interface Year {
  id: string;
  number: number;
  semesters: Semester[];
}

export interface AppState {
  student: Student | null;
  career: Career | null;
  years: Year[];
  selectedYearId: string | null;
  isLoading: boolean;
}

export type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STUDENT"; payload: Student }
  | { type: "UPDATE_STUDENT"; payload: Partial<Student> }
  | { type: "SET_CAREER"; payload: Career }
  | { type: "UPDATE_CAREER"; payload: Partial<Career> }
  | { type: "ADD_YEAR" }
  | { type: "DELETE_YEAR"; payload: string }
  | { type: "SELECT_YEAR"; payload: string }
  | { type: "ADD_SEMESTER"; payload: string }
  | { type: "DELETE_SEMESTER"; payload: { yearId: string; semesterId: string } }
  | { type: "ADD_SUBJECT"; payload: { yearId: string; semesterId: string } }
  | {
      type: "DELETE_SUBJECT";
      payload: { yearId: string; semesterId: string; subjectId: string };
    }
  | {
      type: "UPDATE_SUBJECT_NAME";
      payload: {
        yearId: string;
        semesterId: string;
        subjectId: string;
        name: string;
      };
    }
  | {
      type: "UPDATE_SUBJECT_GRADE";
      payload: {
        yearId: string;
        semesterId: string;
        subjectId: string;
        grade: string;
      };
    }
  | {
      type: "LOAD_DATA";
      payload: {
        student: Student | null;
        career: Career | null;
        years: Year[];
      };
    }
  | { type: "RESET_DATA" };

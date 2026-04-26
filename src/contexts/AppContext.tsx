// src/contexts/AppContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { AppState, AppAction, Year, Career, Student } from "../types";
import { generateId, normalizeGrade } from "../utils/gradesUtils";

const STORAGE_KEY = "grade-manager-data";

// Initial application state
const initialState: AppState = {
  student: null,
  career: null,
  years: [],
  selectedYearId: null,
  isLoading: true,
};

// Main state reducer handling all app actions
const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_STUDENT":
      return { ...state, student: action.payload };

    case "UPDATE_STUDENT":
      return {
        ...state,
        student: state.student ? { ...state.student, ...action.payload } : null,
      };

    case "SET_CAREER":
      return { ...state, career: action.payload };

    case "UPDATE_CAREER":
      return {
        ...state,
        career: state.career ? { ...state.career, ...action.payload } : null,
      };

    // Create new academic year with two default semesters
    case "ADD_YEAR": {
      const newNumber = state.years.length + 1;
      const newYear: Year = {
        id: generateId(),
        number: newNumber,
        semesters: [
          { id: generateId(), number: 1, subjects: [] },
          { id: generateId(), number: 2, subjects: [] },
        ],
      };
      return {
        ...state,
        years: [...state.years, newYear],
        selectedYearId: newYear.id,
      };
    }

    // Remove a year and reassign selection if needed
    case "DELETE_YEAR": {
      // Filter out the deleted year first to work with updated array
      const filteredYears = state.years.filter((y) => y.id !== action.payload);
      const isDeletingSelected = state.selectedYearId === action.payload;

      return {
        ...state,
        years: filteredYears,
        // Determine new selection based on filtered years
        selectedYearId: isDeletingSelected
          ? filteredYears.length > 0
            ? filteredYears[0].id
            : null
          : state.selectedYearId,
      };
    }

    case "SELECT_YEAR":
      return { ...state, selectedYearId: action.payload };

    // Add semester to a year (max 2 allowed)
    case "ADD_SEMESTER": {
      const year = state.years.find((y) => y.id === action.payload);
      if (!year || year.semesters.length >= 2) return state;

      return {
        ...state,
        years: state.years.map((y) =>
          y.id === action.payload
            ? {
                ...y,
                semesters: [
                  ...y.semesters,
                  {
                    id: generateId(),
                    number: y.semesters.length + 1,
                    subjects: [],
                  },
                ],
              }
            : y,
        ),
      };
    }

    // Remove a semester from a year
    case "DELETE_SEMESTER": {
      return {
        ...state,
        years: state.years.map((y) =>
          y.id === action.payload.yearId
            ? {
                ...y,
                semesters: y.semesters.filter(
                  (s) => s.id !== action.payload.semesterId,
                ),
              }
            : y,
        ),
      };
    }

    // Add new subject to a semester with default Spanish name
    case "ADD_SUBJECT": {
      return {
        ...state,
        years: state.years.map((y) =>
          y.id === action.payload.yearId
            ? {
                ...y,
                semesters: y.semesters.map((s) =>
                  s.id === action.payload.semesterId
                    ? {
                        ...s,
                        subjects: [
                          ...s.subjects,
                          {
                            id: generateId(),
                            name: "Nueva Materia",
                            grade: "",
                          },
                        ],
                      }
                    : s,
                ),
              }
            : y,
        ),
      };
    }

    // Delete a subject from a semester
    case "DELETE_SUBJECT": {
      return {
        ...state,
        years: state.years.map((y) =>
          y.id === action.payload.yearId
            ? {
                ...y,
                semesters: y.semesters.map((s) =>
                  s.id === action.payload.semesterId
                    ? {
                        ...s,
                        subjects: s.subjects.filter(
                          (sub) => sub.id !== action.payload.subjectId,
                        ),
                      }
                    : s,
                ),
              }
            : y,
        ),
      };
    }

    // Update subject display name
    case "UPDATE_SUBJECT_NAME": {
      return {
        ...state,
        years: state.years.map((y) =>
          y.id === action.payload.yearId
            ? {
                ...y,
                semesters: y.semesters.map((s) =>
                  s.id === action.payload.semesterId
                    ? {
                        ...s,
                        subjects: s.subjects.map((sub) =>
                          sub.id === action.payload.subjectId
                            ? { ...sub, name: action.payload.name }
                            : sub,
                        ),
                      }
                    : s,
                ),
              }
            : y,
        ),
      };
    }

    // Update subject grade value with validation (2.0 - 5.0 range)
    case "UPDATE_SUBJECT_GRADE": {
      // Normalize and validate grade before storing
      const validatedGrade = normalizeGrade(action.payload.grade);

      return {
        ...state,
        years: state.years.map((y) =>
          y.id === action.payload.yearId
            ? {
                ...y,
                semesters: y.semesters.map((s) =>
                  s.id === action.payload.semesterId
                    ? {
                        ...s,
                        subjects: s.subjects.map((sub) =>
                          sub.id === action.payload.subjectId
                            ? { ...sub, grade: validatedGrade }
                            : sub,
                        ),
                      }
                    : s,
                ),
              }
            : y,
        ),
      };
    }

    // Load persisted data from localStorage
    case "LOAD_DATA":
      return {
        student: action.payload.student || null,
        career: action.payload.career || null,
        years: Array.isArray(action.payload.years) ? action.payload.years : [],
        selectedYearId:
          action.payload.years && action.payload.years.length > 0
            ? action.payload.years[0].id
            : null,
        isLoading: false,
      };

    // Reset all data to initial state
    case "RESET_DATA":
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Context value interface with all available actions
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Student actions
  setStudent: (student: Student) => void;
  updateStudent: (data: Partial<Student>) => void;
  // Career actions
  setCareer: (career: Career) => void;
  updateCareer: (data: Partial<Career>) => void;
  // Year actions
  addYear: () => void;
  deleteYear: (id: string) => void;
  selectYear: (id: string) => void;
  addSemester: (yearId: string) => void;
  addSubject: (yearId: string, semesterId: string) => void;
  deleteSubject: (
    yearId: string,
    semesterId: string,
    subjectId: string,
  ) => void;
  updateSubjectName: (
    yearId: string,
    semesterId: string,
    subjectId: string,
    name: string,
  ) => void;
  updateSubjectGrade: (
    yearId: string,
    semesterId: string,
    subjectId: string,
    grade: string,
  ) => void;
  // Data persistence
  saveToStorage: () => void;
  resetToDefault: () => void;
}

// Create context with null initial value
const AppContext = createContext<AppContextValue | null>(null);

// Provider component wrapping the entire application
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Ref to access latest state without dependencies
  const stateRef = useRef(state);

  // Keep ref synchronized with current state
  useEffect(() => {
    stateRef.current = state;
  });

  // Load persisted data from localStorage on initial mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate data structure integrity
        const validYears = Array.isArray(parsed.years) ? parsed.years : [];
        const validStudent =
          parsed.student && typeof parsed.student === "object"
            ? parsed.student
            : null;
        const validCareer =
          parsed.career && typeof parsed.career === "object"
            ? parsed.career
            : null;

        dispatch({
          type: "LOAD_DATA",
          payload: {
            student: validStudent,
            career: validCareer,
            years: validYears,
          },
        });
      } catch (error) {
        console.error("Failed to parse stored data:", error);
        // Remove corrupted data from storage
        localStorage.removeItem(STORAGE_KEY);
        dispatch({
          type: "LOAD_DATA",
          payload: { student: null, career: null, years: [] },
        });
      }
    } else {
      dispatch({
        type: "LOAD_DATA",
        payload: { student: null, career: null, years: [] },
      });
    }
  }, []);

  // Persist state to localStorage on every data change
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          student: state.student,
          career: state.career,
          years: state.years,
        }),
      );
    }
  }, [state.student, state.career, state.years, state.isLoading]);

  // Memoized action creators to prevent unnecessary re-renders
  const setStudent = useCallback(
    (student: Student) => dispatch({ type: "SET_STUDENT", payload: student }),
    [],
  );

  const updateStudent = useCallback(
    (data: Partial<Student>) =>
      dispatch({ type: "UPDATE_STUDENT", payload: data }),
    [],
  );

  const setCareer = useCallback(
    (career: Career) => dispatch({ type: "SET_CAREER", payload: career }),
    [],
  );

  const updateCareer = useCallback(
    (data: Partial<Career>) =>
      dispatch({ type: "UPDATE_CAREER", payload: data }),
    [],
  );

  const addYear = useCallback(() => dispatch({ type: "ADD_YEAR" }), []);

  const deleteYear = useCallback(
    (id: string) => dispatch({ type: "DELETE_YEAR", payload: id }),
    [],
  );

  const selectYear = useCallback(
    (id: string) => dispatch({ type: "SELECT_YEAR", payload: id }),
    [],
  );

  const addSemester = useCallback(
    (yearId: string) => dispatch({ type: "ADD_SEMESTER", payload: yearId }),
    [],
  );

  const addSubject = useCallback(
    (yearId: string, semesterId: string) =>
      dispatch({ type: "ADD_SUBJECT", payload: { yearId, semesterId } }),
    [],
  );

  const deleteSubject = useCallback(
    (yearId: string, semesterId: string, subjectId: string) =>
      dispatch({
        type: "DELETE_SUBJECT",
        payload: { yearId, semesterId, subjectId },
      }),
    [],
  );

  const updateSubjectName = useCallback(
    (yearId: string, semesterId: string, subjectId: string, name: string) =>
      dispatch({
        type: "UPDATE_SUBJECT_NAME",
        payload: { yearId, semesterId, subjectId, name },
      }),
    [],
  );

  const updateSubjectGrade = useCallback(
    (yearId: string, semesterId: string, subjectId: string, grade: string) =>
      dispatch({
        type: "UPDATE_SUBJECT_GRADE",
        payload: { yearId, semesterId, subjectId, grade },
      }),
    [],
  );

  // Stable save function using ref to avoid dependencies
  // This prevents child components from re-rendering when state changes
  const saveToStorage = useCallback(() => {
    const { student, career, years } = stateRef.current;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ student, career, years }),
    );
    alert("¡Datos guardados exitosamente!");
  }, []);

  // Reset all data with confirmation in Spanish
  const resetToDefault = useCallback(() => {
    if (confirm("¿Estás seguro? Esto borrará todos tus datos.")) {
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "RESET_DATA" });
      alert("Datos restablecidos correctamente.");
    }
  }, []);

  // Combine all values for the context provider
  const value: AppContextValue = {
    state,
    dispatch,
    setStudent,
    updateStudent,
    setCareer,
    updateCareer,
    addYear,
    deleteYear,
    selectYear,
    addSemester,
    addSubject,
    deleteSubject,
    updateSubjectName,
    updateSubjectGrade,
    saveToStorage,
    resetToDefault,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to access app context with error handling
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

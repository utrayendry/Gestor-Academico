// src/contexts/AppContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type { AppState, AppAction, Year, Career, Student } from "../types";
import { generateId } from "../utils/gradesUtils";

const STORAGE_KEY = "grade-manager-data";

const initialState: AppState = {
  student: null,
  career: null,
  years: [],
  selectedYearId: null,
  isLoading: true,
};

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

    case "DELETE_YEAR":
      return {
        ...state,
        years: state.years.filter((y) => y.id !== action.payload),
        selectedYearId:
          state.selectedYearId === action.payload && state.years.length > 0
            ? state.years[0].id
            : state.selectedYearId,
      };

    case "SELECT_YEAR":
      return { ...state, selectedYearId: action.payload };

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
                          { id: generateId(), name: "New Subject", grade: "" },
                        ],
                      }
                    : s,
                ),
              }
            : y,
        ),
      };
    }

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

    case "UPDATE_SUBJECT_GRADE": {
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
                            ? { ...sub, grade: action.payload.grade }
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

    case "RESET_DATA":
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
};

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

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Validate data structure
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
        // Clear corrupted data
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

  // Save to localStorage whenever data changes
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

  // Action creators
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
  const saveToStorage = useCallback(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        student: state.student,
        career: state.career,
        years: state.years,
      }),
    );
    alert("Data saved successfully!");
  }, [state.student, state.career, state.years]);
  const resetToDefault = useCallback(() => {
    if (confirm("Are you sure? This will erase all your data.")) {
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "RESET_DATA" });
      alert("Data reset.");
    }
  }, []);

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

// Main hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};


export enum ProblemType {
  DIRECT = "DIRECT",
  PROPERTY = "PROPERTY",
  BASE_CHANGE = "BASE_CHANGE",
  FRACTION = "FRACTION",
  SIMPLIFICATION = "SIMPLIFICATION",
  EQUATION = "EQUATION",
  APPROXIMATION = "APPROXIMATION"
}

export interface Problem {
  id: string;
  type: ProblemType;
  typeName: string;
  question: string;
  correctAnswer: string;
  explanation: string;
}

export interface UserSubmission {
  problemId: string;
  userAnswer: string;
  isCorrect: boolean | null;
  timestamp: number;
  type: ProblemType;
  // Added fields for history review
  question?: string;
  correctAnswer?: string;
}

export interface TypeStats {
  type: ProblemType;
  correct: number;
  total: number;
}

export interface UserPerformance {
  stats: Record<ProblemType, TypeStats>;
  weakTypes: ProblemType[];
}

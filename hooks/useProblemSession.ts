
import { useState, useCallback, useMemo } from 'react';
import { Problem, ProblemType, UserPerformance, UserSubmission } from '../types';
import { GeminiMathService } from '../services/geminiService';

export const useProblemSession = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, UserSubmission>>({});
  const [isLoading, setIsLoading] = useState(false);

  const startNewSession = useCallback(async (
    types: ProblemType[], 
    count: number, 
    perf: UserPerformance
  ) => {
    setIsLoading(true);
    setSubmissions({});
    try {
      const newProblems = await GeminiMathService.generateProblems(types, count, perf);
      setProblems(newProblems);
    } catch (error) {
      console.error("Session start failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSessionSubmission = useCallback((problemId: string, submission: UserSubmission) => {
    setSubmissions(prev => ({ ...prev, [problemId]: submission }));
  }, []);

  // Fix: Ensure useMemo is imported from 'react'
  const sessionProgress = useMemo(() => ({
    total: problems.length,
    answered: Object.keys(submissions).length,
    correct: Object.values(submissions).filter(s => s.isCorrect).length,
    isComplete: problems.length > 0 && Object.keys(submissions).length === problems.length
  }), [problems, submissions]);

  return {
    problems,
    submissions,
    isLoading,
    startNewSession,
    addSessionSubmission,
    sessionProgress
  };
};

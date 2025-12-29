
import { useState, useCallback, useMemo } from 'react';
import { Problem, ProblemType, UserSubmission, UserPerformance } from '../types';
import { HistoryService } from '../services/historyService';

export const usePerformance = () => {
  const [performance, setPerformance] = useState<UserPerformance>(HistoryService.getPerformance());

  const recordSubmission = useCallback((problem: Problem, userAnswer: string, isCorrect: boolean) => {
    const submission: UserSubmission = {
      problemId: problem.id,
      userAnswer,
      isCorrect,
      timestamp: Date.now(),
      type: problem.type,
      question: problem.question,
      correctAnswer: problem.correctAnswer
    };

    HistoryService.saveSubmission(submission);
    setPerformance(HistoryService.getPerformance());
  }, []);

  const clearHistory = useCallback(() => {
    HistoryService.clearHistory();
    setPerformance(HistoryService.getPerformance());
  }, []);

  const allSubmissions = useMemo(() => HistoryService.getHistory(), [performance]);

  return {
    performance,
    allSubmissions,
    recordSubmission,
    clearHistory
  };
};


import { ProblemType, UserSubmission, UserPerformance, TypeStats } from "../types";

const STORAGE_KEY = "log_master_history";

export class HistoryService {
  static saveSubmission(submission: UserSubmission): void {
    const history = this.getHistory();
    history.push(submission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  static getHistory(): UserSubmission[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static getPerformance(): UserPerformance {
    const history = this.getHistory();
    const stats: Record<string, TypeStats> = {};

    // Initialize stats
    Object.values(ProblemType).forEach(type => {
      stats[type] = { type, correct: 0, total: 0 };
    });

    // Aggregate data
    history.forEach(sub => {
      if (stats[sub.type]) {
        stats[sub.type].total++;
        if (sub.isCorrect) stats[sub.type].correct++;
      }
    });

    // Identify weak types (success rate < 70% and at least 2 attempts, or 0 attempts)
    const weakTypes = Object.values(ProblemType).filter(type => {
      const s = stats[type];
      if (s.total === 0) return true; // Never tried is a potential weakness
      return (s.correct / s.total) < 0.7;
    });

    return { 
      stats: stats as Record<ProblemType, TypeStats>, 
      weakTypes 
    };
  }
}

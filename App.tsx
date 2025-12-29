
import React, { useState, useCallback } from 'react';
import { ProblemType, UserSubmission } from './types';
import { usePerformance } from './hooks/usePerformance';
import { useProblemSession } from './hooks/useProblemSession';
import { GradingService } from './utils/grading';
import ProblemCard from './components/ProblemCard';
import HistoryModal from './components/HistoryModal';
import StatsDashboard from './components/StatsDashboard';

const App: React.FC = () => {
  const { performance, allSubmissions, recordSubmission, clearHistory } = usePerformance();
  const { problems, submissions, isLoading, startNewSession, addSessionSubmission, sessionProgress } = useProblemSession();
  
  const [selectedTypes, setSelectedTypes] = useState<ProblemType[]>(Object.values(ProblemType));
  const [problemCount, setProblemCount] = useState(3);
  const [viewingTypeHistory, setViewingTypeHistory] = useState<ProblemType | null>(null);

  const handleGenerate = async () => {
    try {
      await startNewSession(selectedTypes, problemCount, performance);
    } catch (e) {
      alert("문제를 생성하는 중 오류가 발생했습니다.");
    }
  };

  const handleAnswerSubmit = (problemId: string, userAnswer: string) => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;

    const isCorrect = GradingService.compare(userAnswer, problem.correctAnswer);
    
    // 데이터 보관용 (전체 히스토리)
    recordSubmission(problem, userAnswer, isCorrect);
    
    // 현재 세션 상태 업데이트용
    const submission: UserSubmission = {
      problemId, userAnswer, isCorrect, timestamp: Date.now(), type: problem.type
    };
    addSessionSubmission(problemId, submission);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">로그 마스터</h1>
          </div>
          <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-red-500 transition-colors">기록 초기화</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <StatsDashboard performance={performance} onTypeClick={setViewingTypeHistory} />
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">문제 유형</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(ProblemType).map(type => (
                  <label key={type} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedTypes.includes(type)}
                      onChange={() => setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-sm font-medium text-slate-700">{(type as any).toLowerCase().replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading || selectedTypes.length === 0}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-100"
            >
              {isLoading ? '생성 중...' : '맞춤 문제 생성'}
            </button>
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-6">
          {problems.length === 0 && !isLoading ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl h-64 flex flex-col items-center justify-center text-slate-400">
              <p>유형을 선택하고 문제를 생성해 보세요.</p>
            </div>
          ) : (
            problems.map(p => (
              <ProblemCard key={p.id} problem={p} result={submissions[p.id]} onAnswerSubmit={(ans) => handleAnswerSubmit(p.id, ans)} />
            ))
          )}
        </div>
      </main>

      {viewingTypeHistory && (
        <HistoryModal type={viewingTypeHistory} submissions={allSubmissions} onClose={() => setViewingTypeHistory(null)} />
      )}
    </div>
  );
};

export default App;

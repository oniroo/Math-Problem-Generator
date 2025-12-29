
import React, { useState, memo } from 'react';
import { Problem } from '../types';
import MathRenderer from './MathRenderer';

interface ProblemCardProps {
  problem: Problem;
  onAnswerSubmit: (answer: string) => void;
  result: { isCorrect: boolean | null; userAnswer: string } | undefined;
}

/**
 * 답변 입력을 담당하는 하위 컴포넌트입니다.
 * 이 컴포넌트의 상태 변화는 부모인 ProblemCard의 수식 영역에 영향을 주지 않습니다.
 */
const AnswerInputForm = memo(({ onSubmit }: { onSubmit: (answer: string) => void }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="답을 입력하세요"
        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        제출
      </button>
    </form>
  );
});

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onAnswerSubmit, result }) => {
  const isGraded = result && result.isCorrect !== null;

  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 bg-white shadow-sm ${
      isGraded ? (result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-slate-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 rounded-full">
          {problem.typeName}
        </span>
        {isGraded && (
          <span className={`text-sm font-bold ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {result.isCorrect ? '✓ 정답' : '✗ 오답'}
          </span>
        )}
      </div>

      <div className="mb-6">
        {/* 질문 영역: AnswerInputForm의 상태 변화에 의해 리렌더링되지 않음 */}
        <MathRenderer 
          content={problem.question} 
          className="text-lg font-medium text-slate-800 leading-relaxed" 
        />
      </div>

      {!isGraded ? (
        <AnswerInputForm onSubmit={onAnswerSubmit} />
      ) : (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="text-sm text-slate-600">
            <span className="font-bold">내 답:</span> {result.userAnswer}
          </div>
          <div className="p-4 bg-white/60 rounded-lg border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">풀이 과정</h4>
            <MathRenderer content={problem.explanation} className="text-slate-700 text-sm leading-relaxed" />
            <div className="mt-2 text-sm font-bold text-slate-800">
              정답: <MathRenderer content={`$${problem.correctAnswer}$`} className="inline-block" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ProblemCard);

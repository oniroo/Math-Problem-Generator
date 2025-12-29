
import React, { memo } from 'react';
import { ProblemType, UserSubmission } from '../types';
import { PROBLEM_TYPE_LABELS } from '../constants';
import MathRenderer from './MathRenderer';

interface HistoryModalProps {
  type: ProblemType;
  submissions: UserSubmission[];
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ type, submissions, onClose }) => {
  const filteredSubmissions = submissions
    .filter(s => s.type === type)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {PROBLEM_TYPE_LABELS[type]} 기록
            </h2>
            <p className="text-xs text-slate-500">최근 시도 순으로 표시됩니다.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>아직 이 유형의 문제 풀이 기록이 없습니다.</p>
            </div>
          ) : (
            filteredSubmissions.map((sub, idx) => (
              <div 
                key={`${sub.problemId}-${idx}`} 
                className={`p-4 rounded-2xl border ${sub.isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(sub.timestamp).toLocaleString()}
                  </span>
                  <span className={`text-xs font-bold ${sub.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {sub.isCorrect ? '정답' : '오답'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <MathRenderer 
                    content={sub.question || "질문 정보를 불러올 수 없습니다."} 
                    className="text-slate-800 text-sm font-medium" 
                  />
                </div>

                <div className="flex gap-4 text-xs">
                  <div className="flex-1">
                    <span className="text-slate-400 block mb-0.5">내 답변</span>
                    <span className={`font-mono font-bold ${sub.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {sub.userAnswer}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-400 block mb-0.5">실제 정답</span>
                    <span className="font-mono font-bold text-slate-800">
                      {sub.correctAnswer || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(HistoryModal);

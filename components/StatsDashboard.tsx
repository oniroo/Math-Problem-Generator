
import React from 'react';
import { ProblemType, UserPerformance } from '../types';
import { PROBLEM_TYPE_LABELS } from '../constants';

interface StatsDashboardProps {
  performance: UserPerformance;
  onTypeClick: (type: ProblemType) => void;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ performance, onTypeClick }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-4 bg-green-500 rounded-sm"></span>
          학습 성취도
        </div>
        <span className="text-[10px] text-slate-400 font-normal">상세 이력 보기</span>
      </h3>
      <div className="space-y-4">
        {Object.values(ProblemType).map(type => {
          const stat = performance.stats[type];
          const percentage = stat.total === 0 ? 0 : Math.round((stat.correct / stat.total) * 100);
          const isWeak = performance.weakTypes.includes(type);
          
          return (
            <button 
              key={type} 
              onClick={() => onTypeClick(type)}
              className="w-full text-left space-y-1 group hover:bg-slate-50 p-2 -m-2 rounded-xl transition-colors"
            >
              <div className="flex justify-between text-[11px] font-bold">
                <span className={`${isWeak ? "text-red-600" : "text-slate-600"} group-hover:text-blue-600`}>
                  {PROBLEM_TYPE_LABELS[type]} {isWeak && "⚠️"}
                </span>
                <span className="text-slate-400">{stat.correct}/{stat.total} ({percentage}%)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(StatsDashboard);

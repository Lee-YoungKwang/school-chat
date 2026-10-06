'use client';

import React from 'react';
import { Ranking } from '@/types';
import { Trophy, Flame, X, RefreshCw } from 'lucide-react';

interface RankingBoardProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: Ranking[];
  onRefresh: () => void;
  isLoading: boolean;
}

export const RankingBoard: React.FC<RankingBoardProps> = ({
  isOpen,
  onClose,
  rankings,
  onRefresh,
  isLoading,
}) => {
  if (!isOpen) return null;

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <span className="text-2xl">🥇</span>;
      case 1:
        return <span className="text-2xl">🥈</span>;
      case 2:
        return <span className="text-2xl">🥉</span>;
      default:
        return (
          <span className="w-7 h-7 rounded-full clay-badge bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-extrabold text-xs text-slate-700 dark:text-slate-300">
            {index + 1}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg clay-card glass-panel border border-white/60 dark:border-white/15 p-6 sm:p-8 max-h-[85vh] flex flex-col shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 pr-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl clay-btn bg-amber-500 text-white flex items-center justify-center shadow-md text-2xl">
              🏆
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white">
                명예의 전당 랭킹보드
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                학교 상식 퀴즈 최고 득점자 명단 (Supabase Seoul 실시간 연동)
              </p>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between py-2 border-b border-slate-200/80 dark:border-slate-800 mb-3 shrink-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            전체 랭킹 TOP 10
          </span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-bold clay-btn bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>

        {/* Rankings List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {rankings.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-bold">아직 등록된 랭킹 기록이 없습니다.</p>
              <p className="text-xs mt-1">퀴즈를 풀고 1위에 도전해보세요!</p>
            </div>
          ) : (
            rankings.map((r, idx) => (
              <div
                key={r.id || idx}
                className={`p-3.5 rounded-2xl clay-card flex items-center justify-between gap-3 transition-all ${
                  idx === 0
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60'
                    : idx === 1
                    ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700'
                    : idx === 2
                    ? 'bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60'
                    : 'bg-white/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 flex items-center justify-center">
                    {getRankBadge(idx)}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <span>{r.nickname}</span>
                      {idx === 0 && <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(r.played_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    {r.score.toLocaleString()}점
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 mt-3 text-center shrink-0">
          <p className="text-[11px] text-slate-400 font-semibold">
            ✨ 상록중학교 상식 퀴즈 참여 점수가 실시간으로 반영됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

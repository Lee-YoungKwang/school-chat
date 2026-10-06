'use client';

import React from 'react';
import { Ranking } from '@/types';
import { Trophy, Medal, Flame, X, RefreshCw } from 'lucide-react';

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
        return <span className="text-xl">🥇</span>;
      case 1:
        return <span className="text-xl">🥈</span>;
      case 2:
        return <span className="text-xl">🥉</span>;
      default:
        return <span className="font-black text-slate-700 text-sm">{index + 1}위</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-3 border-black dark:border-white rounded-3xl p-6 sm:p-8 shadow-brutal-lg max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white hover:bg-slate-200 shadow-brutal-sm"
        >
          <X className="w-5 h-5 text-black dark:text-white" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neo-yellow border-3 border-black flex items-center justify-center shadow-brutal text-2xl">
              🏆
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">
                명예의 전당 랭킹보드
              </h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                학교 상식 퀴즈 최고 점수 랭킹 (Supabase rankings 연동)
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            title="새로고침"
            className="neo-btn p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white text-black dark:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* List */}
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 scrollbar-thin">
          {rankings.length === 0 ? (
            <div className="text-center py-10 font-bold text-slate-400">
              아직 등록된 랭킹 점수가 없습니다. 첫 주자가 되어 보세요!
            </div>
          ) : (
            rankings.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-3.5 rounded-2xl border-2 border-black dark:border-white flex items-center justify-between shadow-brutal-sm ${
                  idx === 0
                    ? 'bg-clay-yellow text-black font-black'
                    : idx === 1
                    ? 'bg-clay-blue text-black font-black'
                    : idx === 2
                    ? 'bg-clay-mint text-black font-black'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 flex items-center justify-center">
                    {getRankBadge(idx)}
                  </div>
                  <div>
                    <div className="text-sm font-black flex items-center gap-1.5">
                      <span>{item.nickname}</span>
                      {idx === 0 && <Flame className="w-4 h-4 text-rose-500 animate-bounce" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.played_at ? String(item.played_at).slice(0, 16) : '최근 기록'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
                    {item.score.toLocaleString()}점
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t-2 border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="neo-btn px-6 py-2.5 bg-black text-white rounded-2xl font-black text-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { UserRole } from '@/types';
import { Sun, Moon, Sparkles, Shield, User, Trophy, Globe } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenQuiz: () => void;
  onOpenRanking: () => void;
  activePostCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onChangeRole,
  isDark,
  onToggleDark,
  onOpenQuiz,
  onOpenRanking,
  activePostCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b-3 px-4 py-3 sm:px-8 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & School Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-neo-yellow border-3 border-black flex items-center justify-center shadow-brutal text-2xl font-black rotate-[-2deg] hover:rotate-0 transition-transform">
            🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                학교 대화 사이트
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-bold bg-neo-pink text-white rounded-md border-2 border-black shadow-[2px_2px_0px_#000]">
                v1.0 LIVE
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
              <span>교직원 & 학생 통합 소통 플랫폼</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                ⚡ Seoul (icn1) 통일 최적화
              </span>
            </p>
          </div>
        </div>

        {/* Center / Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* Quiz Game Button */}
          <button
            onClick={onOpenQuiz}
            className="neo-btn px-3 py-1.5 bg-clay-mint rounded-xl text-xs sm:text-sm flex items-center gap-1.5 font-black text-black hover:bg-emerald-300"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>학교 퀴즈 게임</span>
          </button>

          {/* Ranking Board Button */}
          <button
            onClick={onOpenRanking}
            className="neo-btn px-3 py-1.5 bg-clay-yellow rounded-xl text-xs sm:text-sm flex items-center gap-1.5 font-black text-black hover:bg-amber-300"
          >
            <Trophy className="w-4 h-4 text-amber-700" />
            <span>명예의 전당</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border-2 border-black dark:border-white shadow-brutal-sm">
            <button
              onClick={() => onChangeRole('student')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                currentRole === 'student'
                  ? 'bg-neo-blue text-white shadow-brutal-sm border-2 border-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-black'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              학생
            </button>
            <button
              onClick={() => onChangeRole('teacher')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                currentRole === 'teacher'
                  ? 'bg-neo-pink text-white shadow-brutal-sm border-2 border-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-black'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              교직원
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            aria-label="Toggle Theme"
            className="neo-btn p-2 bg-white dark:bg-slate-800 text-black dark:text-white rounded-xl flex items-center justify-center hover:bg-slate-100"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>
        </div>
      </div>
    </header>
  );
};

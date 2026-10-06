'use client';

import React from 'react';
import { User, UserRole } from '@/types';
import { 
  Sun, Moon, Sparkles, Trophy, LogIn, LogOut, 
  Crown, School, GraduationCap, ShieldCheck, UserCheck 
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onOpenAuth: (tab?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenAdminModal: () => void;
  pendingCount: number;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenQuiz: () => void;
  onOpenRanking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdminModal,
  pendingCount,
  isDark,
  onToggleDark,
  onOpenQuiz,
  onOpenRanking,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/60 dark:border-white/10 px-4 py-3 sm:px-8 mb-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & School Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-3xl clay-card bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-md text-2xl">
            🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                학교 대화 사이트
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-extrabold clay-badge bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Glass & Clay
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>교직원 & 학생 전용 소통 플랫폼</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                ⚡ Seoul (icn1) 통일
              </span>
            </p>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Quiz Game Button */}
          <button
            onClick={onOpenQuiz}
            className="clay-btn px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>학교 퀴즈 게임</span>
          </button>

          {/* Ranking Board Button */}
          <button
            onClick={onOpenRanking}
            className="clay-btn px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>명예의 전당</span>
          </button>

          {/* Admin Approval Button (Visible if user is admin) */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenAdminModal}
              className="clay-btn px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-md relative animate-pulse"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>👑 가입 승인 관리</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-sm">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl clay-card bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold clay-badge ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                      : currentUser.role === 'teacher'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                      : 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
                  }`}>
                    {currentUser.role === 'admin' ? '👑 관리자' : currentUser.role === 'teacher' ? '🏫 교직원' : '🎒 학생'}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    {currentUser.name}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {currentUser.role === 'student' && `${currentUser.grade || 2}학년 ${currentUser.class_num || 3}반`}
                  {currentUser.role === 'teacher' && `${currentUser.position || '교사'}`}
                  {currentUser.role === 'admin' && '최고관리자 (승인권한)'}
                </div>
              </div>

              <button
                onClick={onLogout}
                title="로그아웃"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="clay-btn px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>로그인</span>
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="clay-btn px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold text-slate-700"
              >
                <span>회원가입</span>
              </button>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            aria-label="Toggle Theme"
            className="clay-btn p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};

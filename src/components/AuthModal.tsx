'use client';

import React, { useState } from 'react';
import { User, UserRole } from '@/types';
import { X, User as UserIcon, Lock, GraduationCap, School, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialTab?: 'login' | 'signup';
  onOpenChangeCredentials?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login',
  onOpenChangeCredentials,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [signupRole, setSignupRole] = useState<'student' | 'teacher'>('student');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  // Student fields
  const [grade, setGrade] = useState('2');
  const [classNum, setClassNum] = useState('3');
  const [studentNum, setStudentNum] = useState('15');
  // Teacher fields
  const [department, setDepartment] = useState('2학년부');
  const [position, setPosition] = useState('교사 / 국어');
  const [bio, setBio] = useState('');

  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.message || data.error || '로그인에 실패했습니다.');
        return;
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setLoginError('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Signup Submit
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccessMsg(null);

    if (password !== passwordConfirm) {
      setSignupError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 4) {
      setSignupError('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    setSignupLoading(true);

    try {
      const payload: any = {
        name: name.trim(),
        username: username.trim(),
        password: password.trim(),
        role: signupRole,
        bio: bio.trim(),
      };

      if (signupRole === 'student') {
        payload.grade = Number(grade);
        payload.class_num = Number(classNum);
        payload.student_num = Number(studentNum);
      } else {
        payload.department = department.trim();
        payload.position = position.trim();
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSignupError(data.error || '회원가입에 실패했습니다.');
        return;
      }

      setSignupSuccessMsg(data.message);
      // Reset form
      setName('');
      setUsername('');
      setPassword('');
      setPasswordConfirm('');
      setBio('');
    } catch (err: any) {
      setSignupError('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg clay-card glass-panel overflow-hidden border border-white/60 dark:border-white/15 p-6 md:p-8 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 clay-btn bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-md">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                학교 대화 사이트
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                글래스모피즘 & 클레이모피즘 소통 플랫폼
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons (Login vs Signup) */}
        <div className="grid grid-cols-2 gap-2 my-5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
            }}
            className={`py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'login'
                ? 'clay-btn bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            🔑 로그인
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setSignupError(null);
              setSignupSuccessMsg(null);
            }}
            className={`py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'signup'
                ? 'clay-btn bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            ✨ 회원가입
          </button>
        </div>

        {/* ========================================================
            TAB 1: LOGIN
            ======================================================== */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs leading-relaxed animate-fade-in">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                아이디 (Username)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="아이디를 입력하세요"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm clay-input text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                비밀번호 (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="비밀번호를 입력하세요"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm clay-input text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 clay-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {loginLoading ? '로그인 처리 중...' : '로그인'}
            </button>

            {onOpenChangeCredentials && (
              <div className="pt-3 text-center border-t border-slate-200/60 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChangeCredentials();
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline inline-flex items-center gap-1.5 transition"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>아이디 또는 비밀번호를 변경하시겠습니까?</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* ========================================================
            TAB 2: SIGNUP (Separate Student & Teacher with Admin Approval)
            ======================================================== */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Approval Info Banner */}
            <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start gap-2.5 text-xs text-indigo-800 dark:text-indigo-200">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="font-bold">관리자(나) 승인제 안내:</span> 본 사이트는 신뢰할 수 있는 학교 커뮤니티 조성을 위해 학생과 교직원 가입 후 <strong>관리자(나)의 승인</strong>을 거쳐야 최종 로그인이 가능합니다.
              </div>
            </div>

            {signupSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5 text-emerald-800 dark:text-emerald-200 text-xs leading-relaxed animate-fade-in">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                <div>
                  <div className="font-bold mb-1">{signupSuccessMsg}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setSignupSuccessMsg(null);
                    }}
                    className="underline text-indigo-600 dark:text-indigo-400 font-bold hover:opacity-80"
                  >
                    로그인 창으로 이동하여 상태 확인하기
                  </button>
                </div>
              </div>
            )}

            {signupError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{signupError}</span>
              </div>
            )}

            {/* Role Switcher Pill */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                회원 구분 선택
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSignupRole('student')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                    signupRole === 'student'
                      ? 'clay-btn bg-sky-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  🎒 중학생 가입
                </button>
                <button
                  type="button"
                  onClick={() => setSignupRole('teacher')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                    signupRole === 'teacher'
                      ? 'clay-btn bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  <School className="w-4 h-4" />
                  🏫 교직원 가입
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  이름 (실명)
                </label>
                <input
                  type="text"
                  required
                  placeholder={signupRole === 'student' ? '예: 홍길동' : '예: 김선생'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm clay-input text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  아이디
                </label>
                <input
                  type="text"
                  required
                  placeholder="영문, 숫자 조합"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm clay-input text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  required
                  placeholder="4자리 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm clay-input text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  required
                  placeholder="비밀번호 재입력"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm clay-input text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Student Specific Fields */}
            {signupRole === 'student' && (
              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-3">
                <div className="text-xs font-extrabold text-sky-800 dark:text-sky-300 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  학생 학적 정보
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">학년</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs clay-input text-slate-800 dark:text-white"
                    >
                      <option value="1">1학년</option>
                      <option value="2">2학년</option>
                      <option value="3">3학년</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">반</label>
                    <select
                      value={classNum}
                      onChange={(e) => setClassNum(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs clay-input text-slate-800 dark:text-white"
                    >
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1)}>{i + 1}반</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">번호</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={studentNum}
                      onChange={(e) => setStudentNum(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs clay-input text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Teacher Specific Fields */}
            {signupRole === 'teacher' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
                <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <School className="w-3.5 h-3.5" />
                  교직원 직무 정보
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">담당 부서 / 학년</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 2학년부, 학생안전부"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs clay-input text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">직책 / 교과목</label>
                    <input
                      type="text"
                      required
                      placeholder="예: 2-3 담임교사 / 국어"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs clay-input text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                한 줄 소개 / 가입 신청 메시지 (선택)
              </label>
              <input
                type="text"
                placeholder={signupRole === 'student' ? '친구들에게 전하고 싶은 말' : '관리자 승인 참고용 메모'}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 text-xs clay-input text-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={signupLoading}
              className="w-full py-3 clay-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {signupLoading ? '신청서 제출 중...' : '가입 신청서 제출 (관리자 승인 대기)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

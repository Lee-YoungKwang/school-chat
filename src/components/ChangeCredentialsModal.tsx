'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { X, KeyRound, Lock, User as UserIcon, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ChangeCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSuccess: (updatedUser: User) => void;
}

export const ChangeCredentialsModal: React.FC<ChangeCredentialsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      if (currentUser) {
        setCurrentUsername(currentUser.username);
        setNewUsername(currentUser.username);
      } else {
        setCurrentUsername('');
        setNewUsername('');
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!currentUsername.trim()) {
      setError('현재 아이디를 입력해 주세요.');
      return;
    }

    if (!currentPassword.trim()) {
      setError('현재 비밀번호를 입력해 주세요.');
      return;
    }

    if (newPassword && newPassword !== newPasswordConfirm) {
      setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setError('새 비밀번호는 4자리 이상으로 설정해 주세요.');
      return;
    }

    if (!newPassword && newUsername.trim() === currentUsername.trim()) {
      setError('변경할 새 아이디 또는 새 비밀번호를 입력해 주세요.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername: currentUsername.trim(),
          currentPassword: currentPassword.trim(),
          newUsername: newUsername.trim() !== currentUsername.trim() ? newUsername.trim() : undefined,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '아이디/비밀번호 변경에 실패했습니다.');
        return;
      }

      setSuccessMsg('✅ 아이디 및 비밀번호가 성공적으로 변경되었습니다!');
      if (data.user) {
        onSuccess(data.user);
      }

      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      setError('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md clay-card glass-panel overflow-hidden border border-white/60 dark:border-white/15 p-6 sm:p-7 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 clay-btn bg-gradient-to-tr from-amber-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                아이디 & 비밀번호 변경
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                보안을 위해 현재 비밀번호 인증 후 변경됩니다
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs leading-relaxed animate-fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs leading-relaxed animate-fade-in">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Current Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              현재 아이디 (Username)
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={currentUsername}
                onChange={(e) => setCurrentUsername(e.target.value)}
                placeholder="현재 로그인 아이디 (예: admin)"
                className="w-full pl-10 pr-4 py-2.5 text-sm clay-input text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              현재 비밀번호 (본인 확인)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 사용 중인 비밀번호"
                className="w-full pl-10 pr-4 py-2.5 text-sm clay-input text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              변경할 신규 정보 입력
            </span>
          </div>

          {/* New Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
              <span>새 아이디 (선택)</span>
              <span className="text-[10px] text-slate-400 font-normal">미입력 시 기존 아이디 유지</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="변경할 새 아이디 (미입력 시 유지)"
                className="w-full pl-10 pr-4 py-2.5 text-sm clay-input text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between">
              <span>새 비밀번호 (선택)</span>
              <span className="text-[10px] text-slate-400 font-normal">최소 4자리 이상</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="변경할 새 비밀번호"
                className="w-full pl-10 pr-4 py-2.5 text-sm clay-input text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Confirm New Password */}
          {newPassword.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                새 비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  className="w-full pl-10 pr-4 py-2.5 text-sm clay-input text-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 clay-btn bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl transition shadow-lg flex items-center justify-center gap-2 mt-3 text-sm"
          >
            {loading ? '변경 중...' : '💾 아이디 & 비밀번호 변경 완료'}
          </button>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X } from 'lucide-react';

interface TeacherVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherVerifyModal: React.FC<TeacherVerifyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verification check (default school teacher master key: 7777 or TEACHER)
    if (pin.trim() === '7777' || pin.trim().toUpperCase() === 'TEACHER') {
      setErrorMsg('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('교직원 인증 번호가 올바르지 않습니다. (안내: 시연용 교직원 키는 7777 입니다)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-clay-pink text-slate-900 border-3 border-black rounded-3xl p-6 shadow-brutal-lg animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white border-2 border-black hover:bg-slate-100 shadow-brutal-sm"
        >
          <X className="w-4 h-4 text-black" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white border-3 border-black flex items-center justify-center shadow-brutal">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-black">
              교직원 전용 공간 접근 인증
            </h3>
            <p className="text-xs font-bold text-slate-700">
              학생은 입장할 수 없는 비공개 교무 업무 공간입니다.
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 mb-4 rounded-xl bg-white/90 border-2 border-black text-xs font-semibold text-slate-800 flex items-start gap-2 shadow-brutal-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-black">교직원 보안 안내</p>
            <p>교무 회의록, 평가계획 등 중요 공람이 포함되어 있어 인증 코드가 필요합니다.</p>
            <p className="text-[11px] text-pink-700 font-black mt-1">
              🔑 시연용 인증 코드: <span className="bg-pink-100 px-1 py-0.5 rounded border border-pink-400">7777</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-black mb-1">
              교직원 인증 코드 입력
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="인증 코드 4자리 (7777)"
              autoFocus
              className="w-full px-4 py-3 rounded-2xl border-3 border-black text-lg font-black tracking-widest text-center bg-white shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-100 border-2 border-red-600 text-xs font-black text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn flex-1 py-3 bg-white text-black rounded-2xl font-black text-sm"
            >
              취소
            </button>
            <button
              type="submit"
              className="neo-btn flex-1 py-3 bg-neo-yellow text-black rounded-2xl font-black text-sm hover:bg-yellow-400"
            >
              인증 후 입장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

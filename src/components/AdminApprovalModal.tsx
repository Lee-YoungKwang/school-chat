'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '@/types';
import { 
  X, Check, Ban, ShieldCheck, GraduationCap, School, Clock, 
  Trash2, RefreshCw, Crown, AlertTriangle, Users 
} from 'lucide-react';

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserApproved?: () => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserApproved,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error('Fetch users error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsersList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (userId: string, newStatus: UserStatus) => {
    setActionLoadingId(userId);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        setFeedbackMsg({
          text: newStatus === 'approved' ? '✅ 성공적으로 승인되었습니다! 해당 사용자가 즉시 로그인할 수 있습니다.' : '❌ 가입 신청이 반려되었습니다.',
          type: 'success'
        });
        if (onUserApproved) onUserApproved();
      } else {
        setFeedbackMsg({ text: '상태 변경 중 오류가 발생했습니다.', type: 'error' });
      }
    } catch (e) {
      setFeedbackMsg({ text: '네트워크 연결 오류', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setFeedbackMsg({ text: '권한이 성공적으로 변경되었습니다.', type: 'success' });
      }
    } catch (e) {
      setFeedbackMsg({ text: '권한 변경 실패', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('정말 이 사용자를 삭제하시겠습니까?')) return;
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setFeedbackMsg({ text: '사용자가 삭제되었습니다.', type: 'success' });
      }
    } catch (e) {
      setFeedbackMsg({ text: '삭제 실패', type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingUsers = users.filter(u => u.status === 'pending');
  const approvedUsers = users.filter(u => u.status === 'approved');
  const teacherCount = users.filter(u => u.role === 'teacher').length;
  const studentCount = users.filter(u => u.role === 'student').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl clay-card glass-panel overflow-hidden border border-white/60 dark:border-white/15 p-6 md:p-8 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 clay-btn bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-md">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
                  👑 관리자(나) 승인 대시보드
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold clay-badge bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                  최고 관리자 권한
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                학생 및 교직원 회원가입 신청 심사 및 계정 승인/반려 관리
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchUsersList}
              title="새로고침"
              disabled={loading}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className={`mt-3 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shrink-0 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}>
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-4 gap-2.5 my-4 shrink-0">
          <div className="p-3 rounded-2xl clay-card bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-center">
            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> 대기 중
            </div>
            <div className="text-xl font-extrabold text-amber-900 dark:text-amber-200 mt-0.5">
              {pendingUsers.length}건
            </div>
          </div>

          <div className="p-3 rounded-2xl clay-card bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1">
              <Check className="w-3 h-3" /> 승인 완료
            </div>
            <div className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5">
              {approvedUsers.length}명
            </div>
          </div>

          <div className="p-3 rounded-2xl clay-card bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1">
              <School className="w-3 h-3" /> 교직원
            </div>
            <div className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5">
              {teacherCount}명
            </div>
          </div>

          <div className="p-3 rounded-2xl clay-card bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 text-center">
            <div className="text-[11px] font-bold text-sky-700 dark:text-sky-400 flex items-center justify-center gap-1">
              <GraduationCap className="w-3 h-3" /> 학생
            </div>
            <div className="text-xl font-extrabold text-sky-900 dark:text-sky-200 mt-0.5">
              {studentCount}명
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'clay-btn bg-amber-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            승인 대기 신청 ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'clay-btn bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            전체 회원 관리 ({users.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3">
          {activeTab === 'pending' && (
            <>
              {pendingUsers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-2 opacity-50 text-emerald-500" />
                  <p className="font-bold">현재 승인 대기 중인 가입 신청이 없습니다.</p>
                  <p className="text-xs mt-1">모든 회원가입 신청이 처리되었습니다.</p>
                </div>
              ) : (
                pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 rounded-2xl clay-card bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold clay-badge ${
                          user.role === 'teacher'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        }`}>
                          {user.role === 'teacher' ? '🏫 교직원 신청' : '🎒 중학생 신청'}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                          {user.name}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">@{user.username}</span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap gap-x-3 gap-y-1">
                        {user.role === 'student' ? (
                          <>
                            <span className="font-semibold text-sky-700 dark:text-sky-400">
                              {user.grade}학년 {user.class_num}반 {user.student_num}번
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                              {user.department} · {user.position}
                            </span>
                          </>
                        )}
                        {user.bio && (
                          <span className="text-slate-500 dark:text-slate-400 italic">
                            &quot;{user.bio}&quot;
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400">
                        신청 일시: {new Date(user.created_at).toLocaleString('ko-KR')}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(user.id, 'approved')}
                        disabled={actionLoadingId === user.id}
                        className="px-4 py-2 clay-btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        즉시 승인
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(user.id, 'rejected')}
                        disabled={actionLoadingId === user.id}
                        className="px-3 py-2 clay-btn bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        반려
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'all' && (
            <div className="space-y-2.5">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-3.5 rounded-2xl clay-card bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold clay-badge ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : user.role === 'teacher'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                      }`}>
                        {user.role === 'admin' ? '👑 관리자' : user.role === 'teacher' ? '🏫 교직원' : '🎒 학생'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : user.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {user.status === 'approved' ? '승인됨' : user.status === 'pending' ? '승인대기' : '반려됨'}
                      </span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">
                        {user.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">@{user.username}</span>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {user.role === 'student' && `${user.grade || '-'}학년 ${user.class_num || '-'}반 ${user.student_num || '-'}번`}
                      {user.role === 'teacher' && `${user.department || '-'} / ${user.position || '-'}`}
                      {user.role === 'admin' && '시스템 총괄 관리자'}
                    </div>
                  </div>

                  {/* Actions */}
                  {user.username !== 'admin' && (
                    <div className="flex items-center gap-2 shrink-0">
                      {user.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(user.id, 'approved')}
                          className="px-2.5 py-1 text-xs font-bold clay-btn bg-emerald-600 text-white rounded-lg"
                        >
                          승인
                        </button>
                      )}
                      {user.status === 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(user.id, 'pending')}
                          className="px-2.5 py-1 text-xs font-bold clay-btn bg-amber-500 text-white rounded-lg"
                        >
                          대기로 변경
                        </button>
                      )}
                      {/* Role Toggle */}
                      <button
                        onClick={() => handleUpdateRole(user.id, user.role === 'teacher' ? 'student' : 'teacher')}
                        className="px-2.5 py-1 text-xs font-bold clay-btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                      >
                        {user.role === 'teacher' ? '학생으로 변경' : '교직원으로 승격'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                        title="회원 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

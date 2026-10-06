'use client';

import React, { useState } from 'react';
import { ChannelId, UserRole, User } from '@/types';
import { CHANNELS } from '@/data/mockData';
import { X, Send, PenTool, Sparkles, Shield, AlertCircle } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChannel: ChannelId | 'all';
  currentUser: User | null;
  onSubmitPost: (post: {
    channel: ChannelId;
    title: string;
    content: string;
    author: string;
    role: UserRole;
    tag?: string;
  }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  defaultChannel,
  currentUser,
  onSubmitPost,
}) => {
  const initialChannel: ChannelId = 
    defaultChannel !== 'all' ? defaultChannel : 'free-talk';

  const [channel, setChannel] = useState<ChannelId>(initialChannel);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const authorName = currentUser?.name || '익명 작성자';
  const authorRole: UserRole = currentUser?.role || 'student';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !content.trim()) {
      setErrorMsg('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    if (channel === 'teacher-lounge' && authorRole !== 'teacher' && authorRole !== 'admin') {
      setErrorMsg('교직원 전용 채널에는 교직원 또는 관리자만 글을 작성할 수 있습니다.');
      return;
    }

    onSubmitPost({
      channel,
      title: title.trim(),
      content: content.trim(),
      author: authorName,
      role: authorRole,
      tag: tag.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg clay-card glass-panel overflow-hidden border border-white/60 dark:border-white/15 p-6 md:p-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl clay-btn bg-indigo-500 text-white flex items-center justify-center shadow-md">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                새 게시글 작성
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                학교 공동체와 함께 나누고 싶은 이야기를 적어주세요.
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

        {/* Error Alert */}
        {errorMsg && (
          <div className="my-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Author Badge Preview */}
          <div className="p-3 rounded-2xl clay-card bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">작성자 정보</span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold clay-badge ${
                authorRole === 'admin'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : authorRole === 'teacher'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
              }`}>
                {authorRole === 'admin' ? '👑 관리자' : authorRole === 'teacher' ? '🏫 교직원' : '🎒 학생'}
              </span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                {authorName}
              </span>
            </div>
          </div>

          {/* Channel Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              게시 채널
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as ChannelId)}
              className="w-full px-3.5 py-2.5 text-xs clay-input text-slate-800 dark:text-white font-bold"
            >
              {CHANNELS.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} {ch.staffOnly ? '(교직원 전용)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              글 제목
            </label>
            <input
              type="text"
              required
              placeholder="제목을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm clay-input text-slate-800 dark:text-white font-bold"
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              해시태그 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 급식자랑, 축제, 분실물"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-3.5 py-2 text-xs clay-input text-slate-800 dark:text-white"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              내용
            </label>
            <textarea
              required
              rows={5}
              placeholder="서로를 배려하는 따뜻한 학교 대화 문화를 만들어가요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs clay-input text-slate-800 dark:text-white leading-relaxed resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 clay-btn bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>게시글 등록하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { ChannelId, UserRole } from '@/types';
import { CHANNELS } from '@/data/mockData';
import { X, Send, PenTool, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChannel: ChannelId | 'all';
  currentRole: UserRole;
  isTeacherAuthenticated: boolean;
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
  currentRole,
  isTeacherAuthenticated,
  onSubmitPost,
}) => {
  const initialChannel: ChannelId = 
    defaultChannel !== 'all' ? defaultChannel : 'free-talk';

  const [channel, setChannel] = useState<ChannelId>(initialChannel);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(
    currentRole === 'teacher' ? '교직원 박선생님' : '2학년 학생'
  );
  const [tag, setTag] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) {
      setErrorMsg('제목, 내용, 작성자명을 모두 입력해 주세요!');
      return;
    }

    if (channel === 'teacher-lounge' && !isTeacherAuthenticated) {
      setErrorMsg('교직원 전용 공간에는 인증된 교직원만 글을 작성할 수 있습니다.');
      return;
    }

    onSubmitPost({
      channel,
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      role: currentRole,
      tag: tag.trim() || undefined,
    });

    setTitle('');
    setContent('');
    setTag('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-3 border-black dark:border-white rounded-3xl p-6 sm:p-8 shadow-brutal-lg max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 dark:bg-slate-850 border-2 border-black dark:border-white hover:bg-slate-200 shadow-brutal-sm text-black dark:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-neo-yellow border-3 border-black flex items-center justify-center shadow-brutal text-2xl">
            ✍️
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black">
              새 글 / 방명록 작성하기
            </h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              학교 친구들 및 교직원과 소중한 생각과 소식을 나누어 보세요.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 border-2 border-red-600 text-xs font-black text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Select */}
          <div>
            <label className="block text-xs font-black mb-1.5">
              게시할 장소 (채널 선택)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHANNELS.map((ch) => {
                const isSelected = channel === ch.id;
                const isDisabled = ch.staffOnly && !isTeacherAuthenticated;
                return (
                  <button
                    type="button"
                    key={ch.id}
                    disabled={isDisabled}
                    onClick={() => setChannel(ch.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-black border-2 border-black flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-neo-blue text-white shadow-brutal-sm'
                        : isDisabled
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-dashed'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <span>{ch.name}</span>
                    {ch.staffOnly && <span className="text-[10px]">🔒</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Author & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black mb-1">
                작성자 닉네임
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="예: 2-3 반장 홍길동"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 text-sm font-bold shadow-brutal-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black mb-1">
                태그 (선택)
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="예: 급식자랑, 축제, 알림"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 text-sm font-bold shadow-brutal-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-black mb-1">
              글 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해 주세요"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 text-sm font-bold shadow-brutal-sm focus:outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-black mb-1">
              본문 내용
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="학교 친구들과 나눌 이야기를 자유롭게 적어보세요..."
              className="w-full px-3 py-2.5 rounded-xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 text-sm font-medium shadow-brutal-sm focus:outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-black dark:text-white rounded-2xl font-black text-sm"
            >
              닫기
            </button>
            <button
              type="submit"
              className="neo-btn flex-1 py-3 bg-neo-green text-black rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-400"
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

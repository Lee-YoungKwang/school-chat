'use client';

import React, { useState } from 'react';
import { Post, UserRole, User } from '@/types';
import { CHANNELS } from '@/data/mockData';
import { Heart, MessageCircle, Send, Shield, User as UserIcon, Clock, Tag, Crown } from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onLike: (id: string) => void;
  onAddComment: (postId: string, content: string, author: string, role: UserRole) => void;
  onRequireAuth: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLike,
  onAddComment,
  onRequireAuth,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLikedAnim, setIsLikedAnim] = useState(false);

  const channelObj = CHANNELS.find((c) => c.id === post.channel);

  const handleLikeClick = () => {
    setIsLikedAnim(true);
    setTimeout(() => setIsLikedAnim(false), 500);
    onLike(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (!commentText.trim()) return;

    onAddComment(
      post.id,
      commentText.trim(),
      currentUser.name,
      currentUser.role
    );
    setCommentText('');
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      if (diffMin < 1) return '방금 전';
      if (diffMin < 60) return `${diffMin}분 전`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}시간 전`;
      return `${d.getMonth() + 1}월 ${d.getDate()}일`;
    } catch {
      return '최근';
    }
  };

  return (
    <article className="clay-card glass-panel p-5 sm:p-6 mb-5 transition-all duration-300">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Channel Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-extrabold clay-badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
            {channelObj?.name || post.channel}
          </span>

          {/* Tag */}
          {post.tag && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold clay-badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Tag className="w-3 h-3 text-pink-500" />
              <span>#{post.tag}</span>
            </span>
          )}

          {post.isStaffOnly && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold clay-badge bg-rose-500 text-white shadow-sm">
              🔒 교직원 전용
            </span>
          )}
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>

      {/* Post Title */}
      <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mb-2 leading-snug">
        {post.title}
      </h2>

      {/* Post Content */}
      <p className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </p>

      {/* Author & Actions Bar */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Author badge */}
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl clay-card flex items-center justify-center font-bold text-xs shadow-sm ${
            post.role === 'admin'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              : post.role === 'teacher'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
          }`}>
            {post.role === 'admin' ? (
              <Crown className="w-4 h-4 text-amber-600" />
            ) : post.role === 'teacher' ? (
              <Shield className="w-4 h-4 text-emerald-600" />
            ) : (
              <UserIcon className="w-4 h-4 text-sky-600" />
            )}
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>{post.author}</span>
              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full clay-badge ${
                post.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : post.role === 'teacher' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
              }`}>
                {post.role === 'admin' ? '관리자' : post.role === 'teacher' ? '교직원' : '학생'}
              </span>
            </div>
          </div>
        </div>

        {/* Like & Comments count buttons */}
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className={`clay-btn px-3.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 ${
              isLikedAnim ? 'scale-110 text-rose-500' : ''
            }`}
          >
            <Heart className={`w-4 h-4 ${post.likes > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
            <span>{post.likes}</span>
          </button>

          {/* Comments Toggle Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="clay-btn px-3.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50"
          >
            <MessageCircle className="w-4 h-4 text-indigo-500" />
            <span>덧글 {post.comments ? post.comments.length : 0}</span>
          </button>
        </div>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 animate-fade-in">
          <div className="space-y-2 mb-3">
            {(!post.comments || post.comments.length === 0) ? (
              <p className="text-xs font-semibold text-slate-400 py-3 text-center">
                첫 번째 덧글을 남겨보세요! ✨
              </p>
            ) : (
              post.comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3 rounded-2xl clay-card bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                        {comm.author}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full clay-badge ${
                        comm.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : comm.role === 'teacher'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                      }`}>
                        {comm.role === 'admin' ? '관리자' : comm.role === 'teacher' ? '교직원' : '학생'}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">
                        {formatDate(comm.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {comm.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder={
                currentUser 
                  ? `${currentUser.name}님으로 덧글 작성...` 
                  : '덧글을 작성하려면 로그인이 필요합니다.'
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onClick={() => {
                if (!currentUser) onRequireAuth();
              }}
              className="flex-1 px-4 py-2 text-xs clay-input text-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="clay-btn px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>등록</span>
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

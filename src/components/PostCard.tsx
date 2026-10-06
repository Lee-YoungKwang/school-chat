'use client';

import React, { useState } from 'react';
import { Post, UserRole } from '@/types';
import { CHANNELS } from '@/data/mockData';
import { Heart, MessageCircle, Send, Shield, User, Clock, Tag } from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentRole: UserRole;
  onLike: (id: string) => void;
  onAddComment: (postId: string, content: string, author: string, role: UserRole) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentRole,
  onLike,
  onAddComment,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState(
    currentRole === 'teacher' ? '교직원' : '재학생'
  );
  const [isLikedAnim, setIsLikedAnim] = useState(false);

  const channelObj = CHANNELS.find((c) => c.id === post.channel);

  const handleLikeClick = () => {
    setIsLikedAnim(true);
    setTimeout(() => setIsLikedAnim(false), 500);
    onLike(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim(), commentAuthor.trim() || '익명', currentRole);
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
    <article className="clay-box glass-panel p-5 sm:p-6 mb-5 transition-all">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Channel Badge */}
          <span className={`px-2.5 py-1 rounded-xl text-xs font-black border-2 border-black shadow-brutal-sm ${channelObj?.color || 'bg-white'}`}>
            {channelObj?.name || post.channel}
          </span>

          {/* Tag */}
          {post.tag && (
            <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-black dark:border-white flex items-center gap-1">
              <Tag className="w-3 h-3 text-neo-pink" />
              <span>#{post.tag}</span>
            </span>
          )}

          {post.isStaffOnly && (
            <span className="px-2 py-0.5 rounded-lg text-[11px] font-black bg-red-500 text-white border border-black">
              🔒 교직원 공람
            </span>
          )}
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>

      {/* Post Title */}
      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 leading-snug">
        {post.title}
      </h2>

      {/* Post Content */}
      <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 mb-4 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </p>

      {/* Author & Actions Bar */}
      <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Author badge */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black text-xs shadow-brutal-sm ${
            post.role === 'teacher' ? 'bg-neo-pink text-white' : 'bg-neo-blue text-white'
          }`}>
            {post.role === 'teacher' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
              <span>{post.author}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                post.role === 'teacher' 
                  ? 'bg-rose-100 text-rose-800 border-rose-300' 
                  : 'bg-blue-100 text-blue-800 border-blue-300'
              }`}>
                {post.role === 'teacher' ? '교직원' : '학생'}
              </span>
            </div>
          </div>
        </div>

        {/* Like & Comments count buttons */}
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className={`neo-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-rose-50 ${
              isLikedAnim ? 'scale-110 text-rose-500' : ''
            }`}
          >
            <Heart className={`w-4 h-4 ${post.likes > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500'}`} />
            <span>{post.likes}</span>
          </button>

          {/* Comments Toggle Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="neo-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-slate-100"
          >
            <MessageCircle className="w-4 h-4 text-sky-500" />
            <span>덧글 {post.comments ? post.comments.length : 0}</span>
          </button>
        </div>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-300 dark:border-slate-700 animate-fade-in">
          <div className="space-y-2 mb-3">
            {(!post.comments || post.comments.length === 0) ? (
              <p className="text-xs font-bold text-slate-400 py-2 text-center">
                첫 번째 덧글을 남겨보세요! ✨
              </p>
            ) : (
              post.comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black mb-0.5">
                      <span className="text-slate-900 dark:text-white">{comm.author}</span>
                      <span className={`text-[9px] font-bold px-1 rounded ${
                        comm.role === 'teacher' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {comm.role === 'teacher' ? '교직원' : '학생'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      {comm.content}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-semibold">
                    {formatDate(comm.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="작성자"
              className="w-20 px-2 py-1.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-slate-900 text-xs font-bold shadow-brutal-sm focus:outline-none"
            />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="따뜻한 덧글을 입력해 주세요..."
              className="flex-1 px-3 py-1.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-slate-900 text-xs font-medium shadow-brutal-sm focus:outline-none"
            />
            <button
              type="submit"
              className="neo-btn px-3 py-1.5 rounded-xl bg-neo-yellow text-black text-xs font-black flex items-center gap-1"
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

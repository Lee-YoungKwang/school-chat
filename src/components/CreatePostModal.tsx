'use client';

import React, { useState, useRef } from 'react';
import { ChannelId, UserRole, User, Attachment } from '@/types';
import { CHANNELS } from '@/data/mockData';
import { 
  X, Send, PenTool, Sparkles, Shield, AlertCircle, 
  Image as ImageIcon, Paperclip, FileText, Trash2, UploadCloud 
} from 'lucide-react';

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
    images?: string[];
    attachments?: Attachment[];
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
  const [images, setImages] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const authorName = currentUser?.name || '익명 작성자';
  const authorRole: UserRole = currentUser?.role || 'student';

  // Handle Photo/Image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImagePromises: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      // Check file size (e.g., max 5MB per image)
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('이미지 파일 크기는 8MB 이하여야 합니다.');
        return;
      }

      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImagePromises.push(promise);
    });

    Promise.all(newImagePromises)
      .then((newImages) => {
        setImages((prev) => [...prev, ...newImages]);
      })
      .finally(() => {
        setUploading(false);
        if (imageInputRef.current) imageInputRef.current.value = '';
      });
  };

  // Handle File selection (PDF, HWP, DOCX, etc.)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newFilePromises: Promise<Attachment>[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg('첨부 파일 크기는 15MB 이하여야 합니다.');
        return;
      }

      const promise = new Promise<Attachment>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            url: reader.result as string,
            size: file.size,
            type: file.type || 'file',
          });
        };
        reader.readAsDataURL(file);
      });
      newFilePromises.push(promise);
    });

    Promise.all(newFilePromises)
      .then((newAtts) => {
        setAttachments((prev) => [...prev, ...newAtts]);
      })
      .finally(() => {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
      images,
      attachments,
    });

    // Reset
    setTitle('');
    setContent('');
    setTag('');
    setImages([]);
    setAttachments([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl clay-card glass-panel overflow-hidden border border-white/60 dark:border-white/15 p-6 md:p-8 max-h-[92vh] overflow-y-auto">
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
                사진과 파일 첨부를 지원하는 학교 소통 공간입니다.
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
              placeholder="예: 급식자랑, 축제, 분실물, 공지사항"
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
              rows={4}
              placeholder="서로를 배려하는 따뜻한 학교 대화 문화를 만들어가요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs clay-input text-slate-800 dark:text-white leading-relaxed resize-none"
            />
          </div>

          {/* Attachments Section: Photos & Files */}
          <div className="p-3.5 rounded-2xl clay-card bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                사진 및 파일 첨부
              </span>

              {/* Upload Trigger Buttons */}
              <div className="flex items-center gap-2">
                {/* Image Upload Input & Button */}
                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="clay-btn px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>사진 추가</span>
                </button>

                {/* File Upload Input & Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.hwp,.hwpx,.txt,.zip,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="clay-btn px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>파일 첨부</span>
                </button>
              </div>
            </div>

            {/* Uploaded Images Preview Thumbnails */}
            {images.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">
                  첨부된 사진 ({images.length}장)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {images.map((imgSrc, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img
                        src={imgSrc}
                        alt={`첨부 이미지 ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full shadow-md opacity-90 hover:opacity-100 hover:scale-110 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Documents List */}
            {attachments.length > 0 && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  첨부된 파일 ({attachments.length}개)
                </span>
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-white truncate">
                        {file.name}
                      </span>
                      {file.size && (
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          ({formatFileSize(file.size)})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 clay-btn bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{uploading ? '파일 처리 중...' : '게시글 등록하기'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

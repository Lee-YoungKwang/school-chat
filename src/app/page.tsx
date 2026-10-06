'use client';

import React, { useState, useEffect } from 'react';
import { ChannelId, UserRole, Post, User, Attachment } from '@/types';
import { CHANNELS, INITIAL_POSTS, INITIAL_USERS } from '@/data/mockData';
import { Header } from '@/components/Header';
import { ChannelNav } from '@/components/ChannelNav';
import { PostCard } from '@/components/PostCard';
import { CreatePostModal } from '@/components/CreatePostModal';
import { TeacherVerifyModal } from '@/components/TeacherVerifyModal';
import { AuthModal } from '@/components/AuthModal';
import { AdminApprovalModal } from '@/components/AdminApprovalModal';
import { ChangeCredentialsModal } from '@/components/ChangeCredentialsModal';
import { SchoolChatbot } from '@/components/SchoolChatbot';
import { 
  PlusCircle, 
  Sparkles, 
  Search, 
  Zap, 
  Database, 
  Crown, 
  School, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  LogIn 
} from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeChannel, setActiveChannel] = useState<ChannelId | 'all'>('all');
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // User Authentication & Admin state
  // Default to the admin account so the user can immediately experience the "관리자(나)" approval features!
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // admin
  const [pendingCount, setPendingCount] = useState(2);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTeacherVerifyOpen, setIsTeacherVerifyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isChangeCredentialsOpen, setIsChangeCredentialsOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load stored user or fetch initial data
  useEffect(() => {
    const savedUser = localStorage.getItem('school_chat_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        // use default admin
      }
    }

    const loadInitialData = async () => {
      try {
        const [resPosts, resUsers] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/admin/users'),
        ]);

        if (resPosts.ok) {
          const data = await resPosts.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          }
        }

        if (resUsers.ok) {
          const uData = await resUsers.json();
          if (Array.isArray(uData)) {
            const pending = uData.filter((u: any) => u.status === 'pending');
            setPendingCount(pending.length);
          }
        }
      } catch (e) {
        console.log('Using local fallback state');
      }
    };
    loadInitialData();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('school_chat_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('school_chat_user');
  };

  const refreshPendingCount = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const uData = await res.json();
        if (Array.isArray(uData)) {
          const pending = uData.filter((u: any) => u.status === 'pending');
          setPendingCount(pending.length);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  // Check Staff Lounge access
  const isStaffAccessAllowed = 
    currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  // Post Actions
  const handleCreatePost = async (newPostData: {
    channel: ChannelId;
    title: string;
    content: string;
    author: string;
    role: UserRole;
    tag?: string;
    images?: string[];
    attachments?: Attachment[];
  }) => {
    const optimisticPost: Post = {
      id: 'local_' + Date.now(),
      ...newPostData,
      images: newPostData.images || [],
      attachments: newPostData.attachments || [],
      created_at: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    setPosts((prev) => [optimisticPost, ...prev]);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostData),
      });
      if (res.ok) {
        const created = await res.json();
        setPosts((prev) => [created, ...prev.filter((p) => p.id !== optimisticPost.id)]);
      }
    } catch (e) {
      console.warn('API error, retained local post');
    }
  };

  const handleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    } catch (e) {
      console.warn('Like API error');
    }
  };

  const handleAddComment = async (
    postId: string,
    content: string,
    author: string,
    role: UserRole
  ) => {
    const newComment = {
      id: 'comm_' + Date.now(),
      author,
      role,
      content,
      created_at: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content, role }),
      });
    } catch (e) {
      console.warn('Comment API error');
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (activeChannel !== 'all' && post.channel !== activeChannel) {
      return false;
    }
    // Protect Teacher Lounge
    if (post.channel === 'teacher-lounge' && !isStaffAccessAllowed) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      const matchTag = post.tag?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchAuthor || matchTag;
    }
    return true;
  });

  const currentChannelObj = CHANNELS.find((c) => c.id === activeChannel);

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Top Header with Glassmorphism & Claymorphism */}
      <Header
        currentUser={currentUser}
        onOpenAuth={(tab) => {
          setAuthTab(tab || 'login');
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenChangeCredentials={() => setIsChangeCredentialsOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        pendingCount={pendingCount}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 w-full flex-1 pt-4">
        {/* Clean Quick Action Bar (Replacing Tall Banner) */}
        <div className="clay-card glass-panel p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border border-white/80 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 clay-btn bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md shrink-0">
              🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white">
                  학교 대화 광장
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full clay-badge bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  실시간 소통
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                학생과 교직원이 함께하는 따뜻하고 안전한 소통 공간입니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="px-3 py-2 rounded-xl clay-btn bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>승인 대기 ({pendingCount}건)</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!currentUser) {
                  setAuthTab('login');
                  setIsAuthOpen(true);
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="px-4 py-2.5 clay-btn bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>새 글 / 방명록 작성 (사진·파일 첨부)</span>
            </button>
          </div>
        </div>

        {/* Channel Navigation */}
        <ChannelNav
          activeChannel={activeChannel}
          onSelectChannel={(ch) => setActiveChannel(ch)}
          isStaffAccessAllowed={isStaffAccessAllowed}
          onRequestStaffAuth={() => {
            if (!currentUser) {
              setAuthTab('login');
              setIsAuthOpen(true);
            } else {
              setIsTeacherVerifyOpen(true);
            }
          }}
        />

        {/* Current Channel Info & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <span>{activeChannel === 'all' ? '전체 피드' : currentChannelObj?.name}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full clay-badge bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                {filteredPosts.length}개의 글
              </span>
            </h3>
            {currentChannelObj?.staffOnly && (
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full clay-badge bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                🔒 교직원 전용
              </span>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목, 내용, 작성자 검색..."
              className="w-full pl-9 pr-3 py-2 text-xs clay-input text-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Posts Feed Grid */}
        {filteredPosts.length === 0 ? (
          <div className="clay-card glass-panel p-12 text-center my-6">
            <div className="text-4xl mb-3">📭</div>
            <h4 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 mb-1">
              아직 등록된 게시물이 없습니다.
            </h4>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
              {searchQuery ? '검색 결과와 일치하는 게시글이 없습니다.' : '이 채널의 첫 번째 이야기 주인공이 되어보세요!'}
            </p>
            <button
              onClick={() => {
                if (!currentUser) {
                  setAuthTab('login');
                  setIsAuthOpen(true);
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="clay-btn px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>첫 글 작성하기</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={handleLike}
                onAddComment={handleAddComment}
                onRequireAuth={() => {
                  setAuthTab('login');
                  setIsAuthOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-30 sm:hidden">
        <button
          onClick={() => {
            if (!currentUser) {
              setAuthTab('login');
              setIsAuthOpen(true);
            } else {
              setIsCreateModalOpen(true);
            }
          }}
          className="clay-btn w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl text-xl font-bold"
        >
          ✏️
        </button>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={authTab}
        onOpenChangeCredentials={() => setIsChangeCredentialsOpen(true)}
      />

      <ChangeCredentialsModal
        isOpen={isChangeCredentialsOpen}
        onClose={() => setIsChangeCredentialsOpen(false)}
        currentUser={currentUser}
        onSuccess={(updatedUser) => {
          if (currentUser && (currentUser.id === updatedUser.id || currentUser.username === updatedUser.username)) {
            setCurrentUser(updatedUser);
            localStorage.setItem('school_chat_user', JSON.stringify(updatedUser));
          }
        }}
      />

      <AdminApprovalModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={currentUser}
        onUserApproved={refreshPendingCount}
      />

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultChannel={activeChannel}
        currentUser={currentUser}
        onSubmitPost={handleCreatePost}
      />

      <TeacherVerifyModal
        isOpen={isTeacherVerifyOpen}
        onClose={() => setIsTeacherVerifyOpen(false)}
        onSuccess={() => {
          setActiveChannel('teacher-lounge');
        }}
      />

      <SchoolChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpen={() => setIsChatbotOpen(true)}
      />
    </div>
  );
}

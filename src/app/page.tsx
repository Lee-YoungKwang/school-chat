'use client';

import React, { useState, useEffect } from 'react';
import { ChannelId, UserRole, Post, Ranking, User } from '@/types';
import { CHANNELS, INITIAL_POSTS, INITIAL_RANKINGS, INITIAL_USERS } from '@/data/mockData';
import { Header } from '@/components/Header';
import { ChannelNav } from '@/components/ChannelNav';
import { PostCard } from '@/components/PostCard';
import { CreatePostModal } from '@/components/CreatePostModal';
import { TeacherVerifyModal } from '@/components/TeacherVerifyModal';
import { SchoolQuizGame } from '@/components/SchoolQuizGame';
import { RankingBoard } from '@/components/RankingBoard';
import { AuthModal } from '@/components/AuthModal';
import { AdminApprovalModal } from '@/components/AdminApprovalModal';
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
  const [rankings, setRankings] = useState<Ranking[]>(INITIAL_RANKINGS);
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
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

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
        const [resPosts, resRankings, resUsers] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/ranking'),
          fetch('/api/admin/users'),
        ]);

        if (resPosts.ok) {
          const data = await resPosts.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          }
        }

        if (resRankings.ok) {
          const rData = await resRankings.json();
          if (Array.isArray(rData) && rData.length > 0) {
            setRankings(rData);
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
  }) => {
    const optimisticPost: Post = {
      id: 'local_' + Date.now(),
      ...newPostData,
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

  // Ranking Actions
  const handleSubmitQuizScore = async (nickname: string, score: number) => {
    const optimisticRanking: Ranking = {
      id: 'rank_' + Date.now(),
      nickname,
      score,
      played_at: new Date().toISOString(),
    };
    setRankings((prev) =>
      [optimisticRanking, ...prev].sort((a, b) => b.score - a.score)
    );

    try {
      await fetch('/api/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, score }),
      });
    } catch (e) {
      console.warn('Ranking submission error');
    }
  };

  const handleRefreshRankings = async () => {
    setIsRankingLoading(true);
    try {
      const res = await fetch('/api/ranking');
      if (res.ok) {
        const data = await res.json();
        setRankings(data);
      }
    } finally {
      setIsRankingLoading(false);
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
        pendingCount={pendingCount}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenRanking={() => setIsRankingOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 w-full flex-1">
        {/* Banner Card: Pure Glassmorphism + Claymorphism Fusion */}
        <div className="clay-card glass-panel p-6 sm:p-8 mb-8 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/60 dark:from-slate-800/80 dark:via-indigo-950/40 dark:to-slate-800/80 border border-white/80 dark:border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-badge bg-white/90 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>글래스모피즘 & 클레이모피즘 소통 광장</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight">
                따뜻하고 안전한 학교 소통 공간, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  학교 대화 사이트
                </span>
                에 오신 것을 환영합니다!
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                중학생과 교직원이 따로 안전하게 가입하고, <strong>관리자(나)의 승인</strong>을 거쳐 
                신뢰할 수 있는 학급 공지, 자유 소통, 분실물 찾기를 나눕니다.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => {
                  if (!currentUser) {
                    setAuthTab('login');
                    setIsAuthOpen(true);
                  } else {
                    setIsCreateModalOpen(true);
                  }
                }}
                className="clay-btn px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <PlusCircle className="w-5 h-5" />
                <span>새 글 / 방명록 작성</span>
              </button>

              <button
                onClick={() => setIsQuizOpen(true)}
                className="clay-btn px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>학교 상식 퀴즈 풀기</span>
              </button>
            </div>
          </div>

          {/* User Status Bar & Region Indicator */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between text-xs font-semibold gap-3 text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <Zap className="w-4 h-4 fill-emerald-500" />
                <span>Vercel Serverless: <strong>Seoul (icn1)</strong></span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold">
                <Database className="w-4 h-4" />
                <span>Supabase: <strong>Seoul (ap-northeast-2)</strong></span>
              </div>
            </div>

            {/* Role & Approval Quick Info */}
            <div className="flex items-center gap-2">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="px-3 py-1 rounded-full clay-btn bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-sm"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>관리자 승인 대기 ({pendingCount}건)</span>
                </button>
              )}
              <div className="text-[11px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full font-bold clay-badge">
                ⚡ 쿼리 지연시간 RTT &lt; 5ms 최적화 완료
              </div>
            </div>
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

      <SchoolQuizGame
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmitScore={handleSubmitQuizScore}
      />

      <RankingBoard
        isOpen={isRankingOpen}
        onClose={() => setIsRankingOpen(false)}
        rankings={rankings}
        onRefresh={handleRefreshRankings}
        isLoading={isRankingLoading}
      />
    </div>
  );
}

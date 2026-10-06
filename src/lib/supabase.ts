import { createClient } from '@supabase/supabase-js';
import { Post, Comment, Ranking, ChannelId } from '@/types';
import { INITIAL_POSTS, INITIAL_RANKINGS } from '@/data/mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local In-Memory Fallback State (when DB is binding or local)
let inMemoryPosts: Post[] = [...INITIAL_POSTS];
let inMemoryRankings: Ranking[] = [...INITIAL_RANKINGS];

export async function fetchPosts(channel?: ChannelId): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (channel) {
        query = query.eq('channel', channel);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          channel: (item.channel as ChannelId) || 'free-talk',
          title: item.title,
          content: item.content,
          author: item.author,
          role: item.role || 'student',
          created_at: item.created_at,
          likes: Number(item.likes || 0),
          comments: Array.isArray(item.comments) ? item.comments : [],
          tag: item.tag || undefined,
          isStaffOnly: item.channel === 'teacher-lounge' || item.is_staff_only,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch error, fallback to local store:', e);
    }
  }

  // Fallback to local memory
  if (channel) {
    return inMemoryPosts.filter(p => p.channel === channel);
  }
  return inMemoryPosts;
}

export async function insertPost(postData: Omit<Post, 'id' | 'created_at' | 'likes' | 'comments'>): Promise<Post> {
  const newPost: Post = {
    id: 'post_' + Date.now(),
    ...postData,
    created_at: new Date().toISOString(),
    likes: 0,
    comments: [],
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('posts').insert([
        {
          title: newPost.title,
          content: newPost.content,
          author: newPost.author,
          channel: newPost.channel,
          role: newPost.role,
          tag: newPost.tag,
          likes: 0,
          created_at: newPost.created_at,
        }
      ]).select().single();
      
      if (!error && data) {
        newPost.id = String(data.id);
      }
    } catch (e) {
      console.warn('Supabase insert error, saved locally:', e);
    }
  }

  inMemoryPosts = [newPost, ...inMemoryPosts];
  return newPost;
}

export async function incrementLike(postId: string): Promise<number> {
  const post = inMemoryPosts.find(p => p.id === postId);
  let newLikes = post ? post.likes + 1 : 1;
  if (post) post.likes = newLikes;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('posts').select('likes').eq('id', postId).single();
      const currentLikes = data?.likes ?? (newLikes - 1);
      newLikes = currentLikes + 1;
      await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
    } catch (e) {
      console.warn('Supabase like error, updated locally:', e);
    }
  }
  return newLikes;
}

export async function insertComment(postId: string, commentData: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> {
  const newComment: Comment = {
    id: 'comm_' + Date.now(),
    postId,
    ...commentData,
    created_at: new Date().toISOString(),
  };

  const post = inMemoryPosts.find(p => p.id === postId);
  if (post) {
    post.comments = [...(post.comments || []), newComment];
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('comments').insert([
        {
          post_id: postId,
          author: newComment.author,
          content: newComment.content,
          role: newComment.role,
          created_at: newComment.created_at,
        }
      ]);
    } catch (e) {
      console.warn('Supabase comment insert error:', e);
    }
  }

  return newComment;
}

export async function fetchRankings(): Promise<Ranking[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          nickname: item.nickname,
          score: Number(item.score),
          played_at: item.played_at || item.created_at,
          badge: item.badge || undefined,
        }));
      }
    } catch (e) {
      console.warn('Supabase ranking error, fallback to local:', e);
    }
  }

  return [...inMemoryRankings].sort((a, b) => b.score - a.score);
}

export async function insertRanking(nickname: string, score: number): Promise<Ranking> {
  const newRanking: Ranking = {
    id: 'rank_' + Date.now(),
    nickname,
    score,
    played_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('rankings').insert([
        {
          nickname,
          score,
          played_at: newRanking.played_at,
        }
      ]).select().single();
      if (!error && data) {
        newRanking.id = String(data.id);
      }
    } catch (e) {
      console.warn('Supabase ranking insert error:', e);
    }
  }

  inMemoryRankings = [newRanking, ...inMemoryRankings];
  return newRanking;
}

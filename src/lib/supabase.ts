import { createClient } from '@supabase/supabase-js';
import { Post, Comment, Ranking, ChannelId, User, UserRole, UserStatus } from '@/types';
import { INITIAL_POSTS, INITIAL_RANKINGS, INITIAL_USERS } from '@/data/mockData';

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
let inMemoryUsers: User[] = [...INITIAL_USERS];

export async function fetchPosts(channel?: ChannelId): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('posts').select('*, comments(*)').order('created_at', { ascending: false });
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
          comments: Array.isArray(item.comments) ? item.comments.map((c: any) => ({
            id: String(c.id),
            postId: String(c.post_id),
            author: c.author,
            content: c.content,
            role: c.role || 'student',
            created_at: c.created_at,
          })) : [],
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

// ========================================================
// User Authentication & Admin Approval Management
// ========================================================

export async function fetchUsers(): Promise<User[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          username: item.username,
          password: item.password,
          name: item.name,
          role: (item.role as UserRole) || 'student',
          status: (item.status as UserStatus) || 'pending',
          grade: item.grade ? Number(item.grade) : undefined,
          class_num: item.class_num ? Number(item.class_num) : undefined,
          student_num: item.student_num ? Number(item.student_num) : undefined,
          department: item.department || undefined,
          position: item.position || undefined,
          bio: item.bio || undefined,
          created_at: item.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetchUsers error, fallback to memory:', e);
    }
  }

  return [...inMemoryUsers];
}

export async function findUser(username: string): Promise<User | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      if (!error && data) {
        return {
          id: String(data.id),
          username: data.username,
          password: data.password,
          name: data.name,
          role: (data.role as UserRole) || 'student',
          status: (data.status as UserStatus) || 'pending',
          grade: data.grade ? Number(data.grade) : undefined,
          class_num: data.class_num ? Number(data.class_num) : undefined,
          student_num: data.student_num ? Number(data.student_num) : undefined,
          department: data.department || undefined,
          position: data.position || undefined,
          bio: data.bio || undefined,
          created_at: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Supabase findUser error, fallback to memory:', e);
    }
  }

  const found = inMemoryUsers.find(u => u.username === username);
  return found || null;
}

export async function createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
  const newUser: User = {
    id: 'user_' + Date.now(),
    ...userData,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('users').insert([
        {
          username: newUser.username,
          password: newUser.password || '1234',
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
          grade: newUser.grade,
          class_num: newUser.class_num,
          student_num: newUser.student_num,
          department: newUser.department,
          position: newUser.position,
          bio: newUser.bio,
        }
      ]).select().single();

      if (!error && data) {
        newUser.id = String(data.id);
      }
    } catch (e) {
      console.warn('Supabase createUser error, saving to in-memory:', e);
    }
  }

  // Deduplicate and push
  inMemoryUsers = inMemoryUsers.filter(u => u.username !== newUser.username);
  inMemoryUsers = [...inMemoryUsers, newUser];
  return newUser;
}

export async function updateUserStatus(userId: string, status: UserStatus): Promise<User | null> {
  const user = inMemoryUsers.find(u => u.id === userId);
  if (user) {
    user.status = status;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);
    } catch (e) {
      console.warn('Supabase updateUserStatus error:', e);
    }
  }

  return user || null;
}

export async function updateUserRole(userId: string, role: UserRole): Promise<User | null> {
  const user = inMemoryUsers.find(u => u.id === userId);
  if (user) {
    user.role = role;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);
    } catch (e) {
      console.warn('Supabase updateUserRole error:', e);
    }
  }

  return user || null;
}

export async function deleteUser(userId: string): Promise<boolean> {
  inMemoryUsers = inMemoryUsers.filter(u => u.id !== userId);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      return true;
    } catch (e) {
      console.warn('Supabase deleteUser error:', e);
    }
  }

  return true;
}

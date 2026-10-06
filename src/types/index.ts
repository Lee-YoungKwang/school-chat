export type ChannelId = 
  | 'all-notice' 
  | 'class-notice' 
  | 'free-talk' 
  | 'lost-found' 
  | 'student-council' 
  | 'teacher-lounge';

export type UserRole = 'student' | 'teacher';

export interface Comment {
  id: string;
  postId?: string;
  author: string;
  role: UserRole;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  channel: ChannelId;
  title: string;
  content: string;
  author: string;
  role: UserRole;
  created_at: string;
  likes: number;
  comments: Comment[];
  tag?: string;
  isStaffOnly?: boolean;
}

export interface Ranking {
  id: string;
  nickname: string;
  score: number;
  played_at: string;
  badge?: string;
}

export interface ChannelInfo {
  id: ChannelId;
  name: string;
  description: string;
  icon: string;
  staffOnly?: boolean;
  color: string;
}

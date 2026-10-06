export type ChannelId = 
  | 'all-notice' 
  | 'class-notice' 
  | 'free-talk' 
  | 'lost-found' 
  | 'student-council' 
  | 'teacher-lounge';

export type UserRole = 'student' | 'teacher' | 'admin';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  grade?: number;
  class_num?: number;
  student_num?: number;
  department?: string;
  position?: string;
  bio?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  postId?: string;
  author: string;
  authorUsername?: string;
  role: UserRole;
  content: string;
  created_at: string;
}

export interface Attachment {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface Post {
  id: string;
  channel: ChannelId;
  title: string;
  content: string;
  author: string;
  authorUsername?: string;
  role: UserRole;
  created_at: string;
  likes: number;
  comments: Comment[];
  tag?: string;
  isStaffOnly?: boolean;
  images?: string[];
  attachments?: Attachment[];
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

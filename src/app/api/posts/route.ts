import { NextResponse } from 'next/server';
import { fetchPosts, insertPost } from '@/lib/supabase';
import { ChannelId } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel') as ChannelId | null;
  const posts = await fetchPosts(channel || undefined);
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author, channel, role, tag, images, attachments } = body;
    if (!title || !content || !author || !channel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newPost = await insertPost({
      title,
      content,
      author,
      channel,
      role: role || 'student',
      tag,
      images: Array.isArray(images) ? images : [],
      attachments: Array.isArray(attachments) ? attachments : [],
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

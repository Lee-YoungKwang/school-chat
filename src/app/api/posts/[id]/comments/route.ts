import { NextResponse } from 'next/server';
import { insertComment } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { author, content, role } = body;
    if (!content) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }
    const newComment = await insertComment(params.id, {
      author: author || '익명',
      content,
      role: role || 'student',
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}

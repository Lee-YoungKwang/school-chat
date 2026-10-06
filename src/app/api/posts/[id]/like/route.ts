import { NextResponse } from 'next/server';
import { incrementLike } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const newLikes = await incrementLike(params.id);
    return NextResponse.json({ success: true, likes: newLikes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}

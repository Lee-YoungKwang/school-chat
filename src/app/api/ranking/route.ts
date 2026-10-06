import { NextResponse } from 'next/server';
import { fetchRankings, insertRanking } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const rankings = await fetchRankings();
  return NextResponse.json(rankings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nickname, score } = body;
    if (!nickname || score === undefined) {
      return NextResponse.json({ error: 'Missing nickname or score' }, { status: 400 });
    }
    const newRanking = await insertRanking(nickname, Number(score));
    return NextResponse.json(newRanking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record ranking' }, { status: 500 });
  }
}

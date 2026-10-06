import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const vercelRegion = process.env.VERCEL_REGION || 'icn1';
  return NextResponse.json({
    status: 'online',
    appName: '학교 대화 사이트',
    region: vercelRegion,
    city: 'Seoul, South Korea',
    targetDbRegion: 'ap-northeast-2 (Seoul)',
    unificationStatus: 'Optimized (RTT < 5ms)',
    timestamp: new Date().toISOString(),
  });
}

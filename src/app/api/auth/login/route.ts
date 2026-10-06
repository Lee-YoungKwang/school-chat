import { NextResponse } from 'next/server';
import { findUser } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    const user = await findUser(username.trim());

    if (!user) {
      return NextResponse.json(
        { error: '가입되지 않은 아이디입니다. 회원가입을 먼저 진행해 주세요.' },
        { status: 404 }
      );
    }

    // Verify password (plain check for demo/prototype)
    if (user.password && user.password !== password) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // Check Approval Status
    if (user.status === 'pending') {
      return NextResponse.json(
        { 
          error: 'pending_approval', 
          message: '⏳ 관리자(나)의 가입 승인이 대기 중입니다. 관리자 승인 후 즉시 로그인하실 수 있습니다.',
          userStatus: 'pending'
        },
        { status: 403 }
      );
    }

    if (user.status === 'rejected') {
      return NextResponse.json(
        { 
          error: 'rejected', 
          message: '❌ 가입 신청이 반려되었습니다. 학교 담당 관리자에게 문의해 주세요.',
          userStatus: 'rejected'
        },
        { status: 403 }
      );
    }

    // Success
    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      message: `${user.name}님, 환영합니다!`,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

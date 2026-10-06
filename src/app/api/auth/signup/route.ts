import { NextResponse } from 'next/server';
import { findUser, createUser } from '@/lib/supabase';
import { UserRole } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      username,
      password,
      name,
      role,
      grade,
      class_num,
      student_num,
      department,
      position,
      bio,
    } = body;

    if (!username || !password || !name || !role) {
      return NextResponse.json(
        { error: '필수 가입 정보를 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    if (role !== 'student' && role !== 'teacher') {
      return NextResponse.json(
        { error: '올바른 사용자 유형(학생 또는 교직원)을 선택해 주세요.' },
        { status: 400 }
      );
    }

    // Check duplicate username
    const existing = await findUser(username.trim());
    if (existing) {
      return NextResponse.json(
        { error: '이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.' },
        { status: 409 }
      );
    }

    // Create user with status 'pending'
    const newUser = await createUser({
      username: username.trim(),
      password: password.trim(),
      name: name.trim(),
      role: role as UserRole,
      status: 'pending', // Default is pending admin approval
      grade: grade ? Number(grade) : undefined,
      class_num: class_num ? Number(class_num) : undefined,
      student_num: student_num ? Number(student_num) : undefined,
      department: department?.trim() || undefined,
      position: position?.trim() || undefined,
      bio: bio?.trim() || undefined,
    });

    const { password: _, ...safeUser } = newUser;

    return NextResponse.json(
      {
        success: true,
        message: '🎉 회원가입 신청이 완료되었습니다! 관리자(나)의 승인 후 로그인하실 수 있습니다.',
        user: safeUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

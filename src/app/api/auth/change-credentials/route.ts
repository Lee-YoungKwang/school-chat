import { NextResponse } from 'next/server';
import { findUser, updateUserCredentials, fetchUsers } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentUsername, currentPassword, newUsername, newPassword } = body;

    if (!currentUsername || !currentPassword) {
      return NextResponse.json(
        { error: '현재 아이디와 현재 비밀번호를 입력해 주세요.' },
        { status: 400 }
      );
    }

    if (!newPassword && !newUsername) {
      return NextResponse.json(
        { error: '변경할 새 아이디 또는 새 비밀번호를 입력해 주세요.' },
        { status: 400 }
      );
    }

    // 1. Find user by current username
    const user = await findUser(currentUsername.trim());
    if (!user) {
      return NextResponse.json(
        { error: '해당 아이디의 사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 2. Verify current password
    if (user.password !== currentPassword.trim()) {
      return NextResponse.json(
        { error: '현재 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 3. If changing username, check if new username already taken
    const trimmedNewUsername = newUsername?.trim();
    if (trimmedNewUsername && trimmedNewUsername !== currentUsername.trim()) {
      const existing = await findUser(trimmedNewUsername);
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { error: '이미 사용 중인 새 아이디입니다. 다른 아이디를 입력해 주세요.' },
          { status: 409 }
        );
      }
    }

    // 4. Validate new password length if provided
    const trimmedNewPassword = newPassword?.trim();
    if (trimmedNewPassword && trimmedNewPassword.length < 4) {
      return NextResponse.json(
        { error: '새 비밀번호는 4자리 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 5. Update credentials
    const updated = await updateUserCredentials(
      user.id,
      trimmedNewPassword || undefined,
      trimmedNewUsername || undefined,
      currentUsername.trim()
    );

    if (!updated) {
      return NextResponse.json(
        { error: '회원 정보 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    const { password: _, ...safeUser } = updated;

    return NextResponse.json({
      success: true,
      message: '아이디 및 비밀번호가 성공적으로 변경되었습니다.',
      user: safeUser,
    });
  } catch (error) {
    console.error('Change credentials API error:', error);
    return NextResponse.json(
      { error: '서버 오류로 인해 변경에 실패했습니다.' },
      { status: 500 }
    );
  }
}

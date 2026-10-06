import { NextResponse } from 'next/server';
import { fetchUsers, updateUserStatus, updateUserRole, updateUserCredentials, deleteUser } from '@/lib/supabase';
import { UserStatus, UserRole } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await fetchUsers();
    // Sort: pending first, then latest created
    const sorted = [...users].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const safeUsers = sorted.map(({ password: _, ...rest }) => rest);
    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: '사용자 목록 조회 실패' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, status, role, newPassword, newUsername } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
    }

    let updatedUser = null;

    if (status) {
      updatedUser = await updateUserStatus(userId, status as UserStatus);
    }

    if (role) {
      updatedUser = await updateUserRole(userId, role as UserRole);
    }

    if (newPassword || newUsername) {
      updatedUser = await updateUserCredentials(userId, newPassword, newUsername);
    }

    return NextResponse.json({
      success: true,
      message: '회원 정보가 성공적으로 업데이트되었습니다.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Admin users PATCH error:', error);
    return NextResponse.json({ error: '사용자 정보 수정 실패' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
    }

    await deleteUser(userId);
    return NextResponse.json({ success: true, message: '사용자가 삭제되었습니다.' });
  } catch (error) {
    console.error('Admin users DELETE error:', error);
    return NextResponse.json({ error: '사용자 삭제 실패' }, { status: 500 });
  }
}

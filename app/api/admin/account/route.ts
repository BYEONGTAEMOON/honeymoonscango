import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { hashPassword, verifyPassword } from '@/lib/password';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    try {
        const prisma = getPrisma();
        const account = await prisma.adminAccount.findUnique({ where: { id: 1 } });
        const username = account?.username ?? process.env.ADMIN_USERNAME ?? '';
        return NextResponse.json({ username });
    } catch {
        return NextResponse.json({ username: process.env.ADMIN_USERNAME ?? '' });
    }
}

export async function PUT(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: { currentPassword?: string; newUsername?: string; newPassword?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const { currentPassword, newUsername, newPassword } = body;
    if (!currentPassword || !newUsername || !newPassword) {
        return NextResponse.json({ error: '모든 항목을 입력해주세요.' }, { status: 400 });
    }
    if (newPassword.length < 8) {
        return NextResponse.json({ error: '새 비밀번호는 8자 이상이어야 해요.' }, { status: 400 });
    }

    try {
        const prisma = getPrisma();
        const current = await prisma.adminAccount.findUnique({ where: { id: 1 } });

        const currentValid = current
            ? verifyPassword(currentPassword, current.passwordHash)
            : currentPassword === process.env.ADMIN_PASSWORD;

        if (!currentValid) {
            return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        const passwordHash = hashPassword(newPassword);
        await prisma.adminAccount.upsert({
            where: { id: 1 },
            create: { id: 1, username: newUsername, passwordHash },
            update: { username: newUsername, passwordHash },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to update admin account', error);
        return NextResponse.json({ error: '저장에 실패했습니다. 데이터베이스 연결을 확인해주세요.' }, { status: 500 });
    }
}

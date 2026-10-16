import { NextResponse } from 'next/server';

import { requireMainAdmin } from '@/lib/admin-guard';
import { hashPassword } from '@/lib/password';
import { getPrisma } from '@/lib/prisma';

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,30}$/;

async function getMainUsername(): Promise<string | null> {
    const account = await getPrisma().adminAccount.findUnique({ where: { id: 1 } });
    return account?.username ?? process.env.ADMIN_USERNAME ?? null;
}

export async function GET() {
    if (!(await requireMainAdmin())) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    try {
        const subAdmins = await getPrisma().subAdmin.findMany({
            select: { id: true, username: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ subAdmins });
    } catch (error) {
        console.error('Failed to load sub-admins', error);
        return NextResponse.json({ error: '데이터를 불러오지 못했습니다.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await requireMainAdmin())) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    let body: { username?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const username = body.username?.trim() ?? '';
    const password = body.password ?? '';
    if (!USERNAME_PATTERN.test(username)) {
        return NextResponse.json({ error: '아이디는 영문·숫자·. _ - 조합 3~30자로 입력해주세요.' }, { status: 400 });
    }
    if (password.length < 8) {
        return NextResponse.json({ error: '비밀번호는 8자 이상이어야 해요.' }, { status: 400 });
    }

    try {
        if (username === (await getMainUsername())) {
            return NextResponse.json({ error: '메인 관리자와 같은 아이디는 쓸 수 없어요.' }, { status: 400 });
        }

        const prisma = getPrisma();
        if (await prisma.subAdmin.findUnique({ where: { username } })) {
            return NextResponse.json({ error: '이미 있는 아이디예요.' }, { status: 409 });
        }

        const subAdmin = await prisma.subAdmin.create({
            data: { username, passwordHash: hashPassword(password) },
            select: { id: true, username: true, createdAt: true },
        });
        return NextResponse.json({ ok: true, subAdmin });
    } catch (error) {
        console.error('Failed to create sub-admin', error);
        return NextResponse.json({ error: '생성에 실패했습니다.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!(await requireMainAdmin())) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    let body: { id?: number };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    if (!body.id || !Number.isInteger(body.id)) {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    try {
        await getPrisma().subAdmin.delete({ where: { id: body.id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ ok: true });
        }
        console.error('Failed to delete sub-admin', error);
        return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
    }
}

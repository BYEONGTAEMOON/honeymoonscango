import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { getPrisma } from '@/lib/prisma';

const ALLOWED_TYPES = ['email', 'sms'];

export async function GET() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    try {
        const prisma = getPrisma();
        const recipients = await prisma.notificationRecipient.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json({ recipients });
    } catch (error) {
        console.error('Failed to load notification recipients', error);
        return NextResponse.json({ error: '데이터를 불러오지 못했습니다.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: { type?: string; value?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const type = body.type;
    const value = body.value?.trim();
    if (!type || !ALLOWED_TYPES.includes(type) || !value) {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    try {
        const prisma = getPrisma();
        const recipient = await prisma.notificationRecipient.upsert({
            where: { type_value: { type, value } },
            create: { type, value },
            update: {},
        });
        return NextResponse.json({ ok: true, recipient });
    } catch (error) {
        console.error('Failed to add notification recipient', error);
        return NextResponse.json({ error: '추가에 실패했습니다.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
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
        const prisma = getPrisma();
        await prisma.notificationRecipient.delete({ where: { id: body.id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ ok: true });
        }
        console.error('Failed to remove notification recipient', error);
        return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
    }
}

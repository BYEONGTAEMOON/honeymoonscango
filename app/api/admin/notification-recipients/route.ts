import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { isValidMobile, normalizePhone } from '@/lib/notify';
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
    const raw = body.value?.trim();
    if (!type || !ALLOWED_TYPES.includes(type) || !raw) {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const value = type === 'sms' ? normalizePhone(raw) : raw.toLowerCase();
    if (type === 'sms' && !isValidMobile(value)) {
        return NextResponse.json({ error: '휴대폰 번호 형식이 올바르지 않아요. (예: 01012345678)' }, { status: 400 });
    }
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return NextResponse.json({ error: '이메일 주소 형식이 올바르지 않아요.' }, { status: 400 });
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

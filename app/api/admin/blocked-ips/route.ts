import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    try {
        const prisma = getPrisma();
        const blockedIps = await prisma.blockedIp.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json({ blockedIps });
    } catch (error) {
        console.error('Failed to load blocked IPs', error);
        return NextResponse.json({ error: '데이터를 불러오지 못했습니다.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: { ip?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const ip = body.ip?.trim();
    if (!ip) {
        return NextResponse.json({ error: 'IP 주소가 필요합니다.' }, { status: 400 });
    }

    try {
        const prisma = getPrisma();
        await prisma.blockedIp.upsert({ where: { ip }, create: { ip }, update: {} });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to block IP', error);
        return NextResponse.json({ error: '차단에 실패했습니다.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: { ip?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const ip = body.ip?.trim();
    if (!ip) {
        return NextResponse.json({ error: 'IP 주소가 필요합니다.' }, { status: 400 });
    }

    try {
        const prisma = getPrisma();
        await prisma.blockedIp.delete({ where: { ip } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        // P2025 = record not found — already unblocked, treat as success (idempotent).
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ ok: true });
        }
        console.error('Failed to unblock IP', error);
        return NextResponse.json({ error: '차단 해제에 실패했습니다.' }, { status: 500 });
    }
}

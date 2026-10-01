import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { getPrisma } from '@/lib/prisma';

export async function PUT(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: { smsSender?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const smsSender = body.smsSender?.trim().replace(/[^0-9]/g, '') || null;

    try {
        const prisma = getPrisma();
        const settings = await prisma.notificationSettings.upsert({
            where: { id: 1 },
            create: { id: 1, smsSender },
            update: { smsSender },
        });
        return NextResponse.json({ ok: true, settings });
    } catch (error) {
        console.error('Failed to save notification settings', error);
        return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }
}

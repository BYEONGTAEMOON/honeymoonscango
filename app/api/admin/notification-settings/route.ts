import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { getActiveSenderIds, normalizePhone } from '@/lib/notify';
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

    const smsSender = normalizePhone(body.smsSender ?? '') || null;

    if (smsSender) {
        if (!/^0\d{8,10}$/.test(smsSender)) {
            return NextResponse.json({ error: '발신번호 형식이 올바르지 않아요. (예: 01012345678)' }, { status: 400 });
        }
        const registered = await getActiveSenderIds();
        if (registered && !registered.includes(smsSender)) {
            const list = registered.length > 0 ? registered.join(', ') : '없음';
            return NextResponse.json(
                { error: `SOLAPI에 등록된 발신번호가 아니에요. 등록된 번호: ${list}` },
                { status: 400 },
            );
        }
    }

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

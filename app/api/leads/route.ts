import { NextResponse } from 'next/server';

import { getClientIp } from '@/lib/client-ip';
import { getPrisma } from '@/lib/prisma';

export async function POST(request: Request) {
    let body: {
        month?: string;
        destination?: string;
        budget?: string;
        region?: string;
        name?: string;
        phone?: string;
        selectedResorts?: string[];
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const { month, destination, budget, region, name, phone, selectedResorts } = body;

    if (!name || !phone) {
        return NextResponse.json({ error: '이름과 연락처는 필수입니다.' }, { status: 400 });
    }

    const ip = getClientIp(request);

    try {
        const prisma = getPrisma();

        if (ip) {
            const blocked = await prisma.blockedIp.findUnique({ where: { ip } });
            if (blocked) {
                // Reject without revealing the block to the client — the chatbot
                // treats this submission as best-effort and shows completion
                // either way, so a spammy IP gets no signal that it was blocked.
                return NextResponse.json({ error: '요청을 처리할 수 없습니다.' }, { status: 403 });
            }
        }

        await prisma.lead.create({
            data: {
                month: month ?? null,
                destination: destination ?? null,
                budget: budget ?? null,
                region: region ?? null,
                name,
                phone,
                selectedResorts: selectedResorts && selectedResorts.length > 0 ? selectedResorts.join(', ') : null,
                ip,
            },
        });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to save lead', error);
        return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }
}

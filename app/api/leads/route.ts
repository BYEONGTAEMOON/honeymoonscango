import { NextResponse } from 'next/server';

import { getClientIp } from '@/lib/client-ip';
import { notifyNewLead } from '@/lib/notify';
import { getPrisma } from '@/lib/prisma';

export async function POST(request: Request) {
    let body: {
        month?: string;
        destination?: string;
        budget?: string;
        duration?: string;
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

    const { month, destination, budget, duration, region, name, phone, selectedResorts } = body;

    // Either can be switched off in the scenario, but the admin API refuses to
    // turn off both, so a real submission always has at least one.
    if (!name && !phone) {
        return NextResponse.json({ error: '이름 또는 연락처가 필요합니다.' }, { status: 400 });
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

        const selectedResortsText = selectedResorts && selectedResorts.length > 0 ? selectedResorts.join(', ') : null;

        await prisma.lead.create({
            data: {
                month: month ?? null,
                destination: destination ?? null,
                budget: budget ?? null,
                duration: duration ?? null,
                region: region ?? null,
                name: name ?? null,
                phone: phone ?? null,
                selectedResorts: selectedResortsText,
                ip,
            },
        });

        await notifyNewLead({
            name: name ?? null,
            phone: phone ?? null,
            month: month ?? null,
            destination: destination ?? null,
            budget: budget ?? null,
            duration: duration ?? null,
            region: region ?? null,
            selectedResorts: selectedResortsText,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to save lead', error);
        return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }
}

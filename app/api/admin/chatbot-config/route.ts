import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { requireMainAdmin } from '@/lib/admin-guard';
import { mergeScenario, type ChatbotScenario } from '@/lib/chatbot-scenario';
import { getPrisma } from '@/lib/prisma';
import { getScenarioWithStatus } from '@/lib/scenario-store';

export async function GET() {
    if (!(await requireMainAdmin())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { scenario, error } = await getScenarioWithStatus();
    return NextResponse.json({ scenario, error });
}

export async function PUT(request: Request) {
    if (!(await requireMainAdmin())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: Partial<ChatbotScenario>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const scenario = mergeScenario(body);

    if (!scenario.sections.contact && !scenario.sections.regionName) {
        return NextResponse.json(
            { error: '6번과 7번을 함께 끌 수 없어요. 둘 다 끄면 고객 연락처를 받을 수 없습니다.' },
            { status: 400 },
        );
    }

    try {
        const prisma = getPrisma();
        await prisma.chatbotConfig.upsert({
            where: { id: 1 },
            create: { id: 1, data: scenario },
            update: { data: scenario },
        });
        // The homepage is ISR-cached (revalidate = 60) and renders these same
        // resorts/images, so without this an admin edit wouldn't show up until
        // the cache expired and a visitor triggered a background refresh.
        revalidatePath('/');
        return NextResponse.json({ ok: true, scenario });
    } catch (error) {
        console.error('Failed to save chatbot config', error);
        return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }
}

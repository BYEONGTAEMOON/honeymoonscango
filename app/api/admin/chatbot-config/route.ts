import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { mergeScenario, type ChatbotScenario } from '@/lib/chatbot-scenario';
import { getPrisma } from '@/lib/prisma';
import { getScenarioWithStatus } from '@/lib/scenario-store';

export async function GET() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { scenario, error } = await getScenarioWithStatus();
    return NextResponse.json({ scenario, error });
}

export async function PUT(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: Partial<ChatbotScenario>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const scenario = mergeScenario(body);

    try {
        const prisma = getPrisma();
        await prisma.chatbotConfig.upsert({
            where: { id: 1 },
            create: { id: 1, data: scenario },
            update: { data: scenario },
        });
        return NextResponse.json({ ok: true, scenario });
    } catch (error) {
        console.error('Failed to save chatbot config', error);
        return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }
}

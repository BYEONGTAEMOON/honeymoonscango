import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { DEFAULT_CHATBOT_SCENARIO, mergeScenario, type ChatbotScenario } from '@/lib/chatbot-scenario';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    try {
        const prisma = getPrisma();
        const row = await prisma.chatbotConfig.findUnique({ where: { id: 1 } });
        const scenario = row ? mergeScenario(row.data as never) : DEFAULT_CHATBOT_SCENARIO;
        return NextResponse.json({ scenario });
    } catch (error) {
        return NextResponse.json(
            { scenario: DEFAULT_CHATBOT_SCENARIO, error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.' },
            { status: 200 },
        );
    }
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

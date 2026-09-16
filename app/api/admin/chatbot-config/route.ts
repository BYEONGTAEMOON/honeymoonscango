import { NextResponse } from 'next/server';

import { ensureChatbotConfigSchema, getSql } from '@/lib/db';
import { DEFAULT_CHATBOT_SCENARIO, mergeScenario, type ChatbotScenario } from '@/lib/chatbot-scenario';

export async function GET() {
    try {
        await ensureChatbotConfigSchema();
        const sql = getSql();
        const rows = (await sql`SELECT data FROM chatbot_config WHERE id = 1`) as { data: unknown }[];
        const scenario = rows.length > 0 ? mergeScenario(rows[0].data as never) : DEFAULT_CHATBOT_SCENARIO;
        return NextResponse.json({ scenario });
    } catch (error) {
        return NextResponse.json(
            { scenario: DEFAULT_CHATBOT_SCENARIO, error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.' },
            { status: 200 },
        );
    }
}

export async function PUT(request: Request) {
    let body: Partial<ChatbotScenario>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const scenario = mergeScenario(body);

    try {
        await ensureChatbotConfigSchema();
        const sql = getSql();
        await sql`
            INSERT INTO chatbot_config (id, data, updated_at)
            VALUES (1, ${JSON.stringify(scenario)}::jsonb, now())
            ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(scenario)}::jsonb, updated_at = now()
        `;
        return NextResponse.json({ ok: true, scenario });
    } catch (error) {
        console.error('Failed to save chatbot config', error);
        return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }
}

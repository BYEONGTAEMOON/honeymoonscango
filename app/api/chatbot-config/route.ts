import { NextResponse } from 'next/server';

import { ensureChatbotConfigSchema, getSql } from '@/lib/db';
import { DEFAULT_CHATBOT_SCENARIO, mergeScenario } from '@/lib/chatbot-scenario';

export async function GET() {
    try {
        await ensureChatbotConfigSchema();
        const sql = getSql();
        const rows = (await sql`SELECT data FROM chatbot_config WHERE id = 1`) as { data: unknown }[];
        const scenario = rows.length > 0 ? mergeScenario(rows[0].data as never) : DEFAULT_CHATBOT_SCENARIO;
        return NextResponse.json({ scenario });
    } catch {
        // No DB configured yet, or a transient error — fall back to defaults so the
        // public chatbot keeps working even before an admin has customized anything.
        return NextResponse.json({ scenario: DEFAULT_CHATBOT_SCENARIO });
    }
}

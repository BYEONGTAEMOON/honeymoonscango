import { NextResponse } from 'next/server';

import { DEFAULT_CHATBOT_SCENARIO, mergeScenario } from '@/lib/chatbot-scenario';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
    try {
        const prisma = getPrisma();
        const row = await prisma.chatbotConfig.findUnique({ where: { id: 1 } });
        const scenario = row ? mergeScenario(row.data as never) : DEFAULT_CHATBOT_SCENARIO;
        return NextResponse.json({ scenario });
    } catch {
        // No DB configured yet, or a transient error — fall back to defaults so the
        // public chatbot keeps working even before an admin has customized anything.
        return NextResponse.json({ scenario: DEFAULT_CHATBOT_SCENARIO });
    }
}

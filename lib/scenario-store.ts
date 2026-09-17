import { DEFAULT_CHATBOT_SCENARIO, mergeScenario, type ChatbotScenario } from './chatbot-scenario';
import { getPrisma } from './prisma';

// Split out from chatbot-scenario.ts because that module is also imported by
// client components (e.g. scan-modal-context.tsx) — pulling the Prisma/pg
// adapter into that bundle breaks the client build (Node-only modules like
// `tls` have no browser equivalent).
export async function getScenarioWithStatus(): Promise<{ scenario: ChatbotScenario; error: string | null }> {
    try {
        const prisma = getPrisma();
        const row = await prisma.chatbotConfig.findUnique({ where: { id: 1 } });
        return { scenario: row ? mergeScenario(row.data as never) : DEFAULT_CHATBOT_SCENARIO, error: null };
    } catch (error) {
        return {
            scenario: DEFAULT_CHATBOT_SCENARIO,
            error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.',
        };
    }
}

export async function getScenario(): Promise<ChatbotScenario> {
    const { scenario } = await getScenarioWithStatus();
    return scenario;
}

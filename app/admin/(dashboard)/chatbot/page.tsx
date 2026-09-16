import { DEFAULT_CHATBOT_SCENARIO, mergeScenario } from '@/lib/chatbot-scenario';
import { ensureChatbotConfigSchema, getSql } from '@/lib/db';

import { ChatbotConfigForm } from './chatbot-config-form';

export const dynamic = 'force-dynamic';

async function loadScenario() {
    try {
        await ensureChatbotConfigSchema();
        const sql = getSql();
        const rows = (await sql`SELECT data FROM chatbot_config WHERE id = 1`) as { data: unknown }[];
        return {
            scenario: rows.length > 0 ? mergeScenario(rows[0].data as never) : DEFAULT_CHATBOT_SCENARIO,
            error: null as string | null,
        };
    } catch (error) {
        return {
            scenario: DEFAULT_CHATBOT_SCENARIO,
            error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.',
        };
    }
}

export default async function AdminChatbotPage() {
    const { scenario, error } = await loadScenario();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">챗봇 시나리오</h1>
            <p className="mt-1 text-sm text-gray-500">
                홈페이지 &ldquo;허니문 스캔GO&rdquo; 챗봇의 질문 문구와 선택지를 관리하세요. 저장하면 바로 사이트에 반영돼요.
            </p>

            {error && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    데이터베이스가 아직 연결되지 않았어요. 지금은 기본값을 보여드리고 있고, 여기서 저장해도 DB 연결 전까지는
                    반영되지 않아요. ({error})
                </div>
            )}

            <div className="mt-6">
                <ChatbotConfigForm initialScenario={scenario} />
            </div>
        </div>
    );
}

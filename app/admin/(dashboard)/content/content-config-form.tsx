'use client';

import { useState } from 'react';

import { DEFAULT_CHATBOT_SCENARIO, type ChatbotScenario } from '@/lib/chatbot-scenario';

import { PopularResortsEditor } from '../chatbot/popular-resorts-editor';
import { ResortsByDestinationEditor } from '../chatbot/resorts-by-destination-editor';
import { SectionCard } from '../section-card';

export function ContentConfigForm({ initialScenario }: { initialScenario: ChatbotScenario }) {
    // Holds the FULL scenario (not just the two fields this page edits) so that
    // saving always PUTs a complete object — the API replaces the whole config,
    // so a partial payload here would silently reset chatbot text elsewhere.
    const [scenario, setScenario] = useState<ChatbotScenario>(initialScenario);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    function set<K extends keyof ChatbotScenario>(key: K, value: ChatbotScenario[K]) {
        setScenario((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSave() {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/chatbot-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scenario),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setMessage({ type: 'error', text: data.error ?? '저장에 실패했습니다.' });
                return;
            }
            setMessage({ type: 'success', text: '저장했어요. 사이트에 바로 반영됩니다.' });
        } catch {
            setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다.' });
        } finally {
            setSaving(false);
        }
    }

    function handleReset() {
        if (!confirm('기본값으로 초기화할까요? 저장 전까지는 사이트에 반영되지 않아요.')) return;
        setScenario((prev) => ({
            ...prev,
            resortsByDestination: DEFAULT_CHATBOT_SCENARIO.resortsByDestination,
            popularResorts: DEFAULT_CHATBOT_SCENARIO.popularResorts,
        }));
        setMessage(null);
    }

    return (
        <div className="space-y-6 pb-24">
            <SectionCard
                title="1. 목적지별 리조트"
                description="발리~세부까지, 홈페이지 여행지 섹션과 챗봇의 리조트 후보 화면에 동일하게 반영돼요."
            >
                <ResortsByDestinationEditor value={scenario.resortsByDestination} onChange={(v) => set('resortsByDestination', v)} />
            </SectionCard>

            <SectionCard
                title="2. 인기 숙소 마퀴"
                description="홈페이지 &ldquo;허니문 인기 숙소 둘러보기&rdquo; 섹션에서 자동으로 흘러가는 숙소 카드 목록이에요."
            >
                <PopularResortsEditor value={scenario.popularResorts} onChange={(v) => set('popularResorts', v)} />
            </SectionCard>

            <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white/95 px-8 py-4 backdrop-blur md:left-60">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        {message && (
                            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            기본값으로 초기화
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="cursor-pointer rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? '저장 중...' : '저장하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

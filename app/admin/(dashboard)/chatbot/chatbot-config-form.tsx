'use client';

import { useState } from 'react';

import { DEFAULT_CHATBOT_SCENARIO, type ChatbotScenario, type TagItem, type TextItem } from '@/lib/chatbot-scenario';

import { ResortsByDestinationEditor } from './resorts-by-destination-editor';

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-900">{title}</p>
            {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
            <div className="mt-4 space-y-4">{children}</div>
        </div>
    );
}

function Field({
    label,
    hint,
    value,
    onChange,
    rows = 3,
}: {
    label: string;
    hint?: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}) {
    return (
        <label className="block">
            <span className="text-xs font-semibold text-gray-600">{label}</span>
            {hint && <span className="ml-2 text-xs text-gray-400">{hint}</span>}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
        </label>
    );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
    return (
        <label className="block max-w-[160px]">
            <span className="text-xs font-semibold text-gray-600">{label}</span>
            <input
                type="number"
                min={1}
                max={12}
                value={value}
                onChange={(e) => onChange(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
        </label>
    );
}

function StringListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
    return (
        <div>
            <span className="text-xs font-semibold text-gray-600">{label}</span>
            <div className="mt-1.5 space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                                const next = [...items];
                                next[index] = e.target.value;
                                onChange(next);
                            }}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <button
                            type="button"
                            onClick={() => onChange(items.filter((_, i) => i !== index))}
                            className="cursor-pointer rounded-lg border border-red-200 px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                            삭제
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => onChange([...items, ''])}
                    className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-500 hover:border-brand hover:text-brand"
                >
                    + 항목 추가
                </button>
            </div>
        </div>
    );
}

function TextItemListEditor({ label, items, onChange }: { label: string; items: TextItem[]; onChange: (items: TextItem[]) => void }) {
    return (
        <div>
            <span className="text-xs font-semibold text-gray-600">{label}</span>
            <div className="mt-1.5 space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={item.title}
                            placeholder="제목"
                            onChange={(e) => {
                                const next = [...items];
                                next[index] = { ...next[index], title: e.target.value };
                                onChange(next);
                            }}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <input
                            type="text"
                            value={item.desc}
                            placeholder="설명"
                            onChange={(e) => {
                                const next = [...items];
                                next[index] = { ...next[index], desc: e.target.value };
                                onChange(next);
                            }}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <button
                            type="button"
                            onClick={() => onChange(items.filter((_, i) => i !== index))}
                            className="cursor-pointer rounded-lg border border-red-200 px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                            삭제
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => onChange([...items, { title: '', desc: '' }])}
                    className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-500 hover:border-brand hover:text-brand"
                >
                    + 항목 추가
                </button>
            </div>
        </div>
    );
}

function TagItemListEditor({ label, items, onChange }: { label: string; items: TagItem[]; onChange: (items: TagItem[]) => void }) {
    return (
        <div>
            <span className="text-xs font-semibold text-gray-600">{label}</span>
            <div className="mt-1.5 space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={item.title}
                            placeholder="제목"
                            onChange={(e) => {
                                const next = [...items];
                                next[index] = { ...next[index], title: e.target.value };
                                onChange(next);
                            }}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <input
                            type="text"
                            value={item.tag}
                            placeholder="태그"
                            onChange={(e) => {
                                const next = [...items];
                                next[index] = { ...next[index], tag: e.target.value };
                                onChange(next);
                            }}
                            className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <button
                            type="button"
                            onClick={() => onChange(items.filter((_, i) => i !== index))}
                            className="cursor-pointer rounded-lg border border-red-200 px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                            삭제
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => onChange([...items, { title: '', tag: '' }])}
                    className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-500 hover:border-brand hover:text-brand"
                >
                    + 항목 추가
                </button>
            </div>
        </div>
    );
}

export function ChatbotConfigForm({ initialScenario }: { initialScenario: ChatbotScenario }) {
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
        setScenario(DEFAULT_CHATBOT_SCENARIO);
        setMessage(null);
    }

    return (
        <div className="space-y-6 pb-24">
            <SectionCard title="1. 시작 인사 & 출발월" description="챗봇을 열면 가장 먼저 보이는 메시지예요.">
                <Field label="시작 인사 + 출발월 질문" value={scenario.introMessage} onChange={(v) => set('introMessage', v)} rows={5} />
                <NumberField label="보여줄 개월 수" value={scenario.monthCount} onChange={(v) => set('monthCount', v)} />
            </SectionCard>

            <SectionCard title="2. 목적지" description="{value} 자리에 방금 답한 출발월이 자동으로 들어가요.">
                <Field label="목적지 질문" value={scenario.destinationQuestion} onChange={(v) => set('destinationQuestion', v)} rows={4} />
                <StringListEditor label="목적지 선택지" items={scenario.destinations} onChange={(v) => set('destinations', v)} />
            </SectionCard>

            <SectionCard title="3. 예산">
                <Field label="예산 질문" value={scenario.budgetQuestion} onChange={(v) => set('budgetQuestion', v)} rows={4} />
                <StringListEditor label="예산 선택지" items={scenario.budgets} onChange={(v) => set('budgets', v)} />
            </SectionCard>

            <SectionCard title="4. 리조트 추천 · 연락처" description="{destination} 자리에 선택한 목적지가 자동으로 들어가요.">
                <Field label="리조트 후보 안내" value={scenario.resortPickerIntro} onChange={(v) => set('resortPickerIntro', v)} rows={4} />
                <Field label="리조트 선택 후 안내" value={scenario.afterResortMessage} onChange={(v) => set('afterResortMessage', v)} rows={2} />
                <TextItemListEditor label="무료로 받는 자료 목록" items={scenario.freeItems} onChange={(v) => set('freeItems', v)} />
                <Field label="휴대폰 번호 질문" value={scenario.phoneQuestion} onChange={(v) => set('phoneQuestion', v)} rows={2} />
                <Field label="개인정보 안내" value={scenario.privacyNotice} onChange={(v) => set('privacyNotice', v)} rows={2} />
            </SectionCard>

            <SectionCard title="5. 거주 지역 · 이름">
                <Field label="거주 지역 질문" value={scenario.regionQuestion} onChange={(v) => set('regionQuestion', v)} rows={2} />
                <StringListEditor label="거주 지역 선택지" items={scenario.regions} onChange={(v) => set('regions', v)} />
                <Field label="이름 질문" value={scenario.nameQuestion} onChange={(v) => set('nameQuestion', v)} rows={2} />
            </SectionCard>

            <SectionCard title="6. 완료 화면">
                <Field label="완료 안내 문구" value={scenario.completionSubtitle} onChange={(v) => set('completionSubtitle', v)} rows={2} />
                <TagItemListEditor label="추가 혜택 목록" items={scenario.extraBenefits} onChange={(v) => set('extraBenefits', v)} />
                <Field label="마무리 인사" value={scenario.completionClosing} onChange={(v) => set('completionClosing', v)} rows={5} />
            </SectionCard>

            <SectionCard
                title="7. 목적지별 리조트"
                description="여기서 수정한 리조트 이미지·설명·태그는 메인 홈페이지의 여행지 섹션과 챗봇의 리조트 후보 화면에 동일하게 반영돼요."
            >
                <ResortsByDestinationEditor value={scenario.resortsByDestination} onChange={(v) => set('resortsByDestination', v)} />
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

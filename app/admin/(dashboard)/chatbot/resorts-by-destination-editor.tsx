'use client';

import { useState } from 'react';

import type { ChatbotScenario, DestinationResort } from '@/lib/chatbot-scenario';

type ResortsByDestination = ChatbotScenario['resortsByDestination'];

function makeSlug(name: string): string {
    const base = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${base || 'resort'}-${Math.random().toString(36).slice(2, 8)}`;
}

function ResortRow({
    resort,
    onChange,
    onDelete,
}: {
    resort: DestinationResort;
    onChange: (resort: DestinationResort) => void;
    onDelete: () => void;
}) {
    return (
        <div className="rounded-xl border border-gray-200 p-3">
            <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {resort.image && (
                        // eslint-disable-next-line @next/next/no-img-element -- admin preview only, arbitrary external URLs
                        <img src={resort.image} alt="" className="h-full w-full object-cover" />
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={resort.name}
                        placeholder="리조트명"
                        onChange={(e) => onChange({ ...resort, name: e.target.value })}
                        className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                    <input
                        type="text"
                        value={resort.image}
                        placeholder="이미지 URL (https://...)"
                        onChange={(e) => onChange({ ...resort, image: e.target.value })}
                        className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                </div>
                <button
                    type="button"
                    onClick={onDelete}
                    className="cursor-pointer rounded-lg border border-red-200 px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                >
                    삭제
                </button>
            </div>

            <textarea
                value={resort.description}
                placeholder="설명"
                rows={2}
                onChange={(e) => onChange({ ...resort, description: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <input
                type="text"
                value={resort.tags.join(', ')}
                placeholder="태그 (쉼표로 구분)"
                onChange={(e) =>
                    onChange({
                        ...resort,
                        tags: e.target.value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                    })
                }
                className="mt-2 block w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
        </div>
    );
}

function DestinationBlock({
    name,
    resorts,
    onRename,
    onChangeResorts,
    onDelete,
}: {
    name: string;
    resorts: DestinationResort[];
    onRename: (nextName: string) => void;
    onChangeResorts: (resorts: DestinationResort[]) => void;
    onDelete: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [nameDraft, setNameDraft] = useState(name);

    function updateResort(index: number, resort: DestinationResort) {
        const next = [...resorts];
        next[index] = resort;
        onChangeResorts(next);
    }

    function addResort() {
        onChangeResorts([...resorts, { slug: makeSlug(name), name: '', description: '', tags: [], image: '' }]);
    }

    return (
        <div className="rounded-2xl border border-gray-200">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
            >
                <span className="text-sm font-bold text-gray-900">
                    {name || '(이름 없음)'} <span className="ml-1 font-normal text-gray-400">· 리조트 {resorts.length}곳</span>
                </span>
                <span className="text-xs text-gray-400">{open ? '접기 ▲' : '펼치기 ▼'}</span>
            </button>

            {open && (
                <div className="space-y-3 border-t border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                        <label className="flex-1">
                            <span className="text-xs font-semibold text-gray-600">
                                목적지 이름 <span className="font-normal text-gray-400">(챗봇의 목적지 선택지와 정확히 일치해야 후보로 노출돼요)</span>
                            </span>
                            <input
                                type="text"
                                value={nameDraft}
                                onChange={(e) => setNameDraft(e.target.value)}
                                onBlur={() => {
                                    const trimmed = nameDraft.trim();
                                    if (trimmed && trimmed !== name) onRename(trimmed);
                                    else setNameDraft(name);
                                }}
                                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={onDelete}
                            className="mt-5 cursor-pointer self-start rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                            목적지 삭제
                        </button>
                    </div>

                    <div className="space-y-2">
                        {resorts.map((resort, index) => (
                            <ResortRow
                                key={resort.slug}
                                resort={resort}
                                onChange={(next) => updateResort(index, next)}
                                onDelete={() => onChangeResorts(resorts.filter((_, i) => i !== index))}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addResort}
                        className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-500 hover:border-brand hover:text-brand"
                    >
                        + 리조트 추가
                    </button>
                </div>
            )}
        </div>
    );
}

export function ResortsByDestinationEditor({
    value,
    onChange,
}: {
    value: ResortsByDestination;
    onChange: (value: ResortsByDestination) => void;
}) {
    const [newDestination, setNewDestination] = useState('');
    const names = Object.keys(value);

    function renameDestination(oldName: string, newName: string) {
        if (value[newName]) {
            alert(`이미 "${newName}" 목적지가 있어요.`);
            return;
        }
        const next: ResortsByDestination = {};
        for (const key of Object.keys(value)) {
            next[key === oldName ? newName : key] = value[key];
        }
        onChange(next);
    }

    function addDestination() {
        const name = newDestination.trim();
        if (!name || value[name]) return;
        onChange({ ...value, [name]: [] });
        setNewDestination('');
    }

    function deleteDestination(name: string) {
        if (!confirm(`"${name}" 목적지의 리조트 데이터를 전체 삭제할까요?`)) return;
        const next = { ...value };
        delete next[name];
        onChange(next);
    }

    return (
        <div className="space-y-3">
            {names.map((name) => (
                <DestinationBlock
                    key={name}
                    name={name}
                    resorts={value[name]}
                    onRename={(nextName) => renameDestination(name, nextName)}
                    onChangeResorts={(resorts) => onChange({ ...value, [name]: resorts })}
                    onDelete={() => deleteDestination(name)}
                />
            ))}

            <div className="flex items-center gap-2 pt-1">
                <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="새 목적지 이름 (예: 세이셸)"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <button
                    type="button"
                    onClick={addDestination}
                    className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-500 hover:border-brand hover:text-brand"
                >
                    + 목적지 추가
                </button>
            </div>
        </div>
    );
}

'use client';

import type { PopularResort } from '@/lib/chatbot-scenario';

function makeSlug(): string {
    return `resort-${Math.random().toString(36).slice(2, 8)}`;
}

function PopularResortRow({
    resort,
    onChange,
    onDelete,
}: {
    resort: PopularResort;
    onChange: (resort: PopularResort) => void;
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
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={resort.name}
                            placeholder="리조트명"
                            onChange={(e) => onChange({ ...resort, name: e.target.value })}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <input
                            type="text"
                            value={resort.country}
                            placeholder="국가 (예: 발리)"
                            onChange={(e) => onChange({ ...resort, country: e.target.value })}
                            className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
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

export function PopularResortsEditor({
    value,
    onChange,
}: {
    value: PopularResort[];
    onChange: (value: PopularResort[]) => void;
}) {
    function updateResort(index: number, resort: PopularResort) {
        const next = [...value];
        next[index] = resort;
        onChange(next);
    }

    function addResort() {
        onChange([...value, { slug: makeSlug(), country: '', name: '', description: '', tags: [], image: '' }]);
    }

    return (
        <div className="space-y-2">
            {value.map((resort, index) => (
                <PopularResortRow
                    key={resort.slug}
                    resort={resort}
                    onChange={(next) => updateResort(index, next)}
                    onDelete={() => onChange(value.filter((_, i) => i !== index))}
                />
            ))}

            <button
                type="button"
                onClick={addResort}
                className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-500 hover:border-brand hover:text-brand"
            >
                + 숙소 추가
            </button>
        </div>
    );
}

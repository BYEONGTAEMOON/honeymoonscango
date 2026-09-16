'use client';

import { useState } from 'react';

import type { Lead } from '@/lib/db';

const STATUS_OPTIONS = ['신규', '연락중', '예약완료', '취소'];

const STATUS_BADGE: Record<string, string> = {
    신규: 'bg-brand-light text-brand-dark',
    연락중: 'bg-amber-50 text-amber-700',
    예약완료: 'bg-emerald-50 text-emerald-700',
    취소: 'bg-gray-100 text-gray-500',
};

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
    const [leads, setLeads] = useState(initialLeads);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [memoDraft, setMemoDraft] = useState<Record<number, string>>({});

    async function updateLead(id: number, patch: { status?: string; memo?: string }) {
        setSavingId(id);
        try {
            const res = await fetch(`/api/admin/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
            });
            if (!res.ok) throw new Error('update failed');
            setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));
        } catch {
            alert('수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setSavingId(null);
        }
    }

    async function deleteLead(id: number) {
        if (!confirm('이 신청 데이터를 삭제할까요? 되돌릴 수 없습니다.')) return;
        setSavingId(id);
        try {
            const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('delete failed');
            setLeads((prev) => prev.filter((lead) => lead.id !== id));
        } catch {
            alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setSavingId(null);
        }
    }

    if (leads.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-400 shadow-sm">
                아직 접수된 신청이 없어요.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {leads.map((lead) => {
                const isSaving = savingId === lead.id;
                const memo = memoDraft[lead.id] ?? lead.memo ?? '';

                return (
                    <div key={lead.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    {lead.name ?? '이름 미입력'}{' '}
                                    <span className="ml-1 font-normal text-gray-400">{lead.phone ?? '-'}</span>
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    {new Date(lead.created_at).toLocaleString('ko-KR')}
                                </p>
                            </div>

                            <span
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[lead.status] ?? 'bg-gray-100 text-gray-600'}`}
                            >
                                {lead.status}
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
                            <div>
                                <p className="text-xs text-gray-400">출발월</p>
                                <p className="mt-0.5 font-medium text-gray-900">{lead.month ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">목적지</p>
                                <p className="mt-0.5 font-medium text-gray-900">{lead.destination ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">예산</p>
                                <p className="mt-0.5 font-medium text-gray-900">{lead.budget ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">거주 지역</p>
                                <p className="mt-0.5 font-medium text-gray-900">{lead.region ?? '-'}</p>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-xs text-gray-400">선택 리조트</p>
                                <p className="mt-0.5 font-medium text-gray-900">{lead.selected_resorts ?? '-'}</p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                            <select
                                value={lead.status}
                                disabled={isSaving}
                                onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                                className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={memo}
                                disabled={isSaving}
                                onChange={(e) => setMemoDraft((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                                placeholder="메모 (상담 내용 등)"
                                className="min-w-[160px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            />

                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => updateLead(lead.id, { memo })}
                                className="cursor-pointer rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                메모 저장
                            </button>

                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => deleteLead(lead.id)}
                                className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

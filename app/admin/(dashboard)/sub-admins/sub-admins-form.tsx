'use client';

import { useState } from 'react';

import { formatDateTime } from '@/lib/format';

import { SectionCard } from '../section-card';

export type SubAdminRow = { id: number; username: string; createdAt: string };

const inputClass =
    'block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand';

export function SubAdminsForm({ initialSubAdmins }: { initialSubAdmins: SubAdminRow[] }) {
    const [subAdmins, setSubAdmins] = useState(initialSubAdmins);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        if (password !== passwordConfirm) {
            setMessage({ type: 'error', text: '비밀번호 확인이 일치하지 않아요.' });
            return;
        }

        setCreating(true);
        try {
            const res = await fetch('/api/admin/sub-admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error ?? '생성에 실패했습니다.');
            setSubAdmins((prev) => [data.subAdmin, ...prev]);
            setMessage({ type: 'success', text: `서브 관리자 "${data.subAdmin.username}"를 만들었어요.` });
            setUsername('');
            setPassword('');
            setPasswordConfirm('');
        } catch (error) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : '생성에 실패했습니다.' });
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(subAdmin: SubAdminRow) {
        if (!confirm(`서브 관리자 "${subAdmin.username}"를 삭제할까요? 바로 로그인이 막혀요.`)) return;
        setDeletingId(subAdmin.id);
        try {
            const res = await fetch('/api/admin/sub-admins', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: subAdmin.id }),
            });
            if (!res.ok) throw new Error();
            setSubAdmins((prev) => prev.filter((s) => s.id !== subAdmin.id));
        } catch {
            alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-6">
            <SectionCard title="서브 관리자 만들기">
                <form onSubmit={handleCreate} className="grid max-w-xl gap-3">
                    <label className="block">
                        <span className="text-xs font-semibold text-gray-600">아이디</span>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="영문·숫자 3~30자 (예: staff01)"
                            autoComplete="off"
                            className={`mt-1.5 ${inputClass}`}
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-semibold text-gray-600">비밀번호</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="8자 이상"
                            autoComplete="new-password"
                            className={`mt-1.5 ${inputClass}`}
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs font-semibold text-gray-600">비밀번호 확인</span>
                        <input
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            autoComplete="new-password"
                            className={`mt-1.5 ${inputClass}`}
                        />
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={creating || !username || !password}
                            className="cursor-pointer rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {creating ? '만드는 중...' : '서브 관리자 만들기'}
                        </button>
                        {message && (
                            <p className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                </form>
            </SectionCard>

            <SectionCard title={`서브 관리자 목록 (${subAdmins.length})`}>
                {subAdmins.length === 0 ? (
                    <p className="text-sm text-gray-400">아직 만든 서브 관리자가 없어요.</p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {subAdmins.map((subAdmin) => (
                            <div key={subAdmin.id} className="flex items-center justify-between gap-3 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{subAdmin.username}</p>
                                    <p className="mt-0.5 text-xs text-gray-400">{formatDateTime(new Date(subAdmin.createdAt))} 생성</p>
                                </div>
                                <button
                                    type="button"
                                    disabled={deletingId === subAdmin.id}
                                    onClick={() => handleDelete(subAdmin)}
                                    className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </SectionCard>
        </div>
    );
}

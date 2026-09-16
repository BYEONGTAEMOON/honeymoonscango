'use client';

import { useState } from 'react';

export function AccountForm({ currentUsername }: { currentUsername: string }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState(currentUsername);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: '새 비밀번호가 서로 일치하지 않습니다.' });
            return;
        }
        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: '새 비밀번호는 8자 이상이어야 해요.' });
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/account', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newUsername, newPassword }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setMessage({ type: 'error', text: data.error ?? '변경에 실패했습니다.' });
                return;
            }
            setMessage({ type: 'success', text: '계정 정보를 변경했어요. 다음 로그인부터 새 아이디·비밀번호를 사용해주세요.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다.' });
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <label className="block">
                <span className="text-xs font-semibold text-gray-600">현재 비밀번호</span>
                <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
            </label>

            <div className="border-t border-gray-100 pt-4">
                <label className="block">
                    <span className="text-xs font-semibold text-gray-600">새 아이디</span>
                    <input
                        type="text"
                        required
                        autoComplete="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                </label>

                <label className="mt-4 block">
                    <span className="text-xs font-semibold text-gray-600">새 비밀번호 (8자 이상)</span>
                    <input
                        type="password"
                        required
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                </label>

                <label className="mt-4 block">
                    <span className="text-xs font-semibold text-gray-600">새 비밀번호 확인</span>
                    <input
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                </label>
            </div>

            {message && (
                <p className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {message.text}
                </p>
            )}

            <button
                type="submit"
                disabled={saving}
                className="w-full cursor-pointer rounded-lg bg-brand py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
                {saving ? '변경 중...' : '계정 정보 변경'}
            </button>
        </form>
    );
}

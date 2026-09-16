'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error ?? '로그인에 실패했습니다.');
                setSubmitting(false);
                return;
            }

            const next = searchParams.get('next') ?? '/admin';
            router.replace(next);
            router.refresh();
        } catch {
            setError('네트워크 오류가 발생했습니다.');
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-gray-900 p-8">
                <p className="text-center text-lg font-extrabold text-white">
                    허니문<span className="text-brand">스캔GO</span>
                </p>
                <p className="mt-1 text-center text-sm text-white/50">관리자 로그인</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-3">
                    <input
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디"
                        required
                        className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-brand"
                    />
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        required
                        className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-brand"
                    />

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-brand to-brand-dark py-3 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? '로그인 중...' : '로그인'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}

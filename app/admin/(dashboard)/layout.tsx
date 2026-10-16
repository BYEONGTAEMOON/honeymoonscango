import { redirect } from 'next/navigation';

import { getAdminSession } from '@/lib/admin-guard';

import { AdminLogoutButton, AdminNavLinks } from './nav-links';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    // The proxy already checked the token; this also catches a sub-admin whose
    // account was deleted after they logged in.
    const session = await getAdminSession();
    if (!session) redirect('/admin/login');

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-gray-950 py-6">
                <div className="px-4 pb-6">
                    <p className="text-lg font-extrabold text-white">
                        허니문<span className="text-brand">스캔GO</span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-white/40">
                        {session.role === 'main' ? '메인 관리자' : '서브 관리자'} · {session.username}
                    </p>
                </div>

                <AdminNavLinks role={session.role} />

                <div className="border-t border-white/10 px-3 pt-3">
                    <AdminLogoutButton />
                </div>
            </aside>

            <main className="flex-1 overflow-x-hidden px-8 py-8">{children}</main>
        </div>
    );
}

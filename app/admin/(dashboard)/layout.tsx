import { AdminLogoutButton, AdminNavLinks } from './nav-links';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-gray-950 py-6">
                <div className="px-4 pb-6">
                    <p className="text-lg font-extrabold text-white">
                        허니문<span className="text-brand">스캔GO</span>
                    </p>
                    <p className="mt-0.5 text-xs text-white/40">관리자</p>
                </div>

                <AdminNavLinks />

                <div className="border-t border-white/10 px-3 pt-3">
                    <AdminLogoutButton />
                </div>
            </aside>

            <main className="flex-1 overflow-x-hidden px-8 py-8">{children}</main>
        </div>
    );
}

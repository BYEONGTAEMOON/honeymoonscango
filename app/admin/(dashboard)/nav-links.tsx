'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { ChatIcon, GridIcon, ListIcon, LogoutIcon } from '@/app/components/icons';

const NAV_ITEMS = [
    { href: '/admin', label: '대시보드', icon: GridIcon },
    { href: '/admin/leads', label: '신청 데이터', icon: ListIcon },
    { href: '/admin/chatbot', label: '챗봇 시나리오', icon: ChatIcon },
];

export function AdminNavLinks() {
    const pathname = usePathname();

    return (
        <nav className="flex-1 space-y-1 px-3">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            active ? 'bg-brand text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}

export function AdminLogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.replace('/admin/login');
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
            <LogoutIcon className="h-4 w-4" />
            로그아웃
        </button>
    );
}

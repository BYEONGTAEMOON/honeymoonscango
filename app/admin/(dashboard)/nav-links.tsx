'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { BellIcon, ChatIcon, GridIcon, ListIcon, LogoutIcon, MapPinIcon, UserIcon, UsersIcon } from '@/app/components/icons';
import type { AdminRole } from '@/lib/auth';

const NAV_ITEMS = [
    { href: '/admin', label: '대시보드', icon: GridIcon, subAdmin: true },
    { href: '/admin/leads', label: '신청 데이터', icon: ListIcon, subAdmin: true },
    { href: '/admin/content', label: '메인화면 컨텐츠', icon: MapPinIcon, subAdmin: false },
    { href: '/admin/chatbot', label: '챗봇 시나리오', icon: ChatIcon, subAdmin: false },
    { href: '/admin/notifications', label: '알림 설정', icon: BellIcon, subAdmin: false },
    { href: '/admin/sub-admins', label: '서브 관리자', icon: UsersIcon, subAdmin: false },
    { href: '/admin/account', label: '계정 설정', icon: UserIcon, subAdmin: false },
];

export function AdminNavLinks({ role }: { role: AdminRole }) {
    const pathname = usePathname();
    const items = role === 'main' ? NAV_ITEMS : NAV_ITEMS.filter((item) => item.subAdmin);

    return (
        <nav className="flex-1 space-y-1 px-3">
            {items.map(({ href, label, icon: Icon }) => {
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

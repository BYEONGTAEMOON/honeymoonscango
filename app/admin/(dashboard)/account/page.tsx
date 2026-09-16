import { getPrisma } from '@/lib/prisma';

import { AccountForm } from './account-form';

export const dynamic = 'force-dynamic';

async function loadUsername(): Promise<string> {
    try {
        const prisma = getPrisma();
        const account = await prisma.adminAccount.findUnique({ where: { id: 1 } });
        return account?.username ?? process.env.ADMIN_USERNAME ?? '';
    } catch {
        return process.env.ADMIN_USERNAME ?? '';
    }
}

export default async function AdminAccountPage() {
    const currentUsername = await loadUsername();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">계정 설정</h1>
            <p className="mt-1 text-sm text-gray-500">관리자 로그인 아이디와 비밀번호를 변경하세요.</p>

            <div className="mt-6">
                <AccountForm currentUsername={currentUsername} />
            </div>
        </div>
    );
}

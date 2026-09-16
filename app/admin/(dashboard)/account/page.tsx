import { ensureAdminAccountSchema, getSql, type AdminAccount } from '@/lib/db';

import { AccountForm } from './account-form';

export const dynamic = 'force-dynamic';

async function loadUsername(): Promise<string> {
    try {
        await ensureAdminAccountSchema();
        const sql = getSql();
        const rows = (await sql`SELECT * FROM admin_account WHERE id = 1`) as AdminAccount[];
        return rows[0]?.username ?? process.env.ADMIN_USERNAME ?? '';
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

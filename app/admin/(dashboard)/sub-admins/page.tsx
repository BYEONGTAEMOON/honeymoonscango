import { requireMainAdminPage } from '@/lib/admin-guard';
import { getPrisma } from '@/lib/prisma';

import { SubAdminsForm, type SubAdminRow } from './sub-admins-form';

export const dynamic = 'force-dynamic';

async function loadSubAdmins(): Promise<{ subAdmins: SubAdminRow[]; error: string | null }> {
    try {
        const rows = await getPrisma().subAdmin.findMany({
            select: { id: true, username: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
        return { subAdmins: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })), error: null };
    } catch (error) {
        return { subAdmins: [], error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.' };
    }
}

export default async function AdminSubAdminsPage() {
    await requireMainAdminPage();
    const { subAdmins, error } = await loadSubAdmins();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">서브 관리자</h1>
            <p className="mt-1 text-sm text-gray-500">
                서브 관리자는 <strong className="font-semibold text-gray-700">대시보드</strong>와{' '}
                <strong className="font-semibold text-gray-700">신청 데이터</strong>만 볼 수 있어요. (수정·삭제·설정 변경 불가)
            </p>

            {error ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                    데이터베이스가 아직 연결되지 않았어요. ({error})
                </div>
            ) : (
                <div className="mt-6">
                    <SubAdminsForm initialSubAdmins={subAdmins} />
                </div>
            )}
        </div>
    );
}

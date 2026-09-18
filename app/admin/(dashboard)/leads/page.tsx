import type { Lead } from '@/generated/prisma/client';
import { getPrisma } from '@/lib/prisma';

import { LeadsTable } from './leads-table';

export const dynamic = 'force-dynamic';

async function loadLeads(): Promise<{ leads: Lead[]; blockedIps: string[]; error: string | null }> {
    try {
        const prisma = getPrisma();
        const [leads, blockedIpRows] = await Promise.all([
            prisma.lead.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.blockedIp.findMany(),
        ]);
        return { leads, blockedIps: blockedIpRows.map((row) => row.ip), error: null };
    } catch (error) {
        return { leads: [], blockedIps: [], error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.' };
    }
}

export default async function AdminLeadsPage() {
    const { leads, blockedIps, error } = await loadLeads();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">신청 데이터</h1>
            <p className="mt-1 text-sm text-gray-500">챗봇으로 접수된 신청 건을 확인하고 상태·메모를 관리하세요.</p>

            {error ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                    데이터베이스가 아직 연결되지 않았어요. ({error})
                </div>
            ) : (
                <div className="mt-6">
                    <LeadsTable initialLeads={leads} initialBlockedIps={blockedIps} />
                </div>
            )}
        </div>
    );
}

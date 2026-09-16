import Link from 'next/link';

import type { Lead } from '@/generated/prisma/client';
import { formatDateTime } from '@/lib/format';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const STATUS_LIST = ['신규', '연락중', '예약완료', '취소'];

async function loadDashboardData(): Promise<{ leads: Lead[]; error: string | null }> {
    try {
        const prisma = getPrisma();
        const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
        return { leads, error: null };
    } catch (error) {
        return { leads: [], error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.' };
    }
}

export default async function AdminDashboardPage() {
    const { leads, error } = await loadDashboardData();

    if (error) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-900">
                    <p className="font-semibold">데이터베이스가 아직 연결되지 않았어요.</p>
                    <p className="mt-2">
                        Vercel 프로젝트의 Storage 탭에서 Prisma Postgres를 연결하고, 아래 환경변수를 설정한 뒤 다시
                        배포해주세요. (첫 연결 후에는 <code>npx prisma db push</code>를 한 번 실행해 테이블을
                        만들어야 해요.)
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 font-mono text-xs">
                        <li>DATABASE_URL</li>
                        <li>ADMIN_USERNAME</li>
                        <li>ADMIN_PASSWORD</li>
                        <li>ADMIN_SESSION_SECRET</li>
                    </ul>
                    <p className="mt-3 text-xs text-amber-700">{error}</p>
                </div>
            </div>
        );
    }

    const statusCounts = STATUS_LIST.map((status) => ({
        status,
        count: leads.filter((lead) => lead.status === status).length,
    }));

    const recentLeads = leads.slice(0, 5);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
            <p className="mt-1 text-sm text-gray-500">챗봇을 통해 접수된 신청 데이터 현황이에요.</p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400">전체 신청</p>
                    <p className="mt-2 text-2xl font-extrabold text-gray-900">{leads.length}</p>
                </div>
                {statusCounts.map(({ status, count }) => (
                    <div key={status} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400">{status}</p>
                        <p className="mt-2 text-2xl font-extrabold text-brand">{count}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">최근 신청</p>
                    <Link href="/admin/leads" className="text-xs font-semibold text-brand hover:text-brand-dark">
                        전체 보기 →
                    </Link>
                </div>

                {recentLeads.length === 0 ? (
                    <p className="px-6 py-10 text-center text-sm text-gray-400">아직 접수된 신청이 없어요.</p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentLeads.map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between gap-4 px-6 py-4">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                        {lead.name ?? '이름 미입력'} · {lead.destination ?? '-'}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-gray-400">
                                        {lead.phone ?? '-'} · {formatDateTime(lead.createdAt)}
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                                    {lead.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    try {
        const prisma = getPrisma();
        const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Failed to load leads', error);
        return NextResponse.json({ error: '데이터를 불러오지 못했습니다.' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { ensureSchema, getSql, type Lead } from '@/lib/db';

export async function GET() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    try {
        await ensureSchema();
        const sql = getSql();
        const leads = (await sql`SELECT * FROM leads ORDER BY created_at DESC`) as Lead[];
        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Failed to load leads', error);
        return NextResponse.json({ error: '데이터를 불러오지 못했습니다.' }, { status: 500 });
    }
}

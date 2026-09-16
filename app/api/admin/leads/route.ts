import { NextResponse } from 'next/server';

import { ensureSchema, getSql, type Lead } from '@/lib/db';

export async function GET() {
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

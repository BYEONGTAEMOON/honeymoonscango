import { NextResponse } from 'next/server';

import { ensureSchema, getSql } from '@/lib/db';

export async function POST(request: Request) {
    let body: {
        month?: string;
        destination?: string;
        budget?: string;
        region?: string;
        name?: string;
        phone?: string;
        selectedResorts?: string[];
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const { month, destination, budget, region, name, phone, selectedResorts } = body;

    if (!name || !phone) {
        return NextResponse.json({ error: '이름과 연락처는 필수입니다.' }, { status: 400 });
    }

    try {
        await ensureSchema();
        const sql = getSql();
        await sql`
            INSERT INTO leads (month, destination, budget, region, name, phone, selected_resorts)
            VALUES (${month ?? null}, ${destination ?? null}, ${budget ?? null}, ${region ?? null}, ${name}, ${phone}, ${
                selectedResorts && selectedResorts.length > 0 ? selectedResorts.join(', ') : null
            })
        `;
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to save lead', error);
        return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { getPrisma } from '@/lib/prisma';

const ALLOWED_STATUSES = ['신규', '연락중', '예약완료', '취소'];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const leadId = Number(id);
    if (!Number.isInteger(leadId)) {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    let body: { status?: string; memo?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    if (body.status !== undefined && !ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: '허용되지 않는 상태값입니다.' }, { status: 400 });
    }

    if (body.status === undefined && body.memo === undefined) {
        return NextResponse.json({ error: '변경할 내용이 없습니다.' }, { status: 400 });
    }

    try {
        const prisma = getPrisma();
        await prisma.lead.update({
            where: { id: leadId },
            data: {
                ...(body.status !== undefined && { status: body.status }),
                ...(body.memo !== undefined && { memo: body.memo }),
            },
        });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to update lead', error);
        return NextResponse.json({ error: '수정에 실패했습니다.' }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const leadId = Number(id);
    if (!Number.isInteger(leadId)) {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    try {
        const prisma = getPrisma();
        await prisma.lead.delete({ where: { id: leadId } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to delete lead', error);
        return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
    }
}

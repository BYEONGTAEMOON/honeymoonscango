import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { ensureAdminAccountSchema, getSql, type AdminAccount } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';

export async function GET() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    try {
        await ensureAdminAccountSchema();
        const sql = getSql();
        const rows = (await sql`SELECT * FROM admin_account WHERE id = 1`) as AdminAccount[];
        const username = rows[0]?.username ?? process.env.ADMIN_USERNAME ?? '';
        return NextResponse.json({ username });
    } catch {
        return NextResponse.json({ username: process.env.ADMIN_USERNAME ?? '' });
    }
}

export async function PUT(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: { currentPassword?: string; newUsername?: string; newPassword?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const { currentPassword, newUsername, newPassword } = body;
    if (!currentPassword || !newUsername || !newPassword) {
        return NextResponse.json({ error: '모든 항목을 입력해주세요.' }, { status: 400 });
    }
    if (newPassword.length < 8) {
        return NextResponse.json({ error: '새 비밀번호는 8자 이상이어야 해요.' }, { status: 400 });
    }

    try {
        await ensureAdminAccountSchema();
        const sql = getSql();
        const rows = (await sql`SELECT * FROM admin_account WHERE id = 1`) as AdminAccount[];
        const current = rows[0] ?? null;

        const currentValid = current
            ? verifyPassword(currentPassword, current.password_hash)
            : currentPassword === process.env.ADMIN_PASSWORD;

        if (!currentValid) {
            return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        const passwordHash = hashPassword(newPassword);
        await sql`
            INSERT INTO admin_account (id, username, password_hash, updated_at)
            VALUES (1, ${newUsername}, ${passwordHash}, now())
            ON CONFLICT (id) DO UPDATE SET username = ${newUsername}, password_hash = ${passwordHash}, updated_at = now()
        `;

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to update admin account', error);
        return NextResponse.json({ error: '저장에 실패했습니다. 데이터베이스 연결을 확인해주세요.' }, { status: 500 });
    }
}

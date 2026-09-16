import { NextResponse } from 'next/server';

import { ADMIN_SESSION_COOKIE, createSessionToken } from '@/lib/auth';
import { ensureAdminAccountSchema, getSql, type AdminAccount } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

export async function POST(request: Request) {
    let body: { username?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const { username, password } = body;
    if (!username || !password) {
        return NextResponse.json({ error: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    if (!process.env.ADMIN_SESSION_SECRET) {
        return NextResponse.json(
            { error: '관리자 세션이 아직 설정되지 않았습니다. ADMIN_SESSION_SECRET 환경변수를 확인해주세요.' },
            { status: 500 },
        );
    }

    // A DB-stored account (set via /admin/account) always takes priority over the
    // env-var credentials, which only serve as the initial login before anyone
    // has changed anything.
    let dbAccount: AdminAccount | null = null;
    try {
        await ensureAdminAccountSchema();
        const sql = getSql();
        const rows = (await sql`SELECT * FROM admin_account WHERE id = 1`) as AdminAccount[];
        dbAccount = rows[0] ?? null;
    } catch {
        dbAccount = null;
    }

    let authenticated = false;
    let resolvedUsername = '';

    if (dbAccount) {
        // Compute both checks unconditionally (not `&&`-short-circuited) so a
        // wrong username doesn't skip the scrypt hash and make the response
        // measurably faster — that timing gap could otherwise be used to
        // enumerate the valid admin username.
        const passwordMatches = verifyPassword(password, dbAccount.password_hash);
        const usernameMatches = username === dbAccount.username;
        authenticated = usernameMatches && passwordMatches;
        resolvedUsername = dbAccount.username;
    } else {
        const envUsername = process.env.ADMIN_USERNAME;
        const envPassword = process.env.ADMIN_PASSWORD;
        if (!envUsername || !envPassword) {
            return NextResponse.json(
                { error: '관리자 계정이 아직 설정되지 않았습니다. ADMIN_USERNAME / ADMIN_PASSWORD 환경변수를 확인해주세요.' },
                { status: 500 },
            );
        }
        authenticated = username === envUsername && password === envPassword;
        resolvedUsername = envUsername;
    }

    if (!authenticated) {
        return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const token = await createSessionToken(resolvedUsername);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12,
    });
    return response;
}

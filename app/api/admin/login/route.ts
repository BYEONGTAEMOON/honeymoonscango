import { NextResponse } from 'next/server';

import { ADMIN_SESSION_COOKIE, createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
    let body: { username?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const { username, password } = body;
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword || !process.env.ADMIN_SESSION_SECRET) {
        return NextResponse.json(
            { error: '관리자 계정이 아직 설정되지 않았습니다. ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_SESSION_SECRET 환경변수를 확인해주세요.' },
            { status: 500 },
        );
    }

    if (username !== validUsername || password !== validPassword) {
        return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const token = await createSessionToken(validUsername);
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

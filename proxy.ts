import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_SESSION_COOKIE, isAllowedForSubAdmin, readSessionToken } from './lib/auth';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublic = pathname === '/admin/login' || pathname === '/api/admin/login' || pathname === '/api/admin/logout';
    if (isPublic) {
        return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await readSessionToken(token).catch(() => null);

    if (!session) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
        }
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (session.role === 'sub' && !isAllowedForSubAdmin(pathname, request.method)) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};

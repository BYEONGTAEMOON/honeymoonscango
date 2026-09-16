import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_SESSION_COOKIE, verifySessionToken } from './lib/auth';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublic = pathname === '/admin/login' || pathname === '/api/admin/login' || pathname === '/api/admin/logout';
    if (isPublic) {
        return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isValid = await verifySessionToken(token).catch(() => false);

    if (!isValid) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
        }
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};

// Vercel (and most proxies) set x-forwarded-for as "client, proxy1, proxy2, ..." —
// the first entry is the original client. x-real-ip is a fallback for other hosts.
export function getClientIp(request: Request): string | null {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        const first = forwarded.split(',')[0]?.trim();
        if (first) return first;
    }
    const realIp = request.headers.get('x-real-ip');
    return realIp?.trim() || null;
}

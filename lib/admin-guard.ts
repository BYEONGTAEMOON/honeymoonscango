import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_SESSION_COOKIE, readSessionToken, type AdminSession } from './auth';
import { getPrisma } from './prisma';

// proxy.ts already gates /api/admin/** at the routing layer, but Next's own
// docs warn that a matcher change can silently remove that coverage — so
// every admin route also checks its own session here rather than trusting
// the proxy alone.
export async function getAdminSession(): Promise<AdminSession | null> {
    const store = await cookies();
    const session = await readSessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
    if (!session || session.role === 'main') return session;

    // Session tokens are stateless, so a deleted sub-admin's cookie would stay
    // valid until it expires — check the account still exists.
    try {
        const exists = await getPrisma().subAdmin.findUnique({ where: { username: session.username } });
        return exists ? session : null;
    } catch {
        return null;
    }
}

export async function requireAdminSession(): Promise<boolean> {
    return (await getAdminSession()) !== null;
}

export async function requireMainAdmin(): Promise<boolean> {
    return (await getAdminSession())?.role === 'main';
}

// For main-only admin pages: send a sub-admin back to the dashboard.
export async function requireMainAdminPage(): Promise<void> {
    if ((await getAdminSession())?.role !== 'main') redirect('/admin');
}

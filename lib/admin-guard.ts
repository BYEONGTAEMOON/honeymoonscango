import { cookies } from 'next/headers';

import { ADMIN_SESSION_COOKIE, verifySessionToken } from './auth';

// proxy.ts already gates /api/admin/** at the routing layer, but Next's own
// docs warn that a matcher change can silently remove that coverage — so
// every admin-mutating route also checks its own session here rather than
// trusting the proxy alone.
export async function requireAdminSession(): Promise<boolean> {
    const store = await cookies();
    const token = store.get(ADMIN_SESSION_COOKIE)?.value;
    return verifySessionToken(token);
}

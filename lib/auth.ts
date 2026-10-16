export const ADMIN_SESSION_COOKIE = 'admin_session';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret(): string {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) {
        throw new Error('ADMIN_SESSION_SECRET is not set.');
    }
    return secret;
}

async function getKey() {
    const encoder = new TextEncoder();
    return crypto.subtle.importKey('raw', encoder.encode(getSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, [
        'sign',
        'verify',
    ]);
}

function toHex(buffer: ArrayBuffer): string {
    return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sign(payload: string): Promise<string> {
    const key = await getKey();
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return toHex(signature);
}

// The payload is base64url-encoded JSON so it can never contain the "." that
// separates it from the signature — unlike a raw username, which can contain
// almost anything once the login/username is admin-editable.
export type AdminRole = 'main' | 'sub';
export type AdminSession = { username: string; role: AdminRole };

type Payload = { username: string; role?: AdminRole; expiresAt: number };

function encodePayload(data: Payload): string {
    return Buffer.from(JSON.stringify(data), 'utf8').toString('base64url');
}

function decodePayload(encoded: string): Payload | null {
    try {
        const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
        if (typeof parsed?.username === 'string' && typeof parsed?.expiresAt === 'number') {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}

export async function createSessionToken(username: string, role: AdminRole): Promise<string> {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    const payload = encodePayload({ username, role, expiresAt });
    const signature = await sign(payload);
    return `${payload}.${signature}`;
}

export async function readSessionToken(token: string | undefined | null): Promise<AdminSession | null> {
    if (!token) return null;
    const separatorIndex = token.lastIndexOf('.');
    if (separatorIndex === -1) return null;

    const payload = token.slice(0, separatorIndex);
    const signatureHex = token.slice(separatorIndex + 1);

    const decoded = decodePayload(payload);
    if (!decoded || Date.now() > decoded.expiresAt) return null;

    const expectedHex = await sign(payload);
    if (expectedHex.length !== signatureHex.length) return null;

    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) {
        diff |= expectedHex.charCodeAt(i) ^ signatureHex.charCodeAt(i);
    }
    if (diff !== 0) return null;

    // Tokens issued before sub-admins existed carry no role; only the main
    // admin could log in back then.
    return { username: decoded.username, role: decoded.role === 'sub' ? 'sub' : 'main' };
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
    return (await readSessionToken(token)) !== null;
}

// Pages/APIs a sub-admin may reach — everything else under /admin is main-only.
const SUB_ADMIN_PAGES = new Set(['/admin', '/admin/leads']);
const SUB_ADMIN_READ_APIS = new Set(['/api/admin/leads']);

export function isAllowedForSubAdmin(pathname: string, method: string): boolean {
    if (SUB_ADMIN_PAGES.has(pathname)) return true;
    if (pathname === '/api/admin/logout') return true;
    return SUB_ADMIN_READ_APIS.has(pathname) && method === 'GET';
}

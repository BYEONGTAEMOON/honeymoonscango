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

export async function createSessionToken(username: string): Promise<string> {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    const payload = `${username}.${expiresAt}`;
    const signature = await sign(payload);
    return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [username, expiresAtStr, signatureHex] = parts;
    const expiresAt = Number(expiresAtStr);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

    const expectedHex = await sign(`${username}.${expiresAtStr}`);
    if (expectedHex.length !== signatureHex.length) return false;

    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) {
        diff |= expectedHex.charCodeAt(i) ^ signatureHex.charCodeAt(i);
    }
    return diff === 0;
}

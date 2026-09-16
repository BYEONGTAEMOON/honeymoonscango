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
function encodePayload(data: { username: string; expiresAt: number }): string {
    return Buffer.from(JSON.stringify(data), 'utf8').toString('base64url');
}

function decodePayload(encoded: string): { username: string; expiresAt: number } | null {
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

export async function createSessionToken(username: string): Promise<string> {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    const payload = encodePayload({ username, expiresAt });
    const signature = await sign(payload);
    return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
    if (!token) return false;
    const separatorIndex = token.lastIndexOf('.');
    if (separatorIndex === -1) return false;

    const payload = token.slice(0, separatorIndex);
    const signatureHex = token.slice(separatorIndex + 1);

    const decoded = decodePayload(payload);
    if (!decoded || Date.now() > decoded.expiresAt) return false;

    const expectedHex = await sign(payload);
    if (expectedHex.length !== signatureHex.length) return false;

    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) {
        diff |= expectedHex.charCodeAt(i) ^ signatureHex.charCodeAt(i);
    }
    return diff === 0;
}

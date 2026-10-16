import crypto from 'node:crypto';

import { Resend } from 'resend';
import { SolapiMessageService } from 'solapi';

import { getPrisma } from './prisma';

export type NewLeadInfo = {
    name: string | null;
    phone: string | null;
    month: string | null;
    destination: string | null;
    budget: string | null;
    duration: string | null;
    region: string | null;
    selectedResorts: string | null;
};

function buildSummaryLines(lead: NewLeadInfo): string[] {
    return [
        `이름: ${lead.name ?? '-'}`,
        `연락처: ${lead.phone ?? '-'}`,
        `출발월: ${lead.month ?? '-'}`,
        `목적지: ${lead.destination ?? '-'}`,
        `예산: ${lead.budget ?? '-'}`,
        `여행 기간: ${lead.duration ?? '-'}`,
        `거주 지역: ${lead.region ?? '-'}`,
        `선택 리조트: ${lead.selectedResorts ?? '-'}`,
    ];
}

function getResendClient(): Resend | null {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    return new Resend(apiKey);
}

function getSolapiClient() {
    const { SOLAPI_API_KEY, SOLAPI_API_SECRET } = process.env;
    if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) return null;
    return new SolapiMessageService(SOLAPI_API_KEY, SOLAPI_API_SECRET);
}

async function getSmsSender(): Promise<string | null> {
    const prisma = getPrisma();
    const settings = await prisma.notificationSettings.findUnique({ where: { id: 1 } });
    return settings?.smsSender ?? null;
}

export function isMailConfigured(): boolean {
    return getResendClient() !== null;
}

export async function isSmsConfigured(): Promise<boolean> {
    if (!getSolapiClient()) return false;
    return (await getSmsSender()) !== null;
}

// Resend's sandbox sender (onboarding@resend.dev) only delivers to the email
// the Resend account itself is registered with — verify a custom domain in
// Resend to notify arbitrary recipient addresses.
export async function sendEmails(to: string[], lines: string[], subject = '[허니문스캔GO] 새 신청이 접수됐어요') {
    const resend = getResendClient();
    if (!resend || to.length === 0) return;

    const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
    const { error } = await resend.emails.send({ from, to, subject, text: lines.join('\n') });
    if (error) throw new Error(typeof error === 'object' && 'message' in error ? String(error.message) : '이메일 발송 실패');
}

// SOLAPI only accepts bare digits ("01012345678"); recipients saved before
// input was normalized may still contain hyphens or spaces.
export function normalizePhone(value: string): string {
    return value.replace(/\D/g, '');
}

export function isValidMobile(value: string): boolean {
    return /^01[016789]\d{7,8}$/.test(value);
}

// Caller IDs registered (and verified) on the SOLAPI account — sends from any
// other number are rejected by SOLAPI. Returns null when the API can't be asked.
export async function getActiveSenderIds(): Promise<string[] | null> {
    const { SOLAPI_API_KEY, SOLAPI_API_SECRET } = process.env;
    if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) return null;

    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');
    const signature = crypto.createHmac('sha256', SOLAPI_API_SECRET).update(date + salt).digest('hex');
    try {
        const res = await fetch('https://api.solapi.com/senderid/v1/numbers/active', {
            headers: { Authorization: `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}` },
        });
        if (!res.ok) return null;
        const ids: unknown = await res.json();
        return Array.isArray(ids) ? ids.map(String) : null;
    } catch {
        return null;
    }
}

export async function sendSmsMessages(to: string[], lines: string[]) {
    const client = getSolapiClient();
    const sender = await getSmsSender();
    if (!client || !sender || to.length === 0) return;

    const text = `[허니문스캔GO]\n${lines.join('\n')}`;
    const from = normalizePhone(sender);
    const results = await Promise.allSettled(to.map((phone) => client.send({ to: normalizePhone(phone), from, text })));
    const failure = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
    if (failure) throw failure.reason;
}

// Best-effort: a lead must still be saved even if notifications are
// unconfigured or a provider call fails, so every error is swallowed here.
export async function notifyNewLead(lead: NewLeadInfo): Promise<void> {
    try {
        const prisma = getPrisma();
        const recipients = await prisma.notificationRecipient.findMany();
        const emails = recipients.filter((r) => r.type === 'email').map((r) => r.value);
        const phones = recipients.filter((r) => r.type === 'sms').map((r) => r.value);
        if (emails.length === 0 && phones.length === 0) return;

        const lines = buildSummaryLines(lead);
        const results = await Promise.allSettled([sendEmails(emails, lines), sendSmsMessages(phones, lines)]);
        for (const result of results) {
            if (result.status === 'rejected') console.error('Lead notification failed', result.reason);
        }
    } catch (error) {
        console.error('notifyNewLead failed', error);
    }
}

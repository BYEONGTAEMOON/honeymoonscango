import nodemailer from 'nodemailer';
import { SolapiMessageService } from 'solapi';

import { getPrisma } from './prisma';

export type NewLeadInfo = {
    name: string | null;
    phone: string | null;
    month: string | null;
    destination: string | null;
    budget: string | null;
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
        `거주 지역: ${lead.region ?? '-'}`,
        `선택 리조트: ${lead.selectedResorts ?? '-'}`,
    ];
}

function getMailTransport() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) return null;

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
}

function getSmsClient() {
    const { SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_SENDER } = process.env;
    if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET || !SOLAPI_SENDER) return null;
    return { client: new SolapiMessageService(SOLAPI_API_KEY, SOLAPI_API_SECRET), from: SOLAPI_SENDER };
}

export function isMailConfigured(): boolean {
    return getMailTransport() !== null;
}

export function isSmsConfigured(): boolean {
    return getSmsClient() !== null;
}

export async function sendEmails(to: string[], lines: string[], subject = '[허니문스캔GO] 새 신청이 접수됐어요') {
    const transport = getMailTransport();
    if (!transport || to.length === 0) return;

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transport.sendMail({ from, to: to.join(','), subject, text: lines.join('\n') });
}

export async function sendSmsMessages(to: string[], lines: string[]) {
    const sms = getSmsClient();
    if (!sms || to.length === 0) return;

    const text = `[허니문스캔GO]\n${lines.join('\n')}`;
    await Promise.allSettled(to.map((phone) => sms.client.send({ to: phone, from: sms.from, text })));
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

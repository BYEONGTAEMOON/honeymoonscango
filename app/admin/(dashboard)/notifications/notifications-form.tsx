'use client';

import { useState } from 'react';

import type { NotificationRecipient } from '@/generated/prisma/client';

import { SectionCard } from '../section-card';

function ConfigBadge({ configured, label }: { configured: boolean; label: string }) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                configured ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}
        >
            {label} {configured ? '설정됨' : '미설정'}
        </span>
    );
}

function RecipientList({
    type,
    label,
    placeholder,
    recipients,
    onAdd,
    onRemove,
    onTest,
    busy,
    testBusy,
    message,
}: {
    type: 'email' | 'sms';
    label: string;
    placeholder: string;
    recipients: NotificationRecipient[];
    onAdd: (value: string) => void;
    onRemove: (id: number) => void;
    onTest: () => void;
    busy: boolean;
    testBusy: boolean;
    message: { type: 'success' | 'error'; text: string } | null;
}) {
    const [draft, setDraft] = useState('');

    function handleAdd() {
        const value = draft.trim();
        if (!value) return;
        onAdd(value);
        setDraft('');
    }

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                {recipients.length === 0 && <p className="text-xs text-gray-400">등록된 {label} 수신자가 없어요.</p>}
                {recipients.map((recipient) => (
                    <div
                        key={recipient.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                    >
                        <span>{recipient.value}</span>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => onRemove(recipient.id)}
                            className="cursor-pointer rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type={type === 'email' ? 'email' : 'tel'}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
                <button
                    type="button"
                    disabled={busy}
                    onClick={handleAdd}
                    className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-500 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                >
                    + 추가
                </button>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    disabled={testBusy}
                    onClick={onTest}
                    className="cursor-pointer rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {testBusy ? '발송 중...' : '테스트 발송'}
                </button>
                {message && (
                    <p className={`text-xs font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {message.text}
                    </p>
                )}
            </div>
        </div>
    );
}

export function NotificationsForm({
    initialRecipients,
    mailConfigured,
    smsApiConfigured,
    initialSmsSender,
}: {
    initialRecipients: NotificationRecipient[];
    mailConfigured: boolean;
    smsApiConfigured: boolean;
    initialSmsSender: string | null;
}) {
    const [recipients, setRecipients] = useState(initialRecipients);
    const [busy, setBusy] = useState(false);
    const [testBusy, setTestBusy] = useState<'email' | 'sms' | null>(null);
    const [testMessage, setTestMessage] = useState<Record<'email' | 'sms', { type: 'success' | 'error'; text: string } | null>>({
        email: null,
        sms: null,
    });
    const [smsSender, setSmsSender] = useState(initialSmsSender ?? '');
    const [savedSmsSender, setSavedSmsSender] = useState(initialSmsSender);
    const [senderSaving, setSenderSaving] = useState(false);
    const [senderMessage, setSenderMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const smsConfigured = smsApiConfigured && Boolean(savedSmsSender);

    async function saveSmsSender() {
        setSenderSaving(true);
        setSenderMessage(null);
        try {
            const res = await fetch('/api/admin/notification-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ smsSender }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error ?? '저장에 실패했습니다.');
            setSavedSmsSender(data.settings.smsSender);
            setSenderMessage({ type: 'success', text: '저장했어요.' });
        } catch (error) {
            setSenderMessage({ type: 'error', text: error instanceof Error ? error.message : '저장에 실패했습니다.' });
        } finally {
            setSenderSaving(false);
        }
    }

    const emailRecipients = recipients.filter((r) => r.type === 'email');
    const smsRecipients = recipients.filter((r) => r.type === 'sms');

    async function addRecipient(type: 'email' | 'sms', value: string) {
        setBusy(true);
        try {
            const res = await fetch('/api/admin/notification-recipients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, value }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error ?? '추가에 실패했습니다.');
            setRecipients((prev) => [data.recipient, ...prev.filter((r) => r.id !== data.recipient.id)]);
        } catch (error) {
            alert(error instanceof Error ? error.message : '추가에 실패했습니다.');
        } finally {
            setBusy(false);
        }
    }

    async function removeRecipient(id: number) {
        setBusy(true);
        try {
            const res = await fetch('/api/admin/notification-recipients', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) throw new Error('삭제에 실패했습니다.');
            setRecipients((prev) => prev.filter((r) => r.id !== id));
        } catch {
            alert('삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setBusy(false);
        }
    }

    async function sendTest(type: 'email' | 'sms') {
        setTestBusy(type);
        setTestMessage((prev) => ({ ...prev, [type]: null }));
        try {
            const res = await fetch('/api/admin/notification-recipients/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error ?? '발송에 실패했습니다.');
            setTestMessage((prev) => ({ ...prev, [type]: { type: 'success', text: '테스트 발송 완료!' } }));
        } catch (error) {
            setTestMessage((prev) => ({
                ...prev,
                [type]: { type: 'error', text: error instanceof Error ? error.message : '발송에 실패했습니다.' },
            }));
        } finally {
            setTestBusy(null);
        }
    }

    return (
        <div className="space-y-6">
            <SectionCard title="이메일 알림">
                <div className="flex items-center gap-2">
                    <ConfigBadge configured={mailConfigured} label="Resend" />
                    {!mailConfigured && (
                        <span className="text-xs text-gray-400">RESEND_API_KEY 환경변수를 먼저 설정해주세요.</span>
                    )}
                </div>
                <RecipientList
                    type="email"
                    label="이메일"
                    placeholder="예: admin@banhanatour.com"
                    recipients={emailRecipients}
                    onAdd={(value) => addRecipient('email', value)}
                    onRemove={removeRecipient}
                    onTest={() => sendTest('email')}
                    busy={busy}
                    testBusy={testBusy === 'email'}
                    message={testMessage.email}
                />
            </SectionCard>

            <SectionCard title="문자(SMS) 알림">
                <div className="flex items-center gap-2">
                    <ConfigBadge configured={smsConfigured} label="SOLAPI" />
                    {!smsApiConfigured && (
                        <span className="text-xs text-gray-400">SOLAPI_API_KEY / SOLAPI_API_SECRET 환경변수를 먼저 설정해주세요.</span>
                    )}
                </div>

                <div>
                    <span className="text-xs font-semibold text-gray-600">
                        발신번호 <span className="font-normal text-gray-400">(SOLAPI에 사전 등록·인증된 번호만 가능)</span>
                    </span>
                    <div className="mt-1.5 flex items-center gap-2">
                        <input
                            type="tel"
                            value={smsSender}
                            onChange={(e) => setSmsSender(e.target.value)}
                            placeholder="예: 01012345678"
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <button
                            type="button"
                            disabled={senderSaving}
                            onClick={saveSmsSender}
                            className="cursor-pointer rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {senderSaving ? '저장 중...' : '저장'}
                        </button>
                    </div>
                    {senderMessage && (
                        <p className={`mt-1 text-xs font-medium ${senderMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {senderMessage.text}
                        </p>
                    )}
                </div>

                <RecipientList
                    type="sms"
                    label="문자"
                    placeholder="예: 01012345678"
                    recipients={smsRecipients}
                    onAdd={(value) => addRecipient('sms', value)}
                    onRemove={removeRecipient}
                    onTest={() => sendTest('sms')}
                    busy={busy}
                    testBusy={testBusy === 'sms'}
                    message={testMessage.sms}
                />
            </SectionCard>
        </div>
    );
}

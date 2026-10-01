import type { NotificationRecipient } from '@/generated/prisma/client';
import { isMailConfigured, isSmsConfigured } from '@/lib/notify';
import { getPrisma } from '@/lib/prisma';

import { NotificationsForm } from './notifications-form';

export const dynamic = 'force-dynamic';

async function loadRecipients(): Promise<{ recipients: NotificationRecipient[]; error: string | null }> {
    try {
        const prisma = getPrisma();
        const recipients = await prisma.notificationRecipient.findMany({ orderBy: { createdAt: 'desc' } });
        return { recipients, error: null };
    } catch (error) {
        return { recipients: [], error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.' };
    }
}

export default async function AdminNotificationsPage() {
    const { recipients, error } = await loadRecipients();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">알림 설정</h1>
            <p className="mt-1 text-sm text-gray-500">새 신청이 접수되면 이메일·문자로 알려드려요.</p>

            {error ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                    데이터베이스가 아직 연결되지 않았어요. ({error})
                </div>
            ) : (
                <div className="mt-6">
                    <NotificationsForm
                        initialRecipients={recipients}
                        mailConfigured={isMailConfigured()}
                        smsConfigured={isSmsConfigured()}
                    />
                </div>
            )}
        </div>
    );
}

import { requireMainAdminPage } from '@/lib/admin-guard';
import type { NotificationRecipient } from '@/generated/prisma/client';
import { isMailConfigured } from '@/lib/notify';
import { getPrisma } from '@/lib/prisma';

import { NotificationsForm } from './notifications-form';

export const dynamic = 'force-dynamic';

async function loadData(): Promise<{
    recipients: NotificationRecipient[];
    smsSender: string | null;
    smsApiConfigured: boolean;
    error: string | null;
}> {
    try {
        const prisma = getPrisma();
        const [recipients, settings] = await Promise.all([
            prisma.notificationRecipient.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.notificationSettings.findUnique({ where: { id: 1 } }),
        ]);
        return {
            recipients,
            smsSender: settings?.smsSender ?? null,
            smsApiConfigured: Boolean(process.env.SOLAPI_API_KEY && process.env.SOLAPI_API_SECRET),
            error: null,
        };
    } catch (error) {
        return {
            recipients: [],
            smsSender: null,
            smsApiConfigured: false,
            error: error instanceof Error ? error.message : '데이터베이스에 연결할 수 없습니다.',
        };
    }
}

export default async function AdminNotificationsPage() {
    await requireMainAdminPage();
    const { recipients, smsSender, smsApiConfigured, error } = await loadData();

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
                        smsApiConfigured={smsApiConfigured}
                        initialSmsSender={smsSender}
                    />
                </div>
            )}
        </div>
    );
}

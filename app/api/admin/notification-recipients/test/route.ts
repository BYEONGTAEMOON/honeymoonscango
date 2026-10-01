import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-guard';
import { isMailConfigured, isSmsConfigured, sendEmails, sendSmsMessages } from '@/lib/notify';
import { getPrisma } from '@/lib/prisma';

export async function POST(request: Request) {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    let body: { type?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    if (body.type !== 'email' && body.type !== 'sms') {
        return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const testLines = ['테스트 알림입니다.', '이 메시지가 보이면 알림 설정이 정상 작동 중이에요.'];

    try {
        const prisma = getPrisma();
        const recipients = await prisma.notificationRecipient.findMany({ where: { type: body.type } });
        const values = recipients.map((r) => r.value);

        if (values.length === 0) {
            return NextResponse.json({ error: '등록된 수신자가 없어요. 먼저 수신자를 추가해주세요.' }, { status: 400 });
        }

        if (body.type === 'email') {
            if (!isMailConfigured()) {
                return NextResponse.json({ error: 'SMTP 환경변수(SMTP_HOST 등)가 아직 설정되지 않았어요.' }, { status: 400 });
            }
            await sendEmails(values, testLines, '[허니문스캔GO] 테스트 알림');
        } else {
            if (!isSmsConfigured()) {
                return NextResponse.json({ error: 'SOLAPI 환경변수가 아직 설정되지 않았어요.' }, { status: 400 });
            }
            await sendSmsMessages(values, testLines);
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Test notification failed', error);
        const message = error instanceof Error ? error.message : '발송에 실패했습니다.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

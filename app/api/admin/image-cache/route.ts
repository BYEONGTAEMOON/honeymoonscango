import { dangerouslyDeleteBySrcImage } from '@vercel/functions';
import { NextResponse } from 'next/server';

import { safeHoneyCards } from '@/app/components/safe-honey-section';
import { requireAdminSession } from '@/lib/admin-guard';
import { getScenario } from '@/lib/scenario-store';

// Vercel's purge API accepts at most 16 source images per call.
const BATCH_SIZE = 16;

// Vercel keeps optimized remote images for at least 1h and they're keyed by
// URL, so a photo replaced under the same filename on banhanatour.kr keeps
// showing the old version. This deletes every cached transformation of every
// image the site uses so the next request re-fetches the originals.
export async function POST() {
    if (!(await requireAdminSession())) {
        return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const scenario = await getScenario();
    const urls = [
        ...Object.values(scenario.resortsByDestination).flatMap((resorts) => resorts.map((r) => r.image)),
        ...scenario.popularResorts.map((r) => r.image),
        ...safeHoneyCards.map((c) => c.image),
    ];
    const unique = [...new Set(urls.filter((url) => url?.startsWith('https://')))];

    try {
        for (let i = 0; i < unique.length; i += BATCH_SIZE) {
            await dangerouslyDeleteBySrcImage(unique.slice(i, i + BATCH_SIZE));
        }
        return NextResponse.json({ ok: true, count: unique.length });
    } catch (error) {
        console.error('Failed to purge image cache', error);
        return NextResponse.json({ error: '이미지 캐시 삭제에 실패했습니다.' }, { status: 500 });
    }
}

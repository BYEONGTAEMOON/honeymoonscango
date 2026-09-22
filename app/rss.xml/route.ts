import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import { getScenario } from '@/lib/scenario-store';

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    const scenario = await getScenario();

    // Real, admin-managed content (destination → resort list) rendered as feed
    // items — there's no blog on this single-page site, so each destination's
    // current resort lineup stands in for an "entry" rather than fabricating posts.
    const items = Object.entries(scenario.resortsByDestination)
        .filter(([, resorts]) => resorts.length > 0)
        .map(([destination, resorts]) => {
            const names = resorts.map((resort) => resort.name).join(', ');
            return `<item>
<title>${escapeXml(`${destination} 허니문 리조트 추천`)}</title>
<link>${SITE_URL}</link>
<guid isPermaLink="false">${escapeXml(`destination-${destination}`)}</guid>
<description>${escapeXml(`${destination} 추천 리조트: ${names}`)}</description>
</item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escapeXml(SITE_NAME)}</title>
<link>${SITE_URL}</link>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<language>ko-kr</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;

    return new Response(xml, {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    });
}

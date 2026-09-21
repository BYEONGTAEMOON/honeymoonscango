import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

// ImageResponse (Satori) can't parse WOFF2 — this is a static bold instance
// exported to plain TTF from PretendardVariable.woff2 (fonttools varLib
// .instancer wght=800, then re-saved with flavor=None) just for OG/Twitter
// image generation. The real variable font used by the site is unaffected.
const pretendard = readFile(join(process.cwd(), 'app/fonts/Pretendard-Bold-OG.ttf'));

export async function renderOgImage() {
    const fontData = await pretendard;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1559AA 0%, #124C90 100%)',
                    fontFamily: 'Pretendard',
                }}
            >
                <div style={{ fontSize: 64, fontWeight: 800, color: 'white', textAlign: 'center', padding: '0 80px' }}>
                    {SITE_NAME}
                </div>
                <div style={{ marginTop: 28, fontSize: 30, color: 'rgba(255,255,255,0.85)', textAlign: 'center', padding: '0 100px' }}>
                    {SITE_DESCRIPTION}
                </div>
            </div>
        ),
        {
            ...OG_IMAGE_SIZE,
            fonts: [{ name: 'Pretendard', data: fontData, style: 'normal', weight: 800 }],
        },
    );
}

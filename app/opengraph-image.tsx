import { SITE_NAME } from '@/lib/site';

import { OG_IMAGE_SIZE, renderOgImage } from './og-image-shared';

export const alt = SITE_NAME;
export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export default function Image() {
    return renderOgImage();
}

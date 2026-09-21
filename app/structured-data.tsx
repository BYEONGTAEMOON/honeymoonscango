import { SITE_URL } from '@/lib/site';

// Only real, verifiable facts already published on the site (site-footer.tsx) —
// no fabricated ratings, reviews, phone numbers, or offers.
const travelAgency = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: '반하나투어',
    alternateName: '허니문스캔GO',
    url: SITE_URL,
    description: '발리, 몰디브, 태국, 유럽, 하와이, 모리셔스 등 허니문 신혼여행 전문 여행사',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '자유평화로 11 W웨딩시티 2층',
        addressLocality: '부산진구',
        addressRegion: '부산광역시',
        addressCountry: 'KR',
    },
    areaServed: ['부산', '울산', '대구'],
};

const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '반하나투어 허니문 스캔',
    url: SITE_URL,
    inLanguage: 'ko-KR',
};

export function StructuredData() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgency) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
        </>
    );
}

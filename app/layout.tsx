import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

import './globals.css';
import { ScanModalProvider } from './components/scan-modal-context';
import { StructuredData } from './structured-data';

const pretendard = localFont({
    src: './fonts/PretendardVariable.woff2',
    variable: '--font-pretendard',
    weight: '45 920',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    verification: {
        other: {
            'naver-site-verification': 'd17bdb1983d1664e42b6ec7016a3050787246edc',
        },
    },
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: '/',
        siteName: SITE_NAME,
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <StructuredData />
                <ScanModalProvider>{children}</ScanModalProvider>
            </body>
        </html>
    );
}

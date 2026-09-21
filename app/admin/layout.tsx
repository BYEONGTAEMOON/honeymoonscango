import type { Metadata } from 'next';

// Applies to every /admin/* route (both the login page and the (dashboard)
// group) — none of it should ever be indexed, and robots.txt disallows the
// path too, but noindex is the mechanism that also strips already-indexed
// URLs and doesn't depend on crawlers honoring robots.txt.
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return children;
}

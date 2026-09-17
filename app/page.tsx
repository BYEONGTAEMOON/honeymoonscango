import { getScenario } from '@/lib/scenario-store';

import { DealsSection } from './components/deals-section';
import { DestinationSection } from './components/destination-section';
import { HeroSection } from './components/hero-section';
import { HowItWorksSection } from './components/how-it-works-section';
import { ResortsSection } from './components/resorts-section';
import { ReviewsSection } from './components/reviews-section';
import { SafeHoneySection } from './components/safe-honey-section';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { StartNowSection } from './components/start-now-section';
import { TrustSection } from './components/trust-section';

// Destination photos/copy are admin-editable but rarely change, so the home
// page stays statically cached and just revalidates every minute rather than
// hitting the DB on every visitor request.
export const revalidate = 60;

export default async function Home() {
    const scenario = await getScenario();
    const resortsFor = (destination: string) => scenario.resortsByDestination[destination] ?? [];

    return (
        <>
            <SiteHeader />
            <main className="flex-1">
                <HeroSection />
                <TrustSection />
                <DealsSection />
                <ResortsSection />
                <DestinationSection id="bali" destination="발리" resorts={resortsFor('발리')} />
                <DestinationSection destination="태국" resorts={resortsFor('태국')} />
                <DestinationSection destination="유럽" tagline="호텔. 리조트." resorts={resortsFor('유럽')} />
                <DestinationSection destination="몰디브" resorts={resortsFor('몰디브')} />
                <DestinationSection destination="하와이" tagline="오션뷰. 호텔. 리조트." resorts={resortsFor('하와이')} />
                <DestinationSection destination="칸쿤" tagline="오션뷰. 호텔. 리조트." resorts={resortsFor('칸쿤')} />
                <DestinationSection destination="모리셔스" resorts={resortsFor('모리셔스')} />
                <HowItWorksSection />
                <SafeHoneySection />
                <StartNowSection />
                <ReviewsSection />
            </main>
            <SiteFooter />
        </>
    );
}

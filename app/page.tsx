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
                <ResortsSection resorts={scenario.popularResorts} />
                <DestinationSection id="bali" destination="발리" tagline="풀빌라. 액티비티. 프라이빗패키지" resorts={resortsFor('발리')} />
                <DestinationSection destination="코사무이" tagline="휴양. 오션뷰. 프라이빗패키지" resorts={resortsFor('코사무이')} />
                <DestinationSection destination="푸켓" tagline="휴양. 섬투어. 패키지" resorts={resortsFor('푸켓')} />
                <DestinationSection destination="유럽" tagline="도시. 루트." resorts={resortsFor('유럽')} />
                <DestinationSection destination="몰디브" tagline="워터빌라. 프라이빗." resorts={resortsFor('몰디브')} />
                <DestinationSection destination="하와이" tagline="쇼핑. 자유여행." resorts={resortsFor('하와이')} />
                <DestinationSection destination="칸쿤" tagline="올인클루시브. 카리브해." resorts={resortsFor('칸쿤')} />
                <DestinationSection destination="모리셔스" tagline="휴양. 액티비티." resorts={resortsFor('모리셔스')} />
                <HowItWorksSection />
                <SafeHoneySection />
                <StartNowSection />
                <ReviewsSection />
            </main>
            <SiteFooter />
        </>
    );
}

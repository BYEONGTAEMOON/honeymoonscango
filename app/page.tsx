import { DealsSection } from './components/deals-section';
import {
    baliResorts,
    cancunResorts,
    europeResorts,
    hawaiiDestinationResorts,
    maldivesResorts,
    mauritiusResorts,
    thailandResorts,
} from './components/destination-data';
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

export default function Home() {
    return (
        <>
            <SiteHeader />
            <main className="flex-1">
                <HeroSection />
                <TrustSection />
                <DealsSection />
                <ResortsSection />
                <DestinationSection id="bali" destination="발리" resorts={baliResorts} />
                <DestinationSection destination="태국" resorts={thailandResorts} />
                <DestinationSection destination="유럽" tagline="호텔. 리조트." resorts={europeResorts} />
                <DestinationSection destination="몰디브" resorts={maldivesResorts} />
                <DestinationSection destination="하와이" tagline="오션뷰. 호텔. 리조트." resorts={hawaiiDestinationResorts} />
                <DestinationSection destination="칸쿤" tagline="오션뷰. 호텔. 리조트." resorts={cancunResorts} />
                <DestinationSection destination="모리셔스" resorts={mauritiusResorts} />
                <HowItWorksSection />
                <SafeHoneySection />
                <StartNowSection />
                <ReviewsSection />
            </main>
            <SiteFooter />
        </>
    );
}

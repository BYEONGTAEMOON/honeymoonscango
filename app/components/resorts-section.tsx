import Image from 'next/image';

import type { PopularResort } from '@/lib/chatbot-scenario';

import { ArrowRightIcon, MapPinIcon } from './icons';
import { ScanGoButton } from './scan-go-button';

function ResortCard({
    resort,
    hidden = false,
}: {
    resort: PopularResort;
    hidden?: boolean;
}) {
    return (
        <div
            aria-hidden={hidden}
            className="w-[320px] shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:w-[380px]"
        >
            <div className="h-1.5 bg-brand" />

            <div className="relative aspect-[16/9]">
                <Image
                    src={resort.image}
                    alt={resort.name}
                    fill
                    sizes="(min-width: 640px) 380px, 320px"
                    className="object-cover"
                />
                <span className="absolute right-4 top-4 text-sm font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
                    {resort.country}
                </span>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-900" />
                    <h3 className="text-lg font-bold text-gray-900">
                        {resort.name}
                    </h3>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {resort.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {resort.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-brand px-3.5 py-1 text-xs font-medium text-white"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <ScanGoButton
                    destination={resort.country}
                    tabIndex={hidden ? -1 : undefined}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-brand"
                >
                    허니문 스캔GO
                    <ArrowRightIcon className="h-4 w-4" />
                </ScanGoButton>
            </div>
        </div>
    );
}

export function ResortsSection({ resorts }: { resorts: PopularResort[] }) {
    return (
        <section id="resorts" className="scroll-mt-20 border-t border-gray-100 py-20 md:py-28">
            <div className="mx-auto max-w-2xl px-6 text-center md:px-10">
                <p className="text-sm font-medium tracking-[0.2em] text-gray-400">
                    PREMIUM RESORTS & HOTELS
                </p>
                <h2 className="mt-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
                    허니문 <span className="text-brand">인기 숙소</span>{' '}
                    둘러보기
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-500 md:text-base">
                    전 세계 엄선된 럭셔리 리조트·풀빌라를 한눈에 비교하고
                    <br />한 번에 맞춤 견적을 받아보세요.
                </p>
            </div>

            <div className="relative mt-14 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <div className="flex w-max animate-[marquee_45s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
                    {resorts.map((resort) => (
                        <ResortCard key={resort.slug} resort={resort} />
                    ))}
                    {resorts.map((resort) => (
                        <ResortCard
                            key={`${resort.slug}-repeat`}
                            resort={resort}
                            hidden
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

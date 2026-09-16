import Image from 'next/image';

import { ArrowRightIcon, MapPinIcon } from './icons';
import { ScanGoButton } from './scan-go-button';

export type DestinationResort = {
    slug: string;
    name: string;
    description: string;
    tags: string[];
};

type DestinationSectionProps = {
    id?: string;
    destination: string;
    tagline?: string;
    resorts: DestinationResort[];
};

export function DestinationSection({ id, destination, tagline = '오션뷰. 풀빌라. 리조트.', resorts }: DestinationSectionProps) {
    return (
        <section id={id} className="scroll-mt-20 border-t border-gray-100 px-6 py-20 md:px-10 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-medium tracking-[0.2em] text-gray-400">POOL VILLA & LUXURY STAY</p>

                <h2 className="mt-4 text-4xl font-extrabold text-brand md:text-5xl">{destination}</h2>
                <p className="mt-2 text-4xl font-extrabold text-gray-900 md:text-5xl">{tagline}</p>
                <p className="mt-1 text-4xl font-extrabold text-brand md:text-5xl">렛츠GO</p>

                <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-gray-500 md:text-base">
                    둘만의 프라이빗한 휴식 — 탁 트인 오션뷰
                    <br />
                    최상급 서비스, 완벽한 프라이버시 보장.
                </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
                {resorts.map((resort) => (
                    <div key={resort.slug} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="relative aspect-[9/4]">
                            <Image
                                src={`https://picsum.photos/seed/${resort.slug}/800/360`}
                                alt={resort.name}
                                fill
                                sizes="(min-width: 768px) 500px, 100vw"
                                className="object-cover"
                            />
                            <span className="absolute -bottom-4 left-5 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white ring-[3px] ring-white">
                                <MapPinIcon className="h-4 w-4" />
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 p-5 pt-7">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-bold text-gray-900">{resort.name}</h3>
                                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{resort.description}</p>
                                <div className="mt-2.5 flex flex-nowrap gap-1.5">
                                    {resort.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-[11px] font-medium text-white"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <ScanGoButton
                                destination={destination}
                                className="inline-flex shrink-0 flex-col items-center justify-center whitespace-nowrap rounded-[10px] bg-brand px-4 py-2.5 text-center text-xs font-bold leading-tight text-white transition-colors hover:bg-brand-dark"
                            >
                                <span>허니문</span>
                                <span>스캔GO</span>
                            </ScanGoButton>
                        </div>

                        <div className="h-2 bg-brand" />
                    </div>
                ))}
            </div>

            <div className="mx-auto mt-8 max-w-5xl rounded-2xl bg-brand px-6 py-8 text-center text-white">
                <p className="font-semibold">이외 다른 오션뷰 풀빌라 리조트 여행을 빠르게 찾아드립니다.</p>
                <ScanGoButton
                    destination={destination}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand transition-colors hover:bg-gray-100"
                >
                    허니문 스캔GO 바로가기
                    <ArrowRightIcon className="h-4 w-4" />
                </ScanGoButton>
            </div>
        </section>
    );
}

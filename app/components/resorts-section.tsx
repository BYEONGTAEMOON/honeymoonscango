import Image from 'next/image';

import { ArrowRightIcon, MapPinIcon } from './icons';
import { ScanGoButton } from './scan-go-button';

type Resort = {
    slug: string;
    country: string;
    name: string;
    description: string;
    tags: string[];
};

const resorts: Resort[] = [
    {
        slug: 'villa-amorita',
        country: '태국',
        name: '빌라 아모리타',
        description:
            '울창한 정글 뷰와 프라이빗 풀을 품은 코사무이의 조용한 은신처',
        tags: ['프라이빗풀', '정글뷰', '태국감성'],
    },
    {
        slug: 'grand-gaube',
        country: '모리셔스',
        name: '그랑고브',
        description:
            '세계적인 디자이너 켈리 호펜의 세련된 레트로 시크 감성과 두 개의 프라이빗 비치를 품은 모리셔스 북부의 감성 럭셔리 리조트',
        tags: ['모리셔스감성', '켈리호펜', '레트로시크'],
    },
    {
        slug: 'the-mulia',
        country: '발리',
        name: '더 물리아',
        description:
            '압도적인 스케일의 시그니처 오아시스 풀과 24시간 전담 버틀러 서비스를 갖춘 6성급 올 스위트 오션프런트 왕국',
        tags: ['6성급 럭셔리', '럭셔리', '오아시스풀'],
    },
    {
        slug: 'pavilion-samui',
        country: '태국',
        name: '파빌리온 사무이',
        description:
            '라마이 비치의 황금빛 해변을 앞마당처럼 품은 태국 전통미와 프라이빗 풀빌라의 낭만적인 은신처',
        tags: ['라마이비치', '프라이빗', '태국감성'],
    },
    {
        slug: 'aira-phuket',
        country: '태국',
        name: '아이라 푸켓',
        description:
            '울창한 열대우림 속 목조 감성 가득한 프라이빗 빌라를 품은 푸켓의 숨은 낙원',
        tags: ['푸켓감성', '프라이빗빌라', '열대우드'],
    },
    {
        slug: 'four-seasons-hawaii',
        country: '하와이',
        name: '포시즌스 하와이',
        description:
            '와이키키 해변을 마주한 오션뷰 스위트와 프리미엄 다이닝을 갖춘 하와이 대표 허니문 리조트',
        tags: ['하와이감성', '오션뷰', '프리미엄'],
    },
];

function ResortCard({
    resort,
    hidden = false,
}: {
    resort: Resort;
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
                    src={`https://picsum.photos/seed/${resort.slug}/800/450`}
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

export function ResortsSection() {
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

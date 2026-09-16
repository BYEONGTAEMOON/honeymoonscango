import { StarIcon } from './icons';

const badgeColors = {
    navy: 'bg-slate-800',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
} as const;

type Review = {
    initial: string;
    color: keyof typeof badgeColors;
    destination: string;
    quote: string;
    couple: string;
    detail: string;
    daysAgo: number;
};

const reviews: Review[] = [
    {
        initial: '문',
        color: 'navy',
        destination: '발리',
        quote: '질문 몇 개에 저희 취향을 딱 파악해서 가성비와 고급스러움 다 잡은 리조트를 골라주셨어요.',
        couple: '문**·송**우 커플',
        detail: '발리 원일레븐 4박 6일',
        daysAgo: 2,
    },
    {
        initial: '한',
        color: 'orange',
        destination: '칸쿤',
        quote: '패키지여행 특유의 쇼핑 강요나 원치 않는 옵션 투어가 전혀 없어서 너무 좋았어요. 완벽한 자유형 신혼여행이었습니다.',
        couple: '한**·김** 커플',
        detail: '칸쿤 바르셀로 마야 5박 7일',
        daysAgo: 3,
    },
    {
        initial: '김',
        color: 'pink',
        destination: '발리',
        quote: '주말 예식 직후 바로 출발하는 황금 시간대 항공권 잡기가 힘들었는데, 실시간 잔여좌석 확인이 가장 편한 스케줄로 딱 잡아주셨어요.',
        couple: '김**·최** 부부',
        detail: '발리 아유테라 4박 6일',
        daysAgo: 5,
    },
    {
        initial: '이',
        color: 'navy',
        destination: '하와이',
        quote: '요즘 여행사 관련 이슈가 많아 불안했는데, 11년 넘은 업력에 보험까지 명확히 확인시켜 주셔서 계약금 낼 때 마음이 정말 놓였습니다.',
        couple: '이**·박** 부부',
        detail: '하와이 쉐라톤와이키키 5박 7일',
        daysAgo: 6,
    },
    {
        initial: '정',
        color: 'orange',
        destination: '유럽',
        quote: '유럽은 이동 동선 짜는 게 너무 복잡해서 막막했거든요. 상담 신청하고 기차 이동과 호텔 위치까지 완벽하게 맞춘 최적 루트를 받았어요.',
        couple: '정**·강** 커플',
        detail: '유럽 선스타 그린델발트 5박 7일',
        daysAgo: 8,
    },
    {
        initial: '김',
        color: 'pink',
        destination: '태국',
        quote: '왕궁을 그대로 재현한 웅장한 건축미에 압도됐어요. 라마이 비치 전용 풀빌라라 프라이버시도 완벽했습니다.',
        couple: '김**·오** 부부',
        detail: '태국 아만타라푸라 4박 6일',
        daysAgo: 9,
    },
    {
        initial: '박',
        color: 'navy',
        destination: '몰디브',
        quote: '전 객실 프라이빗 풀에 워터파크까지 있어서 하루 종일 놀았어요. 올인클루시브라 추가 비용 걱정도 없었고요.',
        couple: '박**·유** 커플',
        detail: '몰디브 시암 월드 몰디브 5박 7일',
        daysAgo: 10,
    },
    {
        initial: '서',
        color: 'orange',
        destination: '유럽',
        quote: '파리 8구 중심가라 어디든 걸어서 다닐 수 있었고, 조식과 룸 컨디션이 기대 이상이었습니다.',
        couple: '서**·남** 부부',
        detail: '유럽 르 마튀랭 4박 6일',
        daysAgo: 11,
    },
    {
        initial: '조',
        color: 'pink',
        destination: '하와이',
        quote: '로비 오션아리움부터 인생샷 각이더라고요. 인피니티 풀 카바나 예약까지 미리 잡아주셔서 편했어요.',
        couple: '조**·윤** 커플',
        detail: '하와이 알로힐라니 5박 7일',
        daysAgo: 12,
    },
    {
        initial: '배',
        color: 'navy',
        destination: '발리',
        quote: '검은 모래 해변이 신기했고, 서핑하는 사람들 구경하며 여유롭게 쉬다 왔어요. 조식도 정말 훌륭했습니다.',
        couple: '배**·전** 부부',
        detail: '발리 코마네카 앳 케라마스 비치 4박 6일',
        daysAgo: 13,
    },
    {
        initial: '노',
        color: 'orange',
        destination: '칸쿤',
        quote: '3면이 바다로 둘러싸인 오션뷰가 압도적이었어요. 미식 다이닝 프로그램도 알차게 안내해주셨습니다.',
        couple: '노**·임** 커플',
        detail: '칸쿤 하얏트 지바 5박 7일',
        daysAgo: 15,
    },
    {
        initial: '신',
        color: 'pink',
        destination: '태국',
        quote: '성인 전용 구역이라 조용하고 프라이빗했어요. 에메랄드빛 바다뷰 인피니티 풀은 잊지 못할 것 같아요.',
        couple: '신**·구** 부부',
        detail: '태국 더 쇼어 앳 카타타니 4박 6일',
        daysAgo: 17,
    },
    {
        initial: '홍',
        color: 'navy',
        destination: '모리셔스',
        quote: '두 개의 프라이빗 비치를 오가며 매일 다른 풍경을 즐겼어요. 인테리어 감성이 정말 남달랐습니다.',
        couple: '홍**·차** 커플',
        detail: '모리셔스 럭스 그랑고브 5박 7일',
        daysAgo: 19,
    },
    {
        initial: '백',
        color: 'orange',
        destination: '하와이',
        quote: '쇼핑몰과 해변 접근성이 좋아서 짧은 일정에도 알차게 돌아다녔어요. 가성비도 훌륭했습니다.',
        couple: '백**·서** 부부',
        detail: '하와이 힐튼 가든 인 4박 6일',
        daysAgo: 21,
    },
    {
        initial: '문',
        color: 'pink',
        destination: '유럽',
        quote: '이메로비글리 칼데라 절벽 뷰 앞에서 본 산토리니 석양은 평생 잊지 못할 것 같아요.',
        couple: '문**·하** 커플',
        detail: '유럽 어보브 블루 스위트 5박 7일',
        daysAgo: 24,
    },
];

function ReviewCard({ review, hidden = false }: { review: Review; hidden?: boolean }) {
    return (
        <div
            aria-hidden={hidden}
            className="flex h-[260px] w-[280px] shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
            <div className="flex items-start justify-between">
                <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4" />
                    ))}
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${badgeColors[review.color]}`}
                    >
                        {review.destination}
                    </span>
                    <span className="text-[11px] text-gray-400">{review.daysAgo}일 전</span>
                </div>
            </div>

            <p className="mt-3 line-clamp-3 min-h-[63px] text-sm leading-relaxed text-gray-600">{review.quote}</p>

            <div className="mt-auto flex items-center gap-2.5 border-t border-gray-100 pt-4">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${badgeColors[review.color]}`}
                >
                    {review.initial}
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{review.couple}</p>
                    <p className="truncate text-xs text-gray-400">{review.detail}</p>
                </div>
            </div>
        </div>
    );
}

export function ReviewsSection() {
    return (
        <section id="reviews" className="scroll-mt-20 border-t border-gray-100 py-20 md:py-28">
            <div className="mx-auto max-w-2xl px-6 text-center md:px-10">
                <h2 className="text-4xl font-extrabold leading-snug text-gray-900 md:text-5xl">
                    다녀온 신혼부부들이
                    <br />
                    직접 전하는 <span className="text-brand">100% 찐 후기</span>
                </h2>
                <p className="mt-4 text-sm font-medium tracking-[0.2em] text-gray-400">
                    REAL STORIES HONEYMOON WITH BANHANATOUR
                </p>
            </div>

            <div className="relative mt-14 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <div className="flex w-max animate-[marquee_100s_linear_infinite] gap-5 hover:[animation-play-state:paused]">
                    {reviews.map((review) => (
                        <ReviewCard key={review.couple} review={review} />
                    ))}
                    {reviews.map((review) => (
                        <ReviewCard key={`${review.couple}-repeat`} review={review} hidden />
                    ))}
                </div>
            </div>
        </section>
    );
}

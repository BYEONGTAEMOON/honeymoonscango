import { MapPinIcon, PlaneIcon, SuitcaseIcon, TicketIcon } from './icons';
import { ScanGoButton } from './scan-go-button';

const badges = [
    { icon: SuitcaseIcon, label: '50+ 제휴 호텔 리조트 & 항공' },
    { icon: TicketIcon, label: '허니문 전용 특전 혜택' },
    { icon: PlaneIcon, label: '출발일별 잔여좌석 확인' },
];

const features = [
    {
        icon: SuitcaseIcon,
        title: '신혼여행 지원혜택',
        description: ['항공·풀빌라 얼리버드 할인부터', '스냅 촬영·스파 바우처 혜택까지'],
    },
    {
        icon: MapPinIcon,
        title: '허니문 맞춤 상담 서비스',
        description: ['여기저기 발품 팔지 않아도', '한 곳에서 전문가 1:1 일정 컨설팅'],
    },
    {
        icon: PlaneIcon,
        title: '실시간 특가·최적 동선 비교',
        description: ['우리가 원하는 출발일에', '최대 혜택 리조트 & 항공 정보 제공'],
    },
];

export function HeroSection() {
    return (
        <section className="px-6 pb-20 pt-20 md:px-10 md:pt-28">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-medium tracking-[0.2em] text-gray-400">Honeymoon Scan Go</p>

                <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
                    복잡한 <span className="text-brand">허니문</span> 비교견적
                    <br />
                    일정 상담을 <span className="text-brand">속 시원하게 한 번에!</span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 md:text-lg">
                    발리·하와이·유럽·몰디브 인기 신혼여행지를 한 곳에서 비교하고 예약하세요.
                    <br />
                    꿈꾸던 신행의 시작입니다.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <ScanGoButton className="inline-flex items-center justify-center rounded-lg bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:text-base">
                        내 스타일 허니문 찾기
                    </ScanGoButton>
                    <a
                        href="#resorts"
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:text-base"
                    >
                        인기 여행지 둘러보기
                    </a>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    {badges.map(({ icon: Icon, label }) => (
                        <span
                            key={label}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-600"
                        >
                            <Icon className="h-4 w-4 text-brand" />
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
                {features.map(({ icon: Icon, title, description }) => (
                    <div
                        key={title}
                        className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-8 py-10 text-center"
                    >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
                            <Icon className="h-6 w-6" />
                        </span>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm leading-relaxed text-gray-500">
                            {description[0]}
                            <br />
                            {description[1]}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

import { ClipboardCheckIcon, ShieldCheckIcon } from './icons';

const cards = [
    {
        icon: ShieldCheckIcon,
        title: ['11년 무사고', '수천 쌍이 입증한 신뢰'],
        description: [
            '말뿐인 안심이 아닌 10년간 축적된 현지 인프라와 직영 네트워크',
            '어떤 돌발 변수에도 흔들리지 않는 현지 위기 대응 매뉴얼이 갖춰져 있습니다.',
        ],
    },
    {
        icon: ClipboardCheckIcon,
        title: ['위기 속에서도', '끝까지 책임진 11년'],
        description: [
            '여행업계 최악의 팬데믹과 수많은 위기 속에서도 폐업 없이 11년 동안',
            '고객과의 약속을 끝까지 지켜낸 탄탄한 재무 건전성을 자부합니다.',
        ],
    },
];

export function TrustSection() {
    return (
        <section className="border-t border-gray-100 px-6 py-20 md:px-10 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="mt-6 text-4xl font-extrabold leading-snug text-gray-900 md:text-5xl">
                    안전한 <span className="text-brand">여행</span>을 위한
                    <br />
                    11년을 함께 한{' '}
                    <span className="text-brand">반하나투어</span>
                </h2>

                <p className="mt-3 text-xl font-bold text-gray-900">
                    Safe Travel
                </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-2">
                {cards.map(({ icon: Icon, title, description }) => (
                    <div
                        key={title[0]}
                        className="relative rounded-2xl bg-gray-50 p-12"
                    >
                        <Icon className="absolute right-10 top-10 h-20 w-20 text-gray-900" />
                        <h3 className="max-w-[70%] text-2xl font-bold leading-snug text-gray-900">
                            {title[0]}
                            <br />
                            {title[1]}
                        </h3>
                        <p className="mt-5 text-sm leading-relaxed text-gray-500">
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

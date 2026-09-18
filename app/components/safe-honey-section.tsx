import Image from 'next/image';

const cards = [
    {
        slug: 'meritz-tower',
        stat: '총 10억 원',
        label: '공제영업보증 가입',
        image: 'https://banhanatour.kr/images/honeymoonscango/safe_01.jpg',
    },
    {
        slug: 'sgi-seoul-guarantee',
        stat: '총 1억 원',
        label: '영업배상책임보험 가입',
        image: 'https://banhanatour.kr/images/honeymoonscango/safe_02.jpg',
    },
    {
        slug: 'banhana-office',
        stat: '11년 연속',
        label: '정상 영업 & 무사고',
        image: 'https://banhanatour.kr/images/honeymoonscango/safe_03.jpg',
    },
];

export function SafeHoneySection() {
    return (
        <section className="border-t border-gray-100 px-6 py-20 md:px-10 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-4xl font-extrabold leading-snug text-gray-900 md:text-5xl">
                    안전한 <span className="text-brand">허니문</span>을 위한
                    <br />
                    11년을 함께 한 <span className="text-brand">반하나투어</span>
                </h2>

                <p className="mt-3 text-xl font-bold text-gray-900">
                    Safe Honey <span className="text-brand">BanhanaTour</span>
                </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
                {cards.map((card) => (
                    <div key={card.slug} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                        <Image
                            src={card.image}
                            alt={card.label}
                            fill
                            sizes="(min-width: 640px) 33vw, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6">
                            <p className="text-2xl font-extrabold text-white">{card.stat}</p>
                            <p className="mt-1 text-sm font-medium text-white/90">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

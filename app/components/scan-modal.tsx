'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { applyTemplate, type ChatbotScenario } from '@/lib/chatbot-scenario';

import {
    baliResorts,
    cancunResorts,
    europeResorts,
    hawaiiDestinationResorts,
    maldivesResorts,
    mauritiusResorts,
    thailandResorts,
} from './destination-data';
import type { DestinationResort } from './destination-section';
import { CheckIcon, CloseIcon, GiftIcon, SearchIcon, SendIcon } from './icons';

const australiaResorts: DestinationResort[] = [
    {
        slug: 'sydney-harbour-suite',
        name: '시드니 하버 뷰 스위트',
        description: '오페라하우스와 하버브리지를 한눈에 담은 시드니 대표 오션뷰 스카이라인 스위트',
        tags: ['시드니하버뷰', '오페라하우스뷰', '스카이라인스위트'],
    },
    {
        slug: 'gold-coast-q1-resort',
        name: '골드코스트 큐원 리조트',
        description: '서퍼스 파라다이스 해변을 마주한 인피니티 풀과 오션뷰 스위트를 갖춘 리조트',
        tags: ['골드코스트', '서퍼스파라다이스', '인피니티풀'],
    },
    {
        slug: 'cairns-reef-suite',
        name: '케언즈 리프 스위트',
        description: '그레이트 배리어 리프 투어 거점, 열대 정원 속 프라이빗 풀빌라',
        tags: ['케언즈', '그레이트배리어리프', '프라이빗풀빌라'],
    },
    {
        slug: 'melbourne-boutique-hotel',
        name: '멜버른 시티 부티크 호텔',
        description: '야라강변 감성 거리와 카페 문화를 도보로 즐기는 멜버른 중심가 부티크 호텔',
        tags: ['멜버른시티', '야라강변', '부티크호텔'],
    },
];

const dubaiResorts: DestinationResort[] = [
    {
        slug: 'burj-al-arab',
        name: '버즈 알 아랍 주메이라',
        description: '세계적인 7성급 럭셔리, 아라비아만을 마주한 독보적인 스카이라인 스위트',
        tags: ['7성급럭셔리', '아라비아만뷰', '두바이랜드마크'],
    },
    {
        slug: 'atlantis-the-palm',
        name: '아틀란티스 더 팜',
        description: '팜 주메이라의 상징적 수중 스위트와 아쿠아벤처 워터파크를 갖춘 초대형 리조트',
        tags: ['팜주메이라', '언더워터스위트', '워터파크'],
    },
    {
        slug: 'madinat-jumeirah',
        name: '매디낫 주메이라',
        description: '전통 아랍 건축미와 수로를 품은 로맨틱 리조트 빌리지',
        tags: ['아랍전통건축', '수로뷰빌리지', '로맨틱리조트'],
    },
    {
        slug: 'downtown-dubai-boutique',
        name: '다운타운 두바이 부티크 호텔',
        description: '부르즈 할리파 뷰와 분수쇼를 즐기는 도심 럭셔리 부티크 호텔',
        tags: ['부르즈할리파뷰', '분수쇼뷰', '다운타운두바이'],
    },
];

const guamResorts: DestinationResort[] = [
    {
        slug: 'dusit-thani-guam',
        name: '두짓타니 괌 리조트',
        description: '타무닝 해변의 프라이빗 라군과 성인 전용 인피니티 풀을 갖춘 럭셔리 리조트',
        tags: ['타무닝비치', '성인전용풀', '프라이빗라군'],
    },
    {
        slug: 'holiday-resort-guam',
        name: '홀리데이 리조트 괌',
        description: '투몬 비치 중심가에서 쇼핑과 해변을 동시에 누리는 가성비 리조트',
        tags: ['투몬비치중심', '가성비숙소', '쇼핑접근성'],
    },
    {
        slug: 'westin-resort-guam',
        name: '웨스틴 리조트 괌',
        description: '투몬 베이 프라이빗 비치와 오션뷰 스위트를 갖춘 대표 허니문 리조트',
        tags: ['투몬베이', '오션뷰스위트', '허니문대표리조트'],
    },
    {
        slug: 'royal-orchid-guam',
        name: '로얄 오키드 괌',
        description: '투몬 비치 프런트에 위치한 아늑하고 합리적인 부티크 리조트',
        tags: ['투몬비치프런트', '가성비부티크', '아늑한객실'],
    },
];

const cebuResorts: DestinationResort[] = [
    {
        slug: 'shangri-la-mactan-cebu',
        name: '샹그릴라 막탄 세부',
        description: '막탄섬 프라이빗 비치와 라군풀을 갖춘 세부 대표 럭셔리 리조트',
        tags: ['막탄프라이빗비치', '라군풀', '세부대표리조트'],
    },
    {
        slug: 'crimson-resort-mactan',
        name: '크림슨 리조트 막탄',
        description: '인피니티 풀과 오션뷰 스위트를 갖춘 모던 럭셔리 비치 리조트',
        tags: ['모던럭셔리', '오션뷰스위트', '인피니티풀'],
    },
    {
        slug: 'plantation-bay-resort',
        name: '플랜테이션 베이 리조트',
        description: '인공 라군과 워터파크를 품은 독특한 콘셉트의 대형 리조트',
        tags: ['인공라군', '워터파크', '패밀리허니문'],
    },
    {
        slug: 'movenpick-mactan-cebu',
        name: '모벤픽 호텔 막탄 세부',
        description: '화이트샌드 비치와 다이빙 포인트에 인접한 스위스 감성 럭셔리 호텔',
        tags: ['화이트샌드비치', '다이빙포인트', '스위스감성'],
    },
];

const RESORTS_BY_DESTINATION: Record<string, DestinationResort[]> = {
    발리: baliResorts,
    태국: thailandResorts,
    유럽: europeResorts,
    몰디브: maldivesResorts,
    하와이: hawaiiDestinationResorts,
    칸쿤: cancunResorts,
    모리셔스: mauritiusResorts,
    호주: australiaResorts,
    두바이: dubaiResorts,
    괌: guamResorts,
    세부: cebuResorts,
};

type Step = 'month' | 'destination' | 'budget' | 'resorts' | 'contact' | 'region' | 'name' | 'done';

const STEP_ORDER: Step[] = ['month', 'destination', 'budget', 'resorts', 'contact', 'region', 'name', 'done'];

const STEP_LABEL: Record<Step, string> = {
    month: '출발월 확인 중',
    destination: '목적지 확인 중',
    budget: '예산 확인 중',
    resorts: '희망 리조트 선택 중',
    contact: '자료 받을 번호 확인 중',
    region: '거주 지역 확인 중',
    name: '신청자 이름 확인 중',
    done: '접수 완료',
};

const PLACEHOLDER_BY_STEP: Record<Step, string> = {
    month: '예: 2027년 3월',
    destination: '예: 발리',
    budget: '예: 500만원',
    resorts: '위 후보에서 최대 3곳까지 선택하세요',
    contact: '010 1234 5678',
    region: '예: 부산',
    name: '황호진',
    done: '상담이 접수되었습니다',
};

type OptionKind = 'month' | 'destination' | 'budget' | 'region';

type Entry =
    | { id: string; type: 'bot'; text: string }
    | { id: string; type: 'user'; text: string }
    | { id: string; type: 'options'; kind: OptionKind; options: string[] }
    | { id: string; type: 'resort-picker'; destination: string }
    | { id: string; type: 'checklist' }
    | { id: string; type: 'completion'; name: string }
    | { id: string; type: 'typing' };

function formatPhoneInput(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}

function formatNameInput(raw: string): string {
    return raw.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, '');
}

function buildUpcomingMonths(count: number): string[] {
    const now = new Date();
    const months: string[] = [];
    for (let i = 1; i <= count; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        months.push(`${d.getFullYear()}년 ${d.getMonth() + 1}월`);
    }
    return months;
}

let idCounter = 0;
function nextId() {
    idCounter += 1;
    return `entry-${idCounter}`;
}

function initialTranscript(scenario: ChatbotScenario): Entry[] {
    return [
        { id: nextId(), type: 'bot', text: scenario.introMessage },
        { id: nextId(), type: 'options', kind: 'month', options: buildUpcomingMonths(scenario.monthCount) },
    ];
}

type ScanModalProps = {
    isOpen: boolean;
    onClose: () => void;
    prefillDestination?: string;
    scenario: ChatbotScenario;
};

function ScanModalInner({ onClose, prefillDestination, scenario }: Omit<ScanModalProps, 'isOpen'>) {
    const [step, setStep] = useState<Step>('month');
    const [entries, setEntries] = useState<Entry[]>(() => initialTranscript(scenario));
    const [selectedResorts, setSelectedResorts] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const appliedPrefillRef = useRef(false);
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const leadDataRef = useRef<{ month?: string; destination?: string; budget?: string; region?: string; phone?: string }>({});

    useEffect(() => {
        const pendingTimeouts = timeoutsRef.current;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
            pendingTimeouts.forEach(clearTimeout);
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [entries]);

    const progress = useMemo(() => {
        const idx = STEP_ORDER.indexOf(step);
        return Math.round((idx / (STEP_ORDER.length - 1)) * 100);
    }, [step]);

    function appendNow(entry: Entry) {
        setEntries((prev) => [...prev, entry]);
    }

    function appendBotSequence(botEntries: Entry[], nextStep: Step, delayMs = 800) {
        const typingId = nextId();
        setIsTyping(true);
        setEntries((prev) => [...prev, { id: typingId, type: 'typing' }]);
        const timeoutId = setTimeout(() => {
            setEntries((prev) => [...prev.filter((e) => e.id !== typingId), ...botEntries]);
            setStep(nextStep);
            setIsTyping(false);
        }, delayMs);
        timeoutsRef.current.push(timeoutId);
    }

    function handleMonthAnswer(value: string) {
        appendNow({ id: nextId(), type: 'user', text: value });
        leadDataRef.current.month = value;

        if (prefillDestination && !appliedPrefillRef.current) {
            appliedPrefillRef.current = true;
            leadDataRef.current.destination = prefillDestination;
            appendBotSequence(
                [
                    {
                        id: nextId(),
                        type: 'bot',
                        text: `${value} 예정으로 항공 잔여좌석과 견적 조회 도와드릴게요. ✨\n\n방금 보고 계셨던 ${prefillDestination} 여행으로 이어서 진행할게요. 📍`,
                    },
                    { id: nextId(), type: 'user', text: prefillDestination },
                    { id: nextId(), type: 'bot', text: scenario.budgetQuestion },
                    { id: nextId(), type: 'options', kind: 'budget', options: scenario.budgets },
                ],
                'budget',
            );
            return;
        }

        appendBotSequence(
            [
                { id: nextId(), type: 'bot', text: applyTemplate(scenario.destinationQuestion, { value }) },
                { id: nextId(), type: 'options', kind: 'destination', options: scenario.destinations },
            ],
            'destination',
        );
    }

    function handleDestinationAnswer(value: string) {
        appendNow({ id: nextId(), type: 'user', text: value });
        leadDataRef.current.destination = value;
        appendBotSequence(
            [
                { id: nextId(), type: 'bot', text: scenario.budgetQuestion },
                { id: nextId(), type: 'options', kind: 'budget', options: scenario.budgets },
            ],
            'budget',
        );
    }

    function handleBudgetAnswer(value: string) {
        appendNow({ id: nextId(), type: 'user', text: value });
        leadDataRef.current.budget = value;

        const destination = prefillDestination ?? findAnsweredDestination(entries);

        appendBotSequence(
            [
                { id: nextId(), type: 'bot', text: applyTemplate(scenario.resortPickerIntro, { destination }) },
                { id: nextId(), type: 'resort-picker', destination },
            ],
            'resorts',
        );
    }

    function findAnsweredDestination(list: Entry[]): string {
        const idx = list.findIndex((e) => e.type === 'options' && e.kind === 'destination');
        if (idx === -1) return scenario.destinations[0];
        const answer = list[idx + 1];
        return answer && answer.type === 'user' ? answer.text : scenario.destinations[0];
    }

    function proceedToContact(summary: string) {
        appendNow({ id: nextId(), type: 'user', text: summary });
        appendBotSequence(
            [
                { id: nextId(), type: 'bot', text: scenario.afterResortMessage },
                { id: nextId(), type: 'checklist' },
                { id: nextId(), type: 'bot', text: scenario.phoneQuestion },
                { id: nextId(), type: 'bot', text: scenario.privacyNotice },
            ],
            'contact',
        );
    }

    function toggleResort(name: string) {
        setSelectedResorts((prev) => {
            if (prev.includes(name)) return prev.filter((n) => n !== name);
            if (prev.length >= 3) return prev;
            return [...prev, name];
        });
    }

    function handlePhoneSubmit() {
        const phone = inputValue.trim();
        if (!phone) return;
        appendNow({ id: nextId(), type: 'user', text: phone });
        leadDataRef.current.phone = phone;
        setInputValue('');
        appendBotSequence(
            [
                { id: nextId(), type: 'bot', text: scenario.regionQuestion },
                { id: nextId(), type: 'options', kind: 'region', options: scenario.regions },
            ],
            'region',
        );
    }

    function handleRegionAnswer(value: string) {
        appendNow({ id: nextId(), type: 'user', text: value });
        leadDataRef.current.region = value;
        appendBotSequence([{ id: nextId(), type: 'bot', text: scenario.nameQuestion }], 'name');
    }

    function handleNameSubmit() {
        const name = inputValue.trim();
        if (!name) return;
        appendNow({ id: nextId(), type: 'user', text: name });
        setInputValue('');

        fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...leadDataRef.current, name, selectedResorts }),
        }).catch(() => {
            // Best-effort submission — the completion message still shows even if this fails.
        });

        appendBotSequence([{ id: nextId(), type: 'completion', name }], 'done');
    }

    function handleFreeformSend() {
        const value = inputValue.trim();
        if (!value) return;

        if (step === 'month') {
            setInputValue('');
            handleMonthAnswer(value);
            return;
        }
        if (step === 'destination') {
            setInputValue('');
            handleDestinationAnswer(value);
            return;
        }
        if (step === 'budget') {
            setInputValue('');
            handleBudgetAnswer(value);
            return;
        }
        if (step === 'contact') {
            handlePhoneSubmit();
            return;
        }
        if (step === 'region') {
            setInputValue('');
            handleRegionAnswer(value);
            return;
        }
        if (step === 'name') {
            handleNameSubmit();
            return;
        }
    }

    const inputDisabled = step === 'resorts' || step === 'done' || isTyping;
    const placeholder = PLACEHOLDER_BY_STEP[step];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-0 md:p-6">
            <div aria-hidden="true" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default" />

            <div className="relative flex h-full w-full flex-col overflow-hidden bg-gray-900 text-white md:h-[85vh] md:max-w-xl md:rounded-3xl">
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark">
                            <SearchIcon className="h-5 w-5 text-white" />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-white">허니문 스캔GO</p>
                            <p className="text-xs text-white/50">{STEP_LABEL[step]}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        aria-label="닫기"
                        onClick={onClose}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>

                <div className="h-1 w-full bg-white/10">
                    <div
                        className="h-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                    {entries.map((entry, index) => {
                        const isLast = index === entries.length - 1;

                        if (entry.type === 'bot') {
                            return (
                                <div
                                    key={entry.id}
                                    className="max-w-[90%] whitespace-pre-line rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-white/90"
                                >
                                    {entry.text}
                                </div>
                            );
                        }

                        if (entry.type === 'user') {
                            return (
                                <div
                                    key={entry.id}
                                    className="ml-auto w-fit max-w-[70%] rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-4 py-2.5 text-right text-sm font-semibold text-white"
                                >
                                    {entry.text}
                                </div>
                            );
                        }

                        if (entry.type === 'options') {
                            const handler =
                                entry.kind === 'month'
                                    ? handleMonthAnswer
                                    : entry.kind === 'destination'
                                      ? handleDestinationAnswer
                                      : entry.kind === 'budget'
                                        ? handleBudgetAnswer
                                        : handleRegionAnswer;

                            return (
                                <div key={entry.id} className={`grid grid-cols-2 gap-2 sm:grid-cols-4 ${isLast ? '' : 'pointer-events-none opacity-40'}`}>
                                    {entry.options.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => handler(option)}
                                            className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-2.5 text-center text-sm font-semibold text-white transition-all hover:border-brand hover:bg-white/10 hover:shadow-[0_0_0_1px_var(--brand),0_0_16px_-4px_var(--brand)]"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            );
                        }

                        if (entry.type === 'resort-picker') {
                            const resorts = (RESORTS_BY_DESTINATION[entry.destination] ?? []).slice(0, 4);
                            return (
                                <div key={entry.id} className={isLast ? '' : 'pointer-events-none opacity-40'}>
                                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/60">
                                        <span>조건 기준 후보 · 최대 3곳 선택</span>
                                        <span>{selectedResorts.length} / 3</span>
                                    </div>

                                    <div className="space-y-2">
                                        {resorts.map((resort) => {
                                            const selected = selectedResorts.includes(resort.name);
                                            return (
                                                <button
                                                    key={resort.slug}
                                                    type="button"
                                                    onClick={() => toggleResort(resort.name)}
                                                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                                                        selected
                                                            ? 'border-brand bg-brand/10'
                                                            : 'border-white/10 bg-white/5 hover:border-brand hover:bg-white/10 hover:shadow-[0_0_0_1px_var(--brand),0_0_16px_-4px_var(--brand)]'
                                                    }`}
                                                >
                                                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                                                        <Image
                                                            src={`https://picsum.photos/seed/${resort.slug}/200/200`}
                                                            alt={resort.name}
                                                            fill
                                                            sizes="56px"
                                                            className="object-cover"
                                                        />
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-bold text-white">{resort.name}</span>
                                                        <span className="block truncate text-xs text-white/50">
                                                            {entry.destination} · {resort.tags.slice(0, 2).join(' · ')}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                                            selected ? 'border-brand bg-brand' : 'border-white/30'
                                                        }`}
                                                    >
                                                        {selected && <CheckIcon className="h-3 w-3 text-white" />}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            disabled={selectedResorts.length === 0}
                                            onClick={() => proceedToContact(`${selectedResorts.join(', ')} 선택`)}
                                            className="flex-1 cursor-pointer rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:enabled:border-brand hover:enabled:shadow-[0_0_0_1px_var(--brand),0_0_16px_-4px_var(--brand)] disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            {selectedResorts.length === 0 ? '먼저 선택해 주세요' : `선택한 ${selectedResorts.length}곳으로 진행`}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => proceedToContact('추천으로 받을게요')}
                                            className="flex-1 cursor-pointer rounded-full bg-gradient-to-r from-brand to-brand-dark px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-[0_0_16px_-2px_var(--brand)]"
                                        >
                                            추천으로 받을게요
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        if (entry.type === 'checklist') {
                            return (
                                <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="mb-3 flex items-center gap-2.5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark">
                                            <GiftIcon className="h-4 w-4 text-white" />
                                        </span>
                                        <p className="text-sm font-bold text-white">
                                            스캔 완료 시 <span className="text-brand">무료로 받는 자료</span>
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {scenario.freeItems.map((item) => (
                                            <div key={item.title} className="flex items-center gap-3">
                                                <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                                                    <p className="truncate text-xs text-white/50">{item.desc}</p>
                                                </div>
                                                <span className="shrink-0 text-xs font-bold text-brand">무료</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        if (entry.type === 'completion') {
                            return (
                                <div key={entry.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                    <div className="flex flex-col items-center gap-3 px-6 py-6 text-center">
                                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark">
                                            <CheckIcon className="h-7 w-7 text-white" />
                                        </span>
                                        <div>
                                            <p className="text-base font-bold text-white">{entry.name}님, 스캔 신청 완료!</p>
                                            <p className="mt-2 text-sm leading-relaxed text-white/60">{scenario.completionSubtitle}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10">
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-brand/20 to-brand-dark/20 px-4 py-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark">
                                                <GiftIcon className="h-4 w-4 text-white" />
                                            </span>
                                            <p className="text-sm font-bold text-white">여기서 끝이 아니에요</p>
                                        </div>
                                        <div className="divide-y divide-white/10">
                                            {scenario.extraBenefits.map((item) => (
                                                <div key={item.title} className="flex items-center justify-between gap-3 px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
                                                        <p className="text-sm text-white/90">{item.title}</p>
                                                    </div>
                                                    <span className="shrink-0 text-xs font-bold text-brand">{item.tag}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="whitespace-pre-line px-6 py-4 text-xs leading-relaxed text-white/50">
                                        {scenario.completionClosing}
                                    </p>
                                </div>
                            );
                        }

                        if (entry.type === 'typing') {
                            return (
                                <div key={entry.id} className="flex w-fit items-center gap-1.5 rounded-2xl bg-white/5 px-4 py-3.5">
                                    <span className="h-2 w-2 animate-[typing-bounce_1.2s_ease-in-out_infinite] rounded-full bg-white/50" />
                                    <span className="h-2 w-2 animate-[typing-bounce_1.2s_ease-in-out_infinite] rounded-full bg-white/50 [animation-delay:0.15s]" />
                                    <span className="h-2 w-2 animate-[typing-bounce_1.2s_ease-in-out_infinite] rounded-full bg-white/50 [animation-delay:0.3s]" />
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>

                <div className="border-t border-white/10 p-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            inputMode={step === 'contact' ? 'numeric' : 'text'}
                            value={inputValue}
                            disabled={inputDisabled}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (step === 'contact') {
                                    setInputValue(formatPhoneInput(raw));
                                } else if (step === 'name') {
                                    setInputValue(formatNameInput(raw));
                                } else {
                                    setInputValue(raw);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleFreeformSend();
                            }}
                            placeholder={placeholder}
                            className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none disabled:cursor-not-allowed disabled:opacity-40"
                        />
                        <button
                            type="button"
                            onClick={handleFreeformSend}
                            disabled={inputDisabled}
                            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <SendIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ScanModal({ isOpen, onClose, prefillDestination, scenario }: ScanModalProps) {
    if (!isOpen) return null;
    return <ScanModalInner onClose={onClose} prefillDestination={prefillDestination} scenario={scenario} />;
}

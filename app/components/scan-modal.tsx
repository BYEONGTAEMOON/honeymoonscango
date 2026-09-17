'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { applyTemplate, type ChatbotScenario } from '@/lib/chatbot-scenario';

import { CheckIcon, CloseIcon, GiftIcon, SearchIcon, SendIcon } from './icons';

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
        const hasResortCandidates = (scenario.resortsByDestination[destination] ?? []).length > 0;

        // Both the destination list and the resort catalog are admin-editable
        // independently — if an admin adds/renames a destination with no
        // matching resort data yet, skip the (otherwise empty and dead-end)
        // picker and go straight to collecting contact info instead of showing
        // a picker with 0 candidates.
        if (!hasResortCandidates) {
            appendBotSequence(
                [
                    {
                        id: nextId(),
                        type: 'bot',
                        text: `${destination}은(는) 전담 컨설턴트가 직접 맞춤 리조트를 찾아드리는 지역이에요. ${scenario.afterResortMessage}`,
                    },
                    { id: nextId(), type: 'checklist' },
                    { id: nextId(), type: 'bot', text: scenario.phoneQuestion },
                    { id: nextId(), type: 'bot', text: scenario.privacyNotice },
                ],
                'contact',
            );
            return;
        }

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
                            const resorts = (scenario.resortsByDestination[entry.destination] ?? []).slice(0, 4);
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
                                                            src={resort.image}
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

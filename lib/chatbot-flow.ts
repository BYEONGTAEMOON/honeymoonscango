import { applyTemplate, type ChatbotScenario, type ChatbotSections } from './chatbot-scenario';

export type Step = 'month' | 'destination' | 'budget' | 'duration' | 'resorts' | 'contact' | 'region' | 'name' | 'done';

export type OptionKind = 'month' | 'destination' | 'budget' | 'duration' | 'region';

export type FlowEntry =
    | { type: 'bot'; text: string }
    | { type: 'user'; text: string }
    | { type: 'options'; kind: OptionKind; options: string[] }
    | { type: 'resort-picker'; destination: string }
    | { type: 'checklist' }
    | { type: 'completion'; name?: string };

export type FlowContext = {
    month?: string;
    destination?: string;
    prefill?: string;
    name?: string;
};

const STEP_ORDER: { step: Step; section: keyof ChatbotSections | null }[] = [
    { step: 'month', section: 'start' },
    { step: 'destination', section: 'destination' },
    { step: 'budget', section: 'budget' },
    { step: 'duration', section: 'duration' },
    { step: 'resorts', section: 'resort' },
    { step: 'contact', section: 'contact' },
    { step: 'region', section: 'regionName' },
    { step: 'name', section: 'regionName' },
    { step: 'done', section: null },
];

const SUBMITTED_MESSAGE = '신청이 접수되었습니다. 감사합니다.';

export function enabledSteps(sections: ChatbotSections): Step[] {
    return STEP_ORDER.filter(({ section }) => section === null || sections[section]).map(({ step }) => step);
}

export function buildMonthRange(startValue: string, endValue: string): string[] {
    const parse = (value: string) => {
        const match = /^(\d{4})-(\d{2})$/.exec(value);
        if (!match) return null;
        const month = Number(match[2]);
        return month >= 1 && month <= 12 ? { year: Number(match[1]), month } : null;
    };
    const start = parse(startValue);
    const end = parse(endValue);
    if (!start || !end) return [];

    // Sanity cap in case an admin sets a huge range.
    const MAX_MONTH_OPTIONS = 36;
    const months: string[] = [];
    let { year, month } = start;
    while (year * 12 + month <= end.year * 12 + end.month && months.length < MAX_MONTH_OPTIONS) {
        months.push(`${year}년 ${month}월`);
        month += 1;
        if (month > 12) {
            month = 1;
            year += 1;
        }
    }
    return months;
}

const PARAGRAPH_BREAK = /\n\s*\n/;

// With the month step off there's nothing to fill {value} with, so the
// paragraph that mentions it ("{value} 예정으로 …") is dropped rather than
// shown with a hole in the sentence.
function destinationQuestionText(template: string, month?: string): string {
    if (month) return applyTemplate(template, { value: month });
    return template
        .split(PARAGRAPH_BREAK)
        .filter((paragraph) => !paragraph.includes('{value}'))
        .join('\n\n');
}

// Card buttons skip the destination question but reuse its opening paragraph,
// so editing that paragraph once updates every button.
function prefillGreeting(scenario: ChatbotScenario, destination: string, month?: string): string {
    const parts = month ? applyTemplate(scenario.destinationQuestion, { value: month }).split(PARAGRAPH_BREAK) : [];
    const opening = parts.length > 1 ? parts[0] : '';
    const continuation = applyTemplate(scenario.prefillContinueMessage, { value: month ?? '', destination });
    return [opening, continuation].filter(Boolean).join('\n\n');
}

// Walks forward from `from` past any switched-off sections to the next step to
// ask, returning that step and what the bot should say on the way there.
export function planNext(scenario: ChatbotScenario, from: Step | null, ctx: FlowContext): { step: Step; entries: FlowEntry[] } {
    const { sections } = scenario;
    const entries: FlowEntry[] = [];
    const destination = ctx.prefill ?? ctx.destination;
    let noResortNote = '';

    const startIndex = from === null ? 0 : STEP_ORDER.findIndex((s) => s.step === from) + 1;

    for (const { step, section } of STEP_ORDER.slice(startIndex)) {
        if (section !== null && !sections[section]) continue;

        switch (step) {
            case 'month':
                entries.push(
                    { type: 'bot', text: scenario.introMessage },
                    { type: 'options', kind: 'month', options: buildMonthRange(scenario.monthRangeStart, scenario.monthRangeEnd) },
                );
                return { step, entries };

            case 'destination':
                if (ctx.prefill) {
                    entries.push(
                        { type: 'bot', text: prefillGreeting(scenario, ctx.prefill, ctx.month) },
                        { type: 'user', text: ctx.prefill },
                    );
                    continue;
                }
                entries.push(
                    { type: 'bot', text: destinationQuestionText(scenario.destinationQuestion, ctx.month) },
                    { type: 'options', kind: 'destination', options: scenario.destinations },
                );
                return { step, entries };

            case 'budget':
                entries.push(
                    { type: 'bot', text: scenario.budgetQuestion },
                    { type: 'options', kind: 'budget', options: scenario.budgets },
                );
                return { step, entries };

            case 'duration':
                entries.push(
                    { type: 'bot', text: scenario.durationQuestion },
                    { type: 'options', kind: 'duration', options: scenario.durations },
                );
                return { step, entries };

            case 'resorts':
                if (destination && (scenario.resortsByDestination[destination] ?? []).length > 0) {
                    entries.push(
                        { type: 'bot', text: applyTemplate(scenario.resortPickerIntro, { destination }) },
                        { type: 'resort-picker', destination },
                    );
                    return { step, entries };
                }
                // No destination asked, or one with no resorts yet: an empty
                // picker would be a dead end, so go straight to contact info.
                if (destination) {
                    const note = applyTemplate(scenario.noResortMessage, { destination });
                    // Normally joined to the contact step's opening line; on its
                    // own bubble when that step is switched off.
                    if (sections.contact) noResortNote = note;
                    else entries.push({ type: 'bot', text: note });
                }
                continue;

            case 'contact':
                entries.push(
                    { type: 'bot', text: [noResortNote, scenario.afterResortMessage].filter(Boolean).join(' ') },
                    { type: 'checklist' },
                    { type: 'bot', text: scenario.phoneQuestion },
                    { type: 'bot', text: scenario.privacyNotice },
                );
                return { step, entries };

            case 'region':
                entries.push(
                    { type: 'bot', text: scenario.regionQuestion },
                    { type: 'options', kind: 'region', options: scenario.regions },
                );
                return { step, entries };

            case 'name':
                entries.push({ type: 'bot', text: scenario.nameQuestion });
                return { step, entries };

            case 'done':
                entries.push(
                    sections.completion ? { type: 'completion', name: ctx.name } : { type: 'bot', text: SUBMITTED_MESSAGE },
                );
                return { step, entries };
        }
    }

    throw new Error(`No step after ${from}`);
}

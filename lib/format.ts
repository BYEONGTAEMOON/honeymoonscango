// `Date.prototype.toLocaleString('ko-KR')` can render differently between
// Node's ICU build (SSR) and a browser's ICU build (hydration) — e.g. "오후 2:24"
// vs "PM 2:24" for the exact same Date — which breaks React hydration. Pinning
// both the locale AND the timeZone with explicit format options makes the
// output deterministic across environments.
const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

export function formatDateTime(date: Date): string {
    return dateTimeFormatter.format(date);
}

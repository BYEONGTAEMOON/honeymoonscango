import { SearchIcon } from './icons';
import { ScanGoButton } from './scan-go-button';

export function StartNowSection() {
    return (
        <section className="bg-brand px-6 py-20 text-center md:px-10 md:py-24">
            <h2 className="text-3xl font-bold text-white md:text-4xl">지금 바로 시작하세요</h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
                복잡한 발품·전화 없이, 채팅으로 조건만 입력하면
                <br />
                출발 가능한 항공과 추천 리조트 견적을 카카오톡으로 정리해 드려요.
            </p>

            <ScanGoButton className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-gray-900 transition-colors hover:bg-gray-100">
                <SearchIcon className="h-5 w-5" />내 조건 허니문 스캔GO
            </ScanGoButton>

            <p className="mt-4 text-xs text-white/70">조건 입력 1분 · 무료 · 신청 1일 이내 카카오톡으로 결과 자료 발송</p>
        </section>
    );
}

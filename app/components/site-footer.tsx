import { ScanGoButton } from './scan-go-button';

export function SiteFooter() {
    return (
        <footer className="border-t border-gray-100 bg-gray-50 px-6 py-12 md:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-lg font-extrabold text-gray-900">
                        허니문<span className="text-brand">스캔GO</span>{' '}
                        <span className="text-sm font-normal text-gray-400">
                            부산 울산 대구
                        </span>
                    </p>

                    <div className="mt-4 space-y-1 text-xs leading-relaxed text-gray-500">
                        <p>
                            대표이사 이호진 | 부산 부산진구 자유평화로 11
                            W웨딩시티 2층
                        </p>
                        <p>
                            사업자등록번호 199-86-00338 | 관광사업자등록증번호
                            제2022-000009호 | 통신판매업신고번호
                            제2025-부산진-1442호
                        </p>
                    </div>

                    <div className="mt-4 space-y-1 text-xs leading-relaxed text-gray-500">
                        <p>
                            [부산지사] 부산 부산진구 자유평화로 11 W웨딩시티 2층
                        </p>
                        <p>[대구지사] 대구광역시 남구 봉덕로9길 115 2층</p>
                        <p>
                            [울산지사] 울산광역시 북구 진장17길 10 신선도원 1층
                        </p>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-gray-400">
                        영업배상책임보험가입 총 1억원 · 한국관광협회중앙회
                        배상책임 여행공제회 공제영업보증가입 10억
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                    <ScanGoButton className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
                        내 조건 허니문 스캔GO
                    </ScanGoButton>
                    <p className="text-xs text-gray-400">
                        전화·카톡 문의 없이, 1일 이내 결과 안내
                    </p>
                </div>
            </div>
        </footer>
    );
}

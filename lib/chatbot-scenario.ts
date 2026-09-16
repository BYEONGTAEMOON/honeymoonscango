export type TextItem = { title: string; desc: string };
export type TagItem = { title: string; tag: string };

export type ChatbotScenario = {
    introMessage: string;
    monthCount: number;
    destinations: string[];
    destinationQuestion: string;
    budgets: string[];
    budgetQuestion: string;
    resortPickerIntro: string;
    afterResortMessage: string;
    phoneQuestion: string;
    privacyNotice: string;
    regions: string[];
    regionQuestion: string;
    nameQuestion: string;
    freeItems: TextItem[];
    extraBenefits: TagItem[];
    completionSubtitle: string;
    completionClosing: string;
};

export const DEFAULT_CHATBOT_SCENARIO: ChatbotScenario = {
    introMessage:
        '안녕하세요, 허니문 스캔GO입니다. 😊\n출발월·목적지·예산만 알려주시면 조건에 딱 맞는 리조트와 예상 견적, 항공 잔여좌석까지 한 번에 비교해드려요.\n\n먼저, 출발은 몇 월쯤으로 생각하고 계세요?\n날짜가 아직 미정이어도 괜찮아요. 출발월만 알아도 가능한 항공 스케줄과 받으실 수 있는 혜택을 먼저 확인해드릴게요.',
    monthCount: 8,
    destinations: ['발리', '태국', '유럽', '몰디브', '하와이', '칸쿤', '모리셔스', '호주', '두바이', '괌', '세부'],
    destinationQuestion:
        '{value} 예정으로 항공 잔여좌석과 견적 조회 도와드릴게요. ✨\n\n희망 목적지는 어느 곳으로 생각하고 계세요? 📍\n목적지마다 항공 스케줄과 리조트 견적대가 달라요.\n두 분이 원하시는 여행 스타일 기준으로 골라도 좋아요.',
    budgets: ['100~200만원', '200~300만원', '300~500만원', '500만원 이상'],
    budgetQuestion:
        '예상 예산은 어느 정도로 보세요? 💰\n예산은 총 견적을 좌우하는 가장 큰 변수예요.\n정확하지 않아도 괜찮으니 대략 범위로 골라주세요.',
    resortPickerIntro:
        '조건에 맞는 {destination} 리조트 후보예요.\n혹시 1순위로 보고 계신 곳이 있다면 최대 3곳까지 골라주세요.\n(없으면 아래 "추천으로 받을게요")\n\n선택하신 리조트 + 함께 보면 좋을 리조트까지 총 3곳의 항공 잔여좌석 · 예상 총견적 · 제휴 혜택을 한 번에 정리해 드릴게요.',
    afterResortMessage: '좋아요! 그럼 아래 자료를 무료로 정리해서 보내드릴게요. 🎁',
    phoneQuestion: '정리된 자료를 받으실 휴대폰 번호를 입력해주세요. 📱\n(카카오톡으로 보내드려요)',
    privacyNotice:
        '🔒 남겨주신 연락처는 상담 자료 발송에만 사용하고 안전하게 보관해요. 입력 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.',
    regions: ['부산', '울산', '대구'],
    regionQuestion: '신청자 거주 지역을 선택해주세요. 🏠\n지역별 전담 컨설턴트가 배정되어 더 빠르고 편하게 안내해드려요.',
    nameQuestion: '신청자 이름을 입력해주세요. 😊\n(자료 발송과 함께 추후 리조트 간편예약 서비스 혜택도 함께 도와드릴게요)',
    freeItems: [
        { title: '2026 허니문 리조트 비교 견적표', desc: '항공·숙소 조합을 한눈에' },
        { title: '선택 리조트 잔여좌석 리포트', desc: '원하는 출발일 가능성 정리' },
        { title: '리조트별 예상 총견적 비교', desc: '숨은 비용까지 합산' },
        { title: '제휴 혜택 총정리표', desc: '허니문스캔GO 단독 제휴 적용' },
        { title: '예약 전 체크리스트', desc: '누락 방지 필수 항목' },
    ],
    extraBenefits: [
        { title: '무료 리조트 예약 간편 서비스', tag: '무료' },
        { title: '상담 확정 시 커플 웰컴 기프트 증정', tag: '상담' },
        { title: '예약 확정 시 최대 100만원+ 추가 혜택', tag: '예약' },
    ],
    completionSubtitle: '선택하신 리조트 기준 잔여 항공좌석 · 예상 총견적 · 제휴 혜택 자료를 곧 카카오톡으로 정리해 보내드릴게요.',
    completionClosing:
        '상담·예약 시 받는 혜택은 자료 안내와 함께 허니문 전담 컨시어지가 카카오톡 안내 시 자세히 알려드릴게요. 🙌\n신청 기준 1일 이내에 카카오톡으로 결과 자료를 공유드리겠습니다.\n\n행복한 신혼여행 준비의 시작이 되시길 바랍니다. 감사합니다. 💍',
};

export function applyTemplate(template: string, vars: Record<string, string>): string {
    return Object.entries(vars).reduce((text, [key, value]) => text.split(`{${key}}`).join(value), template);
}

export function mergeScenario(partial: Partial<ChatbotScenario> | null | undefined): ChatbotScenario {
    if (!partial) return DEFAULT_CHATBOT_SCENARIO;
    return { ...DEFAULT_CHATBOT_SCENARIO, ...partial };
}

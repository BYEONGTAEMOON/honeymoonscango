export type TextItem = { title: string; desc: string };
export type TagItem = { title: string; tag: string };
export type DestinationResort = { slug: string; name: string; description: string; tags: string[]; image: string };

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
    resortsByDestination: Record<string, DestinationResort[]>;
};

function seedImage(slug: string): string {
    return `https://picsum.photos/seed/${slug}/800/360`;
}

function withImages(resorts: Omit<DestinationResort, 'image'>[]): DestinationResort[] {
    return resorts.map((resort) => ({ ...resort, image: seedImage(resort.slug) }));
}

const DEFAULT_RESORTS_BY_DESTINATION: Record<string, DestinationResort[]> = {
    발리: withImages([
        {
            slug: 'ayu-terra',
            name: '아유테라',
            description: '아융강 절벽 파노라마 정글뷰와 전용 인피니티 풀을 갖춘 감성적인 성인 전용 프라이빗 목시 풀빌라',
            tags: ['아융강뷰', '인피니티풀', '프라이빗절벽'],
        },
        {
            slug: 'won-eleven',
            name: '원일레븐',
            description: '14m 대형 개인 수영장과 야외 스파 개별룸을 갖춘 스미냑 중심가의 성인 전용 아늑한 프라이빗 풀빌라',
            tags: ['스미냑빌라', '성인전용', '개인수영장'],
        },
        {
            slug: 'komaneka-keramas',
            name: '코마네카 앳 케라마스 비치',
            description: '인도양의 검은 모래 해변과 서핑 포인트, 논밭 풍경을 동시에 품은 동부 발리의 감각적인 프라이빗 오션 풀빌라',
            tags: ['블랙샌드비치', '발리서핑', '케라마스'],
        },
        {
            slug: 'four-seasons-jimbaran',
            name: '포시즌스 짐바란',
            description: '전통 발리 빌리지 감성의 절벽 독채 풀빌라에서 인도양의 황홀한 짐바란 선셋을 마주하는 하이엔드 럭셔리 리트리트',
            tags: ['포시즌스짐바란', '독채풀빌라', '발리하이엔드'],
        },
    ]),
    태국: withImages([
        {
            slug: 'ritz-carlton-ultimate',
            name: '리츠칼튼 얼티메이트',
            description: '코사무이의 청정 해변과 울창한 언덕 위에서 압도적인 파노라마 오션뷰와 최상급 프라이빗 풀빌라를 즐기는 럭셔리 리조트',
            tags: ['코사무이리조트', '얼티메이트오션뷰', '태국하이엔드'],
        },
        {
            slug: 'the-ritz-carlton',
            name: '더 리츠칼튼',
            description: '태국 남부의 이국적인 건축미가 돋보이는 유일의 리조트 내 인공 스노클링 리프를 품은 해변 언덕 위 프리미엄 럭셔리 리조트',
            tags: ['코사무이리조트', '인공리프스노클링', '파노라마오션뷰'],
        },
        {
            slug: 'amantara-pura',
            name: '아만타라푸라',
            description: '고대 태국 아유타야 왕궁을 재현한 웅장하고 클래식한 건축미 속에서 즐기는 라마이 비치 럭셔리 부티크 독채 풀빌라',
            tags: ['왕궁빌라', '라마이비치부티크', '태국전통럭셔리'],
        },
        {
            slug: 'on-the-bloo-samui',
            name: '온 더 블루 사무이',
            description: '높은 언덕에서 코사무이 오션뷰를 파노라마로 내려다보며 모던하고 세련된 화이트톤 인테리어를 즐기는 독채 풀빌라',
            tags: ['온더블루', '오션뷰빌라', '모던감성독채'],
        },
        {
            slug: 'pavilion-samui-thailand',
            name: '파빌리온 사무이',
            description: '라마이 비치의 황금빛 백사장을 앞마당처럼 누리는 고즈넉한 태국 전통 정원 속 프라이빗 풀빌라',
            tags: ['라마이비치', '태국감성풀빌라', '가성비럭셔리'],
        },
        {
            slug: 'the-shore-katathani',
            name: '더 쇼어 앳 카타타니',
            description: '카타노이 비치의 에메랄드빛 바다를 파노라마로 품은 성인 전용 하이엔드 인피니티 풀빌라의 오션뷰 정원',
            tags: ['더쇼어빌라', '성인전용', '오션뷰정원'],
        },
        {
            slug: 'phuket-banyan-tree',
            name: '푸켓 반얀트리',
            description: '반타오 베이의 고요한 라군과 우아한 태국 레지던스 건축이 조화를 이루는 아시아 럭셔리 풀빌라의 상징적 존재',
            tags: ['푸켓반얀트리', '라군빌라', '럭셔리컬렉션'],
        },
        {
            slug: 'the-pavilions-phuket',
            name: '더 파빌리온',
            description: '청정 절벽 언덕 위에서 안다만해를 굽어보는 압도적인 파노라마 뷰와 완벽한 프라이버시를 보장하는 성인 전용 하이엔드 풀빌라',
            tags: ['푸켓파빌리온', '오션뷰', '프라이빗안다만'],
        },
    ]),
    유럽: withImages([
        {
            slug: 'le-matourin',
            name: '르 마튀랭',
            description: '오페라 가르니에와 마들렌 성당 사이, 세련된 오스만 양식의 클래식함과 프라이빗 스파를 갖춘 8구 중심가의 감성 럭셔리 부티크 호텔',
            tags: ['파리마들렌부티크', '오페라근처감성', '파리스파호텔'],
        },
        {
            slug: 'sunstar-grindelwald',
            name: '선스타 그린델발트',
            description: '객실 발코니에서 마주하는 아이거 북벽(Eiger)의 웅장한 파노라마 뷰와 알프스 온천 스파를 품은 정통 스위스 샬레 호텔',
            tags: ['파노라마아이거뷰', '알프스샬레', '그린델발트스파'],
        },
        {
            slug: 'h10-duque-de-loule',
            name: 'H10 두크 드 롤레',
            description: '포르투갈 전통 아줄레주 타일과 모던 인테리어가 조화를 이루는 역사적 석조 건물 속 도심 파노라마 루프탑 바를 품은 4성급 감성 부티크 호텔',
            tags: ['리스본아줄레주', '리스본루프탑바', '롤레거리감성'],
        },
        {
            slug: 'above-blue-suites',
            name: '어보브 블루 스위트',
            description: '이메로비글리의 가장 높은 칼데라 절벽 위에서 환상적인 일몰과 프라이빗 자쿠지를 즐기는 산토리니 로맨틱 부티크 스위트',
            tags: ['산토리니칼데라뷰', '이메로비글리석양', '로맨틱자쿠지'],
        },
    ]),
    몰디브: withImages([
        {
            slug: 'lux-south-ari-atoll',
            name: '럭스 사우스 아리아톨',
            description: '4km에 달하는 환상적인 백사장과 고래상어 서식지를 품은 스타일리시하고 감각적인 인스타그래머블 럭셔리 리조트',
            tags: ['몰디브럭스사우스', '고래상어스노클링', '감성인스타샷'],
        },
        {
            slug: 'siyam-world-maldives',
            name: '시암 월드 몰디브',
            description: '전 객실 프라이빗 풀과 워터 슬라이드, 인도양 최대의 해상 워터파크를 갖춘 올인클루시브 복합 엔터테인먼트 파라다이스',
            tags: ['워터슬라이드빌라', '해상워터파크', '올인클루시브'],
        },
        {
            slug: 'sun-siyam-iru-veli',
            name: '선 시암 이루 벨리',
            description: '전 객실 프라이빗 풀과 눈부신 샌드뱅크 라군을 배경으로 수준 높은 프리미엄 올인클루시브를 누리는 로맨틱 럭셔리 리조트',
            tags: ['전객실개인풀', '에메랄드라군뷰', '올인클루시브'],
        },
        {
            slug: 'outrigger-maafushivaru',
            name: '아웃리거 마푸시바루',
            description: '아리아톨 남부의 청정 산호초 군락과 그림 같은 전용 샌드뱅크를 품은 세련된 모던 보헤미안 스타일의 5성급 부티크 리조트',
            tags: ['루하우스리조트', '프라이빗샌드뱅크', '모던부티크'],
        },
    ]),
    하와이: withImages([
        {
            slug: 'sheraton-waikiki',
            name: '쉐라톤와이키키',
            description: '와이키키 해변과 다이아몬드 헤드가 한눈에 펼쳐지는 환상적인 성인 전용 인피니티 엣지 풀을 품은 대표 오션프런트 랜드마크 리조트',
            tags: ['인피니티풀', '다이아몬드헤드뷰', '하와이완벽위치'],
        },
        {
            slug: 'alohilani-resort',
            name: '알로힐라니',
            description: '로비의 웅장한 28만 갤런 대형 오션아리움과 감각적인 인피니티 풀 카바나를 갖춘 트렌디한 모던 럭셔리 리조트',
            tags: ['아쿠아리움호텔', '인스타핫플', '모던감성'],
        },
        {
            slug: 'courtyard-by-marriott-waikiki',
            name: '코트야드 바이 메리어트',
            description: '칼라카우아 애비뉴 쇼핑가와 와이키키 해변을 도보로 만끽하는 뛰어난 접근성과 가성비를 자랑하는 모던 캐주얼 호텔',
            tags: ['가성비숙소', '메리어트와이키키', '쇼핑중심가위치'],
        },
        {
            slug: 'hilton-garden-inn-waikiki',
            name: '힐튼 가든 인',
            description: '인터내셔널 마켓 플레이스 바로 맞은편에 위치해 쇼핑과 다이닝, 해변 접근성까지 모두 갖춘 실속파 스마트 도심 리조트',
            tags: ['마켓플레이스앞', '실속파하와이여행', '와이키키중심부'],
        },
    ]),
    칸쿤: withImages([
        {
            slug: 'barcelo-maya',
            name: '바르셀로 마야',
            description: '2km에 달하는 프라이빗 백사장과 거대한 워터파크, 다채로운 테마를 아우르는 카리브해 마야의 초대형 올인클루시브 복합 파라다이스',
            tags: ['바르셀로마야', '올인클루시브', '카리브해마야휴양'],
        },
        {
            slug: 'secrets-the-vine',
            name: '시크릿 더 바인',
            description: '칸쿤 호텔존 중심에서 즐기는 소믈리에 와인 셀렉션과 성인 전용 하이라이즈 파노라마 오션뷰 인피니티 풀의 세련된 모던 럭셔리',
            tags: ['시크릿더바인', '성인전용특선', '호텔존오션뷰'],
        },
        {
            slug: 'hyatt-ziva-cancun',
            name: '하얏트 지바',
            description: '칸쿤 호텔존 푼타 칸쿤 끝자락에 위치해 3면이 카리브해로 둘러싸인 독보적인 오션뷰와 최상급 미식을 자랑하는 시그니처 올인클루시브 리조트',
            tags: ['하얏트지바칸쿤', '푼타칸쿤', '올인클루시브'],
        },
        {
            slug: 'hyatt-vivid-grand-island',
            name: '하얏트 비비드 그랜드 아일랜드',
            description: '니추프테 라군과 카리브해 사이에서 여유로운 보헤미안 무드와 트렌디한 루프탑 바, 감각적인 비치 클럽을 즐기는 신개념 성인 전용 리조트',
            tags: ['하얏트비비드칸쿤', '성인전용보헤미안', '라군오션프론트'],
        },
    ]),
    모리셔스: withImages([
        {
            slug: 'lux-grand-gaube',
            name: '럭스 그랑고브',
            description: '세계적인 디자이너 켈리 호펜의 레트로 시크 감성과 두 개의 전용 해변 코브를 품은 북부 모리셔스의 감각적인 럭셔리 부티크 리조트',
            tags: ['럭스그랑고브', '켈리호펜인테리어', '레트로시크휴양'],
        },
        {
            slug: 'lux-le-morne',
            name: '럭스 르몽',
            description: '유네스코 세계문화유산 르몽 브라반트 산을 등지고 돌고래 서식지와 환상적인 석양을 감상하는 평화로운 살레풍 럭셔리 생크추어리',
            tags: ['럭스르몽', '르몽브라반트뷰', '돌고래스노클링'],
        },
        {
            slug: 'lux-belle-mare',
            name: '럭스 벨마',
            description: '동부 해안의 눈부신 화이트 샌드와 청록색 라군 앞, 활기 넘치고 세련된 파스텔톤 모던 라이프스타일을 제안하는 프리미엄 비치 리조트',
            tags: ['럭스벨마', '동부화이트비치', '모던파스텔감성'],
        },
        {
            slug: 'margherite-exclusive',
            name: '마게리 익스클루시브',
            description: '블랙리버 중심부의 편리한 인프라와 울창한 열대 프라이빗 가든 속 개별 풀을 갖춘 여유롭고 완벽한 사생활 보장형 럭셔리 독채 빌라',
            tags: ['마르게리트빌라', '독채풀빌라', '블랙리버프라이빗'],
        },
    ]),
    호주: withImages([
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
    ]),
    두바이: withImages([
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
    ]),
    괌: withImages([
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
    ]),
    세부: withImages([
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
    ]),
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
    resortsByDestination: DEFAULT_RESORTS_BY_DESTINATION,
};

export function applyTemplate(template: string, vars: Record<string, string>): string {
    return Object.entries(vars).reduce((text, [key, value]) => text.split(`{${key}}`).join(value), template);
}

export function mergeScenario(partial: Partial<ChatbotScenario> | null | undefined): ChatbotScenario {
    if (!partial) return DEFAULT_CHATBOT_SCENARIO;
    return { ...DEFAULT_CHATBOT_SCENARIO, ...partial };
}


# ConceptBot — 모드 연동 스펙

> 버전: v1.1 | 작성일: 2026.06.09 | 업데이트: 관람객 경험 모듈(Layer 2) 통합, 전시 유형별 패키지 자동 추천 구조 추가  
> 연관: [모듈 기획서 전체](https://github.com/nino2767/afterglow/blob/main/docs/module-planning.md)

---

## 개요

기획사 운영자가 `ConceptBot.jsx`에서 **전시 유형과 테마 모드를 선택**하면,  
해당 조합에 맞는 경험 모듈 패키지 + 질문 세트 + 산출물 템플릿이 자동으로 전환되는 2-Layer 구조입니다.

```
[Step 1] 전시 유형 선택       ← 10종 중 선택
            ↓ 자동 추천
[Step 2] 테마 모드 확인/변경  ← Layer 1: 공간 성격 정의
            ↓ 자동 매핑
[Step 3] 경험 모듈 패키지 확인 ← Layer 2: 관람객 행동 설계
            ↓
[Step 4] AI 분석 실행 → 산출물 생성
```

---

## Layer 1 — 테마 모드 목록 및 상태

| Mode Key | 모드명 | 상태 | 우선순위 |
|---|---|---|---|
| `story` | 스토리형 | 🚧 기획 완료 · 개발 예정 | MVP |
| `sensory` | 감각형 | 🚧 기획 완료 · 개발 예정 | MVP |
| `archive` | 데이터 초상형 | 🚧 기획 완료 · 개발 예정 | MVP |
| `community` | 커뮤니티형 | 📋 기획 완료 · 대기 | v1.0 |
| `role` | 역할극형 | 📋 기획 완료 · 대기 | v2.0 |
| `time` | 시간여행형 | 📋 기획 완료 · 대기 | v2.0 |

---

## Layer 2 — 관람객 경험 모듈 목록 및 상태

| Module Key | 모듈명 | 구분 | 상태 | 우선순위 |
|---|---|---|---|---|
| `reflection` | 감상 회고 모듈 | 회고형 | 🚧 개발 예정 | MVP |
| `emotion-wall` | 감정 담벼락 모듈 | 표현형 | 🚧 개발 예정 | MVP |
| `poster-card` | 전시 포스터/카드 모듈 | 공유형 | 🚧 개발 예정 | MVP |
| `next-recommend` | 다음 경험 추천 모듈 | 추천형 | 🚧 개발 예정 | MVP |
| `my-curation` | 나만의 큐레이션 모듈 | 개인화형 | 📋 대기 | v1.0 |
| `reaction-map` | 집단 반응 지도 모듈 | 집단반응형 | 📋 대기 | v1.0 |
| `digital-goods` | 디지털 굿즈 모듈 | 수집형 | 📋 대기 | v1.0 |
| `highlight` | 관람 하이라이트 모듈 | 시각화형 | 📋 대기 | v2.0 |
| `note-quiz` | 관람 노트/퀴즈 모듈 | 학습형 | 📋 대기 | v2.0 |
| `vote` | 투표/질문 모듈 | 참여형 | 📋 대기 | v2.0 |

---

## 전시 유형별 자동 추천 매핑

경험 모듈 10종의 한글 기획명과 시스템 Key 매핑은 다음과 같습니다:
* **감상 회고 모듈**: `reflection`
* **감정 담벼락 모듈 (생각 담벼락, 팬 메시지 월)**: `emotion-wall`
* **나만의 큐레이션 모듈 (문장 수집함)**: `my-curation`
* **전시 포스터/카드 모듈 (나의 문장 카드, 공유 카드)**: `poster-card`
* **관람 하이라이트 모듈 (감정 타임라인, 최애 루트, 관람 히스토리)**: `highlight`
* **집단 반응 지도 모듈**: `reaction-map`
* **투표/질문 모듈 (랭킹/참여형)**: `vote`
* **디지털 굿즈 모듈 (스탬프북, 미션 완료 카드)**: `digital-goods`
* **관람 노트/퀴즈 모듈 (가족 감상 기록, 퀴즈형)**: `note-quiz`
* **다음 경험 추천 모듈 (관심 주제 추천, 굿즈 추천, 캠페인 연결)**: `next-recommend`

```ts
const EXHIBITION_PACKAGE_MAP = {
  'media-art': {
    themeModes: ['sensory', 'archive'],
    packageName: 'Immersive Highlight Package',
    baseModules: ['highlight', 'emotion-wall', 'reaction-map'], // 관람 하이라이트, 감정 타임라인, 집단 반응 지도
    extraModules: ['poster-card', 'next-recommend'], // 전시 포스터/카드, 다음 경험 추천
  },
  'fine-art': {
    themeModes: ['story'], // 스토리형 (작가 연대기)
    packageName: 'Personal Reflection Package',
    baseModules: ['reflection', 'my-curation', 'emotion-wall'], // 감상 회고, 나만의 큐레이션, 감정 담벼락
    extraModules: ['next-recommend', 'poster-card'], // 다음 경험 추천, 전시 포스터/카드
  },
  'fandom-ip': {
    themeModes: ['story', 'community'], // 스토리형 (세계관 확장) + 커뮤니티형
    packageName: 'Fan Memory Package',
    baseModules: ['emotion-wall', 'digital-goods', 'highlight'], // 팬 메시지 월, 디지털 굿즈, 최애 루트
    extraModules: ['vote', 'poster-card'], // 랭킹/참여형, 공유 카드
  },
  'history-archive': {
    themeModes: ['time'], // 시간여행형
    packageName: 'Memory Archive Package',
    baseModules: ['reflection', 'note-quiz', 'next-recommend'], // 감상 회고, 관람 노트, 관심 주제 추천
    extraModules: ['vote', 'my-curation'], // 퀴즈형(vote 확장), 나만의 큐레이션
  },
  'kids-family': {
    themeModes: ['role'], // 역할극형
    packageName: 'Family Play Package',
    baseModules: ['digital-goods', 'note-quiz'], // 스탬프북/미션 완료 카드, 가족 감상 기록/퀴즈형
    extraModules: ['vote'],
  },
  'brand-popup': {
    themeModes: ['sensory'], // 감각형 + 참여형
    packageName: 'Brand Engagement Package',
    baseModules: ['poster-card', 'vote', 'digital-goods'], // 전시 포스터/카드, 투표/질문, 디지털 굿즈
    extraModules: ['next-recommend'], // 굿즈 추천
  },
  'literature-text': {
    themeModes: ['story'], // 스토리형 (세계관 확장)
    packageName: 'Words Afterglow Package',
    baseModules: ['emotion-wall', 'my-curation', 'poster-card'], // 감정 담벼락, 문장 수집함, 나의 문장 카드
    extraModules: ['reflection', 'reaction-map'], // 감상 회고, 집단 반응 지도
  },
  'public-message': {
    themeModes: ['community'], // 커뮤니티형
    packageName: 'Public Voice Package',
    baseModules: ['emotion-wall', 'vote', 'reaction-map'], // 생각 담벼락, 투표/질문, 집단 반응 지도
    extraModules: ['poster-card'], // 공유 카드
  },
  'permanent-complex': {
    themeModes: ['archive', 'community'], // 데이터 초상형 + 커뮤니티형
    packageName: 'Return Visit Package',
    baseModules: ['reflection', 'highlight', 'next-recommend'], // 감상 회고, 관람 히스토리, 다음 경험 추천
    extraModules: ['my-curation', 'digital-goods'], // 관심 주제 추천, 디지털 굿즈
  },
  'photo': {
    themeModes: ['sensory'], // 감각형
    packageName: 'Emotion Sharing Package',
    baseModules: ['emotion-wall', 'poster-card', 'reflection'], // 감정 담벼락, 전시 포스터/카드, 감상 회고
    extraModules: ['my-curation', 'reaction-map'], // 문장 수집함(my-curation), 집단 반응 지도
  },
}
```

---

## ConceptBot UI 플로우 (업데이트)

```
IP 업로드 (IPUpload.jsx)
    ↓
전시 유형 선택 (ConceptBot.jsx) ← NEW
    ↓ 자동 추천
테마 모드 확인/변경
    ↓ 자동 매핑
경험 모듈 패키지 확인/변경     ← NEW
    ↓
테마 모드별 추가 질문 입력
    ↓
AI 분석 실행
    ↓
산출물 출력 (컨셉 3종 + MD 리스트 + 운영 시나리오 + 경험 모듈 가이드)
```

---

## Layer 1 — 테마 모드별 입력 필드 스펙

### Story Mode

**입력 필드 스펙**
```js
const storyModeFields = [
  { key: 'subMode', label: '스토리 유형', type: 'select',
    options: ['작품 세계관 확장형', '작가 연대기형'] },
  
  // 1. 공통 필드
  { key: 'worldKeywords', label: '세계관 키워드', type: 'tags',
    placeholder: '예: 심해, 고요함, 빛의 굴절' },

  // 2. 작품 세계관 확장형 선택 시 노출 필드 (Conditional)
  { key: 'targetWork', label: '대상 작품명', type: 'text',
    conditional: { key: 'subMode', value: '작품 세계관 확장형' } },
  { key: 'sensoryLanguage', label: '세계관 감각 매핑', type: 'text',
    placeholder: '작품 속 세계에 어울리는 감각을 작성하세요 (예: 축축함, 서늘함, 바다 냄새 등)',
    conditional: { key: 'subMode', value: '작품 세계관 확장형' } },
  { key: 'ambientSetting', label: '공간 시간대 및 날씨 설정', type: 'text',
    placeholder: '예: 비 내리는 늦은 오후, 새벽 4시의 안개 등',
    conditional: { key: 'subMode', value: '작품 세계관 확장형' } },

  // 3. 작가 연대기형 선택 시 노출 필드 (Conditional)
  { key: 'artistInterview', label: '작가 인터뷰/에세이 텍스트', type: 'textarea',
    placeholder: '작가의 인터뷰 및 에세이 본문을 입력하여 작가의 고유 언어 및 성격을 분석합니다.',
    conditional: { key: 'subMode', value: '작가 연대기형' } },
  { key: 'artistReferences', label: '영향을 받은 레퍼런스(링크/텍스트)', type: 'textarea',
    placeholder: '작가의 미적 계보를 분석하기 위한 타 아티스트나 레퍼런스 정보',
    conditional: { key: 'subMode', value: '작가 연대기형' } },
  { key: 'studioPhotos', label: '작업실/성장 환경 사진', type: 'file_multiple',
    placeholder: '작업실의 무드를 공간 연출 언어로 번역하기 위한 이미지 에셋',
    conditional: { key: 'subMode', value: '작가 연대기형' } },
  { key: 'keyRelationships', label: '주변 인물 관계망 (스승/동료/지인)', type: 'textarea',
    placeholder: '관계 분석을 통한 캐릭터화 및 미션 시나리오 구성에 활용할 인물 목록',
    conditional: { key: 'subMode', value: '작가 연대기형' } },
]
```

**산출물 (Outputs)**
* **작품 세계관 확장형:**
  - **3막 공간 동선:** [입장] 프롤로그 존 (세계 진입) → [중간] 절정 존 (사건의 중심) → [퇴장] 에필로그 존 (세계와의 이별)
  - **감각 기반 공간 연출안:** 온도, 습도, 날씨, 조명, 음향 연출 브리핑북
  - **내러티브 MD 리스트 3종:** "이 가상 세계에서 직접 가져온 물건" 컨셉의 스토리 굿즈 기획 (예: 챕터 2 편지 형태의 레터프레스 카드 등)
* **작가 연대기형:**
  - **연대기식 공간 동선:** [1존] 기원 (작가 고유의 기원과 공간) → [2존] 전환점 (기법/방향이 바뀐 순간) → [3존] 지금 이 작품 (현재 작품의 탄생 배경)
  - **작가 인터뷰 텍스트 매핑:** 전시 벽면에 노출할 작가의 실제 목소리가 담긴 텍스트 큐레이션
  - **관계형 인물 카드 및 아카이브 굿즈:** 작가의 핵심 주변 인물들이 바라보는 작가의 뒷이야기를 담은 에피소드 굿즈 3종
  - **관람객-작가 공통점 매핑:** 관람 중 수집된 관람객 취향 데이터와 작가의 성향 키워드를 대조하여, 팝업 입장 시 "오늘 당신과 작가의 공통점은 OOO입니다" 메시지 및 개인화 매핑 카드 발급안 제공

### Sensory Mode

```js
const sensoryModeFields = [
  { key: 'targetSenses', label: '타깃 감각', type: 'multicheck',
    options: ['향기', '사운드', '촉감', '미각'] },
  { key: 'colorTemp', label: '작품 주요 색온도', type: 'select',
    options: ['차가운 계열 (블루·그린)', '따뜻한 계열 (레드·옐로)', '중성 계열 (그레이·화이트)'] },
  { key: 'motionRhythm', label: '작품 움직임 리듬', type: 'select',
    options: ['느리고 고요한', '역동적이고 빠른', '불규칙적·카오틱'] },
]
```

**산출물**
- 감각 매핑 레시피 북 (색상 → 향기 계열, 리듬 → BPM)
- 조향사/사운드 아티스트용 브리핑 초안
- 감각 조합별 MD 추천 3종

### Archive Mode

```js
const archiveModeFields = [
  { key: 'dataTypes', label: '활용할 관람 데이터', type: 'multicheck',
    options: ['체류 시간', '감정 키워드', '대화 히스토리', '동선 데이터'] },
  { key: 'outputFormat', label: '주요 산출물 형태', type: 'select',
    options: ['인쇄물 (포스터·카드)', '디지털 (영상·NFT)', '혼합'] },
]
```

**산출물**
- 데이터 → 굿즈 변환 매핑 플로우
- 인쇄소형 팝업 공간 운영 가이드
- 개인화 MD 제작 파이프라인 제안

### Community Mode

```js
const communityModeFields = [
  { key: 'clusterCount', label: '취향 클러스터 수', type: 'select',
    options: ['2개', '3개', '4개'] },
  { key: 'eventType', label: '커뮤니티 이벤트 유형', type: 'multicheck',
    options: ['워크숍', '아티스트 토크', '콜라보 제작', '리유니언'] },
]
```

### Role Mode

```js
const roleModeFields = [
  { key: 'roleCount', label: '역할 수', type: 'select',
    options: ['3개', '4개', '5개'] },
  { key: 'missionStyle', label: '미션 스타일', type: 'select',
    options: ['개인 탐험형', '그룹 협력형', '혼합'] },
]
```

### Time Mode

```js
const timeModeFields = [
  { key: 'targetYear', label: '타깃 시대', type: 'text',
    placeholder: '예: 1970년대 뉴욕, 조선 후기' },
  { key: 'direction', label: '시간 방향', type: 'select',
    options: ['과거', '미래', '과거+미래 병행'] },
]
```

---

## 공통 산출물 구조

```ts
type ConceptBotOutput = {
  mode: ModeKey
  exhibitionType: ExhibitionType    // NEW
  packageName: string               // NEW
  concepts: [Concept, Concept, Concept]
  mdList: MD[]
  spaceGuide: SpaceGuide
  opsManual: OpsManual
  experienceModules: ExperienceModule[]  // NEW: Layer 2 경험 모듈 가이드
}

type ExperienceModule = {
  key: ModuleKey
  name: string
  purpose: string
  dataRequired: string[]
  userExperience: string
  implementationNote: string
}
```

---

## 현재 ConceptBot.jsx 구현 현황 및 TODO

- [x] 단일 컨셉 플로우 구현
- [ ] **전시 유형 선택 UI 추가** (카드 선택형)
- [ ] **자동 패키지 추천 로직** (EXHIBITION_PACKAGE_MAP 기반)
- [ ] 테마 모드별 조건부 필드 렌더링
- [ ] **경험 모듈 패키지 확인/변경 UI**
- [ ] 각 모드별 프롬프트 템플릿 분리
- [ ] 산출물에 경험 모듈 가이드 섹션 추가

---

## 관련 파일

```
src/pages/operator/
├── ConceptBot.jsx      ← 전시 유형 선택 + 모드 선택 UI 추가 필요
├── IPUpload.jsx        ← 업로드 후 ConceptBot으로 데이터 전달
├── Monitor.jsx         ← Archive Mode 데이터 소스, 집단 반응 지도 연계
└── Report.jsx          ← Community Mode 클러스터 결과, 경험 모듈 성과 표시
```

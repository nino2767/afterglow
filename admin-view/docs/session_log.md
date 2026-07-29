# AFTERGLOW 프로젝트 세션 로그 (Session Logs)

본 문서는 AFTERGLOW 프로젝트의 주제별 세션 의사결정 사항 및 작업 변경 이력을 최신순으로 기록하는 통합 로그북입니다.

---

## 📝 Session 07: 에이전트 토큰 최적화 및 스킬셋 배포
* **진행 기간:** 2026.07.09 ~ 2026.07.10
* **사용 브랜치:** `main` (머지 및 푸시 완료)
* **참여 에이전트:** @한결(PM), @가온(개발)

### 1. 주요 의사결정 및 정렬 사항 (Key Decisions)
- **에이전트 토큰 절약 원칙 규격화:** `git diff`를 통한 수정사항 자가 검증, `npx eslint` 기반 단일 파일 타겟 린트, silent 옵션을 통한 CLI 출력 최소화 규칙을 에이전트 공통 규칙에 편입.
- **양대 레포지토리 동기화:** `afterglow-admin` 및 `afterglow` (유저뷰) 양측 레포지토리 모두의 `.agents/rules/` 폴더에 최적화 규칙 및 유효 스킬셋을 동일하게 반영하여 향후 비용 절감 효과를 극대화.

### 2. 작업 산출물 및 코드 변경 내역 (Work Outputs)
* **어드민 레포 (`afterglow-admin`) 및 유저뷰 레포 (`afterglow`) 공통:**
  - [.agents/rules/00_common.md](file:///Users/jmk/develop/afterglow-admin/.agents/rules/00_common.md) (Git Diff 검증, CLI 출력 최소화, 타겟 린트 규칙 추가)
  - [.agents/rules/01_pm.md](file:///Users/jmk/develop/afterglow-admin/.agents/rules/01_pm.md) (문서 부분 탐색용 `search_docs_keyword` 스킬 추가)
  - [.agents/rules/04_developer.md](file:///Users/jmk/develop/afterglow-admin/.agents/rules/04_developer.md) (타겟 린트 및 Diff 검증 규칙/스킬 추가)
  - [.agents/rules/05_qa.md](file:///Users/jmk/develop/afterglow-admin/.agents/rules/05_qa.md) (빌드/린트 최소화 규칙 및 동일 스킬셋 추가)

### 3. 다음 세션으로의 인계 사항 (Handover Notes)
- 양대 레포지토리에 토큰 최적화가 성공적으로 반영되어 향후 AI 비용 소모량이 대폭 절감될 것입니다. 다음 세션에서는 이 스킬셋들을 활용하여 유저뷰 화면 개발 및 백엔드 데이터 검증 작업을 마이너하고 정밀하게 진행할 것을 적극 추천합니다.

---

## 📝 Session 06: B2B 어드민 고도화 및 문서 구조 체계화
* **진행 기간:** 2026.07.08 ~ 2026.07.09
* **사용 브랜치:** `main` (머지 및 푸시 완료)
* **참여 에이전트:** @한결(PM), @가온(개발)

### 1. 주요 의사결정 및 정렬 사항 (Key Decisions)
- **B2C 유저뷰 상세 기획 대조 및 SSOT v1.2 바인딩 완료:** `ConceptBot`, `Monitor`, `Report` 에 SSOT v1.1/1.2 스펙 완벽 바인딩.
- **팝업 기획 및 기간 설정 고도화:** `ConceptBot.jsx` 에 21일 연장 상한 규칙 검증, 상태머신 전이 UI, `SPINOFF_ZONE` 공간 세부 에디터 및 랜딩 혜택 세팅 뷰 탑재.
- **모니터 실시간 검증 추가:** `Monitor.jsx` 에 감정어 승인 큐(`pending_review`), 스핀오프 전시 선택 시 존 단위 히트맵 자동 분기 및 툴팁을 통한 `dwell_sec` 지표 정의 가시화.
- **리포트 6단계 퍼널 및 부가 지표 연동:** `Report.jsx` 에 SSOT 퍼널 개편, C경로 오가닉 유입 및 계정 연동 지표 신설.
- **문서 폴더링 체계화:** 공통 Spec 파일 6종을 `docs/00_공통-스펙-및-계약/`로 격리하고 과거 Phase 기획서 7종을 `docs/03_운영자-어드민/archive/` 폴더로 아카이브하여 README 경로 업데이트 완료.

### 2. 작업 산출물 및 코드 변경 내역 (Work Outputs)
* **코드 변경:**
  - [src/components/ProjectSwitcher.jsx](file:///Users/jmk/develop/afterglow-admin/src/components/ProjectSwitcher.jsx) (스핀오프 인덴트 및 뱃지 시각화, 테마 변수 연동)
  - [src/data/projects.js](file:///Users/jmk/develop/afterglow-admin/src/data/projects.js) (스핀오프 목업 프로젝트 추가)
  - [src/pages/operator/ConceptBot.jsx](file:///Users/jmk/develop/afterglow-admin/src/pages/operator/ConceptBot.jsx) (오픈일/종료일 설정, 21일 상한 검증, 상태머신 제어, SPINOFF_ZONE 구성안 에디터, 웰컴 혜택 폼 구현)
  - [src/pages/operator/Monitor.jsx](file:///Users/jmk/develop/afterglow-admin/src/pages/operator/Monitor.jsx) (감정어 승인 큐 pending_review, 존별 지표 분기, dwell_sec 툴팁 구현)
  - [src/pages/operator/Report.jsx](file:///Users/jmk/develop/afterglow-admin/src/pages/operator/Report.jsx) (SSOT v1.2 6단계 퍼널 연동, C경로 및 계정 지표 카드 추가, 재열람 미집계 예외 주의사항 표기)
* **문서 폴더링 정돈:**
  - `docs/00_공통-스펙-및-계약/` 하위로 데이터 계약(SSOT 최신 및 아카이브 3종), 운영정책, 페르소나 사양, 어드민 검토서 등 6종 이동
  - `docs/03_운영자-어드민/archive/` 하위로 과거 의사결정서 및 Phase 1 ~ 6 세부 기획서 7종 이동
  - [docs/README.md](file:///Users/jmk/develop/afterglow-admin/docs/README.md) (목차 및 경로 갱신)
  - [docs/session_log.md](file:///Users/jmk/develop/afterglow-admin/docs/session_log.md) (본 로그 기록 추가)
  - [docs/session_roadmap.md](file:///Users/jmk/develop/afterglow-admin/docs/session_roadmap.md) (Session 02 고도화 체크리스트 완수 반영)

### 3. 다음 세션으로의 인계 사항 (Handover Notes)
- B2B 어드민의 UI 바인딩 및 Vercel 배포(`afterglow-admin.vercel.app`)가 성공적으로 마무리되었습니다.
- 다음 세션은 B2C 유저뷰(`afterglow/user-view`) 레포지토리에서의 작업 연계를 권장합니다. 특히 어드민에 바인딩된 SSOT v1.2 규격(`invite.landing_viewed`, `invite.redeemed` 이벤트 발화 및 `self_checkin` 보상)이 B2C 화면 4/5/6번 구현부에 누수 없이 녹아들도록 정합성을 맞추는 태스크를 진행해야 합니다.

---

## 📝 Session 05: SSOT v1.1 확정 및 문서 동기화
* **진행 기간:** 2026.07.02 ~ 2026.07.04
* **사용 브랜치:** `feat/session-02-refine` (어드민) / `feat/planning-docs` (유저뷰) → 양쪽 main 머지 완료
* **참여 에이전트:** @한결(PM)

### 1. 주요 의사결정 및 정렬 사항 (Key Decisions)
- **SSOT v1.1 확정:** 스핀오프 팝업을 \"굿즈 판매점\"이 아닌 **미니 전시(EXHIBITION.type=spinoff)**로 공식 편입. `SPINOFF_ZONE` 신설, `parent_exhibition_id` 연결, 스핀오프 전용 체험 이벤트(§3-1) 추가.
- **운영 정책 문서 신설:** 팝업 개설 시점·상태 머신·초대장 유효기간·퍼널 집계 기간 등 운영 규칙 SSOT(`스핀오프-팝업-운영정책.md`) 확정.
- **큐레이터 페르소나 사양 신설:** concept_type 6종별 AI 큐레이터 롤 분리 설계 — 기억(TASTE_PROFILE)은 공유, 역할(직함·화법·대화목표)만 교체하는 모듈 구조 확립.
- **유저뷰 상세기획 01~06 확정:** 온보딩·스냅 정보카드·AI 큐레이터 채팅·여운 리포트/Bridge·스핀오프 랜딩·팝업 AI 큐레이터 6화면 기획 문서 완성.
- **양쪽 repo 문서 동기화:** 공통 문서(SSOT·운영정책·페르소나 사양)는 어드민+유저뷰 동시 배포, 유저뷰 전용 상세기획 01~06은 유저뷰 repo에만 배포.

### 2. 작업 산출물 및 코드 변경 내역 (Work Outputs)
* **어드민 repo (`afterglow-admin/docs/`) — 신규/수정:**
  - [00_데이터-계약-SSOT.md](./00_공통-스펙-및-계약/00_데이터-계약-SSOT.md) — v1.1으로 **덮어쓰기** (SSOT 단일 파일 유지)
  - [00_데이터-계약-SSOT_v1.1.md](./00_공통-스펙-및-계약/00_데이터-계약-SSOT_v1.1.md) — 원본 버전 병행 보관
  - [스핀오프-팝업-운영정책.md](./00_공통-스펙-및-계약/스핀오프-팝업-운영정책.md) — **신규**
  - [스핀오프-큐레이터-페르소나-사양.md](./00_공통-스펙-및-계약/스핀오프-큐레이터-페르소나-사양.md) — **신규**
* **유저뷰 repo (`afterglow/docs/관람객(유저)서비스/`) — 신규 커밋:**
  - 스핀오프-팝업-운영정책.md / 스핀오프-큐레이터-페르소나-사양.md
  - 유저뷰-상세기획-01-온보딩.md ~ 06-팝업-AI큐레이터.md (6종)

### 3. 다음 세션으로의 인계 사항 (Handover Notes)
- SSOT v1.1 및 6화면 상세기획이 양쪽 repo main에 반영 완료. 다음 세션은 SSOT §7 후속 반영 큐 실행 권장:
  1. `ConceptBot.jsx` — `tag` → `concept_type` enum 6종 교체 + SPINOFF_ZONE 구조 산출
  2. `Monitor.jsx` — leaf/axis 감정 구조 + spinoff 존별 지표 뷰
  3. `Report.jsx` — 퍼널 6단계 바인딩 + 팝업 체험 지표(§3-1) 섹션
  4. 운영자 스위처 — main 하위 spinoff 들여쓰기 표시
  5. API 명세 — spinoff 세션/존 이벤트 엔드포인트 추가

---

## 📝 Session 02: 어드민 기능 고도화 (B2B Admin Core Optimization)
* **진행 기간:** 2026.06.16
* **사용 브랜치:** `feat/session-02`
* **참여 에이전트:** @한결(PM), @여울(기획), @다올(디자인), @바른(QA)

### 1. 주요 의사결정 및 정렬 사항 (Key Decisions)
- **B2B 중심 기획 고도화:** B2C 관람객 서비스의 타 레포 분리에 대응하여 B2B 어드민의 핵심 기능(Concept Bot 및 RS 정산 엔진) 기획 스펙 고도화에 자원을 집중하기로 결정.
- **2-Layer 기획 자동화 추천 엔진 스펙 확립:** `스핀오프 팝업 — 모듈 기획.md` 문서의 10종 전시 패키지 추천 맵 및 6가지 공간 테마 모드(Layer 1)와 10대 경험 모듈(Layer 2)을 연계한 자동 추천 로직 설계.
- **스토리 모드 다변화 및 세부 스펙 보강:** Story Mode 하위의 '작품 세계관 확장형' 및 '작가 연대기형' 두 갈래에 대한 구체적인 입력 데이터 스펙 및 산출물(3막 공간 동선, 작가-관람객 공통점 매핑 등)을 상호보완적으로 상세화.
- **경험 모듈용 API 엔드포인트 규격화:** B2C 개발자와의 원활한 협업을 위한 10대 경험 모듈용 B2C ↔ B2B API Contract 설계 (감정 담벼락, 큐레이션, 디지털 굿즈, 투표/질문 등).
- **어드민 고도화 화면 디자인 명세 정립:** 기획자 여울의 설계를 바탕으로 디자이너 다올이 Concept Bot 전시 유형 선택 UI, 경험 모듈 패키지 확인/변경 UI, 그리고 정산 대시보드(KPI, 월별 RS 차트, 세부 정산 테이블)의 와이어프레임 및 레이아웃 규칙을 명문화.

### 2. 작업 산출물 및 코드 변경 내역 (Work Outputs)
* **기획/디자인 명세 문서:**
  - [conceptbot-mode-spec.md](./03_운영자-어드민/conceptbot-mode-spec.md) (전시 유형별 패키지 맵 및 스토리 모드 입력 필드 최신화 완료)
  - [Phase 4 상세 — 스핀오프 기획 도출.md](./03_운영자-어드민/Phase%204%20상세%20—%20스핀오프%20기획%20도출.md) (Layer 1 테마 및 Layer 2 경험 모듈 연계 기획 보완 완료)
  - [B2C-B2B-연동-API-명세.md](./02_관람객-유저서비스/B2C-B2B-연동-API-명세.md) (경험 모듈 연동 API 6종 신설 완료)
  - [디자인명세 - 어드민 고도화 화면.md](./03_운영자-어드민/디자인명세%20-%20어드민%20고도화%20화면.md) (Concept Bot UI & 정산 대시보드 UI/UX 가이드 신규 작성 완료)
  - [session_log.md](./session_log.md) (세션 로그북 갱신)

### 3. 다음 세션으로의 인계 사항 (Handover Notes)
- B2C-B2B API 연동 규격 및 UI/UX 디자인 가이드라인이 명세서 수준으로 완전하게 구축되었으므로, 향후 개발자 가온이 실제 코드 및 데이터베이스 스키마 구현 시 본 명세서들을 최우선 참고하여 개발을 이어갈 수 있도록 조치함.
- 세션 02가 성공적으로 완료되었으므로, 브랜치 병합 및 푸시 완료 후 이 세션을 종료하고 다음 작업 단계로 이행을 권장.

---

## 📝 Session 01 보완: 에이전트 협업 체계 정비 및 노션 기획 연동
* **진행 기간:** 2026.06.15 ~ 2026.06.16
* **사용 브랜치:** `main`
* **참여 에이전트:** @한결(PM), @여울(기획), @다올(디자인), @가온(개발), @바른(QA)

### 1. 주요 의사결정 및 정렬 사항 (Key Decisions)
- **가상 협업 에이전트 크루 순우리말 네이밍 확정:** PM(@한결), 기획(@여울), 디자인(@다올), 개발(@가온), QA(@바른)로 가상 팀원의 정체성 수립.
- **멘션 기반 협업 오케스트레이션 룰 도입:** 대화창 내 태깅을 기반으로 PM이 업무를 쪼개어 기획 -> 디자인 -> 개발 -> QA 순으로 위임하는 규칙 수립.
- **자동 연쇄 검증 프로세스 구축:** 개발자 가온이 코드를 패치하면 자동으로 QA 바른을 태그하여 빌드/린트를 강제하고, 검수 성공 시 PM 한결에게 자동 보고하는 파이프라인 형성.
- **통합 세션 로그북(session_log.md) 구축:** 분산된 개별 로그들을 하나로 묶고 최신순 정렬하여 AI 컨텍스트 메모리 브릿지로 정의.
- **노션 API 공식 연동:** 인티그레이션(`doran_git`)의 토큰 설정 문제를 해결하고 노션의 모듈 기획 데이터를 API로 직접 긁어와 마크다운으로 동적 빌드 완수.

### 2. 작업 산출물 및 코드 변경 내역 (Work Outputs)
* **기획/규칙 문서:**
  - [스핀오프 팝업 — 모듈 기획.md](./01_상위기획-및-방향성/스핀오프%20팝업%20—%20모듈%20기획.md) (노션 API 변환본)
  - [.agents/rules/](file:///Users/jmk/develop/afterglow-admin/.agents/rules/) 하위 공통 규칙(`00_common.md`) 및 개별 에이전트 규칙 5종 업데이트 완료
  - [session_log.md](file:///Users/jmk/develop/afterglow-admin/docs/session_log.md) (통합 로그북 갱신)
* **코드 변경:**
  - [docs/README.md](file:///Users/jmk/develop/afterglow-admin/docs/README.md) (통합 로그북 및 모듈 기획 링크 업데이트)

### 3. 다음 세션으로의 인계 사항 (Handover Notes)
- 모든 협업 시스템과 문서 정합성 정비가 끝났으므로, 해당 대화창을 리셋(New Conversation)하여 토큰을 정리한 뒤 신규 스레드에서 본격적인 **Session 02: 관람객(유저) 서비스 기획**을 시작할 것을 권장.

---

## 📝 Session 04: 슈퍼(고객사) 어드민 개발
* **진행 기간:** 2026.06.15
* **사용 브랜치:** `main`
* **참여 에이전트:** @한결(PM), @여울(기획), @가온(개발), @바른(QA)

### 1. 주요 의사결정 및 정렬 사항 (Key Decisions)
- 단일 React 프로젝트 내에서 환경 변수(`VITE_ADMIN_MODE=super`) 배포를 통해 슈퍼/고객사 관리 어드민을 분리 기동하기로 결정.
- Vercel 신규 프로젝트 `dorand515/afterglow-super`를 신설하고 독립 도메인 `afterglow-super.vercel.app`에 단독 기동 배포 완료.
- `VITE_ADMIN_MODE=super` 빌드 환경에서 상단 네비게이션 헤더 디버그 바를 제거하고 컴포넌트의 레이아웃 패딩(`paddingTop: 0`)을 적용하여 어드민 단독 화면을 직관적으로 연출하도록 UI 가이드 적용.

### 2. 작업 산출물 및 코드 변경 내역 (Work Outputs)
* **기획 문서:**
  - [상세기획 - 고객사 관리 어드민.md](./04_슈퍼-고객사-어드민/상세기획%20-%20고객사%20관리%20어드민.md)
* **코드 변경:**
  - [src/App.jsx](../src/App.jsx) (환경 변수별 라우팅 격리, super 모드 패딩 여백 청소)
  - [package.json](../package.json) (`dev:super`, `build:super` 전용 런타임 스크립트 추가)
  - [.env.super](../.env.super) (모드 고정용 환경 변수) 및 [.env.operator](../.env.operator) 설정 완료
  - [vercel.json](../vercel.json) (Vercel 배포 시 `dist` 아웃풋 폴더를 올바르게 잡도록 정렬)

### 3. 다음 세션으로의 인계 사항 (Handover Notes)
- `afterglow-super.vercel.app`에 접속하면, 사이드바와 상단에 불필요한 바 없이 오직 고객사 관리 화면만 표출되는 상태입니다.
- 고객사 관리 화면 내의 성과 분석 및 정산 모델(Standard, Low-Risk, Performance-Based)은 Session 03의 정산 관리 기능과 동일한 데이터 구조를 지향하므로, 향후 API 연동 시 데이터베이스 스키마 동기화에 유의해야 합니다.

---

## 📝 Session 03: 운영자 어드민 개발
* **진행 기간:** 2026.06.09 ~ 2026.06.15
* **사용 브랜치:** `feat/agent-setup` -> `main` 머지 완료
* **참여 에이전트:** @한결(PM), @여울(기획), @다올(디자인), @가온(개발), @바른(QA)

### 1. 주요 의사결정 및 정렬 사항 (Key Decisions)
- 단일 React 프로젝트 내에서 환경 변수(`VITE_ADMIN_MODE=operator`) 배포를 통해 운영자 어드민을 분리 기동하기로 결정.
- Vercel 프로젝트 `dorand515/afterglow-admin`를 연동하고 독립 도메인 `afterglow-admin.vercel.app`에 단독 기동 배포 완료.
- 로컬 개발 환경에서 빠른 테스트를 위해 화면 우측 하단에 개발 전용 모드 전환용 플로팅 버튼(`DEV: To Super`) 구현.
- 모바일 뷰 닫기/오버레이 및 bottom-tab 바의 React 상태(state) 충돌 오류 자율 디버깅 및 패치.

### 2. 작업 산출물 및 코드 변경 내역 (Work Outputs)
* **기획 문서:**
  - [상세기획 - 운영자 어드민.md](./03_운영자-어드민/상세기획%20-%20운영자%20어드민.md)
  - [어드민 구조 의사결정 — 운영자 어드민 통합 vs 분리.md](./03_운영자-어드민/어드민%20구조%20의사결정%20—%20운영자%20어드민%20통합%20vs%20분리.md)
  - [conceptbot-mode-spec.md](./03_운영자-어드민/conceptbot-mode-spec.md) (전시 유형별 자동 패키지 추천 스펙 문서)
  - Phase 1 ~ 6 세부 기획 문서 6종
* **코드 변경:**
  - [src/App.jsx](../src/App.jsx) (환경 변수별 라우팅 격리, 디버그 전환 스위처 배치)
  - [package.json](../package.json) (`dev:operator`, `build:operator` 전용 런타임 스크립트 추가)
  - [src/pages/operator/](../src/pages/operator/) 하위 5개 화면 컴포넌트 내 모바일 drawer 및 bottom-tab 런타임 ReferenceError 오류 자율 패치 완료

### 3. 다음 세션으로의 인계 사항 (Handover Notes)
- `VITE_ADMIN_MODE=operator` 기동 시 정상적으로 운영자 화면 6개만 렌더링되며, 상단 디버그 바가 완벽히 소거됨.
- 향후 Concept Bot의 UI 연동(전시 유형 선택 카드 및 추천 매핑 로직) 개발 시 [conceptbot-mode-spec.md](./03_운영자-어드민/conceptbot-mode-spec.md)를 참조하여 구현 예정.

---

## 📝 Session 01: 상위 기획 및 방향성
* **진행 기간:** 2026.06.06 ~ 2026.06.15
* **사용 브랜치:** `main`
* **참여 에이전트:** @한결(PM), @여울(기획)

### 1. 주요 의사결정 및 정렬 사항 (Key Decisions)
- AFTERGLOW 전시 팝업 및 AI 해설사 시스템의 상위 비즈니스 모델(B2B/B2G 우선 도입 후 B2C 확장) 확립.
- 기존 전문 해설사와의 공존 모델(AI는 데이터 및 24시간 응대 담당, 인간 해설사는 감성적 스토리텔링과 특별 심화 해설 담당) 설계.
- 노션 기획 자료를 프로젝트 내 마크다운 스펙 문서로 공식 병합 및 최적화.

### 2. 작업 산출물 및 코드 변경 내역 (Work Outputs)
* **기획 문서:**
  - [스핀오프 전시 팝업_방향성문서_v3_0.md](./01_상위기획-및-방향성/스핀오프%20전시%20팝업_방향성문서_v3_0.md) (핵심 기능 및 비즈니스 모델 기술)
  - [스핀오프 전시 상위기획 (서비스관점).md](./01_상위기획-및-방향성/스핀오프%20전시%20상위기획%20(서비스관점).md)
  - [AI 공연_전시 해설사 —_ AFTERGLOW에 녹임 (1).md](./01_상위기획-및-방향성/AI%20공연_전시%20해설사%20—_%20AFTERGLOW에%20녹임%20(1).md) (공공 데이터 및 역할 분담 기술)

### 3. 다음 세션으로의 인계 사항 (Handover Notes)
- 상위 방향성이 수립되었으므로 이를 실제 서비스로 구현하기 위한 관람객 모바일 웹 상세 기획 및 AI 큐레이터 인터랙션 모델링(Session 02) 단계로 연계 필요.

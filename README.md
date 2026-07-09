# AFTERGLOW (애프터글로우) — 관람객 서비스 레포지토리

> **AFTERGLOW**는 전시 관람객의 감정 흔적을 수집·분석하여 개인 맞춤형 리포트와 스핀오프 전시(팝업 라운지) 연동 혜택을 제공하는 감성 아카이빙 플랫폼입니다.

---

## 📂 레포지토리 구조

본 레포지토리는 관람객 프론트엔드 모바일 웹앱 코드와 기획/설계 문서를 통합하여 관리합니다.

```
afterglow/
  ├── docs/                        # 기획, 설계, 협업 가이드 문서 저장소
  │    ├── 00_공통-스펙-및-계약/     # 데이터 계약(SSOT), 개발 착수 가이드, Git 워크플로우 등
  │    ├── 01_상위기획-및-방향성/   # 서비스 개념 기획 및 스핀오프 방향성 문서
  │    ├── 02_관람객-유저서비스/     # 유저뷰 상세기획(온보딩, AI 채팅, 리포트 등) 및 IA
  │    ├── 03_백엔드-개발-아젠다/   # 백엔드 API 설계 및 전략
  │    └── 04_테스트-및-QA/         # 유저테스트 수정사항 이슈 트래커
  │
  ├── user-view/                   # 관람객 모바일 웹앱 (프론트엔드 프로젝트)
  │    ├── src/
  │    │    ├── app/               # Next.js App Router (3-way 모듈 구조)
  │    │    ├── components/        # 공통 및 모듈별 TSX 컴포넌트
  │    │    └── lib/               # 공통 비즈니스 로직, SSOT 상수, 세션 처리
  │    ├── package.json
  │    └── CLAUDE.md               # 프론트엔드 로컬 개발 규칙 및 코딩 가이드
  │
  └── .agents/                     # AI 에이전트 자율 가이드라인 규칙 파일군
```

---

## 📐 핵심 기술 스택 (user-view)

- **Framework**: Next.js App Router (React 19, TypeScript)
- **Styling**: Vanilla CSS (`globals.css` 디자인 토큰 및 CSS 변수 사용)
- **Components & Icons**: Lucide React
- **Aesthetics**: 모바일 웹앱 전용 셸 레이아웃 (가로 `max-width: 430px` 중앙 정렬)

---

## 👥 3-way 모듈 분담 및 구조 (Next.js)

병렬 개발 중 소스 코드 충돌을 방지하고 책임 경계를 나누기 위해 Next.js 라우트 그룹과 폴더 구조를 **3-way**로 분류하여 격리 개발합니다.

1. **`(main)` (J 담당)**
   - 본전시 가이드모드 화면군 (화면1 온보딩 · 화면2 정보카드 · 화면3 AI채팅 · 화면4 여운리포트)
2. **`(spinoff)` (Sol 담당)**
   - 스핀오프 가이드모드 화면군 (화면5 스핀오프랜딩 · 화면6 팝업 큐레이터)
3. **`(account)` (J 담당)**
   - 계정모드 화면군 (화면0 로그인 · 화면7 마이페이지 · 화면8 마이리포트 · 화면9 초대장 · 화면10 홈)
4. **`shared/` (공용 — 수정 시 상대방 리뷰 필수)**
   - 모듈 간의 공통 참조 컴포넌트(`components/shared/`) 및 라이브러리(`lib/shared/`)

---

## 🛠️ 개발 및 빌드 명령어

`user-view` 디렉토리로 이동하여 아래 명령어를 실행하십시오.

```bash
cd user-view

# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드 (Next.js 컴파일 및 자율 검증)
npm run build

# 린트(Linter) 검사
npm run lint
```

---

## 🚀 Git 협업 규칙 및 PR 전략

자세한 내용은 [GitHub 세팅 가이드 문서](file:///Users/jmk/develop/afterglow/docs/00_공통-스펙-및-계약/github-setting.md)를 참고해 주십시오.

### 1. 브랜치 명명 규칙
- `feat/main-<화면명>`: 본전시 기능 개발 (J)
- `feat/spinoff-<화면명>`: 스핀오프 기능 개발 (Sol)
- `feat/account-<화면명>`: 계정모드 기능 개발 (J)
- `shared/<변경내용>`: 공용 코드 수정 (상대방 리뷰 필수)

### 2. PR 및 머지 전략
- **PR 제목 접두어 필수**: 변경 범위에 따라 `[MAIN]`, `[SPINOFF]`, `[ACCOUNT]`, `[SHARED]`를 제목에 반드시 표기합니다.
- **Squash Merge 기본 사용**: 모든 PR은 최종 커밋 히스토리를 깔끔하게 정리하기 위해 Squash Merge로 머지합니다.
- **리뷰 제약**:
  - 본인 담당 폴더 내부 변경 시 상대방 리뷰 생략 및 셀프 Squash 머지가 가능합니다.
  - `shared/` 변경 시에는 **상대방의 리뷰와 명시적 승인(Approve)**이 완료되어야만 머지할 수 있습니다.

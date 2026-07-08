# CLAUDE.md — Afterglow 유저뷰 (관람객 웹앱)

## 이 파일의 역할
AI 코딩 어시스턴트(Claude Code, Antigravity 등)가 이 repo를 수정할 때 **반드시** 지켜야 할 규칙 모음.

---

## 🛠️ 개발 및 빌드 명령어
- 로컬 개발 서버: `npm run dev -- -p 5177`
- 프로덕션 빌드: `npm run build`
- 린트 검사: `npm run lint`

---

## 📐 핵심 기술 스택
- **Next.js App Router** (React 19, TypeScript, Tailwind CSS v4)
- 폰트: `Inter` (본문) + `Playfair Display` (전시형 제목)
- 기준 뷰포트: 데스크톱 브라우저에서 가로 `max-width: 430px` 중앙 정렬 셸 레이아웃

---

## 🎨 디자인 가이드라인 & CSS 토큰
- **버건디 포인트**: `#8B2E4A` (var(--accent))
- **배경**: `#FAFAF9` (var(--bg))
- **컴포넌트 카드**: `#FFFFFF` (var(--surface)), 테두리는 `1px solid var(--border)`
- **반응형 폰트**: globals.css의 `.t-display`, `.t-heading`, `.t-title`, `.t-body`, `.t-caption` 사용

---

## ⚠️ 데이터 레이어 보류 및 격리 원칙 (★중요★)
- **현재 상황**: `docs/00_데이터-계약-SSOT.md`와 `docs/관람객(유저)서비스/데이터 수집 방식 및 정보.md`의 감정 모델(8축, 세그먼트) 정의 충돌이 해결될 때까지 **데이터 레이어 개발은 일시 보류**합니다.
- **적용 규칙**:
  - `src/lib/track.ts` 등의 트래킹 이벤트 발화, 실시간 API 통신, 감정 정보 데이터베이스(DB) 적재 로직은 수정/추가하지 않습니다.
  - 모든 상태 변경 및 취향 수집은 컴포넌트 내부 State 혹은 브라우저 `localStorage` 기반의 Mock 데이터를 사용해 정적 UI가 정상 작동하도록 처리합니다.
  - 새로운 페이지나 컴포넌트에서 `useSearchParams()`를 쓸 때는 **반드시** Next.js의 `<Suspense>` 경계로 감싸야 빌드 시 에러가 나지 않습니다.

---

## 📂 프로젝트 구조
- `src/app/layout.tsx`: 모바일 뷰포트 센터링 및 폰트 세팅
- `src/app/page.tsx`: `/onboarding`으로의 자동 리다이렉트
- `src/app/(guide)/`: 가이드 모드 화면군 (S1~S6)
- `src/app/(account)/`: 계정 모드 화면군 (S0, S7~S10)
- `src/components/`: 공통 컴포넌트 (`NavigationShell.tsx`, `BottomTabBar.tsx`, `EmotionChip.tsx` 등)

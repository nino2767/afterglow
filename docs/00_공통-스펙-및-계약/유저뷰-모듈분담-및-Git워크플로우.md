# 유저뷰 모듈 분담 · 폴더 구조 · Git 워크플로우

> 버전: v1.0 | 작성일: 2026.07.08 | 상태: 📋 확정 제안
> 근거: 유저뷰 IA v1.0, 화면0~10 상세기획, SSOT v1.2
> 담당: **J = 본전시(main) + 계정모드(account)** · **Sol = 스핀오프(spinoff)**
> ⚠️ 개발 착수 가이드(`유저뷰-개발-착수-가이드.md`) §1의 `(guide)`/`(account)` 2-way 라우트 그룹은 본 문서로 **대체**됨 — 3-way(main/spinoff/account)로 재편.

---

## 1. 담당 매핑

| 모듈 | 담당 | 화면 | 성격 |
|---|---|---|---|
| **main** | J | 1(온보딩) · 2(정보카드) · 3(AI채팅) · 4(리포트+Bridge) | 본전시 가이드모드 |
| **spinoff** | Sol | 5(스핀오프랜딩) · 6(팝업큐레이터) | 스핀오프 가이드모드 |
| **account** | J | 0(로그인) · 7(마이페이지) · 8(마이리포트) · 9(초대장) · 10(홈) | 계정모드 |
| **shared** | 공용(리뷰 필수) | — | 두 모듈이 공유하는 컴포넌트·lib |

## 2. 경계에서 이미 발견된 의존 관계 2건

두 모듈은 완전히 독립적이지 않다. 아래 2건은 **shared로 격리**해야 충돌 없이 병렬 작업이 가능하다.

1. **화면6(Sol)이 화면3(J)의 채팅 컴포넌트를 재사용**하도록 이미 설계돼 있음(화면6 §3-④). → `ChatThread` 컴포넌트는 처음부터 `components/shared/`에 위치해야 하며, J·Sol 둘 다 여기서 가져다 쓴다. main이나 spinoff 폴더 안에 있으면 상대가 직접 import해야 해서 폴더 경계가 깨진다.
2. **화면4(J)가 화면5(Sol)의 진입점(Bridge/초대장)을 생성**한다. 이건 코드 의존이 아니라 **데이터 계약(SSOT의 SPINOFF_INVITE)** 의존이라, `lib/shared/ssot.ts`만 지키면 충돌 없음 — 화면4는 그냥 `/spinoff/landing?invite_id=...`로 링크만 건다.

## 3. 폴더 구조 (Next.js App Router)

```
app/
  (main)/                    # J
    onboarding/page.tsx        화면1
    artwork/page.tsx           화면2
    curator/page.tsx           화면3
    report/page.tsx            화면4
  (spinoff)/                 # Sol
    landing/page.tsx           화면5
    popup-curator/page.tsx     화면6
  (account)/                 # J
    login/page.tsx             화면0
    home/page.tsx               화면10
    my-reports/page.tsx        화면8
    invites/page.tsx           화면9
    mypage/page.tsx             화면7

lib/
  shared/                    # 누구나 import 가능 — 수정 시 상대방 리뷰 필수
    ssot.ts                    SSOT 미러
    track.ts                   이벤트 발화
    session.ts                 세션 상태
    account.ts                 계정·병합 로직
  main/                      # J 전용
    knowledge-base.ts          KB 조회, RAG 프롬프트 구성
    taste-profile.ts           axis 집계, 세그먼트 산출
  spinoff/                   # Sol 전용
    zones.ts                   SPINOFF_ZONE 조회
    bridge-matching.ts         concept_type 매칭 (SSOT §5)
    curator-roles.ts           6종 롤 프롬프트 (페르소나 사양)

components/
  shared/                    # ChatThread, EmotionChip, PersonaCard, InviteCard, QRScanner, BottomBar, NavShell
  main/                      # 화면1~4 전용 UI
  spinoff/                   # 화면5~6 전용 UI
  account/                   # 화면0,7~10 전용 UI
```

**규칙**: 자기 폴더(`main/`, `spinoff/`, `account/`) 밖은 직접 수정하지 않는다. 공유가 필요한 요소는 반드시 `shared/`로 옮긴 뒤 그쪽에서 가져다 쓴다.

---

## 4. Git 브랜치 전략

### 브랜치 네이밍
```
feat/main-<화면명>       예: feat/main-onboarding      (J)
feat/spinoff-<화면명>    예: feat/spinoff-popup-curator (Sol)
feat/account-<화면명>    예: feat/account-home          (J)
shared/<변경내용>        예: shared/emotion-axis-fix     (누구나, 리뷰 필수)
```

### PR·머지 규칙

| 변경 범위 | 리뷰 | 머지 방식 |
|---|---|---|
| 본인 담당 폴더 내부만 (main/account=J, spinoff=Sol) | 생략 가능 — 속도 우선 | 셀프 squash merge |
| `shared/` (컴포넌트·lib) 변경 | **상대방 승인 필수** — 계약 변경으로 취급 | 승인 후 squash merge |
| `docs/00_데이터-계약-SSOT.md` 변경 | 코드 PR 이전에 노션에서 합의 먼저 | 합의 후 반영 |

- PR 제목에 접두어 필수: `[MAIN]`, `[SPINOFF]`, `[ACCOUNT]`, `[SHARED]` — 어느 모듈 변경인지 한눈에 식별.
- `main`(git 기본 브랜치)은 보호 브랜치 — 항상 배포 가능 상태 유지, 직접 push 금지, PR로만.
- 서로 다른 폴더만 건드리면 구조적으로 충돌이 거의 안 남 — 유일한 상시 충돌 위험 지점은 `shared/`와 `account/`의 내비게이션 셸(상단 계정아이콘·하단 탭바)이므로, 이건 **account(J) 소유로 명시** — main/spinoff는 셸을 소비만 하고 수정하지 않는다.

### 하루 작업 흐름 예시
```
J:   feat/main-report 브랜치 → 화면4 작업 → PR → 셀프 머지
Sol: feat/spinoff-landing 브랜치 → 화면5 작업 → PR → 셀프 머지
     (같은 날 작업해도 폴더가 겹치지 않아 충돌 없음)

누군가 ChatThread에 기능 추가 필요 →
  shared/chat-thread-voice-input 브랜치 → PR → 상대방 리뷰 요청 → 승인 후 머지
```

---

## 5. `.agents/rules` 연동 메모

기존 `.agents/rules/04_developer.md`(풀스택 개발 에이전트)가 이 모듈 경계를 인지하도록, 에이전트 실행 시 담당 폴더 범위를 프롬프트에 명시하는 걸 권장한다 (예: "이 세션은 `spinoff/` 폴더만 수정. `shared/`는 읽기만, 수정 필요하면 먼저 알릴 것"). 별도 `.agents/rules` 파일 수정은 두 분 협의 후 진행.

## 6. 남은 결정 포인트

1. ~~squash merge 외 다른 머지 전략 선호 여부~~ → **확정: squash merge 기본값으로 진행**
2. ~~shared 리뷰 SLA~~ → **확정: 별도 SLA 불필요**

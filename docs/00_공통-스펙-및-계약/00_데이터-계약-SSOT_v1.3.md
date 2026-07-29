# AFTERGLOW 데이터 계약 (Data Contract / SSOT)

> 버전: v1.3 | 갱신일: 2026.07.08 | 상태: ✅ 확정
> v1.2 → v1.3 변경: **스핀오프 체험 중심 전환**(퍼널 6단계 교체), **다중 스핀오프**, **푸시 알림**, **매칭 피드백**, **통합 리포트** 반영. §9 신설(신규 엔티티·이벤트 집약), §3 퍼널 개정.
> 적용 대상: **어드민 repo + 유저뷰 repo 공통 SSOT.**

---

## 0~2. (v1.1과 동일 — 요약)

용어(전시=EXHIBITION=프로젝트, 존=SPINOFF_ZONE) · 계층(CLIENT→EXHIBITION→SESSION) · 감정모델(8축+leaf). **전문은 SSOT v1.1 본문 참조, 변경 없음.**

---

## 3. 전환 퍼널 이벤트 — 🔄 v1.3 개정 (체험 중심)

MVP 핵심 지표(v3.0 §9: B2C 전환율 20%)의 측정 기준.

| # | 퍼널 단계 | 이벤트명 | 발화 시점 | 비고 |
|---|---|---|---|---|
| 1 | 총 관람객 | `session.start` | QR 스캔 → 온보딩 완료 | main 세션 기준 |
| 2 | AI 큐레이터 접속 | `curator.chat_start` | 세션 내 첫 AI 메시지 | |
| 3 | 브릿지 알림 수신 | `invite.issued` | `session/complete` 초대장 발급 | 다중 발급 시 **집계는 세션당 1회** (§9-1) |
| 4 | 팝업 페이지 방문 | `invite.landing_viewed` | 초대장 랜딩 진입 | **⭐ 성공지표 판정 기준 (4단계/1단계 = 전환율)** |
| 5 | 실제 팝업 방문 | `invite.redeemed` | 셀프 체크인 | MVP=self_checkin |
| 6 | **체험 완료** 🔄 | **`experience.completed`** | 존 체험 완료 | **v1.2의 `purchase.link_clicked`에서 교체** |

### 3-1. 퍼널 6단계 교체 근거 (v1.3)

- 기존 6단계 `purchase.link_clicked`는 **외부 커머스 링크 클릭까지만 추적** → 실제 결제 여부 검증 불가. 검증 불가능한 이벤트를 최종 단계로 두는 것은 부적절.
- 스핀오프의 존재 이유는 v3.0 정의상 **"2차 체험 공간"** — 굿즈가 아니라 체험이 본체. `experience.completed`는 현장에서 직접 측정 가능하고 서비스 본질과 일치.
- **MVP 성공지표(전환율 20% = 4단계/1단계)는 불변** — 6단계 교체는 판정 기준에 영향 없음.
- `purchase.link_clicked`는 삭제하지 않고 **참고 지표로 강등**(§9-4).

### 3-2. 스핀오프 체험 지표 (퍼널 외)

`spinoff.session_start` / `spinoff.zone_viewed` / `spinoff.curator_chat` / `landing.organic_viewed` (v1.1 유지) + `experience.started` / `experience.output_claimed` / `purchase.link_clicked`(강등) (§9 신규)

---

## 4~5. (v1.1과 동일 — 요약)

세그먼트 4종(emotional_explorer / experience_seeker / companion_visitor / info_collector) · concept_type 6종(story/sensory/archive/community/role/time). **변경 없음.**

---

## 6. (v1.1과 동일 — 요약)

엔티티 9종 + SPINOFF_ZONE. 스코프 키 `exhibition_id`. **v1.3 추가 필드·엔티티는 §9에 집약.**

---

## 7. 계정 모델 (ACCOUNT) · 내비게이션 셸 — v1.2와 동일 + 📌 알림 필드 추가

v1.2 §7 전체 유지. 아래 필드만 추가(푸시 알림용):

```
ACCOUNT
  + phone: string?              🆕 카카오 알림톡 발송용 (§9-2)
  + notify_channel: enum        🆕 kakao | email
```

*(§7-1~7-4 본문은 v1.2와 동일 — 게스트 우선 원칙, 병합 규칙, 2모드 내비게이션 셸)*

---

## 8. (v1.2 후속반영 항목 — 대부분 완료, 생략)

---

## 9. 🆕 v1.3 신규 엔티티 · 필드 · 이벤트 (집약)

### 9-1. 다중 스핀오프 (1 main : N spinoff 활성화)

```
EXHIBITION (type=main)
  + max_spinoff_recommendations: int   기본 1. 관람객 1인에게 제안할 스핀오프 최대 개수 (운영자 설정)

SPINOFF_INVITE
  + rank: int                          추천 순위 (1=최상위)
  + match_score: float                 concept_type × axis 친화도 스코어
```

- 한 세션에서 복수 SPINOFF_INVITE 발급 가능. `invite.issued`는 건수만큼 발화하되 **퍼널 3단계 집계는 세션당 1회**(전환율 오염 방지).
- Bridge 매칭: 최고점 1종 → **상위 N종**(N = max_spinoff_recommendations). 운영 중 스핀오프가 N보다 적으면 그 수만큼.
- 화면4 리포트: 초대장을 rank 순으로 전체 나열(rank 1 강조). max=1이면 기존 단일 카드로 자연 축약.

### 9-2. 푸시 알림

```
NOTIFICATION_SUBSCRIPTION
  subscription_id (PK), account_id (FK), exhibition_id (FK)
  type: enum          popup_open | closing_soon | next_exhibition
  active: bool, created_at

NOTIFICATION_LOG
  log_id (PK), account_id (FK), type, exhibition_id, invite_id?
  sent_at, opened_at?
```

- 채널: 카카오 알림톡 주 + 이메일 폴백. 알림톡은 `ACCOUNT.phone` 필요.
- 알림 유형: N1 팝업오픈(`ready`→`open_concurrent` 전이) / N2 종료임박(`open_solo` D-3, **미체크인자만**) / N3 초대장발급(선택) / N4 차기전시.
- 발송 규칙: 일 1건 상한(다중 초대장 시 우선순위 엔진 규칙 적용), 동일 유형 재발송 금지, 09:00~21:00.
- 이벤트: `notification.subscribed` / `sent` / `opened` / `unsubscribed`. **전부 퍼널 외.**

### 9-3. 매칭 피드백

```
MATCH_FEEDBACK
  feedback_id (PK), exhibition_id (FK), session_id (FK), invite_id (FK)?
  type: enum          invite_reaction | popup_rating | persona_accuracy
  value: string       F1: up|down / F2: 1~5 / F3: yes|unsure
  reason: enum?       F1 👎 사유 칩
  comment: string?
  created_at
```

- 수집 3지점: F1 초대장 반응(화면4, rank 1 카드) / F2 팝업 별점(화면6 미니리포트) / F3 페르소나 정확도(화면4).
- 용도: concept_type × axis 친화도 테이블·세그먼트 산출조건 튜닝(파일럿 종료 후).
- 이벤트: `feedback.invite_reaction` / `popup_rating` / `persona_accuracy`. **전부 퍼널 외.**

### 9-4. 스핀오프 체험 (체험 중심 전환)

```
SPINOFF_ZONE
  + experience_type: enum        free | paid
  + experience_price: int?       유료 체험 가격
  + duration_min: int?           예상 소요 시간
  + has_output: bool             결과물(굿즈화 가능) 존재 여부

ZONE_EXPERIENCE
  experience_id (PK), exhibition_id (FK, spinoff), session_id (FK), zone_id (FK)
  started_at, completed_at?, paid: bool, output_claimed: bool
```

- 수익 구조(MVP): 입장 무료 + **체험 유료**(주 수익원). 굿즈 제작·결제 연동은 Phase 2.
- 이벤트: `experience.started` / **`experience.completed`(퍼널 6단계)** / `experience.output_claimed`(참고 지표).
- `purchase.link_clicked`: 퍼널에서 강등 → 참고 지표(굿즈 관심도 프록시).

### 9-5. 통합 리포트

```
TASTE_PROFILE
  + journey_completed_at: datetime?   마지막 활동 시각 (타임라인 종료점)
  + spinoff_visited_count: int        방문 스핀오프 수 (카드 뱃지용)
```

- 신규 화면 아님 — 화면8 마이리포트 카드가 여정에 따라 성장. 타임라인은 조회 시 집계 쿼리로 조립(비정규화 저장 불필요).
- 이벤트: `report.journey_viewed` / `report.shared`.
- "소장품" 섹션 → **"내가 한 체험"**(ZONE_EXPERIENCE 기반)으로 변경 — 체험 중심 전환과 연동.

---

## 10. v1.3 후속 반영 대상

| 대상 | 수정 내용 | 상태 |
|---|---|---|
| 어드민 ConceptBot | `max_spinoff_recommendations` 설정 필드 / 존 산출물에 experience_* 필드 | ⬜ |
| 어드민 Report | 퍼널 6단계 `experience.completed`로 교체, `purchase.link_clicked` 참고 지표 이동, 회원 전환율 | ⬜ |
| 어드민 Monitor | 존별 체험 참여·완료율, 알림 성과 지표 | ⬜ |
| 유저뷰 화면4 | 초대장 복수 나열(rank), F1·F3 피드백, 계정 CTA | ⬜ |
| 유저뷰 화면5·6 (Sol) | 체험 중심 개정, 코치마크, 존 체험 플로우 | ⬜ |
| 유저뷰 화면7·8·10 | 알림 설정, 통합 리포트 카드, N4 딥링크 | ⬜ |
| 🔴 사업 문서 | v3.0 수익 시뮬레이션 재계산 (굿즈 → 체험료 중심) | ⬜ |

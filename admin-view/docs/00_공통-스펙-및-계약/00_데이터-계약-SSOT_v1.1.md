# AFTERGLOW 데이터 계약 (Data Contract / SSOT)

> 버전: v1.1 | 갱신일: 2026.07.02 | 상태: ✅ 확정
> v1.0 → v1.1 변경: **스핀오프 팝업을 "미니 전시"로 정식 편입** (🆕 표시). EXHIBITION.type 도입, SPINOFF_ZONE 신설, 팝업 내 세션·대화 규칙 추가.
> 적용 대상: **어드민 repo + 유저뷰 repo 공통 SSOT.**

---

## 0. 용어 통일

| 용어 | 동의어 | 정의 |
|---|---|---|
| **전시** | EXHIBITION = 프로젝트 | 관람 경험의 스코프 단위. 🆕 **본전시(main)와 스핀오프 팝업(spinoff) 모두 EXHIBITION** |
| **본전시** | main | 고객사의 원 전시 |
| **스핀오프 팝업** | spinoff | 전시 IP 기반 2차 체험 공간. 본전시의 자식 전시 (v3.0 §2: "굿즈 판매점"이 아니라 **체험 공간**) |
| **존(Zone)** 🆕 | SPINOFF_ZONE | 팝업 내 체험 단위. 본전시의 "작품"에 대응 |
| **고객사** | CLIENT | 전시 기획사 |
| **운영자** | OPERATOR | 고객사 소속 실무자 |

---

## 1. 계층 · 스코프 · 권한

```
CLIENT (1) ──< EXHIBITION (N) ──< SESSION (N) ──< 관람·대화·취향·브릿지 데이터
                  │ type: main | spinoff        🆕
                  └─ spinoff.parent_exhibition_id → main   🆕
```

- 🆕 **EXHIBITION.type**: `main` | `spinoff`. spinoff는 `parent_exhibition_id`로 본전시에 연결 (1 main : N spinoff 가능하나 MVP는 1:1).
- 🆕 스핀오프도 본전시와 **동일 엔티티 축**(SESSION·INTERACTION·CONVERSATION·PURCHASE)으로 데이터 축적 → Insight Reporter의 "팝업 성과 → 차기 전시" 선순환이 실데이터로 성립.
- 권한 2단 구조(권한=`client_id` / 조회=`exhibition_id`), Tier 1~3 스코프: v1.0과 동일. 스핀오프도 같은 `client_id` 하위이므로 운영자 스위처에 main·spinoff가 함께 노출 (표시상 부모 아래 들여쓰기 권장).

---

## 2. 감정 모델 (2단: 전역 축 + 전시별 leaf)

*(v1.0과 동일 — 8축 고정 + 전시별 leaf, AI 추출은 운영자 승인, `#`는 UI 전용)*

| axis_id | 한글 | | axis_id | 한글 |
|---|---|---|---|---|
| `serene` | 고요·평온 | | `awe` | 경외·압도 |
| `dreamy` | 몽환·신비 | | `thrill` | 강렬·고양 |
| `melancholy` | 우수·쓸쓸 | | `tension` | 긴장·불안 |
| `warm` | 따뜻·포근 | | `contemplative` | 사색·심오 |

- 🆕 **spinoff의 EMOTION_LEAF는 본전시 leaf를 상속**(복사)하고 팝업 고유 leaf 추가 가능. 축은 공통이므로 본전시↔팝업 감정 비교 집계 가능.

---

## 3. 전환 퍼널 이벤트

*(1~6단계 v1.0과 동일)* — `session.start` → `curator.chat_start` → `invite.issued` → `invite.landing_viewed` → `invite.redeemed`(셀프 체크인) → `purchase.link_clicked`

- 🆕 **퍼널 집계 규칙**: 1·2단계는 `type=main` 세션만 카운트. 스핀오프 내 세션·대화는 퍼널이 아니라 **팝업 체험 지표**(§3-1)로 분리 집계. (전환율 20% = 4단계/1단계, main 기준 — 오염 방지)

### 3-1. 🆕 스핀오프 체험 이벤트 (퍼널 외 지표)

| 이벤트 | 발화 시점 | 용도 |
|---|---|---|
| `spinoff.session_start` | 체크인 직후 팝업 큐레이터 진입 | 팝업 체류 시작 |
| `spinoff.zone_viewed` | 존 상세/해설 열람 | 존별 인기 지수 (Monitor) |
| `spinoff.curator_chat` | 팝업 큐레이터와 대화 | 데이터 연동 체험 측정 |
| `landing.organic_viewed` | 초대장 없는 일반 유입 랜딩 | 단독 운영 기간 신규 유입 |

---

## 4. 세그먼트 — *(v1.0과 동일: 전역 4종 id + 전시별 persona_copy)*

- 🆕 팝업 내 대화·반응은 **본전시에서 만든 TASTE_PROFILE을 갱신**(visitor 기준 이어받기)하며 별도 프로필을 만들지 않는다. → "본전시 취향 → 팝업 반응 → 차기 전시" 단일 서사 유지.

## 5. concept_type — *(v1.0과 동일: 6종 story/sensory/archive/community/role/time)*

- 🆕 concept_type은 spinoff EXHIBITION의 대표 속성이자 각 SPINOFF_ZONE의 속성. 존은 팝업 대표 유형과 다른 유형을 가질 수 있음 (예: sensory 팝업 안의 archive 존).

---

## 6. 엔티티 스키마 요약

| 엔티티 | 주요 필드 | 비고 |
|---|---|---|
| CLIENT | client_id, name, plan, rs_model | |
| EXHIBITION | exhibition_id, client_id(FK), title, period, status, 🆕 **type(main\|spinoff)**, 🆕 **parent_exhibition_id** | |
| 🆕 **SPINOFF_ZONE** | zone_id, exhibition_id(FK, type=spinoff), **concept_type**, title, experience_desc, docent_script, linked_md_ids[], qr_code | 팝업의 "작품". ConceptBot 공간 구성안이 여기로 구조화됨 |
| VISITOR | visitor_id, nickname, consent | 전역 — main↔spinoff를 잇는 키 |
| SESSION | session_id, exhibition_id(FK), visitor_id, start_at, end_at, entry_qr | main·spinoff 공용 |
| AI_KNOWLEDGE_BASE | kb_id, exhibition_id(FK), docent_script, emotion_leafs, artwork_metadata | 🆕 spinoff KB = 본전시 KB 상속 + 존 스크립트 |
| ARTWORK_INTERACTION | interaction_id, exhibition_id(FK), session_id, 🆕 **target_type(artwork\|zone)**, target_id, action_type, dwell_sec, photo_url, auto_tags | 작품·존 공용 |
| AI_CONVERSATION | conversation_id, exhibition_id(FK), session_id, messages, emotion_chips, depth_score | main·spinoff 공용 |
| TASTE_PROFILE | profile_id, exhibition_id(FK, main), session_id, top_keywords, axis_distribution, color_palette, segment_tag, persona_copy | 🆕 spinoff는 신규 생성 없이 main 프로필 갱신 |
| SPINOFF_INVITE | invite_id, exhibition_id(FK, main), 🆕 **spinoff_exhibition_id(FK)**, session_id, concept_type, personalized_copy, landing_url, funnel_events[] | |
| PURCHASE | purchase_id, exhibition_id(FK, spinoff), session_id, invite_id, item_id, amount, custom_option | 매출은 spinoff 소속 |

---

## 7. 후속 반영 대상 (v1.1 갱신)

| 대상 | 수정 내용 | 상태 |
|---|---|---|
| 어드민 ConceptBot | `tag`→`concept_type` enum + Bridge 카피 필드 + 🆕 공간 구성안을 SPINOFF_ZONE 구조로 산출 | ⬜ |
| 어드민 Monitor | 감정 leaf/axis 바인딩 + 🆕 spinoff 전환 시 존별 지표 뷰 | ⬜ |
| 어드민 Report | 퍼널 이벤트 바인딩, 세그먼트 4종 + 🆕 팝업 체험 지표(§3-1) 섹션 | ⬜ |
| 어드민 스위처 | 🆕 main 하위 spinoff 들여쓰기 표시 | ⬜ |
| API 명세 | 감정 포맷·퍼널 반영 + 🆕 spinoff 세션/존 이벤트 엔드포인트 | ⬜ |
| 유저뷰 | 화면 1·2 작성 잔여 + 🆕 화면 6(팝업 AI 큐레이터) 신설 | ⬜ |
| 운영자 Phase 2/4 | 감정 승인 큐 + 🆕 존 docent_script 세팅 항목 | ⬜ |

# 어드민 구조 의사결정 — 운영자 어드민 통합 vs 분리

> 운영자 어드민을 자사직원용/고객사용으로 **하나로 통합(권한 분리)** 할지, **별도로 분리**할지 결정이 필요합니다. 이 페이지는 그 판단을 위한 비교 분석입니다.

---

## 1. 현재까지 정의된 어드민 3종

| 어드민 | 사용자 | 핵심 역할 |
| --- | --- | --- |
| **고객사 관리 어드민** | AFTERGLOW 자사 직원 | 고객사 등록·계약·플랜·RS 정산 관리 |
| **운영자 어드민 (자사직원용)** | AFTERGLOW 운영팀 | 전체 고객사 전시 운영 총괄, 내부 기능 전체 접근 |
| **운영자 어드민 (고객사용)** | 기획사 현장 운영직원 | 자사 전시만 Phase 1~6 수행, 컨셉 카드 검토·승인 |

> 📌 **고객사 담당자(기획사 PM)** 는 기존 Tier 2 고객사 어드민이 담당. 여기서 논의하는 "고객사용 운영자"는 현장에서 실제 전시를 운영하는 실무자입니다.

---

## 2. 두 사용자의 실제 업무 차이

| Phase | AFTERGLOW 자사 운영직원 | 고객사 현장 운영직원 |
| --- | --- | --- |
| **Phase 1** 자산 등록 | ✅ 전체 접근 (여러 고객사 동시) | ✅ 자사 전시만 |
| **Phase 2** AI 학습 | ✅ 전체 접근 + 모델 설정 가능 | ⚠️ 스크립트 입력만 (모델 설정 불가) |
| **Phase 3** 데이터 분석 | ✅ 전체 고객사 비교 분석 가능 | ✅ 자사 전시만 열람 |
| **Phase 4** 스핀오프 기획 | ✅ 직접 생성 + 고객사 대리 생성 가능 | ✅ 검토·승인만 (AI 생성은 동일) |
| **Phase 5** 대시보드 | ✅ 전체 고객사 현황 + 내부 지표 | ✅ 자사 전시 성과만 |
| **Phase 6** 포스트 전시 | ✅ 리포트 생성 + 재계약 제안 발송 | ⚠️ 리포트 열람만 |
| **고객사 간 비교** | ✅ 가능 | ❌ 불가 |
| **시스템 설정** | ✅ 가능 | ❌ 불가 |

---

## 3. 통합 vs 분리 비교

### Option A — 하나의 어드민 + Role 분리 (권장 MVP)

| 항목 | 내용 |
| --- | --- |
| **구조** | 동일한 어드민 서비스, role에 따라 메뉴·기능 show/hide |
| **Role** | `afterglow_operator` (자사) / `client_operator` (고객사) |
| **장점** | 개발 리소스 절감 / 유지보수 단일화 / 빠른 MVP 출시 |
| **단점** | 고객사에 AFTERGLOW 내부 구조가 일부 노출될 수 있음 / UI가 복잡해질 수 있음 |
| **적합 시점** | MVP ~ v1.0 |

**Role별 접근 제어 예시:**

```javascript
afterGlow_operator
  ├── 전체 고객사 전시 목록 접근
  ├── 고객사 간 비교 분석
  ├── AI 모델 세부 설정
  ├── 재계약 제안서 발송
  └── 모든 Phase 전체 기능

client_operator
  ├── 자사 전시만 접근 (client_id 필터)
  ├── Phase 1~5 기본 기능
  ├── Phase 4 컨셉 카드 검토·승인 (생성은 AI)
  ├── Phase 5 자사 성과 열람
  └── Phase 6 리포트 열람만 (발송 불가)
```

---

### Option B — 별도 어드민 2개 분리

| 항목 | 내용 |
| --- | --- |
| **구조** | 자사용 어드민 / 고객사용 어드민(화이트라벨) 별도 개발 |
| **장점** | 각 사용자에 최적화된 UX / 보안 완전 분리 / 고객사에 전용 브랜드 경험 제공 |
| **단점** | 개발 비용 2배 / 유지보수 부담 / MVP 일정 지연 |
| **적합 시점** | v2.0 이후, 고객사 수 증가 후 |

---

## 4. 확정 방향 ✅

> **Option A 확정 — 하나의 어드민 + Role 분리**

> **단, 고객사 운영직원은 서브도메인으로 분리 접근**

| 어드민 | URL | 사용자 | 비고 |
| --- | --- | --- | --- |
| **고객사 관리 어드민** | [admin.afterglow.kr](http://admin.afterglow.kr/) | AFTERGLOW 자사 직원 | 고객사·계약·정산 전용 |
| **운영자 어드민 (자사직원용)** | [app.afterglow.kr](http://app.afterglow.kr/) | AFTERGLOW 운영팀 | 전체 접근, 내부 기능 포함 |
| **운영자 어드민 (고객사용)** | [partner.afterglow.kr](http://partner.afterglow.kr/) | 고객사 현장 운영직원 | 동일 시스템, 서브도메인 분리 + role 필터 |

**서브도메인 분리 이유:**

- 고객사 직원 입장에서 AFTERGLOW 내부 URL(app.*)이 아닌 파트너 전용 URL**을 받는 것이 심리적으로 독립적인 서비스처럼 느껴짐
- v2.0에서 화이트라벨([partner.피플리.kr](http://partner.xn--oy2bp41cde.kr/) 등)로 확장 시 서브도메인 구조가 그대로 활용 가능
- 자사 직원과 고객사 직원의 로그인 진입점이 달라 실수로 내부 기능에 접근하는 상황 방지
- 동일 코드베이스에서 서브도메인별 role 자동 할당 + UI 필터링으로 구현 가능
---

## 5. 업데이트 필요한 데이터 구조

`OPERATOR_ACCOUNT` 엔티티에 role 필드 확장이 필요합니다.

| 필드 | 기존 | 변경 후 |
| --- | --- | --- |
| **role** | `admin` / `viewer` | `afterglow_operator` / `client_operator` / `client_viewer` |
| **client_id** | FK (필수) | FK (nullable — 자사 직원은 null, 고객사 직원은 필수) |
| **access_scope** | 없음 | `all` / `client_only` (client_id 기준 자동 설정) |
| **entry_domain** | 없음 | `app` / `partner` (로그인 진입 도메인 기록, role 자동 할당 기준) |

**도메인별 자동 role 할당 로직:**

```javascript
partner.afterglow.kr 로그인
  → entry_domain = 'partner'
  → role 가 afterglow_operator이면 접근 거부 (실수 방지)
  → role 가 client_operator / client_viewer이면 정상 접근

app.afterglow.kr 로그인
  → entry_domain = 'app'
  → role 가 afterglow_operator이면 정상 접근
  → role 가 client_operator이면 접근 거부 (partner.* 사용 안내)
```

---

## 6. 기능별 노출 제어 (partner 도메인에서는 하이드)

| 기능 | [app.afterglow.kr](http://app.afterglow.kr/) | [partner.afterglow.kr](http://partner.afterglow.kr/) |
| --- | --- | --- |
| 여러 고객사 전시 동시 접근 | ✅ | ❌ |
| 고객사 간 비교 분석 | ✅ | ❌ |
| AI 모델 세부 설정 | ✅ | ❌ |
| 시스템 설정 | ✅ | ❌ |
| 재계약 제안서 발송 | ✅ | ❌ |
| Phase 1~5 기본 기능 | ✅ | ✅ |
| Phase 4 컨셉 카드 승인 | ✅ | ✅ |
| Phase 5 자사 성과 열람 | ✅ | ✅ |
| Phase 6 리포트 열람 | ✅ | ✅ (열람만) |

---

## 7. 향후 확장 경로 (v2.0 이후)

[partner.afterglow.kr](http://partner.afterglow.kr/)를 **화이트라벨 서브도메인**으로 확장 가능

```javascript
현재 (MVP~v1.0)
partner.afterglow.kr  ← 모든 고객사 공유

v2.0 이후 (화이트라벨)
partner.afterglow.kr  ← 일반 고객사
피플리.afterglow.kr  ← 피플리 전용 (본인들 브랜드로 느껴)
```


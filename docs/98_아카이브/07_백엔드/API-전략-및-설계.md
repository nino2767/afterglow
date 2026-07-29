# AFTERGLOW 백엔드 개발 아젠다 · API 전략

본 문서는 관람객(B2C) 여정 데이터 수집 및 팝업(B2B) 연계 시나리오를 온전히 서포트하기 위한 백엔드 시스템 설계안 및 연동 전략을 다룹니다.

---

## 1. AI RAG 아키텍처 결정 포인트

AI 큐레이터와 대화하며 감정을 분석하고, 팝업 공간을 추천하는 핵심 RAG(Retrieval-Augmented Generation) 엔진에 대해 Claude API 직호출과 자체 백엔드 중계 방식의 Trade-off를 분석합니다.

```
                  ┌──────────────────────┐
                  │  B2C Mobile WebApp   │
                  │     (React App)      │
                  └──────────┬───────────┘
                             │
                      1. Question (HTTP/WS)
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Backend Server    │
                  │   (Express/FastAPI)  │
                  └────┬────────────┬────┘
                       │            │
         2. Search Context    3. Get History
                       │            │
                       ▼            ▼
         ┌───────────────┐   ┌───────────────┐
         │   Vector DB   │   │  Session DB   │
         │   (Pgvector)  │   │ (PostgreSQL)  │
         └───────────────┘   └───────────────┘
                       │
             4. Prompt + Context
                       │
                       ▼
                  ┌──────────────────────┐
                  │     LLM Provider     │
                  │  (Claude 3.5 Sonnet) │
                  └──────────────────────┘
```

### Option A: 클라이언트 단에서 Claude API 직호출
* **장점**: 개발 속도가 매우 빠르고 백엔드 인프라 공수가 최소화됨.
* **단점**: API Key 노출에 따른 심각한 보안 리스크, 할루시네이션 방지를 위한 시스템 프롬프트(작가노트, RAG 소스) 노출, 유저당 세션 기록 관리 불가, 비용 폭증 우려.

### Option B: 자체 백엔드(Node.js/Python) + Vector DB 중계 (권장)
* **장점**: API Key가 내부 서버에만 보관되어 안전함. 사용자 질문 입력 시 전시 자산(docent_script)을 Vector DB(Pgvector, Pinecone 등)에서 자동 검색 및 바인딩해 주는 RAG 파이프라인 제어 가능. 답변 완료 시 감정 키워드와 `depth_score`를 백엔드 상에서 즉각 분석하여 세션 데이터베이스에 안전하게 기록.
* **결정**: **Option B**로 진행하며, 파일럿 개발 단계에서는 가벼운 Node.js Express 또는 Python FastAPI 기반의 백엔드 아키텍처를 수립합니다.

---

## 2. SSOT 기반 핵심 API 명세 (B2C-B2B 연동)

모든 API 페이로드와 데이터 모델은 `docs/00_데이터-계약-SSOT.md` 규격을 완전 준수합니다.

### 2-1. [POST] `/api/session/start` (온보딩 완료 및 세션 시작)
* **설명**: 관람객이 온보딩 스텝을 완료하고 동의 시 호출.
* **Request Payload**:
  ```json
  {
    "nickname": "고요한 윤슬",
    "initial_keywords": [
      { "emotion": "고요함", "axis": "serene" },
      { "emotion": "신비로움", "axis": "dreamy" }
    ],
    "exhibition_id": "pj_abyss",
    "consent_marketing": true
  }
  ```
* **Response Payload**:
  ```json
  {
    "status": "success",
    "session_id": "s_20260704_abc123",
    "visitor_id": "v_20260704_xyz789"
  }
  ```

### 2-2. [POST] `/api/curator/message` (AI 큐레이터 실시간 대화)
* **설명**: 사용자의 질문에 대한 RAG 응답 스트리밍 요청.
* **Request Payload**:
  ```json
  {
    "session_id": "s_20260704_abc123",
    "artwork_id": "art_001",
    "message": "이 작품은 어떤 기법으로 만들어진 건가요?"
  }
  ```
* **Response Payload (Server-Sent Events / WebSocket)**:
  * 실시간 답변 조각 전송 후 최종 응답 시 감정 키워드 전달:
  ```json
  {
    "event": "server_final",
    "text": "김하늘 작가는 수만 번의 빛의 반사 시뮬레이션을 통해...",
    "extracted_emotions": [
      { "emotion": "심오함", "axis": "contemplative" }
    ],
    "depth_score": 4
  }
  ```

### 2-3. [POST] `/api/session/complete` (관람 완료 및 리포트 확정)
* **설명**: 관람을 마치고 여운 리포트를 생성하며 팝업 스핀오프 초대장 발급.
* **Request Payload**:
  ```json
  {
    "session_id": "s_20260704_abc123"
  }
  ```
* **Response Payload**:
  ```json
  {
    "taste_profile": {
      "persona_title": "고요함을 머금은 감성 탐구자",
      "top_keywords": ["고요함", "몽환적인", "심오함"],
      "bg_gradient": "linear-gradient(135deg, #7B9EE8 0%, #C9A84C 100%)",
      "longest_artwork": { "title": "윤슬", "dwell_sec": 720 }
    },
    "spinoff_invite": {
      "invite_id": "INV-XYZ789",
      "concept_type": "C",
      "concept_name": "어비스 티 라운지",
      "personalized_copy": "'고요한 잔상'이라고 하셨죠. 당신을 위해 차분한 향의 찻잎을 블렌딩 바로 보내 두었습니다.",
      "landing_url": "/spinoff?invite_id=INV-XYZ789"
    }
  }
  ```

### 2-4. [POST] `/api/spinoff/checkin` (팝업 현장 셀프 체크인)
* **Request Payload**:
  ```json
  {
    "invite_id": "INV-XYZ789"
  }
  ```
* **Response Payload**:
  ```json
  {
    "status": "success",
    "redeemed_at": 1779912000,
    "coupon_barcode": "COUPON-WELCOME-5PCT"
  }
  ```

---

## 3. 실시간 취향 스코어링 & 매칭 알고리즘

관람객의 이탈을 막기 위해 서버는 관람 행동과 대화 내용에 가중치를 두어 감정 축을 실시간 집계합니다.

$$Score(Axis) = \sum (EmotionTag \times 1.5) + \sum (ArtworkDwell(Sec) \times ArtworkWeight)$$

1. **감정 태깅 가중치**: 사용자가 대화창에서 탭하거나 대화 내에서 AI가 자동 추출한 감정어(EmotionTag)는 즉시 특정 axis의 점수를 `1.5`점 상승시킵니다.
2. **머무름 시간(Dwell) 가중치**: 각 작품에 설정된 `dwell_weight`에 머무른 초 단위를 곱하여 해당 작품의 default_emotion_chips가 지닌 감정 축 점수에 합산합니다.
3. **매칭 테이블 적용**: 최종 점수가 가장 높은 1~2순위 감정 축의 조합을 바탕으로 팝업 스핀오프 컨셉(A~F)을 자동 확정합니다.

---

## 4. 백엔드 개발 로드맵

1. **Phase 1: API 스켈레톤 구축 (1주차)**
   - Node.js Express / Python FastAPI 세팅 및 DB Schema 설계 (PostgreSQL + Pgvector)
2. **Phase 2: RAG 파이프라인 연동 (2주차)**
   - Claude API SDK 연동 및 프롬프트 인젝션 방어 장치 탑재
   - 작가 노트 및 도슨트 가이드 기반 벡터 검색 구현
3. **Phase 3: 어드민 실시간 감정 모니터링 연계 (3주차)**
   - SSE(Server-Sent Events) 또는 Socket.io를 활용하여 관람객의 실시간 감정 칩 반응 및 질문 데이터를 어드민 Monitor/Report 대시보드로 실시간 푸시.

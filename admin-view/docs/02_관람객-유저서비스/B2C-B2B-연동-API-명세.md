# B2C ↔ B2B 연동 API 및 데이터 파이프라인 명세 (API Contract)

> 버전: v1.0 | 작성일: 2026.06.16 | 상태: 📋 초안 (Zero-Draft)  
> 연관 기획: [정산 관리 및 RS 모델 고도화](../03_운영자-어드민/상세기획%20-%20정산%20관리%20및%20RS%20모델%20고도화.md), [상세기획 - 운영자 어드민](../03_운영자-어드민/상세기획%20-%20운영자%20어드민.md)

---

## 1. 개요 및 통신 아키텍처

본 명세서는 외부 레포지토리에서 별도로 개발되는 **관람객(B2C) 모바일 웹앱**과 **AFTERGLOW 어드민(B2B) 백엔드** 간의 데이터 연동 규격을 정의합니다. B2C 서비스는 본 명세에 정의된 REST API 및 WebSocket 엔드포인트를 타격하여 데이터를 적재하고 AI 도슨트 가이드를 호출합니다.

```
┌─────────────────────────┐               ┌─────────────────────────┐
│     관람객 모바일 웹앱    │  ◀──(REST)──▶  │   AFTERGLOW 어드민      │
│  (B2C User Service Repo)│  ◀──(WS/WSS)──▶ │    (B2B Core Backend)   │
└─────────────────────────┘               └─────────────────────────┘
```

---

## 2. 핵심 API 엔드포인트 명세

모든 API 요청은 JSON 포맷을 사용하며, 공통 헤더에 `Authorization: Bearer [Session_Token]`을 탑재해야 합니다.

> 🔐 **멀티테넌트 스코프 (B2B/운영자 API):** 운영자 토큰은 소속 고객사 `client_id`를 담습니다. 데이터 조회는 요청의 `exhibition_id`로 필터하되, 서버는 해당 `exhibition_id`가 토큰의 `client_id` 하위에 속하는지 **권한 검증** 후 응답합니다(타 고객사 전시 접근 차단). 즉 *권한 = `client_id`, 조회 = `exhibition_id`* 의 2단 구조입니다. B2C 세션 토큰은 `exhibition_id` + `session_id` 스코프로 한정됩니다.

### 2-1. [온보딩] 관람 세션 시작 (Session Start)
관람객이 현장 입장 QR 코드를 스캔하고 닉네임과 초기 취향 키워드를 입력할 때 호출됩니다.

* **HTTP Method:** `POST`
* **Path:** `/api/v1/b2c/session/start`
* **Request Body:**
  ```json
  {
    "exhibition_id": "exh-1029-depth-of-light",
    "nickname": "김민수",
    "initial_keywords": ["고요한", "몽환적인", "슬픔"],
    "marketing_consent": true
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "status": "success",
    "session_id": "sess-2026-0616-0001",
    "visitor_id": "vis-9481-befe-a8f8",
    "created_at": "2026-06-16T00:10:00Z"
  }
  ```

---

### 2-2. [작품 조회] 개별 작품 가이드 및 기본 자산 조회
관람객이 개별 작품 옆에 배치된 QR 코드를 스캔하여 작품 정보 및 오디오 도슨트를 로드할 때 호출됩니다.

* **HTTP Method:** `GET`
* **Path:** `/api/v1/b2c/artworks/{artwork_id}`
* **Response (200 OK):**
  ```json
  {
    "artwork_id": "art-01-abyss-blue",
    "title": "빛의 심연 (Blue Abyss)",
    "artist_name": "피플리",
    "image_url": "https://cdn.afterglow.app/assets/art-01.jpg",
    "docent_script": "이 작품은 깊은 바다 속 침묵을 형상화한 작품으로...",
    "audio_guide_url": "https://cdn.afterglow.app/audio/art-01-guide.mp3",
    "default_emotion_chips": ["고요함", "평온함", "외로움"],
    "sections": {
      "section_id": "sec-01-entrance",
      "section_name": "심해의 도입부"
    }
  }
  ```

---

### 2-3. [AI 대화] AI 큐레이터 대화형 질의응답 (WebSocket / SSE)
관람객이 Level 2 AI 큐레이터와 대화할 때 실시간 RAG 스트리밍을 구현하기 위한 통신입니다.

* **Protocol:** `WSS` (WebSocket Secure)
* **WebSocket Path:** `/ws/v1/b2c/curator/chat`
* **Client Send Message (질문 전송):**
  ```json
  {
    "event": "client_message",
    "session_id": "sess-2026-0616-0001",
    "artwork_id": "art-01-abyss-blue",
    "text": "작가는 왜 파란색 계열만 사용해서 심연을 표현했나요?"
  }
  ```
* **Server Stream Response (AI 답변 실시간 출력):**
  ```json
  {
    "event": "server_chunk",
    "text_chunk": "작가가 느꼈던 깊은 우울과 고요함을 시각적으로...",
    "is_final": false
  }
  ```
* **Server Final Response (AI 최종 분석 및 감정 추출 결과):**
  ```json
  {
    "event": "server_final",
    "full_response": "작가가 느꼈던 깊은 우울과 고요함을 시각적으로 단일화된 파란색 톤으로 압축해 전달한 것입니다. 마음속 깊은 침묵을 공유하고자 하는 의도가 담겨 있습니다.",
    "extracted_emotions": ["#고요함", "#우울함", "#평온함"],
    "depth_score": 3.5
  }
  ```

---

### 2-4. [감상 완료] 최종 취향 아카이브 및 스핀오프 초대장 발급
관람객이 모든 관람을 마치고 '감상 완료' 버튼을 누를 때 데이터 분석을 트리거하고 초대장을 발급합니다.

* **HTTP Method:** `POST`
* **Path:** `/api/v1/b2c/session/complete`
* **Request Body:**
  ```json
  {
    "session_id": "sess-2026-0616-0001"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "completed",
    "taste_profile": {
      "top_keywords": ["고요함", "몽환적인", "파란빛"],
      "color_palette": ["#0000FF", "#4A6E8B", "#F7F5F0"],
      "segment_tag": "Deep Ocean Dreamer"
    },
    "spinoff_invite": {
      "invite_id": "inv-2026-9902-8321",
      "concept_type": "sensory",
      "personalized_copy": "S님이 대화 중 가장 많이 언급하신 '고요함'의 가치를 한 병의 커스텀 향수 '고요한 블루'로 팝업스토어에서 조향해 드릴게요.",
      "barcode_url": "https://cdn.afterglow.app/barcodes/inv-2026.png",
      "landing_url": "https://afterglow-super.vercel.app/invite/inv-2026"
    }
  }
  ```

---

---

## 2-5. [경험 모듈] 10대 관람객 경험 모듈별 연동 API

각 경험 모듈의 데이터 적재 및 조회를 위한 세부 엔드포인트 명세입니다.

### ① 감정 담벼락 모듈 (`emotion-wall`) - 한줄 감상 및 감정 태그 제출
* **HTTP Method:** `POST`
* **Path:** `/api/v1/b2c/modules/emotion-wall`
* **Request Body:**
  ```json
  {
    "session_id": "sess-2026-0616-0001",
    "artwork_id": "art-01-abyss-blue",
    "comment": "마음 깊이 파란 파도가 밀려오는 느낌이었습니다.",
    "selected_emotions": ["고요함", "평온함"]
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "wall_id": "wall-8291-ccae"
  }
  ```

### ② 전시 포스터/카드 모듈 (`poster-card`) - 개인화 이미지 저장 및 조회
* **HTTP Method:** `POST`
* **Path:** `/api/v1/b2c/modules/poster-card`
* **Request Body:**
  ```json
  {
    "session_id": "sess-2026-0616-0001",
    "poster_title": "김민수의 심해 속으로",
    "selected_artworks": ["art-01-abyss-blue", "art-03-coral-red"],
    "bg_color": "#0000FF",
    "generated_image_url": "https://cdn.afterglow.app/user-posters/vis-9481.png"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "status": "success",
    "poster_id": "post-1092-2938",
    "share_url": "https://afterglow-super.vercel.app/share/post-1092-2938"
  }
  ```

### ③ 나만의 큐레이션 모듈 (`my-curation`) - 소장 컬렉션 저장
* **HTTP Method:** `POST`
* **Path:** `/api/v1/b2c/modules/my-curation`
* **Request Body:**
  ```json
  {
    "session_id": "sess-2026-0616-0001",
    "collection_name": "나의 파란 조각들",
    "artwork_ids": ["art-01-abyss-blue", "art-02-sea-shadow"],
    "curator_note": "외로운 마음을 채워주는 파란색의 연대기"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "curation_id": "cur-3829-fdf2"
  }
  ```

### ④ 디지털 굿즈 모듈 (`digital-goods`) - 획득 이력 및 배지 발급
* **HTTP Method:** `POST`
* **Path:** `/api/v1/b2c/modules/digital-goods`
* **Request Body:**
  ```json
  {
    "session_id": "sess-2026-0616-0001",
    "mission_key": "stamp-all-clear", // 예: 스탬프북 완료, 특정 퀴즈 통과 등
    "goods_type": "badge" // badge, sticker, ticket
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "badge_id": "bdg-7712-ff9a",
    "badge_name": "심해 정복자",
    "issued_at": "2026-06-16T00:15:30Z"
  }
  ```

### ⑤ 관람 노트/퀴즈 모듈 (`note-quiz`) - 퀴즈 응답 제출
* **HTTP Method:** `POST`
* **Path:** `/api/v1/b2c/modules/note-quiz`
* **Request Body:**
  ```json
  {
    "session_id": "sess-2026-0616-0001",
    "quiz_id": "quiz-exh-1029-01",
    "answers": [
      { "question_no": 1, "selected_option": 3 },
      { "question_no": 2, "selected_option": 1 }
    ]
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "score": 100,
    "is_passed": true,
    "correct_answers_count": 2,
    "reward_eligible": true
  }
  ```

### ⑥ 투표/질문 모듈 (`vote`) - 의견 수집 및 결과 반환
* **HTTP Method:** `POST`
* **Path:** `/api/v1/b2c/modules/vote`
* **Request Body:**
  ```json
  {
    "session_id": "sess-2026-0616-0001",
    "question_id": "q-102-opinion",
    "selected_choice": "choice-2" // 예: 파란색 vs 붉은색
  }
  ```
* **Response (200 OK - 실시간 집계 현황 반환):**
  ```json
  {
    "status": "success",
    "total_votes": 1284,
    "statistics": {
      "choice-1": 45.2,
      "choice-2": 54.8
    }
  }
  ```

---

## 3. 데이터 파이프라인 및 집계 로직 (B2B 연동용)

B2C에서 발생한 위의 API 호출 내역은 B2B 어드민 대시보드에 실시간/비동기식으로 적재됩니다.

```
[B2C Client Interaction]
       ↓ (API POST/GET)
[AFTERGLOW Core API Server]
       ↓ (Kafka / Event Queue)
[B2B Dashboard Aggregator] ➔ Real-time update on Monitor.jsx & Report.jsx
```

### 3-1. 실시간 모니터링 집계 (`Monitor.jsx` 연동)
* B2C 앱에서 `/api/v1/b2c/artworks/{id}` 진입 및 이탈 타임스탬프를 집계하여 `Monitor.jsx`의 **실시간 전시장 체류 히트맵** 데이터 소스로 활용합니다.
* AI 큐레이터 대화 API 호출 수량을 카운팅하여 대시보드의 **실시간 관람객 몰입도 수치**로 동기화합니다.

### 3-2. 성과 분석 집계 (`Report.jsx` 연동)
* 세션 완료 시 리턴된 `taste_profile.segment_tag`를 바탕으로 **취향 클러스터 비율 차트**를 업데이트합니다.
* 발급된 `spinoff_invite`의 바코드가 실제 팝업 스토어 PG 단말기에서 결제(구매)될 때 `PURCHASE` 엔티티가 생성되며, 이는 `Report.jsx`의 **초대장 대비 팝업 스토어 구매 전환율(Conversion Funnel)** 그래프로 표출됩니다.
* 각 경험 모듈(`emotion-wall`, `poster-card`, `vote` 등)을 통해 수집된 데이터는 `Report.jsx` 내 **경험 모듈 참여 성과 및 피드백 지표**로 집계되어 기획사에 시각화 보고서로 제공됩니다.

# AFTERGLOW 프로젝트 세션 로드맵 (Roadmap)

주제별 세션 진행 현황 및 To-Do 관리 카드입니다.

---

## 📅 세션 진행 로드맵

### [x] Session 01: 상위 기획 및 방향성
* **목표:** 스핀오프 전시 및 AI 해설사 연동 상위 기획 수립
* **진행 현황:**
  - [x] 스핀오프 전시 팝업 방향성 문서 작성 완료
  - [x] 스핀오프 전시 상위기획 (서비스 관점) 수립 완료
  - [x] AI 공연/전시 해설사 Notion 기획 통합 완료

### [x] Session 02: 어드민 기능 고도화 (B2B Admin Core Optimization)
* **목표:** 운영자/슈퍼 어드민 핵심 기능 설계 구체화 및 외부 B2C 연동 데이터 파이프라인 정의
* **진행 현황:**
  - [x] Concept Bot 전시 유형별 추천 및 경험 모듈 커스터마이징 화면 기획 및 디자인 명세 수립
  - [x] 3대 RS 정산 모델 비즈니스 로직 및 정산 화면 기획 수립
  - [x] 외부 B2C 서비스 연동을 위한 데이터 엔티티 및 API 파이프라인 설계 완료
  - [x] 어드민 고도화 기획/디자인에 대한 사용자 피드백 반영 및 최종 보완 (Session 06 연계 완료)

### [x] Session 03: 운영자 어드민 개발
* **목표:** 운영자용 어드민 6개 화면 설계 및 URL 격리 배포
* **진행 현황:**
  - [x] 상세 기획서 작성 및 의사결정 완료
  - [x] Vite 어드민 앱 내 Vercel 연동 배포 분리 설정 완료 (`afterglow-admin.vercel.app`)
  - [x] 모바일 뷰 닫기/오버레이 ReferenceError 및 bottom-tab 버그 수정 완료
  - [x] Concept Bot 모드 세부 사양 작성 완료

### [x] Session 04: 슈퍼(고객사) 어드민 개발
* **목표:** 고객사 관리 어드민 1개 화면 개발 및 Vercel 개별 URL 배포
* **진행 현황:**
  - [x] 상세 기획서 작성 완료
  - [x] Vercel `afterglow-super` 프로젝트 신규 연동 완료 (`afterglow-super.vercel.app`)
  - [x] `VITE_ADMIN_MODE=super` 환경 변수 설정 및 UI 헤더 패딩 청소 완료

### [x] Session 07: 에이전트 토큰 최적화 및 스킬셋 배포
* **목표:** 양대 레포지토리의 에이전트 룰과 스킬 최적화를 통한 토큰 비용 감소
* **진행 현황:**
  - [x] 어드민 및 유저뷰 레포지토리에 git diff, 타겟 린트, CLI 출력 제한 규칙 반영 완료
  - [x] 에이전트별 Skills 명세(check_modified_diff, run_targeted_lint, search_docs_keyword) 추가 완료


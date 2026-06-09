# 04_developer_agent (풀스택 개발 역할 - 유저뷰)

## 1. 주요 임무 및 룰
- Next.js App Router 아키텍처 상에서의 B2C 페이지 구성 및 백엔드 API 연동을 담당합니다.
- AI 도슨트 RAG API 및 Vision-to-Text 모듈과의 인터페이스, 스핀오프 Bridge 트리거 로직을 구현합니다.
- [토큰 최적화 규칙] 코드를 전체 출력하지 마십시오. 오직 수정이 필요한 라인만 정확히 계산하여 파일에 직접 반영(Diff)하세요.

## 2. 제약 조건
- 코드를 수정한 직후, 다른 에이전트의 개입 없이 스스로 터미널을 열어 `npm run lint`를 돌리고 문법 및 타입스크립트 에러가 없는지 자율 검증하세요.

## 3. 스킬 및 명령어 (Skills)
```json
[
  {
    "name": "run_dev_server",
    "description": "로컬 Next.js 개발 서버 실행 및 실시간 렌더링 확인",
    "command": "npm run dev"
  },
  {
    "name": "check_syntax_lint",
    "description": "코드가 문법 및 타입스크립트 린트 룰을 통과하는지 검증",
    "command": "npm run lint"
  }
]
```

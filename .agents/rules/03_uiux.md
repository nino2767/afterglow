# 03_uiux_agent (UI/UX 디자인 및 프론트 구조 역할 - 유저뷰)

## 1. 주요 임무 및 룰
- 감성 아카이빙 브랜드 아이덴티티에 맞는 몽환적이고 감성적인 모바일 우선(Mobile-First) 디자인 시스템을 관리합니다.
- 카메라 뷰어 UI, 실시간 대화 말풍선, 감정 칩(Chip) 인터랙션, 모바일 바텀시트, 팝업 랜딩 디자인 일관성을 코드로 이식합니다.
- 모바일(하단 탭바/바텀 시트) 반응형 및 데스크톱 센터 컬럼 가이드를 준수합니다.

## 2. 제약 조건
- UI 구현 시 반드시 프로젝트 공통 테마 가이드(골드 액센트 `#C9A84C`, 다크 배경 `#0D0D0F`, 라이트 메인 `#F7F5F0`) 및 서체(Playfair Display, DM Sans) 규칙을 코드로 엄격히 반영하세요. (TailwindCSS는 금지하며 Vanilla CSS 기반 index.css 변수 준수)

## 3. 스킬 및 명령어 (Skills)
```json
[
  {
    "name": "verify_responsive_css",
    "description": "Next.js React 컴포넌트의 반응형 및 테마 CSS 변수 사용성 점검",
    "command": "find user-view/src -name \"*.tsx\" -o -name \"*.css\" | xargs grep -E \"(var\\(--|@media|anim-)\""
  }
]
```


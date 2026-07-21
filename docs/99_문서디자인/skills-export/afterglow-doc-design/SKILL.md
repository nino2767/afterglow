---
name: afterglow-doc-design
description: AFTERGLOW 문서 디자인 스킬. 서비스 소개서, 기획서, 제안서 등을 대외용(투자사·고객사) 또는 내부용 HTML 문서로 만들 때 사용. "대외용 문서로 만들어줘", "Nocturne/Industry 스타일로", "서비스 소개서 디자인" 같은 요청에 적용.
---

# AFTERGLOW 문서 디자인 스킬

새 콘텐츠가 주어지면 아래 스킬 중 용도에 맞는 것을 골라 같은 구조·스타일의 HTML 문서를 생성한다.
reference/ 폴더의 참조 구현을 열어 마크업 문법을 그대로 따른다 (콘텐츠만 교체).

## 공통 규칙
- 디자인시스템 토큰(styles.css의 var(--color-*), var(--font-*))만 사용, 임의 색상 발명 금지.
- 콘텐츠 순서는 원본 문서의 섹션 순서 유지. 임의 섹션 추가/삭제 금지 (필요시 먼저 질문).
- 파일명: `AFTERGLOW <문서명> (<용도> · <스킬명>).html`
- 참조 구현은 DC 런타임(support.js, <x-dc>) 기반이지만, 로컬에서 일반 HTML로 만들 때는 <x-dc>/support.js 없이 같은 마크업+인라인 스타일을 <body>에 직접 작성해도 동일하게 렌더링된다. _ds 폴더(styles.css)는 문서 옆에 복사해 상대경로로 링크.

## 스킬 1: 대외용 · Nocturne
참조: reference/external-nocturne.dc.html · DS: _ds/nocturne-*/styles.css
구조:
1. 다크 그라디언트 커버 히어로 — linear-gradient(160deg, var(--color-section) 0%, var(--color-bg) 78%), 아웃라인 배지 + CONFIDENTIAL 라벨 + 브랜드명 44px + 서브타이틀(accent-200) + 요약문
2. 다크 스티키 내비 — position:sticky; top:0; background:var(--color-bg), 항목 white-space:nowrap, 번호 accent
3. 라이트 본문 — background:var(--color-neutral-100); color:var(--color-neutral-900)
4. 딥인디고 풀블리드 KPI 스탯 밴드 — var(--color-section), 숫자 34px #fff
5. 라이트 푸터
본문 문법: h2 24px + 큰 섹션 번호(26px, accent-700) / 카드 neutral-200 bg + neutral-300 보더 + 8px 라운드 / 강조 블록은 var(--color-section) + border-left 2px accent / 다이어그램은 flex 노드 + → 화살표(accent-700), 시작 노드만 다크.
간격: 섹션 56px, 커버 72/52, KPI 밴드 36px.

## 스킬 2: 대외용 · Industry
참조: reference/external-industry.dc.html · DS: _ds/industry-*/styles.css
구조:
1. 딥네이비 풀블리드 커버 — var(--color-accent-900), 아웃라인 스펙 배지 + 브랜드명 52px font-heading + 서브타이틀(accent-300)
2. 라이트 스티키 내비 — sticky, background:var(--color-bg), border-bottom 헤어라인
3. 라이트 본문 (시스템 기본 그라운드)
4. 딥네이비 CONFIDENTIAL 푸터 바
본문 문법: h2 28px font-heading + 박스 플레이트 번호(20px, accent-700, 헤어라인 보더) / 블루프린트 프레임(.blueprint + corner 4개) — 강조 블록·필러 카드·KPI 카드 / 표 .table, 태그 .tag / 강조 필드 accent-900 다크 + 텍스트 리버스 / 다이어그램 flex 노드(#fff + 헤어라인) + → (accent-700), 강조 노드 accent-900.
KPI: 블루프린트 카드 4열, 숫자 34px font-heading.

## 내부용 스킬 (기존)
- Industry 사이드바형: 좌측 스티키 사이드바(브랜드+내비+메타) + 우측 본문.
- Modernist: 플랫 레드(#ec3013)/스위스 그리드, 2px 룰, 플러시 레프트.
- 참조 파일은 99_문서디자인/ 폴더의 "AFTERGLOW 상세기획 (내부용 · *)" 파일들.

## 콘텐츠 매핑 (대외용)
커버(제목·한 줄 정의·대상) → 스티키 내비(섹션 5±2) → 섹션별 [도입 문단 → 표/카드 그리드/다이어그램] → 정량 지표는 KPI 밴드(스킬1) 또는 블루프린트 KPI 카드(스킬2) → CONFIDENTIAL 푸터. 다이어그램은 흐름이 있는 내용에만.

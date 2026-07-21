# AFTERGLOW 문서 디자인 스킬

이 프로젝트에는 재사용 가능한 문서 템플릿(스킬)이 정의되어 있다. 사용자가 "OO 내용으로 대외용 문서 만들어줘" 같은 요청을 하면 아래 스킬을 적용해 새 콘텐츠로 같은 구조·스타일의 문서를 생성한다.

## 공통 규칙
- 모든 문서는 DC(.dc.html)로 작성, 해당 디자인시스템 번들을 `<helmet>`에 로드.
- 콘텐츠 순서는 원본 문서의 섹션 순서를 유지. 임의로 섹션 추가/삭제하지 않고, 필요하면 먼저 물어본다.
- 파일명: `AFTERGLOW <문서명> (<용도> · <스킬명>).dc.html`
- 새 문서 생성 시 기존 파일을 복사하지 말고 해당 스킬 레시피대로 새로 작성 (콘텐츠 구조가 다르므로).

## 스킬 1: 대외용 · Nocturne ("afterglow-external-nocturne")
참조 구현: `AFTERGLOW 서비스소개 (대외용 1안 · Nocturne).dc.html`
- DS: `_ds/nocturne-3d5c38a7-ae76-4e18-bea6-1a78e9f5b265/` (styles.css + _ds_bundle.js)
- 구조: ① 다크 그라디언트 커버 히어로 `linear-gradient(160deg, var(--color-section) 0%, var(--color-bg) 78%)` — 배지(아웃라인 태그) + CONFIDENTIAL 라벨 + 브랜드명(44px) + 서브타이틀(accent-200) + 요약문 ② 다크 스티키 내비(`position:sticky; top:0; background:var(--color-bg)`, 항목 `white-space:nowrap`, 번호는 accent) ③ **라이트 본문** (`background:var(--color-neutral-100); color:var(--color-neutral-900)`) ④ 딥인디고 풀블리드 KPI 스탯 밴드(`var(--color-section)`, 숫자 34px #fff) ⑤ 라이트 푸터.
- 본문 문법: 섹션 제목 `h2` 24px + 큰 섹션 번호(26px, accent-700) / 소제목 h3 15px neutral-800 / 카드 `background:var(--color-neutral-200); border:1px solid var(--color-neutral-300); border-radius:var(--radius-md,8px)` / 표는 인라인 스타일(라이트: 헤더 neutral-600 소문자캡, 행 구분 neutral-300) / 강조 블록(핵심 가치 등)은 딥인디고 `var(--color-section)` + `border-left:2px solid var(--color-accent)`.
- 다이어그램: flex 노드 + `→`(accent-700) 화살표. 시작/강조 노드는 `var(--color-section)` 다크, 나머지는 라이트 카드.
- 섹션 간격 56px, 커버 padding 72/52, KPI 밴드 36px.

## 스킬 2: 대외용 · Industry ("afterglow-external-industry")
참조 구현: `AFTERGLOW 서비스소개 (대외용 2안 · Industry).dc.html`
- DS: `_ds/industry-9f8a6fd4-f6f5-45ad-b89e-1b2b8c1bed31/` (styles.css + _ds_bundle.js)
- 구조: ① 딥네이비 풀블리드 커버 `var(--color-accent-900)` — 아웃라인 스펙 배지 + 브랜드명(52px, font-heading) + 서브타이틀(accent-300) + 요약문 ② 라이트 스티키 내비(`position:sticky; top:0; background:var(--color-bg); border-bottom:1px solid var(--color-neutral-300)`) ③ 라이트 본문(시스템 기본 그라운드) ④ 마지막 섹션 끝에 딥네이비 CONFIDENTIAL 푸터 바.
- 본문 문법: 섹션 제목 h2 28px font-heading + 박스 플레이트 번호(20px, accent-700, 헤어라인 보더) / 블루프린트 프레임 `.blueprint` + 4개 `<i class="corner tl/tr/bl/br">` — 핵심 가치 블록, 필러 카드, KPI 카드에 사용 / 표는 DS `.table` 클래스 / 태그는 DS `.tag` / 강조 필드는 `var(--color-accent-900)`에 텍스트 리버스.
- 다이어그램: flex 노드 + `→`(accent-700). 노드는 `#fff` + 헤어라인 보더, 강조 노드는 accent-900 다크.
- KPI는 블루프린트 카드 4열, 숫자 34px font-heading.

## 내부용 스킬 (기존)
- `AFTERGLOW 상세기획 (내부용 · Industry).dc.html` — 좌측 스티키 사이드바 + 우측 본문 스크롤형.
- `AFTERGLOW 상세기획 (내부용 · Modernist).dc.html` — 플랫 레드/스위스 그리드, 2px 룰, 플러시 레프트.
- 내부용 신규 문서 요청 시 이 두 파일의 구조를 따른다. Modernist DS: `_ds/modernist-79dc44ed-2947-4867-b91b-730822dbbbad/`.

## 콘텐츠 매핑 가이드 (대외용)
새 콘텐츠가 주어지면: 커버(제목·한 줄 정의·대상) → 스티키 내비(섹션 5±2개) → 섹션별로 [도입 문단 → 표/카드 그리드/다이어그램 중 콘텐츠에 맞는 형식] → 정량 지표가 있으면 KPI 밴드(1안) 또는 블루프린트 KPI 카드(2안) → CONFIDENTIAL 푸터. 다이어그램은 흐름(플로우)이 있는 내용에만 넣는다.

---
name: "doc-style-modernist"
description: "마크다운 기획 문서나 스펙 문서를 AFTERGLOW Modernist(모더니스트 테마) 스타일의 HTML 문서로 변환하고 생성하는 기술"
---

# AFTERGLOW Modernist Document Styling Skill

이 스킬은 일반 텍스트나 마크다운 문서를 AFTERGLOW **Modernist(모더니스트 테마)** 디자인 규격의 HTML 문서로 변환 또는 생성할 때 사용합니다.

## 1. 디자인 시스템 핵심 규격 (CSS 토큰)
* **배경색 (Background)**: `#f3f2f2`
* **주요 글자색 (Text)**: `#201e1d`
* **포인트/강조 컬러 (Accent Red)**: `#ec3013` (강렬한 레드 컬러로 번호 및 강조블록 적용)
* **구분선/테두리 (Lines)**: `2px solid #201e1d` (굵고 명확한 블랙 계열 라인)
* **폰트 체계 (Typography)**: `Arial`, `Helvetica`, `sans-serif` (모던하고 클래식한 고딕체 구성)

---

## 2. 레이아웃 및 주요 HTML 구조
이 테마는 좌우 대칭이 맞는 중앙 정렬 카드형 레이아웃(`max-width: 940px`)을 가지며, 목차(nav)가 상단에 수평으로 배열되는 깔끔하고 묵직한 구조를 띱니다.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>body{margin:0}</style>
</helmet>
<div style="background:#f3f2f2; color:#201e1d; font-family:Arial, Helvetica, sans-serif; font-size:15.5px; line-height:1.6; min-height:100vh;">
    <div style="max-width:940px; margin:0 auto;">
      <!-- 상단 헤더 및 가로 네비게이션 -->
      <header style="padding:64px 24px 0;">
        <div style="font-family:Arial, sans-serif; font-weight:800; font-size:37px; letter-spacing:-.01em;">AFTERGLOW</div>
        <div style="font-size:14.5px; margin-top:10px; max-width:540px;">[문서 부제목]</div>
        <div style="font-size:11px; opacity:.6; margin-top:16px; text-transform:uppercase; letter-spacing:.05em;">[날짜 및 메타데이터 정보]</div>
        <nav style="display:flex; flex-wrap:wrap; margin-top:26px; border-top:2px solid #201e1d; padding-top:4px;">
          <a href="#m-s1" style="color:#201e1d; text-decoration:none; font-size:12.5px; padding:10px 18px 10px 0; margin-right:16px; display:flex; gap:6px; font-family:Arial, Helvetica, sans-serif;"><span style="color:#ec3013; font-weight:700;">01</span>재정의된 본질</a>
        </nav>
      </header>
      
      <!-- 메인 영역 -->
      <main style="padding:0 24px 140px;">
        <section id="m-s1" style="padding-top:40px;">
          <h2 style="font-size:30px; display:flex; align-items:baseline; gap:14px; font-family:Arial, sans-serif; font-weight:800; margin:0 0 20px; color:#201e1d;">
            <span style="font-size:16px; color:#ec3013; font-weight:700;">01</span>재정의된 본질 (상위기획 결과)
          </h2>
          <!-- 본문 내용 작성 -->
        </section>
      </main>
    </div>
</div>
</x-dc>
</body>
</html>
```

---

## 3. 세부 컴포넌트 스타일링 가이드

### 3.1. 강렬한 레드 하이라이트 블록 (Accent Red Block)
주요 핵심 기획 가치나 정의는 고대비의 강렬한 레드 박스로 강조합니다.
```html
<div style="background:#ec3013; color:#fff; padding:36px 32px;">
  <div style="font-size:12px; text-transform:uppercase; letter-spacing:.06em; opacity:.85;">[분류명]</div>
  <blockquote style="font-family:Arial, sans-serif; font-weight:800; font-size:26px; line-height:1.35; margin:14px 0 0;">강조할 큰 타이틀 문구</blockquote>
</div>
```

### 3.2. 테이블 (Table)
상단 보더는 없으며, 헤더 하단에 블랙의 굵은 실선(`2px solid #201e1d`)이 들어가는 스위스/모던 타이포그래피 스타일 표입니다.
```html
<table style="width:100%; border-collapse:collapse; font-size:14px;">
  <thead>
    <tr>
      <th style="width:25%; text-align:left; font-size:11px; text-transform:uppercase; padding:9px 10px 9px 0; border-bottom:2px solid #201e1d; font-weight:700;">열제목 1</th>
      <th style="text-align:left; font-size:11px; text-transform:uppercase; padding:9px 10px 9px 0; border-bottom:2px solid #201e1d; font-weight:700;">열제목 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:11px 10px 11px 0; border-bottom:1px solid rgba(32,30,29,.25);">데이터 1</td>
      <td style="padding:11px 10px 11px 0; border-bottom:1px solid rgba(32,30,29,.25);">데이터 2</td>
    </tr>
  </tbody>
</table>
```

### 3.3. 리스트 및 기타 요소
* **블록쿼트 (Blockquote)**: 강한 세로선 하나와 백그라운드 없이 연출합니다.
  ```html
  <blockquote style="font-size:18px; line-height:1.6; margin:0; padding:20px 24px; border-left:2px solid #ec3013;">
    “주요 가설 또는 인용문”
  </blockquote>
  ```
* **구분선**: 섹션과 섹션을 나눌 때 상단에 `border-top:2px solid #201e1d; margin-top:48px;`을 주어 묵직하게 구분합니다.
* **강조 뱃지**: `<span style="display:inline-flex; align-items:center; font-size:10.5px; letter-spacing:.02em; padding:3px 9px; border-radius:0px; border:1px solid #ec3013; color:#ec3013;">태그명</span>`

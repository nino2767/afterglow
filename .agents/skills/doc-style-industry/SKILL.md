---
name: "doc-style-industry"
description: "마크다운 기획 문서나 스펙 문서를 AFTERGLOW Industry(산업용 테마) 스타일의 HTML 문서로 변환하고 생성하는 기술"
---

# AFTERGLOW Industry Document Styling Skill

이 스킬은 일반 텍스트나 마크다운 문서를 AFTERGLOW **Industry(산업용 테마)** 디자인 규격의 HTML 문서로 변환 또는 생성할 때 사용합니다.

## 1. 디자인 시스템 핵심 규격 (CSS 토큰)
* **배경색 (Background)**: `#f2f2f3`
* **주요 글자색 (Text)**: `#1d1f20`
* **포인트/강조 컬러 (Accent Blue)**: `#1d2d3d` (주요 카드 백그라운드), `#416180` (레이블/숫자 강조)
* **보조 선/테두리 (Border)**: `1px solid rgba(29,31,32,.16)`
* **폰트 체계 (Typography)**: `Arial Narrow`, `Arial`, `Helvetica`, `sans-serif`

---

## 2. 레이아웃 및 주요 HTML 구조
이 테마는 왼쪽의 고정 사이드바(aside, `230px`)와 오른쪽의 메인 콘텐츠 영역(main)이 좌우로 나뉘는 그리드 형태의 구조를 띱니다.

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
<div style="background:#f2f2f3; color:#1d1f20; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; min-height:100vh;">
    <div style="display:grid; grid-template-columns:230px 1fr; max-width:1180px; margin:0 auto;">
      <!-- 사이드바 네비게이션 -->
      <aside style="padding:44px 22px; position:sticky; top:0; align-self:start; height:100vh; overflow-y:auto;">
        <div style="font-family:'Arial Narrow', Arial, sans-serif; font-weight:600; font-size:24px;">AFTERGLOW</div>
        <div style="font-size:12px; opacity:.72; margin-top:8px; line-height:1.5;">[문서 부제목]</div>
        <nav style="margin-top:26px; display:flex; flex-direction:column; gap:1px;">
          <a href="#i-s1" style="display:flex; gap:10px; align-items:baseline; padding:8px 6px; color:#1d1f20; text-decoration:none; font-size:13px; border-left:2px solid transparent;"><span style="color:#416180; font-size:11px; min-width:16px;">01</span>섹션 제목 1</a>
        </nav>
        <div style="font-size:11px; opacity:.55; margin-top:24px; padding-top:14px; border-top:1px solid rgba(29,31,32,.16); line-height:1.6;">[작성 날짜 및 메타정보]</div>
      </aside>
      
      <!-- 메인 콘텐츠 영역 -->
      <main style="padding:44px 40px 120px; border-left:1px solid rgba(29,31,32,.16);">
        <section id="i-s1" style="margin-bottom:52px;">
          <h2 style="display:flex; align-items:center; gap:12px; font-family:'Arial Narrow', Arial, sans-serif; font-weight:600; font-size:26px; margin:0 0 18px; color:#1d1f20;">
            <span style="font-family:'Arial Narrow', Arial, sans-serif; font-weight:600; font-size:13px; color:#416180; border:1px solid rgba(29,31,32,.16); padding:3px 9px; letter-spacing:.04em;">01</span>섹션 제목 1
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

### 3.1. 모퉁이 십자선 데코레이션 블록 (Cross-hair Corner Panel)
정의나 선언 등 강조할 주요 문구는 아래의 십자선 모퉁이 코너 스타일 박스로 감쌉니다.
```html
<div style="position:relative; border:1px solid rgba(29,31,32,.16); ">
  <!-- 네 모퉁이 십자 데코레이션 (11px x 11px) -->
  <i style="position:absolute; width:11px; height:11px; top:-6px;left:-6px; opacity:.5; background:linear-gradient(#1d1f20,#1d1f20) center/1px 11px no-repeat, linear-gradient(#1d1f20,#1d1f20) center/11px 1px no-repeat;"></i>
  <i style="position:absolute; width:11px; height:11px; top:-6px;right:-6px; opacity:.5; background:linear-gradient(#1d1f20,#1d1f20) center/1px 11px no-repeat, linear-gradient(#1d1f20,#1d1f20) center/11px 1px no-repeat;"></i>
  <i style="position:absolute; width:11px; height:11px; bottom:-6px;left:-6px; opacity:.5; background:linear-gradient(#1d1f20,#1d1f20) center/1px 11px no-repeat, linear-gradient(#1d1f20,#1d1f20) center/11px 1px no-repeat;"></i>
  <i style="position:absolute; width:11px; height:11px; bottom:-6px;right:-6px; opacity:.5; background:linear-gradient(#1d1f20,#1d1f20) center/1px 11px no-repeat, linear-gradient(#1d1f20,#1d1f20) center/11px 1px no-repeat;"></i>
  <div style="padding:26px; background:#1d2d3d; color:#fff;">
    <span style="font-family:'Arial Narrow', Arial, sans-serif; font-size:12px; color:#b5d9fd; text-transform:uppercase; letter-spacing:.06em;">[분류명]</span>
    <blockquote style="font-size:20px; line-height:1.55; margin:12px 0 0; color:#fff; font-family:'Arial Narrow', Arial, sans-serif; font-weight:400;">강조할 큰 타이틀 문구</blockquote>
    <div style="font-size:13px; margin-top:10px; color:rgba(255,255,255,.85);">보조 세부 설명 텍스트</div>
  </div>
</div>
```

### 3.2. 테이블 (Table)
```html
<table style="width:100%; border-collapse:collapse; font-size:14px;">
  <thead>
    <tr>
      <th style="width:25%; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.06em; padding:8px 10px 8px 0; border-bottom:1px solid rgba(29,31,32,.16); color:#5d5d60;">열제목 1</th>
      <th style="text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.06em; padding:8px 10px 8px 0; border-bottom:1px solid rgba(29,31,32,.16); color:#5d5d60;">열제목 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:10px 10px 10px 0; border-bottom:1px solid rgba(29,31,32,.16);">데이터 1</td>
      <td style="padding:10px 10px 10px 0; border-bottom:1px solid rgba(29,31,32,.16);">데이터 2</td>
    </tr>
  </tbody>
</table>
```

### 3.3. 리스트 및 기타 요소
* **순서 없는 리스트 (`<ul>`)**: `padding-left:20px`, 글자 크기는 `14.5px` 정도로 설정하며 개별 `<li>` 마다 `margin:6px 0`을 부여해 가독성을 높입니다.
* **강조 뱃지**: `<span style="display:inline-flex; align-items:center; font-size:10.5px; letter-spacing:.02em; padding:3px 9px; border-radius:2px; border:1px solid #5980a6; color:#5980a6;">태그명</span>`

# Afterglow Workspace Coding Rules

## 1. React 19 & Next.js 15 엄격 린트/컴파일 규칙
* **Purity 규칙 (`react-hooks/purity`)**: 
  * 컴포넌트 본문 내부에서 `Date.now()`나 `Math.random()` 같은 불순(impure) 함수를 직접 호출해 변수나 ID를 생성하면 렌더링 에러가 납니다.
  * 고유 ID 생성 등이 필요한 경우, 헬퍼 함수(예: `const getUniqueId = () => ...`)를 **React 컴포넌트 외부(파일 상단 등)**에 독립적으로 선언하여 사용할 것.
* **Effect 내 State 업데이트 규칙 (`react-hooks/set-state-in-effect`)**:
  * `useEffect` 안에서 `localStorage` 로드 등으로 동기적으로 `setState`를 실행하면 cascading render 부작용 경고가 발생합니다.
  * Effect 내의 상태 초기화 코드는 반드시 `setTimeout(() => { setState(...) }, 0)`으로 감싸 비동기화하여 실행할 것.
* **프로덕션 빌드 정합성**:
  * Next.js 배포 빌드 시 미사용 임포트(`import`)나 미사용 선언 변수는 컴파일 에러로 간주되어 배포가 중단됩니다.
  * 작업을 완료하기 전에 항상 `npm run lint`와 `npm run build`를 실행하여 경고가 전혀 없는 무결점 빌드를 보장할 것.

## 2. 본전시 vs 스핀오프 모듈형 컴포넌트 규칙
* 공통 작품 목록, 상세 도슨트 패널, AI 큐레이터 챗 컴포넌트는 반드시 `theme: "main" | "spinoff"` 프로퍼티를 제공하고 테마별 브랜딩 규격을 엄격히 분기할 것.
  * **`main` 테마**: 포인트 컬러 버건디(`#8B2E4A`), 로컬 스토리지 키 `afterglow_session` 및 `afterglow_user_snaps` 사용.
  * **`spinoff` 테마**: 포인트 컬러 글로잉 시안(`#4FD8EB`), 로컬 스토리지 키 `afterglow_spinoff_session` 및 `afterglow_spinoff_user_snaps` 사용.

## 3. 대외용 HTML 문서 생성 시 사전 컨펌 규칙
* 대외용 서비스 소개서, 스펙 문서, 제안서 등의 HTML 문서 생성을 요청받을 경우, 임의로 스타일을 결정하지 말고 **반드시 작성 착수 전에 대외용 1안(Nocturne · 딥 다크)과 대외용 2안(Industry · 바우하우스 십자선)** 중 선호하는 스타일을 사용자에게 물어보고 컨펌을 받은 후 진행할 것 (`doc-style-external` 스킬 준수).


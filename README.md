# AFTERGLOW - Fandom Conquest (팬덤 땅따먹기)

> **전시 IP의 세계관을 확장해 '두 번째 작품(스핀오프)'으로 만들어내는 몰입형 전시 서비스**

---

## 1. 서비스 개요 및 비전

**AFTERGLOW**는 전시 IP(작품, 작가 세계관)를 재료로, AI가 새로운 세계관 경험 — 이어지는 대화, 미니 스핀오프 전시, 커스텀 굿즈 — 을 독립된 '두 번째 작품'으로 만들어내는 서비스입니다.

* **핵심 정체성**: 본전시를 봤든 안 봤든 그 자체로 성립하는 **독립된 두 번째 작품 (Spinoff Exhibition)**
* **강화 레이어**: 관람객의 관람 데이터(사진·감정·대화)가 연동되어 초개인화된 경험으로 깊어지는 레이어 (Phase 3)

---

## 2. 저장소 구조도 (Monorepo Architecture)

본 저장소는 유저뷰, B2B 어드민, 공통 기획 및 디자인 스펙을 통합 관리하는 **단일 모노레포 저장소**입니다.

```
afterglow/
├── .agents/                   # 에이전트 개발 수칙 및 커스텀 스킬
├── docs/                      # 서비스 통합 기획 및 정보 구조 (SSOT)
│   ├── 00_공통-스펙-및-계약/     # 데이터 계약 SSOT, 모듈 분담, Git 워크플로우
│   ├── 01_상위기획-및-방향성/    # 서비스 소개서 v1.0, 방향성 재정의 v4.0, 시장조사
│   ├── 02_디자인-시스템/        # 유저뷰/어드민 글로우 시안 & 버건디 디자인 가이드라인
│   ├── 03_스핀오프-유저뷰/      # [user-view 매핑] S-1 ~ S4 화면별 상세기획서 (7종)
│   ├── 04_스핀오프-어드민/      # [admin-view 매핑] A-1 ~ A-5 B2B 어드민 상세기획서
│   ├── 05_본전시-유저뷰/        # 본전시 연계 및 레거시 참고 스펙
│   ├── 06_백엔드-개발-아젠다/    # API 계약, DB 스펙, AI 파이프라인
│   ├── 07_테스트-및-QA/         # E2E 테스트 및 QA 시나리오
│   ├── 98_아카이브/             # 구버전 기획서 통합 아카이브
│   └── 99_문서디자인/           # 대외용 문서 템플릿 및 디자인 스킬
├── user-view/                 # 스핀오프 유저뷰 애플리케이션 (Next.js 15 / React 19)
├── admin-view/                # 스핀오프 어드민 애플리케이션 (Vite + React)
└── README.md                  # 저장소 메인 대시보드
```

---

## 3. 실행 가이드 (Quick Start)

### 3-1. 유저뷰 애플리케이션 (`user-view/`)
```bash
cd user-view
npm install
npm run dev      # 로컬 개발 서버 구동 (http://localhost:3000)
npm run lint     # React 19 / Next.js 15 엄격 린트 검수
npm run build    # 프로덕션 빌드 검수
```

### 3-2. 어드민 애플리케이션 (`admin-view/`)
```bash
cd admin-view
npm install
npm run dev      # 어드민 로컬 개발 서버 구동
npm run build    # 어드민 Vite 프로덕션 빌드 검수
```

---

## 4. 디자인 시스템 & 브랜딩 규격

* **스핀오프 유저뷰 (`spinoff`)**: 글로잉 시안 (`#4FD8EB`), 딥 메탈릭 다크 모드 (`#0D0D0F`), 세션 키 `afterglow_spinoff_session`
* **본전시 연계 (`main`)**: 버건디 (`#8B2E4A`), 세션 키 `afterglow_session`
* 상세 스펙: [docs/02_디자인-시스템/스핀오프-유저뷰-디자인가이드라인-v0.1.md](file:///Users/jmk/develop/afterglow/docs/02_%EB%94%94%EC%9E%90%EC%9D%B8-%EC%8B%9C%EC%8A%A4%ED%85%9C/%EC%8A%A4%ED%95%80%EC%98%A4%ED%94%84-%EC%9C%A0%EC%A0%80%EB%B7%B0-%EB%94%94%EC%9E%90%EC%9D%B8%EA%B0%80%EC%9D%B4%EB%93%9C%EB%9D%BC%EC%9D%B8-v0.1.md)

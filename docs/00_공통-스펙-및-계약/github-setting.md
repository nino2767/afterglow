# GitHub 세팅 가이드

> 이 문서는 **afterglow** 프로젝트에 처음 합류하는 협업자를 위한 GitHub 세팅 가이드입니다.
> GitHub를 처음 사용하는 분도, 사용해본 분도 모두 참고할 수 있도록 작성되었습니다.

---

## 목차

1. [Git 설치 확인](#1-git-설치-확인)
2. [Git 사용자 정보 등록](#2-git-사용자-정보-등록)
3. [SSH 키 생성](#3-ssh-키-생성)
4. [GitHub에 SSH 키 등록](#4-github에-ssh-키-등록)
5. [SSH 연결 테스트](#5-ssh-연결-테스트)
6. [레포지토리 클론](#6-레포지토리-클론)
7. [브랜치 전략](#7-브랜치-전략)
8. [기본 작업 흐름](#8-기본-작업-흐름)

---

## 1. Git 설치 확인

터미널을 열고 아래 명령어를 입력하세요.

> **Mac**: `Cmd + Space` → "터미널" 검색

```bash
git --version
```

**✅ 설치된 경우**
```
git version 2.x.x
```

**❌ 설치가 필요한 경우** (`command not found` 출력 시)
```bash
xcode-select --install
```
팝업이 뜨면 "설치" 클릭 후 완료될 때까지 기다리세요.

---

## 2. Git 사용자 정보 등록

GitHub 계정 정보를 로컬 Git에 등록합니다.

```bash
git config --global user.name "GitHub유저네임"
git config --global user.email "GitHub이메일@example.com"
```

**등록 확인**
```bash
git config --global --list
```

아래처럼 출력되면 성공입니다.
```
user.name=GitHub유저네임
user.email=GitHub이메일@example.com
```

> 아무 반응이 없어도 정상입니다. Git은 성공 시 아무 메시지도 출력하지 않습니다.

---

## 3. SSH 키 생성

GitHub와 안전하게 통신하기 위한 SSH 키를 생성합니다.

```bash
ssh-keygen -t ed25519 -C "GitHub이메일@example.com"
```

아래 질문이 나오면 **모두 Enter**만 누르세요.

```
Enter file in which to save the key:  → Enter
Enter passphrase:                      → Enter
Enter same passphrase again:           → Enter
```

생성된 공개키를 복사합니다.

```bash
cat ~/.ssh/id_ed25519.pub
```

`ssh-ed25519 AAAA...` 로 시작하는 텍스트 전체를 복사하세요.

---

## 4. GitHub에 SSH 키 등록

1. [github.com/settings/keys](https://github.com/settings/keys) 접속
2. **"New SSH key"** 클릭
3. 아래 내용 입력

| 항목 | 입력값 |
|------|--------|
| Title | `My Mac` (자유롭게 입력) |
| Key type | `Authentication Key` (기본값) |
| Key | 3단계에서 복사한 텍스트 붙여넣기 |

4. **"Add SSH key"** 클릭

---

## 5. SSH 연결 테스트

```bash
ssh -T git@github.com
```

처음 연결 시 아래 메시지가 나오면 `yes` 입력 후 Enter

```
Are you sure you want to continue connecting? → yes
```

**✅ 성공 메시지**
```
Hi [유저네임]! You've successfully authenticated...
```

---

## 6. 레포지토리 클론

프로젝트를 저장할 폴더로 이동 후 클론합니다.

```bash
cd ~/원하는경로
git clone git@github.com:nino2767/afterglow.git
cd afterglow
```

---

## 7. 브랜치 전략

이 프로젝트는 3-way 모듈 분담 및 협업에 따라 아래 브랜치 전략을 사용합니다.

### 브랜치 명명 규칙
```
feat/main-<화면명>       예: feat/main-onboarding      (J 담당)
feat/spinoff-<화면명>    예: feat/spinoff-popup-curator (Sol 담당)
feat/account-<화면명>    예: feat/account-home          (J 담당)
shared/<변경내용>        예: shared/emotion-axis-fix     (공용, 상대방 리뷰 필수)
```

- **main**(기본 브랜치)은 보호 브랜치이며, 직접 push가 금지되고 오직 PR로만 머지 가능합니다.
- 머지 방식은 **Squash Merge**를 기본값으로 사용합니다.

---

## 8. 기본 작업 흐름

### 새 기능 개발 시

```bash
# 1. main 브랜치 최신화
git checkout main
git pull origin main

# 2. 역할에 맞는 모듈 feature 브랜치 생성
git checkout -b feat/main-artwork   # (예시)

# 3. 작업 후 커밋 (커밋 메시지 규칙 준수)
git add .
git commit -m "feat: 정보카드 UI 개발"

# 4. 원격에 push
git push origin feat/main-artwork
```

### PR(Pull Request) 및 머지 규칙

- **PR 제목 접두어 필수**: 변경 범위에 따라 `[MAIN]`, `[SPINOFF]`, `[ACCOUNT]`, `[SHARED]` 접두어를 제목에 반드시 표기합니다.
- **머지 권한**:
  - 본인 담당 폴더 내부만 수정한 경우 (main/account = J, spinoff = Sol), 상대방 리뷰 없이 자율적으로 **셀프 Squash Merge**가 가능합니다.
  - `shared/` 하위 파일이나 공용 라이브러리를 수정한 경우, **상대방의 리뷰 및 명시적 승인(Approve)**이 완료된 후 Squash Merge해야 합니다.
  - `docs/00_공통-스펙-및-계약/00_데이터-계약-SSOT_v1.2.md` 수정이 필요한 경우, 코드 수정 이전에 상호 합의가 선행되어야 합니다.

### 커밋 메시지 규칙

| 태그 | 설명 |
|------|------|
| `feat:` | 새 기능 추가 |
| `fix:` | 버그 수정 |
| `docs:` | 문서 수정 |
| `style:` | 코드 포맷 변경 |
| `refactor:` | 코드 리팩토링 |

---

## 문의

프로젝트 관련 문의는 [@nino2767](https://github.com/nino2767) 에게 연락하세요.

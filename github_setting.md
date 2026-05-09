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

이 프로젝트는 아래 브랜치 전략을 사용합니다.

```
main     ← 실제 서비스 (항상 배포 가능 상태, 직접 push 금지)
dev      ← 통합 테스트용
feat/xxx ← 기능 개발
fix/xxx  ← 버그 수정
```

**작업 흐름**
```
feat 브랜치 생성 → 개발 → PR → dev 확인 → main 머지 → 배포
```

---

## 8. 기본 작업 흐름

### 새 기능 개발 시

```bash
# 1. dev 브랜치 최신화
git checkout dev
git pull origin dev

# 2. 새 기능 브랜치 생성
git checkout -b feat/기능이름

# 3. 작업 후 커밋
git add .
git commit -m "feat: 기능 설명"

# 4. 원격에 push
git push origin feat/기능이름
```

### 커밋 메시지 규칙

| 태그 | 설명 |
|------|------|
| `feat:` | 새 기능 추가 |
| `fix:` | 버그 수정 |
| `docs:` | 문서 수정 |
| `style:` | 코드 포맷 변경 |
| `refactor:` | 코드 리팩토링 |

### PR(Pull Request) 규칙

- `main` 브랜치에는 **직접 push 금지**
- PR을 올리면 **상대방이 리뷰 후 머지**
- PR 제목은 커밋 메시지 규칙과 동일하게 작성

---

## 문의

프로젝트 관련 문의는 [@nino2767](https://github.com/nino2767) 에게 연락하세요.

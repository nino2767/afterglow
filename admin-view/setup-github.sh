#!/bin/bash

# ────────────────────────────────────────────
#  AFTERGLOW Admin — GitHub 업로드 스크립트
#  사용법: bash setup-github.sh [GitHub유저명] [레포명]
#  예시:   bash setup-github.sh myname afterglow-admin
# ────────────────────────────────────────────

GITHUB_USER=${1:-"YOUR_GITHUB_USERNAME"}
REPO_NAME=${2:-"afterglow-admin"}

echo ""
echo "🌟 AFTERGLOW Admin — GitHub 업로드 시작"
echo "   유저: $GITHUB_USER"
echo "   레포: $REPO_NAME"
echo ""

# 1. Git 초기화
git init
git add .
git commit -m "feat: AFTERGLOW admin UI — 7 screens, fully responsive

운영자 어드민 (6화면)
- 대시보드, IP 업로드, Concept Bot
- 관람 모니터, 성과 리포트, 정산 관리

슈퍼 어드민 (1화면)
- 고객사 관리

반응형: 데스크톱 / 태블릿 / 모바일 (하단 탭바)"

# 2. GitHub 레포 생성 (gh CLI 사용)
if command -v gh &> /dev/null; then
  echo "📦 GitHub CLI로 레포 생성 중..."
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
  echo ""
  echo "✅ 완료! 레포 주소:"
  echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
else
  # gh CLI 없으면 수동 remote 설정
  echo "⚠️  GitHub CLI(gh)가 없습니다. 수동으로 진행합니다."
  echo ""
  echo "📋 다음 단계를 따라주세요:"
  echo ""
  echo "  1. https://github.com/new 에서 '$REPO_NAME' 레포 생성"
  echo "  2. 아래 명령어 실행:"
  echo ""
  echo "     git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git"
  echo "     git branch -M main"
  echo "     git push -u origin main"
fi

echo ""
echo "🚀 Vercel 1분 배포 (선택):"
echo "   1. https://vercel.com/new 접속"
echo "   2. '$REPO_NAME' 레포 선택"
echo "   3. Framework: Vite → Deploy 클릭"
echo ""

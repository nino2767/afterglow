"use client";

/**
 * app/(account)/login/page.tsx — S0 로그인 정적 고도화 포팅 (Next.js TSX)
 * 상세기획-00-로그인계정-내비게이션.md 스펙 반영
 */

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, MessageSquare, Check, Sparkles } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const trigger = searchParams.get("trigger") || "default";

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showMergeToast, setShowMergeToast] = useState(false);

  // ── 트리거별 전환율 최적화 동적 카피 ──
  const getHeaderCopy = () => {
    switch (trigger) {
      case "report":
        return {
          title: "이 여운, 잃어버리지 않게 저장해두세요",
          desc: "오늘 감상하신 소중한 여운 리포트가 계정에 영구 보관됩니다."
        };
      case "spinoff_locked":
        return {
          title: "팝업 소식, 잊지 않고 알려드릴게요",
          desc: "어비스 티 라운지 오픈 일정과 현장 쿠폰 혜택을 챙겨드려요."
        };
      case "user_icon":
        return {
          title: "다시 만나서 반가워요",
          desc: "이전 여정 기록과 초대장을 불러옵니다."
        };
      default:
        return {
          title: "당신의 여운을 저장해두세요",
          desc: "간단한 연동만으로 모든 관람 여정과 팝업 혜택이 이어집니다."
        };
    }
  };

  const copy = getHeaderCopy();

  function handleLoginSuccess() {
    // 1. 기존 게스트 세션 정보 유무 판단 (단방향 병합 시뮬레이션)
    let guestVisitorId = null;
    let guestKeywords = [];
    try {
      const savedSession = localStorage.getItem("afterglow_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        guestVisitorId = parsed.visitor_id;
        guestKeywords = parsed.initial_keywords || [];
      }
    } catch (e) {
      //
    }

    // 2. 가상 계정 생성 및 게스트 정보 병합 (account.visitor_merged 이벤트 모사)
    const newAccount = {
      account_id: `acc_${Date.now()}`,
      email: email || "kakao_user@kakao.com",
      nickname: nickname || (isSignUpMode ? nickname : "여운 탐험가"),
      marketing_consent: marketingConsent || (trigger === "spinoff_locked"),
      registered_at: Date.now(),
      merged_visitor_id: guestVisitorId,
      taste_profile: guestKeywords.length > 0 ? {
        personaTitle: "고요함을 머금은 감성 탐구자",
        personaCopy: "물결 위에서 일렁이는 빛들을 바라보며, 내면의 잔잔함에 머무른 탐구자입니다.",
        topKeywords: guestKeywords.map((k: any) => k.emotion),
        bgGradient: "linear-gradient(135deg, #7B9EE8 0%, #C9A84C 100%)",
        longestArtwork: { title: "윤슬", dwell_sec: 720 },
        topAxis: "serene"
      } : null
    };

    localStorage.setItem("afterglow_account", JSON.stringify(newAccount));
    console.log(`[Event: account.visitor_merged] Merged visitor ${guestVisitorId} into account ${newAccount.account_id}`);

    // 3. 병합 완료 토스트 연출 후 홈으로 이동
    setShowMergeToast(true);
    setTimeout(() => {
      if (trigger === "report") {
        router.push("/report");
      } else if (trigger === "spinoff_locked") {
        router.push("/spinoff/landing");
      } else {
        router.push("/home");
      }
    }, 1500);
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    handleLoginSuccess();
  }

  return (
    <div className="screen justify-center" style={{
      background: "var(--bg)",
      padding: "var(--space-6) var(--space-6) var(--space-12)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "relative"
    }}>
      {/* 닫기 버튼: ✕ 클릭 시 이전 화면으로 복귀 (게스트 유지) */}
      <button
        onClick={() => router.back()}
        style={{
          position: "absolute",
          top: "var(--space-5)",
          right: "var(--space-5)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 8,
          zIndex: 10
        }}
      >
        <X size={20} color="var(--ink)" />
      </button>

      {/* 헤더 카피 영역 */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: "var(--accent-dim)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
          color: "var(--accent)"
        }}>
          ✦
        </div>
        <h1 className="t-heading" style={{ fontSize: 22, lineHeight: 1.35, wordBreak: "keep-all" }}>
          {copy.title}
        </h1>
        <p className="t-caption" style={{ marginTop: 8, color: "var(--ink-muted)", wordBreak: "keep-all" }}>
          {copy.desc}
        </p>
      </div>

      {/* 소셜 및 일반 폼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        
        {/* 카카오 원탭 간편로그인 */}
        <button
          className="btn btn-full"
          onClick={handleLoginSuccess}
          style={{
            background: "#FEE500",
            color: "#191919",
            borderRadius: "var(--radius-md)",
            padding: "14px 28px",
            fontWeight: 600,
            gap: 8,
            border: "none"
          }}
        >
          <MessageSquare size={16} fill="#191919" />
          카카오로 시작하기
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
          <div style={{ height: 1, background: "var(--border)", flex: 1 }} />
          <span className="t-micro" style={{ fontSize: 10 }}>또는 이메일</span>
          <div style={{ height: 1, background: "var(--border)", flex: 1 }} />
        </div>

        {/* 이메일 폼 */}
        <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <input
            type="email"
            placeholder="이메일 주소"
            className="input-field"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ fontSize: 16, padding: "12px 0" }}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ fontSize: 16, padding: "12px 0" }}
            required
          />

          {isSignUpMode && (
            <div className="anim-fade" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <input
                type="text"
                placeholder="사용할 이름"
                className="input-field"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                style={{ fontSize: 16, padding: "12px 0" }}
                required
              />

              <label className="check-row" style={{ marginTop: "var(--space-2)", cursor: "pointer", display: "flex", gap: 12 }}>
                <input
                  type="checkbox"
                  className="check-box"
                  checked={marketingConsent}
                  onChange={e => setMarketingConsent(e.target.checked)}
                />
                <div>
                  <p className="t-title" style={{ fontSize: 13.5 }}>차기 전시 및 팝업 소식 수신동의 (선택)</p>
                  <p className="t-caption" style={{ fontSize: 11 }}>공간 오픈 소식을 메일로 보내드립니다</p>
                </div>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: "var(--space-4)" }}
          >
            {isSignUpMode ? "회원가입하고 저장하기" : "이메일 로그인"}
          </button>
        </form>

        <button
          className="btn btn-ghost"
          onClick={() => setIsSignUpMode(!isSignUpMode)}
          style={{ fontSize: 13, alignSelf: "center", color: "var(--accent)" }}
        >
          {isSignUpMode ? "이미 계정이 있으신가요? 로그인" : "처음이신가요? 가입하기"}
        </button>
      </div>

      {/* 병합 완료 가상 피드백 토스트 */}
      {showMergeToast && (
        <div className="anim-scale" style={{
          position: "absolute",
          bottom: 30,
          left: "var(--space-6)",
          right: "var(--space-6)",
          background: "var(--ink)",
          color: "#FFFFFF",
          padding: "12px 18px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "var(--shadow-md)",
          zIndex: 100
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%", background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Check size={12} color="#FFFFFF" />
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>
            관람 기록이 성공적으로 안전하게 저장되었습니다!
          </span>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="screen justify-center items-center">
        <p className="t-body">로그인 화면을 불러오고 있어요...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

"use client";

/**
 * app/(account)/login/page.tsx — S0 로그인 정적 포팅 (Next.js TSX)
 */

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Mail, MessageSquare } from "lucide-react";


function LoginContent() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const trigger = searchParams.get("trigger") || "mypage";

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  function handleLoginSuccess() {
    // 데이터 레이어 보류 지침에 따라 로컬 계정 mock 정보 기록
    try {
      localStorage.setItem("afterglow_account", JSON.stringify({
        account_id: `acc_${Date.now()}`,
        email: email || "kakao_user@kakao.com",
        nickname: nickname || "여운 탐험가",
        marketing_consent: marketingConsent,
        registered_at: Date.now(),
        exhibitions: [],
        invites: []
      }));
    } catch (e) {
      //
    }
    // 성공 시 계정 홈(S10)으로 전환
    router.push("/home");
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
      height: "100vh"
    }}>
      {/* 닫기 버튼 */}
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

      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: "var(--accent-dim)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
          color: "var(--accent)"
        }}>
          ✦
        </div>
        <h1 className="t-heading" style={{ fontSize: 24 }}>
          {isSignUpMode ? "여정의 동반자 되기" : "나의 여운 이어가기"}
        </h1>
        <p className="t-caption" style={{ marginTop: 4, color: "var(--ink-muted)" }}>
          {isSignUpMode ? "계정을 만들고 취향과 초대장을 보관하세요" : "가입했던 이메일 또는 카카오로 로그인하세요"}
        </p>
      </div>

      {/* 소셜 및 일반 폼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        
        {/* 카카오 Mock 로그인 */}
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
          카카오로 3초 만에 시작하기
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
            {isSignUpMode ? "회원가입하기" : "이메일 로그인"}
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


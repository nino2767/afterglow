"use client";

/**
 * NavigationShell.tsx — 상단바 및 뒤로가기/계정 아바타 공통 셸 (Next.js TSX)
 * 상세기획-00-로그인계정-내비게이션.md 스펙 반영
 */

import React, { useState, useEffect } from "react";
import { ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavigationShellProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onUserIconClick?: () => void;
  children: React.ReactNode;
}

export default function NavigationShell({
  title = "AFTERGLOW",
  showBack = true,
  onBack,
  onUserIconClick,
  children
}: NavigationShellProps) {
  const router = useRouter();

  const [isLogged, setIsLogged] = useState(false);
  const [userInitial, setUserInitial] = useState("G");

  useEffect(() => {
    try {
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        const parsed = JSON.parse(account);
        setIsLogged(true);
        // 이름 첫 글자를 아바타 이니셜로 활용
        const name = parsed.nickname || "관람객";
        setUserInitial(name.charAt(0).toUpperCase());
      } else {
        setIsLogged(false);
        setUserInitial("G");
      }
    } catch (e) {
      setIsLogged(false);
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleUserClick = () => {
    if (onUserIconClick) {
      onUserIconClick();
    } else {
      if (isLogged) {
        // 로그인 상태이면 설정 마이페이지(S7)로 이동
        router.push("/mypage");
      } else {
        // 비로그인 상태이면 로그인 화면(S0)에 트리거 카피를 달아 이동
        router.push("/login?trigger=user_icon");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── 상단 바 (Header) ── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        padding: "calc(var(--safe-top) + 12px) var(--space-6) 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px"
      }}>
        {/* 뒤로가기 */}
        <div style={{ width: "40px" }}>
          {showBack && (
            <button
              onClick={handleBack}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <ArrowLeft size={20} color="var(--ink)" />
            </button>
          )}
        </div>

        {/* 타이틀 */}
        <span
          className="t-title"
          style={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.05em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "180px",
            textAlign: "center"
          }}
        >
          {title}
        </span>

        {/* 계정 아바타 아이콘 */}
        <div style={{ width: "40px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleUserClick}
            style={{
              background: isLogged ? "var(--accent-dim)" : "transparent",
              border: isLogged ? "1px solid rgba(139,46,74,0.3)" : "1px solid var(--border-mid)",
              cursor: "pointer",
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0
            }}
          >
            {isLogged ? (
              <span className="t-mono" style={{ fontSize: 12, fontWeight: "bold", color: "var(--accent)" }}>
                {userInitial}
              </span>
            ) : (
              <User size={15} color="var(--ink-muted)" />
            )}
          </button>
        </div>
      </header>

      {/* ── 본문 콘텐츠 ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}

"use client";

/**
 * NavigationShell.tsx — 상단바 및 뒤로가기/계정 아이콘 공통 셸 (Next.js TSX 버포트)
 */

import React from "react";
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

  // 데이터 레이어 충돌에 기인한 임시 mock 로그인 상태 (정적 UI용)
  const isLogged = false; 

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
      router.push("/login");
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

        {/* 계정 아이콘 */}
        <div style={{ width: "40px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleUserClick}
            style={{
              background: isLogged ? "var(--accent-dim)" : "transparent",
              border: isLogged ? "1px solid rgba(139,46,74,0.2)" : "1px solid var(--border-mid)",
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
              <span className="t-mono" style={{ fontSize: 11, fontWeight: "bold", color: "var(--accent)" }}>
                M
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

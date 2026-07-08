"use client";

/**
 * BottomBar.tsx — 화면 하단 고정 액션 바 컴포넌트 (Next.js TSX 버포트)
 */

import React from "react";

interface BottomBarProps {
  children: React.ReactNode;
}

export default function BottomBar({ children }: BottomBarProps) {
  return (
    <div style={{
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "var(--space-4) var(--space-5)",
      paddingBottom: "calc(var(--space-4) + var(--safe-bottom))",
      background: "linear-gradient(to top, var(--bg) 70%, transparent)",
      zIndex: 40
    }}>
      {children}
    </div>
  );
}

"use client";

/**
 * BottomTabBar.tsx — 계정 모드 전용 하단 탭바 4종 (Next.js TSX 버포트)
 */

import React from "react";
import { Home, BookOpen, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface BottomTabBarProps {
  activeTab: "home" | "reports" | "invites" | "profile";
  onTabChange?: (tabId: "home" | "reports" | "invites" | "profile") => void;
}

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const router = useRouter();

  const tabs = [
    { id: "home" as const, label: "홈", icon: Home, path: "/home" },
    { id: "reports" as const, label: "마이리포트", icon: BookOpen, path: "/my-reports" },
    { id: "invites" as const, label: "초대장", icon: Mail, path: "/invites" },
    { id: "profile" as const, label: "마이페이지", icon: User, path: "/mypage" },
  ];

  const handleTabClick = (tab: typeof tabs[number]) => {
    if (onTabChange) {
      onTabChange(tab.id);
    } else {
      router.push(tab.path);
    }
  };

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "430px",
      background: "var(--bg)",
      borderTop: "1px solid var(--border)",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      zIndex: 100,
      paddingBottom: "calc(var(--safe-bottom) / 2)"
    }}>
      {tabs.map(tab => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "6px 12px",
              color: isActive ? "var(--accent)" : "var(--ink-muted)",
              transition: "color 0.2s",
              flex: 1
            }}
          >
            <IconComponent size={20} color={isActive ? "var(--accent)" : "var(--ink-muted)"} />
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 600 : 500
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

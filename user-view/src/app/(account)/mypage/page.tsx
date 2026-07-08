"use client";

/**
 * app/(account)/mypage/page.tsx — S7 마이페이지 정적 포팅 (Next.js TSX)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Bell, Shield, Info } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";
import BottomTabBar from "../../../components/BottomTabBar";

export default function MyPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("관람객");
  const [email, setEmail] = useState("guest@afterglow.co.kr");
  const [optInMarketing, setOptInMarketing] = useState(false);
  const [optInConcurrent, setOptInConcurrent] = useState(true);

  useEffect(() => {
    try {
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        const parsed = JSON.parse(account);
        setNickname(parsed.nickname || "관람객");
        setEmail(parsed.email || "guest@afterglow.co.kr");
        setOptInMarketing(parsed.marketing_consent || false);
      }
    } catch (e) {
      //
    }
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("afterglow_account");
      localStorage.removeItem("afterglow_session");
    } catch (e) {
      //
    }
    alert("로그아웃되었습니다. 게스트 온보딩으로 이동합니다.");
    router.push("/onboarding");
  }

  function handleMarketingToggle(val: boolean) {
    setOptInMarketing(val);
    try {
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        const parsed = JSON.parse(account);
        parsed.marketing_consent = val;
        localStorage.setItem("afterglow_account", JSON.stringify(parsed));
      }
    } catch (e) {
      //
    }
  }

  return (
    <NavigationShell title="설정" showBack={false}>
      <div style={{ flex: 1, padding: "var(--space-5) var(--space-5) 80px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        
        {/* 프로필 요약 */}
        <div className="card" style={{ padding: "var(--space-5)", background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="t-micro" style={{ marginBottom: 4 }}>내 프로필</p>
          <h2 className="t-heading" style={{ fontSize: 22, marginBottom: 2 }}>{nickname}</h2>
          <p className="t-caption" style={{ color: "var(--ink-muted)" }}>{email}</p>
        </div>

        {/* 수신동의 토글 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <p className="t-micro">알림 및 정보 수신 설정</p>

          {/* 마케팅 수신동의 */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Bell size={18} color="var(--ink-muted)" />
              <div>
                <p className="t-title" style={{ fontSize: 14.5 }}>피플리 전시 공간 소식 알림</p>
                <p className="t-caption" style={{ fontSize: 11.5 }}>신규 전시 오픈 및 티켓 예매 혜택 안내</p>
              </div>
            </div>
            {/* 토글 스위치 구현 */}
            <label className="toggle-switch" style={{
              position: "relative",
              display: "inline-block",
              width: 44,
              height: 24,
              cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={optInMarketing}
                onChange={e => handleMarketingToggle(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span className="toggle-slider" style={{
                position: "absolute",
                inset: 0,
                backgroundColor: optInMarketing ? "var(--accent)" : "var(--border-strong)",
                borderRadius: 24,
                transition: "0.2s"
              }}>
                <span style={{
                  position: "absolute",
                  width: 18,
                  height: 18,
                  left: 3,
                  bottom: 3,
                  backgroundColor: "#FFFFFF",
                  borderRadius: "50%",
                  transition: "0.2s",
                  transform: optInMarketing ? "translateX(20px)" : "translateX(0)"
                }} />
              </span>
            </label>
          </div>

          {/* 진행중 전시 동기화 수신 */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Shield size={18} color="var(--ink-muted)" />
              <div>
                <p className="t-title" style={{ fontSize: 14.5 }}>현재 관람 세션 연동 설정</p>
                <p className="t-caption" style={{ fontSize: 11.5 }}>가이드 모드의 감상 기록을 실시간 백업합니다</p>
              </div>
            </div>
            <label className="toggle-switch" style={{
              position: "relative",
              display: "inline-block",
              width: 44,
              height: 24,
              cursor: "pointer"
            }}>
              <input
                type="checkbox"
                checked={optInConcurrent}
                onChange={e => setOptInConcurrent(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span className="toggle-slider" style={{
                position: "absolute",
                inset: 0,
                backgroundColor: optInConcurrent ? "var(--accent)" : "var(--border-strong)",
                borderRadius: 24,
                transition: "0.2s"
              }}>
                <span style={{
                  position: "absolute",
                  width: 18,
                  height: 18,
                  left: 3,
                  bottom: 3,
                  backgroundColor: "#FFFFFF",
                  borderRadius: "50%",
                  transition: "0.2s",
                  transform: optInConcurrent ? "translateX(20px)" : "translateX(0)"
                }} />
              </span>
            </label>
          </div>
        </div>

        {/* 서비스 기본 설정 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
            <Info size={16} color="var(--ink-muted)" />
            <span style={{ flex: 1 }}>이용약관 및 개인정보 처리방침</span>
            <span style={{ color: "var(--ink-muted)" }}>v1.2</span>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          className="btn btn-outline btn-full"
          onClick={handleLogout}
          style={{ gap: 6, marginTop: "var(--space-6)" }}
        >
          <LogOut size={15} />
          로그아웃
        </button>

        {/* 하단 탭바 */}
        <BottomTabBar activeTab="profile" />

      </div>
    </NavigationShell>
  );
}

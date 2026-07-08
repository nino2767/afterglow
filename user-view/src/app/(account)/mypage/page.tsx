"use client";

/**
 * app/(account)/mypage/page.tsx — S7 마이페이지 설정 고도화 포팅 (Next.js TSX)
 * 상세기획-07~10-계정모드.md 스펙 반영 (프로필 및 알림 설정만 보존)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Bell, Shield, Info, ArrowRight } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";
import BottomTabBar from "../../../components/BottomTabBar";

export default function MyPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("관람객");
  const [email, setEmail] = useState("guest@afterglow.co.kr");
  const [optInMarketing, setOptInMarketing] = useState(false);
  const [optInExhibitionAbyss, setOptInExhibitionAbyss] = useState(true);
  const [optInExhibitionGarden, setOptInExhibitionGarden] = useState(false);

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
        
        {/* 프로필 정보 요약 카드 (상세기획 §2-2) */}
        <div className="card" style={{ padding: "var(--space-5)", background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="t-micro" style={{ marginBottom: 4 }}>로그인 계정</p>
          <h2 className="t-heading" style={{ fontSize: 22, marginBottom: 2 }}>{nickname}님</h2>
          <p className="t-caption" style={{ color: "var(--ink-muted)" }}>이메일: {email}</p>
        </div>

        {/* 🔔 알림 설정 (전체 및 전시별 세부 토글) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <p className="t-micro">알림 및 정보 수신 설정</p>

          {/* 1. 전체 마케팅 알림 */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            borderBottom: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Bell size={18} color="var(--accent)" />
              <div>
                <p className="t-title" style={{ fontSize: 14.5, fontWeight: 500 }}>전체 마케팅 알림 동의</p>
                <p className="t-caption" style={{ fontSize: 11.5 }}>신규 전시 팝업 및 기획사 혜택 소식</p>
              </div>
            </div>
            
            {/* 토글 스위치 */}
            <label className="toggle-switch" style={{ position: "relative", display: "inline-block", width: 44, height: 24, cursor: "pointer" }}>
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

          {/* 2. 전시별 팝업 오픈 알림 설정 (상세기획 §3) */}
          <div style={{ paddingLeft: 4, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <p className="t-micro" style={{ fontSize: 10, color: "var(--ink-muted)" }}>전시별 세부 알림 토글</p>
            
            {/* 빛의 심연 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="t-caption" style={{ color: "var(--ink)" }}>빛의 심연 (어비스 티 라운지)</span>
              <label className="toggle-switch" style={{ position: "relative", display: "inline-block", width: 38, height: 20, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={optInExhibitionAbyss}
                  onChange={e => setOptInExhibitionAbyss(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="toggle-slider" style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: optInExhibitionAbyss ? "var(--accent)" : "var(--border-strong)",
                  borderRadius: 20,
                  transition: "0.2s"
                }}>
                  <span style={{
                    position: "absolute",
                    width: 14,
                    height: 14,
                    left: 3,
                    bottom: 3,
                    backgroundColor: "#FFFFFF",
                    borderRadius: "50%",
                    transition: "0.2s",
                    transform: optInExhibitionAbyss ? "translateX(18px)" : "translateX(0)"
                  }} />
                </span>
              </label>
            </div>

            {/* 무한의 정원 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="t-caption" style={{ color: "var(--ink)" }}>무한의 정원 팝업</span>
              <label className="toggle-switch" style={{ position: "relative", display: "inline-block", width: 38, height: 20, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={optInExhibitionGarden}
                  onChange={e => setOptInExhibitionGarden(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="toggle-slider" style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: optInExhibitionGarden ? "var(--accent)" : "var(--border-strong)",
                  borderRadius: 20,
                  transition: "0.2s"
                }}>
                  <span style={{
                    position: "absolute",
                    width: 14,
                    height: 14,
                    left: 3,
                    bottom: 3,
                    backgroundColor: "#FFFFFF",
                    borderRadius: "50%",
                    transition: "0.2s",
                    transform: optInExhibitionGarden ? "translateX(18px)" : "translateX(0)"
                  }} />
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 고객 정보 지원 안내 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)", fontSize: 13.5 }}>
            <Shield size={15} color="var(--ink-muted)" />
            <span style={{ flex: 1, color: "var(--ink-2)" }}>개인정보 처리 위탁 및 보안 방침</span>
            <Info size={14} color="var(--ink-faint)" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)", fontSize: 13.5 }}>
            <Info size={15} color="var(--ink-muted)" />
            <span style={{ flex: 1, color: "var(--ink-2)" }}>이용 문의 및 회원 탈퇴</span>
            <span style={{ color: "var(--ink-muted)", fontSize: 11 }}>고객센터 접수</span>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          className="btn btn-outline btn-full"
          onClick={handleLogout}
          style={{ gap: 6, marginTop: "var(--space-6)" }}
        >
          <LogOut size={15} />
          로그아웃
        </button>

        {/* 하단 탭바 고정 */}
        <BottomTabBar activeTab="profile" />

      </div>
    </NavigationShell>
  );
}

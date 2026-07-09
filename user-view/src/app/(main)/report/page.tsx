"use client";

/**
 * app/(guide)/report/page.tsx — S4 여운 리포트 정적 포팅 (Next.js TSX)
 * 내비게이션 셸 적용
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, Share2, Compass, Award, ArrowRight, Sparkles, Calendar, MapPin, UserPlus } from "lucide-react";
import BottomBar from "../../../components/BottomBar";
import NavigationShell from "../../../components/NavigationShell";

export default function ReportPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("관람객");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("afterglow_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setNickname(parsed.nickname || "관람객");
      }
      
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        setIsLogged(true);
      }
    } catch (e) {
      //
    }
  }, []);

  // ── 이미지 저장/공유 모사 ──
  function handleSaveImage() {
    alert("페르소나 카드가 스마트폰 갤러리에 저장되었습니다. (Mock)");
  }

  function handleShare() {
    alert("공유 링크가 클립보드에 복사되었습니다. (Mock)");
  }

  // 데이터 레이어 보류 지침에 따라 임시 mock 리포트 및 초대장 고정 (로컬 fallback)
  const tasteProfile = {
    personaTitle: "고요함을 머금은 감성 탐구자",
    personaCopy: "물감 같은 파란 수면 위에서 흩어지는 빛들을 보며, 번잡한 소음을 걷어내고 내면의 차분함에 머물렀습니다.",
    topKeywords: ["고요함", "몽환적인", "심오함"],
    bgGradient: "linear-gradient(135deg, #7B9EE8 0%, #C9A84C 100%)",
    longestArtwork: { title: "윤슬", dwell_sec: 720 },
    topAxis: "serene"
  };

  const invite = {
    invite_id: "INV-MOCKABYSS",
    concept_type: "C",
    conceptName: "어비스 티 라운지",
    personalizedCopy: "'고요한 잔상'이라고 하셨죠. 당신을 위해 차분한 향의 찻잎을 블렌딩 바로 보내 두었습니다.",
  };

  // 가입 시 이관을 위한 임시 캐싱 처리
  useEffect(() => {
    try {
      localStorage.setItem("afterglow_last_report", JSON.stringify({
        tasteProfile,
        invite: {
          ...invite,
          redeemed: false,
          issued_at: Date.now()
        }
      }));
    } catch (e) {
      //
    }
  }, []);

  return (
    <NavigationShell title="오늘의 여운" showBack={true} onBack={() => router.push("/artwork")}>
      <div style={{
        padding: "var(--space-6) var(--space-5) var(--space-12)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        flex: 1
      }}>

        {/* ── 페르소나 취향 카드 ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div
            id="persona-card"
            style={{
              background: tasteProfile.bgGradient,
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-6)",
              color: "#FFFFFF",
              boxShadow: "var(--shadow-md)",
              position: "relative",
              overflow: "hidden",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div style={{
              position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
              pointerEvents: "none"
            }} />

            <div>
              <span className="t-micro" style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
                AFTERGLOW 취향 유형
              </span>
              <h2 className="t-heading" style={{ color: "#FFFFFF", fontSize: 26, marginTop: 4, marginBottom: "var(--space-3)", fontFamily: "var(--font-display)" }}>
                {tasteProfile.personaTitle}
              </h2>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                {tasteProfile.topKeywords.map((k) => (
                  <span
                    key={k}
                    style={{
                      background: "rgba(255, 255, 255, 0.16)",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: 12,
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    #{k}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.15)", paddingTop: "var(--space-4)", marginTop: "var(--space-6)" }}>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                {tasteProfile.personaCopy}
              </p>
            </div>
          </div>

          {/* 저장 & 공유 버튼 */}
          <div style={{ display: "flex", gap: "var(--space-2)", width: "100%" }}>
            <button className="btn btn-outline" style={{ flex: 1, gap: 6, fontSize: 13 }} onClick={handleSaveImage}>
              <Download size={14} /> 이미지로 저장
            </button>
            <button className="btn btn-outline" style={{ flex: 1, gap: 6, fontSize: 13 }} onClick={handleShare}>
              <Share2 size={14} /> 카드 공유
            </button>
          </div>

          {/* 계정 저장 유도 CTA (비로그인 상태일 때만 노출) */}
          {!isLogged && (
            <div style={{
              background: "var(--surface-2)",
              border: "1px dashed var(--accent)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4) var(--space-5)",
              marginTop: "var(--space-2)",
              textAlign: "center"
            }}>
              <p className="t-caption" style={{ marginBottom: "var(--space-3)", fontSize: 13 }}>
                이 여운 리포트가 사라지지 않게 저장해두세요.
              </p>
              <button
                className="btn btn-primary btn-full btn-sm"
                onClick={() => router.push("/login?trigger=report")}
                style={{ gap: 6 }}
              >
                <UserPlus size={14} />
                계정 만들고 저장하기
              </button>
            </div>
          )}
        </div>

        {/* ── 오늘 가장 머문 순간 ── */}
        <div className="card" style={{ padding: "var(--space-5)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>관람 하이라이트</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <Award size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div>
                <p className="t-title" style={{ fontSize: 14, marginBottom: 2 }}>시선이 가장 머문 곳</p>
                <p className="t-caption">《{tasteProfile.longestArtwork.title}》 작품 앞 ({tasteProfile.longestArtwork.dwell_sec}초 머무름)</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <Compass size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div>
                <p className="t-title" style={{ fontSize: 14, marginBottom: 2 }}>내면이 반응한 감정선</p>
                <p className="t-caption">
                  고요·평온 계열의 잔향이 오늘 당신에게 깊게 남았습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bridge 초대장 ── */}
        <div style={{
          background: "#0D0D0F",
          color: "#FFFFFF",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%",
            border: "1.5px solid rgba(255, 255, 255, 0.05)",
            pointerEvents: "none"
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-4)" }}>
            <Sparkles size={14} color="var(--accent-light)" />
            <span className="t-micro" style={{ color: "var(--accent-light)", fontWeight: 600 }}>BRIDGE INVITATION</span>
          </div>

          <h3 className="t-heading" style={{ color: "#FFFFFF", fontSize: 20, marginBottom: "var(--space-3)", fontFamily: "var(--font-display)" }}>
            {invite.conceptName}로의 초대
          </h3>

          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "rgba(255, 255, 255, 0.75)", marginBottom: "var(--space-5)" }}>
            {invite.personalizedCopy}
          </p>

          <button
            id="btn-go-spinoff"
            className="btn btn-primary btn-full btn-lg"
            onClick={() => router.push("/spinoff/landing")}
            style={{ gap: 6 }}
          >
            초대장 열어보기
            <ArrowRight size={16} />
          </button>

          <div style={{
            marginTop: "var(--space-5)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "var(--space-4)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11.5,
            color: "rgba(255,255,255,0.45)"
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={11} /> 팝업 기간 내 유효</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> 아트홀 서울 B1</span>
          </div>
        </div>

      </div>
    </NavigationShell>
  );
}

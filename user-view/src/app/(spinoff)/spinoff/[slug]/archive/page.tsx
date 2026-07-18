"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, Download, Share2 } from "lucide-react";
import NavigationShell from "../../../../../components/NavigationShell";

interface SpinoffSession {
  spinoff_id: string;
  nickname: string;
  seen_main_exhibition: boolean;
  selected_keywords: string[];
  selected_scene: string | null;
  visited_scenes: Record<string, number>;
  chat_history: Array<{ sender: string; text: string }>;
}

export default function SpinoffArchivePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string || "abyss-wave";

  const [session, setSession] = useState<SpinoffSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("afterglow_spinoff_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setSession(parsed);
        }, 0);
      }
    } catch {
      //
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  }, []);

  const handleShare = () => {
    alert("아카이브 이미지 링크가 클립보드에 복사되었습니다!");
  };

  const handleGoods = () => {
    alert("🛍️ [마플 굿즈 연계 안내]\n나만의 개인화 아카이브 이미지와 감정 텍스트가 새겨진 커스텀 인센스 홀더 및 포토카드를 마플에서 예약 주문하실 수 있도록 외부 페이지로 이동합니다.");
  };

  // 홈으로 복귀 시 스핀오프 완료 상태를 계정 초대장에 연동
  const handleGoHome = () => {
    try {
      // 초대장 보관함 갱신을 위해 localStorage에 상태 기록
      const account = localStorage.getItem("afterglow_last_report");
      const parsed = account ? JSON.parse(account) : {};
      parsed.invite = {
        conceptName: "어비스 티 라운지",
        personalizedCopy: "당신만을 위한 스핀오프 아카이브가 발급되었습니다. 차분한 찻잎 블렌딩이 준비되어 있습니다.",
        redeemed: true, // 사용 완료 상태로 전이
        issued_at: Date.now()
      };
      localStorage.setItem("afterglow_last_report", JSON.stringify(parsed));
    } catch {
      //
    }
    router.push("/home");
  };

  if (loading) {
    return (
      <div className="screen justify-center items-center" style={{ background: "#0D0D0F", color: "#FAFAF9" }}>
        <p className="t-body" style={{ color: "#4FD8EB" }}>
          <Sparkles className="spin" size={24} style={{ margin: "0 auto 12px" }} />
          감정의 조각들을 연결하여 아카이브 카드를 인화하고 있어요...
        </p>
      </div>
    );
  }

  const seenMain = session?.seen_main_exhibition === true;
  const userKeywords = session?.selected_keywords || [];
  const keywordTitle = userKeywords.length > 0 ? userKeywords.join("한 ") : "고요하고 압도적인";

  return (
    <NavigationShell title="아카이브 발급" showBack={true} onBack={() => router.push(`/spinoff/${slug}/viewer`)}>
      <div style={{
        flex: 1,
        padding: "var(--space-6) var(--space-5) 100px",
        display: "flex",
        flexDirection: "column",
        background: "#0D0D0F",
        color: "#FAFAF9",
        minHeight: "calc(100vh - 60px)",
        overflowY: "auto"
      }}>
        
        {/* 아카이브 카드 영역 */}
        <div style={{
          background: "linear-gradient(135deg, #0A1628 0%, #160D1E 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          border: "1.5px solid rgba(79, 216, 235, 0.3)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
          position: "relative",
          overflow: "hidden",
          marginBottom: 20
        }}>
          <div style={{
            position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,216,235,0.15) 0%, transparent 70%)"
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
            <Sparkles size={13} color="#4FD8EB" />
            <span style={{ fontSize: 9.5, letterSpacing: "0.15em", color: "#4FD8EB", fontWeight: 700 }}>
              MY AFTERGLOW ARCHIVE
            </span>
          </div>

          <h2 className="t-serif" style={{ fontSize: 22, color: "#FFFFFF", marginBottom: 14, lineHeight: 1.3 }}>
            당신의 심해는<br />
            <span style={{ color: "#4FD8EB" }}>&apos;{keywordTitle} 여운&apos;</span>이었어요.
          </h2>

          {/* 장면 모자이크 목업 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 6,
            height: 120,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 16
          }}>
            <div style={{ background: "linear-gradient(135deg, #1D3A5F, #0D1B2A)" }} />
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 6 }}>
              <div style={{ background: "linear-gradient(135deg, #3B2A4F, #1F1633)" }} />
              <div style={{ background: "linear-gradient(135deg, #10294A, #2A5A80)" }} />
            </div>
          </div>

          {/* 대화 인용구 */}
          <div style={{
            borderLeft: "2px solid #4FD8EB",
            paddingLeft: 12,
            fontSize: 12.5,
            color: "var(--ink-faint)",
            lineHeight: 1.6,
            fontStyle: "italic",
            background: "rgba(255,255,255,0.02)",
            padding: "8px 12px 8px 12px"
          }}>
            &ldquo;빛이 가라앉는 게 아니라, 어둠이 떠오르는 거군요&rdquo;<br />
            <span style={{ fontSize: 10.5, color: "var(--ink-muted)", fontStyle: "normal" }}>
              — 당신과 안내자의 대화 중에서 발췌
            </span>
          </div>
        </div>

        {/* 기본 액션 버튼들 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button className="btn btn-outline" style={{ flex: 1, gap: 6, borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", fontSize: 13.5 }} onClick={handleShare}>
            <Share2 size={14} /> 아카이브 공유
          </button>
          
          <button className="btn btn-outline" style={{ flex: 1, gap: 6, borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", fontSize: 13.5 }} onClick={handleGoods}>
            <Download size={14} /> 굿즈 제작 신청
          </button>
        </div>

        {/* 조건부 본전시 유도 CTA 버튼 (본전시를 보지 않은 경우에만 노출) */}
        {!seenMain && (
          <div className="anim-up" style={{
            background: "rgba(139, 46, 74, 0.08)",
            border: "1.5px solid rgba(139, 46, 74, 0.4)",
            borderRadius: "var(--radius-xl)",
            padding: "20px 18px",
            marginBottom: 24,
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#FFFFFF", marginBottom: 6 }}>
              원작 미디어아트 전시가 궁금하신가요?
            </h3>
            <p style={{ fontSize: 11.5, color: "var(--ink-faint)", lineHeight: 1.5, marginBottom: 16 }}>
              스핀오프 세계관의 뿌리가 된 본전시 《빛의 심연》을 통해<br />
              한 층 더 선명한 예술적 몰입을 경험해 보세요.
            </p>
            
            <button
              onClick={() => router.push("/exhibition/abyss")}
              className="btn btn-primary btn-full"
              style={{
                background: "#8B2E4A",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 14,
                borderRadius: 10,
                boxShadow: "0 4px 15px rgba(139, 46, 74, 0.3)"
              }}
            >
              본전시 〈심해의 환상〉 보러가기 ↗
            </button>
          </div>
        )}

        {/* 여정 종료 버튼 */}
        <button
          onClick={handleGoHome}
          className="btn btn-primary btn-full btn-lg"
          style={{
            background: "transparent",
            border: "1.5px solid #4FD8EB",
            color: "#4FD8EB",
            fontWeight: 800,
            borderRadius: "var(--radius-md)"
          }}
        >
          여정 완료하고 홈으로 가기
        </button>

      </div>
    </NavigationShell>
  );
}

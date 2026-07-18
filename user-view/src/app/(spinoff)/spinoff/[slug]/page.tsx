"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import NavigationShell from "../../../../components/NavigationShell";

export default function SpinoffPosterPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string || "abyss-wave";

  // 가상의 전시 정보 매핑
  const exhibitionTitle = "심해의 환상 : 두 번째 물결";
  const exhibitionSub = "전시가 끝난 곳에서, 이야기는 이어집니다.\n당신이 미처 만나지 못한 심해의 네 장면.";

  return (
    <NavigationShell title="포스터 보기" showBack={true} onBack={() => router.push("/spinoff/home")}>
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "var(--space-6) var(--space-5) 80px",
        background: "linear-gradient(180deg, rgba(10,22,40,0.4) 0%, #0a1628 100%), radial-gradient(ellipse 160% 70% at 50% 110%, #1d3a5f 0%, #060d16 100%)",
        color: "#FAFAF9",
        minHeight: "calc(100vh - 60px)",
        position: "relative"
      }}>
        
        {/* 포스터 내 비주얼 데코레이션 */}
        <div style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          right: "10%",
          height: "30vh",
          borderRadius: "var(--radius-xl)",
          background: "radial-gradient(circle at center, rgba(79, 216, 235, 0.18) 0%, transparent 60%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none"
        }}>
          <div style={{
            fontSize: 80,
            opacity: 0.15,
            animation: "pulse 6s infinite ease-in-out",
            color: "#4FD8EB"
          }}>
            ✦
          </div>
        </div>

        {/* 메인 텍스트 컨텐츠 */}
        <div className="anim-up" style={{ zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <Sparkles size={13} color="#4FD8EB" />
            <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "#4FD8EB", fontWeight: 700 }}>
              SPIN-OFF ARTWORK
            </span>
          </div>

          <h2 className="t-serif" style={{ 
            fontSize: 28, 
            lineHeight: 1.3, 
            fontWeight: 800, 
            color: "#FFFFFF", 
            marginBottom: 10 
          }}>
            {exhibitionTitle}
          </h2>

          <p className="t-body" style={{ 
            fontSize: 13.5, 
            color: "var(--ink-faint)", 
            lineHeight: 1.6, 
            marginBottom: 24,
            whiteSpace: "pre-line"
          }}>
            {exhibitionSub}
          </p>

          {/* 입장하기 버튼 */}
          <button
            onClick={() => router.push(`/spinoff/${slug}/onboarding`)}
            className="btn btn-primary btn-full btn-lg"
            style={{ 
              background: "#4FD8EB", 
              color: "#062028", 
              fontWeight: 800,
              boxShadow: "0 0 15px rgba(79, 216, 235, 0.4)",
              borderRadius: "var(--radius-full)"
            }}
          >
            입장하기
            <ArrowRight size={16} />
          </button>

          {/* 출처 및 원작 설명 */}
          <div style={{ 
            marginTop: 20, 
            paddingTop: 16, 
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: 11,
            color: "var(--ink-muted)",
            lineHeight: 1.45
          }}>
            <p>원작 전시 · 심해의 환상 (2026.5–7)</p>
            <p style={{ marginTop: 2 }}>본전시를 관람하지 않았어도 자유롭게 입장하여 감상할 수 있습니다.</p>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.1; transform: scale(0.95); }
            50% { opacity: 0.22; transform: scale(1.05); }
          }
        `}</style>

      </div>
    </NavigationShell>
  );
}

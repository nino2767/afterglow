"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, Calendar, MapPin, Ticket, Heart } from "lucide-react";
import NavigationShell from "../../../../components/NavigationShell";

export default function MainExhibitionPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string || "abyss";

  return (
    <NavigationShell title="전시 정보" showBack={true}>
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0D0D0F",
        color: "#FAFAF9",
        minHeight: "calc(100vh - 60px)"
      }}>
        
        {/* 상단 포스터 배너 */}
        <div style={{
          height: "220px",
          background: "linear-gradient(180deg, transparent 50%, #0D0D0F 100%), radial-gradient(circle, rgba(139,46,74,0.45) 0%, #1c0e11 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "var(--space-5)"
        }}>
          <span style={{ 
            fontSize: 10, 
            background: "rgba(139,46,74,0.2)", 
            color: "#E87B7B", 
            border: "1px solid rgba(139,46,74,0.4)", 
            padding: "2px 8px", 
            borderRadius: 6,
            alignSelf: "flex-start",
            fontWeight: 700,
            marginBottom: 10
          }}>
            NOW SHOWING
          </span>
          <h1 className="t-serif" style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", marginBottom: 2, lineHeight: 1.2 }}>
            빛의 심연
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-faint)", fontFamily: "var(--font-mono)" }}>
            Abyss of Light
          </p>
        </div>

        {/* 세부 본문 정보 */}
        <div style={{ padding: "var(--space-4) var(--space-5) 100px", display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* 전시 기본 메타 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
              <Calendar size={15} color="#E87B7B" />
              <span><b>전시 기간:</b> 2026.05.01 - 2026.08.31 (상시 운영)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
              <MapPin size={15} color="#E87B7B" />
              <span><b>장소 안내:</b> 아트홀 서울 지하 1층 특별 전시관</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
              <Ticket size={15} color="#E87B7B" />
              <span><b>관람 가격:</b> 일반 15,000원 (AI 가이드 패키지 포함)</span>
            </div>
          </div>

          {/* 전시 상세 설명 */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
              <Sparkles size={13} color="#E87B7B" /> 전시 소개
            </h4>
            <p className="t-body" style={{ fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.65 }}>
              《빛의 심연》은 인간의 심연 속에 자리한 고독과 정적을 푸른 빛무리와 앰비언트 아날로그 사운드로 번역해 낸 현대 미디어아트 전시입니다. 
              시시각각 변하는 사운드 파동과 광원의 수축/팽창에 호흡을 맞추며, 바쁜 일상에서 벗어나 깊은 안식의 기회를 마주해 보세요.
            </p>
          </div>

          {/* 작가진 안내 */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 8 }}>참여 작가</h4>
            <p style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
              김하늘 (윤슬) · 이태양 (심연의 호흡) · 박은하 (기억의 잔광)
            </p>
          </div>

        </div>

        {/* 하단 고정 예매 버튼 바 */}
        <div style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "430px",
          padding: "16px 20px calc(16px + var(--safe-bottom))",
          background: "linear-gradient(to top, #0D0D0F 80%, transparent)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: 10,
          zIndex: 50
        }}>
          <button 
            onClick={() => alert("관심 전시에 등록되었습니다.")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Heart size={20} color="#E87B7B" />
          </button>
          
          <button
            onClick={() => router.push(`/exhibition/${slug}/booking`)}
            className="btn btn-primary"
            style={{ 
              flex: 1, 
              background: "#8B2E4A", 
              color: "#FFFFFF", 
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(139, 46, 74, 0.4)"
            }}
          >
            본전시 예매하기 (결제)
          </button>
        </div>

      </div>
    </NavigationShell>
  );
}

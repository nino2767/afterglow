"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Compass, Sparkles, ArrowRight } from "lucide-react";
import NavigationShell from "../../../../components/NavigationShell";

export default function SpinoffHomePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("관람객");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("afterglow_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        const name = parsed.nickname || "관람객";
        setTimeout(() => {
          setNickname(name);
        }, 0);
      }
    } catch {
      //
    }
  }, []);

  return (
    <NavigationShell title="AFTERGLOW" showBack={false}>
      <div style={{
        flex: 1,
        padding: "var(--space-6) var(--space-5) 80px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        background: "#0D0D0F",
        color: "#FAFAF9",
        minHeight: "calc(100vh - 60px)",
        overflowY: "auto"
      }}>
        
        {/* 히어로 환영 헤더 */}
        <div className="anim-up" style={{ marginTop: "var(--space-4)", marginBottom: "var(--space-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Sparkles size={14} color="#4FD8EB" />
            <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4FD8EB", fontWeight: 700 }}>
              SPIN-OFF SHOWCASE
            </span>
          </div>
          <h2 className="t-heading" style={{ fontSize: 24, lineHeight: 1.3, margin: 0, color: "#FFFFFF" }}>
            안녕하세요,<br />
            <span style={{ color: "#4FD8EB", fontFamily: "var(--font-display)", fontWeight: "bold" }}>
              {nickname}님
            </span> ✦
          </h2>
          <p className="t-caption" style={{ marginTop: 8, color: "var(--ink-faint)", lineHeight: 1.5 }}>
            전시가 끝난 자리에서 펼쳐지는 두 번째 예술 세계,<br />
            AFTERGLOW 스핀오프 전시에 오신 것을 환영합니다.
          </p>
        </div>

        {/* 상영 중인 전시 타이틀 */}
        <div>
          <p className="t-micro" style={{ color: "#8A8A8A", marginBottom: 12 }}>현재 상영 중인 스핀오프</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 카드 1: 심해의 환상 */}
            <div 
              onClick={() => router.push("/spinoff/abyss-wave")}
              style={{
                borderRadius: "var(--radius-xl)",
                padding: "24px 20px",
                background: "linear-gradient(135deg, #0D1B2A 0%, #0A0A0F 100%)",
                border: "1.5px solid rgba(79, 216, 235, 0.25)",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.2s, border-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "rgba(79, 216, 235, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "rgba(79, 216, 235, 0.25)";
              }}
            >
              {/* 장식용 글로우 */}
              <div style={{
                position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(79,216,235,0.2) 0%, transparent 70%)",
                pointerEvents: "none"
              }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ 
                  fontSize: 10, 
                  background: "rgba(79,216,235,0.12)", 
                  color: "#4FD8EB", 
                  border: "1px solid rgba(79,216,235,0.3)", 
                  padding: "2px 8px", 
                  borderRadius: 20,
                  fontWeight: 700
                }}>
                  DEMO 상설 전시
                </span>
              </div>

              <h3 className="t-title" style={{ color: "#FFFFFF", fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "var(--font-display)" }}>
                심해의 환상 : 두 번째 물결
              </h3>
              
              <p style={{ fontSize: 12, color: "var(--ink-faint)", lineHeight: 1.5, marginBottom: 16 }}>
                본전시 〈심해의 환상〉의 깊은 무의식 세계관을 공유하는 디지털 스핀오프. 
                내가 고른 감정에 따라 빛의 스펙트럼이 반응합니다.
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: 12 }}>
                <span style={{ fontSize: 12.5, color: "#4FD8EB", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                  입장하기 <ArrowRight size={14} />
                </span>
              </div>
            </div>

            {/* 카드 2: 가상 커밍순 */}
            <div style={{
              borderRadius: "var(--radius-xl)",
              padding: "24px 20px",
              background: "#16161A",
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              textAlign: "center",
              opacity: 0.6
            }}>
              <Compass size={24} color="#8A8A8A" style={{ margin: "0 auto 12px" }} />
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 4 }}>
                Coming Soon
              </h4>
              <p style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                새로운 스핀오프 세계관 전시가 준비 중입니다.<br />
                다음 여정을 기대해 주세요.
              </p>
            </div>
          </div>
        </div>

        {/* B2B 제안 문의 하단 배너 */}
        <div style={{
          marginTop: "auto",
          padding: 14,
          borderRadius: "var(--radius-md)",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          textAlign: "center"
        }}>
          <p style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>
            전시 기획 및 스핀오프 제안을 원하시나요? <br />
            <a 
              href="mailto:partner@afterglow.co.kr" 
              style={{ color: "#4FD8EB", textDecoration: "underline", fontWeight: 600, marginLeft: 4 }}
            >
              제안/문의 메일 보내기 ↗
            </a>
          </p>
        </div>

      </div>
    </NavigationShell>
  );
}

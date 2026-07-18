"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, FolderHeart, Compass } from "lucide-react";
import NavigationShell from "../../../../../components/NavigationShell";

export default function ExhibitionCompletedPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("관람객");
  const [ticketCode, setTicketCode] = useState("");

  useEffect(() => {
    // 초대권 가상 코드 생성
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = `SP-TEA-${rand}`;

    let activeNickname = "관람객";
    try {
      const savedSession = localStorage.getItem("afterglow_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        activeNickname = parsed.nickname || "관람객";
      }
    } catch {
      //
    }

    setTimeout(() => {
      setTicketCode(code);
      setNickname(activeNickname);
    }, 0);

    try {
      // 여운 리포트 발급 정보 및 스핀오프 활성 초대장을 localStorage에 주입
      const reportData = {
        name: "빛의 심연",
        personaTitle: "고요함을 머금은 감성 탐구자",
        bgGradient: "linear-gradient(135deg, #1A1625 0%, #0C1220 100%)",
        completed_at: Date.now(),
        invite: {
          conceptName: "어비스 티 라운지",
          personalizedCopy: "전시가 끝난 곳에서, 이야기는 이어집니다. 당신이 미처 만나지 못한 심해의 네 장면.",
          redeemed: false,
          issued_at: Date.now(),
          ticket_code: code
        }
      };
      localStorage.setItem("afterglow_last_report", JSON.stringify(reportData));
    } catch {
      //
    }
  }, []);

  return (
    <NavigationShell title="관람 완료" showBack={false}>
      <div style={{
        flex: 1,
        padding: "var(--space-6) var(--space-5) 100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "var(--bg)",
        color: "var(--ink)",
        minHeight: "calc(100vh - 60px)",
        overflowY: "auto",
        textAlign: "center"
      }}>
        
        {/* 장식용 글로우 아이콘 */}
        <div style={{
          width: 50, height: 50, borderRadius: "50%", background: "rgba(79, 216, 235, 0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
          boxShadow: "0 0 15px rgba(79, 216, 235, 0.2)"
        }}>
          <Sparkles size={24} color="#4FD8EB" />
        </div>

        <h2 className="t-serif" style={{ fontSize: 21, color: "#FFFFFF", marginBottom: 8, fontWeight: 700 }}>
          {nickname}님, 관람이 완료되었습니다.
        </h2>
        <p style={{ fontSize: 12.5, color: "var(--ink-muted)", lineHeight: 1.5, marginBottom: 24 }}>
          전시장 문을 나선 뒤에도 깊은 울림은 가라앉지 않습니다.<br />
          마음속에 새겨진 단서로 빚어낸 스핀오프 특별 초대장이 도착했습니다.
        </p>

        {/* 스핀오프 특별 초대장 카드 */}
        <div className="anim-up" style={{
          width: "100%",
          background: "linear-gradient(135deg, #091724 0%, #160D20 100%)",
          border: "2px solid #4FD8EB",
          borderRadius: 16,
          padding: "24px 20px",
          boxShadow: "0 10px 40px rgba(79, 216, 235, 0.2)",
          marginBottom: 30,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* 빛 바코드 장식 */}
          <div style={{
            position: "absolute", top: 12, right: 16, fontSize: 9.5,
            color: "#4FD8EB", fontWeight: 700, letterSpacing: "0.1em"
          }}>
            SPINOFF TICKET ✦
          </div>

          <div style={{ textAlign: "left", marginBottom: 14 }}>
            <span style={{ fontSize: 9.5, color: "#4FD8EB", background: "rgba(79, 216, 235, 0.15)", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
              초대 전용 관람권
            </span>
            <h3 style={{ fontSize: 18, color: "#FFFFFF", fontWeight: 800, marginTop: 8, marginBottom: 4 }}>
              어비스 티 라운지 (Abyss Tea Lounge)
            </h3>
            <p style={{ fontSize: 11.5, color: "var(--ink-faint)", lineHeight: 1.45 }}>
              &ldquo;전시가 끝난 곳에서, 이야기는 이어집니다. 당신이 미처 만나지 못한 심해의 네 장면.&rdquo;
            </p>
          </div>

          {/* 세부 내역 */}
          <div style={{
            borderTop: "1.5px dashed rgba(79, 216, 235, 0.3)",
            paddingTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            textAlign: "left",
            fontSize: 12,
            marginBottom: 16
          }}>
            <div>
              <span style={{ color: "var(--ink-muted)", display: "block", marginBottom: 2 }}>초대 대상</span>
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>{nickname}님</span>
            </div>
            <div>
              <span style={{ color: "var(--ink-muted)", display: "block", marginBottom: 2 }}>초대권 코드</span>
              <span className="t-mono" style={{ color: "#4FD8EB", fontWeight: 600 }}>{ticketCode}</span>
            </div>
          </div>

          {/* 초대권 바코드 */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "8px 12px",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div style={{
              width: "80%", height: 28,
              backgroundImage: "repeating-linear-gradient(90deg, #4FD8EB, #4FD8EB 2px, transparent 2px, transparent 6px, #4FD8EB 6px, #4FD8EB 9px, transparent 9px, transparent 11px)",
              opacity: 0.8
            }} />
          </div>

        </div>

        {/* 액션 버튼 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <button
            onClick={() => router.push("/spinoff/abyss-wave")}
            className="btn btn-primary btn-full btn-lg"
            style={{
              background: "#4FD8EB", color: "#062028", fontWeight: 800,
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 15px rgba(79, 216, 235, 0.3)"
            }}
          >
            <Compass size={16} /> 스핀오프 전시 보러가기 ↗
          </button>
          
          <button
            onClick={() => router.push("/my-reports")}
            className="btn btn-outline btn-full btn-lg"
            style={{
              borderColor: "var(--border)", color: "#FFFFFF", fontWeight: 600,
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            <FolderHeart size={16} /> 내 여운 보관함 확인하기
          </button>
        </div>

      </div>
    </NavigationShell>
  );
}

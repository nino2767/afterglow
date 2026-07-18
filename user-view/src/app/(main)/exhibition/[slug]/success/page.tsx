"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Home, ListMusic } from "lucide-react";
import NavigationShell from "../../../../../components/NavigationShell";

interface BookingDetail {
  name: string;
  email: string;
  phone: string;
  ticketCount: number;
  paymentMethod: string;
  totalPrice: number;
  bookedAt: number;
}

export default function BookingSuccessPage() {
  const router = useRouter();

  const [ticketNo, setTicketNo] = useState("");
  const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);

  useEffect(() => {
    // 가상 티켓 번호 생성
    const rand = Math.floor(100000 + Math.random() * 900000);
    const code = `AG-20260717-${rand}`;

    try {
      const saved = localStorage.getItem("afterglow_last_booking");
      const parsed = saved ? JSON.parse(saved) : null;
      
      setTimeout(() => {
        setTicketNo(code);
        if (parsed) {
          setBookingDetail(parsed);
        }
      }, 0);

      if (parsed) {
        // 1. 본전시 관람 세션 생성 및 localStorage 기록 (활성 티켓 소지자로 인식시키기 위함)
        const mockSession = {
          visitor_id: `v_${Date.now()}`,
          session_id: `s_${Date.now()}`,
          nickname: parsed.name || "동도 파트너",
          initial_keywords: [
            { emotion: "고요함", axis: "serene" },
            { emotion: "몽환적인", axis: "dreamy" }
          ],
          dwells: {},
          emotionTags: {},
          chatEmotions: {},
          chatCount: 0
        };
        localStorage.setItem("afterglow_session", JSON.stringify(mockSession));

        // 2. 가상 계정 정보도 세팅하여 정식 사용자 전환 매핑 보장
        const mockAccount = {
          nickname: parsed.name || "동도 파트너",
          email: parsed.email || "partner@afterglow.co.kr",
          marketing_consent: true
        };
        localStorage.setItem("afterglow_account", JSON.stringify(mockAccount));
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <NavigationShell title="예매 완료" showBack={false}>
      <div style={{
        flex: 1,
        padding: "var(--space-8) var(--space-5) 100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "var(--bg)",
        color: "var(--ink)",
        minHeight: "calc(100vh - 60px)",
        overflowY: "auto",
        textAlign: "center"
      }}>
        
        {/* 체크 마크 */}
        <div style={{
          width: 60, height: 60, borderRadius: "50%", background: "rgba(139, 46, 74, 0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
        }}>
          <CheckCircle size={36} color="var(--accent)" />
        </div>

        <h2 className="t-serif" style={{ fontSize: 22, color: "#FFFFFF", marginBottom: 8, fontWeight: 700 }}>
          예매가 완료되었습니다!
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.5, marginBottom: 30 }}>
          가상 결제가 성공적으로 이루어졌으며,<br />
          모바일 입장 티켓이 정상적으로 발급되었습니다.
        </p>

        {/* 가상 티켓 바코드 카드 */}
        <div style={{
          width: "100%",
          background: "linear-gradient(135deg, #1A121A 0%, #0F0F12 100%)",
          border: "1.5px solid var(--accent)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          marginBottom: 35,
          position: "relative",
          overflow: "hidden"
        }}>
          {/* 장식용 원 */}
          <div style={{ position: "absolute", top: -20, left: -20, width: 60, height: 60, borderRadius: "50%", background: "rgba(139, 46, 74, 0.05)" }} />

          <div style={{ textAlign: "left", marginBottom: 16 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--accent)", fontWeight: 700 }}>
              AFTERGLOW PASS
            </span>
            <h3 style={{ fontSize: 16.5, fontWeight: 700, color: "#FFFFFF", marginTop: 4 }}>
              본전시 《빛의 심연》 티켓
            </h3>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left",
            fontSize: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginBottom: 20
          }}>
            <div>
              <span style={{ color: "var(--ink-muted)", display: "block", marginBottom: 2 }}>예약자</span>
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>{bookingDetail?.name || "동도 파트너"}</span>
            </div>
            <div>
              <span style={{ color: "var(--ink-muted)", display: "block", marginBottom: 2 }}>매수</span>
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>{bookingDetail?.ticketCount || 1}매</span>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <span style={{ color: "var(--ink-muted)", display: "block", marginBottom: 2 }}>티켓 번호</span>
              <span className="t-mono" style={{ color: "var(--accent-light)", fontWeight: 600 }}>{ticketNo}</span>
            </div>
          </div>

          {/* 가상 바코드 일러스트 */}
          <div style={{
            background: "#FFFFFF",
            padding: "12px 16px",
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4
          }}>
            {/* 가상 바코드 라인들 */}
            <div style={{
              width: "100%", height: 35,
              backgroundImage: "repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 8px, #000 8px, #000 11px, #fff 11px, #fff 14px)",
              backgroundSize: "80% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }} />
            <span className="t-mono" style={{ fontSize: 10, color: "#555", letterSpacing: "0.2em" }}>
              {ticketNo.split("-")[2]}
            </span>
          </div>

        </div>

        {/* 액션 버튼 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <button
            onClick={() => router.push("/artwork")}
            className="btn btn-primary btn-full btn-lg"
            style={{
              background: "var(--accent)", color: "#FFFFFF", fontWeight: 800,
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            <ListMusic size={16} /> 본전시 작품목록 보기
          </button>
          
          <button
            onClick={() => router.push("/home")}
            className="btn btn-outline btn-full btn-lg"
            style={{
              borderColor: "var(--border)", color: "#FFFFFF", fontWeight: 600,
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            <Home size={16} /> 메인 대시보드로 이동
          </button>
        </div>

      </div>
    </NavigationShell>
  );
}

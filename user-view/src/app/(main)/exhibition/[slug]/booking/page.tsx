"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CreditCard, Calendar, MapPin, RefreshCw } from "lucide-react";
import NavigationShell from "../../../../../components/NavigationShell";

export default function BookingPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string || "abyss";

  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [name, setName] = useState("동도 파트너");
  const [email, setEmail] = useState("partner@afterglow.co.kr");
  const [phone, setPhone] = useState("010-1234-5678");
  const [loading, setLoading] = useState(false);

  const pricePerTicket = 15000;
  const totalPrice = pricePerTicket * ticketCount;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 가상 결제 대기 시뮬레이션
    setTimeout(() => {
      setLoading(false);
      
      // 예약자 상세 저장
      try {
        const bookingDetail = {
          name,
          email,
          phone,
          ticketCount,
          paymentMethod,
          totalPrice,
          bookedAt: Date.now()
        };
        localStorage.setItem("afterglow_last_booking", JSON.stringify(bookingDetail));
      } catch {
        // ignore
      }

      router.push(`/exhibition/${slug}/success`);
    }, 1500);
  };

  return (
    <NavigationShell title="본전시 예매 및 결제" showBack={true} onBack={() => router.back()}>
      <div style={{
        flex: 1,
        padding: "var(--space-6) var(--space-5) 100px",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        color: "var(--ink)",
        minHeight: "calc(100vh - 60px)",
        overflowY: "auto"
      }}>
        
        {/* 전시 요약 */}
        <div className="card" style={{ padding: "var(--space-4)", marginBottom: 20, background: "var(--surface-2)" }}>
          <h2 className="t-title" style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", marginBottom: 10 }}>
            본전시 《빛의 심연》
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--ink-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={13} color="var(--accent)" /> 아트홀 서울 (강남구 테헤란로 123)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={13} color="var(--accent)" /> 상시 관람 가능 (화~일, 10:00 ~ 19:00)
            </span>
          </div>
        </div>

        {/* 결제 입력 폼 */}
        <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* 예약자 정보 */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 10 }}>1. 예약자 정보</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--ink-muted)" }}>
                이름
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "10px 12px", color: "#FFFFFF", fontSize: 13.5, outline: "none"
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--ink-muted)" }}>
                이메일 주소
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "10px 12px", color: "#FFFFFF", fontSize: 13.5, outline: "none"
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--ink-muted)" }}>
                연락처
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "10px 12px", color: "#FFFFFF", fontSize: 13.5, outline: "none"
                  }}
                />
              </label>
            </div>
          </div>

          {/* 티켓 매수 선택 */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 10 }}>2. 티켓 매수 선택</h3>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "var(--surface-2)", padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)"
            }}>
              <span style={{ fontSize: 13.5, color: "#FFFFFF" }}>일반 티켓 (1인)</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  type="button"
                  disabled={ticketCount <= 1}
                  onClick={() => setTicketCount(prev => prev - 1)}
                  style={{
                    width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border-strong)",
                    background: "var(--surface)", color: "#FFFFFF", cursor: "pointer", fontSize: 16
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: "#FFFFFF", minWidth: 15, textAlign: "center" }}>
                  {ticketCount}
                </span>
                <button
                  type="button"
                  disabled={ticketCount >= 5}
                  onClick={() => setTicketCount(prev => prev + 1)}
                  style={{
                    width: 28, height: 28, borderRadius: 6, border: "1px solid var(--border-strong)",
                    background: "var(--surface)", color: "#FFFFFF", cursor: "pointer", fontSize: 16
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 결제 수단 */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 10 }}>3. 결제 수단</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                style={{
                  padding: "14px 10px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  background: paymentMethod === "card" ? "rgba(139, 46, 74, 0.1)" : "var(--surface)",
                  border: paymentMethod === "card" ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                  color: paymentMethod === "card" ? "var(--accent-light)" : "var(--ink-muted)",
                  fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                <CreditCard size={15} /> 신용카드
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("kakaopay")}
                style={{
                  padding: "14px 10px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  background: paymentMethod === "kakaopay" ? "rgba(250, 225, 0, 0.08)" : "var(--surface)",
                  border: paymentMethod === "kakaopay" ? "1.5px solid #FEE500" : "1px solid var(--border)",
                  color: paymentMethod === "kakaopay" ? "#FEE500" : "var(--ink-muted)",
                  fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                💛 카카오페이
              </button>
            </div>
          </div>

          {/* 결제 금액 및 제출 */}
          <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>최종 결제 금액</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "var(--accent-light)" }}>
                {totalPrice.toLocaleString()}원
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full btn-lg"
              style={{
                background: "var(--accent)", color: "#FFFFFF", fontWeight: 800,
                borderRadius: 8, height: 50, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {loading ? (
                <>
                  <RefreshCw className="spin" size={16} /> 안전하게 가상 결제 승인 중...
                </>
              ) : (
                <>
                  {totalPrice.toLocaleString()}원 가상 결제하기
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </NavigationShell>
  );
}

"use client";

/**
 * app/(guide)/spinoff/page.tsx — S5 스핀오프 랜딩 정적 포팅 (Next.js TSX)
 * 내비게이션 셸 적용
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, CheckCircle2, Ticket, ShoppingBag, BellRing } from "lucide-react";
import NavigationShell from "../../../../components/NavigationShell";

interface Goods {
  id: string;
  name: string;
  price: string;
  concept: string;
  desc: string;
}

const SPINOFF_GOODS: Goods[] = [
  { id: "g_001", name: "AI 디자인 심해 생물 피규어", price: "30,000원", concept: "E", desc: "나의 감정 파동으로 3D 프린팅된 개인 맞춤형 피규어" },
  { id: "g_002", name: "홀로그램 스티커 세트", price: "5,000원", concept: "C", desc: "심해의 반짝임을 담은 수면 광원 스티커" },
  { id: "g_003", name: "에비스 티 세트", price: "18,000원", concept: "C", desc: "차분한 감정을 일깨우는 찻잎과 유리 머그 세트" },
  { id: "g_004", name: "사운드 LP 코스터", price: "12,000원", concept: "A", desc: "감상한 음악 파동이 물결 패턴으로 새겨진 코스터" }
];

export default function SpinoffLandingPage() {
  const router = useRouter();

  const [checkedIn, setCheckedIn] = useState(false);
  const [couponBarcode, setCouponBarcode] = useState("SPINOFF-CHECKIN");
  const [isLogged, setIsLogged] = useState(false);
  const [nickname, setNickname] = useState("관람객");

  const spinoffStatus = "ready"; // 'ready'|'planning'|'open'

  useEffect(() => {
    try {
      const saved = localStorage.getItem("afterglow_session");
      const account = localStorage.getItem("afterglow_account");
      
      setTimeout(() => {
        if (saved) {
          const parsed = JSON.parse(saved);
          setNickname(parsed.nickname || "관람객");
        }
        if (account) {
          setIsLogged(true);
        }
      }, 0);
    } catch {
      //
    }
  }, []);

  function handleSelfCheckin() {
    setCouponBarcode(`WEL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setCheckedIn(true);
    alert("도도 체크인 완료! (가상 데이터 레이어 처리)");
  }

  function handleBuyGoods(goodsName: string) {
    alert(`"${goodsName}" 구매 링크로 연결합니다. (Mock)`);
  }

  return (
    <NavigationShell title="어비스 티 라운지" showBack={true} onBack={() => router.push("/report")}>
      <div style={{ flex: 1, padding: "var(--space-6) var(--space-5) var(--space-12)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        
        {/* 히어로 웰컴 영역 */}
        <div style={{
          padding: "var(--space-8) var(--space-4)",
          background: "linear-gradient(135deg, #0D0D0F 0%, #1e1215 100%)",
          color: "#FFFFFF",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          position: "relative"
        }}>
          <p className="t-micro" style={{ color: "var(--accent-light)", marginBottom: 6 }}>SPIN-OFF POPUP</p>
          <h1 className="t-display" style={{ color: "#FFFFFF", fontSize: 24, marginBottom: "var(--space-3)", fontFamily: "var(--font-display)" }}>
            어비스 티 라운지
          </h1>
          <p className="t-caption" style={{ color: "var(--accent-light)", fontSize: 13 }}>
            {nickname}님을 위한 팝업 공간 가이드
          </p>
        </div>

        {/* 팝업 운영 정보 */}
        <div className="card" style={{ padding: "var(--space-4)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <Calendar size={16} color="var(--accent)" />
              <span className="t-caption"><strong>운영 기간:</strong> ~ 2026년 8월 31일 (전시 종료 후 D+80)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <MapPin size={16} color="var(--accent)" />
              <span className="t-caption"><strong>장소:</strong> 아트홀 서울 지하 1층 특별실</span>
            </div>
          </div>
        </div>

        {/* 굿즈 추천 */}
        <div>
          <p className="t-micro" style={{ marginBottom: "var(--space-4)" }}>스핀오프 굿즈 라인업</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {SPINOFF_GOODS.map(goods => (
              <div key={goods.id} className="card" style={{ padding: "var(--space-4)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-2)" }}>
                  <h3 className="t-title" style={{ fontSize: 15 }}>{goods.name}</h3>
                  <span className="t-mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>
                    {goods.price}
                  </span>
                </div>
                <p className="t-caption" style={{ marginBottom: "var(--space-4)" }}>{goods.desc}</p>
                <button
                  className="btn btn-outline btn-full btn-sm"
                  onClick={() => handleBuyGoods(goods.name)}
                  style={{ gap: 4 }}
                >
                  <ShoppingBag size={12} />
                  예약 및 구매하러 가기
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 셀프 체크인 / 오픈알림 영역 */}
        <div style={{
          background: checkedIn ? "var(--bg-warm)" : "var(--surface)",
          border: "1.5px solid var(--border-strong)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-5)",
          textAlign: "center",
          marginTop: "var(--space-4)"
        }}>
          {/* 오픈 알림 로그인 */}
          {(spinoffStatus === "ready" || spinoffStatus === "planning") && !isLogged ? (
            <div>
              <BellRing size={24} color="var(--accent)" style={{ margin: "0 auto 12px" }} />
              <h3 className="t-title" style={{ marginBottom: 4 }}>아직 오픈 준비 중입니다</h3>
              <p className="t-caption" style={{ marginBottom: "var(--space-5)" }}>
                이 팝업 공간은 곧 준비가 끝납니다.<br />
                알림을 신청해 두시면 오픈 소식을 알려드릴게요.
              </p>
              <button
                className="btn btn-primary btn-full"
                onClick={() => router.push("/login?trigger=spinoff_locked")}
              >
                로그인하고 알림 신청하기
              </button>
            </div>
          ) : !checkedIn ? (
            <div>
              <Ticket size={24} color="var(--accent)" style={{ margin: "0 auto 12px" }} />
              <h3 className="t-title" style={{ marginBottom: 4 }}>팝업에 도착하셨나요?</h3>
              <p className="t-caption" style={{ marginBottom: "var(--space-5)" }}>
                셀프 체크인을 하시면 웰컴 혜택<br /><strong>(현장 굿즈 5% 할인쿠폰)</strong>이 즉시 발급됩니다.
              </p>
              <button
                id="btn-self-checkin"
                className="btn btn-primary btn-full"
                onClick={handleSelfCheckin}
              >
                도착 체크인하기
              </button>
            </div>
          ) : (
            <div className="anim-fade">
              <CheckCircle2 size={24} color="var(--accent)" style={{ margin: "0 auto 12px" }} />
              <h3 className="t-title" style={{ marginBottom: 4 }}>체크인 완료 ✦</h3>
              <p className="t-caption" style={{ marginBottom: "var(--space-5)" }}>
                아래 혜택 바코드를 직원에게 보여주세요.
              </p>
              
              <div style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-mid)",
                padding: "var(--space-4) var(--space-5)",
                borderRadius: "var(--radius-sm)",
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                marginBottom: "var(--space-4)"
              }}>
                <div style={{
                  width: 180,
                  height: 48,
                  background: "repeating-linear-gradient(90deg, #111 0px, #111 2px, transparent 2px, transparent 6px, #111 6px, #111 10px, transparent 10px, transparent 14px)"
                }} />
                <span className="t-mono" style={{ fontSize: 10, letterSpacing: "0.2em" }}>
                  {couponBarcode}
                </span>
              </div>

              <button
                id="btn-start-popup-curator"
                className="btn btn-primary btn-full btn-lg"
                style={{ gap: 6 }}
                onClick={() => router.push("/popup-curator")}
              >
                팝업 큐레이터 시작하기
                <Ticket size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </NavigationShell>
  );
}

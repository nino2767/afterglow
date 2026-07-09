"use client";

/**
 * app/(guide)/popup-curator/page.tsx — S6 팝업 AI 큐레이터 정적 포팅 (Next.js TSX)
 * 내비게이션 셸 적용
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, MessageCircle, ShoppingBag, CheckCircle2, ChevronRight, X } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";

interface Zone {
  id: string;
  name: string;
  description: string;
}

const ZONES_LIST: Zone[] = [
  { id: "zone_tea", name: "심해 블렌딩 바 (Lounge)", description: "나의 감상 잔향에 맞춰 전문 바리스타가 차를 우려내는 공간" },
  { id: "zone_lounge", name: "심해 티 시음존 (Sensory)", description: "차분한 앰비언트 사운드 속에서 감정을 미각화하는 공간" }
];

interface Goods {
  id: string;
  name: string;
  price: string;
  zoneId: string;
  desc: string;
}

const POPUP_GOODS: Goods[] = [
  { id: "g_001", name: "AI 디자인 심해 생물 피규어", price: "30,000원", zoneId: "zone_tea", desc: "나의 감정 파동으로 3D 프린팅된 개인 맞춤형 피규어" },
  { id: "g_002", name: "홀로그램 스티커 세트", price: "5,000원", zoneId: "zone_lounge", desc: "심해의 반짝임을 담은 수면 광원 스티커" }
];

interface ChatMsg {
  id: string;
  sender: "ai" | "user";
  text: string;
}

export default function PopupCuratorPage() {
  const router = useRouter();

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatIsTyping, setChatIsTyping] = useState(false);
  const [miniReportOpen, setMiniReportOpen] = useState(false);
  const [optInMarketing, setOptInMarketing] = useState(false);
  const [nickname, setNickname] = useState("관람객");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("afterglow_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setNickname(parsed.nickname || "관람객");
      }
    } catch (e) {
      //
    }
  }, []);

  function handleBuyGoods(goodsName: string) {
    alert(`"${goodsName}" 구매 링크로 연결합니다. (Mock)`);
  }

  function startChat() {
    setChatOpen(true);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: "welcome",
          sender: "ai",
          text: `${nickname}님, 본전시에서 아까 고요함 감정에 깊이 공감하셨던 흔적이 선명하네요. 이곳 팝업 라운지에서는 어떤 기분을 조금 더 채워가고 싶으신가요? 차의 맛이나 공간에 대해 궁금한 점이 있다면 무엇이든 물어보세요.`
        }
      ]);
    }
  }

  function sendChatMessage() {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    const userMsg: ChatMsg = { id: "user_" + Date.now(), sender: "user", text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatIsTyping(true);

    setTimeout(() => {
      setChatIsTyping(false);
      const fallbackText = `이곳 어비스 티 라운지는 ${nickname}님이 본전시에서 느끼셨던 그 고요함을 미각으로 온전히 번역해 낸 시그니처 찻집이랍니다. 블렌딩 바의 파란 조명 아래서 차를 한 모금 음미해 보시면, 아까 마주했던 빛의 여운이 가만히 되살아나는 것을 느낄 수 있을 거예요.`;
      setChatMessages(prev => [...prev, { id: "ai_" + Date.now(), sender: "ai", text: fallbackText }]);
    }, 1000);
  }

  function handleCompleteSpinoff() {
    if (optInMarketing) {
      try {
        const account = localStorage.getItem("afterglow_account");
        if (account) {
          const parsed = JSON.parse(account);
          parsed.marketing_consent = true;
          localStorage.setItem("afterglow_account", JSON.stringify(parsed));
        }
      } catch (e) {
        //
      }
    }
    // 여정 완료 후 메인 홈(S10)으로 강제 전환
    router.push("/home");
  }

  return (
    <NavigationShell title="어비스 티 라운지 가이드" showBack={true} onBack={() => router.push("/spinoff/landing")}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
        
        {/* ── 스크롤 본문 ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-5) var(--space-6)" }}>
          
          {/* 개인화 웰컴 카드 */}
          <div style={{
            background: "var(--accent-dim)",
            border: "1.5px solid var(--accent-mid)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-5)",
            marginBottom: "var(--space-6)",
            position: "relative"
          }}>
            <Sparkles size={18} color="var(--accent)" style={{ position: "absolute", top: 16, right: 16 }} />
            <h3 className="t-title" style={{ color: "var(--accent)", marginBottom: "var(--space-2)" }}>
              {nickname}님의 전시 기억
            </h3>
            <p className="t-body" style={{ fontSize: 13.5, lineHeight: 1.65 }}>
              본전시에서 <strong>고요함</strong> 감정을 가장 선명히 남겨주셨어요.
              총 3번의 감정 조각이 오늘 피워낸 팝업을 안내해 드릴게요.
            </p>
          </div>

          {/* 팝업 존 맵 리스트 */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <p className="t-micro" style={{ marginBottom: "var(--space-4)" }}>라운지 공간 둘러보기</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {ZONES_LIST.map(zone => {
                const isRecommended = zone.id === "zone_tea";

                return (
                  <button
                    key={zone.id}
                    className="card"
                    onClick={() => setSelectedZone(zone)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--space-4)",
                      width: "100%",
                      textAlign: "left",
                      background: selectedZone?.id === zone.id ? "var(--surface-2)" : "var(--surface)",
                      border: selectedZone?.id === zone.id ? "1px solid var(--ink)" : "1px solid var(--border)",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span className="t-title" style={{ fontSize: 15 }}>{zone.name}</span>
                        {isRecommended && (
                          <span className="badge badge-accent" style={{ fontSize: 10 }}>취향 추천 ✦</span>
                        )}
                      </div>
                      <p className="t-caption" style={{ fontSize: 12.5 }}>{zone.description}</p>
                    </div>
                    <ChevronRight size={16} color="var(--ink-muted)" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 존 상세 정보 */}
          {selectedZone && (
            <div className="anim-up" style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border-mid)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              marginBottom: "var(--space-6)"
            }}>
              <h4 className="t-title" style={{ marginBottom: 4 }}>{selectedZone.name} 해설</h4>
              <p className="t-body" style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--ink-2)", marginBottom: "var(--space-4)" }}>
                아까 본전시에서 {nickname}님이 응시하셨던 빛의 스펙트럼 기억하시죠? 그 잔상을 
                이곳 {selectedZone.name}에 시각적 향 camp와 티 블렌딩으로 연장하여 담아냈습니다.
              </p>

              {/* 연계 굿즈 추천 */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
                <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>연계 굿즈 추천</p>
                {POPUP_GOODS.filter(g => g.zoneId === selectedZone.id).map(goods => (
                  <div key={goods.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--surface-2)",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "var(--space-2)"
                  }}>
                    <div>
                      <p className="t-title" style={{ fontSize: 13.5, marginBottom: 2 }}>{goods.name}</p>
                      <p className="t-caption" style={{ fontSize: 11 }}>{goods.desc}</p>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleBuyGoods(goods.name)}
                      style={{ gap: 4, padding: "6px 12px", fontSize: 11.5 }}
                    >
                      <ShoppingBag size={12} />
                      {goods.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI 채팅 */}
          {!chatOpen ? (
            <button
              className="btn btn-outline btn-full"
              onClick={startChat}
              style={{ gap: 6, marginBottom: "var(--space-8)" }}
            >
              <MessageCircle size={16} />
              팝업 큐레이터와 대화하기
            </button>
          ) : (
            <div className="anim-up" style={{
              border: "1px solid var(--border-mid)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              marginBottom: "var(--space-8)",
              background: "var(--surface)"
            }}>
              <div style={{
                background: "var(--surface-2)",
                padding: "10px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span className="t-micro">큐레이터 대화</span>
                <button className="btn btn-ghost" onClick={() => setChatOpen(false)} style={{ padding: 4 }}>
                  <X size={16} />
                </button>
              </div>
              
              <div style={{ height: 160, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
                {chatMessages.map((m, idx) => (
                  <div key={idx} style={{
                    alignSelf: m.sender === "ai" ? "flex-start" : "flex-end",
                    background: m.sender === "ai" ? "var(--bg-warm)" : "var(--accent)",
                    color: m.sender === "ai" ? "var(--ink)" : "#FFFFFF",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    fontSize: 12.5,
                    maxWidth: "85%",
                    lineHeight: 1.5
                  }}>
                    {m.text}
                  </div>
                ))}
                {chatIsTyping && (
                  <div style={{ alignSelf: "flex-start", background: "var(--bg-warm)", padding: "8px 12px", borderRadius: "10px", display: "flex", gap: 4 }}>
                    <span className="dot-blink" style={{ width: 4, height: 4, background: "var(--ink-muted)", borderRadius: "50%" }} />
                    <span className="dot-blink" style={{ width: 4, height: 4, background: "var(--ink-muted)", borderRadius: "50%", animationDelay: "0.2s" }} />
                    <span className="dot-blink" style={{ width: 4, height: 4, background: "var(--ink-muted)", borderRadius: "50%", animationDelay: "0.4s" }} />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", padding: 8, borderTop: "1px solid var(--border)" }}>
                <input
                  type="text"
                  placeholder="질문하기..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendChatMessage(); }}
                  style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "6px 12px", fontSize: 13 }}
                />
                <button className="btn btn-primary btn-sm" onClick={sendChatMessage} disabled={chatIsTyping}>
                  전송
                </button>
              </div>
            </div>
          )}

        </div>

        <footer style={{
          padding: "var(--space-3) var(--space-5)",
          paddingBottom: "calc(var(--space-4) + var(--safe-bottom))",
          background: "linear-gradient(to top, var(--bg) 70%, transparent)",
          zIndex: 40,
          borderTop: "1px solid var(--border)"
        }}>
          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={() => setMiniReportOpen(true)}
          >
            오늘의 여운 마무리하기
          </button>
        </footer>

        {/* 미니 리포트 모달 */}
        {miniReportOpen && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 10, 10, 0.45)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-6)"
          }}>
            <div className="anim-scale" style={{
              background: "var(--bg)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-6)",
              width: "100%",
              maxWidth: 360,
              boxShadow: "var(--shadow-lg)",
              border: "1.5px solid var(--border-strong)"
            }}>
              <div style={{ textAlign: "center", marginBottom: "var(--space-5)" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", background: "var(--accent-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px"
                }}>
                  <CheckCircle2 size={24} color="var(--accent)" />
                </div>
                <h2 className="t-heading" style={{ fontSize: 20 }}>전시 여정 완료 ✦</h2>
                <p className="t-caption" style={{ marginTop: 4 }}>오늘의 소중한 감정을 기억할게요</p>
              </div>

              <div style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-4)",
                border: "1px solid var(--border-mid)",
                marginBottom: "var(--space-5)",
                textAlign: "center"
              }}>
                <p className="t-micro" style={{ marginBottom: 4 }}>{nickname}님의 전시 페르소나</p>
                <h4 className="t-title" style={{ color: "var(--accent)", fontSize: 16, marginBottom: 8 }}>
                  고요함을 머금은 감성 탐구자
                </h4>
                <p className="t-caption" style={{ lineHeight: 1.5 }}>
                  물감 같은 심연의 빛 아래서 3번의 감정을 태그했고,
                  가장 오랜 시간 시선을 두며 깊은 내면을 채우셨습니다.
                </p>
              </div>

              <label className="check-row" style={{ marginBottom: "var(--space-6)", cursor: "pointer", display: "flex", gap: 12 }}>
                <input
                  type="checkbox"
                  className="check-box"
                  checked={optInMarketing}
                  onChange={e => setOptInMarketing(e.target.checked)}
                />
                <div>
                  <p className="t-title" style={{ fontSize: 13.5 }}>차기 전시 및 팝업 소식 받기</p>
                  <p className="t-caption" style={{ fontSize: 11 }}>피플리 전시 공간 오픈 시 알림을 드려요</p>
                </div>
              </label>

              <button
                className="btn btn-primary btn-full"
                onClick={handleCompleteSpinoff}
              >
                닫기 및 여정 종료
              </button>
            </div>
          </div>
        )}

        <style>{`
          .dot-blink {
            animation: dotBlink 1.4s infinite both;
          }
          @keyframes dotBlink {
            0% { opacity: .2; transform: scale(0.8); }
            20% { opacity: 1; transform: scale(1); }
            100% { opacity: .2; transform: scale(0.8); }
          }
        `}</style>
      </div>
    </NavigationShell>
  );
}

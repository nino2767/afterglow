"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Sparkles, Send, ArrowRight } from "lucide-react";
import NavigationShell from "../../../../../components/NavigationShell";

export default function SpinoffRetentionPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string || "abyss-wave";
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "ai", text: "다시 오셨네요. 그날 가장 오래 머무셨던 정원에, 그 후 무슨 일이 있었는지 보여드릴까요?" },
    { sender: "user", text: "응, 궁금했어" },
    { sender: "ai", text: "당신이 떠난 뒤, 남겨진 빛들은 조금 더 깊은 곳으로 가라앉아 조용하고 따뜻한 여운의 소용돌이를 빚었습니다. 오늘은 어떤 마음의 물결을 가져오셨나요?" }
  ]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "user", text: chatInput.trim() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const aiResponseText = `오늘 남겨주신 마음 또한 이 정원에 고요히 녹아들어 다음 방문 때 새로운 잔상을 빚어낼 것입니다. 언제든 대화를 이어나가 주세요.`;
      setChatHistory(prev => [...prev, { sender: "ai", text: aiResponseText }]);
    }, 600);
  };

  return (
    <NavigationShell title="여운의 우주" showBack={true} onBack={() => router.push("/home")}>
      <div style={{
        flex: 1,
        padding: "var(--space-6) var(--space-5) 80px",
        display: "flex",
        flexDirection: "column",
        background: "#0D0D0F",
        color: "#FAFAF9",
        minHeight: "calc(100vh - 60px)"
      }}>
        
        {/* D+2 알림 배너 모사 */}
        <div className="anim-up" style={{
          background: "linear-gradient(135deg, #1C1917 0%, #0D0D0F 100%)",
          border: "1.5px solid rgba(79, 216, 235, 0.3)",
          borderRadius: 12,
          padding: "12px 14px",
          fontSize: 11.5,
          color: "var(--ink-faint)",
          lineHeight: 1.5,
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          marginBottom: 16
        }}>
          <span style={{ fontWeight: 700, color: "#4FD8EB", display: "block", marginBottom: 2 }}>
            ✦ D+2 리마인드 알림
          </span>
          심해가 당신의 고요한 감정을 기억하고 있습니다. 새로운 이야기가 깨어났습니다.
        </div>

        {/* 새 장면 오픈 박스 */}
        <div style={{
          border: "1.5px solid #4FD8EB",
          borderRadius: "var(--radius-lg)",
          padding: 16,
          textAlign: "center",
          background: "rgba(79, 216, 235, 0.05)",
          marginBottom: 20
        }}>
          <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#4FD8EB", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Sparkles size={14} /> 다섯 번째 장면이 열렸어요
          </h3>
          <p style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 4 }}>
            &ldquo;다섯 번째 씬 : 깊어지는 잔상&rdquo;
          </p>
        </div>

        {/* 대화 스레드 */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
          marginBottom: 20,
          background: "rgba(255,255,255,0.01)",
          border: "1px solid rgba(255,255,255,0.04)",
          padding: 12,
          borderRadius: 12
        }}>
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === "ai" ? "flex-start" : "flex-end",
                background: msg.sender === "ai" ? "rgba(255, 255, 255, 0.04)" : "#4FD8EB",
                color: msg.sender === "ai" ? "var(--ink-faint)" : "#062028",
                padding: "8px 12px",
                borderRadius: 10,
                fontSize: 12.5,
                maxWidth: "85%",
                lineHeight: 1.5
              }}
            >
              {msg.sender === "ai" && <b style={{ color: "#4FD8EB" }}>심해의 안내자 · </b>}
              {msg.text}
            </div>
          ))}
        </div>

        {/* 하단 키보드 입력 & 아카이브 복귀 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* 입력창 */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            padding: "4px 6px 4px 16px",
            display: "flex",
            alignItems: "center"
          }}>
            <input
              type="text"
              placeholder="대화 이어나가기..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendChat(); }}
              style={{
                flex: 1, border: "none", background: "transparent",
                outline: "none", fontSize: 12.5, color: "#FAFAF9",
                padding: "8px 0"
              }}
            />
            <button
              onClick={handleSendChat}
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "#4FD8EB", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <Send size={14} color="#062028" />
            </button>
          </div>

          <button
            onClick={() => router.push(`/spinoff/${slug}/archive`)}
            className="btn btn-outline btn-full"
            style={{ borderColor: "rgba(255,255,255,0.15)", color: "#FFFFFF", gap: 6 }}
          >
            내 아카이브 확인하기
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </NavigationShell>
  );
}

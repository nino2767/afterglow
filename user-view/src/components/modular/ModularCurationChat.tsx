"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Image as ImageIcon } from "lucide-react";
import { ModularItem, ChatMessage } from "./types";
import NavigationShell from "../NavigationShell";

const getUniqueMsgId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random()}`;

interface ModularCurationChatProps {
  currentArtwork: ModularItem;
  onBack: () => void;
  theme: "main" | "spinoff";
  nickname: string;
  artworkSnaps: string[];
  localStorageSessionKey: string;
}

export default function ModularCurationChat({
  currentArtwork,
  onBack,
  theme,
  nickname,
  artworkSnaps,
  localStorageSessionKey
}: ModularCurationChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChatEmotions, setSelectedChatEmotions] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const quickReplies = [
    "이 작품에 숨겨진 비하인드 스토리가 있나요?",
    "작가가 이 빛을 쓸 때 무슨 느낌을 전달하려 했나요?",
    "이 작품의 소리가 특별한 이유가 뭔지 알려주세요"
  ];

  // Initialize welcome message & emotion state from localStorage
  useEffect(() => {
    const checkedMap: Record<string, boolean> = {};
    try {
      const savedSession = localStorage.getItem(localStorageSessionKey);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        
        // Load tagged emotions from chat
        const chatEmos = parsed.chatEmotions || {};
        const emosForArt = chatEmos[currentArtwork.id] || [];
        emosForArt.forEach((emoObj: { emotion: string }) => {
          checkedMap[emoObj.emotion] = true;
        });
      }
    } catch {
      //
    }

    const welcomeMsg: ChatMessage = {
      id: getUniqueMsgId("welcome"),
      sender: "ai",
      text: `${nickname}님, 어서오세요. 마침 지금 감상하고 계신 《${currentArtwork.title}》은 깊은 감성을 나누기에 아주 적합하답니다. 이 작품에 대해 궁금한 점이나 마음에 떠오른 감상이 있다면 편히 말씀해주세요.`,
      artworkId: currentArtwork.id,
      emotionChips: currentArtwork.default_emotion_chips
    };

    setTimeout(() => {
      setSelectedChatEmotions(checkedMap);
      setMessages([welcomeMsg]);
    }, 0);
  }, [currentArtwork, nickname, localStorageSessionKey]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const simulateAiResponse = (userText: string) => {
    setIsTyping(true);

    // Save interaction counts
    try {
      const savedSession = localStorage.getItem(localStorageSessionKey);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        parsed.chatCount = (parsed.chatCount || 0) + 1;
        
        // Also log visited scene logic for spinoff
        if (theme === "spinoff") {
          const visited = parsed.visited_scenes || {};
          visited[currentArtwork.id] = (visited[currentArtwork.id] || 0) + 1;
          parsed.visited_scenes = visited;
        }

        localStorage.setItem(localStorageSessionKey, JSON.stringify(parsed));
      }
    } catch {
      //
    }

    setTimeout(() => {
      setIsTyping(false);
      let responseText = "";
      const lowerText = userText.toLowerCase();

      if (lowerText.includes("비하인드") || lowerText.includes("작가") || lowerText.includes("이유") || lowerText.includes("의도")) {
        responseText = `이 작품 《${currentArtwork.title}》은 ${currentArtwork.artist || "Afterglow 크리에이터"} 작가가 제작했습니다. 보이지 않는 기억의 깊이를 관객과 나누기 위해 이 해설을 빚어냈습니다. 천천히 빛의 주기를 바라보며 나를 관조해 보세요. 어떤 기분이 드시나요?`;
      } else if (lowerText.includes("기분") || lowerText.includes("감정") || lowerText.includes("느낌") || lowerText.includes("생각")) {
        responseText = `${nickname}님이 마주하신 감정은 예술이 남기는 잔상입니다. 전시의 은은한 여운이 몸 전체로 서서히 스며드는 과정에 집중해 보세요. 어떤 느낌이 짙게 남으시나요?`;
      } else {
        responseText = `그렇군요. 《${currentArtwork.title}》을 설계하며 모든 관객이 저마다 다른 잔상을 품고 돌아가길 기대했던 작가의 의도와 일치하네요. ${nickname}님 마음속에는 지금 어떤 색의 여운이 남고 있나요?`;
      }

      const aiMsgId = getUniqueMsgId("ai");
      const newAiMsg: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: "",
        artworkId: currentArtwork.id,
        isStreaming: true,
        emotionChips: currentArtwork.default_emotion_chips
      };

      setMessages(prev => [...prev, newAiMsg]);

      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += 3;
        if (currentLength >= responseText.length) {
          clearInterval(interval);
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: responseText, isStreaming: false } : m));
        } else {
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: responseText.slice(0, currentLength) } : m));
        }
      }, 40);

    }, 1200);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: getUniqueMsgId("user"),
      sender: "user",
      text: text.trim(),
      artworkId: currentArtwork.id
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    simulateAiResponse(text);
  };

  const handleEmotionSelect = (emotion: string, axis: string) => {
    if (selectedChatEmotions[emotion]) return;

    setSelectedChatEmotions(prev => {
      const nextMap = { ...prev, [emotion]: true };
      
      try {
        const savedSession = localStorage.getItem(localStorageSessionKey);
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          
          // Save selected emotion
          const chatEmos = parsed.chatEmotions || {};
          const list = chatEmos[currentArtwork.id] || [];
          if (!list.some((e: { emotion: string }) => e.emotion === emotion)) {
            chatEmos[currentArtwork.id] = [...list, { emotion, axis }];
            parsed.chatEmotions = chatEmos;
          }
          
          // Specifically write to selected_keywords for spinoff compatibility
          if (theme === "spinoff") {
            const currentKeywords = parsed.selected_keywords || [];
            if (!currentKeywords.includes(emotion)) {
              parsed.selected_keywords = [...currentKeywords, emotion];
            }
          }
          
          localStorage.setItem(localStorageSessionKey, JSON.stringify(parsed));
        }
      } catch {
        //
      }

      return nextMap;
    });

    alert(`'#${emotion}' 감정이 취향 분석 키워드에 기록되었습니다.`);
  };

  const accentColor = theme === "main" ? "var(--accent)" : "#4FD8EB";
  const bgBubble = theme === "main" ? "var(--accent)" : "#4FD8EB";
  const textBubble = theme === "main" ? "#FFFFFF" : "#062028";

  return (
    <NavigationShell
      title={`《${currentArtwork.title}》 큐레이션`}
      showBack={true}
      onBack={onBack}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", background: "var(--bg)" }}>
        
        {/* 상단 스냅샷 가로 스크롤 */}
        {artworkSnaps.length > 0 && (
          <div style={{
            background: "var(--surface-2)",
            borderBottom: "1px solid var(--border)",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ImageIcon size={14} color={accentColor} />
              <span style={{ fontSize: 11, color: accentColor, fontWeight: 600 }}>내가 촬영한 스냅</span>
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", flex: 1 }}>
              {artworkSnaps.map((snap, idx) => (
                <div 
                  key={idx} 
                  style={{
                    width: 32, height: 32, borderRadius: 4,
                    backgroundImage: `url(${snap})`, backgroundSize: "cover", backgroundPosition: "center",
                    border: "1px solid var(--border)", flexShrink: 0
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 대화 스크롤 영역 */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "var(--space-5) var(--space-6)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)"
        }}>
          {messages.map((m) => {
            const isAi = m.sender === "ai";
            return (
              <div
                key={m.id}
                className="anim-fade"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: isAi ? "flex-start" : "flex-end",
                  alignItems: isAi ? "flex-start" : "flex-end",
                  maxWidth: "85%"
                }}
              >
                {isAi && (
                  <span className="t-micro" style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <Sparkles size={10} color={accentColor} /> AI 큐레이터
                  </span>
                )}

                <div style={{
                  background: isAi ? "var(--surface-2)" : bgBubble,
                  color: isAi ? "var(--ink)" : textBubble,
                  padding: "12px 18px",
                  borderRadius: isAi ? "0 var(--radius-lg) var(--radius-lg) var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  border: isAi ? "1px solid var(--border)" : "none",
                  wordBreak: "break-all"
                }}>
                  {m.text}
                </div>

                {/* AI 말풍선 밑에 감정 피드백 칩 노출 */}
                {isAi && !m.isStreaming && m.emotionChips && m.emotionChips.length > 0 && (
                  <div className="anim-fade" style={{ marginTop: "var(--space-3)", width: "100%" }}>
                    <p className="t-micro" style={{ marginBottom: 6, fontSize: 10 }}>어떤 여운이 남으시나요?</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {m.emotionChips.map((chip) => {
                        const isChecked = selectedChatEmotions[chip.emotion];
                        return (
                          <button
                            key={chip.emotion}
                            className={`emotion-chip ${isChecked ? "active" : ""}`}
                            onClick={() => handleEmotionSelect(chip.emotion, chip.axis)}
                            style={{ 
                              padding: "6px 12px", 
                              fontSize: 12,
                              background: isChecked ? accentColor : "var(--surface)",
                              color: isChecked ? (theme === "main" ? "#FFFFFF" : "#062028") : "var(--ink)",
                              border: "1px solid var(--border)",
                              cursor: "pointer",
                              borderRadius: 16
                            }}
                          >
                            ✦ {chip.emotion}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: "flex", flexDirection: "column", alignSelf: "flex-start", maxWidth: "85%" }}>
              <span className="t-micro" style={{ marginBottom: 4 }}>AI 큐레이터 생각 중...</span>
              <div style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                padding: "12px 18px",
                borderRadius: "0 var(--radius-lg) var(--radius-lg) var(--radius-lg)",
                display: "flex",
                gap: 4
              }}>
                <span className="dot-blink" style={{ width: 6, height: 6, background: "var(--ink-muted)", borderRadius: "50%" }} />
                <span className="dot-blink" style={{ width: 6, height: 6, background: "var(--ink-muted)", borderRadius: "50%", animationDelay: "0.2s" }} />
                <span className="dot-blink" style={{ width: 6, height: 6, background: "var(--ink-muted)", borderRadius: "50%", animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 퀵 리플라이 */}
        {!isTyping && (
          <div style={{
            padding: "0 var(--space-6)",
            display: "flex",
            gap: "var(--space-2)",
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: "var(--space-3)"
          }}>
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                className="btn btn-outline btn-sm"
                onClick={() => handleSendMessage(qr)}
                style={{
                  borderRadius: "var(--radius-full)",
                  fontSize: 12,
                  background: "var(--surface)",
                  border: "1px solid var(--border-mid)",
                  padding: "6px 14px"
                }}
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        <footer style={{
          padding: "var(--space-3) var(--space-5)",
          paddingBottom: "calc(var(--space-4) + var(--safe-bottom))",
          borderTop: "1px solid var(--border)",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)"
        }}>
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: "var(--surface-2)",
            borderRadius: "var(--radius-md)",
            padding: "4px var(--space-3)",
            border: "1px solid var(--border)"
          }}>
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(inputValue); }}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                outline: "none",
                padding: "10px 0",
                fontSize: 14.5,
                color: "var(--ink)"
              }}
            />
            <button
              className="btn btn-ghost"
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              style={{ padding: "var(--space-2)" }}
            >
              <Send size={18} color={inputValue.trim() ? accentColor : "var(--ink-faint)"} />
            </button>
          </div>
        </footer>

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

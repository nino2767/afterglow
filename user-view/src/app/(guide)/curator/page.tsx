"use client";

/**
 * app/(guide)/curator/page.tsx — S3 AI 큐레이터 채팅 정적 포팅 (Next.js TSX)
 */

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, ChevronLeft, Sparkles } from "lucide-react";

import EmotionChip from "../../../components/EmotionChip";
import BottomBar from "../../../components/BottomBar";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  section: string;
  year: string;
  docent_script: string;
  default_emotion_chips: { emotion: string; axis: string }[];
}

const ARTWORKS_LIST: Artwork[] = [
  {
    id: "art_001",
    title: "윤슬",
    artist: "김하늘",
    section: "1구역: 잔물결의 언어",
    year: "2024",
    docent_script: "물감 같은 푸른 투사 광원 아래 서서, 일렁이는 파동을 가만히 내려다봅니다.",
    default_emotion_chips: [
      { emotion: "고요함", axis: "serene" },
      { emotion: "따뜻함", axis: "warm" }
    ]
  },
  {
    id: "art_002",
    title: "심연의 호흡",
    artist: "이태양",
    section: "2구역: 수압의 깊이",
    year: "2025",
    docent_script: "빛의 안개가 서서히 들이마시고 내쉬는 호흡 주기에 맞춰 일렁입니다.",
    default_emotion_chips: [
      { emotion: "몽환적인", axis: "dreamy" },
      { emotion: "심오함", axis: "contemplative" }
    ]
  },
  {
    id: "art_003",
    title: "기억의 잔광",
    artist: "박은하",
    section: "3구역: 물러나는 해안선",
    year: "2026",
    docent_script: "강렬하게 휘몰아치던 소리와 섬광이 물러나며, 아스라한 어둠 속에 아주 작은 빛 한 조각이 남습니다.",
    default_emotion_chips: [
      { emotion: "슬픔", axis: "melancholy" },
      { emotion: "압도적", axis: "awe" }
    ]
  }
];

interface ChatMessage {
  id: string;
  sender: "ai" | "user" | "system";
  text: string;
  artworkId?: string;
  isStreaming?: boolean;
  emotionChips?: { emotion: string; axis: string }[];
}

function CuratorChatContent() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentArtwork, setCurrentArtwork] = useState<Artwork>(ARTWORKS_LIST[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [nickname, setNickname] = useState("관람객");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const quickReplies = [
    "이 작품에 숨겨진 비하인드 스토리가 있나요?",
    "작가가 이 빛을 쓸 때 무슨 느낌을 전달하려 했나요?",
    "이 작품의 소리가 특별한 이유가 뭔지 알려주세요"
  ];

  // 초기화 및 작품 파라미터 셋업
  useEffect(() => {
    let activeNickname = "관람객";
    try {
      const saved = localStorage.getItem("afterglow_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        activeNickname = parsed.nickname || "관람객";
        setNickname(activeNickname);
      }
    } catch (e) {
      //
    }

    const artworkId = searchParams.get("artwork");
    const targetArtwork = ARTWORKS_LIST.find(a => a.id === artworkId) || ARTWORKS_LIST[0];
    setCurrentArtwork(targetArtwork);

    const welcomeMsg: ChatMessage = {
      id: "welcome_" + Date.now(),
      sender: "ai",
      text: `${activeNickname}님, 어서오세요. 마침 지금 감상하고 계신 작품 《${targetArtwork.title}》은 깊은 감성을 나누기에 아주 적합하답니다. 이 작품에 대해 궁금한 점이나 마음에 떠오른 감상이 있다면 편히 말씀해주세요.`,
      artworkId: targetArtwork.id,
      emotionChips: targetArtwork.default_emotion_chips
    };

    setMessages([welcomeMsg]);
  }, [searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // AI 모의 스트리밍 시뮬레이터 (데이터 수집은 격리)
  function simulateAiResponse(userText: string) {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let responseText = "";
      const lowerText = userText.toLowerCase();

      if (lowerText.includes("비하인드") || lowerText.includes("작가") || lowerText.includes("이유") || lowerText.includes("의도")) {
        responseText = `이 작품 《${currentArtwork.title}》은 ${currentArtwork.artist} 작가가 제작했습니다. 작가는 보이지 않는 기억의 깊이를 관객과 나누기 위해 이 해설을 빚어냈습니다. 천천히 빛의 주기를 바라보며 나를 관조해 보세요. 어떤 기분이 드시나요?`;
      } else if (lowerText.includes("기분") || lowerText.includes("감정") || lowerText.includes("느낌") || lowerText.includes("생각")) {
        responseText = `${nickname}님이 마주하신 감정은 예술이 남기는 잔상입니다. 전시의 은은한 여운이 몸 전체로 서서히 스며드는 과정에 집중해 보세요. 어떤 느낌이 짙게 남으시나요?`;
      } else {
        responseText = `그렇군요. 《${currentArtwork.title}》을 설계하며 모든 관객이 저마다 다른 잔상을 품고 돌아가길 기대했던 작가의 의도와 일치하네요. ${nickname}님 마음속에는 지금 어떤 색의 여운이 남고 있나요?`;
      }

      const aiMsgId = "ai_" + Date.now();
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
  }

  function handleSendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: "user_" + Date.now(),
      sender: "user",
      text: text.trim(),
      artworkId: currentArtwork.id
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    simulateAiResponse(text);
  }

  function handleEmotionSelect(emotion: string, axis: string) {
    console.log(`Emotion tagged via Chat: ${emotion} (${axis}) (Data layer bypassed)`);
    alert(`'#${emotion}' 감정이 가상 기록되었습니다. (데이터 레이어 보류 상태)`);
  }

  return (
    <div className="screen" style={{ background: "var(--bg)", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <header style={{
        padding: "var(--space-5) var(--space-6) var(--space-4)",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)"
      }}>
        <button className="btn btn-ghost" onClick={() => router.push("/artwork")} style={{ padding: "var(--space-2)" }}>
          <ChevronLeft size={20} color="var(--ink)" />
        </button>
        <div style={{ flex: 1 }}>
          <p className="t-micro" style={{ marginBottom: 2 }}>AI 큐레이터 동행</p>
          <p className="t-title" style={{ fontSize: 16 }}>《{currentArtwork.title}》 대화 중</p>
        </div>
      </header>

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
                  <Sparkles size={10} color="var(--accent)" /> AI 큐레이터
                </span>
              )}

              <div style={{
                background: isAi ? "var(--surface-2)" : "var(--accent)",
                color: isAi ? "var(--ink)" : "#FFFFFF",
                padding: "12px 18px",
                borderRadius: isAi ? "0 var(--radius-lg) var(--radius-lg) var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)",
                fontSize: 14.5,
                lineHeight: 1.6,
                border: isAi ? "1px solid var(--border)" : "none",
                wordBreak: "break-all"
              }}>
                {m.text}
              </div>

              {isAi && !m.isStreaming && m.emotionChips && m.emotionChips.length > 0 && (
                <div className="anim-fade" style={{ marginTop: "var(--space-3)", width: "100%" }}>
                  <p className="t-micro" style={{ marginBottom: 6, fontSize: 10 }}>어떤 여운이 남으시나요?</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {m.emotionChips.map((chip) => (
                      <button
                        key={chip.emotion}
                        className="emotion-chip"
                        onClick={() => handleEmotionSelect(chip.emotion, chip.axis)}
                        style={{ padding: "6px 12px", fontSize: 12 }}
                      >
                        ✦ {chip.emotion}
                      </button>
                    ))}
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
            <Send size={18} color={inputValue.trim() ? "var(--accent)" : "var(--ink-faint)"} />
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
  );
}

export default function CuratorChatPage() {
  return (
    <Suspense fallback={
      <div className="screen justify-center items-center">
        <p className="t-body">대화 내용을 불러오고 있어요...</p>
      </div>
    }>
      <CuratorChatContent />
    </Suspense>
  );
}

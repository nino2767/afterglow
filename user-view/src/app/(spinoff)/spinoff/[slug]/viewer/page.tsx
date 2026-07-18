"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { MessageCircle, Camera, ChevronDown, ChevronUp, Send, Grid, Layers } from "lucide-react";
import NavigationShell from "../../../../../components/NavigationShell";
import ModularArtworkList from "../../../../../components/modular/ModularArtworkList";
import ModularDocentPanel from "../../../../../components/modular/ModularDocentPanel";
import { ModularItem, EmotionChipType } from "../../../../../components/modular/types";

interface Scene {
  id: string;
  title: string;
  sub: string;
  defaultNarration: string;
  color: string;
}

interface SpinoffSession {
  spinoff_id: string;
  nickname: string;
  seen_main_exhibition: boolean;
  selected_keywords: string[];
  selected_scene: string | null;
  visited_scenes: Record<string, number>;
  chat_history: Array<{ sender: string; text: string }>;
}

const SCENE_DATA: Scene[] = [
  {
    id: "scene_1",
    title: "빛이 닿지 않는 정원",
    sub: "Scene 1 / 3",
    defaultNarration: "본전시 마지막 방에서 유실되어 흘러 들어온 미약한 빛무리들이 검푸른 바닥 이끼 틈으로 흩어져 자리 잡았습니다.",
    color: "radial-gradient(circle at 70% 30%, rgba(79, 216, 235, 0.22) 0%, #0D131E 70%)"
  },
  {
    id: "scene_2",
    title: "가라앉은 메아리",
    sub: "Scene 2 / 3",
    defaultNarration: "작품 윤슬의 물결 소리가 차분히 가라앉아 수압에 짓눌리며, 보이지 않는 저 깊은 기포음들의 메아리로 재구성됩니다.",
    color: "radial-gradient(circle at 30% 60%, rgba(139, 46, 74, 0.15) 0%, #130D1E 70%)"
  },
  {
    id: "scene_3",
    title: "심연의 틈새",
    sub: "Scene 3 / 3",
    defaultNarration: "수면 아래 가장 가파른 낭떠러지 틈새에서 부풀어 올랐다 수축하는 수수께끼의 푸른 광원들이 호흡을 나누고 있습니다.",
    color: "radial-gradient(circle at 50% 50%, rgba(79, 216, 235, 0.15) 0%, #0D0D14 70%)"
  }
];

// 모듈러 컴포넌트 데이터 규격으로 맵핑
const SCENE_DATA_MODULAR: ModularItem[] = SCENE_DATA.map(s => ({
  id: s.id,
  title: s.title,
  section: s.sub,
  docent_script: s.defaultNarration,
  default_emotion_chips: [
    { emotion: "고요함", axis: "serene" },
    { emotion: "평온", axis: "serene" },
    { emotion: "몽환적인", axis: "dreamy" },
    { emotion: "심오함", axis: "contemplative" },
    { emotion: "쓸쓸함", axis: "melancholy" },
    { emotion: "압도적", axis: "awe" }
  ],
  color: s.color
}));

export default function SpinoffViewerPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string || "abyss-wave";

  const [session, setSession] = useState<SpinoffSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // 몰입/목록 뷰 모드 및 개별 상세 패널 노출 여부
  const [viewMode, setViewMode] = useState<"swipe" | "list">("swipe");
  const [selectedScene, setSelectedScene] = useState<ModularItem | null>(null);
  const [spinoffSnaps, setSpinoffSnaps] = useState<Record<string, string[]>>({});

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([
    { sender: "ai", text: "빛이 닿지 않는 이 정원에는 본전시의 깊은 잔향들이 잠겨 있습니다. 무엇이 느껴지시나요?" }
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("afterglow_spinoff_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setSession(parsed);
        }, 0);
      }

      // 스핀오프 스냅샷 로드
      const snaps = localStorage.getItem("afterglow_spinoff_user_snaps");
      if (snaps) {
        const parsedSnaps = JSON.parse(snaps);
        setTimeout(() => {
          setSpinoffSnaps(parsedSnaps);
        }, 0);
      }
    } catch {
      //
    }
  }, []);

  // 장면 변경 핸들러
  const handleNext = () => {
    if (currentIdx < SCENE_DATA.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // 카메라 스냅 촬영 모사 (몰입형)
  const handleCameraSnap = () => {
    const currentSceneId = SCENE_DATA[currentIdx].id;
    // 가상의 스냅 그라디언트 캡처 이미지로 저장
    const mockSnapImage = SCENE_DATA[currentIdx].color;
    
    const nextSnaps = { ...spinoffSnaps };
    const list = nextSnaps[currentSceneId] || [];
    nextSnaps[currentSceneId] = [...list, mockSnapImage];
    setSpinoffSnaps(nextSnaps);
    localStorage.setItem("afterglow_spinoff_user_snaps", JSON.stringify(nextSnaps));

    alert("📷 [현장 작품 인식 완료]\n미니 스핀오프 전시장 속 작품 스틸컷이 성공적으로 매핑되어 개인 아카이브에 영구 기록되었습니다.");
  };

  // 개별 상세 패널 내 사진 업로드
  const handlePhotoUpload = (base64: string) => {
    if (!selectedScene) return;
    const nextSnaps = { ...spinoffSnaps };
    const list = nextSnaps[selectedScene.id] || [];
    nextSnaps[selectedScene.id] = [...list, base64];
    setSpinoffSnaps(nextSnaps);
    localStorage.setItem("afterglow_spinoff_user_snaps", JSON.stringify(nextSnaps));
    alert("스냅 사진이 작품에 등록되었습니다.");
  };

  // 개별 상세 패널 내 감정 토글
  const handleEmotionToggle = (chip: EmotionChipType) => {
    if (!session) return;
    
    const nextKeywords = [...session.selected_keywords];
    const index = nextKeywords.indexOf(chip.emotion);
    if (index > -1) {
      nextKeywords.splice(index, 1);
    } else {
      nextKeywords.push(chip.emotion);
    }

    const updatedSession = { ...session, selected_keywords: nextKeywords };
    setSession(updatedSession);
    localStorage.setItem("afterglow_spinoff_session", JSON.stringify(updatedSession));
  };

  // 채팅 전송
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "user", text: chatInput.trim() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput("");

    // AI 가이드 지연 답변 시뮬레이션
    setTimeout(() => {
      const aiResponseText = `당신이 전해 주신 감각의 파동을 받아 심해 정원의 푸른 숨결이 더 깊게 요동칩니다. 이 순간의 고요함을 간직한 아카이브가 다 빚어져 가고 있습니다.`;
      setChatHistory(prev => [...prev, { sender: "ai", text: aiResponseText }]);
    }, 600);
  };

  const scene = SCENE_DATA[currentIdx];
  const userKeywords = session?.selected_keywords || [];
  const keywordDisplay = userKeywords.length > 0 ? userKeywords.join("·") : "고요한 안식";

  return (
    <NavigationShell 
      title={viewMode === "swipe" ? "스핀오프 관람" : "스핀오프 작품목록"} 
      showBack={true} 
      onBack={() => {
        if (selectedScene) {
          setSelectedScene(null);
        } else {
          router.push(`/spinoff/${slug}/onboarding`);
        }
      }}
    >
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#0D0D0F",
        color: "#FAFAF9",
        minHeight: "calc(100vh - 60px)",
        position: "relative",
        overflow: "hidden"
      }}>
        
        {/* 모드 전환 토글 헤더 */}
        {!selectedScene && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px",
            background: "rgba(0,0,0,0.4)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            zIndex: 10
          }}>
            <span style={{ fontSize: 12, color: "#4FD8EB", fontWeight: 700 }}>
              {viewMode === "swipe" ? "✦ 몰입형 관람 중" : "✦ 도슨트 목록형"}
            </span>

            <button
              onClick={() => setViewMode(prev => prev === "swipe" ? "list" : "swipe")}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#FFFFFF",
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              {viewMode === "swipe" ? (
                <>
                  <Grid size={12} /> 목록형 전환
                </>
              ) : (
                <>
                  <Layers size={12} /> 몰입형 전환
                </>
              )}
            </button>
          </div>
        )}

        {/* ── 1. 몰입형 (Swipe Mode) ── */}
        {viewMode === "swipe" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minHeight: "calc(100vh - 110px)" }}>
            
            {/* 가상 씬 비주얼 영역 */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: scene.color,
              transition: "background 0.5s ease",
              zIndex: 1
            }} />

            {/* 씬 전환 버튼 오버레이 */}
            <div style={{
              position: "absolute",
              right: 16,
              top: "35%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              zIndex: 10
            }}>
              <button 
                disabled={currentIdx === 0}
                onClick={handlePrev}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                  opacity: currentIdx === 0 ? 0.3 : 1
                }}
              >
                <ChevronUp size={20} color="#FFFFFF" />
              </button>
              
              <button 
                disabled={currentIdx === SCENE_DATA.length - 1}
                onClick={handleNext}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: currentIdx === SCENE_DATA.length - 1 ? "not-allowed" : "pointer",
                  opacity: currentIdx === SCENE_DATA.length - 1 ? 0.3 : 1
                }}
              >
                <ChevronDown size={20} color="#FFFFFF" />
              </button>
            </div>

            {/* 씬 세부 정보 & 큐레이터 텍스트 */}
            <div style={{
              zIndex: 5,
              padding: "var(--space-6) var(--space-5)",
              display: "flex",
              flexDirection: "column",
              gap: 6
            }}>
              <span className="tag" style={{ color: "#4FD8EB", fontSize: 10, letterSpacing: "0.2em" }}>
                {scene.sub}
              </span>
              <h2 className="t-serif" style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF" }}>
                {scene.title}
              </h2>
              <p style={{ fontSize: 12.5, color: "var(--ink-faint)", lineHeight: 1.6, marginTop: 6, maxWidth: "80%" }}>
                {scene.defaultNarration}
              </p>
              <p style={{ 
                fontSize: 11.5, 
                color: "#4FD8EB", 
                background: "rgba(79, 216, 235, 0.08)",
                border: "1px dashed rgba(79, 216, 235, 0.2)",
                padding: "8px 12px", 
                borderRadius: 8,
                marginTop: 10, 
                lineHeight: 1.5,
                fontWeight: 500
              }}>
                ✦ 당신의 [ {keywordDisplay} ] 감성에 반응하여, 이 공간의 광원이 조금 더 아늑하고 길게 호흡합니다.
              </p>
            </div>

            {/* 대화 및 카메라 조작 영역 (하단 고정 오버레이) */}
            <div style={{
              marginTop: "auto",
              zIndex: 5,
              padding: "var(--space-4) var(--space-5) calc(var(--space-4) + var(--safe-bottom))",
              background: "linear-gradient(to top, rgba(13,13,15,0.95) 80%, transparent)",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)"
            }}>
              {/* AI 대화 버블 영역 */}
              {chatOpen && (
                <div style={{
                  background: "rgba(10, 22, 40, 0.85)",
                  border: "1px solid rgba(79, 216, 235, 0.2)",
                  borderRadius: "var(--radius-lg)",
                  padding: 12,
                  marginBottom: 10,
                  maxHeight: 140,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  backdropFilter: "blur(8px)"
                }}>
                  {chatHistory.map((msg, index) => (
                    <div 
                      key={index}
                      style={{
                        alignSelf: msg.sender === "ai" ? "flex-start" : "flex-end",
                        background: msg.sender === "ai" ? "rgba(255, 255, 255, 0.04)" : "#4FD8EB",
                        color: msg.sender === "ai" ? "var(--ink-faint)" : "#062028",
                        padding: "6px 12px",
                        borderRadius: 10,
                        fontSize: 12,
                        maxWidth: "85%",
                        lineHeight: 1.45
                      }}
                    >
                      {msg.sender === "ai" && <b>안내자 · </b>}
                      {msg.text}
                    </div>
                  ))}
                </div>
              )}

              {/* 인풋 컨트롤 바 */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                {/* 오프라인 카메라 트리거 */}
                <button 
                  onClick={handleCameraSnap}
                  style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <Camera size={18} color="#4FD8EB" />
                </button>

                {/* 입력창 */}
                <div style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 24,
                  padding: "4px 6px 4px 16px",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <input 
                    type="text"
                    placeholder="안내자에게 질문하기..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendChat(); }}
                    onClick={() => setChatOpen(true)}
                    style={{
                      flex: 1, border: "none", background: "transparent",
                      outline: "none", fontSize: 12.5, color: "#FAFAF9",
                      padding: "6px 0"
                    }}
                  />
                  <button 
                    onClick={handleSendChat}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "#4FD8EB", border: "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer"
                    }}
                  >
                    <Send size={13} color="#062028" />
                  </button>
                </div>

                {/* 대화 내역 토글 */}
                <button 
                  onClick={() => setChatOpen(!chatOpen)}
                  style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: chatOpen ? "rgba(79, 216, 235, 0.15)" : "rgba(255, 255, 255, 0.05)",
                    border: chatOpen ? "1px solid #4FD8EB" : "1px solid rgba(255, 255, 255, 0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <MessageCircle size={18} color={chatOpen ? "#4FD8EB" : "#FAFAF9"} />
                </button>
              </div>

              {/* 최종 아카이브 받기 버튼 (3번째 씬 관람 후 활성화) */}
              <button
                onClick={() => router.push(`/spinoff/${slug}/archive`)}
                disabled={currentIdx < SCENE_DATA.length - 1}
                className="btn btn-primary btn-full"
                style={{
                  background: currentIdx === SCENE_DATA.length - 1 ? "#4FD8EB" : "#1F2937",
                  color: currentIdx === SCENE_DATA.length - 1 ? "#062028" : "#8A8A8A",
                  fontWeight: 800,
                  fontSize: 14.5,
                  borderRadius: "var(--radius-md)"
                }}
              >
                {currentIdx === SCENE_DATA.length - 1 ? "여정 기록하고 아카이브 받기" : "위 아래 버튼을 눌러 모든 장면을 확인해 보세요"}
              </button>
            </div>

          </div>
        )}

        {/* ── 2. 목록형 (List Mode) ── */}
        {viewMode === "list" && !selectedScene && (
          <div style={{ flex: 1, padding: "20px var(--space-5)", overflowY: "auto" }}>
            <p className="t-micro" style={{ marginBottom: 12 }}>스핀오프 장면 골라보기</p>
            <ModularArtworkList
              items={SCENE_DATA_MODULAR}
              onItemClick={(item) => setSelectedScene(item)}
              userSnaps={spinoffSnaps}
              theme="spinoff"
            />
          </div>
        )}

        {/* ── 3. 개별 상세 패널 (List Mode 내 상세) ── */}
        {viewMode === "list" && selectedScene && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <ModularDocentPanel
              item={selectedScene}
              onClose={() => setSelectedScene(null)}
              theme="spinoff"
              userSnaps={spinoffSnaps[selectedScene.id] || []}
              onPhotoUpload={handlePhotoUpload}
              selectedEmotions={(session?.selected_keywords || []).map(k => ({ emotion: k, axis: "serene" }))}
              onEmotionToggle={handleEmotionToggle}
              onCuratorChatClick={() => router.push(`/spinoff/${slug}/curator?artwork=${selectedScene.id}`)}
            />
          </div>
        )}

      </div>
    </NavigationShell>
  );
}

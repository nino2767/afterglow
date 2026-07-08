"use client";

/**
 * app/(guide)/artwork/page.tsx — S2 작품 정보 카드 정적 포팅 (Next.js TSX)
 * 내비게이션 셸 적용
 */

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, Camera, ChevronRight } from "lucide-react";
import EmotionChip from "../../../components/EmotionChip";
import BottomBar from "../../../components/BottomBar";
import NavigationShell from "../../../components/NavigationShell";

// SSOT 임시 하드코딩 (데이터 레이어 보류 지침에 따라 로컬 mock 상수로 격리)
const EXHIBITION = {
  name: "빛의 심연",
  venue: "아트홀 서울",
};

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
    docent_script: "물감 같은 푸른 투사 광원 아래 서서, 일렁이는 파동을 가만히 내려다봅니다. 시끄러운 소음이 걷히며 마음에 잔잔함이 차오릅니다.",
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
    docent_script: "빛의 안개가 서서히 들이마시고 내쉬는 호흡 주기에 맞춰 일렁입니다. 미지의 공간 속에 나를 완전히 맡겨 보며 신비로움을 느낍니다.",
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
    docent_script: "강렬하게 휘몰아치던 소리와 섬광이 물러나며, 아스라한 어둠 속에 아주 작은 빛 한 조각이 남습니다. 우수 어린 감정이 밀려옵니다.",
    default_emotion_chips: [
      { emotion: "슬픔", axis: "melancholy" },
      { emotion: "압도적", axis: "awe" }
    ]
  }
];

function ArtworkCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<Record<string, { emotion: string; axis: string }[]>>({});
  const [cameraPermission, setCameraPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [nickname, setNickname] = useState("관람객");

  const dwellStartRef = useRef<number | null>(null);

  // 로컬 세션 닉네임 로드
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

  // URL 파라미터 감지 (QR mock 대응)
  useEffect(() => {
    const artworkId = searchParams.get("artwork");
    if (artworkId) {
      const artwork = ARTWORKS_LIST.find(a => a.id === artworkId);
      if (artwork) openCard(artwork);
    }
  }, [searchParams]);

  function openCard(artwork: Artwork) {
    dwellStartRef.current = Date.now();
    setSelectedArtwork(artwork);
  }

  function closeCard() {
    if (selectedArtwork && dwellStartRef.current) {
      const dwell_sec = Math.round((Date.now() - dwellStartRef.current) / 1000);
      console.log(`Artwork ${selectedArtwork.id} Dwell time: ${dwell_sec}s (Data layer ignored)`);
    }
    setSelectedArtwork(null);
    dwellStartRef.current = null;
  }

  function handleEmotionToggle({ emotion, axis }: { emotion: string; axis: string }) {
    const artId = selectedArtwork?.id;
    if (!artId) return;

    setSelectedEmotions(prev => {
      const arr = prev[artId] || [];
      const exists = arr.some(e => e.emotion === emotion);
      const next = exists
        ? arr.filter(e => e.emotion !== emotion)
        : [...arr, { emotion, axis }];

      // 데이터 레이어 통신은 배제하고 단순 로컬 반응 로그만
      console.log(`Emotion Tagged: ${emotion} (${axis}) for ${artId}`);
      return { ...prev, [artId]: next };
    });
  }

  async function handleScanQR() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(t => t.stop());
        setCameraPermission("granted");
        alert("QR 스캐너 준비 중이에요. 현재는 작품 목록을 탭해서 선택해주세요.");
      } else {
        alert("카메라 미지원 브라우저 환경입니다. 목록에서 선택해 주세요.");
      }
    } catch {
      setCameraPermission("denied");
    }
  }

  return (
    <NavigationShell
      title={selectedArtwork ? selectedArtwork.title : "빛의 심연"}
      showBack={true}
      onBack={selectedArtwork ? closeCard : () => router.push("/onboarding")}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
        {/* 본문 메시지 안내 */}
        <div style={{ padding: "12px var(--space-5) 0" }}>
          <p className="t-caption">
            {nickname ? `${nickname}님` : "안녕하세요"} 👋
          </p>
        </div>

        {/* ── 콘텐츠 ── */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* 대기 상태 */}
          {!selectedArtwork && (
            <div className="anim-fade">
              {/* QR 스캔 CTA */}
              <div style={{
                margin: "var(--space-5)",
                padding: "var(--space-6)",
                background: "#0D0D0F", // 다크 배경
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0, zIndex: 0,
                  background: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px"
                  }}>
                    <Camera size={20} color="#C9A84C" style={{ margin: "auto" }} />
                  </div>
                  <p className="t-title" style={{ color: "#FFFFFF", marginBottom: "var(--space-2)" }}>
                    작품 QR을 스캔하세요
                  </p>
                  <p className="t-caption" style={{ color: "rgba(255,255,255,0.5)", marginBottom: "var(--space-5)" }}>
                    작품 옆 QR 코드를 스캔하면<br />AI 큐레이터 해설이 바로 시작돼요
                  </p>
                  <button
                    id="btn-scan-qr"
                    className="btn btn-primary"
                    onClick={handleScanQR}
                  >
                    <Camera size={16} />
                    QR 스캔하기
                  </button>
                  {cameraPermission === "denied" && (
                    <p style={{ color: "#E87B7B", fontSize: 12, marginTop: "var(--space-3)" }}>
                      카메라 권한이 없어요. 아래 목록을 탭해서 선택해주세요.
                    </p>
                  )}
                </div>
              </div>

              {/* 작품 목록 */}
              <div style={{ padding: "0 var(--space-5) var(--space-5)" }}>
                <p className="t-micro" style={{ marginBottom: "var(--space-4)" }}>또는 작품 골라보기</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {ARTWORKS_LIST.map(artwork => (
                    <button
                      key={artwork.id}
                      className="card"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-4)",
                        padding: "var(--space-4)",
                        width: "100%",
                        textAlign: "left",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        cursor: "pointer",
                      }}
                      onClick={() => openCard(artwork)}
                    >
                      <div style={{
                        width: 56, height: 56, borderRadius: "var(--radius-sm)",
                        background: "linear-gradient(135deg, #1E1520, #0D0D0F)",
                        flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#C9A84C",
                        fontSize: 20,
                      }}>
                        ✦
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="t-title" style={{ marginBottom: 2, fontSize: 15 }}>{artwork.title}</p>
                        <p className="t-caption">{artwork.artist} · {artwork.section}</p>
                      </div>
                      <ChevronRight size={16} color="var(--ink-muted)" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 정보 카드 상태 */}
          {selectedArtwork && (
            <div className="anim-fade">
              <div>
                <div style={{
                  width: "100%", height: 240,
                  background: "linear-gradient(135deg, #0D0D0F 0%, #1E1520 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 64, color: "rgba(201,168,76,0.3)",
                  position: "relative",
                }}>
                  ✦
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                    background: "linear-gradient(to top, var(--bg), transparent)",
                  }} />
                </div>

                <div style={{ padding: "var(--space-5)" }}>
                  <p className="t-micro" style={{ marginBottom: "var(--space-2)" }}>{selectedArtwork.section}</p>
                  <h2 className="t-heading" style={{ marginBottom: 4 }}>{selectedArtwork.title}</h2>
                  <p className="t-caption" style={{ marginBottom: "var(--space-5)" }}>
                    {selectedArtwork.artist} · {selectedArtwork.year}
                  </p>

                  <div className="divider" />

                  <p className="t-body" style={{ marginBottom: "var(--space-6)", lineHeight: 1.75 }}>
                    {selectedArtwork.docent_script}
                  </p>

                  <div style={{ marginBottom: "var(--space-6)" }}>
                    <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>
                      지금 어떤 느낌이세요?
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {selectedArtwork.default_emotion_chips.map(item => (
                        <EmotionChip
                          key={item.emotion}
                          item={item}
                          active={(selectedEmotions[selectedArtwork.id] || []).some(e => e.emotion === item.emotion)}
                          onToggle={handleEmotionToggle}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    id={`btn-open-chat-${selectedArtwork.id}`}
                    className="btn btn-primary btn-full"
                    style={{ gap: "var(--space-3)" }}
                    onClick={() => router.push(`/curator?artwork=${selectedArtwork.id}`)}
                  >
                    <MessageCircle size={18} />
                    AI 큐레이터와 대화하기
                  </button>

                  <p className="t-caption" style={{
                    textAlign: "center",
                    marginTop: "var(--space-3)",
                    color: "var(--ink-muted)",
                    fontSize: 12,
                  }}>
                    더 깊은 이야기를 나눠보세요
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <BottomBar>
          <button
            className="btn btn-outline btn-full btn-lg"
            onClick={() => router.push("/report")}
          >
            오늘의 관람 완료
          </button>
        </BottomBar>
      </div>
    </NavigationShell>
  );
}

export default function ArtworkCardPage() {
  return (
    <Suspense fallback={
      <div className="screen justify-center items-center">
        <p className="t-body">작품을 불러오고 있어요...</p>
      </div>
    }>
      <ArtworkCardContent />
    </Suspense>
  );
}

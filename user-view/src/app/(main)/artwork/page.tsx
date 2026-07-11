"use client";

/**
 * app/(main)/artwork/page.tsx — 본전시 작품 목록, 상세 정보 및 상호작용 강화 페이지
 */

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MessageCircle, Camera, ChevronRight, Volume2, VolumeX, Image as ImageIcon, 
  Upload, X, Check, Eye, AlertCircle, RefreshCw, Heart, Bell, Edit2 
} from "lucide-react";
import EmotionChip from "../../../components/EmotionChip";
import BottomBar from "../../../components/BottomBar";
import NavigationShell from "../../../components/NavigationShell";

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

// 가상의 '모두의 여운 피드' Mock 데이터
const MOCK_COMMUNITY_FEED = [
  {
    id: "feed_1",
    nickname: "푸른 잔물결",
    artworkTitle: "윤슬",
    imageUrl: "linear-gradient(135deg, #1A365D 0%, #2B6CB0 100%)",
    hearts: 42,
    tags: ["고요함", "평온"]
  },
  {
    id: "feed_2",
    nickname: "몽상가 S",
    artworkTitle: "심연의 호흡",
    imageUrl: "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)",
    hearts: 28,
    tags: ["몽환적인", "신비로움"]
  },
  {
    id: "feed_3",
    nickname: "우수의 빛",
    artworkTitle: "기억의 잔광",
    imageUrl: "linear-gradient(135deg, #1A202C 0%, #2D3748 100%)",
    hearts: 56,
    tags: ["쓸쓸함", "압도적"]
  }
];

function ArtworkCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 기본 정보 상태
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<Record<string, { emotion: string; axis: string }[]>>({});
  const [nickname, setNickname] = useState("관람객");
  const [cameraPermission, setCameraPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  
  // 닉네임 수정 및 로그인 유도 상태
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editNicknameValue, setEditNicknameValue] = useState("");
  const [showLoginSuggestModal, setShowLoginSuggestModal] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  
  // 사진 업로드 상태
  const [userSnaps, setUserSnaps] = useState<Record<string, string[]>>({});
  const [bulkImages, setBulkImages] = useState<string[]>([]);
  const [bulkMappingIndex, setBulkMappingIndex] = useState<number>(0);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [visionLoading, setVisionLoading] = useState(false);

  // 음성 도슨트 (TTS) 상태
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioWaveAnim, setAudioWaveAnim] = useState(false);

  // QR 스캔 모달 상태
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrVideoActive, setQrVideoActive] = useState(false);

  // 관람 종료 및 푸시/위치 알림 상태
  const [showLocationPush, setShowLocationPush] = useState(false);
  const [showTimePush, setShowTimePush] = useState(false);
  const [simulatedExit, setSimulatedExit] = useState(false);

  // 모두의 여운 피드 좋아요 상태
  const [likedFeeds, setLikedFeeds] = useState<Record<string, boolean>>({});

  const dwellStartRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 로컬 세션 & 업로드 사진 로드
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem("afterglow_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setNickname(parsed.nickname || "관람객");
      }

      const account = localStorage.getItem("afterglow_account");
      if (account) {
        setIsLogged(true);
        const parsed = JSON.parse(account);
        setNickname(parsed.nickname || "관람객");
      }

      const savedSnaps = localStorage.getItem("afterglow_user_snaps");
      if (savedSnaps) {
        setUserSnaps(JSON.parse(savedSnaps));
      }
    } catch (e) {
      console.error("Failed to load local storage data:", e);
    }
  }, []);

  // URL 파라미터 감지 (QR 태깅 및 직접 공유 링크 대응)
  useEffect(() => {
    const artworkId = searchParams.get("artwork");
    if (artworkId) {
      const artwork = ARTWORKS_LIST.find(a => a.id === artworkId);
      if (artwork) {
        openCard(artwork);
      }
    }
  }, [searchParams]);

  // 경과 시간 종료 타이머 (45초 후 시간 알림 배너 트리거)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimePush(true);
    }, 45000); // 45초 후 작동

    return () => clearTimeout(timer);
  }, []);

  // Geolocation 위치 감지 시뮬레이션 및 실제 연동
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    const handleSuccess = (position: GeolocationPosition) => {
      // 특정 가상 영역에서 멀어지면 경고 (예: 서울 시청 기준 37.56, 126.97에서 이탈 감지)
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      // 임시 체크: 위도가 37.56에서 0.001도 이상 벗어나거나 시뮬레이션 토글 ON일 때
      if (simulatedExit) {
        setShowLocationPush(true);
      }
    };

    const handleError = () => {
      if (simulatedExit) {
        setShowLocationPush(true);
      }
    };

    const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });

    return () => navigator.geolocation.clearWatch(watcher);
  }, [simulatedExit]);

  // 시뮬레이션 토글 핸들러
  useEffect(() => {
    if (simulatedExit) {
      setShowLocationPush(true);
    } else {
      setShowLocationPush(false);
    }
  }, [simulatedExit]);

  // TTS 정리
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 닉네임 수정 시도 (비로그인 시 로그인 유도)
  function handleEditNicknameClick() {
    if (isLogged) {
      setEditNicknameValue(nickname);
      setIsEditingNickname(true);
    } else {
      setShowLoginSuggestModal(true);
    }
  }

  // 로그인 상태에서 실시간 닉네임 수정 및 저장
  function handleSaveNickname() {
    if (!editNicknameValue.trim()) return;
    const newName = editNicknameValue.trim();
    setNickname(newName);
    setIsEditingNickname(false);

    try {
      const session = localStorage.getItem("afterglow_session");
      if (session) {
        const parsed = JSON.parse(session);
        parsed.nickname = newName;
        localStorage.setItem("afterglow_session", JSON.stringify(parsed));
      }
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        const parsed = JSON.parse(account);
        parsed.nickname = newName;
        localStorage.setItem("afterglow_account", JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ── 카드 열기/닫기 ──
  function openCard(artwork: Artwork, autoPlayTts = false) {
    // 이전 오디오 멈춤
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setAudioPlaying(false);
    setAudioWaveAnim(false);

    dwellStartRef.current = Date.now();
    setSelectedArtwork(artwork);

    // 자동 오디오 재생 옵션이 참일 때 TTS 작동
    if (autoPlayTts) {
      setTimeout(() => {
        playDocentTts(artwork.docent_script);
      }, 500);
    }
  }

  function closeCard() {
    if (selectedArtwork && dwellStartRef.current) {
      const dwell_sec = Math.round((Date.now() - dwellStartRef.current) / 1000);
      
      // 누적 체류 시간 기록
      try {
        const savedSession = localStorage.getItem("afterglow_session");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          const currentDwells = parsed.dwells || {};
          currentDwells[selectedArtwork.id] = (currentDwells[selectedArtwork.id] || 0) + dwell_sec;
          parsed.dwells = currentDwells;
          localStorage.setItem("afterglow_session", JSON.stringify(parsed));
        }
      } catch (e) {
        // ignore
      }
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setAudioPlaying(false);
    setAudioWaveAnim(false);
    setSelectedArtwork(null);
    dwellStartRef.current = null;
  }

  // ── 감정 퀵 반응 ──
  function handleEmotionToggle({ emotion, axis }: { emotion: string; axis: string }) {
    const artId = selectedArtwork?.id;
    if (!artId) return;

    setSelectedEmotions(prev => {
      const arr = prev[artId] || [];
      const exists = arr.some(e => e.emotion === emotion);
      const next = exists
        ? arr.filter(e => e.emotion !== emotion)
        : [...arr, { emotion, axis }];

      // 로컬 세션 정보에 감정 태그 실시간 저장
      try {
        const savedSession = localStorage.getItem("afterglow_session");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          const currentTags = parsed.emotionTags || {};
          currentTags[artId] = next;
          parsed.emotionTags = currentTags;
          localStorage.setItem("afterglow_session", JSON.stringify(parsed));
        }
      } catch (e) {
        // ignore
      }

      return { ...prev, [artId]: next };
    });
  }

  // ── 오디오 도슨트 (TTS) 재생 ──
  function playDocentTts(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("이 브라우저는 음성 합성(TTS) 기능을 지원하지 않습니다.");
      return;
    }

    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
      setAudioWaveAnim(false);
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    
    utterance.onstart = () => {
      setAudioPlaying(true);
      setAudioWaveAnim(true);
    };

    utterance.onend = () => {
      setAudioPlaying(false);
      setAudioWaveAnim(false);
    };

    utterance.onerror = () => {
      setAudioPlaying(false);
      setAudioWaveAnim(false);
    };

    synth.speak(utterance);
  }

  // ── 사진 촬영 및 개별 업로드 ──
  function handleSinglePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const artId = selectedArtwork?.id;
    if (!file || !artId) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const currentSnaps = { ...userSnaps };
      const list = currentSnaps[artId] || [];
      const updatedList = [...list, base64String];
      currentSnaps[artId] = updatedList;

      setUserSnaps(currentSnaps);
      localStorage.setItem("afterglow_user_snaps", JSON.stringify(currentSnaps));
      alert("스냅 사진이 작품에 등록되었습니다.");
    };
    reader.readAsDataURL(file);
  }

  // ── 일괄 사진 업로드 및 매핑 ──
  function handleBulkPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      setBulkImages(base64Images);
      setBulkMappingIndex(0);
      setShowBulkModal(true);
    });
  }

  function handleSaveBulkMapping(artworkId: string | null) {
    const currentImg = bulkImages[bulkMappingIndex];
    if (artworkId && currentImg) {
      const currentSnaps = { ...userSnaps };
      const list = currentSnaps[artworkId] || [];
      currentSnaps[artworkId] = [...list, currentImg];
      setUserSnaps(currentSnaps);
      localStorage.setItem("afterglow_user_snaps", JSON.stringify(currentSnaps));
    }

    if (bulkMappingIndex < bulkImages.length - 1) {
      setBulkMappingIndex(prev => prev + 1);
    } else {
      // 완료
      setShowBulkModal(false);
      setBulkImages([]);
      alert("모든 사진의 작품 매핑과 일괄 업로드가 완료되었습니다!");
    }
  }

  // ── 사진 촬영을 통한 자동 매핑 인식 (Vision 도슨트) 시뮬레이션 ──
  function handleVisionPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setVisionLoading(true);

    // AI 이미지 분석 모사 (1.5초)
    setTimeout(() => {
      setVisionLoading(false);
      // 무작위로 하나의 작품 매핑
      const randomIndex = Math.floor(Math.random() * ARTWORKS_LIST.length);
      const targetArtwork = ARTWORKS_LIST[randomIndex];

      // 촬영한 사진을 자동으로 해당 작품 스냅에 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const currentSnaps = { ...userSnaps };
        const list = currentSnaps[targetArtwork.id] || [];
        currentSnaps[targetArtwork.id] = [...list, base64String];
        setUserSnaps(currentSnaps);
        localStorage.setItem("afterglow_user_snaps", JSON.stringify(currentSnaps));

        // 해당 작품 카드를 즉시 열어주고 오디오 재생 실행
        openCard(targetArtwork, true);
      };
      reader.readAsDataURL(file);
    }, 1800);
  }

  // ── 선택적 QR 스캔 및 시뮬레이션 ──
  async function handleOpenQrScan() {
    setShowQrModal(true);
    setQrVideoActive(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraPermission("granted");
      } else {
        setCameraPermission("denied");
      }
    } catch (e) {
      setCameraPermission("denied");
    }
  }

  function handleCloseQrScan() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setQrVideoActive(false);
    setShowQrModal(false);
  }

  function handleQrSimulate(artworkId: string) {
    // 선택적 QR 제공 스펙 반영: art_001만 QR 코드가 연동되어 있는 상태
    if (artworkId === "art_001") {
      handleCloseQrScan();
      const artwork = ARTWORKS_LIST.find(a => a.id === artworkId);
      if (artwork) {
        // 즉시 도슨트 상세 카드 열기 + TTS 자동 재생
        openCard(artwork, true);
      }
    } else {
      // 미지원 알림 팝업
      alert("⚠️ 이 작품은 현재 전시장 내에 물리 QR 태깅 가이드가 배치되지 않았습니다. [스냅 촬영 인식] 또는 아래 [작품 골라보기]를 활용해 도슨트를 감상해주세요.");
    }
  }

  // 피드 좋아요 토글
  function toggleFeedLike(id: string) {
    setLikedFeeds(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <NavigationShell
      title={selectedArtwork ? selectedArtwork.title : EXHIBITION.name}
      showBack={true}
      onBack={selectedArtwork ? closeCard : () => router.push("/onboarding")}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative" }}>
        
        {/* ── 상단 가상 푸시 알림 배너 ── */}
        {showTimePush && (
          <div className="push-banner anim-down" onClick={() => router.push("/report")}>
            <div className="push-icon">✦</div>
            <div style={{ flex: 1 }}>
              <p className="push-title">AFTERGLOW 관람 완료 안내</p>
              <p className="push-desc">관람을 시작하신 지 45초가 경과했습니다. 오늘의 감동을 여운 리포트로 확인해보세요. 💌</p>
            </div>
            <button className="push-close" onClick={(e) => { e.stopPropagation(); setShowTimePush(false); }}>
              <X size={14} />
            </button>
          </div>
        )}

        {showLocationPush && (
          <div className="push-banner anim-down location-push" onClick={() => router.push("/report")}>
            <div className="push-icon text-accent">💌</div>
            <div style={{ flex: 1 }}>
              <p className="push-title">나만의 여운 리포트 도착</p>
              <p className="push-desc">전시장 퇴장이 감지되었습니다. 감정 태그가 축적된 리포트와 스핀오프 초대장을 열어보세요!</p>
            </div>
            <button className="push-close" onClick={(e) => { e.stopPropagation(); setShowLocationPush(false); }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* 닉네임 안내 */}
        <div style={{ padding: "12px var(--space-5) 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {isEditingNickname ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="text"
                value={editNicknameValue}
                onChange={(e) => setEditNicknameValue(e.target.value)}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 12,
                  color: "var(--ink)",
                  outline: "none"
                }}
                maxLength={15}
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveNickname(); }}
              />
              <button onClick={handleSaveNickname} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", display: "flex", padding: 2 }}>
                <Check size={14} />
              </button>
              <button onClick={() => setIsEditingNickname(false)} style={{ background: "none", border: "none", color: "var(--ink-muted)", cursor: "pointer", display: "flex", padding: 2 }}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <p className="t-caption" style={{ margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
              <span>{nickname ? `${nickname}님` : "안녕하세요"} 👋</span>
              <button
                onClick={handleEditNicknameClick}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--accent)",
                  display: "inline-flex",
                  padding: 2,
                  opacity: 0.8
                }}
                title="이름 수정"
              >
                <Edit2 size={12} />
              </button>
            </p>
          )}

          {/* 디버그용 가상 위치 토글 스위치 */}
          {!selectedArtwork && (
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, cursor: "pointer", background: "var(--surface-2)", padding: "4px 8px", borderRadius: 12, border: "1px solid var(--border)" }}>
              <Bell size={10} color={simulatedExit ? "var(--accent)" : "var(--ink-muted)"} />
              <span>전시장 이탈 시뮬레이터</span>
              <input
                type="checkbox"
                checked={simulatedExit}
                onChange={(e) => setSimulatedExit(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
            </label>
          )}
        </div>

        {/* ── 콘텐츠 스크롤 영역 ── */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "var(--space-12)" }}>
          
          {/* 대기 상태 */}
          {!selectedArtwork && (
            <div className="anim-fade">
              
              {/* 로딩 표시 (스냅 촬영 작품 인식 시) */}
              {visionLoading && (
                <div style={{
                  margin: "var(--space-5)",
                  padding: "var(--space-8)",
                  background: "rgba(13,13,15,0.9)",
                  borderRadius: "var(--radius-lg)",
                  textAlign: "center",
                  border: "1px solid var(--accent)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12
                }}>
                  <RefreshCw className="spin" size={24} color="var(--accent)" />
                  <p className="t-title" style={{ fontSize: 15, color: "#FFFFFF" }}>AI가 이미지의 작품을 인식하고 있습니다...</p>
                  <p className="t-caption" style={{ color: "rgba(255,255,255,0.5)" }}>잠시만 기다려주시면 오디오 가이드가 실행됩니다.</p>
                </div>
              )}

              {/* 핵심 액션 허브 (촬영 인식 & QR 스캔) */}
              <div style={{
                margin: "var(--space-5)",
                padding: "var(--space-6)",
                background: "#0D0D0F",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                border: "1px solid var(--border)"
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
                    <Camera size={20} color="#C9A84C" />
                  </div>
                  
                  <p className="t-title" style={{ color: "#FFFFFF", marginBottom: 4 }}>
                    작품 사진을 찍어 이야기를 들으세요
                  </p>
                  <p className="t-caption" style={{ color: "rgba(255,255,255,0.5)", marginBottom: "var(--space-6)" }}>
                    카메라로 작품을 찍으면 AI가 자동으로 매핑하여<br />도슨트 가이드 음성을 바로 실행해 드립니다.
                  </p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", maxWidth: 280, margin: "0 auto" }}>
                    {/* 사진 촬영으로 작품 매핑 인식 */}
                    <label className="btn btn-primary" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Camera size={16} />
                      스냅 촬영 (작품 자동 인식)
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        onChange={handleVisionPhotoUpload}
                        style={{ display: "none" }}
                      />
                    </label>

                    {/* 선택적 QR 스캔 버튼 */}
                    <button
                      id="btn-scan-qr"
                      className="btn btn-outline"
                      style={{ fontSize: 13.5 }}
                      onClick={handleOpenQrScan}
                    >
                      <Eye size={15} />
                      선택적 QR 스캔하기
                    </button>
                  </div>
                </div>
              </div>

              {/* 작품 목록 골라보기 */}
              <div style={{ padding: "0 var(--space-5) var(--space-5)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                  <p className="t-micro" style={{ margin: 0 }}>직접 선택해서 도슨트 듣기</p>
                  
                  {/* 일괄 업로드 액션 */}
                  <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>
                    <Upload size={13} />
                    다중 사진 일괄 매핑
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleBulkPhotoUpload} 
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {ARTWORKS_LIST.map(artwork => {
                    const snapCount = userSnaps[artwork.id]?.length || 0;
                    return (
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
                          position: "relative"
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
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <p className="t-title" style={{ marginBottom: 2, fontSize: 15 }}>{artwork.title}</p>
                            {snapCount > 0 && (
                              <span style={{ fontSize: 10, background: "rgba(201,168,76,0.15)", color: "var(--accent)", border: "1px solid rgba(201,168,76,0.3)", padding: "1px 6px", borderRadius: 8, fontWeight: 600 }}>
                                📷 {snapCount}
                              </span>
                            )}
                          </div>
                          <p className="t-caption">{artwork.artist} · {artwork.section}</p>
                        </div>
                        <ChevronRight size={16} color="var(--ink-muted)" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── 모두의 여운 피드 (Visitor Photo Feed) ── */}
              <div style={{ padding: "var(--space-4) var(--space-5)" }}>
                <p className="t-micro" style={{ marginBottom: "var(--space-4)" }}>모두의 여운 피드 ✦</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                  {MOCK_COMMUNITY_FEED.map((feed) => {
                    const isLiked = likedFeeds[feed.id];
                    return (
                      <div key={feed.id} className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface-2)" }}>
                        {/* 가상 그라디언트 스냅샷 영역 */}
                        <div style={{
                          width: "100%", height: 160,
                          background: feed.imageUrl,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "rgba(255,255,255,0.15)",
                          fontSize: 48,
                          position: "relative"
                        }}>
                          ✦
                          <span style={{ position: "absolute", bottom: 8, left: 12, fontSize: 12, color: "#FFFFFF", background: "rgba(0,0,0,0.5)", padding: "2px 8px", borderRadius: 10 }}>
                            {feed.artworkTitle}
                          </span>
                        </div>
                        
                        <div style={{ padding: "var(--space-4)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{feed.nickname}</span>
                            <button 
                              onClick={() => toggleFeedLike(feed.id)} 
                              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: isLiked ? "#E87B7B" : "var(--ink-muted)", fontSize: 12 }}
                            >
                              <Heart size={14} fill={isLiked ? "#E87B7B" : "none"} />
                              {feed.hearts + (isLiked ? 1 : 0)}
                            </button>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {feed.tags.map(t => (
                              <span key={t} style={{ fontSize: 11, color: "var(--accent)", background: "rgba(201,168,76,0.08)", padding: "2px 8px", borderRadius: 10 }}>
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                  
                  {/* 오디오 가이드 재생 파동 UI */}
                  {audioWaveAnim && (
                    <div className="wave-container">
                      <div className="wave-bar" style={{ animationDelay: "0.1s" }} />
                      <div className="wave-bar" style={{ animationDelay: "0.3s" }} />
                      <div className="wave-bar" style={{ animationDelay: "0.5s" }} />
                      <div className="wave-bar" style={{ animationDelay: "0.2s" }} />
                      <div className="wave-bar" style={{ animationDelay: "0.4s" }} />
                    </div>
                  )}

                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                    background: "linear-gradient(to top, var(--bg), transparent)",
                  }} />
                </div>

                <div style={{ padding: "var(--space-5)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-2)" }}>
                    <p className="t-micro" style={{ margin: 0 }}>{selectedArtwork.section}</p>
                    
                    {/* TTS 재생 버튼 */}
                    <button
                      className={`btn btn-sm ${audioPlaying ? "btn-primary" : "btn-outline"}`}
                      onClick={() => playDocentTts(selectedArtwork.docent_script)}
                      style={{ borderRadius: "var(--radius-full)", padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11 }}
                    >
                      {audioPlaying ? <VolumeX size={12} /> : <Volume2 size={12} />}
                      {audioPlaying ? "설명 일시정지" : "음성 도슨트 듣기"}
                    </button>
                  </div>

                  <h2 className="t-heading" style={{ marginBottom: 4 }}>{selectedArtwork.title}</h2>
                  <p className="t-caption" style={{ marginBottom: "var(--space-5)" }}>
                    {selectedArtwork.artist} · {selectedArtwork.year}
                  </p>

                  <div className="divider" />

                  <p className="t-body" style={{ marginBottom: "var(--space-6)", lineHeight: 1.75 }}>
                    {selectedArtwork.docent_script}
                  </p>

                  {/* 내가 기록한 스냅 사진 섹션 */}
                  <div style={{ marginBottom: "var(--space-6)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                      <p className="t-micro" style={{ margin: 0 }}>내가 기록한 스냅 사진</p>
                      <label style={{ fontSize: 11, color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <Camera size={12} />
                        스냅 추가
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSinglePhotoUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>

                    {userSnaps[selectedArtwork.id]?.length > 0 ? (
                      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                        {userSnaps[selectedArtwork.id].map((snap, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              width: 80, height: 80, borderRadius: "var(--radius-sm)", 
                              backgroundImage: `url(${snap})`, backgroundSize: "cover", backgroundPosition: "center",
                              border: "1px solid var(--border)", flexShrink: 0
                            }} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="t-caption" style={{ padding: "var(--space-4)", background: "var(--surface-2)", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border)", textAlign: "center", fontSize: 12, color: "var(--ink-muted)" }}>
                        기록한 사진이 없습니다. [스냅 추가]를 눌러 스틸컷을 남겨두세요.
                      </div>
                    )}
                  </div>

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

        {/* ── 하단 고정 바 ── */}
        <BottomBar>
          <button
            className="btn btn-outline btn-full btn-lg"
            onClick={() => router.push("/report")}
          >
            오늘의 관람 완료
          </button>
        </BottomBar>

        {/* ── 일괄 사진 매핑 모달 ── */}
        {showBulkModal && bulkImages.length > 0 && (
          <div className="modal-overlay">
            <div className="modal-content anim-up" style={{ maxWidth: 360 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <p className="t-title" style={{ margin: 0 }}>스냅 사진 매핑 ({bulkMappingIndex + 1} / {bulkImages.length})</p>
                <button className="btn btn-ghost" onClick={() => setShowBulkModal(false)} style={{ padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              {/* 매핑 대상 이미지 프리뷰 */}
              <div style={{
                width: "100%", height: 180, borderRadius: "var(--radius-md)",
                backgroundImage: `url(${bulkImages[bulkMappingIndex]})`,
                backgroundSize: "cover", backgroundPosition: "center",
                border: "1px solid var(--border)", marginBottom: "var(--space-5)"
              }} />

              <p className="t-caption" style={{ marginBottom: "var(--space-3)" }}>이 사진은 어떤 작품을 찍으신 건가요?</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
                {ARTWORKS_LIST.map(art => (
                  <button
                    key={art.id}
                    className="btn btn-outline btn-sm"
                    style={{ textAlign: "left", justifyContent: "flex-start", padding: "10px 14px", height: "auto" }}
                    onClick={() => handleSaveBulkMapping(art.id)}
                  >
                    ✦ {art.title} ({art.artist})
                  </button>
                ))}
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--ink-muted)" }}
                  onClick={() => handleSaveBulkMapping(null)}
                >
                  지정하지 않고 다음으로
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 선택적 QR 스캔 모달 ── */}
        {showQrModal && (
          <div className="modal-overlay" style={{ zIndex: 1000 }}>
            <div className="modal-content anim-up" style={{ maxWidth: 360, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <p className="t-title" style={{ margin: 0 }}>QR 코드 도슨트 스캐너</p>
                <button className="btn btn-ghost" onClick={handleCloseQrScan} style={{ padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              {/* 가상 카메라 뷰파인더 */}
              <div style={{
                width: "100%", height: 200, background: "#000",
                borderRadius: "var(--radius-md)", overflow: "hidden", position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-4)"
              }}>
                {cameraPermission === "granted" && qrVideoActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ padding: "var(--space-5)", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    <AlertCircle size={24} style={{ margin: "0 auto 8px" }} />
                    카메라 화면이 연동되지 않았습니다.<br />아래 가상 스캔 시뮬레이션을 활용해보세요.
                  </div>
                )}
                
                {/* 뷰파인더 타겟 테두리 */}
                <div style={{
                  position: "absolute", width: 120, height: 120,
                  border: "2px solid var(--accent)", borderRadius: 12,
                  pointerEvents: "none", boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.4)"
                }} />
              </div>

              <div style={{ background: "var(--surface-2)", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", marginBottom: "var(--space-5)", textAlign: "left" }}>
                <p style={{ fontSize: 11, color: "var(--ink-muted)", lineHeight: 1.5, margin: 0 }}>
                  💡 **QR 도슨트 안내**: QR코드는 코드가 준비된 특정 작품(예: 윤슬)에만 활성화됩니다. 미배치 작품은 리스트나 사진을 활용해 도슨트를 재생해주세요.
                </p>
              </div>

              <p className="t-caption" style={{ marginBottom: "var(--space-3)", fontWeight: 600 }}>가상 QR 태그 시뮬레이션</p>
              
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleQrSimulate("art_001")}
                >
                  윤슬 QR (스캔성공)
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleQrSimulate("art_003")}
                >
                  기억의 잔광 (미지원)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 닉네임 변경/로그인 유도 팝업 모달 ── */}
        {showLoginSuggestModal && (
          <div className="modal-overlay" style={{ zIndex: 1001 }}>
            <div className="modal-content anim-up" style={{ maxWidth: 340 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", margin: 0 }}>닉네임 변경 안내 ✦</h4>
                <button className="btn btn-ghost" onClick={() => setShowLoginSuggestModal(false)} style={{ padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                나만의 어울리는 이름을 짓고 오늘의 관람 기록을 안전하게 보관하시겠습니까? <br />
                계정을 만드시면 자유로운 닉네임 변경 및 여운 리포트 영구 소장이 가능합니다.
              </p>

              <button
                className="btn btn-primary btn-full"
                onClick={() => {
                  setShowLoginSuggestModal(false);
                  router.push("/login?trigger=edit_nickname");
                }}
                style={{ marginBottom: 8 }}
              >
                계정 만들고 이름 변경하기
              </button>
              <button
                className="btn btn-outline btn-full"
                onClick={() => setShowLoginSuggestModal(false)}
              >
                계정 없이 관람 계속하기
              </button>
            </div>
          </div>
        )}

        <style>{`
          /* 푸시 배너 스타일 */
          .push-banner {
            position: absolute;
            top: 12px;
            left: 12px;
            right: 12px;
            background: rgba(20, 20, 22, 0.9);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            cursor: pointer;
          }
          .push-banner.location-push {
            border-color: rgba(201, 168, 76, 0.3);
          }
          .push-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255,255,255,0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
          }
          .push-title {
            font-size: 12.5px;
            font-weight: 600;
            color: #FFFFFF;
            margin: 0 0 2px 0;
          }
          .push-desc {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
            line-height: 1.4;
          }
          .push-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            padding: 4px;
          }

          /* 오디오 파동 UI */
          .wave-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            height: 40px;
            position: absolute;
            top: calc(50% - 20px);
            left: 0;
            right: 0;
          }
          .wave-bar {
            width: 3px;
            height: 8px;
            background: var(--accent);
            border-radius: 2px;
            animation: waveAnim 1s ease-in-out infinite alternate;
          }
          @keyframes waveAnim {
            0% { height: 8px; }
            100% { height: 35px; }
          }

          /* 로딩 스피너 */
          .spin {
            animation: spinAnim 1s linear infinite;
          }
          @keyframes spinAnim {
            100% { transform: rotate(360deg); }
          }

          /* 모달 공통 */
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-5);
            z-index: 100;
          }
          .modal-content {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            width: 100%;
            box-shadow: var(--shadow-lg);
          }
        `}</style>
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

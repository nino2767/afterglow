"use client";

/**
 * app/(main)/report/page.tsx — 본전시 관람 후 동적 여운 리포트 & 스핀오프 브릿지 페이지
 */

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Download, Share2, Compass, Award, ArrowRight, Sparkles, 
  Calendar, MapPin, UserPlus, Copy, Check, EyeOff, FileText 
} from "lucide-react";
import BottomBar from "../../../components/BottomBar";
import NavigationShell from "../../../components/NavigationShell";

interface EmotionTag {
  emotion: string;
  axis: string;
}

interface Artwork {
  id: string;
  title: string;
  artist: string;
  section: string;
  default_emotion_chips: EmotionTag[];
}

const ARTWORKS_LIST: Artwork[] = [
  {
    id: "art_001",
    title: "윤슬",
    artist: "김하늘",
    section: "1구역: 잔물결의 언어",
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
    default_emotion_chips: [
      { emotion: "슬픔", axis: "melancholy" },
      { emotion: "압도적", axis: "awe" }
    ]
  }
];

// 페르소나 정의 매핑 테이블
const PERSONA_MAP: Record<string, {
  title: string;
  copy: string;
  gradient: string;
  keywords: string[];
}> = {
  serene: {
    title: "고요함을 머금은 감성 탐구자",
    copy: "물감 같은 푸른 투사 광원 속에서 흩어지는 빛들을 보며, 번잡한 일상의 소음을 잠시 걷어내고 내면의 차분함에 깊이 머물렀습니다.",
    gradient: "linear-gradient(135deg, #4A7BE8 0%, #C9A84C 100%)",
    keywords: ["고요함", "평온함", "잔물결"]
  },
  dreamy: {
    title: "꿈결을 거니는 신비로운 방랑자",
    copy: "일렁이는 안개와 몽환적인 파동 사이에서 현실의 감각을 내려놓고, 보이지 않는 무한한 상상과 신비로운 호흡의 세계를 거닐었습니다.",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    keywords: ["몽환적인", "신비로움", "빛무리"]
  },
  melancholy: {
    title: "우수를 품은 깊은 사색가",
    copy: "물러나는 소리와 어스름 속에 남겨진 아주 작은 빛 한 조각을 관조하며, 마음속에 깃든 슬픔의 아름다움과 깊은 사색의 잔향을 마주했습니다.",
    gradient: "linear-gradient(135deg, #1E293B 0%, #64748B 100%)",
    keywords: ["쓸쓸함", "우수", "어스름"]
  },
  warm: {
    title: "온기를 나누는 다정한 동반자",
    copy: "은은하고 따뜻하게 피어오르는 온기를 바라보며, 차가운 일상 속 나를 보듬어주는 위안과 다정한 연대의 따스함을 느꼈습니다.",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
    keywords: ["따뜻함", "위안", "다정함"]
  },
  awe: {
    title: "거대한 흐름에 압도된 관찰자",
    copy: "눈앞에 거대하게 몰아치는 파동과 압도적인 미디어아트 스케일 속에서, 경외감을 품고 예술이 자아내는 숭고함을 묵묵히 응시했습니다.",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    keywords: ["압도적", "경외감", "웅장함"]
  },
  contemplative: {
    title: "진리를 좇는 진지한 철학자",
    copy: "소리와 빛의 주기적인 패턴을 면밀히 분석하며 나를 대입해보고, 감정의 껍데기 아래 묻혀 있던 본질적인 고찰과 철학적 해답을 구했습니다.",
    gradient: "linear-gradient(135deg, #374151 0%, #111827 100%)",
    keywords: ["심오함", "본질", "내면고찰"]
  }
};

// 스핀오프 매칭 팝업 정보
const SPINOFF_MAP: Record<string, {
  conceptName: string;
  copyTemplate: string;
  venue: string;
}> = {
  sensory: {
    conceptName: "어비스 티 라운지 (Abyss Tea Lounge)",
    copyTemplate: "당신이 머문 차분한 여운을 찻잎의 은은한 향으로 재해석했습니다. 프라이빗 블렌딩 바에서 따뜻한 온기를 음미해보세요.",
    venue: "아트홀 서울 B1층"
  },
  archive: {
    conceptName: "메모리 아카이브 스토어 (Memory Archive)",
    copyTemplate: "오늘 기록한 우수 어린 시선들을 아날로그 필름과 엽서집으로 영원히 소장하세요. 사색가들을 위한 서재 팝업입니다.",
    venue: "아트홀 서울 B1층"
  },
  time: {
    conceptName: "스페이스 타임 포털 (Space Time Portal)",
    copyTemplate: "몽환적인 푸른 빛무리를 일상의 미니어처 무드등과 홀로그램 굿즈로 구현했습니다. 가상의 시간 틈새로 당신을 초대합니다.",
    venue: "아트홀 서울 B1층"
  },
  role: {
    conceptName: "멀티버스 크리에이티브 존",
    copyTemplate: "압도적인 미디어아트 속 거인처럼 나만의 디지털 아바타 굿즈를 커스텀할 수 있습니다. 웅장한 가상 세계관으로 초대합니다.",
    venue: "아트홀 서울 B1층"
  },
  story: {
    conceptName: "비주얼 도슨트 북 콘서트",
    copyTemplate: "빛의 심연 속 숨겨진 세계관 비하인드 스토리 책자와 큐레이터 대화집을 실물 도서로 출간했습니다. 작가 친필 사인 팝업 존입니다.",
    venue: "아트홀 서울 B1층"
  }
};

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [nickname, setNickname] = useState("관람객");
  const [isLogged, setIsLogged] = useState(false);
  const [reviewCopied, setReviewCopied] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // 동적 집계 상태
  const [loading, setLoading] = useState(true);
  const [allSnaps, setAllSnaps] = useState<string[]>([]);
  const [longestArtwork, setLongestArtwork] = useState({ title: "윤슬", dwell_sec: 45 });
  const [topAxis, setTopAxis] = useState("serene");
  const [photoCount, setPhotoCount] = useState(0);

  // 최종 도출된 프로필 & 초대장
  const [tasteProfile, setTasteProfile] = useState(PERSONA_MAP.serene);
  const [spinoffInvite, setSpinoffInvite] = useState({
    conceptName: "어비스 티 라운지",
    personalizedCopy: "",
    venue: "아트홀 서울 B1층"
  });
  const [aiReviewText, setAiReviewText] = useState("");

  useEffect(() => {
    // 열람 모드 여부 파악
    const mode = searchParams.get("mode");
    if (mode === "view") {
      setIsViewOnly(true);
    }

    try {
      // 1. 로그인 여부
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        setIsLogged(true);
      }

      // 2. 세션 데이터 로드
      const savedSession = localStorage.getItem("afterglow_session");
      let sessionData = savedSession ? JSON.parse(savedSession) : {};
      setNickname(sessionData.nickname || "관람객");

      // 3. 사진 데이터 로드
      const savedSnaps = localStorage.getItem("afterglow_user_snaps");
      const snapsObj = savedSnaps ? JSON.parse(savedSnaps) : {};
      
      const snapsList: string[] = [];
      Object.keys(snapsObj).forEach(key => {
        snapsList.push(...snapsObj[key]);
      });
      setAllSnaps(snapsList);
      setPhotoCount(snapsList.length);

      // 4. 머무른 시간 분석
      const dwells = sessionData.dwells || {};
      let maxDwellSec = 0;
      let maxDwellArtworkId = "art_001";
      Object.keys(dwells).forEach(artId => {
        if (dwells[artId] > maxDwellSec) {
          maxDwellSec = dwells[artId];
          maxDwellArtworkId = artId;
        }
      });
      const longestArt = ARTWORKS_LIST.find(a => a.id === maxDwellArtworkId) || ARTWORKS_LIST[0];
      setLongestArtwork({
        title: longestArt.title,
        dwell_sec: maxDwellSec > 0 ? maxDwellSec : 45 // 체류 기록 없으면 최소 45초 매핑
      });

      // 5. 동적 취향 채점 엔진 (Scoring Engine)
      const scores: Record<string, number> = {
        serene: 0,
        dreamy: 0,
        melancholy: 0,
        warm: 0,
        awe: 0,
        contemplative: 0
      };

      // 5.1. 온보딩 가중치 (+1점)
      const initialKeywords = sessionData.initial_keywords || [];
      initialKeywords.forEach((k: { axis: string }) => {
        if (scores[k.axis] !== undefined) scores[k.axis] += 1;
      });

      // 5.2. 감정 퀵 반응 가중치 (+2점)
      const emotionTags = sessionData.emotionTags || {};
      Object.keys(emotionTags).forEach(artId => {
        const list = emotionTags[artId] || [];
        list.forEach((k: { axis: string }) => {
          if (scores[k.axis] !== undefined) scores[k.axis] += 2;
        });
      });

      // 5.3. AI 대화 감정 칩 가중치 (+3점)
      const chatEmos = sessionData.chatEmotions || {};
      Object.keys(chatEmos).forEach(artId => {
        const list = chatEmos[artId] || [];
        list.forEach((k: { axis: string }) => {
          if (scores[k.axis] !== undefined) scores[k.axis] += 3;
        });
      });

      // 5.4. 체류 시간 비례 가중치 (60초당 +1점)
      Object.keys(dwells).forEach(artId => {
        const sec = dwells[artId] || 0;
        const art = ARTWORKS_LIST.find(a => a.id === artId);
        if (art) {
          art.default_emotion_chips.forEach(chip => {
            scores[chip.axis] += Math.round(sec / 60);
          });
        }
      });

      // 최고 득점 축 산출
      let topAxisKey = "serene";
      let topScore = -1;
      Object.keys(scores).forEach(axis => {
        if (scores[axis] > topScore) {
          topScore = scores[axis];
          topAxisKey = axis;
        }
      });

      setTopAxis(topAxisKey);

      // 6. 결과 셋업
      const selectedProfile = PERSONA_MAP[topAxisKey] || PERSONA_MAP.serene;
      setTasteProfile(selectedProfile);

      // 스핀오프 매칭
      let spinoffKey = "story";
      if (topAxisKey === "serene" || topAxisKey === "warm") spinoffKey = "sensory";
      else if (topAxisKey === "melancholy" || topAxisKey === "contemplative") spinoffKey = "archive";
      else if (topAxisKey === "dreamy") spinoffKey = "time";
      else if (topAxisKey === "awe") spinoffKey = "role";

      const spinoffInfo = SPINOFF_MAP[spinoffKey] || SPINOFF_MAP.story;
      
      // 대화에서 사용한 감정 단어 인용 (없으면 기본 키워드)
      let quotedEmotion = selectedProfile.keywords[0];
      const allSelectedEmos: string[] = [];
      Object.keys(chatEmos).forEach(artId => {
        chatEmos[artId].forEach((e: { emotion: string }) => allSelectedEmos.push(e.emotion));
      });
      if (allSelectedEmos.length > 0) {
        quotedEmotion = allSelectedEmos[0];
      }

      const personalizedText = `'#${quotedEmotion}'의 울림을 마음에 남기신 ${sessionData.nickname || "관람객"}님. ${spinoffInfo.copyTemplate}`;

      setSpinoffInvite({
        conceptName: spinoffInfo.conceptName,
        personalizedCopy: personalizedText,
        venue: spinoffInfo.venue
      });

      // 7. AI 자동 리뷰 감상평 생성
      const reviewText = `오늘 아트홀 서울 《빛의 심연》 전시회에서 가상의 스냅컷 ${snapsList.length}장을 남기며 온전한 여운을 누렸습니다. 특히 가장 기억에 남는 작품은 《${longestArt.title}》이었으며, 제 마음에 깊게 닿은 감정은 #${quotedEmotion}이었습니다. 내면의 목소리와 예술의 시각적 주기가 맞닿아 마음에 고요하고 따뜻한 위안이 차올랐던 멋진 전시였습니다. #빛의심연 #AFTERGLOW #전시리뷰`;
      setAiReviewText(reviewText);

      // 저장된 마이리포트로 기록 이관 처리
      localStorage.setItem("afterglow_last_report", JSON.stringify({
        tasteProfile: selectedProfile,
        invite: {
          conceptName: spinoffInfo.conceptName,
          personalizedCopy: personalizedText,
          redeemed: false,
          issued_at: Date.now()
        },
        aiReviewText
      }));

      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [searchParams]);

  // 이미지 저장/공유 모사
  function handleSaveImage() {
    alert("페르소나 카드가 스마트폰 갤러리에 저장되었습니다. (Mock)");
  }

  function handleShare() {
    try {
      navigator.clipboard.writeText(window.location.href);
      alert("리포트 링크가 클립보드에 복사되었습니다!");
    } catch (e) {
      alert("공유 링크 복사에 실패했습니다.");
    }
  }

  // 리뷰 클립보드 복사
  function handleCopyReview() {
    try {
      navigator.clipboard.writeText(aiReviewText);
      setReviewCopied(true);
      setTimeout(() => setReviewCopied(false), 2000);
    } catch (e) {
      alert("클립보드 복사에 실패했습니다.");
    }
  }

  if (loading) {
    return (
      <div className="screen justify-center items-center" style={{ background: "var(--bg)" }}>
        <p className="t-body" style={{ color: "var(--accent)" }}>
          <Sparkles className="spin" size={24} style={{ margin: "0 auto 12px" }} />
          오늘의 감정 조각들을 모아 리포트를 빚고 있어요...
        </p>
      </div>
    );
  }

  return (
    <NavigationShell 
      title={isViewOnly ? "보관함 리포트" : "오늘의 여운"} 
      showBack={true} 
      onBack={() => router.push(isViewOnly ? "/home" : "/artwork")}
    >
      <div style={{
        padding: "var(--space-6) var(--space-5) var(--space-12)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        flex: 1,
        background: "var(--bg)"
      }}>

        {/* ── 열람 모드 배너 ── */}
        {isViewOnly && (
          <div style={{
            background: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.3)",
            padding: "8px 12px",
            borderRadius: 8,
            textAlign: "center",
            fontSize: 12,
            color: "var(--accent)"
          }}>
            📂 보관함에서 예전 여운 리포트를 확인하고 계십니다.
          </div>
        )}

        {/* ── 페르소나 취향 카드 ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div
            id="persona-card"
            style={{
              background: tasteProfile.gradient,
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-6)",
              color: "#FFFFFF",
              boxShadow: "var(--shadow-md)",
              position: "relative",
              overflow: "hidden",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div style={{
              position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
              pointerEvents: "none"
            }} />

            <div>
              <span className="t-micro" style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
                AFTERGLOW 취향 유형
              </span>
              <h2 className="t-heading" style={{ color: "#FFFFFF", fontSize: 24, marginTop: 4, marginBottom: "var(--space-3)", fontFamily: "var(--font-display)" }}>
                {tasteProfile.title}
              </h2>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                {tasteProfile.keywords.map((k) => (
                  <span
                    key={k}
                    style={{
                      background: "rgba(255, 255, 255, 0.16)",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: 12,
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    #{k}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.15)", paddingTop: "var(--space-4)", marginTop: "var(--space-6)" }}>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255, 255, 255, 0.9)" }}>
                {tasteProfile.copy}
              </p>
            </div>
          </div>

          {/* 저장 & 공유 버튼 */}
          <div style={{ display: "flex", gap: "var(--space-2)", width: "100%" }}>
            <button className="btn btn-outline" style={{ flex: 1, gap: 6, fontSize: 13 }} onClick={handleSaveImage}>
              <Download size={14} /> 이미지로 저장
            </button>
            <button className="btn btn-outline" style={{ flex: 1, gap: 6, fontSize: 13 }} onClick={handleShare}>
              <Share2 size={14} /> 카드 공유
            </button>
          </div>

          {/* 계정 저장 유도 CTA (비로그인 상태일 때만 노출) */}
          {!isLogged && (
            <div style={{
              background: "var(--surface-2)",
              border: "1px dashed var(--accent)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4) var(--space-5)",
              marginTop: "var(--space-2)",
              textAlign: "center"
            }}>
              <p className="t-caption" style={{ marginBottom: "var(--space-3)", fontSize: 13 }}>
                이 여운 리포트가 사라지지 않게 저장해두세요.
              </p>
              <button
                className="btn btn-primary btn-full btn-sm"
                onClick={() => router.push("/login?trigger=report")}
                style={{ gap: 6 }}
              >
                <UserPlus size={14} />
                계정 만들고 저장하기
              </button>
            </div>
          )}
        </div>

        {/* ── 오늘 가장 머문 순간 (관람 하이라이트 통계) ── */}
        <div className="card" style={{ padding: "var(--space-5)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>관람 하이라이트</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <Award size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div>
                <p className="t-title" style={{ fontSize: 14, marginBottom: 2 }}>시선이 가장 머문 곳</p>
                <p className="t-caption">《{longestArtwork.title}》 작품 앞 ({longestArtwork.dwell_sec}초 머무름)</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <Compass size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div>
                <p className="t-title" style={{ fontSize: 14, marginBottom: 2 }}>지배적이었던 감정선</p>
                <p className="t-caption">
                  #{tasteProfile.keywords[0]}·#{tasteProfile.keywords[1]} 느낌이 오늘 당신에게 짙은 잔향을 남겼습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 내가 촬영한 전시 스냅샷 갤러리 (사진 업로드 매핑 결과물) ── */}
        <div className="card" style={{ padding: "var(--space-5)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>기록된 시선들 (도슨트 스냅샷)</p>
          
          {allSnaps.length > 0 ? (
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {allSnaps.map((snap, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "var(--radius-md)",
                    backgroundImage: `url(${snap})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid var(--border)",
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          ) : (
            // [예외 케이스 처리] 사진 없이 퇴장한 경우 축약된 "오늘의 발자국" 레이아웃으로 이원화
            <div style={{ textAlign: "center", padding: "16px 0", color: "var(--ink-muted)" }}>
              <EyeOff size={20} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
              <p style={{ fontSize: 12.5, margin: "0 0 4px 0", fontWeight: 600 }}>오늘 스틸컷은 남기지 않으셨네요.</p>
              <p style={{ fontSize: 11, margin: 0 }}>카메라로 사진을 찰칵 찍어두면 도슨트 기록과 함께 영구 저장됩니다.</p>
            </div>
          )}
        </div>

        {/* ── AI가 작성해 준 감성 전시 감상평 (리뷰 자동 생성 및 복사) ── */}
        <div className="card" style={{ padding: "var(--space-5)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={14} color="var(--accent)" />
              <p className="t-micro" style={{ margin: 0 }}>AI가 정제해 준 오늘의 감상 리뷰</p>
            </div>
            
            <button
              onClick={handleCopyReview}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                color: reviewCopied ? "#10B981" : "var(--accent)",
                fontWeight: 600
              }}
            >
              {reviewCopied ? <Check size={12} /> : <Copy size={12} />}
              {reviewCopied ? "복사완료!" : "감상평 복사"}
            </button>
          </div>

          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "12px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.6, color: "var(--ink-2)" }}>
            "{aiReviewText}"
          </div>
        </div>

        {/* ── Bridge 초대장 ── */}
        <div style={{
          background: "#0D0D0F",
          color: "#FFFFFF",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%",
            border: "1.5px solid rgba(255, 255, 255, 0.05)",
            pointerEvents: "none"
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-4)" }}>
            <Sparkles size={14} color="var(--accent-light)" />
            <span className="t-micro" style={{ color: "var(--accent-light)", fontWeight: 600 }}>BRIDGE INVITATION</span>
          </div>

          <h3 className="t-heading" style={{ color: "#FFFFFF", fontSize: 20, marginBottom: "var(--space-3)", fontFamily: "var(--font-display)" }}>
            {spinoffInvite.conceptName}로의 초대
          </h3>

          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "rgba(255, 255, 255, 0.75)", marginBottom: "var(--space-5)" }}>
            {spinoffInvite.personalizedCopy}
          </p>

          <button
            id="btn-go-spinoff"
            className="btn btn-primary btn-full btn-lg"
            onClick={() => router.push("/spinoff/abyss-wave")}
            style={{ gap: 6 }}
          >
            초대장 열어보기
            <ArrowRight size={16} />
          </button>

          <div style={{
            marginTop: "var(--space-5)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "var(--space-4)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11.5,
            color: "rgba(255,255,255,0.45)"
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={11} /> 팝업 기간 내 유효</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {spinoffInvite.venue}</span>
          </div>
        </div>

      </div>
    </NavigationShell>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="screen justify-center items-center">
        <p className="t-body">리포트를 집계하고 있어요...</p>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}

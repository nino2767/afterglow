"use client";

/**
 * app/(account)/home/page.tsx — "여운의 우주" 감성 아카이브 홈화면 (3안 고도화 및 테스트 토글 추가)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, Sparkles, MapPin, Search, Volume2, 
  VolumeX, Ticket, X, RotateCcw 
} from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";

interface InviteItem {
  invite_id: string;
  conceptName: string;
  status: "open_solo" | "open_concurrent" | "ready" | "planning" | "closed" | "archived";
  personalizedCopy: string;
  validity: string;
}

interface ReportItem {
  exhibition_id: string;
  name: string;
  date: string;
  personaTitle: string;
  bgGradient: string;
  keywords: string[];
}

export default function AccountHomePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("관람객");
  const [isLogged, setIsLogged] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false); // 티켓 보유(구매 완료) 상태
  
  // 리포트 & 초대장 데이터
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [invites, setInvites] = useState<InviteItem[]>([]);
  
  // 검색 및 가상 필터링 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{
    show: boolean;
    loading: boolean;
    text: string;
  }>({
    show: false,
    loading: false,
    text: ""
  });

  // 맛보기 도슨트 모달 & TTS 상태
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  // 티켓 활성화 모달 상태
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCodeInput, setTicketCodeInput] = useState("");

  // 🌟 다른 관람객 후기 모달 상태
  const [showReviewDetailModal, setShowReviewDetailModal] = useState<any>(null);

  const searchTags = ["#고요함", "#몽환적", "#압도적", "#쓸쓸함", "#따뜻한 위안"];
  const isEmptyState = reports.length === 0 && invites.length === 0;

  // 🌟 진행 중인 다중 전시 목록 데이터
  const [exhibitions] = useState([
    {
      id: "pj_abyss",
      title: "빛의 심연 (Abyss of Light)",
      subtitle: "인간의 고독과 안식을 일렁이는 미디어아트로 표현한 몰입형 전시입니다. AI 가이드 음성과 함께 감상해보세요.",
      hall: "아트홀 서울",
      tag: "도슨트 패키지 운영 중",
      emoji: "✦",
      color: "radial-gradient(circle, rgba(139,46,74,0.35) 0%, #09090B 100%)"
    },
    {
      id: "pj_echo",
      title: "잔향의 숲 (Echoing Forest)",
      subtitle: "자연의 숨소리와 은은한 초록 광원들이 빚어내는 숲속 사색 아카이빙 전시입니다. F&B 스핀오프 카페 연계.",
      hall: "아트갤러리 스페이스",
      tag: "F&B 연계 특전 제공",
      emoji: "🌿",
      color: "radial-gradient(circle, rgba(46,139,74,0.25) 0%, #09090B 100%)"
    }
  ]);

  // 🌟 관람객 후기 스냅 데이터
  const [guestReviews] = useState([
    {
      id: "p1",
      color: "linear-gradient(135deg, #1E1520, #0D0D0F)",
      artwork: "윤슬 (Shine of Wave)",
      nickname: "고요한 바다",
      comment: "전시장 바닥에 누워 천장의 푸른 일렁임을 보고 있으니 마음의 복잡한 찌꺼기들이 한꺼번에 씻겨 나가는 느낌이었습니다. 물결 소리의 울림이 귓가에 맴도네요."
    },
    {
      id: "p2",
      color: "linear-gradient(135deg, #09090B, #2D3748)",
      artwork: "심연의 호흡 (Abyss Breath)",
      nickname: "숨쉬는 섬",
      comment: "광원이 부드럽게 팽창했다가 수축할 때 저도 모르게 호흡을 맞추며 명상에 빠졌습니다. 정말 오랜만에 느껴본 복잡하지 않은 순수한 정적이었습니다."
    },
    {
      id: "p3",
      color: "linear-gradient(135deg, #2D1A1A, #0D0D0F)",
      artwork: "기억의 잔광 (Memory Light)",
      nickname: "사색의 별",
      comment: "전시를 다 보고 나오자마자 받은 AI 여운 리포트가 압권이었습니다. 제가 머물렀던 위치와 제 마음의 결을 이렇게 정확하게 정리해 줄 줄은 몰랐습니다."
    }
  ]);

  useEffect(() => {
    // 1. 로그인 및 티켓 상태 확인
    try {
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        setIsLogged(true);
        const parsed = JSON.parse(account);
        setNickname(parsed.nickname || "관람객");
      }

      // 로컬 세션(afterglow_session)이 있으면 본전시 활성화된 구매 유저로 분류
      const savedSession = localStorage.getItem("afterglow_session");
      if (savedSession) {
        setIsPurchased(true);
      }
    } catch (e) {
      console.error(e);
    }

    // 기본 리포트 및 초대장 Mock 로드
    setReports([
      {
        exhibition_id: "pj_abyss",
        name: "빛의 심연",
        date: "2026.07.04",
        personaTitle: "고요함을 머금은 감성 탐구자",
        bgGradient: "linear-gradient(135deg, #7B9EE8 0%, #C9A84C 100%)",
        keywords: ["고요함", "몽환적인", "심오함"]
      },
      {
        exhibition_id: "pj_garden",
        name: "무한의 정원",
        date: "2026.03.02",
        personaTitle: "따뜻한 봄의 정원사",
        bgGradient: "linear-gradient(135deg, #E8A84C 0%, #7B9EE8 100%)",
        keywords: ["따뜻함", "포근함"]
      }
    ]);

    setInvites([
      {
        invite_id: "INV-XYZ789",
        conceptName: "어비스 티 라운지",
        status: "open_concurrent",
        personalizedCopy: "차분한 찻잎 블렌딩이 준비되어 있습니다.",
        validity: "~ 2026.08.31"
      }
    ]);
  }, []);

  // 오디오 정리
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 맛보기 도슨트 재생
  function playPreviewTts() {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("음성 지원 기능이 제한된 브라우저입니다.");
      return;
    }

    if (previewPlaying) {
      window.speechSynthesis.cancel();
      setPreviewPlaying(false);
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      "반갑습니다. 《빛의 심연》 전시 중 윤슬 작품의 맛보기 도슨트입니다. 파란 투사 광원 아래서 일렁이는 파동을 가만히 응시해보세요. 번잡했던 소음이 걷히며 마음이 편안해집니다."
    );
    utterance.lang = "ko-KR";
    utterance.onend = () => setPreviewPlaying(false);
    utterance.onerror = () => setPreviewPlaying(false);
    
    synth.speak(utterance);
    setPreviewPlaying(true);
  }

  function handleClosePreview() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPreviewPlaying(false);
    setShowPreviewModal(false);
  }

  // 가상 티켓 등록 액션
  function handleActivateTicket() {
    if (!ticketCodeInput.trim()) {
      alert("티켓 번호 또는 코드를 입력해주세요.");
      return;
    }

    try {
      localStorage.setItem("afterglow_session", JSON.stringify({
        visitor_id: `v_${Date.now()}`,
        session_id: `s_${Date.now()}`,
        nickname: nickname || "관람객",
        initial_keywords: [{ emotion: "고요함", axis: "serene" }],
        dwells: {},
        emotionTags: {},
        chatEmotions: {}
      }));
      setIsPurchased(true);
      setShowTicketModal(false);
      setTicketCodeInput("");
      alert("티켓 등록이 성공적으로 완료되었습니다! 가이드를 시작합니다.");
      router.push("/artwork"); 
    } catch (e) {
      //
    }
  }

  // 테스트 모드 스위칭 핸들러 (사용자 테스트 편의성 보장)
  function toggleTestMode() {
    if (isPurchased) {
      localStorage.removeItem("afterglow_session");
      setIsPurchased(false);
      alert("테스트: '미구매 일반 게스트' 상태로 전환되었습니다. 감성 탐색 홈을 체험해 보세요!");
    } else {
      localStorage.setItem("afterglow_session", JSON.stringify({
        visitor_id: `v_${Date.now()}`,
        nickname: nickname,
        initial_keywords: []
      }));
      setIsPurchased(true);
      alert("테스트: '본전시 티켓 소지자' 상태로 전환되었습니다. 햄버거 메뉴 및 보관함 카드를 체험해 보세요!");
    }
  }

  // 🌟 AI 감성 검색 트리거
  function handleSearchSubmit(queryText: string) {
    if (!queryText.trim()) return;
    
    setSearchResult({ show: true, loading: true, text: "" });

    // AI 타이핑 및 답변 제공 지연 구현 (Perplexity 스타일 로딩 느낌)
    setTimeout(() => {
      let responseText = "";
      if (queryText.includes("고요함") || queryText.includes("조용")) {
        responseText = "✦ 오늘의 감정인 [고요함]에 귀를 기울여 보았습니다.\n\n적막 속에서 잔물결을 마주하며 사색할 수 있는 《빛의 심연 - 윤슬》 작품 코스를 제안합니다. 복잡한 생각을 비우고 온전한 쉼에 도달할 수 있도록 큐레이션해 드릴게요.\n\n관람을 마친 뒤에는 어비스 티 라운지에서 차분한 말차 블렌딩 티를 곁들이며 조용히 머무는 여정을 추천해 드립니다.";
      } else if (queryText.includes("몽환") || queryText.includes("신기")) {
        responseText = "✦ 오늘의 감정인 [몽환적]에 가장 어울리는 사색 서신입니다.\n\n몽환적인 녹색 잎사귀 틈으로 쏟아지는 빛줄기 아래에서 잔잔한 연무를 체험할 수 있는 《잔향의 숲 - 이끼의 숨결》 구역을 추천합니다.\n\n마법 같은 몽환적 정취 속에서 촬영된 스냅샷은 나만의 감정 리포트로 남겨 영원히 보존할 수 있습니다.";
      } else {
        responseText = `✦ 입력하신 여운 [${queryText}]에 상응하는 AI 큐레이터의 추천 코스입니다.\n\n소용돌이치는 일상 속에서 잠시 나를 마주할 수 있도록 설계된 몰입형 미디어아트 《빛의 심연》을 추천해 드립니다.\n\n나만의 큐레이션을 시작해 보시겠어요?`;
      }

      setSearchResult({
        show: true,
        loading: false,
        text: responseText
      });
    }, 800);
  }

  return (
    <NavigationShell title="AFTERGLOW" showBack={false}>
      <div style={{
        flex: 1,
        padding: "var(--space-5) var(--space-5) 50px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        background: "var(--bg)",
        position: "relative"
      }}>
        
        {/* 헤더 프로필 및 테스트 스위치 버튼 (우측 상단 로그인 유도 버튼 삭제 반영 완료) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 className="t-heading" style={{ fontSize: 18, lineHeight: 1.3, margin: 0 }}>
              안녕하세요,<br />
              <span className="t-italic" style={{ color: "var(--gold)" }}>{nickname}님</span> 👋
            </h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            {/* 시나리오 테스트용 퀵 토글 스위치 */}
            <button
              onClick={toggleTestMode}
              style={{
                fontSize: 10,
                background: "rgba(201,168,76,0.08)",
                color: "var(--gold)",
                border: "1px dashed var(--gold)",
                padding: "5px 10px",
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600
              }}
            >
              <RotateCcw size={10} />
              {isPurchased ? "시나리오: 게스트 모드로" : "시나리오: 구매 유저로"}
            </button>
          </div>
        </div>

        {/* ── [Case 1] 본전시 티켓 활성화된 구매자 화면 ── */}
        {isPurchased && (
          <div className="anim-fade" style={{
            background: "linear-gradient(135deg, #1C1917 0%, #0D0D0F 100%)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-5)",
            border: "1px solid rgba(201, 168, 76, 0.4)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)"
            }} />
            
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Ticket size={14} color="var(--accent)" />
              <span className="t-micro" style={{ color: "var(--accent)", fontWeight: 600 }}>활성화된 관람 티켓</span>
            </div>

            <h3 className="t-title" style={{ color: "#FFFFFF", fontSize: 17, marginBottom: 4 }}>《빛의 심연》 가이드 입장 가능</h3>
            <p className="t-caption" style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 14 }}>
              실시간 도슨트 큐레이션 및 나만의 감정 아카이빙 세션이 준비되어 있습니다.
            </p>

            <button
              className="btn btn-primary btn-full btn-sm"
              onClick={() => router.push("/artwork")}
              style={{ gap: 6 }}
            >
              관람 도슨트 시작하기
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── [Case 2] 미구매 고객을 위한 감성 탐색 홈 (3안 고도화 버전) ── */}
        {!isPurchased && (
          <div className="anim-fade" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            
            {/* 1. 감성 검색창 (구글 / ChatGPT 스타일 비중 확대) */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: "24px 20px",
              boxShadow: "var(--shadow-md)"
            }}>
              <p className="t-mono" style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>
                AI Emotion Curation
              </p>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", marginBottom: 16 }}>
                지금 내 안의 감정어와 함께 전시 코스를 받아보세요.
              </h3>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                background: "var(--surface-2)",
                borderRadius: "var(--radius-lg)",
                padding: "10px var(--space-4)",
                border: "1px solid var(--border)"
              }}>
                <Search size={18} color="var(--ink-muted)" style={{ marginRight: 10 }} />
                <input 
                  type="text"
                  placeholder="오늘 어떤 여운을 만나고 싶으신가요?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit(searchQuery);
                  }}
                  style={{
                    flex: 1, border: "none", background: "transparent",
                    outline: "none", fontSize: 13.5, color: "var(--ink)"
                  }}
                />
                <button 
                  onClick={() => handleSearchSubmit(searchQuery)}
                  style={{
                    background: "var(--gold)", color: "#000", border: "none", borderRadius: 8,
                    padding: "4px 12px", fontSize: 12, fontWeight: "bold", cursor: "pointer"
                  }}
                >
                  보내기
                </button>
              </div>

              {/* 검색 추천 태그 칩 */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 12, paddingBottom: 2 }}>
                {searchTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handleSearchSubmit(tag);
                    }}
                    style={{
                      fontSize: 11.5, color: searchQuery === tag ? "#000000" : "var(--ink-muted)",
                      background: searchQuery === tag ? "var(--gold)" : "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border)",
                      padding: "5px 12px", borderRadius: 14, cursor: "pointer", whiteSpace: "nowrap",
                      transition: "all 0.2s"
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* 🌟 AI 감성 검색 결과 편지 엽서 (다음 시나리오 부재 버그 해결 및 AI 툴 스타일 완성) */}
              {searchResult.show && (
                <div style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 12,
                  background: "rgba(201, 168, 76, 0.05)",
                  border: "1px solid rgba(201, 168, 76, 0.2)",
                  animation: "fadeInUp 0.4s ease forwards"
                }}>
                  {searchResult.loading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--gold)" }}>
                      <Sparkles size={14} className="spinning" />
                      <span>인공지능 큐레이터가 편지를 작성하고 있습니다...</span>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                        <Sparkles size={14} color="var(--gold)" />
                        <span style={{ fontSize: 11.5, color: "var(--gold)", fontWeight: 700 }}>AI 감성 추천 서신</span>
                      </div>
                      <p style={{
                        fontSize: 12.5,
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                        margin: 0
                      }}>
                        {searchResult.text}
                      </p>
                      
                      {/* 다음 시나리오로 부드럽게 이끄는 연동 버튼 */}
                      <div style={{ display: "flex", gap: 10, marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                        <button 
                          className="btn btn-primary btn-xs"
                          style={{ flex: 1, fontSize: 11.5 }}
                          onClick={() => {
                            setShowTicketModal(true);
                          }}
                        >
                          이 코스로 예약/전시 보기
                        </button>
                        <button 
                          className="btn btn-outline btn-xs"
                          style={{ fontSize: 11.5, color: "var(--ink-muted)" }}
                          onClick={() => setSearchResult({ show: false, loading: false, text: "" })}
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. 진행 중인 전시 카드 (다중 전시 케이스 대응 완료) */}
            <div>
              <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>현재 진행 중인 전시 목록 ({exhibitions.length}개)</p>
              
              {/* 가로 슬라이더 캐러셀 */}
              <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 6 }}>
                {exhibitions.map(ex => (
                  <div key={ex.id} style={{
                    minWidth: "290px",
                    width: "290px",
                    background: "linear-gradient(135deg, #09090B 0%, #18181B 100%)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-md)",
                    flexShrink: 0
                  }}>
                    {/* 전시 가상 썸네일 아트 */}
                    <div style={{
                      height: 110,
                      background: ex.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 36, color: "rgba(201,168,76,0.25)"
                    }}>
                      {ex.emoji}
                    </div>
                    
                    <div style={{ padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, background: "rgba(201,168,76,0.08)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.15)", padding: "1px 6px", borderRadius: 6 }}>
                          {ex.tag}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--ink-muted)" }}><MapPin size={9} style={{ display: "inline", marginRight: 2 }} />{ex.hall}</span>
                      </div>

                      <h3 className="t-title" style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", marginBottom: 4 }}>
                        {ex.title}
                      </h3>
                      <p className="t-caption" style={{ fontSize: 11.5, lineHeight: 1.45, color: "var(--ink-muted)", marginBottom: 12, height: "48px", overflow: "hidden" }}>
                        {ex.subtitle}
                      </p>

                      <div style={{ display: "flex", gap: 8 }}>
                        {/* 맛보기 도슨트 버튼 */}
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ flex: 1, gap: 4, fontSize: 11.5 }}
                          onClick={() => setShowPreviewModal(true)}
                        >
                          <Volume2 size={12} />
                          맛보기 청취
                        </button>
                        
                        {/* 티켓 등록/활성화 -> 버튼명 피드백 반영: 전시 관람하기 */}
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, gap: 4, fontSize: 11.5 }}
                          onClick={() => setShowTicketModal(true)}
                        >
                          <Ticket size={12} />
                          전시 관람하기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 커뮤니티 여운 피드 스틸컷 맛보기 (도슨트 재생 상충 버그 -> 후기 전용 모달 연동 완료) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                <p className="t-micro">다른 관람객들의 여운 조각 스냅</p>
              </div>

              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {guestReviews.map(item => (
                  <div key={item.id} style={{
                    width: 120, height: 110, borderRadius: 10, background: item.color,
                    border: "1px solid var(--border)", flexShrink: 0, padding: 8,
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    color: "#FFFFFF", cursor: "pointer", transition: "transform 0.2s"
                  }} 
                  onClick={() => setShowReviewDetailModal(item)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                  >
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>@{item.nickname}</span>
                    <div>
                      <p style={{ fontSize: 10.5, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.artwork}</p>
                      <span style={{ fontSize: 9, color: "var(--gold)" }}>✦ 여운보기</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── 최근 다녀온 전시 (리포트 보관함) ── */}
        {isPurchased && !isEmptyState && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
              <p className="t-micro">나의 전시 여운 보관함</p>
              <button
                onClick={() => router.push("/my-reports")}
                style={{ background: "transparent", border: "none", fontSize: 11.5, color: "var(--accent)", fontWeight: 500, cursor: "pointer" }}
              >
                전체보기
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
              {reports.slice(0, 2).map((rep) => (
                <div
                  key={rep.exhibition_id}
                  className="card anim-fade"
                  onClick={() => router.push("/report?mode=view")}
                  style={{
                    background: rep.bgGradient,
                    padding: "var(--space-4) var(--space-4) 14px",
                    color: "#FFFFFF",
                    minHeight: 120,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <div>
                    <span className="t-mono" style={{ fontSize: 9.5, color: "rgba(255,255,255,0.7)" }}>{rep.date}</span>
                    <h4 style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginTop: 2,
                      lineHeight: 1.25,
                      color: "#FFFFFF",
                      fontFamily: "var(--font-display)"
                    }}>
                      {rep.personaTitle}
                    </h4>
                  </div>
                  <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.8)" }}>
                    《{rep.name}》
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 지금 확인할 것 (활성 초대장) ── */}
        {isPurchased && invites.length > 0 && (
          <div className="anim-fade">
            <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>지금 확인할 것</p>
            <div
              className="card"
              onClick={() => router.push("/spinoff/abyss-wave")}
              style={{
                padding: "var(--space-5)",
                border: "1px solid var(--accent)",
                background: "var(--surface-2)",
                cursor: "pointer",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span className="badge badge-accent" style={{ fontSize: 10, background: "rgba(201,168,76,0.1)", color: "var(--accent)" }}>
                  초대장 연동 ✦
                </span>
                <span className="t-mono" style={{ fontSize: 11, color: "var(--ink-muted)" }}>{invites[0].validity}</span>
              </div>

              <h3 className="t-title" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                {invites[0].conceptName}
              </h3>
              <p className="t-caption" style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.4, marginBottom: 12 }}>
                {invites[0].personalizedCopy}
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                <span style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
                  확인하기 <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── 🔊 맛보기 도슨트 팝업 모달 ── */}
        {showPreviewModal && (
          <div className="modal-overlay" style={{ zIndex: 1001 }}>
            <div className="modal-content anim-up" style={{ maxWidth: 340, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>🔊 도슨트 맛보기 청취</span>
                <button className="btn btn-ghost" onClick={handleClosePreview} style={{ padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{
                height: 100, background: "linear-gradient(135deg, #1E1520 0%, #0D0D0F 100%)",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent)", fontSize: 36, marginBottom: "var(--space-4)", position: "relative"
              }}>
                ✦
                {previewPlaying && (
                  <div className="wave-container" style={{ height: 25, top: "calc(50% - 12.5px)" }}>
                    <div className="wave-bar" style={{ animationDelay: "0.1s" }} />
                    <div className="wave-bar" style={{ animationDelay: "0.3s" }} />
                    <div className="wave-bar" style={{ animationDelay: "0.5s" }} />
                    <div className="wave-bar" style={{ animationDelay: "0.2s" }} />
                  </div>
                )}
              </div>

              <h4 style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", marginBottom: 6 }}>《빛의 심연: 윤슬》 1분 맛보기</h4>
              <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                "반갑습니다. 빛의 심연 전시 중 윤슬 작품의 맛보기 도슨트입니다. 파란 투사 광원 아래서 일렁이는 파동을 가만히 응시해보세요..."
              </p>

              <button
                className={`btn btn-full ${previewPlaying ? "btn-primary" : "btn-outline"}`}
                onClick={playPreviewTts}
                style={{ gap: 6 }}
              >
                {previewPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                {previewPlaying ? "미리보기 오디오 일시정지" : "미리보기 음성 재생"}
              </button>

              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--ink-muted)" }}>
                전체 작품의 실시간 도슨트와 AI 대화, 여운 리포트를 활성화하려면 티켓을 구입/등록해주세요.
              </div>
            </div>
          </div>
        )}

        {/* ── 🎟️ 티켓 등록/활성화 팝업 모달 (전시 관람하기 트리거) ── */}
        {showTicketModal && (
          <div className="modal-overlay" style={{ zIndex: 1001 }}>
            <div className="modal-content anim-up" style={{ maxWidth: 340 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", margin: 0 }}>전시 관람 티켓 등록</h4>
                <button className="btn btn-ghost" onClick={() => setShowTicketModal(false)} style={{ padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                구매하신 전시 입장권 또는 영수증 하단의 **12자리 티켓 활성화 코드**를 입력하여 가이드를 켭니다.
              </p>

              <input
                type="text"
                className="input-field"
                placeholder="티켓 코드 입력 (예: ABYSS-2026)"
                value={ticketCodeInput}
                onChange={(e) => setTicketCodeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleActivateTicket(); }}
                style={{ marginBottom: "var(--space-4)" }}
              />

              <button
                className="btn btn-primary btn-full"
                onClick={handleActivateTicket}
              >
                티켓 등록 완료
              </button>

              {/* 디버그용 퀵 입력 가이드 */}
              <div style={{ marginTop: 12, padding: "8px 10px", background: "var(--surface-2)", borderRadius: 6, fontSize: 10.5, color: "var(--ink-muted)" }}>
                💡 **테스트 팁**: 아무 텍스트나 입력하고 등록을 누르면 가상 티켓이 성공적으로 연동됩니다.
              </div>
            </div>
          </div>
        )}

        {/* ── 💬 팝업 모달: 관람객 후기 상세 모달 (다른 관람객 후기 오류 해결) ── */}
        {showReviewDetailModal && (
          <div className="modal-overlay" style={{ zIndex: 1002 }} onClick={() => setShowReviewDetailModal(null)}>
            <div className="modal-content anim-up" style={{ maxWidth: 340 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <span style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700 }}>💬 다른 관람객의 여운 기록</span>
                <button className="btn btn-ghost" onClick={() => setShowReviewDetailModal(null)} style={{ padding: 4 }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{
                height: 100, background: showReviewDetailModal.color,
                borderRadius: 8, display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "16px", color: "#FFFFFF", marginBottom: "var(--space-4)", position: "relative"
              }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>@{showReviewDetailModal.nickname}</span>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{showReviewDetailModal.artwork}</h4>
              </div>

              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.55, margin: "0 0 16px 0", fontStyle: "italic" }}>
                "{showReviewDetailModal.comment}"
              </p>

              <button
                className="btn btn-full btn-outline btn-sm"
                onClick={() => {
                  setShowReviewDetailModal(null);
                  setShowTicketModal(true);
                }}
              >
                나도 이 전시 관람하고 평 남기기
              </button>
            </div>
          </div>
        )}

        {/* 하단 탭바 고정 제거 (햄버거 메뉴 및 FAB로 대체하여 레이아웃 개편) */}

        <style>{`
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-5);
          }
          .modal-content {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            width: 100%;
            box-shadow: var(--shadow-lg);
          }
          .wave-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            height: 25px;
            position: absolute;
            top: calc(50% - 12.5px);
            left: 0;
            right: 0;
          }
          .wave-bar {
            width: 2.5px;
            height: 6px;
            background: var(--accent);
            border-radius: 2px;
            animation: waveAnim 1s ease-in-out infinite alternate;
          }
          @keyframes waveAnim {
            0% { height: 6px; }
            100% { height: 22px; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .spinning {
            animation: spin 1.2s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </NavigationShell>
  );
}

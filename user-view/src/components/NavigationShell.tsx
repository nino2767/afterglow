"use client";

/**
 * NavigationShell.tsx — 상단바 및 뒤로가기/계정 아바타 공통 셸 (피드백 오버레이 통합 버전)
 */

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, User, MessageSquare, X, Send, Sparkles, Compass, Menu, Home, Ticket, FolderHeart, LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavigationShellProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}

interface FeedbackPin {
  id: string;
  page: string;
  xRatio: number;
  yRatio: number;
  comment: string;
  nickname: string;
  replies?: Array<{
    id: string;
    nickname: string;
    comment: string;
    date: string;
  }>;
}

export default function NavigationShell({
  title = "AFTERGLOW",
  showBack = true,
  onBack,
  children
}: NavigationShellProps) {
  const router = useRouter();

  const [isLogged, setIsLogged] = useState(false);
  const [nickname, setNickname] = useState("테스터");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 피드백 관련 상태
  const [isFeedbackMode, setIsFeedbackMode] = useState(false);
  const [clickPos, setClickPos] = useState<{ x: number; y: number; xRatio: number; yRatio: number } | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [localPins, setLocalPins] = useState<FeedbackPin[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. 유저 계정 확인
    try {
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        const parsed = JSON.parse(account);
        setIsLogged(true);
        setNickname(parsed.nickname || "관람객");
      } else {
        const savedSession = localStorage.getItem("afterglow_session");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          setNickname(parsed.nickname || "관람객");
        }
      }

      // 2. 저장된 피드백 핀 로드
      const savedFeedbacks = localStorage.getItem("afterglow_feedbacks");
      if (savedFeedbacks) {
        setLocalPins(JSON.parse(savedFeedbacks));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("afterglow_account");
    localStorage.removeItem("afterglow_session");
    setIsLogged(false);
    setIsDrawerOpen(false);
    alert("로그아웃 되었습니다.");
    router.push("/home");
    window.location.reload();
  };

  // 🌟 피드백 핀 완료(해결) 처리
  const handleResolvePin = async (id: string) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "resolve" })
      });
      const data = await response.json();
      if (data.success) {
        alert(`✏️ 이슈 ${id}가 이슈 트래커 파일에서 '✅ 완료' 처리되었습니다!`);
      } else {
        console.warn("이슈 파일 상태 업데이트 실패:", data.error);
        alert(`이슈 파일 업데이트 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (e) {
      console.log("로컬 서버 통신 실패 (오프라인/더블클릭 실행), 로컬 화면 상에서만 삭제를 수행합니다.");
    }

    // API 통신 여부와 별개로, 유저 편의를 위해 로컬 스토리지와 화면 상에서 즉시 제거
    const updated = localPins.filter(pin => pin.id !== id);
    setLocalPins(updated);
    localStorage.setItem("afterglow_feedbacks", JSON.stringify(updated));
    setActivePinId(null);
  };

  // 🌟 피드백 핀 대댓글 등록 처리
  const handleSendReply = async (id: string, replyComment: string) => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${mm}/${dd}`;

    try {
      const response = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action: "reply",
          replyComment,
          nickname: nickname || "크루"
        })
      });
      const data = await response.json();
      if (!data.success) {
        console.warn("이슈 트래커 파일 대댓글 기입 실패:", data.error);
      }
    } catch (e) {
      console.log("로컬 서버 API 통신 오류 (오프라인), 화면 및 로컬스토리지에만 저장합니다.");
    }

    // 로컬 스토리지에 대댓글 반영하여 누적
    const updated = localPins.map(pin => {
      if (pin.id === id) {
        const existingReplies = pin.replies || [];
        return {
          ...pin,
          replies: [
            ...existingReplies,
            {
              id: `rep_${Date.now()}`,
              nickname: nickname || "크루",
              comment: replyComment,
              date: dateStr
            }
          ]
        };
      }
      return pin;
    });

    setLocalPins(updated);
    localStorage.setItem("afterglow_feedbacks", JSON.stringify(updated));
  };

  // 피드백 오버레이 클릭 시 감지
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // 클릭 절대 좌표
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 전체 컨테이너 대비 가로세로 비율(%) 계산
    const xRatio = Math.round((clickX / rect.width) * 1000) / 10;
    const yRatio = Math.round((clickY / rect.height) * 1000) / 10;

    setClickPos({
      x: clickX,
      y: clickY,
      xRatio,
      yRatio
    });
    setCommentInput("");
  };

  // 피드백 등록 요청
  const handleSendFeedback = async () => {
    if (!commentInput.trim() || !clickPos) return;
    setIsSubmitting(true);

    const currentPage = typeof window !== "undefined" ? window.location.pathname : "/";

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: commentInput.trim(),
          page: currentPage,
          xRatio: clickPos.xRatio,
          yRatio: clickPos.yRatio,
          nickname: nickname
        })
      });

      const data = await response.json();
      if (data.success && data.feedback) {
        const newPin: FeedbackPin = {
          id: data.feedback.id,
          page: currentPage,
          xRatio: clickPos.xRatio,
          yRatio: clickPos.yRatio,
          comment: commentInput.trim(),
          nickname: nickname
        };

        const updatedPins = [...localPins, newPin];
        setLocalPins(updatedPins);
        localStorage.setItem("afterglow_feedbacks", JSON.stringify(updatedPins));

        // 성공 안내
        alert(`✏️ 피드백이 이슈 트래커 파일에 등록되었습니다! [이슈 번호: ${data.feedback.id}]`);
      } else {
        alert("이슈 등록 실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (e) {
      alert("네트워크 통신 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      setClickPos(null);
      setIsFeedbackMode(false);
    }
  };

  // 현재 페이지에 등록된 핀 필터링
  const currentPage = typeof window !== "undefined" ? window.location.pathname : "";
  const pinsOnCurrentPage = localPins.filter(pin => pin.page === currentPage);


  return (
    <div 
      ref={containerRef}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)", position: "relative" }}
    >
      {/* ── 상단 바 (Header) ── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        padding: "calc(var(--safe-top) + 12px) var(--space-6) 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px"
      }}>
        {/* 좌측 영역: 뒤로가기가 있으면 뒤로가기 노출, 없으면 레이아웃 균형용 빈 공간 */}
        <div style={{ width: "40px", display: "flex", alignItems: "center" }}>
          {showBack && (
            <button
              onClick={handleBack}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <ArrowLeft size={20} color="var(--ink)" />
            </button>
          )}
        </div>

        <span
          className="t-title"
          style={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.05em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "180px",
            textAlign: "center"
          }}
        >
          {title}
        </span>

        {/* 우측 상단 영역: 뒤로가기 유무와 상관없이 '상시 햄버거 메뉴 버튼' 제공 (이슈 #016 피드백 반영) */}
        <div style={{ width: "40px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <Menu size={22} color="var(--ink)" />
          </button>
        </div>
      </header>

      {/* ── 🍔 햄버거 사이드 메뉴 Drawer (fixed를 absolute로 수정하여 전체창 튀어남 방지 - 이슈 #015 반영) ── */}
      {isDrawerOpen && (
        <div 
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "flex-start"
          }}
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            style={{
              width: "280px",
              height: "100%",
              background: "#111115",
              borderRight: "1px solid var(--border)",
              padding: "var(--space-6) var(--space-5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
              animation: "slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            }}
            onClick={(e) => e.stopPropagation()} // 백드롭 닫기 방지
          >
            <div>
              {/* 드로어 헤더 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                <span className="t-italic" style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF", letterSpacing: "0.05em" }}>
                  AFTERGLOW
                </span>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-muted)" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* 메뉴 목록 (캐시/상태 꼬임 방지를 위해 window.location.href로 확실히 라우팅 - 이슈 #017 반영) */}
              <nav style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <button 
                  onClick={() => { window.location.href = "/home"; }}
                  style={{
                    background: "transparent", border: "none", color: "#FFF", fontSize: 15, fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "8px 10px", borderRadius: 8, transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Home size={18} color="var(--gold)" />
                  홈 화면
                </button>

                <button 
                  onClick={() => { window.location.href = "/artwork"; }}
                  style={{
                    background: "transparent", border: "none", color: "#FFF", fontSize: 15, fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "8px 10px", borderRadius: 8, transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Ticket size={18} color="var(--gold)" />
                  전시 관람 / 도슨트
                </button>

                <button 
                  onClick={() => { window.location.href = "/my-reports"; }}
                  style={{
                    background: "transparent", border: "none", color: "#FFF", fontSize: 15, fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "8px 10px", borderRadius: 8, transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <FolderHeart size={18} color="var(--gold)" />
                  여운 보관함
                </button>

                <button 
                  onClick={() => { window.location.href = "/spinoff/home"; }}
                  style={{
                    background: "transparent", border: "none", color: "#FFF", fontSize: 15, fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "8px 10px", borderRadius: 8, transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <Compass size={18} color="var(--gold)" />
                  스핀오프 전시관
                </button>

                <button 
                  onClick={() => { window.location.href = "/mypage"; }}
                  style={{
                    background: "transparent", border: "none", color: "#FFF", fontSize: 15, fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "8px 10px", borderRadius: 8, transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <User size={18} color="var(--gold)" />
                  마이페이지
                </button>
              </nav>
            </div>

            {/* 드로어 푸터 (로그인/로그아웃) */}
            <div>
              {isLogged ? (
                <button 
                  onClick={handleLogout}
                  style={{
                    background: "transparent", border: "none", color: "var(--accent-light)", fontSize: 14,
                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 10px", width: "100%"
                  }}
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              ) : (
                <button 
                  onClick={() => { window.location.href = "/login"; }}
                  style={{
                    background: "transparent", border: "none", color: "var(--gold)", fontSize: 14,
                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 10px", width: "100%"
                  }}
                >
                  <LogIn size={16} />
                  로그인 / 가입하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 애니메이션용 스타일 태그 */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>


      {/* ── 본문 콘텐츠 ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {children}

        {/* ── 화면 상에 누적 기록된 피드백 핀(✦) 렌더링 ── */}
        {!isFeedbackMode && pinsOnCurrentPage.map((pin) => (
          <div
            key={pin.id}
            style={{
              position: "absolute",
              left: `${pin.xRatio}%`,
              top: `${pin.yRatio}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 998,
              cursor: "pointer"
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActivePinId(activePinId === pin.id ? null : pin.id);
            }}
          >
            {/* 붉게 빛나는 핀 */}
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "rgba(232, 123, 123, 0.85)",
              border: "2.5px solid #FFFFFF",
              boxShadow: "0 0 10px rgba(232, 123, 123, 0.8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#FFFFFF", fontSize: 11, fontWeight: "bold",
              animation: "pulsePin 1.5s infinite alternate"
            }}>
              ✦
            </div>

            {/* 핀 호버/클릭 시 노출되는 디테일 말풍선 */}
            {activePinId === pin.id && (
              <div style={{
                position: "absolute", bottom: "135%", left: "50%", transform: "translateX(-50%)",
                width: 210, background: "rgba(20, 20, 22, 0.96)", border: "1px solid rgba(232,123,123,0.5)",
                borderRadius: 10, padding: "8px 12px", color: "#FFFFFF", fontSize: 11.5, zIndex: 1000,
                boxShadow: "0 6px 20px rgba(0,0,0,0.55)", pointerEvents: "auto", textAlign: "left"
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "var(--accent-light)", fontSize: 10 }}>
                  <span>{pin.id} · {pin.nickname}</span>
                  <button 
                    onClick={() => setActivePinId(null)}
                    style={{ background: "none", border: "none", color: "#AAA", cursor: "pointer", padding: 0 }}
                  >
                    <X size={10} />
                  </button>
                </div>
                <p style={{ margin: "0 0 8px 0", lineHeight: 1.4, wordBreak: "break-all" }}>{pin.comment}</p>
                
                {/* 대댓글 스레드 목록 */}
                {pin.replies && pin.replies.length > 0 && (
                  <div style={{
                    display: "flex", flexDirection: "column", gap: 6,
                    margin: "8px 0", padding: "6px 8px", background: "rgba(255,255,255,0.03)",
                    borderLeft: "2px solid var(--accent)", borderRadius: 4,
                    fontSize: 10, color: "rgba(255,255,255,0.8)", maxHeight: 80, overflowY: "auto"
                  }}>
                    {pin.replies.map(rep => (
                      <div key={rep.id} style={{ wordBreak: "break-all", lineHeight: 1.3 }}>
                        <strong style={{ color: "var(--gold)" }}>{rep.nickname}</strong>: {rep.comment}
                      </div>
                    ))}
                  </div>
                )}

                {/* 대댓글 입력 폼 */}
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  <input
                    type="text"
                    id={`reply-input-${pin.id}`}
                    placeholder="대댓글 입력..."
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                      borderRadius: 4, padding: "2px 6px", fontSize: 10, color: "#FFFFFF", outline: "none"
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = e.currentTarget.value.trim();
                        if (val) {
                          handleSendReply(pin.id, val);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const el = document.getElementById(`reply-input-${pin.id}`) as HTMLInputElement;
                      const val = el?.value.trim();
                      if (val) {
                        handleSendReply(pin.id, val);
                        el.value = "";
                      }
                    }}
                    style={{
                      background: "transparent", border: "1px solid var(--border)",
                      color: "var(--accent-light)", borderRadius: 4, padding: "2px 6px",
                      fontSize: 9, cursor: "pointer", fontWeight: "bold"
                    }}
                  >
                    등록
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleResolvePin(pin.id)}
                    style={{
                      background: "var(--accent)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    해결(완료)
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* ── 💬 피드백 등록 모드 오버레이 감지기 ── */}
      {isFeedbackMode && (
        <div 
          onClick={handleOverlayClick}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.25)",
            zIndex: 999,
            cursor: "crosshair",
            border: "2px dashed var(--accent)"
          }}
        >
          {/* 오버레이 가이드 라인 */}
          <div style={{
            position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
            background: "var(--accent)", color: "#FFFFFF", padding: "6px 14px", borderRadius: 20,
            fontSize: 11.5, fontWeight: 600, boxShadow: "var(--shadow-md)", pointerEvents: "none",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <Sparkles size={12} />
            화면의 피드백 의견을 남길 위치를 터치/클릭해주세요.
          </div>

          {/* 클릭 타겟 핀 팝업 */}
          {clickPos && (
            <div 
              style={{
                position: "absolute",
                left: clickPos.x,
                top: clickPos.y,
                transform: "translate(-50%, -50%)",
                pointerEvents: "auto"
              }}
              onClick={(e) => e.stopPropagation()} // 팝업 내부 터치 시 오버레이 클릭 방지
            >
              {/* 타겟 포인터 */}
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "var(--accent)", border: "2px solid #FFFFFF",
                boxShadow: "0 0 12px var(--accent)", margin: "0 auto 8px"
              }} />

              {/* 의견 작성 입력 창 */}
              <div style={{
                width: 220, background: "var(--surface)", border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-lg)", padding: "12px", boxShadow: "var(--shadow-lg)",
                transform: "translateX(-45%)", display: "flex", flexDirection: "column", gap: 8
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--ink-muted)" }}>위치: X {clickPos.xRatio}%, Y {clickPos.yRatio}%</span>
                  <button className="btn btn-ghost" onClick={() => setClickPos(null)} style={{ padding: 2 }}>
                    <X size={14} />
                  </button>
                </div>
                <textarea
                  className="input-field"
                  placeholder="여기에 개선 피드백을 적어주세요. 제출하면 문서에 기록됩니다."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  style={{ fontSize: 12, height: 60, resize: "none", padding: 6 }}
                  maxLength={100}
                  autoFocus
                />
                <button
                  className="btn btn-primary btn-sm btn-full"
                  onClick={handleSendFeedback}
                  disabled={!commentInput.trim() || isSubmitting}
                  style={{ gap: 6 }}
                >
                  <Send size={12} />
                  {isSubmitting ? "기록 중..." : "피드백 제출 (이슈 등록)"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 💬 피드백 쓰기 플로팅 버튼 (FAB) ── */}
      <div style={{
        position: "fixed",
        bottom: 84,
        right: 16,
        zIndex: 1000,
        display: "flex",
        gap: 8,
        alignItems: "center"
      }}>
        {isFeedbackMode && (
          <button
            onClick={() => {
              setIsFeedbackMode(false);
              setClickPos(null);
            }}
            style={{
              background: "#4A5568",
              border: "none",
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: 20,
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}
          >
            취소
          </button>
        )}
        <button
          onClick={() => setIsFeedbackMode(!isFeedbackMode)}
          style={{
            background: isFeedbackMode ? "var(--accent)" : "linear-gradient(135deg, #1A1A1C 0%, #000000 100%)",
            border: isFeedbackMode ? "1.5px solid #FFFFFF" : "1px solid var(--border-mid)",
            cursor: "pointer",
            padding: "10px 18px",
            borderRadius: 24,
            color: "#FFFFFF",
            fontSize: 12.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)"
          }}
        >
          <MessageSquare size={14} />
          {isFeedbackMode ? "영역 클릭 중..." : "💬 피드백 쓰기"}
        </button>
      </div>

      <style>{`
        @keyframes pulsePin {
          0% { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 14px rgba(232,123,123,0.95); }
        }
      `}</style>
    </div>
  );
}

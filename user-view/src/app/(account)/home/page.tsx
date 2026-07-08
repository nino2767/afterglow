"use client";

/**
 * app/(account)/home/page.tsx — S10 계정 홈화면 고도화 포팅 (Next.js TSX)
 * 상세기획-07~10-계정모드.md 스펙 반영
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Calendar, ArrowRight, BookOpen, AlertCircle, Sparkles, MapPin } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";
import BottomTabBar from "../../../components/BottomTabBar";

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
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [invites, setInvites] = useState<InviteItem[]>([]);

  useEffect(() => {
    // 1. 로그인 여부 확인 및 정보 수집
    try {
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        setIsLogged(true);
        const parsed = JSON.parse(account);
        setNickname(parsed.nickname || "관람객");

        // 만약 가입할 때 이전 게스트의 TASTE_PROFILE이 결합(병합)되었다면 복구
        if (parsed.taste_profile) {
          setReports([
            {
              exhibition_id: "pj_abyss",
              name: "빛의 심연",
              date: "2026.07.04",
              personaTitle: parsed.taste_profile.personaTitle,
              bgGradient: parsed.taste_profile.bgGradient,
              keywords: parsed.taste_profile.topKeywords
            }
          ]);
          setInvites([
            {
              invite_id: "INV-XYZ789",
              conceptName: "어비스 티 라운지",
              status: "open_concurrent", // open_concurrent 상태
              personalizedCopy: "차분한 찻잎 블렌딩이 준비되어 있습니다.",
              validity: "~ 2026.08.31"
            }
          ]);
          return;
        }
      } else {
        setIsLogged(false);
      }
    } catch (e) {
      //
    }

    // 일반 mock 데이터 셋업 (병합 전 일반 테스트용)
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
        invite_id: "INV-UPCOMING",
        conceptName: "무한의 소리 레코드",
        status: "ready", // ready 상태
        personalizedCopy: "음악 파동을 수집하는 바이닐 부스가 다음 달에 오픈됩니다.",
        validity: "2026.09.15 오픈 예정"
      },
      {
        invite_id: "INV-XYZ789",
        conceptName: "어비스 티 라운지",
        status: "open_concurrent", // open_concurrent 상태
        personalizedCopy: "차분한 찻잎 블렌딩이 준비되어 있습니다.",
        validity: "~ 2026.08.31"
      }
    ]);
  }, []);

  // ── §A. "지금 확인할 것" 우선순위 판단 엔진 구현 ──
  const getTopPriorityInvite = () => {
    if (invites.length === 0) return null;

    // 우선순위 스코어 배정
    const getScore = (status: string) => {
      switch (status) {
        case "open_solo":
          return 4; // 최고 순위
        case "open_concurrent":
          return 3;
        case "ready":
        case "planning":
          return 2;
        default:
          return 0; // 노출 안 함 (closed/archived)
      }
    };

    const scored = invites
      .map(i => ({ item: i, score: getScore(i.status) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score); // 높은 순 정렬

    if (scored.length === 0) return null;

    const top = scored[0].item;
    let noticeText = "";

    // 전시 상태머신 기반 가이드라인 맞춤 카피 배정
    if (top.status === "open_solo") {
      noticeText = "곧 종료돼요, 지금 방문해보세요!";
    } else if (top.status === "open_concurrent") {
      noticeText = "지금 방문하면 딱이에요!";
    } else {
      noticeText = "팝업 준비 중이에요, 오픈하면 알려드릴게요.";
    }

    return { ...top, noticeText };
  };

  const topPriorityInvite = getTopPriorityInvite();

  // ── §B. 완전 빈 상태 판별 (신규 가입 직후 이력 0건) ──
  const isEmptyState = reports.length === 0 && invites.length === 0;

  return (
    <NavigationShell title="MY AFTERGLOW" showBack={false}>
      <div style={{ flex: 1, padding: "var(--space-5) var(--space-5) 80px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        
        {/* 프로필 웰컴 헤더 */}
        <div>
          <h2 className="t-heading" style={{ fontSize: 22, lineHeight: 1.3 }}>
            안녕하세요,<br />
            <span className="t-italic">{nickname}님</span> 👋
          </h2>
          {!isEmptyState && (
            <p className="t-caption" style={{ color: "var(--ink-muted)", marginTop: 4 }}>
              보관된 전시의 여운을 이어나가 보세요.
            </p>
          )}
        </div>

        {/* 📷 최상단 상시 QR 스캔 CTA (와이어프레임 사양 반영) */}
        <div style={{
          background: "#0D0D0F", // 미술관 다크 테마
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-5)",
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)"
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 80% 50%, rgba(139,46,74,0.18) 0%, transparent 65%)",
            pointerEvents: "none"
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
            <div>
              <p className="t-micro" style={{ color: "var(--accent-light)", marginBottom: 2 }}>NEW JOURNEY</p>
              <h4 className="t-title" style={{ color: "#FFFFFF", fontSize: 16.5, fontWeight: 600 }}>전시 관람 시작하기</h4>
              <p className="t-caption" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 2 }}>
                입구 QR 코드를 스캔해 관람 가이드를 켭니다.
              </p>
            </div>
            <button
              onClick={() => router.push("/onboarding")}
              style={{
                background: "var(--accent)",
                border: "none",
                cursor: "pointer",
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(139,46,74,0.45)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <Camera size={18} />
            </button>
          </div>
        </div>

        {/* 빈 상태 분기 */}
        {isEmptyState ? (
          <div className="anim-fade" style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "var(--space-12) var(--space-4)",
            border: "1px dashed var(--border-strong)",
            borderRadius: "var(--radius-lg)",
            background: "var(--surface-2)",
            marginTop: "var(--space-2)"
          }}>
            <AlertCircle size={36} color="var(--ink-muted)" style={{ marginBottom: 12, opacity: 0.5 }} />
            <h4 className="t-title" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              아직 다녀온 전시가 없어요
            </h4>
            <p className="t-caption" style={{ lineHeight: 1.5, color: "var(--ink-muted)" }}>
              전시장의 입장 QR 코드를 인식하여<br />
              첫 관람의 기억을 기록해 보세요.
            </p>
          </div>
        ) : (
          <>
            {/* 지금 확인할 것 (우선순위 엔진 기반 1건만 노출) */}
            {topPriorityInvite && (
              <div className="anim-fade">
                <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>지금 확인할 것</p>
                <div
                  className="card"
                  onClick={() => router.push("/spinoff")}
                  style={{
                    padding: "var(--space-5)",
                    border: "1.5px solid var(--accent)",
                    background: "var(--surface)",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="badge badge-accent" style={{ fontSize: 10, background: "var(--accent-dim)", color: "var(--accent)", padding: "2px 8px", borderRadius: 4 }}>
                      초대장 연동 ✦
                    </span>
                    <span className="t-mono" style={{ fontSize: 11, color: "var(--ink-muted)" }}>{topPriorityInvite.validity}</span>
                  </div>

                  <h3 className="t-title" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                    {topPriorityInvite.conceptName}
                  </h3>
                  <p className="t-caption" style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 14 }}>
                    {topPriorityInvite.personalizedCopy}
                  </p>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border)",
                    paddingTop: 12
                  }}>
                    <span style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600 }}>
                      {topPriorityInvite.noticeText}
                    </span>
                    <span style={{ fontSize: 12.5, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
                      확인하기 <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 최근 다녀온 전시 (리포트 미리보기 - 최대 최근 2개) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
                <p className="t-micro">최근 다녀온 전시</p>
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
                    onClick={() => router.push("/report")}
                    style={{
                      background: rep.bgGradient,
                      padding: "var(--space-4) var(--space-4) 14px",
                      color: "#FFFFFF",
                      minHeight: 135,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <span className="t-mono" style={{ fontSize: 9.5, color: "rgba(255,255,255,0.7)" }}>{rep.date}</span>
                      <h4 style={{
                        fontSize: 14.5,
                        fontWeight: 600,
                        marginTop: 2,
                        lineHeight: 1.25,
                        color: "#FFFFFF",
                        fontFamily: "var(--font-display)"
                      }}>
                        {rep.personaTitle}
                      </h4>
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                      《{rep.name}》
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 하단 탭바 고정 */}
        <BottomTabBar activeTab="home" />

      </div>
    </NavigationShell>
  );
}

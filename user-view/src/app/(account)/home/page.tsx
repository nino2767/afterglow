"use client";

/**
 * app/(account)/home/page.tsx — S10 계정 홈화면 정적 포팅 (Next.js TSX)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Calendar, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";
import BottomTabBar from "../../../components/BottomTabBar";

export default function AccountHomePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("관람객");
  const [reports, setReports] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    try {
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        const parsed = JSON.parse(account);
        setNickname(parsed.nickname || "관람객");
      }
    } catch (e) {
      //
    }

    // 팝업 상세기획 §A 우선순위 엔진 모사용 임시 mock 리스트
    setInvites([
      {
        invite_id: "INV-XYZ789",
        conceptName: "어비스 티 라운지",
        status: "open_concurrent",
        personalizedCopy: "차분한 찻잎 블렌딩이 준비되어 있습니다.",
      }
    ]);

    setReports([
      {
        exhibition_id: "pj_abyss",
        name: "빛의 심연",
        date: "2026.07.04",
        personaTitle: "고요함을 머금은 감성 탐구자"
      }
    ]);
  }, []);

  return (
    <NavigationShell title="MY AFTERGLOW" showBack={false}>
      <div style={{ flex: 1, padding: "var(--space-5) var(--space-5) 80px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        
        {/* 웰컴 섹션 */}
        <div>
          <h2 className="t-heading" style={{ fontSize: 22 }}>
            안녕하세요,<br />
            <span className="t-italic">{nickname}님</span>
          </h2>
          <p className="t-caption" style={{ color: "var(--ink-muted)", marginTop: 4 }}>오늘의 여운이 잘 보관되어 있습니다.</p>
        </div>

        {/* 상시 QR 스캔 버튼 */}
        <div style={{
          background: "linear-gradient(135deg, #1E1520, #0D0D0F)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-5)",
          color: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h4 className="t-title" style={{ color: "#FFFFFF", fontSize: 16, marginBottom: 2 }}>새로운 전시 시작하기</h4>
            <p className="t-caption" style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>입구 QR을 찍고 AI 도슨트와 대화하세요</p>
          </div>
          <button
            onClick={() => router.push("/onboarding")}
            style={{
              background: "var(--accent)",
              border: "none",
              cursor: "pointer",
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF"
            }}
          >
            <Camera size={18} />
          </button>
        </div>

        {/* '지금 확인할 것' 우선순위 엔진 영역 */}
        <div>
          <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>지금 확인할 것</p>
          {invites.length > 0 ? (
            <div
              className="card"
              style={{
                padding: "var(--space-4)",
                border: "1.5px solid var(--accent)",
                background: "var(--surface)",
                cursor: "pointer"
              }}
              onClick={() => router.push("/spinoff")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span className="badge badge-accent" style={{ fontSize: 9.5 }}>진행 중인 팝업 ✦</span>
              </div>
              <h3 className="t-title" style={{ fontSize: 15, marginBottom: 4 }}>{invites[0].conceptName}</h3>
              <p className="t-caption" style={{ fontSize: 13, marginBottom: 12 }}>{invites[0].personalizedCopy}</p>
              <span style={{ fontSize: 12, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                초대장 보러가기 <ArrowRight size={12} />
              </span>
            </div>
          ) : (
            <div className="card" style={{ padding: "var(--space-4)", textAlign: "center", background: "var(--surface-2)" }}>
              <AlertCircle size={20} color="var(--ink-muted)" style={{ margin: "0 auto 8px" }} />
              <p className="t-caption">현재 예정된 팝업 초대장이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 최근 리포트 영역 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
            <p className="t-micro">최근 발급된 여운 리포트</p>
            <button
              onClick={() => router.push("/my-reports")}
              style={{ background: "transparent", border: "none", fontSize: 11, color: "var(--accent)", cursor: "pointer" }}
            >
              더보기
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {reports.map((rep, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: "var(--space-4)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer"
                }}
                onClick={() => router.push("/report")}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span className="t-title" style={{ fontSize: 14.5 }}>{rep.name}</span>
                    <span className="t-mono" style={{ fontSize: 11, color: "var(--ink-muted)" }}>{rep.date}</span>
                  </div>
                  <p className="t-caption" style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 500 }}>
                    {rep.personaTitle}
                  </p>
                </div>
                <BookOpen size={16} color="var(--ink-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* 하단 탭바 고정 */}
        <BottomTabBar activeTab="home" />

      </div>
    </NavigationShell>
  );
}

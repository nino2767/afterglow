"use client";

/**
 * app/(account)/my-reports/page.tsx — S8 마이리포트 보관함 고도화 포팅 (Next.js TSX)
 * 상세기획-07~10-계정모드.md 스펙 반영
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Camera } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";
import BottomTabBar from "../../../components/BottomTabBar";

interface ReportItem {
  exhibition_id: string;
  name: string;
  date: string;
  personaTitle: string;
  bgGradient: string;
  keywords: string[];
}

export default function MyReportsPage() {
  const router = useRouter();

  const [reports, setReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    try {
      const account = localStorage.getItem("afterglow_account");
      if (account) {
        const parsed = JSON.parse(account);
        // 가입 시 이관받은 TASTE_PROFILE이 있으면 로드
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
          return;
        }
      }
    } catch (e) {
      //
    }

    // 기본 mock 관람 이력 히스토리
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
        keywords: ["따뜻함", "포근함", "자연"]
      }
    ]);
  }, []);

  return (
    <NavigationShell title="누적 여운 리포트" showBack={false}>
      <div style={{ flex: 1, padding: "var(--space-5) var(--space-5) 80px", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        
        {reports.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-4)"
          }}>
            {reports.map((rep) => (
              <div
                key={rep.exhibition_id}
                className="card anim-fade"
                onClick={() => router.push("/report")}
                style={{
                  background: rep.bgGradient,
                  padding: "var(--space-5)",
                  color: "#FFFFFF",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {/* 물방울 레이아웃 모사 */}
                <div style={{
                  position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)",
                  pointerEvents: "none"
                }} />

                <div>
                  <span className="t-mono" style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)" }}>{rep.date}</span>
                  <h3 className="t-heading" style={{ color: "#FFFFFF", fontSize: 20, marginTop: 2, fontFamily: "var(--font-display)" }}>
                    {rep.personaTitle}
                  </h3>
                  <p className="t-caption" style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 }}>
                    전시: 《{rep.name}》
                  </p>
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 10, marginTop: 12 }}>
                  {rep.keywords.map((k) => (
                    <span key={k} style={{
                      fontSize: 11,
                      background: "rgba(255,255,255,0.16)",
                      padding: "3px 10px",
                      borderRadius: 99,
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "var(--space-12) var(--space-4)",
            color: "var(--ink-muted)",
            border: "1px dashed var(--border-strong)",
            borderRadius: "var(--radius-lg)",
            background: "var(--surface-2)"
          }}>
            <BookOpen size={36} style={{ marginBottom: 12, opacity: 0.5 }} />
            <h4 className="t-title" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>아직 다녀온 전시가 없어요</h4>
            <p className="t-caption" style={{ marginBottom: "var(--space-6)", color: "var(--ink-muted)", lineHeight: 1.5 }}>
              전시를 관람하고 나만의 취향 페르소나 리포트를 소장해 보세요.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => router.push("/onboarding")} style={{ gap: 6 }}>
              <Camera size={14} />
              첫 관람 스캔하기
            </button>
          </div>
        )}

        {/* 하단 탭바 고정 */}
        <BottomTabBar activeTab="reports" />

      </div>
    </NavigationShell>
  );
}

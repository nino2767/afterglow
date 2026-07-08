"use client";

/**
 * app/(account)/my-reports/page.tsx — S8 마이리포트 보관함 정적 포팅 (Next.js TSX)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Camera } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";
import BottomTabBar from "../../../components/BottomTabBar";

export default function MyReportsPage() {
  const router = useRouter();

  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // 마이리포트 히스토리 목록 모사 데이터
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
            {reports.map((rep, idx) => (
              <div
                key={idx}
                className="card anim-fade"
                onClick={() => router.push("/report")}
                style={{
                  background: rep.bgGradient,
                  padding: "var(--space-5)",
                  color: "#FFFFFF",
                  minHeight: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div>
                  <span className="t-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{rep.date}</span>
                  <h3 className="t-heading" style={{ color: "#FFFFFF", fontSize: 20, marginTop: 2, fontFamily: "var(--font-display)" }}>
                    {rep.personaTitle}
                  </h3>
                  <p className="t-caption" style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 }}>
                    전시: 《{rep.name}》
                  </p>
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 8 }}>
                  {rep.keywords.map((k: string) => (
                    <span key={k} style={{ fontSize: 11, background: "rgba(255,255,255,0.16)", padding: "2px 8px", borderRadius: 99 }}>
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
            padding: "var(--space-12) 0",
            color: "var(--ink-muted)"
          }}>
            <BookOpen size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p className="t-title" style={{ fontSize: 16, marginBottom: 4 }}>저장된 리포트가 없습니다</p>
            <p className="t-caption" style={{ marginBottom: "var(--space-6)" }}>전시를 관람하고 나만의 취향 카드를 받아보세요</p>
            <button className="btn btn-primary" onClick={() => router.push("/onboarding")} style={{ gap: 6 }}>
              <Camera size={15} />
              첫 관람 스캔하기
            </button>
          </div>
        )}

        {/* 하단 탭바 */}
        <BottomTabBar activeTab="reports" />

      </div>
    </NavigationShell>
  );
}

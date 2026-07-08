"use client";

/**
 * app/(account)/invites/page.tsx — S9 초대장 보관함 정적 포팅 (Next.js TSX)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Calendar, ArrowRight } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";
import BottomTabBar from "../../../components/BottomTabBar";

type TabId = "current" | "upcoming" | "ended";

export default function InvitesPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabId>("current");
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    // 팝업 초대장 목록 모사 데이터
    setInvites([
      {
        invite_id: "INV-XYZ789",
        concept_type: "C",
        conceptName: "어비스 티 라운지",
        status: "open_concurrent",
        personalizedCopy: "'고요한 잔상'이라고 하셨죠. 당신을 위해 차분한 향의 찻잎을 블렌딩 바로 보내 두었습니다.",
        landing_url: "/spinoff",
        tabGroup: "current",
        validity: "~ 2026.08.31"
      },
      {
        invite_id: "INV-UPCOMING",
        concept_type: "A",
        conceptName: "무한의 소리 레코드",
        status: "ready",
        personalizedCopy: "음악 파동을 수집하는 바이닐 부스가 다음 달에 오픈됩니다.",
        landing_url: "/spinoff",
        tabGroup: "upcoming",
        validity: "2026.09.15 오픈 예정"
      },
      {
        invite_id: "INV-MOCKGARDEN",
        concept_type: "B",
        conceptName: "무한의 정원 팝업",
        status: "closed",
        personalizedCopy: "따뜻한 봄의 기운을 담은 엽서 세트가 발급되었습니다.",
        landing_url: "/spinoff",
        tabGroup: "ended",
        validity: "종료됨"
      }
    ]);
  }, []);

  const filteredInvites = invites.filter(i => i.tabGroup === activeTab);

  return (
    <NavigationShell title="내 초대장" showBack={false}>
      <div style={{ flex: 1, padding: "var(--space-5) var(--space-5) 80px", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        
        {/* 상단 탭 스위처 */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
          marginBottom: "var(--space-2)"
        }}>
          {(["current", "upcoming", "ended"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                padding: "12px 0",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "var(--accent)" : "var(--ink-muted)",
                borderBottom: activeTab === tab ? "2px solid var(--accent)" : "none",
                outline: "none"
              }}
            >
              {tab === "current" ? "진행 중" : tab === "upcoming" ? "예정" : "종료"}
            </button>
          ))}
        </div>

        {/* 리스트 출력 */}
        {filteredInvites.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {filteredInvites.map((invite, idx) => (
              <div
                key={idx}
                className="card anim-fade"
                onClick={() => invite.tabGroup !== "ended" && router.push("/spinoff")}
                style={{
                  padding: "var(--space-5)",
                  border: invite.tabGroup === "current" ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                  background: "var(--surface)",
                  cursor: invite.tabGroup === "ended" ? "default" : "pointer",
                  opacity: invite.tabGroup === "ended" ? 0.6 : 1
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span className="badge badge-accent" style={{ fontSize: 9.5 }}>
                    {invite.tabGroup === "current" ? "사용 가능 ✦" : invite.tabGroup === "upcoming" ? "오픈 대기" : "사용 만료"}
                  </span>
                  <span className="t-mono" style={{ fontSize: 10, color: "var(--ink-muted)" }}>{invite.validity}</span>
                </div>

                <h3 className="t-title" style={{ fontSize: 16, marginBottom: 4 }}>{invite.conceptName}</h3>
                <p className="t-caption" style={{ fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{invite.personalizedCopy}</p>
                
                {invite.tabGroup !== "ended" && (
                  <span style={{ fontSize: 12, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                    팝업 상세 가기 <ArrowRight size={12} />
                  </span>
                )}
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
            <Mail size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p className="t-title" style={{ fontSize: 15 }}>초대장이 비어있습니다</p>
          </div>
        )}

        {/* 하단 탭바 */}
        <BottomTabBar activeTab="invites" />

      </div>
    </NavigationShell>
  );
}

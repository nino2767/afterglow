"use client";

/**
 * app/(account)/invites/page.tsx — S9 초대장 보관함 고도화 포팅 (Next.js TSX)
 * 상세기획-07~10-계정모드.md 스펙 반영
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Calendar, ArrowRight, Clock } from "lucide-react";
import NavigationShell from "../../../components/NavigationShell";
import BottomTabBar from "../../../components/BottomTabBar";

interface Invite {
  invite_id: string;
  concept_type: string;
  conceptName: string;
  status: "open_solo" | "open_concurrent" | "ready" | "planning" | "closed" | "archived";
  personalizedCopy: string;
  validity: string;
}

export default function InvitesPage() {
  const router = useRouter();

  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    // 상세기획 사양에 부합하는 mock 초대장 목록 로드
    setInvites([
      {
        invite_id: "INV-XYZ789",
        concept_type: "C",
        conceptName: "어비스 티 라운지",
        status: "open_concurrent",
        personalizedCopy: "'고요한 잔상'이라고 하셨죠. 당신을 위해 차분한 향의 찻잎을 블렌딩 바로 보내 두었습니다.",
        validity: "D-12 남음"
      },
      {
        invite_id: "INV-UPCOMING",
        concept_type: "A",
        conceptName: "무한의 소리 레코드",
        status: "ready",
        personalizedCopy: "음악 파동을 수집하는 바이닐 부스가 다음 달에 오픈됩니다.",
        validity: "2026.09.15 오픈 예정"
      },
      {
        invite_id: "INV-MOCKGARDEN",
        concept_type: "B",
        conceptName: "무한의 정원 팝업",
        status: "closed",
        personalizedCopy: "따뜻한 봄의 기운을 담은 엽서 세트가 발급되었습니다.",
        validity: "이벤트 종료"
      }
    ]);
  }, []);

  // ── 기획서 스펙: 단일 스크롤 뷰 내 그룹 분리 ──
  // 1. 진행 중 (open_solo, open_concurrent)
  const activeInvites = invites.filter(i => i.status === "open_solo" || i.status === "open_concurrent");

  // 2. 오픈 예정 (ready, planning)
  const upcomingInvites = invites.filter(i => i.status === "ready" || i.status === "planning");

  // 3. 종료 (closed, archived)
  const endedInvites = invites.filter(i => i.status === "closed" || i.status === "archived");

  const totalCount = invites.length;

  return (
    <NavigationShell title="내 초대장" showBack={false}>
      <div style={{ flex: 1, padding: "var(--space-5) var(--space-5) 80px", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        
        {totalCount > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            
            {/* ━━ 1. 진행 중 ━━ */}
            {activeInvites.length > 0 && (
              <div>
                <p className="t-micro" style={{ marginBottom: "var(--space-3)", color: "var(--accent)", fontWeight: 600 }}>
                  ━━ 진행 중 ━━
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {activeInvites.map((invite) => (
                    <div
                      key={invite.invite_id}
                      className="card anim-fade"
                      onClick={() => router.push("/spinoff")}
                      style={{
                        padding: "var(--space-5)",
                        border: "1.5px solid var(--accent)",
                        background: "var(--surface)",
                        cursor: "pointer",
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span className="badge badge-accent" style={{ fontSize: 9.5, background: "var(--accent-dim)", color: "var(--accent)" }}>
                          사용 가능 ✦
                        </span>
                        <span className="t-mono" style={{ fontSize: 11, color: "var(--accent)", display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock size={11} /> {invite.validity}
                        </span>
                      </div>

                      <h3 className="t-title" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{invite.conceptName}</h3>
                      <p className="t-caption" style={{ fontSize: 13, marginBottom: 12, lineHeight: 1.5, color: "var(--ink-2)" }}>{invite.personalizedCopy}</p>
                      
                      <span style={{ fontSize: 12, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                        확인하기 <ArrowRight size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ━━ 2. 오픈 예정 ━━ */}
            {upcomingInvites.length > 0 && (
              <div>
                <p className="t-micro" style={{ marginBottom: "var(--space-3)", color: "var(--ink-muted)" }}>
                  ━━ 오픈 예정 ━━
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {upcomingInvites.map((invite) => (
                    <div
                      key={invite.invite_id}
                      className="card anim-fade"
                      onClick={() => router.push("/spinoff")}
                      style={{
                        padding: "var(--space-5)",
                        border: "1px solid var(--border-strong)",
                        background: "var(--surface)",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span className="badge" style={{ fontSize: 9.5, background: "var(--surface-2)", color: "var(--ink-3)", border: "1px solid var(--border)" }}>
                          오픈 알림 신청됨
                        </span>
                        <span className="t-mono" style={{ fontSize: 11, color: "var(--ink-muted)" }}>{invite.validity}</span>
                      </div>

                      <h3 className="t-title" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{invite.conceptName}</h3>
                      <p className="t-caption" style={{ fontSize: 13, marginBottom: 12, lineHeight: 1.5, color: "var(--ink-3)" }}>{invite.personalizedCopy}</p>
                      
                      <span style={{ fontSize: 12, color: "var(--ink-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                        상세보기 <ArrowRight size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ━━ 3. 종료 ━━ */}
            {endedInvites.length > 0 && (
              <div>
                <p className="t-micro" style={{ marginBottom: "var(--space-3)", color: "var(--ink-faint)" }}>
                  ━━ 종료 ━━
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", opacity: 0.55 }}>
                  {endedInvites.map((invite) => (
                    <div
                      key={invite.invite_id}
                      className="card"
                      style={{
                        padding: "var(--space-5)",
                        border: "1px solid var(--border-mid)",
                        background: "var(--surface-2)",
                        cursor: "default"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span className="badge" style={{ fontSize: 9.5, background: "rgba(10,10,10,0.06)", color: "var(--ink-muted)" }}>
                          사용 만료
                        </span>
                        <span className="t-mono" style={{ fontSize: 10, color: "var(--ink-faint)" }}>{invite.validity}</span>
                      </div>

                      <h3 className="t-title" style={{ fontSize: 15, marginBottom: 4, color: "var(--ink-3)" }}>{invite.conceptName}</h3>
                      <p className="t-caption" style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-muted)" }}>{invite.personalizedCopy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

        {/* 하단 탭바 고정 */}
        <BottomTabBar activeTab="invites" />

      </div>
    </NavigationShell>
  );
}

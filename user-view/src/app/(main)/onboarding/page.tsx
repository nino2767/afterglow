"use client";

/**
 * app/(main)/onboarding/page.tsx — 초단기 온보딩 화면 (1-Click 진입)
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NavigationShell from "../../../components/NavigationShell";

const EXHIBITION = {
  name: "빛의 심연",
  venue: "아트홀 서울",
};

const NICKNAMES_PRE = ["고요한", "심오한", "몽환적인", "따뜻한", "쓸쓸한", "경외스런", "빛나는", "투명한"];
const NICKNAMES_POST = ["윤슬", "안개", "물결", "찻잎", "모래", "빛무리", "파동", "잔향"];

function generateRandomNickname() {
  const pre = NICKNAMES_PRE[Math.floor(Math.random() * NICKNAMES_PRE.length)];
  const post = NICKNAMES_POST[Math.floor(Math.random() * NICKNAMES_POST.length)];
  return `${pre} ${post}`;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleStartExhibition() {
    setLoading(true);
    
    // 백그라운드 닉네임 자동 할당 및 세션 기록
    const autoNickname = generateRandomNickname();
    
    try {
      localStorage.setItem("afterglow_session", JSON.stringify({
        visitor_id: `v_${Date.now()}`,
        session_id: `s_${Date.now()}`,
        nickname: autoNickname,
        initial_keywords: [
          { emotion: "고요함", axis: "serene" },
          { emotion: "몽환적인", axis: "dreamy" }
        ], // 디폴트 키워드 탑재하여 세션 안정성 보장
        dwells: {},
        emotionTags: {},
        chatEmotions: {},
        chatCount: 0
      }));
    } catch (e) {
      console.error(e);
    }

    // 작품 정보 카드 페이지(본전시 목록)로 즉시 다이렉팅
    setTimeout(() => {
      router.push("/artwork");
    }, 400);
  }

  return (
    <NavigationShell title="AFTERGLOW" showBack={false}>
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "var(--space-6) var(--space-6) var(--space-8)",
        background: "var(--bg)",
        justifyContent: "space-between"
      }}>
        <div className="anim-up" style={{ marginTop: "var(--space-10)" }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: "50%",
            border: "1px solid var(--border-mid)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
            color: "var(--accent)",
            marginBottom: "var(--space-8)",
          }}>
            ✦
          </div>

          <p className="t-micro" style={{ marginBottom: "var(--space-3)", letterSpacing: 1 }}>
            {EXHIBITION.venue}
          </p>
          <h1 className="t-display" style={{ marginBottom: "var(--space-4)", fontSize: 38, lineHeight: 1.2 }}>
            {EXHIBITION.name}
          </h1>
          <p className="t-body" style={{ maxWidth: 290, color: "var(--ink-2)", lineHeight: 1.6 }}>
            AI 도슨트가 들려주는 빛의 이야기.<br />
            스냅 사진을 기록하고 취향 리포트를 받아보세요.
          </p>
        </div>

        {/* 심플 세부 가이드 */}
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "var(--space-6)",
          marginBottom: "var(--space-8)",
        }}>
          {[
            { label: "도슨트 제공", value: "자동 오디오 가이드 (TTS)" },
            { label: "소요 시간", value: "자유로운 탐색형 관람" },
            { label: "권장 설정", value: "카메라 권한 & 오디오 켬" },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid var(--border-mid)",
            }}>
              <span className="t-caption" style={{ fontSize: 12 }}>{item.label}</span>
              <span className="t-caption" style={{ color: "var(--ink)", fontWeight: 500, fontSize: 12.5 }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* 액션 버튼 그룹 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <button
            id="btn-welcome-start"
            className="btn btn-primary btn-full btn-lg"
            onClick={handleStartExhibition}
            disabled={loading}
            style={{ fontWeight: 600 }}
          >
            {loading ? "관람 세션 셋업 중..." : "동의하고 바로 관람 시작하기"}
          </button>
          
          <button
            className="btn btn-outline btn-full"
            onClick={() => router.push("/home")}
            style={{ fontSize: 13.5 }}
          >
            게스트로 홈(여운의 우주) 둘러보기
          </button>

          <p style={{ textAlign: "center", fontSize: 11, color: "var(--ink-muted)", marginTop: 6 }}>
            본 버튼을 클릭하면 서비스 필수 이용약관에 동의하는 것으로 간주됩니다.
          </p>

          <button
            className="btn btn-link"
            onClick={() => router.push("/login")}
            style={{ alignSelf: "center", fontSize: 12.5, marginTop: 8 }}
          >
            이미 계정이 있으신가요? 로그인하기
          </button>
        </div>
      </div>
    </NavigationShell>
  );
}

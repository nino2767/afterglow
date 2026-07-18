"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, Check, Info } from "lucide-react";
import NavigationShell from "../../../../../components/NavigationShell";

const EMOTIONS = ["고요함", "몽환", "압도", "기괴함", "따뜻함"];
const SCENES = [
  { id: "art_001", title: "1구역: 윤슬" },
  { id: "art_002", title: "2구역: 심연의 호흡" },
  { id: "art_003", title: "3구역: 기억의 잔광" }
];

export default function SpinoffOnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string || "abyss-wave";

  const [hasSeenMain, setHasSeenMain] = useState<boolean | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(true);

  // 키워드 토글 핸들러
  const handleToggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(prev => prev.filter(k => k !== keyword));
    } else {
      setSelectedKeywords(prev => [...prev, keyword]);
    }
  };

  // 관람 시작 핸들러
  const handleStart = () => {
    if (hasSeenMain === null) return;
    if (!consentChecked) {
      alert("데이터 수집 동의가 필요합니다.");
      return;
    }

    if (hasSeenMain === false && selectedKeywords.length === 0) {
      alert("최소 1개 이상의 취향 키워드를 선택해주세요.");
      return;
    }

    if (hasSeenMain === true && !selectedScene) {
      alert("기억에 남는 장면을 선택해주세요.");
      return;
    }

    try {
      // 스핀오프 세션 생성 및 저장
      const spinoffSession = {
        spinoff_id: slug,
        nickname: hasSeenMain ? "기억을 품은 관람객" : "새로운 감각 탐구자",
        seen_main_exhibition: hasSeenMain,
        selected_keywords: hasSeenMain ? [] : selectedKeywords,
        selected_scene: hasSeenMain ? selectedScene : null,
        visited_scenes: {},
        chat_history: []
      };
      localStorage.setItem("afterglow_spinoff_session", JSON.stringify(spinoffSession));
    } catch (e) {
      console.error(e);
    }

    router.push(`/spinoff/${slug}/viewer`);
  };

  const isFormValid =
    consentChecked &&
    hasSeenMain !== null &&
    (hasSeenMain === false ? selectedKeywords.length > 0 : selectedScene !== null);

  return (
    <NavigationShell title="입장하기" showBack={true} onBack={() => router.push(`/spinoff/${slug}`)}>
      <div style={{
        flex: 1,
        padding: "var(--space-6) var(--space-5) 80px",
        display: "flex",
        flexDirection: "column",
        background: "#0D0D0F",
        color: "#FAFAF9",
        minHeight: "calc(100vh - 60px)"
      }}>
        
        {/* 온보딩 질문 */}
        <div className="anim-up" style={{ marginTop: "var(--space-4)", marginBottom: 24 }}>
          <span className="tag" style={{ color: "#4FD8EB" }}>ENTRANCE QUESTION</span>
          <h2 className="t-serif" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginTop: 4, color: "#FFFFFF" }}>
            본전시 〈심해의 환상〉,<br />보셨나요?
          </h2>
        </div>

        {/* 선택 옵션 분기 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* 옵션 A: 아니오 */}
          <div 
            onClick={() => setHasSeenMain(false)}
            style={{
              padding: 16,
              borderRadius: "var(--radius-lg)",
              background: hasSeenMain === false ? "rgba(79, 216, 235, 0.08)" : "#16161A",
              border: hasSeenMain === false ? "1.5px solid #4FD8EB" : "1.5px solid rgba(255, 255, 255, 0.05)",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: hasSeenMain === false ? "#4FD8EB" : "#FFFFFF" }}>
                아니오, 처음이에요
              </span>
              {hasSeenMain === false && <Check size={16} color="#4FD8EB" />}
            </div>
            <p style={{ fontSize: 11, color: "var(--ink-muted)", marginBottom: 12 }}>
              취향 키워드를 바탕으로 나만의 감정 씬을 큐레이션합니다.
            </p>

            {hasSeenMain === false && (
              <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11.5, color: "#FFFFFF", marginBottom: 8, fontWeight: 600 }}>감정/취향 키워드 (2~3개 권장):</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {EMOTIONS.map(emo => {
                    const isSelected = selectedKeywords.includes(emo);
                    return (
                      <button
                        key={emo}
                        onClick={() => handleToggleKeyword(emo)}
                        style={{
                          fontSize: 11.5,
                          background: isSelected ? "#4FD8EB" : "rgba(255,255,255,0.03)",
                          color: isSelected ? "#062028" : "#4FD8EB",
                          border: "1px solid #2A7F96",
                          borderRadius: 14,
                          padding: "5px 12px",
                          cursor: "pointer",
                          fontWeight: isSelected ? 700 : 400
                        }}
                      >
                        {emo}
                      </button>
                    );
                  })}
                </div>

                {/* 본전시 상세 정보 링크 */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderTop: "1px dashed rgba(79, 216, 235, 0.15)",
                  paddingTop: 10,
                  fontSize: 11
                }}>
                  <span style={{ color: "var(--ink-muted)", display: "flex", alignItems: "center", gap: 3 }}>
                    <Info size={11} /> 원작 전시가 궁금하다면?
                  </span>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/exhibition/abyss");
                    }}
                    style={{ color: "#4FD8EB", textDecoration: "none", fontWeight: 700 }}
                  >
                    본전시 정보 보기 ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 옵션 B: 예 */}
          <div 
            onClick={() => setHasSeenMain(true)}
            style={{
              padding: 16,
              borderRadius: "var(--radius-lg)",
              background: hasSeenMain === true ? "rgba(79, 216, 235, 0.08)" : "#16161A",
              border: hasSeenMain === true ? "1.5px solid #4FD8EB" : "1.5px solid rgba(255, 255, 255, 0.05)",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: hasSeenMain === true ? "#4FD8EB" : "#FFFFFF" }}>
                네, 봤어요
              </span>
              {hasSeenMain === true && <Check size={16} color="#4FD8EB" />}
            </div>
            <p style={{ fontSize: 11, color: "var(--ink-muted)", marginBottom: 12 }}>
              기억에 남는 장면을 선택하여 새로운 변주 연출에 반영합니다.
            </p>

            {hasSeenMain === true && (
              <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11.5, color: "#FFFFFF", marginBottom: 8, fontWeight: 600 }}>가장 기억에 남는 구역/장면:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {SCENES.map(scene => {
                    const isSelected = selectedScene === scene.id;
                    return (
                      <button
                        key={scene.id}
                        onClick={() => setSelectedScene(scene.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          fontSize: 12.5,
                          background: isSelected ? "rgba(79, 216, 235, 0.15)" : "rgba(255,255,255,0.03)",
                          color: isSelected ? "#4FD8EB" : "var(--ink-faint)",
                          border: isSelected ? "1px solid #4FD8EB" : "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 8,
                          padding: "10px 14px",
                          cursor: "pointer"
                        }}
                      >
                        {scene.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 수집 동의 체크 및 시작 버튼 */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 14, paddingTop: 30 }}>
          
          <label style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
            <input 
              type="checkbox" 
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              style={{ marginTop: 3, accentColor: "#4FD8EB" }}
            />
            <span style={{ fontSize: 10.5, color: "var(--ink-muted)", lineHeight: 1.4 }}>
              ✓ 관람 데이터 수집 및 개인화 아카이브 생성 이용 약관에 동의합니다. (로그인 없이 이용 가능)
            </span>
          </label>

          <button
            onClick={handleStart}
            disabled={!isFormValid}
            className="btn btn-primary btn-full btn-lg"
            style={{ 
              background: isFormValid ? "#4FD8EB" : "#1F2937", 
              color: isFormValid ? "#062028" : "#8A8A8A", 
              fontWeight: 800,
              borderRadius: "var(--radius-md)"
            }}
          >
            관람 시작하기
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </NavigationShell>
  );
}

"use client";

/**
 * app/(guide)/onboarding/page.tsx — S1 온보딩 정적 포팅 (Next.js TSX)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EmotionChip from "../../../components/EmotionChip";

// SSOT 임시 하드코딩 (데이터 레이어 보류 지침에 따라 로컬 mock 상수로 격리)
const EXHIBITION = {
  name: "빛의 심연",
  venue: "아트홀 서울",
};

const EMOTION_LEAFS = [
  { leaf: "고요함", axis: "serene", active: true },
  { leaf: "몽환적인", axis: "dreamy", active: true },
  { leaf: "슬픔", axis: "melancholy", active: true },
  { leaf: "따뜻함", axis: "warm", active: true },
  { leaf: "압도적", axis: "awe", active: true },
  { leaf: "해방감", axis: "thrill", active: true },
  { leaf: "신비로움", axis: "dreamy", active: true },
  { leaf: "심오함", axis: "contemplative", active: true },
];

const NICKNAMES_PRE = ["고요한", "심오한", "몽환적인", "따뜻한", "쓸쓸한", "경외스런"];
const NICKNAMES_POST = ["윤슬", "안개", "물결", "찻잎", "모래", "빛무리"];

function generateRandomNickname() {
  const pre = NICKNAMES_PRE[Math.floor(Math.random() * NICKNAMES_PRE.length)];
  const post = NICKNAMES_POST[Math.floor(Math.random() * NICKNAMES_POST.length)];
  return `${pre} ${post}`;
}

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<number | "declined">(0);
  const [consentService, setConsentService] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [selectedLeafs, setSelectedLeafs] = useState<{ emotion: string; axis: string }[]>([]);
  const [returning, setReturning] = useState(false);

  // 재방문 감지 모사
  useEffect(() => {
    try {
      const saved = localStorage.getItem("afterglow_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        setReturning(true);
        setNickname(parsed.nickname || "");
        setStep(3);
      }
    } catch (e) {
      //
    }
  }, []);

  function handleLeafToggle({ emotion, axis }: { emotion: string; axis: string }) {
    setSelectedLeafs(prev => {
      const exists = prev.some(l => l.emotion === emotion);
      return exists
        ? prev.filter(l => l.emotion !== emotion)
        : [...prev, { emotion, axis }];
    });
  }

  function handleStart() {
    if (selectedLeafs.length === 0) return;

    // 데이터 레이어 보류로 인해 localStorage에는 단순 정보만 최소한으로 기록
    try {
      localStorage.setItem("afterglow_session", JSON.stringify({
        visitor_id: `v_${Date.now()}`,
        session_id: `s_${Date.now()}`,
        nickname: nickname.trim() || "관람객",
        initial_keywords: selectedLeafs
      }));
    } catch (e) {
      //
    }

    // 작품 정보 카드 페이지(S2)로 이동
    router.push("/artwork");
  }

  if (step === "declined") {
    return (
      <div className="screen" style={{
        background: "var(--bg)",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-12)",
      }}>
        <p style={{ fontSize: 32, marginBottom: "var(--space-6)", color: "var(--ink-faint)" }}>✦</p>
        <h2 className="t-heading" style={{ marginBottom: "var(--space-4)" }}>그래도 좋아요</h2>
        <p className="t-body">
          전시를 자유롭게 감상하세요.<br />
          언제든 입구 QR을 다시 스캔하면<br />AI 큐레이터를 만날 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <div className="screen" style={{ background: "var(--bg)" }}>
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "0 var(--space-6)",
        paddingTop: "calc(var(--safe-top) + var(--space-12))",
        paddingBottom: "var(--space-8)",
      }}>

        {/* ── STEP 0: 웰컴 ── */}
        {step === 0 && (
          <div className="anim-up" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "var(--space-12)" }}>
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

              <p className="t-micro" style={{ marginBottom: "var(--space-3)" }}>
                {EXHIBITION.venue}
              </p>
              <h1 className="t-display" style={{ marginBottom: "var(--space-4)", fontSize: 40 }}>
                {EXHIBITION.name}
              </h1>
              <p className="t-body" style={{ maxWidth: 280 }}>
                AI 큐레이터와 함께<br />
                당신만의 관람을 시작하세요
              </p>
            </div>

            <div style={{
              flex: 1,
              borderTop: "1px solid var(--border)",
              paddingTop: "var(--space-8)",
              marginBottom: "var(--space-12)",
            }}>
              {[
                { label: "관람 형태", value: "AI 큐레이터 동행" },
                { label: "소요 시간", value: "자유 관람" },
                { label: "필요한 것", value: "QR 스캔 + 30초" },
              ].map(item => (
                <div key={item.label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "var(--space-4) 0",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <span className="t-caption">{item.label}</span>
                  <span className="t-caption" style={{ color: "var(--ink)", fontWeight: 500 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              id="btn-welcome-start"
              className="btn btn-primary btn-full btn-lg"
              onClick={() => setStep(1)}
            >
              시작하기
            </button>
          </div>
        )}

        {/* ── STEP 1: 동의 ── */}
        {step === 1 && (
          <div className="anim-fade" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <StepBar current={1} />

            <div style={{ flex: 1, paddingTop: "var(--space-10)" }}>
              <h2 className="t-heading" style={{ marginBottom: "var(--space-2)" }}>
                잠깐, 먼저<br />
                <span className="t-italic">확인해요</span>
              </h2>
              <p className="t-caption" style={{ marginBottom: "var(--space-10)" }}>
                AI 큐레이터 서비스 이용을 위해 동의해주세요
              </p>

              <ConsentItem
                id="consent-service"
                required
                label="서비스 이용 동의"
                desc="AI 큐레이터 대화·감정 데이터 등 세션 데이터를 수집합니다"
                checked={consentService}
                onChange={setConsentService}
              />

              <div style={{ height: "var(--space-4)" }} />

              <ConsentItem
                id="consent-marketing"
                label="마케팅 수신 동의"
                desc="차기 전시·팝업 소식 알림 (선택, 만 14세 미만 불가)"
                checked={consentMarketing}
                onChange={setConsentMarketing}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <button
                id="btn-consent-next"
                className="btn btn-primary btn-full"
                onClick={() => consentService && setStep(2)}
                disabled={!consentService}
              >
                동의하고 계속하기
              </button>
              <button
                id="btn-consent-decline"
                className="btn btn-ghost btn-full"
                onClick={() => setStep("declined")}
              >
                가이드 없이 관람하기
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: 닉네임 ── */}
        {step === 2 && (
          <div className="anim-fade" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <StepBar current={2} />

            <div style={{ flex: 1, paddingTop: "var(--space-10)" }}>
              <h2 className="t-heading" style={{ marginBottom: "var(--space-2)" }}>
                오늘의 이름을<br />
                <span className="t-italic">정해드릴게요</span>
              </h2>
              <p className="t-caption" style={{ marginBottom: "var(--space-10)" }}>
                전시 안에서만 사용하는 이름이에요
              </p>

              <input
                id="input-nickname"
                className="input-field"
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={20}
                onKeyDown={e => { if (e.key === "Enter" && nickname.trim()) setStep(3); }}
                autoFocus
              />

              <button
                id="btn-random-nickname"
                className="btn btn-ghost"
                onClick={() => setNickname(generateRandomNickname())}
                style={{
                  marginTop: "var(--space-4)",
                  color: "var(--accent)",
                  fontSize: 13,
                  padding: 0,
                }}
              >
                ✦ 랜덤 이름 받기
              </button>

              {nickname && (
                <p className="t-caption anim-fade" style={{ marginTop: "var(--space-8)", color: "var(--ink-3)" }}>
                  안녕하세요,{" "}
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{nickname}</span>님
                </p>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <button
                id="btn-nickname-next"
                className="btn btn-primary btn-full"
                onClick={() => nickname.trim() && setStep(3)}
                disabled={!nickname.trim()}
              >
                다음으로
              </button>
              
              <button
                className="btn btn-link"
                onClick={() => router.push("/login")}
                style={{ fontSize: 13, alignSelf: "center", marginTop: "var(--space-2)" }}
              >
                이미 계정이 있으신가요? 로그인하기
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: 기대 키워드 ── */}
        {step === 3 && (
          <div className="anim-fade" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {!returning && <StepBar current={3} />}

            <div style={{ flex: 1, paddingTop: returning ? 0 : "var(--space-10)" }}>
              {returning && (
                <p className="badge badge-accent anim-fade" style={{ marginBottom: "var(--space-6)", display: "inline-flex" }}>
                  다시 오셨네요 ✦
                </p>
              )}

              <h2 className="t-heading" style={{ marginBottom: "var(--space-2)" }}>
                오늘 어떤 기분을<br />
                <span className="t-italic">만나고 싶으세요?</span>
              </h2>
              <p className="t-caption" style={{ marginBottom: "var(--space-8)" }}>
                2~3개 고르면 AI 큐레이터가 맞춤 안내를 준비해요
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
                {EMOTION_LEAFS.filter(l => l.active).map(item => (
                  <EmotionChip
                    key={item.leaf}
                    item={{ ...item, emotion: item.leaf }}
                    active={selectedLeafs.some(l => l.emotion === item.leaf)}
                    onToggle={handleLeafToggle}
                  />
                ))}
                <EmotionChip
                  item={{ leaf: "잘 모르겠어요", emotion: "잘 모르겠어요", axis: "contemplative" }}
                  active={selectedLeafs.some(l => l.emotion === "잘 모르겠어요")}
                  onToggle={handleLeafToggle}
                />
              </div>

              {selectedLeafs.length > 0 && (
                <p className="t-micro anim-fade" style={{ color: "var(--accent)" }}>
                  {selectedLeafs.map(l => l.emotion).join("  ·  ")}
                </p>
              )}
            </div>

            <button
              id="btn-onboarding-complete"
              className="btn btn-primary btn-full btn-lg"
              onClick={handleStart}
              disabled={selectedLeafs.length === 0}
            >
              {returning ? "입장하기" : "관람 시작하기"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── 내부 헬퍼 컴포넌트 ── */

function StepBar({ current }: { current: number }) {
  return (
    <div className="step-indicator" style={{ marginBottom: "var(--space-2)", display: "flex", gap: "6px" }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className={`step-dot ${i === current ? "active" : i < current ? "done" : ""}`}
          style={{
            height: "2px",
            borderRadius: "2px",
            backgroundColor: i === current ? "var(--accent)" : i < current ? "rgba(139,46,74,0.3)" : "var(--border-mid)",
            transition: "all 0.2s",
            width: i === current ? "32px" : "20px"
          }}
        />
      ))}
    </div>
  );
}

interface ConsentItemProps {
  id: string;
  required?: boolean;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function ConsentItem({ id, required, label, desc, checked, onChange }: ConsentItemProps) {
  return (
    <label className="check-row" htmlFor={id} style={{ cursor: "pointer", display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
      <input
        id={id}
        type="checkbox"
        className="check-box"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: 4 }}>
          <span className="t-title" style={{ fontSize: 15 }}>{label}</span>
          {required && <span className="badge badge-accent">필수</span>}
        </div>
        <p className="t-caption">{desc}</p>
      </div>
    </label>
  );
}

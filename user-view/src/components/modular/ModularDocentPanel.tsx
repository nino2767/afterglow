"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Camera, ChevronRight, X } from "lucide-react";
import { ModularItem, EmotionChipType } from "./types";
import EmotionChip from "../EmotionChip";

interface ModularDocentPanelProps {
  item: ModularItem;
  onClose: () => void;
  theme: "main" | "spinoff";
  userSnaps: string[];
  onPhotoUpload: (base64Image: string) => void;
  selectedEmotions: EmotionChipType[];
  onEmotionToggle: (chip: EmotionChipType) => void;
  onCuratorChatClick: () => void;
}

export default function ModularDocentPanel({
  item,
  onClose,
  theme,
  userSnaps,
  onPhotoUpload,
  selectedEmotions,
  onEmotionToggle,
  onCuratorChatClick
}: ModularDocentPanelProps) {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioWaveAnim, setAudioWaveAnim] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playDocentTts = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("이 브라우저는 음성 합성(TTS) 기능을 지원하지 않습니다.");
      return;
    }

    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
      setAudioWaveAnim(false);
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(item.docent_script);
    utterance.lang = "ko-KR";

    utterance.onstart = () => {
      setAudioPlaying(true);
      setAudioWaveAnim(true);
    };

    utterance.onend = () => {
      setAudioPlaying(false);
      setAudioWaveAnim(false);
    };

    utterance.onerror = () => {
      setAudioPlaying(false);
      setAudioWaveAnim(false);
    };

    synth.speak(utterance);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        onPhotoUpload(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const accentColor = theme === "main" ? "var(--accent)" : "#4FD8EB";
  const btnBg = theme === "main" ? "var(--accent)" : "#4FD8EB";
  const btnText = theme === "main" ? "#FFFFFF" : "#062028";
  const glowShadow = theme === "spinoff" ? "0 0 15px rgba(79, 216, 235, 0.4)" : "none";

  return (
    <div style={{
      background: "var(--surface)",
      borderTop: `1px solid var(--border)`,
      padding: "var(--space-6) var(--space-5) 100px",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      borderTopLeftRadius: "var(--radius-xl)",
      borderTopRightRadius: "var(--radius-xl)",
      boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
      position: "relative",
      minHeight: "80vh"
    }}>
      
      {/* 닫기 단추 */}
      <button
        onClick={() => {
          if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
          onClose();
        }}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(255,255,255,0.06)",
          border: "none",
          color: "var(--ink-muted)",
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
      >
        <X size={16} />
      </button>

      {/* 작품 메타 정보 */}
      <div>
        <span className="tag" style={{ color: accentColor, fontSize: 10, letterSpacing: "0.2em" }}>
          {item.section}
        </span>
        <h2 className="t-serif" style={{ fontSize: 24, color: "#FFFFFF", marginTop: 4, marginBottom: 4 }}>
          {item.title}
        </h2>
        <p className="t-caption" style={{ color: "var(--ink-faint)" }}>
          {item.artist ? `${item.artist} · ` : ""}{item.year || "2026"}
        </p>
      </div>

      {/* 도슨트 설명 및 TTS 오디오 재생 */}
      <div style={{
        background: "var(--surface-2)",
        borderRadius: "var(--radius-lg)",
        padding: "16px var(--space-5)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-muted)", fontWeight: 600 }}>스마트 오디오 도슨트</span>
          
          <button
            onClick={playDocentTts}
            style={{
              background: audioPlaying ? "rgba(255,255,255,0.1)" : accentColor,
              border: "none",
              color: audioPlaying ? "#FFFFFF" : btnText,
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer"
            }}
          >
            {audioPlaying ? (
              <>
                <VolumeX size={13} /> 일시정지
              </>
            ) : (
              <>
                <Volume2 size={13} /> 오디오 가이드 듣기
              </>
            )}
          </button>
        </div>

        <p className="t-body" style={{ color: "var(--ink)", lineHeight: 1.6, fontSize: 14 }}>
          {item.docent_script}
        </p>

        {audioWaveAnim && (
          <div style={{ display: "flex", gap: 3, alignItems: "center", height: 16, marginTop: 4 }}>
            <span className="wave-bar" style={{ width: 3, height: 12, background: accentColor, borderRadius: 2 }} />
            <span className="wave-bar" style={{ width: 3, height: 16, background: accentColor, borderRadius: 2, animationDelay: "0.2s" }} />
            <span className="wave-bar" style={{ width: 3, height: 8, background: accentColor, borderRadius: 2, animationDelay: "0.4s" }} />
            <span className="wave-bar" style={{ width: 3, height: 14, background: accentColor, borderRadius: 2, animationDelay: "0.1s" }} />
            <span className="wave-bar" style={{ width: 3, height: 10, background: accentColor, borderRadius: 2, animationDelay: "0.3s" }} />
            <span style={{ fontSize: 10.5, color: accentColor, marginLeft: 6, fontWeight: 500 }}>도슨트가 나지막이 흘러나오고 있습니다</span>
          </div>
        )}
      </div>

      {/* 스냅 촬영 갤러리 */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "var(--ink-muted)", fontWeight: 600 }}>현장 관람 스냅샷</span>
          
          <label style={{
            fontSize: 11.5,
            color: accentColor,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}>
            <Camera size={13} /> 스냅 업로드
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {userSnaps.length > 0 ? (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {userSnaps.map((snap, idx) => (
              <div
                key={idx}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "var(--radius-sm)",
                  backgroundImage: `url(${snap})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid var(--border)",
                  flexShrink: 0
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{
            padding: "20px 0",
            textAlign: "center",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "var(--radius-sm)",
            border: "1px dashed var(--border)",
            fontSize: 12,
            color: "var(--ink-muted)"
          }}>
            📷 전시장 속 해당 작품의 실제 풍경을 스냅으로 등록하고 기록을 영구 보관해보세요.
          </div>
        )}
      </div>

      {/* 감정 태그 칩 반응 */}
      <div>
        <span style={{ fontSize: 12, color: "var(--ink-muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>
          이 작품을 보며 느낀 감정은 어떤가요?
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {item.default_emotion_chips.map((chip) => {
            const isChecked = selectedEmotions.some((e) => e.emotion === chip.emotion);
            return (
              <EmotionChip
                key={chip.emotion}
                item={chip}
                active={isChecked}
                onToggle={onEmotionToggle}
              />
            );
          })}
        </div>
      </div>

      {/* AI 큐레이터 대화 앵커 */}
      <button
        onClick={onCuratorChatClick}
        className="btn btn-primary btn-full"
        style={{
          background: btnBg,
          color: btnText,
          fontWeight: 800,
          borderRadius: "var(--radius-md)",
          boxShadow: glowShadow,
          marginTop: "auto",
          gap: 6
        }}
      >
        <span>AI 큐레이터와 대화 나누기</span>
        <ChevronRight size={16} />
      </button>

      <style>{`
        .wave-bar {
          animation: wave 1.2s ease-in-out infinite alternate;
        }
        @keyframes wave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

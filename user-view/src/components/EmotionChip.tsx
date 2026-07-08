"use client";

/**
 * EmotionChip.tsx — 감정 칩 컴포넌트 (Next.js TSX 버포트)
 */

import React from "react";

interface EmotionItem {
  emotion?: string;
  leaf?: string;
  axis: string;
}

interface EmotionChipProps {
  item: EmotionItem;
  active: boolean;
  onToggle?: (item: { emotion: string; axis: string }) => void;
  disabled?: boolean;
}

// 00_데이터-계약-SSOT 임시 미러 (데이터 레이어 분쟁 보류에 따른 자체 폴백 테마색상 매핑)
const EMOTION_COLORS: Record<string, string> = {
  serene: "#7B9EE8", dreamy: "#9A7EE8", melancholy: "#6B8EAE", warm: "#E8A84C",
  awe: "#4CAF7C", thrill: "#E87B7B", tension: "#9A9490", contemplative: "#C9A84C",
};

export default function EmotionChip({ item, active, onToggle, disabled = false }: EmotionChipProps) {
  const axisColor = EMOTION_COLORS[item.axis] || "#C9A84C";

  const handleClick = () => {
    if (disabled) return;
    onToggle?.({ emotion: item.emotion || item.leaf || "감정", axis: item.axis });
  };

  return (
    <button
      className={`emotion-chip ${active ? "active" : ""}`}
      style={active ? {
        backgroundColor: axisColor + "22",
        borderColor: axisColor,
        color: axisColor,
      } : {}}
      onClick={handleClick}
      disabled={disabled}
      type="button"
      aria-pressed={active}
    >
      <span
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: active ? axisColor : "var(--border-strong)",
          flexShrink: 0,
          marginRight: 6
        }}
      />
      {item.leaf || item.emotion}
    </button>
  );
}

"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { ModularItem } from "./types";

interface ModularArtworkListProps {
  items: ModularItem[];
  onItemClick: (item: ModularItem) => void;
  userSnaps: Record<string, string[]>;
  theme: "main" | "spinoff";
}

export default function ModularArtworkList({
  items,
  onItemClick,
  userSnaps,
  theme
}: ModularArtworkListProps) {
  const accentColor = theme === "main" ? "var(--accent)" : "#4FD8EB";
  const badgeBg = theme === "main" ? "rgba(139, 46, 74, 0.15)" : "rgba(79, 216, 235, 0.15)";
  const badgeText = theme === "main" ? "var(--accent)" : "#4FD8EB";
  const badgeBorder = theme === "main" ? "rgba(139, 46, 74, 0.3)" : "rgba(79, 216, 235, 0.3)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {items.map((item) => {
        const snapCount = userSnaps[item.id]?.length || 0;
        return (
          <button
            key={item.id}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              padding: "var(--space-4)",
              width: "100%",
              textAlign: "left",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              position: "relative"
            }}
            onClick={() => onItemClick(item)}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-sm)",
              background: theme === "main" 
                ? "linear-gradient(135deg, #1E1520, #0D0D0F)"
                : "linear-gradient(135deg, #0A1628, #0D0D0F)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
              fontSize: 20,
            }}>
              ✦
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <p className="t-title" style={{ marginBottom: 2, fontSize: 15 }}>{item.title}</p>
                {snapCount > 0 && (
                  <span style={{
                    fontSize: 10,
                    background: badgeBg,
                    color: badgeText,
                    border: `1px solid ${badgeBorder}`,
                    padding: "1px 6px",
                    borderRadius: 8,
                    fontWeight: 600
                  }}>
                    📷 {snapCount}
                  </span>
                )}
              </div>
              <p className="t-caption">
                {item.artist ? `${item.artist} · ` : ""}{item.section}
              </p>
            </div>
            <ChevronRight size={16} color="var(--ink-muted)" />
          </button>
        );
      })}
    </div>
  );
}

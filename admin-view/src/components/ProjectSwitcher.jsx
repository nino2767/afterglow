import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Check, Circle } from "lucide-react";

/**
 * 전시(프로젝트) 선택 스위처
 *
 * props:
 *  - clients:   CLIENTS 배열
 *  - clientId:  현재 고객사 id (운영자는 고정, 슈퍼는 선택 가능)
 *  - projectId: 현재 전시 id
 *  - mode:      "operator" | "super"
 *  - onSelect:  (clientId, projectId) => void
 *  - compact:   모바일 등 좁은 영역용 (선택)
 */
export default function ProjectSwitcher({ clients = [], clientId, projectId, mode = "operator", onSelect = () => {}, compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const client = clients.find((c) => c.id === clientId);
  const project = client?.projects.find((p) => p.id === projectId);

  // 슈퍼: 전체 고객사. 운영자: 본인 고객사만.
  const visibleClients = mode === "super" ? clients : clients.filter((c) => c.id === clientId);

  const pick = (cid, pid) => { onSelect(cid, pid); setOpen(false); };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 8, padding: compact ? "5px 9px" : "6px 11px",
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
          marginTop: 3, maxWidth: "100%",
        }}
      >
        <span style={{ fontSize: compact ? 12.5 : 13.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {project ? project.title : "전시 선택"}
        </span>
        {client && <span style={{ fontSize: 11.5, color: "var(--ink-muted)", whiteSpace: "nowrap" }}>· {client.name}</span>}
        {open
          ? <ChevronUp size={14} color="var(--ink-muted)" style={{ flexShrink: 0 }} />
          : <ChevronDown size={14} color="var(--ink-muted)" style={{ flexShrink: 0 }} />}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 60,
            minWidth: 260, maxWidth: 320, maxHeight: 380, overflow: "auto",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 12, boxShadow: "var(--shadow-lg)",
            padding: 6, fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {visibleClients.map((c) => (
            <div key={c.id} style={{ marginBottom: 4 }}>
              <div style={{
                fontSize: 11, color: "var(--ink-muted)", fontFamily: "'DM Mono',monospace",
                padding: "8px 10px 5px", letterSpacing: "0.02em",
              }}>
                {c.name} — 전시 {c.projects.length}
              </div>
              {c.projects.map((p) => {
                const selected = c.id === clientId && p.id === projectId;
                const isSpinoff = p.isSpinoff;
                return (
                  <button
                    key={p.id}
                    role="option"
                    aria-selected={selected}
                    onClick={() => pick(c.id, p.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 10, padding: isSpinoff ? "10px 10px 10px 24px" : "10px 10px", border: "none", cursor: "pointer",
                      borderRadius: 8, background: selected ? "var(--accent-dim)" : "transparent",
                      fontFamily: "'DM Sans',sans-serif", textAlign: "left",
                    }}
                    onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "var(--bg-3)"; }}
                    onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                      {isSpinoff && <span style={{ color: "var(--ink-muted)", fontSize: 11, fontFamily: "monospace", userSelect: "none" }}>└─</span>}
                      {selected
                        ? <Check size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                        : !isSpinoff && <Circle size={6} fill="var(--ink-faint)" color="var(--ink-faint)" style={{ flexShrink: 0, margin: "0 4.5px" }} />}
                      <span style={{
                        fontSize: 13.5, fontWeight: selected ? 600 : 400,
                        color: selected ? "var(--ink)" : "var(--ink-2)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{p.title}</span>
                      {isSpinoff && (
                        <span style={{ fontSize: 9, background: "var(--accent-dim)", color: "var(--accent)", padding: "1px 5px", borderRadius: 4, fontWeight: 600 }}>Spinoff</span>
                      )}
                    </span>
                    <span style={{ fontSize: 11, color: p.statusColor || "var(--ink-muted)", flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>
                      {p.status}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

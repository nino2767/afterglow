import { useState, useEffect } from "react";
import {
  LayoutDashboard, Upload, Bot, Eye, BarChart2, FileText,
  Settings, Bell, Sparkles, ChevronRight, TrendingUp,
  Users, Zap, Clock, MoreHorizontal, ArrowUpRight,
  CheckCircle2, Circle, Menu, X
} from "lucide-react";

/* ── hooks ── */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── data ── */
const NAV = [
  { id: "dashboard", icon: LayoutDashboard, label: "대시보드", short: "홈" },
  { id: "upload",    icon: Upload,          label: "IP 업로드",  short: "업로드" },
  { id: "concept",   icon: Bot,             label: "Concept Bot", short: "컨셉" },
  { id: "monitor",   icon: Eye,             label: "관람 모니터", short: "모니터" },
  { id: "report",    icon: BarChart2,       label: "성과 리포트", short: "리포트" },
  { id: "settlement",    icon: FileText,        label: "정산 관리",  short: "정산" },
];

const PROJECTS = [
  { id:1, name:"빛의 심연",   partner:"피플리",      stage:"팝업 실행", stageIdx:3, visitors:18420, conversion:24, daysLeft:12, status:"active",   conceptDone:true },
  { id:2, name:"심해의 환상", partner:"세라핌컴퍼니", stage:"기획 확정", stageIdx:1, visitors:0,     conversion:0,  daysLeft:34, status:"planning",  conceptDone:true },
  { id:3, name:"소리의 정원", partner:"피플리",      stage:"프로젝트 등록", stageIdx:0, visitors:0, conversion:0,  daysLeft:58, status:"new",      conceptDone:false },
];

const ACTIVITIES = [
  { icon:Sparkles,    color:"var(--ink-2)",      text:"Concept Bot이 '소리의 정원' 컨셉 3종 생성 완료", time:"방금 전" },
  { icon:TrendingUp,  color:"#4CAF7C",           text:"'빛의 심연' 팝업 전환율 24% 달성 — 인센티브 구간 진입", time:"23분 전" },
  { icon:Users,       color:"#7B9EE8",           text:"오늘 '빛의 심연' 관람객 342명", time:"1시간 전" },
  { icon:FileText,    color:"var(--ink-2)",      text:"'심해의 환상' MD Matcher 굿즈 라인업 12종 확정", time:"3시간 전" },
  { icon:CheckCircle2,color:"#4CAF7C",           text:"Insight Report 1차 생성 완료", time:"어제" },
];

const STAGES = ["프로젝트 등록","기획 확정","전시 운영","팝업 실행","성과 분석"];

const STATUS_MAP = {
  active:   { label:"운영중", color:"#4CAF7C",       bg:"rgba(76,175,124,0.12)" },
  planning: { label:"기획중", color:"var(--ink-2)",  bg:"var(--accent-dim)" },
  new:      { label:"신규",  color:"#7B9EE8",        bg:"rgba(123,158,232,0.12)" },
};

/* ── component ── */
export default function Dashboard({ setPage = () => {}, activePage = "dashboard" }) {
  const width   = useWindowWidth();
  const isMobile  = width < 768;
  const isTablet  = width >= 768 && width < 1024;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"var(--bg)", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:var(--border-mid);border-radius:2px;}

        .nav-item{display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:8px;cursor:pointer;transition:all 0.18s;color:var(--sidebar-text);font-size:13.5px;}
        .nav-item:hover{background:var(--sidebar-item-hover);color:var(--sidebar-text-active);}
        .nav-item.active{background:var(--sidebar-item-active);color:var(--sidebar-text-active);font-weight:500;}

        .tab-item{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;padding:8px 4px;cursor:pointer;transition:all 0.18s;color:var(--ink-muted);border:none;background:none;font-family:'DM Sans',sans-serif;}
        .tab-item.active{color:var(--ink);}
        .tab-item:hover{color:var(--ink);}

        .kpi-card{background:var(--surface);border-radius:14px;padding:18px 20px;border:1px solid var(--border);box-shadow:var(--shadow-xs);transition:transform 0.18s;}
        .kpi-card:hover{transform:translateY(-2px);}

        .project-card{background:var(--surface);border-radius:14px;padding:18px 20px;border:1px solid var(--border);box-shadow:var(--shadow-xs);transition:all 0.2s;cursor:pointer;}
        .project-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px);border-color:var(--border-strong);}

        .stage-dot{width:7px;height:7px;border-radius:50%;background:var(--border-mid);transition:background 0.2s;}
        .stage-dot.done{background:var(--ink);}
        .stage-dot.active{background:var(--ink);box-shadow:0 0 0 3px var(--accent-mid);}

        .activity-item{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--border);}
        .activity-item:last-child{border-bottom:none;}

        .gold-btn{background:var(--accent);color:#FFFFFF;border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .gold-btn:hover{background:#333333;transform:translateY(-1px);}
        .ghost-btn{background:transparent;color:var(--ink-muted);border:1px solid var(--border-mid);border-radius:8px;padding:10px 14px;font-size:13px;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .ghost-btn:hover{border-color:var(--ink);color:var(--ink);}

        .conversion-bar{height:5px;background:var(--bg-3);border-radius:99px;overflow:hidden;}
        .conversion-fill{height:100%;border-radius:99px;background:var(--ink);transition:width 0.5s ease;}

        .drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:40;}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:var(--sidebar-bg);z-index:50;padding:28px 16px;display:flex;flex-direction:column;transform:translateX(0);transition:transform 0.25s ease;}

        @keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        .fade-in{animation:fadeIn 0.3s ease forwards;}
      `}</style>

      {/* ══════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════ */}
      {!isMobile && (
        <aside style={{ width: isTablet ? 64 : 232, background:"var(--sidebar-bg)", display:"flex", flexDirection:"column", padding: isTablet ? "28px 10px" : "28px 16px", flexShrink:0, borderRight:"1px solid var(--sidebar-border)", transition:"width 0.2s" }}>
          {/* Logo */}
          <div style={{ padding:"0 8px 32px", overflow:"hidden" }}>
            {isTablet ? (
              <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Sparkles size={18} color="rgba(255,255,255,0.85)" />
              </div>
            ) : (
              <>
                <div style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.9)", fontSize:20, fontWeight:600, letterSpacing:"0.04em" }}>AFTERGLOW</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", marginTop:4 }}>OPERATOR CONSOLE</div>
              </>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
            {NAV.map(item => {
              const active = activePage === item.id;
              return (
                <div key={item.id}
                  className={`nav-item${active ? " active" : ""}`}
                  onClick={() => setPage(item.id)}
                  style={{ justifyContent: isTablet ? "center" : "flex-start", padding: isTablet ? "12px" : "10px 16px" }}
                  title={isTablet ? item.label : ""}
                >
                  <item.icon size={16} strokeWidth={1.8} />
                  {!isTablet && <span>{item.label}</span>}
                </div>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{ borderTop:"1px solid var(--sidebar-border)", paddingTop:16 }}>
            <div className="nav-item" style={{ justifyContent: isTablet ? "center" : "flex-start", padding: isTablet ? "12px" : "10px 16px" }}>
              <Settings size={16} strokeWidth={1.8} />
              {!isTablet && "설정"}
            </div>
            {!isTablet && (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", marginTop:6 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.9)", flexShrink:0 }}>S</div>
                <div>
                  <div style={{ color:"var(--sidebar-text-active)", fontSize:13, fontWeight:500 }}>기획자 S</div>
                  <div style={{ color:"var(--sidebar-text)", fontSize:11 }}>피플리 담당</div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ══════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════ */}
      {isMobile && drawerOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="drawer">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.9)", fontSize:18, fontWeight:600 }}>AFTERGLOW</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em" }}>OPERATOR CONSOLE</div>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--sidebar-text)" }}>
                <X size={18} />
              </button>
            </div>
            <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
              {NAV.map(item => (
                <div key={item.id} className={`nav-item${activePage === item.id ? " active" : ""}`}
                  onClick={() => { setPage(item.id); setDrawerOpen(false); }}>
                  <item.icon size={16} strokeWidth={1.8} />{item.label}
                </div>
              ))}
            </nav>
            <div style={{ borderTop:"1px solid var(--sidebar-border)", paddingTop:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 8px" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.9)" }}>S</div>
                <div>
                  <div style={{ color:"var(--sidebar-text-active)", fontSize:13, fontWeight:500 }}>기획자 S</div>
                  <div style={{ color:"var(--sidebar-text)", fontSize:11 }}>피플리 담당</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════
          MAIN CONTENT
      ══════════════════════════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, paddingBottom: isMobile ? 72 : 0 }}>

        {/* Header */}
        <header style={{
          padding: isMobile ? "14px 16px" : "18px 32px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"var(--bg)", borderBottom:"1px solid var(--border)",
          position:"sticky", top:0, zIndex:20
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {isMobile && (
              <button onClick={() => setDrawerOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink)", padding:4 }}>
                <Menu size={20} />
              </button>
            )}
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 18 : 22, fontWeight:600, color:"var(--ink)" }}>대시보드</div>
              {!isMobile && <div style={{ color:"var(--ink-muted)", fontSize:12, marginTop:1, fontFamily:"'DM Mono',monospace" }}>2026.05.16 — 3개 프로젝트 진행중</div>}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap: isMobile ? 8 : 12 }}>
            {!isMobile && (
              <>
                <button className="ghost-btn" style={{ fontSize:12 }}><Upload size={13} />IP 업로드</button>
                <button className="gold-btn" style={{ fontSize:12 }}><Zap size={13} />Concept Bot</button>
              </>
            )}
            {isMobile && (
              <button className="gold-btn" style={{ padding:"8px 12px", fontSize:12 }}><Zap size={13} />Bot 실행</button>
            )}
            <div style={{ position:"relative", cursor:"pointer" }}>
              <Bell size={18} strokeWidth={1.8} color="var(--ink-muted)" />
              <span style={{ position:"absolute", top:-3, right:-3, width:7, height:7, background:"var(--color-success)", borderRadius:"50%", border:"1.5px solid var(--bg)" }} />
            </div>
          </div>
        </header>

        {/* Body */}
        <main style={{ flex:1, overflow:"auto", padding: isMobile ? "16px" : "28px 32px", display:"flex", flexDirection:"column", gap: isMobile ? 14 : 24 }}>

          {/* KPI Row */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 10 : 14 }}>
            {[
              { label:"이번 주 총 관람객", value:"18,420", unit:"명", delta:"+12%", icon:Users, color:"#7B9EE8" },
              { label:"평균 팝업 전환율", value:"24", unit:"%", delta:"+4%p", icon:TrendingUp, color:"#4CAF7C" },
              { label:"기획 소요 시간", value:"3.2", unit:"시간", delta:"↓96%", icon:Clock, color:"var(--ink-2)" },
              { label:"MVP 달성률", value:"72", unit:"%", delta:"진행중", icon:Zap, color:"var(--ink-2)" },
            ].map((kpi, i) => (
              <div key={i} className="kpi-card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: isMobile ? 10 : 14 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:`${kpi.color === "var(--ink-2)" ? "var(--bg-3)" : kpi.color + "18"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <kpi.icon size={15} color={kpi.color} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize:10.5, fontWeight:600, color:"var(--color-success)", background:"var(--color-success-bg)", padding:"2px 7px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>{kpi.delta}</span>
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 22 : 28, fontWeight:600, color:"var(--ink)", letterSpacing:"-0.02em" }}>
                  {kpi.value}<span style={{ fontSize:12, fontWeight:400, color:"var(--ink-muted)", marginLeft:3 }}>{kpi.unit}</span>
                </div>
                <div style={{ color:"var(--ink-muted)", fontSize:11, marginTop:5, lineHeight:1.3 }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* MVP Progress — mobile only compact card */}
          {isMobile && (
            <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:"16px", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:"0.1em", marginBottom:10 }}>MVP WEEK 5/7</div>
              {[
                { label:"B2B 기획 효율", val:85 },
                { label:"B2C 전환율", val:72 },
                { label:"데이터 유효성", val:61 },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{item.label}</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontFamily:"'DM Mono',monospace" }}>{item.val}%</span>
                  </div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${item.val}%`, background:"rgba(255,255,255,0.5)", borderRadius:99 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects + Activity — layout splits by screen size */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 320px", gap: isMobile ? 14 : 20 }}>

            {/* Projects */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 15 : 17, fontWeight:600, color:"var(--ink)" }}>진행 중인 프로젝트</h2>
                <button className="ghost-btn" style={{ fontSize:11, padding:"6px 12px" }}>전체 보기</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {PROJECTS.map(p => {
                  const s = STATUS_MAP[p.status];
                  return (
                    <div key={p.id} className="project-card">
                      {/* Top */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                            <span style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 15 : 16, fontWeight:600, color:"var(--ink)" }}>{p.name}</span>
                            <span style={{ fontSize:10.5, fontWeight:600, color:s.color, background:s.bg, padding:"2px 8px", borderRadius:20 }}>{s.label}</span>
                          </div>
                          <div style={{ fontSize:11.5, color:"var(--ink-muted)" }}>{p.partner} · D-{p.daysLeft}</div>
                        </div>
                        <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink-faint)" }}><MoreHorizontal size={15} /></button>
                      </div>

                      {/* Stage dots — simplified on mobile */}
                      <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:12 }}>
                        {STAGES.map((stage, i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
                            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                              <div className={`stage-dot${i < p.stageIdx ? " done" : i === p.stageIdx ? " active" : ""}`} />
                              {!isMobile && (
                                <span style={{ fontSize:9.5, color:i <= p.stageIdx ? "var(--ink)" : "var(--ink-faint)", whiteSpace:"nowrap", fontFamily:"'DM Mono',monospace" }}>
                                  {i === p.stageIdx ? stage : ""}
                                </span>
                              )}
                            </div>
                            {i < STAGES.length - 1 && (
                              <div style={{ flex:1, height:1, background:i < p.stageIdx ? "var(--ink)" : "var(--border)", margin: isMobile ? "0 4px" : "0 4px 10px" }} />
                            )}
                          </div>
                        ))}
                      </div>
                      {isMobile && (
                        <div style={{ fontSize:11, color:"var(--ink-2)", fontFamily:"'DM Mono',monospace", marginBottom:10 }}>현재: {p.stage}</div>
                      )}

                      {/* Metrics */}
                      <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                        {p.status === "active" ? (
                          <>
                            <div style={{ flexShrink:0 }}>
                              <div style={{ fontSize:10.5, color:"var(--ink-muted)", marginBottom:2 }}>관람객</div>
                              <div style={{ fontSize:14, fontWeight:600, color:"var(--ink)", fontFamily:"'DM Mono',monospace" }}>{p.visitors.toLocaleString()}</div>
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                                <span style={{ fontSize:10.5, color:"var(--ink-muted)" }}>팝업 전환율</span>
                                <span style={{ fontSize:11, fontWeight:600, color:p.conversion >= 20 ? "var(--color-success)" : "var(--ink-2)", fontFamily:"'DM Mono',monospace" }}>{p.conversion}%</span>
                              </div>
                              <div className="conversion-bar">
                                <div className="conversion-fill" style={{ width:`${(p.conversion/30)*100}%` }} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div style={{ display:"flex", gap:10 }}>
                            <span style={{ fontSize:11.5, color:p.conceptDone ? "#4CAF7C" : "var(--ink-muted)", display:"flex", alignItems:"center", gap:4 }}>
                              {p.conceptDone ? <CheckCircle2 size={12}/> : <Circle size={12}/>} Concept Bot
                            </span>
                            <span style={{ fontSize:11.5, color:"var(--ink-muted)", display:"flex", alignItems:"center", gap:4 }}>
                              <Circle size={12}/> MD Matcher
                            </span>
                          </div>
                        )}
                        <button style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:12, color:"var(--accent)", fontWeight:500, flexShrink:0 }}>
                          {isMobile ? <ArrowUpRight size={16}/> : <>상세보기 <ArrowUpRight size={13}/></>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity — below on tablet/mobile */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 15 : 17, fontWeight:600, color:"var(--ink)" }}>최근 활동</h2>
                <span style={{ fontSize:11, color:"var(--color-success)", fontFamily:"'DM Mono',monospace" }}>실시간 ●</span>
              </div>
              <div style={{ background:"var(--surface)", borderRadius:14, padding:"6px 18px", border:"1px solid var(--border)" }}>
                {ACTIVITIES.slice(0, isMobile ? 4 : 5).map((a, i) => (
                  <div key={i} className="activity-item">
                    <div style={{ width:28, height:28, borderRadius:8, background:"var(--bg-3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      <a.icon size={13} color={a.color} strokeWidth={2} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color:"var(--ink-2)", lineHeight:1.5 }}>{a.text}</div>
                      <div style={{ fontSize:10.5, color:"var(--ink-faint)", marginTop:2, fontFamily:"'DM Mono',monospace" }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:11, color:"var(--ink-muted)", marginBottom:8, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em" }}>QUICK ACTIONS</div>
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr", gap:8 }}>
                  {[
                    { label:"새 프로젝트 등록", icon:Upload },
                    { label:"리포트 생성 요청", icon:BarChart2 },
                    ...(!isMobile ? [{ label:"파트너사에 공유", icon:ArrowUpRight }] : []),
                  ].map((action, i) => (
                    <button key={i} style={{
                      display:"flex", alignItems:"center", gap:8, background:"var(--surface)",
                      border:"1px solid var(--border)", borderRadius:10,
                      padding:"11px 14px", cursor:"pointer", transition:"all 0.18s",
                      fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:"var(--ink-2)", textAlign:"left"
                    }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--ink-2)";}}>
                      <action.icon size={13} strokeWidth={1.8} />
                      {action.label}
                      {!isMobile && <ChevronRight size={12} style={{ marginLeft:"auto", opacity:0.4 }} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop MVP card */}
          {!isMobile && (
            <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:"22px 28px", border:"1px solid rgba(255,255,255,0.08)", display:"flex", gap:32, alignItems:"center" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>MVP WEEK 5/7</div>
              <div style={{ flex:1, display:"flex", gap:24 }}>
                {[{label:"B2B 기획 효율",val:85},{label:"B2C 전환율 20%↑",val:72},{label:"데이터 유효성",val:61}].map((item,i)=>(
                  <div key={i} style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:11.5, color:"rgba(255,255,255,0.4)" }}>{item.label}</span>
                      <span style={{ fontSize:11.5, color:"rgba(255,255,255,0.7)", fontFamily:"'DM Mono',monospace" }}>{item.val}%</span>
                    </div>
                    <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:99, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${item.val}%`, background:"rgba(255,255,255,0.45)", borderRadius:99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══════════════════════════════
          MOBILE BOTTOM TAB BAR
      ══════════════════════════════ */}
      {isMobile && (
        <nav style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:30,
          background:"var(--surface)", borderTop:"1px solid var(--border)",
          display:"flex", padding:"6px 0 max(6px, env(safe-area-inset-bottom))",
          boxShadow:"0 -4px 20px rgba(0,0,0,0.06)"
        }}>
          {NAV.map(item => {
            const active = activePage === item.id;
            return (
              <button key={item.id} className={`tab-item${active ? " active" : ""}`} onClick={() => setPage(item.id)}>
                <item.icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                <span style={{ fontSize:9.5, fontWeight:active ? 600 : 400 }}>{item.short}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  LayoutDashboard, Upload, Bot, Eye, BarChart2, FileText,
  Settings, Bell, Users, MessageSquare, TrendingUp, Zap,
  Activity, ChevronRight, Menu, X, Sparkles, Info
} from "lucide-react";
import ProjectSwitcher from "../../components/ProjectSwitcher.jsx";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}

const NAV = [
  { id:"dashboard", icon:LayoutDashboard, label:"대시보드",    short:"홈" },
  { id:"upload",    icon:Upload,          label:"IP 업로드",   short:"업로드" },
  { id:"concept",   icon:Bot,             label:"Concept Bot", short:"컨셉" },
  { id:"monitor",   icon:Eye,             label:"관람 모니터", short:"모니터", active:true },
  { id:"report",    icon:BarChart2,       label:"성과 리포트", short:"리포트" },
  { id: "settlement",    icon:FileText,        label:"정산 관리",   short:"정산" },
];

const SECTIONS = [
  { name:"입구 · 온보딩",    visitors:342, heat:100, avgMin:2,  keywords:["기대감","설렘"],        color:"#E87B7B" },
  { name:"섹션 1 · 빛의 탄생", visitors:289, heat:84,  avgMin:5,  keywords:["신비로움","웅장함"],    color:"#C9A84C" },
  { name:"섹션 2 · 심해 유영", visitors:318, heat:93,  avgMin:7,  keywords:["몽환적","평온함"],      color:"#E87B7B" },
  { name:"섹션 3 · 거대 고래관",visitors:342, heat:100, avgMin:12, keywords:["압도적","경이로움"],   color:"#E87B7B" },
  { name:"섹션 4 · 빛의 심연", visitors:276, heat:81,  avgMin:8,  keywords:["고요함","심오함"],      color:"#C9A84C" },
  { name:"출구 · 브릿지",    visitors:201, heat:59,  avgMin:3,  keywords:["여운","구매의향"],       color:"#7B9EE8" },
];

const SPINOFF_SECTIONS = [
  { name: "ZONE 1 · 소리 탐색 (딥블루 레코드)", visitors: 124, heat: 100, avgMin: 4, keywords: ["고요함", "평온함"], color: "#4CAF7C" },
  { name: "ZONE 2 · 루미너스 월 (인터랙티브)",   visitors: 98,  heat: 79,  avgMin: 6, keywords: ["몽환적", "신비로움"], color: "#7B9EE8" },
  { name: "ZONE 3 · 아카이브 바 (티 라운지)",    visitors: 82,  heat: 66,  avgMin: 5, keywords: ["아늑함", "여운"], color: "#C9A84C" },
];

const KEYWORDS = [
  { word:"고요함",   count:847, size:22, color:"#7B9EE8" },
  { word:"몽환적",   count:712, size:19, color:"#C9A84C" },
  { word:"압도적",   count:634, size:18, color:"#4CAF7C" },
  { word:"신비로움", count:589, size:17, color:"#E8A84C" },
  { word:"경이로움", count:421, size:15, color:"#7B9EE8" },
  { word:"평온함",   count:398, size:15, color:"#C9A84C" },
  { word:"웅장함",   count:312, size:14, color:"#9A9490" },
  { word:"심오함",   count:287, size:13, color:"#4CAF7C" },
  { word:"설렘",     count:241, size:13, color:"#E8A84C" },
  { word:"여운",     count:198, size:12, color:"#7B9EE8" },
];

const CONVERSATIONS = [
  { section:"섹션 3", q:"이 고래는 실제 데이터로 만들어진 건가요?",      emotion:"경이로움", color:"#7B9EE8", bridge:false, time:"방금 전" },
  { section:"섹션 2", q:"이 파란빛이 왜 이렇게 마음이 편해지는 걸까요?", emotion:"평온함",   color:"#4CAF7C", bridge:false, time:"1분 전" },
  { section:"출구",   q:"팝업 초대장 받을 수 있나요?",                   emotion:"구매의향", color:"#C9A84C", bridge:true,  time:"2분 전" },
  { section:"섹션 4", q:"심연이라는 단어를 왜 썼는지 알 것 같아요",       emotion:"심오함",   color:"#9A7EE8", bridge:false, time:"3분 전" },
  { section:"출구",   q:"이 전시 굿즈 어디서 살 수 있나요?",             emotion:"구매의향", color:"#C9A84C", bridge:true,  time:"6분 전" },
];

const HOURLY = [28,35,42,38,52,67,89,124,156,178,201,189,212,198,176,203,234,267,289,312];
const currentHour = 17;
const maxH = Math.max(...HOURLY);

export default function MonitorResponsive({ setPage = () => {}, activePage = "monitor", clients = [], clientId, projectId, project, mode = "operator", onSelectProject = () => {} }) {
  const width = useWindowWidth();
  const clientName = clients.find(c => c.id === clientId)?.name || "";
  const projTitle = project?.title || "전시 미선택";
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [liveCount, setLiveCount] = useState(342);
  const [bridgeCount, setBridgeCount] = useState(82);
  const [selectedSection, setSelectedSection] = useState(0);
  const [mobileTab, setMobileTab] = useState("sections"); // sections | keywords | chat

  const isSpinoff = projectId === "pj_abyss_spinoff" || project?.isSpinoff;
  const currentSections = isSpinoff ? SPINOFF_SECTIONS : SECTIONS;

  // 감정어 승인 큐 상태 (pending_review)
  const [pendingReviews, setPendingReviews] = useState([
    { word: "아스라한", count: 24 },
    { word: "심연의끝", count: 18 },
    { word: "파도소리", count: 11 }
  ]);

  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    const t = setInterval(() => {
      setLiveCount(v => v + Math.floor(Math.random() * 3 - 1));
      setBridgeCount(v => Math.random() > 0.7 ? v + 1 : v);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const Sidebar = ({ setPage, activePage }) => (
    <aside style={{ width:isTablet?64:232, background:"var(--sidebar-bg)", display:"flex", flexDirection:"column", padding:isTablet?"28px 10px":"28px 16px", flexShrink:0, borderRight:"1px solid var(--sidebar-border)" }}>
      <div style={{ padding:"0 8px 32px", overflow:"hidden" }}>
        {isTablet
          ? <div style={{ width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}><Sparkles size={18} color="rgba(255,255,255,0.85)"/></div>
          : <><div style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.9)", fontSize:20, fontWeight:600, letterSpacing:"0.04em" }}>AFTERGLOW</div><div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", marginTop:4 }}>OPERATOR CONSOLE</div></>
        }
      </div>
      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
        {NAV.map(item => (
          <div key={item.id} className={`nav-item${activePage === item.id ? " active" : ""}`} onClick={() => setPage(item.id)}
            style={{ justifyContent:isTablet?"center":"flex-start", padding:isTablet?"12px":"10px 16px" }} title={isTablet?item.label:""}>
            <item.icon size={16} strokeWidth={1.8}/>{!isTablet && item.label}
          </div>
        ))}
      </nav>
      <div style={{ borderTop:"1px solid var(--sidebar-border)", paddingTop:16 }}>
        <div className="nav-item" style={{ justifyContent:isTablet?"center":"flex-start", padding:isTablet?"12px":"10px 16px" }}><Settings size={16} strokeWidth={1.8}/>{!isTablet&&"설정"}</div>
        {!isTablet && <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", marginTop:6 }}>
          <div style={{ width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.9)",flexShrink:0 }}>S</div>
          <div><div style={{ color:"var(--sidebar-text-active)", fontSize:13, fontWeight:500 }}>기획자 S</div><div style={{ color:"var(--sidebar-text)", fontSize:11 }}>{clientName} 담당</div></div>
        </div>}
      </div>
    </aside>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:var(--border-mid);border-radius:2px;}
        .nav-item{display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:8px;cursor:pointer;transition:all 0.18s;color:var(--sidebar-text);font-size:13.5px;}
        .nav-item:hover{background:var(--sidebar-item-hover);color:var(--sidebar-text-active);}
        .nav-item.active{background:var(--sidebar-item-active);color:var(--sidebar-text-active);font-weight:500;}
        .tab-item{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;padding:8px 4px;cursor:pointer;transition:all 0.18s;color:var(--ink-muted);border:none;background:none;font-family:'DM Sans',sans-serif;}
        .tab-item.active{color:var(--ink);}
        .card{background:var(--surface);border-radius:14px;padding:18px 20px;border:1px solid var(--border);box-shadow:var(--shadow-xs);}
        .section-row{padding:11px 14px;border-radius:10px;background:var(--surface);border:1.5px solid transparent;cursor:pointer;transition:all 0.18s;display:flex;align-items:center;gap:12px;}
        .section-row:hover{border-color:var(--border-mid);}
        .section-row.selected{border-color:var(--ink);background:var(--bg-2);}
        .chat-row{padding:11px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;}
        .chat-row:last-child{border-bottom:none;}
        .live-dot{width:7px;height:7px;border-radius:50%;background:var(--color-success);animation:livePulse 1.8s ease-in-out infinite;}
        .mtab{padding:8px 16px;border-radius:20px;font-size:12.5px;font-weight:500;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 0.18s;}
        .mtab.active{background:var(--accent);color:#FFFFFF;}
        .mtab.idle{background:var(--surface);color:var(--ink-muted);border:1px solid var(--border);}
        .drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:40;}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:var(--sidebar-bg);z-index:50;padding:28px 16px;display:flex;flex-direction:column;}
        @keyframes livePulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,0.6);}50%{opacity:.8;box-shadow:0 0 0 5px rgba(34,197,94,0);}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}.fade-in{animation:fadeIn 0.3s ease forwards;}
      `}</style>

      {!isMobile && <Sidebar setPage={setPage} activePage={activePage}/>}

      {/* MOBILE DRAWER */}
      {isMobile && drawerOpen && (
        <><div className="drawer-overlay" onClick={()=>setDrawerOpen(false)}/>
          <div className="drawer">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.9)", fontSize:18, fontWeight:600 }}>AFTERGLOW</div>
              <button onClick={()=>setDrawerOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--sidebar-text)" }}><X size={18}/></button>
            </div>
            <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
              {NAV.map(item => <div key={item.id} className={`nav-item${activePage === item.id ? " active" : ""}`} onClick={() => { setPage(item.id); setDrawerOpen(false); }}><item.icon size={16} strokeWidth={1.8}/>{item.label}</div>)}
            </nav>
          </div>
        </>
      )}

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, paddingBottom:isMobile?72:0 }}>

        {/* Header */}
        <header style={{ padding:isMobile?"14px 16px":"18px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--bg)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {isMobile && <button onClick={()=>setDrawerOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink)", padding:4 }}><Menu size={20}/></button>}
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:600, color:"var(--ink)" }}>관람 모니터</div>
              <div style={{ marginTop:3 }}><ProjectSwitcher clients={clients} clientId={clientId} projectId={projectId} mode={mode} onSelect={onSelectProject} compact={isMobile} /></div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:"var(--color-success-bg)", border:"1px solid var(--color-success)", borderRadius:20, padding:"5px 12px" }}>
              <div className="live-dot"/>
              <span style={{ fontSize:11.5, fontWeight:600, color:"var(--color-success)", fontFamily:"'DM Mono',monospace" }}>LIVE</span>
            </div>
            <div style={{ position:"relative", cursor:"pointer" }}>
              <Bell size={18} strokeWidth={1.8} color="var(--ink-muted)"/>
              <span style={{ position:"absolute", top:-3, right:-3, width:7, height:7, background:"var(--color-success)", borderRadius:"50%", border:"1.5px solid var(--bg)" }}/>
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflow:"auto", padding:isMobile?"14px":"24px 32px", display:"flex", flexDirection:"column", gap:isMobile?12:20 }}>

          {/* KPI Row */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:isMobile?10:14 }}>
            {[
              { id: "live", label:"현재 관람 인원", value:liveCount, unit:"명", icon:Users, color:"#7B9EE8", live:true, sub:"실시간", tooltipText: "현재 오프라인 전시에 머물고 있는 실시간 관람객 수입니다. (체류 기준)" },
              { id: "total", label:"오늘 총 관람객", value:"3,124", unit:"명", icon:Activity, color:"var(--ink-2)", live:false, sub:"어제 대비 +8%", tooltipText: "오늘 하루 동안 입장 큐알을 스캔한 중복 제외 관람객 수입니다." },
              { id: "chat", label:"AI 큐레이터 대화", value:"1,847", unit:"건", icon:MessageSquare, color:"#4CAF7C", live:false, sub:"인당 avg 5.4건", tooltipText: "AI 큐레이터와의 실시간 대화 수이며, 챗 내 감정 언급은 퀵반응과 동일 가중치로 감정 지표에 합산됩니다." },
              { id: "bridge", label:"브릿지 발송 (dwell_sec)", value:bridgeCount, unit:"건", icon:Zap, color:"var(--ink-2)", live:true, sub:"전환율 24%", tooltipText: "작품별 dwell_sec(카드 오픈~다음 스캔/이탈 시 체류시간, 백그라운드 전환 시 일시정지)에 도달해 발송된 브릿지 수입니다." },
            ].map((kpi,i) => (
              <div
                key={i}
                className="card"
                style={{ padding:isMobile?"14px":"18px 20px", position: "relative" }}
                onMouseEnter={() => setActiveTooltip(kpi.id)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:isMobile?8:12 }}>
                  <div style={{ width:30,height:30,borderRadius:8,background:`${kpi.color === "var(--ink-2)" ? "var(--bg-3)" : kpi.color + "18"}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <kpi.icon size={14} color={kpi.color} strokeWidth={2}/>
                  </div>
                  {kpi.live && <div className="live-dot"/>}
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:26, fontWeight:600, color:"var(--ink)", letterSpacing:"-0.02em" }}>
                  {typeof kpi.value==="number"?kpi.value.toLocaleString():kpi.value}
                  <span style={{ fontSize:11, fontWeight:400, color:"var(--ink-muted)", marginLeft:3 }}>{kpi.unit}</span>
                </div>
                <div style={{ fontSize:isMobile?10.5:11.5, color:"var(--ink-muted)", marginTop:3, display:"flex", alignItems:"center", gap:4 }}>
                  {kpi.label}
                  <Info size={11} color="var(--ink-faint)" />
                </div>
                {!isMobile && <div style={{ fontSize:11, color:kpi.color, marginTop:2, fontFamily:"'DM Mono',monospace" }}>{kpi.sub}</div>}

                {/* 툴팁 오버레이 */}
                {activeTooltip === kpi.id && (
                  <div className="fade-in" style={{
                    position: "absolute", bottom: "calc(100% + 8px)", left: 10, right: 10, zIndex: 100,
                    background: "var(--sidebar-bg)", color: "rgba(255,255,255,0.9)", fontSize: 11,
                    padding: "8px 12px", borderRadius: 8, boxShadow: "var(--shadow-md)",
                    lineHeight: 1.5, border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    {kpi.tooltipText}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: Tab switcher */}
          {isMobile && (
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
              {[["sections","섹션 히트맵"],["keywords","취향 키워드"],["chat","AI 대화 피드"],["chart","시간대 추이"]].map(([val,label]) => (
                <button key={val} className={`mtab ${mobileTab===val?"active":"idle"}`} onClick={()=>setMobileTab(val)} style={{ whiteSpace:"nowrap" }}>{label}</button>
              ))}
            </div>
          )}

          {/* DESKTOP: 2-column layout */}
          {!isMobile && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:18 }}>
                {/* Section Heatmap */}
                <div className="card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>섹션별 인기 지수</h3>
                    <span style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>현재 기준</span>
                  </div>
                  <SectionList sections={currentSections} selected={selectedSection} onSelect={setSelectedSection}/>
                </div>
                {/* Keyword Cloud */}
                <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:"18px 20px", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"rgba(255,255,255,0.9)" }}>취향 키워드 누적</h3>
                    <span style={{ fontSize:11, color:"var(--color-success)", fontFamily:"'DM Mono',monospace" }}>오늘 1,847건</span>
                  </div>
                  <KeywordCloud keywords={KEYWORDS}/>
                  <AIInsight/>

                  {/* 감정어 승인 대기 큐 (pending_review) */}
                  <div style={{ marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 10 }}>
                      <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize: 13, fontWeight:600, color:"rgba(255,255,255,0.9)" }}>감정어 승인 큐 (pending_review)</h4>
                      <span style={{ fontSize: 10, color: "var(--color-warning)", fontFamily: "'DM Mono',monospace" }}>대기 {pendingReviews.length}건</span>
                    </div>
                    {pendingReviews.length === 0 ? (
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", padding: "10px 0" }}>대기 중인 감정어가 없습니다.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {pendingReviews.map((pr, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>#{pr.word}</span>
                              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono',monospace" }}>({pr.count}회)</span>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                onClick={() => {
                                  alert(`'${pr.word}' 감정어가 active 상태로 승인되어 관람객 화면 칩 노출에 반영됩니다.`);
                                  setPendingReviews(pendingReviews.filter((_, i) => i !== idx));
                                }}
                                style={{ background: "var(--color-success-bg)", border: "1px solid var(--color-success)", color: "var(--color-success)", fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer" }}
                              >
                                승인
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`'${pr.word}' 감정어를 기각하시겠습니까?`)) {
                                    setPendingReviews(pendingReviews.filter((_, i) => i !== idx));
                                  }
                                }}
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer" }}
                              >
                                기각
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:18 }}>
                {/* Hourly chart */}
                <div className="card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>시간대별 입장 추이</h3>
                    <span style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>09:00 ~ 현재</span>
                  </div>
                  <HourlyChart hourly={HOURLY} maxH={maxH} currentHour={currentHour}/>
                </div>
                {/* Live chat */}
                <div className="card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>AI 큐레이터 실시간 대화</h3>
                    <span style={{ fontSize:11, color:"var(--color-success)", fontFamily:"'DM Mono',monospace", display:"flex", alignItems:"center", gap:5 }}><div className="live-dot" style={{ width:6,height:6 }}/>실시간</span>
                  </div>
                  <ChatFeed convos={CONVERSATIONS} bridgeCount={bridgeCount}/>
                </div>
              </div>
            </>
          )}

          {/* MOBILE: Tab content */}
          {isMobile && mobileTab==="sections" && (
            <div className="card fade-in">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>섹션별 인기 지수</h3>
                <span style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>현재 기준</span>
              </div>
              <SectionList sections={currentSections} selected={selectedSection} onSelect={setSelectedSection} compact/>
            </div>
          )}
          {isMobile && mobileTab==="keywords" && (
            <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:"18px", border:"1px solid rgba(255,255,255,0.08)" }} className="fade-in">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"rgba(255,255,255,0.9)" }}>취향 키워드 누적</h3>
                <span style={{ fontSize:11, color:"var(--color-success)", fontFamily:"'DM Mono',monospace" }}>1,847건</span>
              </div>
              <KeywordCloud keywords={KEYWORDS}/>
              <AIInsight/>

              {/* 감정어 승인 대기 큐 (pending_review) */}
              <div style={{ marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 10 }}>
                  <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize: 13, fontWeight:600, color:"rgba(255,255,255,0.9)" }}>감정어 승인 큐 (pending_review)</h4>
                  <span style={{ fontSize: 10, color: "var(--color-warning)", fontFamily: "'DM Mono',monospace" }}>대기 {pendingReviews.length}건</span>
                </div>
                {pendingReviews.length === 0 ? (
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", padding: "10px 0" }}>대기 중인 감정어가 없습니다.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {pendingReviews.map((pr, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>#{pr.word}</span>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono',monospace" }}>({pr.count}회)</span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => {
                              alert(`'${pr.word}' 감정어가 active 상태로 승인되어 관람객 화면 칩 노출에 반영됩니다.`);
                              setPendingReviews(pendingReviews.filter((_, i) => i !== idx));
                            }}
                            style={{ background: "var(--color-success-bg)", border: "1px solid var(--color-success)", color: "var(--color-success)", fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer" }}
                          >
                            승인
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`'${pr.word}' 감정어를 기각하시겠습니까?`)) {
                                setPendingReviews(pendingReviews.filter((_, i) => i !== idx));
                              }
                            }}
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer" }}
                          >
                            기각
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {isMobile && mobileTab==="chat" && (
            <div className="card fade-in">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>AI 큐레이터 실시간 대화</h3>
                <span style={{ fontSize:11, color:"var(--color-success)", fontFamily:"'DM Mono',monospace", display:"flex", alignItems:"center", gap:5 }}><div className="live-dot" style={{ width:6,height:6 }}/>실시간</span>
              </div>
              <ChatFeed convos={CONVERSATIONS} bridgeCount={bridgeCount}/>
            </div>
          )}
          {isMobile && mobileTab==="chart" && (
            <div className="card fade-in">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>시간대별 입장 추이</h3>
                <span style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>09:00 ~ 현재</span>
              </div>
              <HourlyChart hourly={HOURLY} maxH={maxH} currentHour={currentHour}/>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM TAB */}
      {isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:30, background:"var(--surface)", borderTop:"1px solid var(--border)", display:"flex", padding:"6px 0 max(6px,env(safe-area-inset-bottom))", boxShadow:"0 -4px 20px rgba(0,0,0,0.06)" }}>
          {NAV.map(item => {
            const active = activePage===item.id;
            return <button key={item.id} className={`tab-item${active?" active":""}`} onClick={()=>setPage(item.id)}><item.icon size={20} strokeWidth={active?2.2:1.8}/><span style={{ fontSize:9.5, fontWeight:active?600:400 }}>{item.short}</span></button>;
          })}
        </nav>
      )}
    </div>
  );
}

/* ── Sub-components ── */
function SectionList({ sections, selected, onSelect, compact }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
      {sections.map((s,i) => {
        const isSelected = selected===i;
        return (
          <div key={i} className={`section-row${isSelected?" selected":""}`} onClick={()=>onSelect(i)}>
            <div style={{ width:26,height:26,borderRadius:7,background:`${s.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <span style={{ fontSize:10.5, fontWeight:700, color:s.color, fontFamily:"'DM Mono',monospace" }}>{String(i+1).padStart(2,"0")}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12.5, fontWeight:500, color:"var(--ink-2)" }}>{s.name}</span>
                <span style={{ fontSize:11.5, fontWeight:600, color:s.color, fontFamily:"'DM Mono',monospace" }}>{s.visitors}명</span>
              </div>
              <div style={{ height:5, background:"var(--bg-3)", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${s.heat}%`, background:`linear-gradient(90deg,${s.color}80,${s.color})`, borderRadius:99 }}/>
              </div>
            </div>
            {!compact && <div style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", flexShrink:0 }}>avg {s.avgMin}분</div>}
          </div>
        );
      })}
      {selected!==null && sections[selected] && (
        <div className="fade-in" style={{ marginTop:6, padding:"11px 14px", background:"var(--accent-dim)", borderRadius:10, border:"1px solid var(--border-mid)" }}>
          <div style={{ fontSize:10.5, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:6 }}>실시간 감정 키워드</div>
          <div style={{ display:"flex", gap:6 }}>
            {sections[selected].keywords.map(k=>(
              <span key={k} style={{ fontSize:12, background:"var(--accent-mid)", color:"var(--accent)", padding:"3px 10px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>#{k}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// KeywordCloud: 데이터별 색상 k.color 유지
function KeywordCloud({ keywords }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:14 }}>
      {keywords.map((k,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:4, background:`${k.color}15`, border:`1px solid ${k.color}30`, borderRadius:20, padding:`${Math.max(4,k.size*0.18)}px ${Math.max(9,k.size*0.5)}px` }}>
          <span style={{ fontSize:k.size*0.6+7, fontWeight:i<3?600:400, color:k.color }}>{k.word}</span>
          <span style={{ fontSize:9, color:`${k.color}80`, fontFamily:"'DM Mono',monospace" }}>{k.count}</span>
        </div>
      ))}
    </div>
  );
}

function AIInsight() {
  return (
    <div style={{ padding:"12px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.5)", fontFamily:"'DM Mono',monospace", marginBottom:6 }}>AI INSIGHT</div>
      <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>
        오늘 관람객 <span style={{ color:"rgba(255,255,255,0.85)" }}>68%</span>가 '고요함·평온함' 계열 반복 언급. 팝업 컨셉 <span style={{ color:"rgba(255,255,255,0.85)", textDecoration:"underline" }}>어비스 티 라운지(C안)</span>와 높은 정합성 — 재검토 권장.
      </div>
    </div>
  );
}

// ChatFeed: 대화 감정별 색상 c.color 유지
function ChatFeed({ convos, bridgeCount }) {
  return (
    <>
      <div style={{ overflow:"auto", maxHeight:260 }}>
        {convos.map((c,i) => (
          <div key={i} style={{ padding:"10px 0", borderBottom:"1px solid var(--border)", display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:26,height:26,borderRadius:7,background:`${c.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
              <MessageSquare size={12} color={c.color}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", gap:5, alignItems:"center", marginBottom:3, flexWrap:"wrap" }}>
                <span style={{ fontSize:10.5, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>{c.section}</span>
                <span style={{ fontSize:10.5, background:`${c.color}18`, color:c.color, padding:"1px 6px", borderRadius:20 }}>#{c.emotion}</span>
                {c.bridge && <span style={{ fontSize:10, background:"var(--accent-mid)", color:"var(--accent)", padding:"1px 6px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>브릿지↗</span>}
              </div>
              <div style={{ fontSize:12.5, color:"var(--ink-2)", lineHeight:1.5 }}>"{c.q}"</div>
              <div style={{ fontSize:10.5, color:"var(--ink-faint)", marginTop:2, fontFamily:"'DM Mono',monospace" }}>{c.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:12, color:"var(--ink-muted)" }}>브릿지 {bridgeCount}건 · 오늘</span>
        <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:12.5, color:"var(--accent)", fontWeight:500, display:"flex", alignItems:"center", gap:4, fontFamily:"'DM Sans',sans-serif" }}>전체 보기 <ChevronRight size={13}/></button>
      </div>
    </>
  );
}

function HourlyChart({ hourly, maxH, currentHour }) {
  const displayData = hourly.slice(9, currentHour - 9 + 1 + 9);
  return (
    <>
      <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:100 }}>
        {displayData.map((v,i) => {
          const hour = i+9;
          const isCurrent = hour===currentHour;
          const barH = Math.round((v/maxH)*100);
          return (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              {isCurrent && <span style={{ fontSize:9, color:"var(--accent)", fontFamily:"'DM Mono',monospace" }}>{v}</span>}
              <div style={{ width:"100%", height:`${barH}%`, background:isCurrent?"var(--accent)":"var(--border-mid)", borderRadius:"4px 4px 0 0", minHeight:4 }}/>
              <div style={{ fontSize:9, color:isCurrent?"var(--accent)":"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>{hour}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:12, display:"flex", gap:16 }}>
        {[{label:"피크타임",val:"14:00~16:00",color:"var(--accent)"},{label:"평균 체류",val:"47분",color:"#7B9EE8"}].map((s,i)=>(
          <div key={i}>
            <div style={{ fontSize:10.5, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:2 }}>{s.label}</div>
            <div style={{ fontSize:13.5, fontWeight:600, color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
    </>
  );
}

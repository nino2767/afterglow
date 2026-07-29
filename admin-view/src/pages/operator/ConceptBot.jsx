import { useState, useEffect } from "react";
import {
  LayoutDashboard, Upload, Bot, Eye, BarChart2, FileText,
  Settings, Bell, Sparkles, CheckCircle2, ArrowRight,
  RefreshCw, Download, ChevronDown, ChevronUp, Zap,
  Package, Map, BookOpen, Star, X, Menu, Info
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
  { id:"concept",   icon:Bot,             label:"Concept Bot", short:"컨셉", active:true },
  { id:"monitor",   icon:Eye,             label:"관람 모니터", short:"모니터" },
  { id:"report",    icon:BarChart2,       label:"성과 리포트", short:"리포트" },
  { id: "settlement",    icon:FileText,        label:"정산 관리",   short:"정산" },
];

// CONCEPTS 카드별 고유 색상은 카테고리 구분용이므로 유지
const CONCEPTS = [
  {
    id:"A", concept_type:"sensory", color:"#4CAF7C", bg:"rgba(76,175,124,0.08)", border:"rgba(76,175,124,0.3)",
    name:"딥블루 레코드", sub:"감각 확장형 (sensory)",
    desc:"전시의 감동을 소리로 간직하는 바이닐 팝업. AI가 관람객 취향 데이터를 분석해 개인화 사운드트랙을 큐레이션합니다.",
    space:"청음 부스 + 빈티지 포스터 월",
    md:["전시 한정판 LP / 카세트 테이프","아티스트 사운드 샘플러","큐레이션 플레이리스트 카드"],
    ai:"관람객 취향에 맞는 심해 사운드트랙 자동 큐레이션", score:88,
    reason:"청각 키워드 반응율 높음, MD 마진율 우수",
    personalized_copy: "당신의 깊은 여운을 기록하는 소리, 딥블루 레코드가 준비되어 있습니다.",
  },
  {
    id:"B", concept_type:"story", color:"#7B9EE8", bg:"rgba(123,158,232,0.08)", border:"rgba(123,158,232,0.3)",
    name:"루미너스 랩", sub:"세계관 확장형 (story)",
    desc:"AI와 함께 나만의 심해 생물을 만드는 디지털 쇼룸. 관람객 인터랙션 데이터 기반으로 크리처 외형을 자동 생성합니다.",
    space:"대형 터치 테이블 + 3D 프린팅 존",
    md:["AI 디자인 심해 생물 피규어","홀로그램 스티커 세트","개인 맞춤형 영상 NFT"],
    ai:"관람객 인터랙션 데이터 기반 크리처 외형 자동 생성", score:94,
    reason:"MVP 전환율 달성 확률 최고. SNS 바이럴 가능성 ↑", recommended:true,
    personalized_copy: "심해 생물과의 상호작용을 통해 탄생한 또 다른 세계, 루미너스 랩에서 확인하세요.",
  },
  {
    id:"C", concept_type:"archive", color:"#C9A84C", bg:"rgba(201,168,76,0.08)", border:"rgba(201,168,76,0.3)",
    name:"어비스 티 라운지", sub:"아카이브형 (archive)",
    desc:"심해의 색감과 온도를 미각으로 경험하는 몰입형 카페. 현재 감정 상태에 맞는 티 페어링을 AI가 추천합니다.",
    space:"미디어 파사드 적용 프라이빗 테이블",
    md:["온도에 따라 색이 변하는 심해 칵테일/티","산호초 디저트 세트","전시 테마 인센스 스틱"],
    ai:"현재 감정 상태에 맞는 Tea 페어링 실시간 추천", score:79,
    reason:"운영 난이도 최저, F&B 파트너십 연계 시 비용 절감",
    personalized_copy: "당신만을 위해 엄선된 차 한 잔과 함께 심해의 심연 속으로 침잠해 보세요.",
  },
];

export default function ConceptBotResponsive({ setPage = () => {}, activePage = "concept", clients = [], clientId, projectId, project, mode = "operator", onSelectProject = () => {} }) {
  const width = useWindowWidth();
  const clientName = clients.find(c => c.id === clientId)?.name || "";
  const projTitle = project?.title || "전시 미선택";
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [regenerating, setRegen] = useState(false);
  const [showIPSummary, setShowIPSummary] = useState(!isMobile);

  // 신규 상태 정의 (운영 정책 및 스핀오프 설정)
  const [startDate, setStartDate] = useState("2026-07-12");
  const [endDate, setEndDate] = useState("2026-07-26");
  const [mainEndDate, setMainEndDate] = useState("2026-07-20");
  const [status, setStatus] = useState("planning");
  const [showClosedWarning, setShowClosedWarning] = useState(false);

  // SPINOFF_ZONE 데이터 관리
  const [zones, setZones] = useState([
    { id: 1, concept_type: "sensory", title: "ZONE 1: 소리 탐색 (딥블루 레코드)", experience_desc: "관람객 취향 음악 분석 및 헤드폰 청음 체험", docent_script: "빛의 심연 아래, 고요한 소리에 귀 기울여 보세요. AI가 큐레이션한 음악이 흘러나옵니다.", linked_md_ids: "LP, Cassette" },
    { id: 2, concept_type: "story", title: "ZONE 2: 루미너스 월 (디지털 인터랙티브)", experience_desc: "터치 테이블을 통한 나만의 심해 크리처 방류", docent_script: "스크린을 터치해 당신만의 심해 크리처를 생성하고 바다로 흘려보내 보세요.", linked_md_ids: "홀로그램 스티커" },
    { id: 3, concept_type: "archive", title: "ZONE 3: 아카이브 바 (티 라운지)", experience_desc: "심해 깊이에 따른 칵테일 및 티 시음", docent_script: "온도에 맞춰 색이 서서히 변하는 어비스 티를 마시며 여운을 정리합니다.", linked_md_ids: "칵테일/티" },
  ]);

  // 랜딩 콘텐츠 세팅
  const [welcomeBenefit, setWelcomeBenefit] = useState("굿즈 구매 시 스핀오프 한정판 리무버블 스티커 1매 증정");
  const [externalLink, setExternalLink] = useState("https://booking.naver.com/exhibition/spinoff-abyss");
  const [defaultConcept, setDefaultConcept] = useState("B");

  const [dateError, setDateError] = useState("");
  const handleEndDateChange = (val) => {
    setEndDate(val);
    const mainEnd = new Date(mainEndDate);
    const spinoffEnd = new Date(val);
    const diffTime = spinoffEnd - mainEnd;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 21) {
      setDateError(`본전시 종료일(${mainEndDate}) 기준 21일 연장 상한을 초과했습니다. (+${diffDays}일)`);
    } else {
      setDateError("");
    }
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === "closed") {
      setShowClosedWarning(true);
    }
    setStatus(newStatus);
  };

  const selectedConcept = CONCEPTS.find(c => c.id === selected);
  const regen = () => { setRegen(true); setSelected(null); setConfirmed(false); setTimeout(() => setRegen(false), 1800); };

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
        .concept-card{border-radius:16px;padding:18px;cursor:pointer;transition:all 0.22s;border:2px solid transparent;background:var(--surface);position:relative;overflow:hidden;}
        .concept-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);}
        .concept-card.selected{box-shadow:var(--shadow-md);}
        .gold-btn{background:var(--accent);color:#FFFFFF;border:none;border-radius:8px;padding:11px 20px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:7px;}
        .gold-btn:hover{background:#333333;transform:translateY(-1px);}
        .ghost-btn{background:transparent;color:var(--ink-muted);border:1px solid var(--border-mid);border-radius:8px;padding:10px 14px;font-size:13px;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .ghost-btn:hover{border-color:var(--ink);color:var(--ink);}
        .md-chip{font-size:11px;padding:4px 9px;border-radius:20px;background:var(--bg-3);color:var(--ink-2);display:inline-block;margin:2px 2px 0 0;}
        .drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:40;}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:var(--sidebar-bg);z-index:50;padding:28px 16px;display:flex;flex-direction:column;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}.fade-in{animation:fadeIn 0.3s ease forwards;}
        @keyframes shimmer{0%{background-position:-600px 0;}100%{background-position:600px 0;}}.shimmer{background:linear-gradient(90deg,var(--bg-3) 25%,var(--bg-2) 50%,var(--bg-3) 75%);background-size:600px 100%;animation:shimmer 1.4s infinite;border-radius:12px;}
        @keyframes spin{to{transform:rotate(360deg);}}.spin{animation:spin 0.8s linear infinite;}
      `}</style>

      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside style={{ width:isTablet?64:232, background:"var(--sidebar-bg)", display:"flex", flexDirection:"column", padding:isTablet?"28px 10px":"28px 16px", flexShrink:0, borderRight:"1px solid var(--sidebar-border)" }}>
          <div style={{ padding:"0 8px 32px", overflow:"hidden" }}>
            {isTablet ? <div style={{ width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}><Sparkles size={18} color="rgba(255,255,255,0.85)"/></div>
              : <><div style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.9)", fontSize:20, fontWeight:600, letterSpacing:"0.04em" }}>AFTERGLOW</div><div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", marginTop:4 }}>OPERATOR CONSOLE</div></>}
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
      )}

      {/* MOBILE DRAWER */}
      {isMobile && drawerOpen && (
        <><div className="drawer-overlay" onClick={() => setDrawerOpen(false)}/>
          <div className="drawer">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
              <div><div style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.9)", fontSize:18, fontWeight:600 }}>AFTERGLOW</div></div>
              <button onClick={() => setDrawerOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--sidebar-text)" }}><X size={18}/></button>
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
            {isMobile && <button onClick={() => setDrawerOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink)", padding:4 }}><Menu size={20}/></button>}
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:600, color:"var(--ink)" }}>Concept Bot</div>
              <div style={{ marginTop:3 }}><ProjectSwitcher clients={clients} clientId={clientId} projectId={projectId} mode={mode} onSelect={onSelectProject} compact={isMobile} /></div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button className="ghost-btn" onClick={regen} style={{ fontSize:12, padding:"8px 12px" }}>
              <RefreshCw size={12} className={regenerating?"spin":""}/>{!isMobile&&" 재생성"}
            </button>
            {!isMobile && <button className="ghost-btn" style={{ fontSize:12 }}><Download size={12}/>제안서 다운로드</button>}
            <div style={{ position:"relative", cursor:"pointer" }}>
              <Bell size={18} strokeWidth={1.8} color="var(--ink-muted)"/>
              <span style={{ position:"absolute", top:-3, right:-3, width:7, height:7, background:"var(--color-success)", borderRadius:"50%", border:"1.5px solid var(--bg)" }}/>
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflow:"auto", padding:isMobile?"16px":"24px 32px", display:"flex", flexDirection:"column", gap:isMobile?14:20 }}>

          {/* IP Analysis Summary */}
          {isMobile ? (
            <div style={{ background:"var(--sidebar-bg)", borderRadius:14, border:"1px solid rgba(255,255,255,0.08)", overflow:"hidden" }}>
              <button onClick={() => setShowIPSummary(!showIPSummary)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Info size={14} color="rgba(255,255,255,0.5)"/>
                  <span style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.85)", fontFamily:"'Playfair Display',serif" }}>{projTitle} — IP 분석 결과</span>
                </div>
                {showIPSummary ? <ChevronUp size={14} color="rgba(255,255,255,0.4)"/> : <ChevronDown size={14} color="rgba(255,255,255,0.4)"/>}
              </button>
              {showIPSummary && (
                <div style={{ padding:"0 16px 16px" }}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
                    {["#심해","#신비로움","#빛의굴절","#생명력","#고요한움직임"].map(k=>(
                      <span key={k} style={{ fontSize:11, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)", padding:"3px 8px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>{k}</span>
                    ))}
                  </div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>거대 고래 상영관 최다 체류 <span style={{ color:"rgba(255,255,255,0.7)", fontFamily:"'DM Mono',monospace" }}>avg 12분</span></div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:"18px 24px", border:"1px solid rgba(255,255,255,0.08)", display:"flex", gap:28, alignItems:"flex-start", flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:6 }}>IP ANALYSIS RESULT</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"rgba(255,255,255,0.9)", fontWeight:600 }}>{projTitle}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{clientName} · 분석 완료 4시간 전</div>
              </div>
              <div style={{ flex:1, display:"flex", gap:20, flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:7 }}>핵심 키워드</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {["#심해","#신비로움","#빛의굴절","#생명력","#고요한움직임"].map(k=>(
                      <span key={k} style={{ fontSize:11, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)", padding:"2px 8px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>{k}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:7 }}>최다 체류 섹션</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", fontWeight:500 }}>거대 고래 상영관 <span style={{ color:"rgba(255,255,255,0.6)", fontFamily:"'DM Mono',monospace" }}>avg 12분</span></div>
                </div>
              </div>
            </div>
          )}

          {/* 스핀오프 상태머신 & 운영 기간 설정 패널 */}
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px" }}>
            {/* 1. 상태 머신 영역 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em" }}>POPUP STATUS MACHINE</span>
                <span style={{ fontSize: 9.5, background: "var(--accent)", color: "var(--surface)", padding: "2px 6px", borderRadius: 4, fontWeight: 600, textTransform: "uppercase" }}>{status}</span>
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {[
                  { id: "planning", label: "기획 중" },
                  { id: "ready", label: "준비 완료" },
                  { id: "open_concurrent", label: "동시 운영" },
                  { id: "open_solo", label: "단독 운영" },
                  { id: "closed", label: "운영 종료" },
                  { id: "archived", label: "보관됨" },
                ].map(s => {
                  const isCurrent = status === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStatusChange(s.id)}
                      style={{
                        padding: "6px 12px", fontSize: 12, borderRadius: 20, cursor: "pointer",
                        background: isCurrent ? "var(--accent)" : "var(--bg-3)",
                        color: isCurrent ? "var(--surface)" : "var(--ink-2)",
                        border: "none", fontWeight: isCurrent ? 600 : 400, transition: "all 0.15s"
                      }}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              
              {showClosedWarning && (
                <div style={{ background: "var(--color-danger-bg)", border: "1px solid var(--color-danger)", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "var(--color-danger)", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <span>⚠️ <strong>운영 종료</strong> 시 미사용 초대장이 즉시 만료되며 B2C 랜딩이 종료 안내 화면으로 전환됩니다.</span>
                  <button onClick={() => setShowClosedWarning(false)} style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer", fontWeight: 600 }}>확인</button>
                </div>
              )}
              
              {/* 개설 조건 체크리스트 */}
              <div style={{ marginTop: 8, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                <span style={{ fontSize: 10.5, color: "var(--ink-muted)", fontWeight: 600 }}>파일럿 개설 조건 자가진단:</span>
                <div style={{ display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap" }}>
                  <label style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 4 }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} /> 본전시 잔여 &gt;= 4주
                  </label>
                  <label style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 4 }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} /> 최소 리드타임 2주 확보
                  </label>
                  <label style={{ fontSize: 11, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 4 }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} /> B2B 계약 협의 완료
                  </label>
                </div>
              </div>
            </div>
            
            {/* 2. 기간 설정 영역 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, borderLeft: isMobile ? "none" : "1px solid var(--border)", paddingLeft: isMobile ? 0 : 20, paddingTop: isMobile ? 12 : 0, borderTop: isMobile ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 11, color: "var(--ink-muted)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em" }}>POPUP PERIOD CONFIGURATION</span>
              
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "var(--ink-muted)", display: "block", marginBottom: 4 }}>본전시 종료일 (고정)</label>
                  <input type="date" value={mainEndDate} disabled style={{ width: "100%", padding: "7px 10px", fontSize: 12.5, borderRadius: 6, border: "1px solid var(--border-mid)", background: "var(--bg-3)", color: "var(--ink-muted)" }} />
                </div>
                <div style={{ alignSelf: "flex-end", paddingBottom: 10, fontSize: 12, color: "var(--ink-muted)" }}>→</div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "var(--ink-muted)", display: "block", marginBottom: 4 }}>스핀오프 종료일 설정</label>
                  <input type="date" value={endDate} onChange={e => handleEndDateChange(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 12.5, borderRadius: 6, border: dateError ? "1px solid var(--color-danger)" : "1px solid var(--border-mid)", background: "var(--surface)", color: "var(--ink)" }} />
                </div>
              </div>
              
              {dateError ? (
                <div style={{ fontSize: 11.5, color: "var(--color-danger)", fontWeight: 500 }}>{dateError}</div>
              ) : (
                <div style={{ fontSize: 11.5, color: "var(--color-success)", fontWeight: 500 }}>✓ 본전시 종료 후 단독 연장 범위(21일) 이내입니다.</div>
              )}
              
              <button disabled={!!dateError} onClick={() => alert("운영 기간 설정이 저장되었습니다.")} className="gold-btn" style={{ marginTop: "auto", alignSelf: "flex-end", opacity: dateError ? 0.5 : 1, cursor: dateError ? "not-allowed" : "pointer", justifyContent: "center" }}>
                설정 저장
              </button>
            </div>
          </div>

          {/* Section title */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?15:17, fontWeight:600, color:"var(--ink)" }}>AI 제안 스핀오프 컨셉 3종</h2>
            <span style={{ fontSize:11.5, color:"var(--ink-muted)" }}>하나를 선택하세요</span>
          </div>

          {/* Concept Cards */}
          {regenerating ? (
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"1fr 1fr":"repeat(3,1fr)", gap:14 }}>
              {[0,1,2].map(i=><div key={i} className="shimmer" style={{ height:isMobile?160:300 }}/>)}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"1fr 1fr":"repeat(3,1fr)", gap:14 }}>
              {CONCEPTS.map(c => {
                const isSelected = selected===c.id;
                const isExpanded = expanded===c.id;
                return (
                  <div key={c.id} className={`concept-card fade-in${isSelected?" selected":""}`}
                    style={{ border:`2px solid ${isSelected?c.color:"var(--border)"}`, background:isSelected?c.bg:"var(--surface)" }}
                    onClick={() => { setSelected(c.id); setConfirmed(false); }}>

                    {c.recommended && (
                      <div style={{ position:"absolute", top:12, right:12, background:"var(--accent)", color:"#FFFFFF", fontSize:9.5, fontWeight:600, padding:"2px 8px", borderRadius:20, display:"flex", alignItems:"center", gap:3, fontFamily:"'DM Mono',monospace" }}>
                        <Star size={8} fill="#FFFFFF"/>AI 추천
                      </div>
                    )}

                    {/* Header */}
                    <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
                      <div style={{ width:44,height:44,borderRadius:12,background:`${c.color}18`,border:`1.5px solid ${c.color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:14, fontWeight:700, color:c.color }}>{c.score}</span>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                          <span style={{ fontSize:10.5, fontWeight:600, color:c.color, background:`${c.color}18`, padding:"2px 8px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>{c.concept_type.toUpperCase()}</span>
                          <span style={{ fontSize:10.5, color:"var(--ink-muted)" }}>컨셉 {c.id}</span>
                        </div>
                        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?15:16, fontWeight:600, color:"var(--ink)" }}>{c.name}</div>
                        <div style={{ fontSize:11.5, color:"var(--ink-muted)", marginTop:1 }}>{c.sub}</div>
                      </div>
                    </div>

                    <p style={{ fontSize:12.5, color:"var(--ink-2)", lineHeight:1.6, marginBottom:12 }}>{c.desc}</p>

                    {/* Space */}
                    <div style={{ padding:"9px 11px", background:"var(--bg-2)", borderRadius:8, marginBottom:10 }}>
                      <div style={{ fontSize:10, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:3 }}>공간 구성</div>
                      <div style={{ fontSize:12.5, color:"var(--ink-2)" }}>{c.space}</div>
                    </div>

                    {/* MD */}
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:10, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:5 }}>핵심 MD</div>
                      {c.md.map(m=><span key={m} className="md-chip">{m}</span>)}
                    </div>

                    {/* Expand toggle */}
                    <button onClick={e=>{e.stopPropagation();setExpanded(isExpanded?null:c.id);}}
                      style={{ width:"100%", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontSize:12, color:"var(--ink-muted)", padding:"7px 0 0", fontFamily:"'DM Sans',sans-serif" }}>
                      {isExpanded?<><ChevronUp size={12}/>접기</>:<><ChevronDown size={12}/>AI 역할 보기</>}
                    </button>

                    {isExpanded && (
                      <div className="fade-in" style={{ marginTop:10, padding:"11px", background:`${c.color}10`, borderRadius:9, border:`1px solid ${c.color}25` }}>
                        <div style={{ fontSize:10, color:c.color, fontFamily:"'DM Mono',monospace", marginBottom:5 }}>AI ROLE</div>
                        <div style={{ fontSize:12.5, color:"var(--ink-2)", lineHeight:1.6, marginBottom:8 }}>{c.ai}</div>
                        <div style={{ fontSize:11, color:"var(--ink-muted)", borderTop:`1px solid ${c.color}20`, paddingTop:7 }}>
                          <span style={{ color:c.color, fontWeight:600 }}>추천 이유:</span> {c.reason}
                        </div>
                      </div>
                    )}

                    {isSelected && (
                      <div className="fade-in" style={{ marginTop:10, display:"flex", alignItems:"center", gap:6, color:c.color, fontSize:12.5, fontWeight:600 }}>
                        <CheckCircle2 size={14}/>선택됨
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Confirm Panel */}
          {selected && !confirmed && (
            <div className="fade-in" style={{
              background:"var(--surface)", borderRadius:14, padding:isMobile?"16px":"22px 26px",
              border:`1px solid ${selectedConcept.color}30`,
              display:"flex", flexDirection:isMobile?"column":"row",
              alignItems:isMobile?"flex-start":"center", justifyContent:"space-between", gap:16
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:40,height:40,borderRadius:11,background:`${selectedConcept.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  <Sparkles size={18} color={selectedConcept.color}/>
                </div>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>컨셉 {selected} · {selectedConcept.name} 선택됨</div>
                  <div style={{ fontSize:12, color:"var(--ink-muted)", marginTop:3 }}>확정하면 공간 도면·굿즈 리스트·운영 매뉴얼이 자동 생성됩니다</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0, width:isMobile?"100%":undefined }}>
                <button className="ghost-btn" onClick={()=>setSelected(null)} style={{ flex:isMobile?1:undefined, justifyContent:"center" }}>다시 선택</button>
                <button className="gold-btn" onClick={()=>setConfirmed(true)} style={{ flex:isMobile?2:undefined, justifyContent:"center" }}>
                  <Zap size={14}/>컨셉 확정
                </button>
              </div>
            </div>
          )}

          {/* Detail Builder Result */}
          {confirmed && (
            <div className="fade-in" style={{ background:"var(--sidebar-bg)", borderRadius:16, padding:isMobile?"18px":"26px", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <CheckCircle2 size={17} color="#4CAF7C"/>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?15:17, color:"rgba(255,255,255,0.9)", fontWeight:600 }}>운영 가이드북 생성 완료</div>
                <span style={{ fontSize:10.5, color:"#4CAF7C", background:"rgba(76,175,124,0.15)", padding:"3px 9px", borderRadius:20, fontFamily:"'DM Mono',monospace", marginLeft:"auto" }}>3h 52m 절감</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:12, marginBottom:20 }}>
                {[
                  {icon:Map, label:"공간 도면 초안", desc:"터치 테이블 배치 + 동선 설계"},
                  {icon:Package, label:"굿즈 리스트 12종", desc:"MD Matcher 연동, 예상 수익률 포함"},
                  {icon:BookOpen, label:"운영 매뉴얼", desc:"현장 인력 교육 + CS 시나리오"},
                ].map((item,i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"16px", border:"1px solid rgba(255,255,255,0.07)", display:isMobile?"flex":"block", gap:isMobile?12:0, alignItems:isMobile?"center":"flex-start" }}>
                    <div style={{ width:34,height:34,borderRadius:9,background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:isMobile?0:10,flexShrink:0 }}>
                      <item.icon size={15} color="rgba(255,255,255,0.6)" strokeWidth={1.8}/>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.85)", marginBottom:3 }}>{item.label}</div>
                      <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.35)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:10, flexDirection:isMobile?"column":"row" }}>
                <button className="gold-btn" style={{ justifyContent:"center" }}>
                  <Download size={14}/>가이드북 다운로드 (PDF)
                </button>
                <button className="ghost-btn" style={{ borderColor:"rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.45)", justifyContent:"center" }} onClick={() => setPage("monitor")}>
                  <Eye size={13}/>관람 모니터로 이동 <ArrowRight size={13}/>
                </button>
              </div>

              {/* SPINOFF_ZONE 공간 구성 에디터 */}
              <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
                <h4 style={{ color: "rgba(255,255,255,0.95)", fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <Map size={15} color="rgba(255,255,255,0.7)"/>
                  SPINOFF_ZONE 공간 및 해설 세부 구성 (P0)
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {zones.map((zone, idx) => (
                    <div key={zone.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                        <input
                          type="text"
                          value={zone.title}
                          onChange={e => {
                            const next = [...zones];
                            next[idx].title = e.target.value;
                            setZones(next);
                          }}
                          style={{
                            background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.2)",
                            color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600, width: "240px", paddingBottom: 2
                          }}
                        />
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>유형:</span>
                          <select
                            value={zone.concept_type}
                            onChange={e => {
                              const next = [...zones];
                              next[idx].concept_type = e.target.value;
                              setZones(next);
                            }}
                            style={{
                              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                              borderRadius: 4, color: "white", fontSize: 11.5, padding: "2px 6px"
                            }}
                          >
                            <option value="story" style={{ color: "#111" }}>STORY</option>
                            <option value="sensory" style={{ color: "#111" }}>SENSORY</option>
                            <option value="archive" style={{ color: "#111" }}>ARCHIVE</option>
                            <option value="community" style={{ color: "#111" }}>COMMUNITY</option>
                            <option value="role" style={{ color: "#111" }}>ROLE</option>
                            <option value="time" style={{ color: "#111" }}>TIME</option>
                          </select>
                          <button onClick={() => alert(`${zone.title}의 개별 존 QR 코드가 생성 및 다운로드되었습니다.`)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer" }}>
                            존 QR 생성
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: 12, marginTop: 8 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>경험 상세 설명</label>
                          <textarea
                            value={zone.experience_desc}
                            onChange={e => {
                              const next = [...zones];
                              next[idx].experience_desc = e.target.value;
                              setZones(next);
                            }}
                            rows={2}
                            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "white", fontSize: 12, padding: 6, resize: "none" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>도슨트 스크립트 (화면6 존 해설 원천)</label>
                          <textarea
                            value={zone.docent_script}
                            onChange={e => {
                              const next = [...zones];
                              next[idx].docent_script = e.target.value;
                              setZones(next);
                            }}
                            rows={2}
                            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "white", fontSize: 12, padding: 6, resize: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 랜딩 콘텐츠 및 웰컴 혜택 세팅 패널 */}
              <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
                <h4 style={{ color: "rgba(255,255,255,0.95)", fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <Settings size={15} color="rgba(255,255,255,0.7)"/>
                  랜딩 콘텐츠 & 웰컴 혜택 세팅 (P1)
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>웰컴 혜택 설정 (셀프 체크인 보상)</label>
                      <input
                        type="text"
                        value={welcomeBenefit}
                        onChange={e => setWelcomeBenefit(e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "white", fontSize: 12.5, padding: "8px 10px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>외부 예약·구매 링크</label>
                      <input
                        type="text"
                        value={externalLink}
                        onChange={e => setExternalLink(e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "white", fontSize: 12.5, padding: "8px 10px" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Default Concept fallback (미참여 관람객용)</label>
                      <select
                        value={defaultConcept}
                        onChange={e => setDefaultConcept(e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "white", fontSize: 12.5, padding: "8px 10px" }}
                      >
                        <option value="A" style={{ color: "#111" }}>A안 (감각 확장형 - sensory)</option>
                        <option value="B" style={{ color: "#111" }}>B안 (세계관 확장형 - story)</option>
                        <option value="C" style={{ color: "#111" }}>C안 (아카이브형 - archive)</option>
                      </select>
                    </div>
                    <button onClick={() => alert("랜딩 및 웰컴 혜택 설정이 성공적으로 저장되었습니다.")} className="gold-btn" style={{ marginTop: "auto", width: "100%", justifyContent: "center" }}>
                      콘텐츠 세팅 저장
                    </button>
                  </div>
                </div>
              </div>
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

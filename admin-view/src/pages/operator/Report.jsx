import { useState, useEffect } from "react";
import {
  LayoutDashboard, Upload, Bot, Eye, BarChart2, FileText,
  Settings, Bell, Download, Share2, TrendingUp, Users,
  ShoppingBag, Zap, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Star, RefreshCw, Menu, X, Sparkles, ChevronDown, ChevronUp
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
  { id:"monitor",   icon:Eye,             label:"관람 모니터", short:"모니터" },
  { id:"report",    icon:BarChart2,       label:"성과 리포트", short:"리포트", active:true },
  { id: "settlement",    icon:FileText,        label:"정산 관리",   short:"정산" },
];

const FUNNEL = [
  { label:"1. session.start (총 관람 세션)",       value:18420, pct:100, color:"#7B9EE8" },
  { label:"2. curator.chat_start (큐레이팅 시작)", value:14180, pct:77,  color:"#9A84C9" },
  { label:"3. invite.issued (초대장 발급)",        value:8840,  pct:48,  color:"var(--accent)" },
  { label:"4. invite.landing_viewed (랜딩 열람)",   value:5892,  pct:32,  color:"var(--accent)" },
  { label:"5. invite.redeemed (팝업 방문)",        value:4421,  pct:24,  color:"#4CAF7C" },
  { label:"6. purchase.link_clicked (구매 클릭)",   value:2876,  pct:16,  color:"#2E8B57" },
];

const GOODS = [
  { name:"AI 디자인 심해 생물 피규어", sold:1240, revenue:37200000, stock:12, trend:"up" },
  { name:"홀로그램 스티커 세트",       sold:980,  revenue:9800000,  stock:44, trend:"up" },
  { name:"개인 맞춤형 영상 NFT",       sold:412,  revenue:20600000, stock:null, trend:"up" },
  { name:"전시 한정판 아트북",         sold:244,  revenue:7320000,  stock:3,  trend:"down" },
];

const PERSONA = [
  { type:"감성 탐구형", pct:38, color:"#7B9EE8", desc:"철학적 질문, 긴 체류" },
  { type:"체험 추구형", pct:31, color:"var(--accent)", desc:"인터랙티브, MD 구매율 ↑" },
  { type:"동반 방문형", pct:19, color:"#4CAF7C", desc:"커플·가족, 카페형 팝업 선호" },
  { type:"정보 수집형", pct:12, color:"var(--ink-muted)", desc:"단순 정보, 재방문율 낮음" },
];

const NEXT_ACTIONS = [
  { priority:"P0", label:"C안(어비스 티 라운지) 팝업 병행 운영 검토", reason:"키워드 '고요함' 68% → C안 정합성 높음", color:"var(--color-danger)" },
  { priority:"P0", label:"피규어 재고 긴급 추가 발주 (잔여 12개)",    reason:"판매 속도 대비 2.3일치만 남음",          color:"var(--color-danger)" },
  { priority:"P1", label:"감성 탐구형 페르소나 2차 팝업 초대 발송",   reason:"재방문율 41% — 가장 높은 세그먼트",       color:"var(--accent)" },
  { priority:"P2", label:"아트북 할인 프로모션 or 번들 구성 고려",     reason:"판매 둔화 — 잔여 3개 소진 필요",          color:"var(--ink-muted)" },
];

const WEEKLY = [
  { week:"W1", revenue:8400 }, { week:"W2", revenue:11200 },
  { week:"W3", revenue:16800 }, { week:"W4", revenue:14600 },
];

const fmt = (n) => n>=10000000?`${(n/10000000).toFixed(1)}천만`:n>=10000?`${Math.round(n/10000)}만`:n===0?"-":n.toLocaleString();
const totalRevenue = GOODS.reduce((s,g)=>s+g.revenue,0);
const maxWeekRev = Math.max(...WEEKLY.map(w=>w.revenue));

export default function ReportResponsive({ setPage = () => {}, activePage = "report", clients = [], clientId, projectId, project, mode = "operator", onSelectProject = () => {} }) {
  const width = useWindowWidth();
  const clientName = clients.find(c => c.id === clientId)?.name || "";
  const projTitle = project?.title || "전시 미선택";
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("overview");
  const [sharing, setSharing] = useState(false);
  const [expandMVP, setExpandMVP] = useState(false);

  const doShare = () => { setSharing(true); setTimeout(()=>setSharing(false), 2000); };

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
        .gold-btn{background:var(--accent);color:#FFFFFF;border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .gold-btn:hover{background:#333333;}
        .ghost-btn{background:transparent;color:var(--ink-muted);border:1px solid var(--border-mid);border-radius:8px;padding:10px 14px;font-size:13px;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .ghost-btn:hover{border-color:var(--ink);color:var(--ink);}
        .mtab{padding:8px 16px;border-radius:20px;font-size:12.5px;font-weight:500;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all 0.18s;white-space:nowrap;}
        .mtab.active{background:var(--accent);color:#FFFFFF;}
        .mtab.idle{background:var(--surface);color:var(--ink-muted);border:1px solid var(--border);}
        .goods-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);}
        .goods-row:last-child{border-bottom:none;}
        .detail-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border);}
        .detail-row:last-child{border-bottom:none;}
        .drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:40;}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:var(--sidebar-bg);z-index:50;padding:28px 16px;display:flex;flex-direction:column;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}.fade-in{animation:fadeIn 0.3s ease forwards;}
        @keyframes spin{to{transform:rotate(360deg);}}.spin{animation:spin 0.8s linear infinite;}
      `}</style>

      {/* SIDEBAR */}
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
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:600, color:"var(--ink)" }}>성과 리포트</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:3 }}><ProjectSwitcher clients={clients} clientId={clientId} projectId={projectId} mode={mode} onSelect={onSelectProject} compact={isMobile} />{!isMobile && <span style={{ fontSize:11.5, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>D+24 · 팝업 12일차</span>}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {!isMobile && <button className="ghost-btn" style={{ fontSize:12 }} onClick={doShare}>{sharing?<RefreshCw size={12} className="spin"/>:<Share2 size={12}/>}{sharing?"전송 중...":"기획사 공유"}</button>}
            <button className="gold-btn" style={{ padding:isMobile?"8px 12px":"10px 18px", fontSize:12 }}><Download size={13}/>{!isMobile&&"PDF 리포트"}</button>
            <div style={{ position:"relative", cursor:"pointer" }}>
              <Bell size={18} strokeWidth={1.8} color="var(--ink-muted)"/>
              <span style={{ position:"absolute", top:-3, right:-3, width:7, height:7, background:"var(--color-success)", borderRadius:"50%", border:"1.5px solid var(--bg)" }}/>
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflow:"auto", padding:isMobile?"14px":"24px 32px", display:"flex", flexDirection:"column", gap:isMobile?12:20 }}>

          {/* MVP Banner */}
          {isMobile ? (
            <div style={{ background:"var(--sidebar-bg)", borderRadius:14, border:"1px solid rgba(255,255,255,0.08)", overflow:"hidden" }}>
              <button onClick={()=>setExpandMVP(!expandMVP)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <CheckCircle2 size={15} color="var(--color-success)"/>
                  <span style={{ fontSize:13.5, fontWeight:600, color:"rgba(255,255,255,0.85)", fontFamily:"'Playfair Display',serif" }}>MVP 핵심 지표 2/3 달성</span>
                </div>
                {expandMVP?<ChevronUp size={14} color="rgba(255,255,255,0.3)"/>:<ChevronDown size={14} color="rgba(255,255,255,0.3)"/>}
              </button>
              {expandMVP && (
                <div style={{ padding:"0 16px 16px", display:"flex", flexDirection:"column", gap:8 }}>
                  {[{label:"B2B 기획 효율",ok:true,sub:"4h 이내 기획안 생성"},{label:"B2C 전환율 20%↑",ok:true,sub:"현재 24% 전환"},{label:"데이터 유효성",ok:false,sub:"구매 의향 일치율 71%"}].map((m,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:m.ok?"rgba(34,197,94,0.08)":"rgba(255,255,255,0.04)", border:`1px solid ${m.ok?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.08)"}`, borderRadius:9 }}>
                      {m.ok?<CheckCircle2 size={14} color="var(--color-success)"/>:<RefreshCw size={14} color="rgba(255,255,255,0.4)"/>}
                      <div>
                        <div style={{ fontSize:12.5, fontWeight:600, color:m.ok?"var(--color-success)":"rgba(255,255,255,0.6)" }}>{m.label}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{m.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:"18px 24px", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
              <div style={{ display:"flex", gap:10, flex:1 }}>
                {[{label:"B2B 기획 효율",val:"✅ 달성",sub:"4h 이내 기획안",ok:true},{label:"B2C 전환율 20%↑",val:"✅ 달성",sub:"현재 24% 전환",ok:true},{label:"데이터 유효성",val:"🔄 검증 중",sub:"일치율 71%",ok:false}].map((m,i)=>(
                  <div key={i} style={{ padding:"11px 18px", background:m.ok?"rgba(34,197,94,0.08)":"rgba(255,255,255,0.04)", border:`1px solid ${m.ok?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.08)"}`, borderRadius:10 }}>
                    <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.35)", fontFamily:"'DM Mono',monospace", marginBottom:3 }}>{m.label}</div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:m.ok?"var(--color-success)":"rgba(255,255,255,0.6)" }}>{m.val}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{m.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderLeft:"1px solid rgba(255,255,255,0.08)", paddingLeft:20, maxWidth:260 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", fontFamily:"'DM Mono',monospace", marginBottom:5 }}>MVP 7주차 총평</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.6, fontFamily:"'Playfair Display',serif", fontStyle:"italic" }}>"핵심 2개 지표 조기 달성. 정식 파트너십 계약 전환 권장."</div>
              </div>
            </div>
          )}

          {/* KPI */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:isMobile?10:14 }}>
            {[
              { label:"총 팝업 매출",    value:fmt(totalRevenue), unit:"원", icon:TrendingUp,  color:"var(--accent)", delta:"+34%" },
              { label:"파트너 배분 수익", value:fmt(Math.round(totalRevenue*0.35)), unit:"원", icon:Users, color:"#7B9EE8", delta:"매출 35%" },
              { label:"굿즈 판매 건수",  value:"2,876", unit:"건", icon:ShoppingBag, color:"#4CAF7C", delta:"4개 품목" },
              { label:"팝업 전환율",     value:"24", unit:"%", icon:Zap, color:"var(--accent)", delta:"목표 초과" },
            ].map((kpi,i) => (
              <div key={i} className="card" style={{ padding:isMobile?"14px":"18px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:isMobile?8:12 }}>
                  <div style={{ width:30,height:30,borderRadius:8,background:`${kpi.color === "var(--accent)" ? "var(--bg-3)" : kpi.color + "18"}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <kpi.icon size={14} color={kpi.color} strokeWidth={2}/>
                  </div>
                  <span style={{ fontSize:10.5, color:"var(--color-success)", background:"var(--color-success-bg)", padding:"2px 7px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>{kpi.delta}</span>
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:24, fontWeight:600, color:"var(--ink)", letterSpacing:"-0.02em" }}>
                  {kpi.value}<span style={{ fontSize:11, fontWeight:400, color:"var(--ink-muted)", marginLeft:3 }}>{kpi.unit}</span>
                </div>
                <div style={{ fontSize:isMobile?10.5:12, color:"var(--ink-muted)", marginTop:4 }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Mobile tab switcher */}
          {isMobile && (
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:2 }}>
              {[["overview","전환 퍼널"],["goods","굿즈"],["persona","페르소나"],["actions","AI 액션"]].map(([val,label])=>(
                <button key={val} className={`mtab ${mobileTab===val?"active":"idle"}`} onClick={()=>setMobileTab(val)}>{label}</button>
              ))}
            </div>
          )}

          {/* DESKTOP: full layout */}
          {!isMobile && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:18 }}>
                <FunnelCard funnel={FUNNEL}/>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <RSCard totalRevenue={totalRevenue}/>
                  <WeeklyCard weekly={WEEKLY} maxWeekRev={maxWeekRev}/>
                  <SpinoffExtraMetricsCard isMobile={isMobile}/>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:isTablet?"1fr":"1fr 1fr", gap:18 }}>
                <GoodsCard goods={GOODS}/>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <PersonaCard persona={PERSONA}/>
                  <ActionsCard actions={NEXT_ACTIONS}/>
                </div>
              </div>
            </>
          )}

          {/* MOBILE tab panels */}
          {isMobile && mobileTab==="overview" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <FunnelCard funnel={FUNNEL} compact/>
              <SpinoffExtraMetricsCard isMobile={true}/>
            </div>
          )}
          {isMobile && mobileTab==="goods"    && <div className="fade-in"><GoodsCard goods={GOODS}/></div>}
          {isMobile && mobileTab==="persona"  && (
            <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <PersonaCard persona={PERSONA}/>
              <WeeklyCard weekly={WEEKLY} maxWeekRev={maxWeekRev}/>
            </div>
          )}
          {isMobile && mobileTab==="actions"  && <div className="fade-in"><ActionsCard actions={NEXT_ACTIONS}/></div>}
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
function FunnelCard({ funnel, compact }) {
  return (
    <div style={{ background:"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)", marginBottom:16 }}>관람객 전환 퍼널</div>
      <div style={{ display:"flex", flexDirection:"column", gap:compact?8:10 }}>
        {funnel.map((f,i) => (
          <div key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:12.5, color:"var(--ink-2)", fontWeight:i===4?600:400 }}>{f.label}</span>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:12.5, fontWeight:600, color:f.color, fontFamily:"'DM Mono',monospace" }}>{f.value.toLocaleString()}명</span>
                <span style={{ fontSize:10.5, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", width:30, textAlign:"right" }}>{f.pct}%</span>
              </div>
            </div>
            <div style={{ height:7, background:"var(--bg-3)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${f.pct}%`, background:`linear-gradient(90deg,${f.color}80,${f.color})`, borderRadius:99 }}/>
            </div>
            {!compact && i<funnel.length-1 && (
              <div style={{ fontSize:10, color:"var(--ink-faint)", fontFamily:"'DM Mono',monospace", textAlign:"right", marginTop:2 }}>
                ↓ {Math.round((funnel[i+1].value/f.value)*100)}% 진행
              </div>
            )}
          </div>
        ))}
      </div>

      {!compact && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.5 }}>
            💡 <strong>전환율 계산 공식:</strong> 4단계(랜딩 열람) / 1단계(총 관람 세션) = <strong>32.0%</strong> (목표 20% 초과 달성)
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-muted)", lineHeight: 1.5 }}>
            ✓ 5단계(팝업 실제 방문)는 <strong>self_checkin</strong> (사용자 현장 체크인 보상 코드 교환) 수치 기준이며, 현장 확인용 MVP 검증 방식이 적용되었습니다.
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-muted)", lineHeight: 1.5 }}>
            ⚠️ <strong>열람 모드 주의:</strong> 재열람(화면 8/9 → 4/5) 건은 퍼널 전환율(CTR)에 중복 집계되지 않으나, 열람 모드에서의 6단계(구매 링크 클릭)는 유효한 재구매 성과로 누적 집계됩니다.
          </div>
        </div>
      )}
    </div>
  );
}

function RSCard({ totalRevenue }) {
  const rows = [
    { label:"AFTERGLOW", val:Math.round(totalRevenue*0.55), pct:55, color:"var(--accent)" },
    { label:"피플리 (파트너)", val:Math.round(totalRevenue*0.35), pct:35, color:"#7B9EE8" },
    { label:"IP 라이선스료",  val:Math.round(totalRevenue*0.10), pct:10, color:"#4CAF7C" },
  ];
  return (
    <div style={{ background:"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)", flex:1 }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)", marginBottom:14 }}>수익 배분 (RS)</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {rows.map((r,i) => (
          <div key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:r.color }}/>
                <span style={{ fontSize:12.5, color:"var(--ink-2)" }}>{r.label}</span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <span style={{ fontSize:12.5, fontWeight:600, color:r.color, fontFamily:"'DM Mono',monospace" }}>{fmt(r.val)}원</span>
                <span style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>{r.pct}%</span>
              </div>
            </div>
            <div style={{ height:5, background:"var(--bg-3)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${r.pct*1.5}%`, background:r.color, borderRadius:99 }}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:12, padding:"9px 12px", background:"var(--accent-dim)", borderRadius:8, fontSize:11.5, color:"var(--ink)" }}>
        전환율 24% → <strong>성과 연동형 35% 구간</strong> 적용 중
      </div>
    </div>
  );
}

function WeeklyCard({ weekly, maxWeekRev }) {
  return (
    <div style={{ background:"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)", marginBottom:14 }}>주차별 매출 추이</div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:64 }}>
        {weekly.map((w,i)=>{
          const h = Math.round((w.revenue/maxWeekRev)*100);
          const isLast = i===weekly.length-1;
          return (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:"100%", height:`${h}%`, background:isLast?"var(--accent)":"var(--border-mid)", borderRadius:"5px 5px 0 0", minHeight:6 }}/>
              <div style={{ fontSize:10, color:isLast?"var(--accent)":"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>{w.week}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpinoffExtraMetricsCard({ isMobile }) {
  return (
    <div style={{ background:"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>스핀오프 부가 성과 지표</div>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:10 }}>
        {/* C경로 */}
        <div style={{ padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:8 }}>
          <div style={{ fontSize:10, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:3 }}>C경로 (오가닉 유입)</div>
          <div style={{ fontSize:16, fontWeight:700, color:"var(--ink)" }}>1,245<span style={{ fontSize:11, fontWeight:400, color:"var(--ink-muted)", marginLeft:2 }}>명</span></div>
          <div style={{ fontSize:10, color:"var(--ink-muted)", marginTop:2 }}>landing.organic_viewed</div>
        </div>
        {/* 계정 가입 */}
        <div style={{ padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:8 }}>
          <div style={{ fontSize:10, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:3 }}>회원 가입 (account.signup)</div>
          <div style={{ fontSize:16, fontWeight:700, color:"var(--ink)" }}>942<span style={{ fontSize:11, fontWeight:400, color:"var(--ink-muted)", marginLeft:2 }}>건</span></div>
          <div style={{ fontSize:10, color:"var(--color-success)", marginTop:2 }}>전환율 32.7%</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:10 }}>
        {/* 방문자 병합 */}
        <div style={{ padding:"10px 12px", background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:2 }}>기기-계정 병합 (visitor_merged)</div>
            <div style={{ fontSize:11, color:"var(--ink-muted)" }}>게스트 세션의 회원 전환 추적 수치</div>
          </div>
          <div style={{ fontSize:15, fontWeight:700, color:"var(--ink)", fontFamily:"'DM Mono',monospace" }}>712건</div>
        </div>
      </div>
    </div>
  );
}

function GoodsCard({ goods }) {
  return (
    <div style={{ background:"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)", marginBottom:14 }}>굿즈별 성과</div>
      {goods.map((g,i) => (
        <div key={i} className="goods-row">
          <div style={{ width:30,height:30,borderRadius:8,background:"var(--bg-3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <ShoppingBag size={13} color="var(--ink-muted)" strokeWidth={1.8}/>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12.5, fontWeight:500, color:"var(--ink-2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.name}</div>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:2 }}>
              <span style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>{g.sold.toLocaleString()}건</span>
              {g.stock!==null && g.stock<=10 && (
                <span style={{ fontSize:10.5, background:"var(--color-danger-bg)", color:"var(--color-danger)", padding:"1px 7px", borderRadius:20 }}>재고 {g.stock}개</span>
              )}
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"var(--ink)", fontFamily:"'DM Mono',monospace" }}>{fmt(g.revenue)}원</div>
            {g.trend==="up"?<ArrowUpRight size={13} color="var(--color-success)" style={{ marginLeft:"auto" }}/>:<ArrowDownRight size={13} color="var(--color-danger)" style={{ marginLeft:"auto" }}/>}
          </div>
        </div>
      ))}
    </div>
  );
}

function PersonaCard({ persona }) {
  return (
    <div style={{ background:"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)", marginBottom:14 }}>관람객 페르소나 분포</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {persona.map((p,i) => (
          <div key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:p.color }}/>
                <span style={{ fontSize:12.5, fontWeight:500, color:"var(--ink-2)" }}>{p.type}</span>
              </div>
              <span style={{ fontSize:12.5, fontWeight:600, color:p.color, fontFamily:"'DM Mono',monospace" }}>{p.pct}%</span>
            </div>
            <div style={{ height:5, background:"var(--bg-3)", borderRadius:99, overflow:"hidden", marginBottom:3 }}>
              <div style={{ height:"100%", width:`${p.pct*2}%`, background:p.color, borderRadius:99 }}/>
            </div>
            <div style={{ fontSize:11, color:"var(--ink-muted)" }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionsCard({ actions }) {
  return (
    <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:"18px 20px", border:"1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
        <Star size={13} color="rgba(255,255,255,0.7)"/>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"rgba(255,255,255,0.9)" }}>AI 추천 다음 액션</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {actions.map((a,i) => (
          <div key={i} style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:4, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.7)", fontFamily:"'DM Mono',monospace", flexShrink:0, marginTop:1 }}>{a.priority}</span>
            <div>
              <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.85)", fontWeight:500, lineHeight:1.4 }}>{a.label}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{a.reason}</div>
            </div>
          </div>
        ))}
      </div>
      <button style={{ marginTop:16, width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"10px", cursor:"pointer", fontSize:12.5, color:"rgba(255,255,255,0.7)", fontWeight:600, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
        리포트 기획사에 공유 <ArrowUpRight size={13}/>
      </button>
    </div>
  );
}

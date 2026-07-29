import { useState, useEffect } from "react";
import {
  LayoutDashboard, Upload, Bot, Eye, BarChart2, FileText,
  Settings, Bell, Download, CheckCircle2, Clock, XCircle,
  CreditCard, Calendar, Building2, Zap, TrendingUp,
  ChevronRight, ChevronDown, X, Menu, Sparkles, Receipt, Filter
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
  { id:"report",    icon:BarChart2,       label:"성과 리포트", short:"리포트" },
  { id: "settlement",    icon:FileText,        label:"정산 관리",   short:"정산", active:true },
];

const SETTLEMENTS = [
  { id:"SET-2026-004", project:"빛의 심연",   partner:"피플리",      period:"2026.04.16 ~ 05.15", total:74850000, partnerAmt:26197500, afterglowAmt:41167500, ipFee:7485000, model:"성과 연동형",   conversion:24, status:"대기",  dueDate:"2026.05.25", statusColor:"var(--color-warning)" },
  { id:"SET-2026-003", project:"빛의 심연",   partner:"피플리",      period:"2026.03.16 ~ 04.15", total:58200000, partnerAmt:20370000, afterglowAmt:32010000, ipFee:5820000, model:"성과 연동형",   conversion:21, status:"완료",  dueDate:"2026.04.25", statusColor:"var(--color-success)" },
  { id:"SET-2026-002", project:"심해의 환상", partner:"세라핌컴퍼니", period:"2026.02.01 ~ 02.28", total:31600000, partnerAmt:6320000,  afterglowAmt:22120000, ipFee:3160000, model:"기본 수익 배분", conversion:12, status:"완료",  dueDate:"2026.03.10", statusColor:"var(--color-success)" },
  { id:"SET-2026-001", project:"빛의 심연",   partner:"피플리",      period:"2026.01.10 ~ 02.09", total:22400000, partnerAmt:4480000,  afterglowAmt:15680000, ipFee:2240000, model:"초기 비용 절감형", conversion:9, status:"완료",  dueDate:"2026.02.20", statusColor:"var(--color-success)" },
];

const MODEL_COLORS = { "성과 연동형":"var(--accent)", "기본 수익 배분":"#7B9EE8", "초기 비용 절감형":"#4CAF7C" };
const RS_TIERS = [{ label:"15% 미만", rs:20 },{ label:"15~30%", rs:35 },{ label:"30% 초과", rs:50 }];
const fmt = (n) => `${(n/10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}만원`;
const fmtFull = (n) => `${n.toLocaleString()}원`;

export default function SettleResponsive({ setPage = () => {}, activePage = "settlement" }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState("SET-2026-004");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetail, setShowDetail] = useState(false); // mobile detail sheet

  const client = SETTLEMENTS.find(s => s.id === selected);
  const pending = SETTLEMENTS.filter(s=>s.status==="대기").reduce((a,s)=>a+s.partnerAmt,0);
  const totalSettled = SETTLEMENTS.filter(s=>s.status==="완료").reduce((a,s)=>a+s.partnerAmt,0);
  const totalAG = SETTLEMENTS.reduce((a,s)=>a+s.afterglowAmt,0);

  const openDetail = (id) => { setSelected(id); if(isMobile) setShowDetail(true); };

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
        .card{background:var(--surface);border-radius:14px;padding:18px 20px;border:1px solid var(--border);}
        .settle-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;background:var(--surface);border:1.5px solid transparent;cursor:pointer;transition:all 0.18s;}
        .settle-row:hover{border-color:var(--border-mid);box-shadow:var(--shadow-sm);}
        .settle-row.selected{border-color:var(--ink);background:var(--bg-2);}
        .gold-btn{background:var(--accent);color:#FFFFFF;border:none;border-radius:8px;padding:11px 20px;font-size:13px;font-weight:555;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:7px;}
        .gold-btn:hover{background:#333333;transform:translateY(-1px);}
        .ghost-btn{background:transparent;color:var(--ink-muted);border:1px solid var(--border-mid);border-radius:8px;padding:10px 14px;font-size:13px;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .ghost-btn:hover{border-color:var(--ink);color:var(--ink);}
        .detail-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);}
        .detail-row:last-child{border-bottom:none;}
        .drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:40;}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:var(--sidebar-bg);z-index:50;padding:28px 16px;display:flex;flex-direction:column;}
        .bottom-sheet{position:fixed;left:0;right:0;bottom:0;background:var(--surface);border-radius:20px 20px 0 0;z-index:60;padding:24px 20px 40px;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg);}
        .sheet-handle{width:36px;height:4px;background:var(--border-mid);border-radius:99px;margin:0 auto 20px;}
        @keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}.slide-up{animation:slideUp 0.28s ease forwards;}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}.fade-in{animation:fadeIn 0.2s ease forwards;}
        @keyframes modalIn{from{opacity:0;transform:scale(0.96);}to{opacity:1;transform:scale(1);}}.modal-in{animation:modalIn 0.22s ease forwards;}
      `}</style>

      {/* SIDEBAR */}
      {!isMobile && (
        <aside style={{ width:isTablet?64:232, background:"var(--sidebar-bg)", display:"flex", flexDirection:"column", padding:isTablet?"28px 10px":"28px 16px", flexShrink:0, borderRight:"1px solid var(--sidebar-border)" }}>
          <div style={{ padding:"0 8px 32px", overflow:"hidden" }}>
            {isTablet ? <div style={{ width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}><Sparkles size={18} color="rgba(255,255,255,0.85)"/></div>
              : <><div style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.9)", fontSize:20, fontWeight:600, letterSpacing:"0.04em" }}>AFTERGLOW</div><div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", marginTop:4 }}>OPERATOR CONSOLE</div></>}
          </div>
          <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
            {NAV.map(item=>(
              <div key={item.id} className={`nav-item${activePage === item.id ? " active" : ""}`} onClick={() => setPage(item.id)}
                style={{ justifyContent:isTablet?"center":"flex-start", padding:isTablet?"12px":"10px 16px" }} title={isTablet?item.label:""}>
                <item.icon size={16} strokeWidth={1.8}/>{!isTablet&&item.label}
              </div>
            ))}
          </nav>
          <div style={{ borderTop:"1px solid var(--sidebar-border)", paddingTop:16 }}>
            <div className="nav-item" style={{ justifyContent:isTablet?"center":"flex-start", padding:isTablet?"12px":"10px 16px" }}><Settings size={16} strokeWidth={1.8}/>{!isTablet&&"설정"}</div>
            {!isTablet && <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", marginTop:6 }}>
              <div style={{ width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.9)",flexShrink:0 }}>S</div>
              <div><div style={{ color:"var(--sidebar-text-active)", fontSize:13, fontWeight:500 }}>기획자 S</div><div style={{ color:"var(--sidebar-text)", fontSize:11 }}>피플리 담당</div></div>
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
              {NAV.map(item=><div key={item.id} className={`nav-item${activePage === item.id ? " active" : ""}`} onClick={() => { setPage(item.id); setDrawerOpen(false); }}><item.icon size={16} strokeWidth={1.8}/>{item.label}</div>)}
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
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:600, color:"var(--ink)" }}>정산 관리</div>
              {!isMobile && <div style={{ color:"var(--ink-muted)", fontSize:12, marginTop:1, fontFamily:"'DM Mono',monospace" }}>Revenue Share 정산 · 파트너사 지급 관리</div>}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {!isMobile && <button className="ghost-btn" style={{ fontSize:12 }}><Download size={13}/>전체 내역 엑셀</button>}
            <button className="gold-btn" style={{ padding:isMobile?"8px 12px":"10px 18px", fontSize:12 }}>
              <Receipt size={13}/>{!isMobile&&"정산서 발행"}
            </button>
            <div style={{ position:"relative", cursor:"pointer" }}>
              <Bell size={18} strokeWidth={1.8} color="var(--ink-muted)"/>
              <span style={{ position:"absolute", top:-3, right:-3, width:7, height:7, background:"var(--color-success)", borderRadius:"50%", border:"1.5px solid var(--bg)" }}/>
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflow:"auto", padding:isMobile?"14px":"24px 32px", display:"flex", flexDirection:"column", gap:isMobile?12:20 }}>

          {/* KPI */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:isMobile?10:14 }}>
            {[
              { label:"정산 대기",         value:fmt(pending),      icon:Clock,      color:"var(--color-warning)", sub:"D-9", urgent:true },
              { label:"누적 파트너 지급액", value:fmt(totalSettled), icon:Building2,  color:"#7B9EE8", sub:"3건 완료" },
              { label:"AFTERGLOW 누적",    value:fmt(totalAG),      icon:TrendingUp, color:"#4CAF7C", sub:"운영비 차감 전" },
              { label:"평균 전환율",        value:"24%",             icon:Zap,        color:"var(--accent)", sub:"성과 연동 구간" },
            ].map((kpi,i)=>(
              <div key={i} className="card" style={{ padding:isMobile?"14px":"18px 20px", border:kpi.urgent?"1.5px solid var(--border-strong)":undefined }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:isMobile?8:12 }}>
                  <div style={{ width:30,height:30,borderRadius:8,background:`${kpi.color === "var(--accent)" || kpi.color === "var(--color-warning)" ? "var(--bg-3)" : kpi.color + "18"}`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <kpi.icon size={14} color={kpi.color} strokeWidth={2}/>
                  </div>
                  {kpi.urgent && <span style={{ fontSize:10, fontWeight:700, color:"var(--color-warning)", background:"var(--color-warning-bg)", padding:"2px 7px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>D-9</span>}
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:600, color:"var(--ink)" }}>{kpi.value}</div>
                <div style={{ fontSize:isMobile?10.5:12, color:"var(--ink-muted)", marginTop:3 }}>{kpi.label}</div>
                <div style={{ fontSize:10.5, color:kpi.color, marginTop:2, fontFamily:"'DM Mono',monospace" }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* RS 모델 배너 */}
          <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:isMobile?"14px":"16px 24px", border:"1px solid rgba(255,255,255,0.08)" }}>
            {isMobile ? (
              <>
                <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.35)", fontFamily:"'DM Mono',monospace", marginBottom:6 }}>현재 적용 모델</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:"rgba(255,255,255,0.85)", fontWeight:600, marginBottom:10 }}>성과 연동형 (Performance-Based)</div>
                <div style={{ display:"flex", gap:7 }}>
                  {RS_TIERS.map((t,i)=>{
                    const active = i===1;
                    return (
                      <div key={i} style={{ flex:1, padding:"8px 6px", borderRadius:8, background:active?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)", border:`1px solid ${active?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.05)"}`, textAlign:"center" }}>
                        <div style={{ fontSize:9.5, color:active?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.25)", fontFamily:"'DM Mono',monospace", marginBottom:3 }}>{t.label}</div>
                        <div style={{ fontSize:12.5, fontWeight:700, color:active?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.2)" }}>파트너 {t.rs}%</div>
                        {active && <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", marginTop:2 }}>현재</div>}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ display:"flex", gap:0, alignItems:"stretch" }}>
                <div style={{ flex:1, paddingRight:24, borderRight:"1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontFamily:"'DM Mono',monospace", marginBottom:6 }}>현재 적용 모델</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:"rgba(255,255,255,0.85)", fontWeight:600, marginBottom:3 }}>성과 연동형 (Performance-Based)</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>전환율 24% → 35% 구간 적용 중</div>
                </div>
                {RS_TIERS.map((t,i)=>{
                  const active = i===1;
                  return (
                    <div key={i} style={{ flex:1, padding:"0 20px", borderRight:i<2?"1px solid rgba(255,255,255,0.08)":"none", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                        <span style={{ fontSize:11, color:active?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.35)", fontFamily:"'DM Mono',monospace" }}>{t.label}</span>
                        {active && <span style={{ fontSize:9.5, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.7)", padding:"1px 6px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>현재</span>}
                      </div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:active?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.2)" }}>파트너 {t.rs}%</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* List + Desktop Detail */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"1fr":"1fr 360px", gap:18 }}>

            {/* Settlement List */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:"var(--ink)" }}>정산 내역</h3>
                <button className="ghost-btn" style={{ padding:"7px 12px", fontSize:12 }}><Filter size={13}/>필터</button>
              </div>

              {/* Column headers - desktop only */}
              {!isMobile && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 90px 90px 90px", gap:0, padding:"6px 16px", marginBottom:8 }}>
                  {["프로젝트 / 기간","모델","파트너 지급","상태"].map(h=>(
                    <div key={h} style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>{h}</div>
                  ))}
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {SETTLEMENTS.map(s=>{
                  const mc = MODEL_COLORS[s.model];
                  const isSelected = selected===s.id && !isMobile;
                  return (
                    <div key={s.id} className={`settle-row${isSelected?" selected":""}`} onClick={()=>openDetail(s.id)}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?14:15, fontWeight:600, color:"var(--ink)" }}>{s.project}</span>
                          <span style={{ fontSize:11, color:"var(--ink-muted)" }}>{s.partner}</span>
                          {isMobile && (
                            <span style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4 }}>
                              {s.status==="완료"?<CheckCircle2 size={13} color="var(--color-success)"/>:<Clock size={13} color="var(--color-warning)"/>}
                              <span style={{ fontSize:12, fontWeight:500, color:s.statusColor }}>{s.status}</span>
                            </span>
                          )}
                        </div>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <span style={{ fontSize:11, color:"var(--ink-faint)", fontFamily:"'DM Mono',monospace" }}>{s.id}</span>
                          {isMobile && <span style={{ fontSize:11, color:"var(--accent)", fontWeight:600, fontFamily:"'DM Mono',monospace" }}>{fmt(s.partnerAmt)}</span>}
                          {!isMobile && <span style={{ fontSize:11, color:"var(--ink-muted)" }}>· {s.period}</span>}
                        </div>
                      </div>
                      {!isMobile && (
                        <>
                          <div style={{ width:90 }}><span style={{ fontSize:11, fontWeight:600, color:mc === "var(--accent)" ? "var(--ink)" : mc, background:mc === "var(--accent)" ? "var(--accent-dim)" : `${mc}15`, padding:"3px 8px", borderRadius:20 }}>{s.model==="성과 연동형"?"성과연동":s.model==="기본 수익 배분"?"기본RS":"절감형"}</span></div>
                          <div style={{ width:90, fontSize:13, fontWeight:600, color:"var(--ink)", fontFamily:"'DM Mono',monospace" }}>{fmt(s.partnerAmt)}</div>
                          <div style={{ width:90, display:"flex", alignItems:"center", gap:5 }}>
                            {s.status==="완료"?<CheckCircle2 size={13} color="var(--color-success)"/>:<Clock size={13} color="var(--color-warning)"/>}
                            <span style={{ fontSize:12, fontWeight:500, color:s.statusColor }}>{s.status}</span>
                          </div>
                        </>
                      )}
                      {isMobile && <ChevronRight size={16} color="var(--border-strong)"/>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DESKTOP Detail Panel */}
            {!isMobile && client && (
              <DetailPanel client={client} onApprove={()=>setShowConfirm(true)}/>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      {isMobile && showDetail && client && (
        <>
          <div className="drawer-overlay fade-in" onClick={()=>setShowDetail(false)}/>
          <div className="bottom-sheet slide-up">
            <div className="sheet-handle"/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:"var(--ink)" }}>{client.project}</div>
                <div style={{ fontSize:12, color:"var(--ink-muted)", marginTop:2 }}>{client.partner} · {client.period}</div>
              </div>
              <button onClick={()=>setShowDetail(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink-muted)", padding:4 }}><X size={18}/></button>
            </div>
            <DetailPanel client={client} onApprove={()=>{setShowDetail(false);setShowConfirm(true);}} mobile/>
          </div>
        </>
      )}

      {/* Confirm Modal */}
      {showConfirm && client && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:"20px" }}>
          <div className="modal-in" style={{ background:"var(--surface)", borderRadius:18, padding:"28px 24px", width:"100%", maxWidth:400, boxShadow:"var(--shadow-lg)" }}>
            <div style={{ width:44,height:44,borderRadius:12,background:"var(--bg-3)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
              <CreditCard size={20} color="var(--ink)"/>
            </div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:"var(--ink)", marginBottom:8 }}>정산 승인 확인</div>
            <div style={{ fontSize:13.5, color:"var(--ink-2)", lineHeight:1.65, marginBottom:22 }}>
              <strong style={{ color:"var(--ink)" }}>{client.partner}</strong>에게<br/>
              <strong style={{ color:"var(--accent)", fontFamily:"'DM Mono',monospace" }}>{fmt(client.partnerAmt)}</strong>을 지급 처리합니다.<br/>
              승인 후 되돌릴 수 없습니다.
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="ghost-btn" style={{ flex:1, justifyContent:"center" }} onClick={()=>setShowConfirm(false)}>취소</button>
              <button className="gold-btn" style={{ flex:1, justifyContent:"center" }} onClick={()=>setShowConfirm(false)}>
                <CheckCircle2 size={14}/>승인 확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM TAB */}
      {isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:30, background:"var(--surface)", borderTop:"1px solid var(--border)", display:"flex", padding:"6px 0 max(6px,env(safe-area-inset-bottom))", boxShadow:"0 -4px 20px rgba(0,0,0,0.06)" }}>
          {NAV.map(item=>{
            const active = activePage===item.id;
            return <button key={item.id} className={`tab-item${active?" active":""}`} onClick={()=>setPage(item.id)}><item.icon size={20} strokeWidth={active?2.2:1.8}/><span style={{ fontSize:9.5, fontWeight:active?600:400 }}>{item.short}</span></button>;
          })}
        </nav>
      )}
    </div>
  );
}

function DetailPanel({ client, onApprove, mobile }) {
  const fmt = (n) => `${(n/10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}만원`;
  const fmtFull = (n) => `${n.toLocaleString()}원`;
  const mc = { "성과 연동형":"var(--accent)", "기본 수익 배분":"#7B9EE8", "초기 비용 절감형":"#4CAF7C" }[client.model];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {/* Breakdown */}
      <div style={{ background:mobile?"var(--bg-2)":"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)" }}>
        <div style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:14 }}>정산 내역 상세</div>
        <div style={{ background:mobile?"var(--surface)":"var(--bg-2)", borderRadius:10, padding:"14px" }}>
          {[
            { label:"팝업 총 매출",           value:fmtFull(client.total),      color:"var(--ink-2)", bold:false },
            { label:"IP 라이선스료 (10%)",     value:`- ${fmtFull(client.ipFee)}`, color:"var(--color-danger)", bold:false },
            { label:`파트너 배분 (${client.conversion>=30?50:client.conversion>=15?35:20}%)`, value:fmtFull(client.partnerAmt), color:"#7B9EE8", bold:true },
            { label:"AFTERGLOW 수익",         value:fmtFull(client.afterglowAmt), color:"var(--ink)", bold:true },
          ].map((row,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<3?"1px solid var(--border)":"none" }}>
              <span style={{ fontSize:12.5, color:row.bold?"var(--ink)":"var(--ink-muted)", fontWeight:row.bold?600:400 }}>{row.label}</span>
              <span style={{ fontSize:13, fontWeight:row.bold?700:500, color:row.color, fontFamily:"'DM Mono',monospace" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Model + conversion badges */}
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1, padding:"11px 14px", background:mc === "var(--accent)" ? "var(--bg-3)" : `${mc}10`, borderRadius:10, border:mc === "var(--accent)" ? "1px solid var(--border-mid)" : `1px solid ${mc}20` }}>
          <div style={{ fontSize:10.5, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:4 }}>적용 모델</div>
          <div style={{ fontSize:13, fontWeight:600, color:mc === "var(--accent)" ? "var(--ink)" : mc }}>{client.model}</div>
        </div>
        <div style={{ flex:1, padding:"11px 14px", background:"var(--color-success-bg)", borderRadius:10, border:"1px solid var(--color-success)" }}>
          <div style={{ fontSize:10.5, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginBottom:4 }}>팝업 전환율</div>
          <div style={{ fontSize:13, fontWeight:600, color:"var(--color-success)" }}>{client.conversion}%</div>
        </div>
      </div>

      {/* Due date warning */}
      {client.status==="대기" && (
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"var(--color-warning-bg)", borderRadius:9, border:"1px solid var(--color-warning)" }}>
          <Calendar size={14} color="var(--color-warning)"/>
          <span style={{ fontSize:12.5, color:"var(--color-warning)" }}>지급 예정일: <strong>{client.dueDate}</strong></span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {client.status==="대기" ? (
          <>
            <button className="gold-btn" style={{ width:"100%", justifyContent:"center" }} onClick={onApprove}>
              <CreditCard size={14}/>정산 승인 & 지급 처리
            </button>
            <button className="ghost-btn" style={{ width:"100%", justifyContent:"center" }}>
              <Download size={13}/>정산서 미리보기
            </button>
          </>
        ) : (
          <button className="ghost-btn" style={{ width:"100%", justifyContent:"center" }}>
            <Download size={13}/>정산서 다운로드
          </button>
        )}
      </div>
    </div>
  );
}

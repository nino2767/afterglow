import { useState, useEffect } from "react";
import {
  Building2, LayoutGrid, BarChart2, Settings, Bell,
  Plus, Search, CheckCircle2, Clock, XCircle, Edit2,
  Trash2, Eye, Users, TrendingUp, ShieldCheck, X,
  AlertCircle, Calendar, Globe, Phone, Mail, CreditCard,
  Zap, ArrowUpRight, Copy, Check, ChevronRight, Menu,
  FileText, Sparkles, Filter
} from "lucide-react";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}

const NAV = [
  { id:"clients",    icon:Building2,   label:"고객사 관리",     active:true },
  { id:"exhibitions",icon:LayoutGrid,  label:"전체 전시 현황" },
  { id:"settlement", icon:BarChart2,   label:"정산 관리" },
  { id:"system",     icon:Settings,    label:"시스템 설정" },
];

const PLAN_META = {
  basic:      { label:"Basic",      color:"#7B9EE8", bg:"rgba(123,158,232,0.12)" },
  pro:        { label:"Pro",        color:"#C9A84C", bg:"rgba(201,168,76,0.12)" },
  enterprise: { label:"Enterprise", color:"#4CAF7C", bg:"rgba(76,175,124,0.12)" },
};
const STATUS_META = {
  active:   { label:"활성",   color:"#4CAF7C", icon:CheckCircle2 },
  pending:  { label:"검토중", color:"#C9A84C", icon:Clock },
  inactive: { label:"비활성", color:"#9A9490", icon:XCircle },
};

const CLIENTS = [
  { id:"CLT-001", company_name:"피플리",       company_site:"peoply.co.kr",      contact_name:"김민준", contact_email:"mj.kim@peoply.co.kr",        contact_phone:"010-1234-5678", plan_type:"pro",        rs_ratio:35, contract_start:"2026.01.10", contract_end:"2026.12.31", status:"active",   exhibitions:2, total_revenue:133050000 },
  { id:"CLT-002", company_name:"세라핌컴퍼니",  company_site:"seraphim.co.kr",    contact_name:"박지현", contact_email:"jh.park@seraphim.co.kr",      contact_phone:"010-2345-6789", plan_type:"basic",      rs_ratio:20, contract_start:"2026.02.01", contract_end:"2026.07.31", status:"active",   exhibitions:1, total_revenue:31600000 },
  { id:"CLT-003", company_name:"그라운드시소",  company_site:"groundseesaw.com",  contact_name:"이수연", contact_email:"sy.lee@groundseesaw.com",     contact_phone:"010-3456-7890", plan_type:"enterprise", rs_ratio:40, contract_start:"2026.05.01", contract_end:"2027.04.30", status:"pending",  exhibitions:0, total_revenue:0 },
  { id:"CLT-004", company_name:"시월(SIWOL)",  company_site:"siwol.kr",          contact_name:"최도현", contact_email:"dh.choi@siwol.kr",           contact_phone:"010-4567-8901", plan_type:"pro",        rs_ratio:35, contract_start:"2025.09.01", contract_end:"2026.02.28", status:"inactive", exhibitions:3, total_revenue:89200000 },
  { id:"CLT-005", company_name:"GNC미디어",    company_site:"gncmedia.kr",       contact_name:"정하은", contact_email:"ha.jung@gncmedia.kr",         contact_phone:"010-5678-9012", plan_type:"enterprise", rs_ratio:42, contract_start:"2026.04.15", contract_end:"2027.04.14", status:"pending",  exhibitions:0, total_revenue:0 },
];

const fmtM = (n) => n>=10000000?`${(n/10000000).toFixed(1)}천만`:n>=10000?`${Math.round(n/10000)}만`:"-";

export default function ClientAdminResponsive() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState("CLT-001");
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [copied, setCopied] = useState(false);
  const [newForm, setNewForm] = useState({ company_name:"", contact_name:"", contact_email:"", contact_phone:"", plan_type:"basic", rs_ratio:20, contract_start:"", contract_end:"" });

  const client = CLIENTS.find(c=>c.id===selected);
  const filtered = CLIENTS.filter(c=>
    (filterStatus==="all"||c.status===filterStatus) &&
    (c.company_name.includes(search)||c.contact_name.includes(search)||c.id.includes(search))
  );

  const totalActive = CLIENTS.filter(c=>c.status==="active").length;
  const totalRevenue = CLIENTS.reduce((a,c)=>a+c.total_revenue,0);

  const openDetail = (id) => { setSelected(id); if(isMobile) setShowDetail(true); };
  const copyId = () => { navigator.clipboard?.writeText(selected); setCopied(true); setTimeout(()=>setCopied(false),1500); };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#F7F5F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#2E2E2E;border-radius:2px;}
        .nav-item{display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:8px;cursor:pointer;transition:all 0.18s;color:#6B6B6B;font-size:13.5px;}
        .nav-item:hover{background:rgba(255,255,255,0.06);color:#E8E4DC;}
        .nav-item.active{background:rgba(201,168,76,0.15);color:#C9A84C;font-weight:500;}
        .tab-item{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;padding:8px 4px;cursor:pointer;transition:all 0.18s;color:#9A9490;border:none;background:none;font-family:'DM Sans',sans-serif;}
        .tab-item.active{color:#C9A84C;}
        .card{background:white;border-radius:14px;padding:18px 20px;border:1px solid rgba(0,0,0,0.06);}
        .client-row{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:12px;background:white;border:1.5px solid transparent;cursor:pointer;transition:all 0.18s;}
        .client-row:hover{border-color:rgba(201,168,76,0.25);box-shadow:0 2px 12px rgba(0,0,0,0.06);}
        .client-row.selected{border-color:#C9A84C;background:rgba(201,168,76,0.03);}
        .gold-btn{background:#C9A84C;color:#0D0D0F;border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:7px;}
        .gold-btn:hover{background:#D4B35A;transform:translateY(-1px);}
        .ghost-btn{background:transparent;color:#888;border:1px solid rgba(0,0,0,0.12);border-radius:8px;padding:10px 14px;font-size:13px;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .ghost-btn:hover{border-color:#C9A84C;color:#C9A84C;}
        .danger-btn{background:rgba(232,123,123,0.1);color:#E87B7B;border:1px solid rgba(232,123,123,0.2);border-radius:8px;padding:10px 14px;font-size:13px;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .danger-btn:hover{background:rgba(232,123,123,0.2);}
        .filter-btn{padding:7px 14px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid transparent;transition:all 0.18s;font-family:'DM Sans',sans-serif;white-space:nowrap;}
        .filter-btn.active{background:#0D0D0F;color:#C9A84C;border-color:#0D0D0F;}
        .filter-btn.idle{background:white;color:#6B6B6B;border-color:rgba(0,0,0,0.1);}
        .filter-btn.idle:hover{border-color:#C9A84C;color:#C9A84C;}
        .form-input{width:100%;border:1px solid rgba(0,0,0,0.12);border-radius:9px;padding:10px 12px;font-family:'DM Sans',sans-serif;font-size:13px;color:#1A1A1A;background:white;outline:none;transition:border-color 0.18s;}
        .form-input:focus{border-color:#C9A84C;}
        .form-select{width:100%;border:1px solid rgba(0,0,0,0.12);border-radius:9px;padding:10px 12px;font-family:'DM Sans',sans-serif;font-size:13px;color:#1A1A1A;background:white;outline:none;cursor:pointer;}
        .detail-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(0,0,0,0.05);}
        .detail-row:last-child{border-bottom:none;}
        .drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:40;}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:#0D0D0F;z-index:50;padding:28px 16px;display:flex;flex-direction:column;}
        .bottom-sheet{position:fixed;left:0;right:0;bottom:0;background:white;border-radius:20px 20px 0 0;z-index:60;padding:24px 20px 40px;max-height:88vh;overflow-y:auto;box-shadow:0 -8px 40px rgba(0,0,0,0.18);}
        .sheet-handle{width:36px;height:4px;background:#E8E4DC;border-radius:99px;margin:0 auto 20px;}
        @keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}.slide-up{animation:slideUp 0.28s ease forwards;}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}.fade-in{animation:fadeIn 0.2s ease forwards;}
        @keyframes modalIn{from{opacity:0;transform:scale(0.96);}to{opacity:1;transform:scale(1);}}.modal-in{animation:modalIn 0.22s ease forwards;}
      `}</style>

      {/* SIDEBAR */}
      {!isMobile && (
        <aside style={{ width:isTablet?64:232, background:"#0D0D0F", display:"flex", flexDirection:"column", padding:isTablet?"28px 10px":"28px 16px", flexShrink:0, borderRight:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding:"0 8px 8px", overflow:"hidden" }}>
            {isTablet ? <div style={{ width:36,height:36,borderRadius:10,background:"rgba(201,168,76,0.15)",display:"flex",alignItems:"center",justifyContent:"center" }}><Sparkles size={18} color="#C9A84C"/></div>
              : <>
                  <div style={{ fontFamily:"'Playfair Display',serif", color:"#C9A84C", fontSize:20, fontWeight:600, letterSpacing:"0.04em" }}>AFTERGLOW</div>
                  <div style={{ color:"#C9A84C", fontSize:10, fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", marginTop:6, background:"rgba(201,168,76,0.12)", padding:"3px 8px", borderRadius:20, display:"inline-block" }}>SUPER ADMIN</div>
                </>
            }
          </div>
          <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"20px 0" }}/>
          <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
            {NAV.map(item=>(
              <div key={item.id} className={`nav-item${item.active?" active":""}`}
                style={{ justifyContent:isTablet?"center":"flex-start", padding:isTablet?"12px":"10px 16px" }} title={isTablet?item.label:""}>
                <item.icon size={16} strokeWidth={1.8}/>{!isTablet&&item.label}
              </div>
            ))}
          </nav>
          {!isTablet && (
            <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"13px", marginBottom:14, border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:10, color:"#5A5A5A", fontFamily:"'DM Mono',monospace", marginBottom:8 }}>전체 현황</div>
              {[{label:"활성 고객사",value:`${totalActive}개`},{label:"누적 매출",value:fmtM(totalRevenue)+"원"},{label:"전체 전시",value:"6건"}].map((s,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, color:"#5A5A5A" }}>{s.label}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:"#C9A84C", fontFamily:"'DM Mono',monospace" }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px" }}>
              <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#C9A84C,#8B6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:"#0D0D0F",flexShrink:0 }}>A</div>
              {!isTablet && <><div><div style={{ color:"#D4CFC5", fontSize:13, fontWeight:500 }}>Admin</div><div style={{ color:"#4A4A4A", fontSize:10, fontFamily:"'DM Mono',monospace" }}>SUPER ADMIN</div></div><ShieldCheck size={13} color="#C9A84C" style={{ marginLeft:"auto" }}/></>}
            </div>
          </div>
        </aside>
      )}

      {/* MOBILE DRAWER */}
      {isMobile && drawerOpen && (
        <><div className="drawer-overlay" onClick={()=>setDrawerOpen(false)}/>
          <div className="drawer">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", color:"#C9A84C", fontSize:18, fontWeight:600 }}>AFTERGLOW</div>
                <div style={{ color:"#C9A84C", fontSize:10, fontFamily:"'DM Mono',monospace", background:"rgba(201,168,76,0.12)", padding:"2px 8px", borderRadius:20, display:"inline-block", marginTop:4 }}>SUPER ADMIN</div>
              </div>
              <button onClick={()=>setDrawerOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#6B6B6B" }}><X size={18}/></button>
            </div>
            <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
              {NAV.map(item=><div key={item.id} className={`nav-item${item.active?" active":""}`} onClick={()=>setDrawerOpen(false)}><item.icon size={16} strokeWidth={1.8}/>{item.label}</div>)}
            </nav>
          </div>
        </>
      )}

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, paddingBottom:isMobile?72:0 }}>

        {/* Header */}
        <header style={{ padding:isMobile?"14px 16px":"18px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#F7F5F0", borderBottom:"1px solid rgba(0,0,0,0.07)", position:"sticky", top:0, zIndex:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {isMobile && <button onClick={()=>setDrawerOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", color:"#2A2A2A", padding:4 }}><Menu size={20}/></button>}
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:600, color:"#0D0D0F" }}>고객사 관리</div>
              {!isMobile && <div style={{ color:"#9A9490", fontSize:12, marginTop:1, fontFamily:"'DM Mono',monospace" }}>전체 {CLIENTS.length}개 고객사 · 슈퍼 어드민 전용</div>}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button className="gold-btn" style={{ padding:isMobile?"8px 12px":"10px 18px", fontSize:12 }} onClick={()=>setShowCreate(true)}>
              <Plus size={14}/>{!isMobile&&"고객사 등록"}
            </button>
            <div style={{ position:"relative", cursor:"pointer" }}>
              <Bell size={18} strokeWidth={1.8} color="#888"/>
              <span style={{ position:"absolute", top:-3, right:-3, width:7, height:7, background:"#C9A84C", borderRadius:"50%", border:"1.5px solid #F7F5F0" }}/>
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflow:"auto", padding:isMobile?"14px":"24px 32px", display:"flex", flexDirection:"column", gap:isMobile?12:18 }}>

          {/* KPI */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:isMobile?10:14 }}>
            {[
              { label:"활성 고객사", value:totalActive, unit:"개", color:"#4CAF7C", icon:CheckCircle2 },
              { label:"검토 중",     value:CLIENTS.filter(c=>c.status==="pending").length, unit:"개", color:"#C9A84C", icon:Clock },
              { label:"이번 달 매출", value:fmtM(totalRevenue), unit:"", color:"#7B9EE8", icon:TrendingUp },
              { label:"운영 중 전시", value:"6", unit:"건", color:"#E8A84C", icon:LayoutGrid },
            ].map((k,i)=>(
              <div key={i} className="card" style={{ padding:isMobile?"14px":"16px 18px" }}>
                <div style={{ width:30,height:30,borderRadius:8,background:`${k.color}15`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:isMobile?8:10 }}>
                  <k.icon size={14} color={k.color} strokeWidth={2}/>
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?20:22, fontWeight:600, color:"#0D0D0F" }}>
                  {k.value}<span style={{ fontSize:11, color:"#9A9490", marginLeft:3 }}>{k.unit}</span>
                </div>
                <div style={{ fontSize:isMobile?10.5:11.5, color:"#9A9490", marginTop:3 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div style={{ display:"flex", flexDirection:isMobile?"column":"row", gap:10 }}>
            <div style={{ position:"relative", flex:1 }}>
              <Search size={13} color="#9A9490" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}/>
              <input className="form-input" style={{ paddingLeft:34 }} placeholder="고객사명·담당자·ID 검색" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
              {[["all","전체"],["active","활성"],["pending","검토중"],["inactive","비활성"]].map(([val,label])=>(
                <button key={val} className={`filter-btn ${filterStatus===val?"active":"idle"}`} onClick={()=>setFilterStatus(val)}>{label}</button>
              ))}
            </div>
          </div>

          {/* Table header - desktop only */}
          {!isMobile && (
            <div style={{ display:"grid", gridTemplateColumns:"2fr 80px 80px 80px 100px", gap:0, padding:"6px 16px" }}>
              {["고객사 / 담당자","플랜","RS","전시","상태"].map(h=>(
                <div key={h} style={{ fontSize:11, color:"#9A9490", fontFamily:"'DM Mono',monospace" }}>{h}</div>
              ))}
            </div>
          )}

          {/* List + Detail */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"1fr":"1fr 360px", gap:18 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {filtered.length===0 && (
                <div style={{ textAlign:"center", padding:"48px 0", color:"#9A9490" }}>
                  <AlertCircle size={26} style={{ margin:"0 auto 12px", display:"block", opacity:0.4 }}/>
                  <div style={{ fontSize:13 }}>검색 결과가 없습니다</div>
                </div>
              )}
              {filtered.map(c=>{
                const plan = PLAN_META[c.plan_type];
                const status = STATUS_META[c.status];
                const isSelected = selected===c.id && !isMobile;
                return (
                  <div key={c.id} className={`client-row${isSelected?" selected":""}`} onClick={()=>openDetail(c.id)}>
                    <div style={{ width:36,height:36,borderRadius:10,background:`${plan.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <Building2 size={16} color={plan.color} strokeWidth={1.8}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?14:14, fontWeight:600, color:"#0D0D0F" }}>{c.company_name}</span>
                        <span style={{ fontSize:10.5, fontWeight:600, color:plan.color, background:plan.bg, padding:"2px 7px", borderRadius:20 }}>{plan.label}</span>
                      </div>
                      <div style={{ fontSize:11, color:"#9A9490", fontFamily:"'DM Mono',monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {c.id} · {c.contact_name}
                      </div>
                    </div>
                    {!isMobile && (
                      <>
                        <div style={{ width:80, fontSize:13, fontWeight:600, color:"#0D0D0F", fontFamily:"'DM Mono',monospace" }}>{c.rs_ratio}%</div>
                        <div style={{ width:80, fontSize:13, color:"#6B6B6B", fontFamily:"'DM Mono',monospace" }}>{c.exhibitions}건</div>
                        <div style={{ width:100, display:"flex", alignItems:"center", gap:5 }}>
                          <status.icon size={12} color={status.color}/>
                          <span style={{ fontSize:12, fontWeight:500, color:status.color }}>{status.label}</span>
                        </div>
                      </>
                    )}
                    {isMobile && (
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <status.icon size={11} color={status.color}/>
                          <span style={{ fontSize:11.5, fontWeight:500, color:status.color }}>{status.label}</span>
                        </div>
                        <ChevronRight size={14} color="#CCC"/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* DESKTOP Detail */}
            {!isMobile && client && <ClientDetailPanel client={client} copied={copied} onCopy={copyId}/>}
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
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:40,height:40,borderRadius:11,background:`${PLAN_META[client.plan_type].color}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Building2 size={18} color={PLAN_META[client.plan_type].color}/>
                </div>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:600, color:"#0D0D0F" }}>{client.company_name}</div>
                  <div style={{ display:"flex", gap:6, marginTop:3 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:PLAN_META[client.plan_type].color, background:PLAN_META[client.plan_type].bg, padding:"2px 8px", borderRadius:20 }}>{PLAN_META[client.plan_type].label}</span>
                    <span style={{ fontSize:11, fontWeight:500, color:STATUS_META[client.status].color }}>{STATUS_META[client.status].label}</span>
                  </div>
                </div>
              </div>
              <button onClick={()=>setShowDetail(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9A9490", padding:4 }}><X size={18}/></button>
            </div>
            <ClientDetailPanel client={client} copied={copied} onCopy={copyId} mobile/>
          </div>
        </>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:isMobile?"flex-end":"center", justifyContent:"center", zIndex:100, padding:isMobile?0:"20px" }}>
          <div className="modal-in" style={{ background:"white", borderRadius:isMobile?"20px 20px 0 0":"18px", padding:"28px 22px", width:"100%", maxWidth:500, maxHeight:"90vh", overflow:"auto", boxShadow:"0 24px 60px rgba(0,0,0,0.2)" }}>
            {isMobile && <div style={{ width:36,height:4,background:"#E8E4DC",borderRadius:99,margin:"0 auto 20px" }}/>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:600, color:"#0D0D0F" }}>고객사 등록</div>
                <div style={{ fontSize:12, color:"#9A9490", marginTop:2 }}>신규 기획사 계약 등록 · 슈퍼 어드민 전용</div>
              </div>
              <button onClick={()=>setShowCreate(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9A9490" }}><X size={18}/></button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:12 }}>
                {[{label:"고객사명 *",key:"company_name",ph:"예: 피플리"},{label:"담당자명 *",key:"contact_name",ph:"예: 김민준"},{label:"이메일 *",key:"contact_email",ph:"mj@company.kr"},{label:"연락처 *",key:"contact_phone",ph:"010-0000-0000"},{label:"계약 시작일 *",key:"contract_start",ph:"YYYY.MM.DD"},{label:"계약 종료일 *",key:"contract_end",ph:"YYYY.MM.DD"}].map(f=>(
                  <div key={f.key}>
                    <label style={{ fontSize:11, color:"#9A9490", fontFamily:"'DM Mono',monospace", display:"block", marginBottom:5 }}>{f.label}</label>
                    <input className="form-input" placeholder={f.ph} value={newForm[f.key]||""} onChange={e=>setNewForm({...newForm,[f.key]:e.target.value})}/>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ fontSize:11, color:"#9A9490", fontFamily:"'DM Mono',monospace", display:"block", marginBottom:5 }}>플랜 *</label>
                  <select className="form-select" value={newForm.plan_type} onChange={e=>setNewForm({...newForm,plan_type:e.target.value})}>
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:11, color:"#9A9490", fontFamily:"'DM Mono',monospace", display:"block", marginBottom:5 }}>RS 비율 (%)</label>
                  <input className="form-input" type="number" min={0} max={100} value={newForm.rs_ratio} onChange={e=>setNewForm({...newForm,rs_ratio:Number(e.target.value)})}/>
                </div>
              </div>
              <div style={{ padding:"11px 13px", background:"rgba(201,168,76,0.07)", borderRadius:9, border:"1px solid rgba(201,168,76,0.2)", fontSize:12.5, color:"#8B6914" }}>
                파트너 배분율 <strong style={{ color:"#C9A84C" }}>{newForm.rs_ratio}%</strong> → 전환율에 따라 인센티브 추가 적용
              </div>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button className="ghost-btn" style={{ flex:1, justifyContent:"center" }} onClick={()=>setShowCreate(false)}>취소</button>
                <button className="gold-btn" style={{ flex:2, justifyContent:"center" }} onClick={()=>setShowCreate(false)}>
                  <CheckCircle2 size={14}/>고객사 등록 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:30, background:"white", borderTop:"1px solid rgba(0,0,0,0.08)", display:"flex", padding:"6px 0 max(6px,env(safe-area-inset-bottom))", boxShadow:"0 -4px 20px rgba(0,0,0,0.08)" }}>
          {NAV.map(item=>{
            const active = item.active;
            return <button key={item.id} className={`tab-item${active?" active":""}`}><item.icon size={20} strokeWidth={active?2.2:1.8}/><span style={{ fontSize:9.5, fontWeight:active?600:400 }}>{item.label.replace("전체 ","")}</span></button>;
          })}
        </nav>
      )}
    </div>
  );
}

function ClientDetailPanel({ client, copied, onCopy, mobile }) {
  const plan = PLAN_META[client.plan_type];
  const RS_TIERS = [{label:"15% 미만",rs:20},{label:"15~30%",rs:35},{label:"30% 초과",rs:50}];
  const fmtM = (n) => n>=10000000?`${(n/10000000).toFixed(1)}천만`:n>=10000?`${Math.round(n/10000)}만`:"-";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {/* ID copy */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background:mobile?"white":"#F7F5F0", borderRadius:9, cursor:"pointer", border:"1px solid rgba(0,0,0,0.07)" }} onClick={onCopy}>
        <span style={{ fontSize:11.5, fontFamily:"'DM Mono',monospace", color:"#6B6B6B", flex:1 }}>{client.id}</span>
        {copied?<Check size={12} color="#4CAF7C"/>:<Copy size={12} color="#9A9490"/>}
      </div>

      {/* Contact info */}
      <div className="card" style={{ background:mobile?"#F7F5F0":"white" }}>
        <div style={{ fontSize:11, color:"#9A9490", fontFamily:"'DM Mono',monospace", marginBottom:12 }}>연락처 & 계약</div>
        {[
          {icon:Mail, label:"이메일", value:client.contact_email},
          {icon:Phone, label:"연락처", value:client.contact_phone},
          {icon:Globe, label:"웹사이트", value:client.company_site},
          {icon:Calendar, label:"계약기간", value:`${client.contract_start} ~ ${client.contract_end}`},
        ].map((row,i)=>(
          <div key={i} className="detail-row">
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <row.icon size={12} color="#9A9490" strokeWidth={1.8}/>
              <span style={{ fontSize:12, color:"#9A9490" }}>{row.label}</span>
            </div>
            <span style={{ fontSize:12, color:"#1A1A1A", maxWidth:180, textAlign:"right", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Plan & RS */}
      <div style={{ background:"#0D0D0F", borderRadius:14, padding:"16px 18px", border:"1px solid rgba(201,168,76,0.18)" }}>
        <div style={{ fontSize:11, color:"#C9A84C", fontFamily:"'DM Mono',monospace", marginBottom:12 }}>플랜 & RS 설정</div>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <div style={{ flex:1, padding:"10px 12px", background:"rgba(255,255,255,0.04)", borderRadius:9, border:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:10, color:"#5A5A5A", marginBottom:4 }}>현재 플랜</div>
            <div style={{ fontSize:15, fontWeight:700, color:plan.color }}>{plan.label}</div>
          </div>
          <div style={{ flex:1, padding:"10px 12px", background:"rgba(255,255,255,0.04)", borderRadius:9, border:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:10, color:"#5A5A5A", marginBottom:4 }}>RS 비율</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#C9A84C", fontFamily:"'DM Mono',monospace" }}>{client.rs_ratio}%</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {RS_TIERS.map((t,i)=>{
            const active = (i===0&&client.rs_ratio<=20)||(i===1&&client.rs_ratio>20&&client.rs_ratio<50)||(i===2&&client.rs_ratio>=50);
            return (
              <div key={i} style={{ flex:1, padding:"7px 5px", borderRadius:7, background:active?"rgba(201,168,76,0.15)":"rgba(255,255,255,0.03)", border:`1px solid ${active?"rgba(201,168,76,0.3)":"rgba(255,255,255,0.05)"}`, textAlign:"center" }}>
                <div style={{ fontSize:9, color:active?"#C9A84C":"#4A4A4A", fontFamily:"'DM Mono',monospace", marginBottom:3 }}>{t.label}</div>
                <div style={{ fontSize:12, fontWeight:700, color:active?"#C9A84C":"#3A3A3A" }}>{t.rs}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="card" style={{ background:mobile?"#F7F5F0":"white" }}>
        <div style={{ fontSize:11, color:"#9A9490", fontFamily:"'DM Mono',monospace", marginBottom:12 }}>성과 요약</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[{label:"운영 전시",value:`${client.exhibitions}건`,color:"#7B9EE8"},{label:"누적 매출",value:client.total_revenue>0?fmtM(client.total_revenue)+"원":"-",color:"#C9A84C"}].map((s,i)=>(
            <div key={i} style={{ padding:"11px 13px", background:mobile?"white":"#F7F5F0", borderRadius:9 }}>
              <div style={{ fontSize:11, color:"#9A9490", marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:16, fontWeight:700, color:s.color, fontFamily:"'DM Mono',monospace" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:8 }}>
        <button className="ghost-btn" style={{ flex:1, justifyContent:"center", fontSize:12 }}><Eye size={13}/>운영자 어드민</button>
        <button className="danger-btn" style={{ flex:1, justifyContent:"center", fontSize:12 }}><Trash2 size={13}/>비활성화</button>
      </div>
    </div>
  );
}

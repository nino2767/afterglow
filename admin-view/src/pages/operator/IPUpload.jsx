import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Upload, Bot, Eye, BarChart2, FileText,
  Settings, Bell, X, CheckCircle2, File, ImageIcon,
  Plus, Loader, Sparkles, ArrowRight, Menu, ChevronDown, ChevronUp
} from "lucide-react";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}

const NAV = [
  { id:"dashboard", icon:LayoutDashboard, label:"대시보드",   short:"홈" },
  { id:"upload",    icon:Upload,          label:"IP 업로드",  short:"업로드", active:true },
  { id:"concept",   icon:Bot,             label:"Concept Bot", short:"컨셉" },
  { id:"monitor",   icon:Eye,             label:"관람 모니터", short:"모니터" },
  { id:"report",    icon:BarChart2,       label:"성과 리포트", short:"리포트" },
  { id: "settlement",    icon:FileText,        label:"정산 관리",  short:"정산" },
];

const CHECKLIST = [
  { label:"전시 기획서 / 작가 노트 (PDF)", required:true },
  { label:"전시 대표 이미지 (고해상도 JPG/PNG)", required:true },
  { label:"작품 목록 및 섹션 구성표", required:true },
  { label:"전시 테마 영상 또는 미디어 파일", required:false },
  { label:"이전 전시 관람 데이터 (있을 경우)", required:false },
];

const PREV = [
  { name:"빛의 심연", partner:"피플리", files:4 },
  { name:"심해의 환상", partner:"세라핌컴퍼니", files:3 },
];

export default function IPUploadResponsive({ setPage = () => {}, activePage = "upload" }) {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [form, setForm] = useState({ name:"빛의 심연 스핀오프", partner:"피플리", period:"", space:"" });
  const [files, setFiles] = useState([
    { name:"빛의심연_기획서_v2.pdf", type:"pdf", size:"2.4MB", status:"done" },
    { name:"exhibition_main.jpg", type:"image", size:"8.1MB", status:"done" },
    { name:"artwork_list.pdf", type:"pdf", size:"0.9MB", status:"uploading", progress:64 },
  ]);
  const fileRef = useRef();

  const runAnalysis = () => { setAnalyzing(true); setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2800); };
  const removeFile = (i) => setFiles(files.filter((_,idx) => idx !== i));
  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).map(f => ({ name:f.name, type:f.name.endsWith(".pdf")?"pdf":"image", size:`${(f.size/1024/1024).toFixed(1)}MB`, status:"done" }));
    setFiles(prev => [...prev, ...dropped]);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"var(--bg)" }}>
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
        .step-btn{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;font-size:11px;font-weight:600;cursor:default;transition:all 0.2s;font-family:'DM Mono',monospace;}
        .step-btn.done{background:var(--accent);color:#FFFFFF;}
        .step-btn.active{background:var(--surface);color:var(--ink);border:1.5px solid var(--border-strong);}
        .step-btn.idle{background:var(--bg-3);color:var(--ink-muted);}
        .upload-zone{border:2px dashed var(--border-mid);border-radius:14px;padding:36px 20px;text-align:center;transition:all 0.2s;cursor:pointer;background:var(--surface);}
        .upload-zone:hover,.upload-zone.drag{border-color:var(--accent);background:var(--bg-2);}
        .file-row{display:flex;align-items:center;gap:10px;padding:11px 14px;background:var(--surface);border-radius:10px;border:1px solid var(--border);transition:all 0.18s;}
        .file-row:hover{border-color:var(--border-mid);}
        .gold-btn{background:var(--accent);color:#FFFFFF;border:none;border-radius:8px;padding:11px 20px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:7px;}
        .gold-btn:hover{background:#333333;transform:translateY(-1px);}
        .gold-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
        .ghost-btn{background:transparent;color:var(--ink-muted);border:1px solid var(--border-mid);border-radius:8px;padding:11px 16px;font-size:13px;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;}
        .ghost-btn:hover{border-color:var(--ink);color:var(--ink);}
        .form-input{width:100%;border:1px solid var(--border-mid);border-radius:10px;padding:11px 13px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink-2);background:var(--surface);outline:none;transition:border-color 0.18s;}
        .form-input:focus{border-color:var(--accent);}
        .progress-bar{height:4px;background:var(--bg-3);border-radius:99px;overflow:hidden;}
        .progress-fill{height:100%;border-radius:99px;background:var(--accent);transition:width 0.4s ease;}
        .drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:40;}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:var(--sidebar-bg);z-index:50;padding:28px 16px;display:flex;flex-direction:column;}
        @keyframes spin{to{transform:rotate(360deg);}}.spin{animation:spin 1s linear infinite;}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}.slide-up{animation:slideUp 0.35s ease forwards;}
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
              <div><div style={{ color:"var(--sidebar-text-active)", fontSize:13, fontWeight:500 }}>기획자 S</div><div style={{ color:"var(--sidebar-text)", fontSize:11 }}>피플리 담당</div></div>
            </div>}
          </div>
        </aside>
      )}

      {/* MOBILE DRAWER */}
      {isMobile && drawerOpen && (
        <><div className="drawer-overlay" onClick={() => setDrawerOpen(false)}/>
          <div className="drawer">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
              <div><div style={{ fontFamily:"'Playfair Display',serif", color:"rgba(255,255,255,0.9)", fontSize:18, fontWeight:600 }}>AFTERGLOW</div><div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em" }}>OPERATOR CONSOLE</div></div>
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
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?18:22, fontWeight:600, color:"var(--ink)" }}>IP 업로드</div>
              {!isMobile && <div style={{ color:"var(--ink-muted)", fontSize:12, marginTop:1, fontFamily:"'DM Mono',monospace" }}>전시 자산 등록 → AI 분석 → Concept Bot 실행</div>}
            </div>
          </div>
          <div style={{ position:"relative", cursor:"pointer" }}>
            <Bell size={18} strokeWidth={1.8} color="var(--ink-muted)"/>
            <span style={{ position:"absolute", top:-3, right:-3, width:7, height:7, background:"var(--color-success)", borderRadius:"50%", border:"1.5px solid var(--bg)" }}/>
          </div>
        </header>

        <main style={{ flex:1, overflow:"auto", padding:isMobile?"16px":"28px 32px" }}>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":isTablet?"1fr":"1fr 280px", gap:20, maxWidth:1200 }}>

            {/* LEFT: Flow */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Step Indicator */}
              <div style={{ background:"var(--surface)", borderRadius:14, padding:isMobile?"14px 16px":"18px 22px", border:"1px solid var(--border)", display:"flex", alignItems:"center", gap:0, overflowX:"auto" }}>
                {[{n:"01",label:"프로젝트 정보"},{n:"02",label:"파일 업로드"},{n:"03",label:"AI 분석"}].map((s,i) => {
                  const isDone = step>i+1, isActive = step===i+1;
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", flex:i<2?1:"none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap" }}>
                        <div className={`step-btn ${isDone?"done":isActive?"active":"idle"}`}>{isDone?<CheckCircle2 size={13}/>:s.n}</div>
                        <span style={{ fontSize:isMobile?11.5:13, fontWeight:isActive?600:400, color:isActive?"var(--ink)":isDone?"var(--accent)":"var(--ink-muted)" }}>{s.label}</span>
                      </div>
                      {i<2 && <div style={{ flex:1, height:1, background:isDone?"var(--accent)":"var(--border)", margin:"0 12px" }}/>}
                    </div>
                  );
                })}
              </div>

              {/* Step 1 */}
              <div style={{ background:"var(--surface)", borderRadius:14, padding:isMobile?"16px":"22px", border:"1px solid var(--border)", opacity:step>=1?1:0.4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>① 프로젝트 정보</h3>
                  {step>1 && <span style={{ fontSize:12, color:"var(--color-success)", display:"flex", alignItems:"center", gap:4 }}><CheckCircle2 size={12}/>완료</span>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:12 }}>
                  {[{label:"전시(프로젝트)명 *",key:"name",ph:"예: 빛의 심연 스핀오프"},{label:"파트너 기획사 *",key:"partner",ph:"예: 피플리"},{label:"전시 기간",key:"period",ph:"예: 2026.06.01 ~ 08.01"},{label:"팝업 예정 공간",key:"space",ph:"예: 전시장 내 B1 유휴공간"}].map(f=>(
                    <div key={f.key}>
                      <label style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em", display:"block", marginBottom:5 }}>{f.label}</label>
                      <input className="form-input" value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.ph}/>
                    </div>
                  ))}
                </div>
                {step===1 && <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
                  <button className="gold-btn" onClick={()=>setStep(2)}>다음: 파일 업로드 <ArrowRight size={14}/></button>
                </div>}
              </div>

              {/* Step 2 */}
              <div style={{ background:"var(--surface)", borderRadius:14, padding:isMobile?"16px":"22px", border:"1px solid var(--border)", opacity:step>=2?1:0.35, pointerEvents:step>=2?"auto":"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)" }}>② 전시 자산 업로드</h3>
                  <span style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>{files.length}개</span>
                </div>
                <div className={`upload-zone${dragOver?" drag":""}`}
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop} onClick={()=>fileRef.current?.click()}>
                  <input ref={fileRef} type="file" multiple style={{ display:"none" }}/>
                  <div style={{ width:42,height:42,borderRadius:11,background:dragOver?"var(--accent-dim)":"var(--bg-3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px" }}>
                    <Upload size={19} color={dragOver?"var(--accent)":"var(--ink-muted)"} strokeWidth={1.8}/>
                  </div>
                  <div style={{ fontSize:13, fontWeight:550, color:"var(--ink-2)", marginBottom:4 }}>
                    {isMobile ? "탭하여 파일 선택" : "파일을 드래그하거나 클릭하여 업로드"}
                  </div>
                  <div style={{ fontSize:11.5, color:"var(--ink-muted)" }}>PDF, JPG, PNG, MP4 · 최대 50MB</div>
                </div>
                {files.length>0 && (
                  <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:7 }}>
                    {files.map((f,i)=>(
                      <div key={i} className="file-row">
                        <div style={{ width:32,height:32,borderRadius:8,background:f.type === "pdf" ? "var(--bg-3)" : "rgba(123,158,232,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                          {f.type==="pdf"?<File size={15} color="var(--ink-muted)"/>:<ImageIcon size={15} color="#7B9EE8"/>}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12.5, fontWeight:500, color:"var(--ink-2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                          <div style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", marginTop:1 }}>{f.size}</div>
                          {f.status==="uploading" && <div style={{ marginTop:5 }}><div className="progress-bar"><div className="progress-fill" style={{ width:`${f.progress}%` }}/></div></div>}
                        </div>
                        {f.status==="done"?<CheckCircle2 size={15} color="var(--color-success)"/>:<Loader size={15} color="var(--accent)" className="spin"/>}
                        <button onClick={()=>removeFile(i)} style={{ background:"none",border:"none",cursor:"pointer",color:"var(--ink-faint)",padding:4 }}><X size={13}/></button>
                      </div>
                    ))}
                  </div>
                )}
                {step===2 && <div style={{ marginTop:16, display:"flex", justifyContent:"space-between" }}>
                  <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>setStep(1)}>← 이전</button>
                  <button className="gold-btn" onClick={()=>setStep(3)}>다음: AI 분석 <ArrowRight size={14}/></button>
                </div>}
              </div>

              {/* Step 3 */}
              <div style={{ background:"var(--surface)", borderRadius:14, padding:isMobile?"16px":"22px", border:`1px solid ${step>=3?"var(--border-strong)":"var(--border)"}`, opacity:step>=3?1:0.35, pointerEvents:step>=3?"auto":"none" }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"var(--ink)", marginBottom:8 }}>③ AI 분석 시작</h3>
                <p style={{ fontSize:12.5, color:"var(--ink-2)", marginBottom:18, lineHeight:1.65 }}>
                  <strong>IP Asset Analyzer</strong>가 핵심 키워드, 세계관 톤앤매너, 시각적 특징을 추출합니다. 분석 후 Concept Bot이 스핀오프 컨셉 3종을 자동 생성합니다.
                </p>
                {!analyzing && !analyzed && (
                  <div style={{ display:"flex", gap:10 }}>
                    <button className="ghost-btn" style={{ fontSize:12 }} onClick={()=>setStep(2)}>← 이전</button>
                    <button className="gold-btn" onClick={runAnalysis}><Sparkles size={14}/>AI 분석 실행</button>
                  </div>
                )}
                {analyzing && (
                  <div style={{ padding:"24px 0", textAlign:"center" }}>
                    <Loader size={26} color="var(--accent)" className="spin" style={{ margin:"0 auto 14px" }}/>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:"var(--ink)", marginBottom:5 }}>분석 중...</div>
                    <div style={{ fontSize:12, color:"var(--ink-muted)" }}>IP 자산 스캔 → 키워드 추출 → 세계관 분석</div>
                    <div style={{ marginTop:12, display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap" }}>
                      {["기획서 분석 완료","이미지 스캔 중","톤앤매너 추출 중"].map((t,i)=>(
                        <span key={i} style={{ fontSize:11, background:i===0?"var(--color-success-bg)":"var(--accent-dim)", color:i===0?"var(--color-success)":"var(--ink-2)", padding:"3px 9px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {analyzed && (
                  <div className="slide-up" style={{ padding:"16px", background:"var(--bg-2)", borderRadius:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                      <CheckCircle2 size={16} color="var(--color-success)"/>
                      <span style={{ fontWeight:600, fontSize:13.5, color:"var(--ink)" }}>IP 분석 완료 — 3시간 41분 절감</span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
                      {["#몽환적","#빛의굴절","#심해","#고요함","#생명력","#딥블루"].map(k=>(
                        <span key={k} style={{ fontSize:11.5, background:"var(--accent-dim)", color:"var(--ink)", padding:"3px 9px", borderRadius:20, fontFamily:"'DM Mono',monospace" }}>{k}</span>
                      ))}
                    </div>
                    <button className="gold-btn" style={{ width:isMobile?"100%":undefined, justifyContent:isMobile?"center":undefined }}>
                      <Bot size={14}/>Concept Bot으로 이동 <ArrowRight size={14}/>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL — below on mobile/tablet */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

              {/* Mobile: Collapsible checklist */}
              {isMobile ? (
                <div style={{ background:"var(--surface)", borderRadius:14, border:"1px solid var(--border)" }}>
                  <button onClick={()=>setShowChecklist(!showChecklist)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--ink-muted)", letterSpacing:"0.08em" }}>
                    업로드 체크리스트 {showChecklist?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
                  </button>
                  {showChecklist && (
                    <div style={{ padding:"0 16px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                      {CHECKLIST.map((item,i)=>(
                        <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                          <div style={{ width:15,height:15,borderRadius:4,border:`1.5px solid ${i<3?"var(--accent)":"var(--border-mid)"}`,background:i<3?"var(--accent-dim)":"transparent",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center" }}>
                            {i<3&&<div style={{ width:6,height:6,borderRadius:2,background:"var(--accent)" }}/>}
                          </div>
                          <div><div style={{ fontSize:12, color:"var(--ink-2)" }}>{item.label}</div>{!item.required&&<div style={{ fontSize:10.5, color:"var(--ink-muted)" }}>선택사항</div>}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background:"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)" }}>
                  <div style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:12 }}>업로드 체크리스트</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {CHECKLIST.map((item,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                        <div style={{ width:15,height:15,borderRadius:4,border:`1.5px solid ${i<3?"var(--accent)":"var(--border-mid)"}`,background:i<3?"var(--accent-dim)":"transparent",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center" }}>
                          {i<3&&<div style={{ width:6,height:6,borderRadius:2,background:"var(--accent)" }}/>}
                        </div>
                        <div><div style={{ fontSize:12.5, color:"var(--ink-2)" }}>{item.label}</div>{!item.required&&<div style={{ fontSize:11, color:"var(--ink-muted)" }}>선택사항</div>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resource saving */}
              <div style={{ background:"var(--sidebar-bg)", borderRadius:14, padding:"18px 20px", border:"1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:12 }}>기획 리소스 절감</div>
                {[{label:"기존 수동 기획",val:"6일",w:"100%",c:"rgba(255,255,255,0.08)"},{label:"AFTERGLOW AI",val:"4시간 이내",w:"17%",c:"#FFFFFF"}].map((row,i)=>(
                  <div key={i} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:11.5, color:"rgba(255,255,255,0.35)" }}>{row.label}</span>
                      <span style={{ fontSize:11.5, fontWeight:600, color:i===1?"#FFFFFF":"rgba(255,255,255,0.35)", fontFamily:"'DM Mono',monospace" }}>{row.val}</span>
                    </div>
                    <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:99, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:row.w, background:row.c, borderRadius:99 }}/>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:12, padding:"10px 12px", background:"rgba(255,255,255,0.04)", borderRadius:8, fontSize:12, color:"rgba(255,255,255,0.85)", lineHeight:1.5 }}>
                  ↓ <strong>80% 리소스 절감</strong><br/><span style={{ color:"rgba(255,255,255,0.35)" }}>검토·승인만 하세요</span>
                </div>
              </div>

              {/* Prev projects */}
              <div style={{ background:"var(--surface)", borderRadius:14, padding:"18px 20px", border:"1px solid var(--border)" }}>
                <div style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:12 }}>이전 프로젝트</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {PREV.map((p,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--bg-2)", borderRadius:10, cursor:"pointer" }}>
                      <div style={{ width:28,height:28,borderRadius:7,background:"var(--accent-dim)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><File size={13} color="var(--ink)"/></div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12.5, fontWeight:500, color:"var(--ink-2)" }}>{p.name}</div>
                        <div style={{ fontSize:11, color:"var(--ink-muted)", fontFamily:"'DM Mono',monospace" }}>{p.partner} · {p.files}개</div>
                      </div>
                      <ArrowRight size={13} color="var(--ink-faint)"/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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

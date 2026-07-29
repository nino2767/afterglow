import { useState } from "react";
import Dashboard from "./pages/operator/Dashboard.jsx";
import IPUpload   from "./pages/operator/IPUpload.jsx";
import ConceptBot from "./pages/operator/ConceptBot.jsx";
import Monitor    from "./pages/operator/Monitor.jsx";
import Report     from "./pages/operator/Report.jsx";
import Settlement from "./pages/operator/Settlement.jsx";
import ClientMgmt from "./pages/super-admin/ClientManagement.jsx";
import { CLIENTS, defaultSelection, getProject } from "./data/projects.js";

const OPERATOR_PAGES = [
  { id: "dashboard",  label: "대시보드",    component: Dashboard },
  { id: "upload",     label: "IP 업로드",   component: IPUpload },
  { id: "concept",    label: "Concept Bot", component: ConceptBot },
  { id: "monitor",    label: "관람 모니터", component: Monitor },
  { id: "report",     label: "성과 리포트", component: Report },
  { id: "settlement", label: "정산 관리",   component: Settlement },
];

export default function App() {
  const envMode = import.meta.env.VITE_ADMIN_MODE;
  const isLocked = envMode === "operator" || envMode === "super";

  const [mode, setMode] = useState(envMode || "operator");
  const [page, setPage] = useState("dashboard");

  // 전역 전시 선택 상태 (스위처가 바꾸고, 모든 전시-스코프 화면이 읽음)
  const [selection, setSelection] = useState(defaultSelection());
  const project = getProject(selection.clientId, selection.projectId);
  const onSelectProject = (clientId, projectId) => setSelection({ clientId, projectId });

  const scopeProps = {
    setPage, activePage: page,
    clients: CLIENTS,
    clientId: selection.clientId,
    projectId: selection.projectId,
    project,
    mode,
    onSelectProject,
  };

  const CurrentPage = mode === "super"
    ? ClientMgmt
    : (OPERATOR_PAGES.find(p => p.id === page)?.component ?? Dashboard);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {!isLocked && (
        <button
          onClick={() => setMode(mode === "operator" ? "super" : "operator")}
          style={{
            position: "fixed", bottom: "80px", right: "20px", zIndex: 99999,
            fontSize: "11px", padding: "8px 14px", borderRadius: "30px", cursor: "pointer",
            background: "#0D0D0F", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)", fontFamily: "monospace", fontWeight: "bold",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {mode === "operator" ? "DEV: To Super" : "DEV: To Operator"}
        </button>
      )}
      <div>
        <CurrentPage {...scopeProps} />
      </div>
    </div>
  );
}

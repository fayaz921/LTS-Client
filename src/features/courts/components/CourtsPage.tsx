import { useCourt } from "../hooks/UseCourts";
import type { StatusFilter, Toast } from "../hooks/UseCourts";
import CourtList from "./CourtList";
import CourtForm from "./CourtForm";
// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span style={s.modalTitle}>{title}</span>
          <button style={s.iconBtn} onClick={onClose}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconCourt = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <circle cx="7" cy="7" r="1.5" /><circle cx="17" cy="7" r="1.5" />
    <circle cx="7" cy="17" r="1.5" /><circle cx="17" cy="17" r="1.5" />
  </svg>
);

// ─── Filter Tab Button ────────────────────────────────────────────────────────
function FilterTab({
  label,
  count,
  active,
  color,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 14px",
        borderRadius: 8,
        border: active ? `1px solid ${color}44` : "1px solid #1a2235",
        background: active ? `${color}18` : "transparent",
        color: active ? color : "#64748b",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
      }}
    >
      {label}
      <span
        style={{
          background: active ? `${color}30` : "#1e293b",
          color: active ? color : "#475569",
          borderRadius: 20,
          padding: "1px 8px",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CourtPage() {
  const {
    filtered,
    stats,
    loading,
    formLoading,
    selected,
    search,
    setSearch,
    statusFilter,
    changeStatusFilter,
    modal,
    toasts,
    openCreate,
    openEdit,
    openDelete,
    closeModal,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useCourt();

  return (
    <>
      <style>{globalCSS}</style>
      <div style={s.root}>
        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside style={s.sidebar}>
          <div style={s.logo}>
            <div style={s.logoMark}><IconCourt /></div>
            <div>
              <div style={s.logoText}>LTS</div>
              <div style={s.logoSub}>Legal Tracking System</div>
            </div>
          </div>

          <nav style={s.nav}>
            <div style={s.navActive}><IconCourt /><span>Courts</span></div>
          </nav>

          <div style={s.statsPanel}>
            <div style={s.statsPanelTitle}>Overview</div>
            {[
              { label: "Total Courts", val: stats.total, color: "#818cf8" },
              { label: "Active", val: stats.active, color: "#34d399" },
              { label: "Inactive", val: stats.inactive, color: "#fbbf24" },
            ].map((item) => (
              <div key={item.label} style={s.statRow}>
                <span style={s.statLabel}>{item.label}</span>
                <span style={{ ...s.statVal, color: item.color }}>
                  {loading ? "—" : item.val}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <main style={s.main}>
          {/* Header */}
          <header style={s.pageHeader}>
            <div>
              <h1 style={s.pageTitle}>Courts Management</h1>
              <p style={s.pageSub}>Manage all registered courts across the system</p>
            </div>
            <button style={s.addBtn} onClick={openCreate}>
              <IconPlus /> Add Court
            </button>
          </header>

          {/* Stat Cards */}
          <div style={s.cards}>
            {[
              { label: "Total Courts", val: stats.total, accent: "#6366f1" },
              { label: "Active Courts", val: stats.active, accent: "#10b981" },
              { label: "Inactive Courts", val: stats.inactive, accent: "#f59e0b" },
            ].map((c) => (
              <div key={c.label} style={s.card}>
                <div style={{ ...s.cardBar, background: c.accent }} />
                <div style={s.cardVal}>{loading ? "—" : c.val}</div>
                <div style={s.cardLabel}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* ✅ Status Filter Tabs — inactive bhi dikh sakti hain ab */}
          <div style={s.filterRow}>
            <FilterTab
              label="All Courts"
              count={stats.total}
              active={statusFilter === "all"}
              color="#818cf8"
              onClick={() => changeStatusFilter("all" as StatusFilter)}
            />
            <FilterTab
              label="Active"
              count={stats.active}
              active={statusFilter === "active"}
              color="#34d399"
              onClick={() => changeStatusFilter("active" as StatusFilter)}
            />
            <FilterTab
              label="Inactive"
              count={stats.inactive}
              active={statusFilter === "inactive"}
              color="#fbbf24"
              onClick={() => changeStatusFilter("inactive" as StatusFilter)}
            />
          </div>

          {/* Table */}
          <div style={s.tableCard}>
            <CourtList
              courts={filtered}
              loading={loading}
              search={search}
              onSearchChange={setSearch}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>
        </main>

        {/* ── Modals ──────────────────────────────────────────────────────── */}
        <Modal open={modal === "create"} title="Add New Court" onClose={closeModal}>
          <CourtForm
            loading={formLoading}
            onSubmit={handleCreate}
            onCancel={closeModal}
          />
        </Modal>

        <Modal open={modal === "edit"} title="Edit Court" onClose={closeModal}>
          <CourtForm
            initial={selected}
            isEdit
            loading={formLoading}
            onSubmit={handleUpdate}
            onCancel={closeModal}
          />
        </Modal>

        <Modal open={modal === "delete"} title="Deactivate Court" onClose={closeModal}>
          <div style={s.deleteBody}>
            <div style={{ fontSize: 40 }}>⚠️</div>
            <p style={s.deleteMsg}>
              Are you sure you want to deactivate{" "}
              <strong style={{ color: "#f1f5f9" }}>"{selected?.courtName}"</strong>?
              <br />
              <span style={{ fontSize: 12, color: "#475569" }}>
                The court will be marked as inactive. This can be reversed via edit.
              </span>
            </p>
            <div style={s.deleteActions}>
              <button style={s.cancelBtn} onClick={closeModal} disabled={formLoading}>
                Cancel
              </button>
              <button style={s.dangerBtn} onClick={handleDelete} disabled={formLoading}>
                {formLoading ? "Processing..." : "Yes, Deactivate"}
              </button>
            </div>
          </div>
        </Modal>

        {/* ── Toasts ──────────────────────────────────────────────────────── */}
        <div style={s.toastStack}>
          {toasts.map((t: Toast) => (
            <div
              key={t.id}
              style={{ ...s.toast, ...(t.type === "error" ? s.toastErr : s.toastOk) }}
            >
              <span>{t.type === "success" ? "✓" : "✕"}</span>
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080c14; }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadein  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
  input:focus, textarea:focus { border-color: #6366f1 !important; }
  button:disabled { opacity: 0.6; cursor: not-allowed !important; }
`;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  root: { display: "flex", minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0" },

  sidebar: { width: 248, flexShrink: 0, background: "#0c1120", borderRight: "1px solid #1a2235", display: "flex", flexDirection: "column", padding: "28px 18px", gap: 28 },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 },
  logoSub: { fontSize: 10, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase", marginTop: 2 },
  nav: { display: "flex", flexDirection: "column", gap: 4 },
  navActive: { display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderRadius: 8, background: "rgba(99,102,241,0.14)", color: "#818cf8", fontSize: 14, fontWeight: 500, border: "1px solid rgba(99,102,241,0.22)", cursor: "pointer" },
  statsPanel: { marginTop: "auto", background: "#0b1020", border: "1px solid #1a2235", borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", gap: 12 },
  statsPanelTitle: { fontSize: 10, fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 },
  statRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statLabel: { fontSize: 12, color: "#64748b" },
  statVal: { fontSize: 15, fontWeight: 600 },

  main: { flex: 1, display: "flex", flexDirection: "column", gap: 24, padding: "36px 40px", overflowY: "auto", minWidth: 0 },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 },
  pageSub: { fontSize: 13, color: "#64748b", marginTop: 5 },
  addBtn: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#818cf8)", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)", fontFamily: "inherit", flexShrink: 0 },

  cards: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 },
  card: { background: "#0c1120", border: "1px solid #1a2235", borderRadius: 12, padding: "20px 24px", position: "relative", overflow: "hidden", animation: "fadein 0.4s ease" },
  cardBar: { position: "absolute", top: 0, left: 0, width: "100%", height: 3 },
  cardVal: { fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 700, color: "#f1f5f9", lineHeight: 1, marginTop: 6 },
  cardLabel: { fontSize: 11, color: "#64748b", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.07em" },

  // ✅ New filter row
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap" as const },

  tableCard: { background: "#0c1120", border: "1px solid #1a2235", borderRadius: 12, overflow: "hidden" },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
  modal: { background: "#0c1120", border: "1px solid #1e293b", borderRadius: 16, width: "100%", maxWidth: 490, boxShadow: "0 30px 70px rgba(0,0,0,0.6)", animation: "fadein 0.2s ease", overflow: "hidden" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #1e293b" },
  modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#f1f5f9", fontWeight: 600 },
  iconBtn: { background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", padding: 4, borderRadius: 6 },

  deleteBody: { padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" },
  deleteMsg: { color: "#94a3b8", fontSize: 14, lineHeight: 1.75 },
  deleteActions: { display: "flex", gap: 10, marginTop: 4 },
  cancelBtn: { padding: "9px 18px", background: "transparent", border: "1px solid #1e293b", borderRadius: 8, color: "#94a3b8", fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  dangerBtn: { padding: "9px 22px", background: "linear-gradient(135deg,#ef4444,#f87171)", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },

  toastStack: { position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 10, zIndex: 9999 },
  toast: { display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500, minWidth: 230, boxShadow: "0 8px 30px rgba(0,0,0,0.45)", animation: "slideIn 0.3s ease", fontFamily: "inherit" },
  toastOk: { background: "#0b2318", border: "1px solid rgba(16,185,129,0.28)", color: "#34d399" },
  toastErr: { background: "#200d0d", border: "1px solid rgba(239,68,68,0.28)", color: "#f87171" },
};
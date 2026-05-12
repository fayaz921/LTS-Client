import type { CourtDto } from "../types/court.types";

// ─── Icon helpers ──────────────────────────────────────────────────────────────
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Props ─────────────────────────────────────────────────────────────────────
interface CourtListProps {
  courts: CourtDto[];
  loading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onEdit: (court: CourtDto) => void;
  onDelete: (court: CourtDto) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CourtList({
  courts,
  loading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}: CourtListProps) {
  return (
    <div style={s.wrapper}>
      {/* Search bar */}
      <div style={s.searchBar}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          style={s.searchInput}
          placeholder="Search by court name or address..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button style={s.clearBtn} onClick={() => onSearchChange("")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        {loading ? (
          <div style={s.center}>
            <div style={s.spinner} />
            <p style={s.subText}>Loading courts...</p>
          </div>
        ) : courts.length === 0 ? (
          <div style={s.center}>
            <div style={{ fontSize: 44, opacity: 0.25 }}>⚖️</div>
            <p style={s.subText}>
              {search ? "No courts match your search" : "No courts found"}
            </p>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Court Name", "Address / Contact", "Created", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {courts.map((court, i) => (
                <tr key={court.id} style={s.tr}>
                  {/* # */}
                  <td style={{ ...s.td, ...s.tdMuted }}>{i + 1}</td>

                  {/* Name */}
                  <td style={s.td}>
                    <span style={s.courtName}>{court.courtName}</span>
                  </td>

                  {/* Address */}
                  <td style={s.td}>
                    {court.addressContact ? (
                      <div style={s.addressCell}>
                        <IconPin />
                        <span>{court.addressContact}</span>
                      </div>
                    ) : (
                      <span style={s.tdMuted}>—</span>
                    )}
                  </td>

                  {/* Created */}
                  <td style={{ ...s.td, ...s.tdMuted, fontSize: 12 }}>
                    {formatDate(court.createdAt)}
                  </td>

                  {/* Status */}
                  <td style={s.td}>
                    <span
                      style={{
                        ...s.badge,
                        ...(court.isActive ? s.badgeActive : s.badgeInactive),
                      }}
                    >
                      {court.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button
                        style={s.editBtn}
                        onClick={() => onEdit(court)}
                        title="Edit court"
                      >
                        <IconEdit /> Edit
                      </button>
                      <button
                        style={s.deleteBtn}
                        onClick={() => onDelete(court)}
                        title="Deactivate court"
                      >
                        <IconTrash /> Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer count */}
      {!loading && courts.length > 0 && (
        <div style={s.footer}>
          Showing <strong style={{ color: "#818cf8" }}>{courts.length}</strong> court
          {courts.length !== 1 ? "s" : ""}
          {search && " matching your search"}
        </div>
      )}
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  wrapper: { display: "flex", flexDirection: "column", gap: 0 },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    background: "#0b0f1a",
    borderBottom: "1px solid #1e293b",
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e2e8f0",
    fontSize: 14,
    fontFamily: "inherit",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#475569",
    cursor: "pointer",
    display: "flex",
    padding: 2,
  },
  tableWrap: { overflowX: "auto" as const },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: {
    padding: "12px 20px",
    textAlign: "left" as const,
    fontSize: 11,
    color: "#475569",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    background: "#080c14",
    borderBottom: "1px solid #1e293b",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  },
  tr: { borderBottom: "1px solid #111827" },
  td: { padding: "15px 20px", fontSize: 14, color: "#cbd5e1", verticalAlign: "middle" as const },
  tdMuted: { color: "#475569" },
  courtName: { fontWeight: 500, color: "#f1f5f9" },
  addressCell: {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.5,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  badgeActive: {
    background: "rgba(16,185,129,0.1)",
    color: "#34d399",
    border: "1px solid rgba(16,185,129,0.25)",
  },
  badgeInactive: {
    background: "rgba(245,158,11,0.1)",
    color: "#fbbf24",
    border: "1px solid rgba(245,158,11,0.25)",
  },
  actions: { display: "flex", gap: 8, flexWrap: "nowrap" as const },
  editBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 11px",
    background: "rgba(99,102,241,0.1)",
    color: "#818cf8",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  deleteBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 11px",
    background: "rgba(239,68,68,0.08)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.18)",
    borderRadius: 6,
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  },
  center: {
    padding: "60px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  subText: { color: "#475569", fontSize: 14 },
  spinner: {
    width: 30,
    height: 30,
    border: "3px solid #1e293b",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  footer: {
    padding: "11px 20px",
    fontSize: 12,
    color: "#475569",
    borderTop: "1px solid #1e293b",
    background: "#080c14",
  },
};

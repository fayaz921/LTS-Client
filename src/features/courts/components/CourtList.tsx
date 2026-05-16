import { useState } from 'react'
import { useGetCourts, useDeleteCourt } from '../hooks/useCourts'
import type { Court } from '../types/court.types'

interface Props {
    onEdit: (court: Court) => void
    onAdd: () => void
}

type StatusFilter = 'all' | 'active' | 'inactive'

const CourtList = ({ onEdit, onAdd }: Props) => {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

    const isActiveParam =
        statusFilter === 'all' ? undefined : statusFilter === 'active'

    const { data: courts, isLoading, isError } = useGetCourts(isActiveParam)
    const { mutate: deleteCourt, isPending: isDeleting } = useDeleteCourt()

    // ── Client-side search filter ──
    const filtered = (courts ?? []).filter(c =>
        c.courtName.toLowerCase().includes(search.toLowerCase()) ||
        (c.addressContact ?? '').toLowerCase().includes(search.toLowerCase())
    )

    // ── Stats ──
    const allCourts   = courts ?? []
    const totalCount  = allCourts.length
    const activeCount = allCourts.filter(c => c.isActive).length
    const inactiveCount = allCourts.filter(c => !c.isActive).length

    // ── Loading State ──
    if (isLoading) return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', gap: '16px',
        }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '3px solid #F0E8D0',
                borderTop: '3px solid #D4A843',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#8A9BBE', fontSize: '14px', margin: 0 }}>
                Loading courts...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    // ── Error State ──
    if (isError) return (
        <div>
            <PageHeader
                totalCount={totalCount}
                activeCount={activeCount}
                inactiveCount={inactiveCount}
                statusFilter={statusFilter}
                onFilterChange={setStatusFilter}
                search={search}
                onSearchChange={setSearch}
                onAdd={onAdd}
            />
            <div style={{
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF0F0 100%)',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: '12px',
                color: '#DC2626', fontSize: '14px',
            }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                Courts load nahi ho sake. Please refresh karein.
            </div>
        </div>
    )

    return (
        <div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .court-row {
                    animation: fadeInUp 0.3s ease forwards;
                    transition: background 0.15s ease;
                }
                .court-row:hover { background: #F8F6F0 !important; }
                .court-row:hover .court-action-btn {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                .court-action-btn {
                    opacity: 0;
                    transform: translateY(4px);
                    transition: all 0.2s ease;
                }
                .court-edit-btn:hover   { background: #1B2A4A !important; color: #fff !important; }
                .court-del-btn:hover    { background: #DC2626 !important; color: #fff !important; }
                .court-add-btn:hover    { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .court-add-btn:active   { transform: translateY(0); }
                .court-filter-btn:hover { background: #E8EDF5 !important; }
                .court-search:focus     { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; }
            `}</style>

            <PageHeader
                totalCount={totalCount}
                activeCount={activeCount}
                inactiveCount={inactiveCount}
                statusFilter={statusFilter}
                onFilterChange={setStatusFilter}
                search={search}
                onSearchChange={setSearch}
                onAdd={onAdd}
            />

            {/* ── Empty State ── */}
            {filtered.length === 0 ? (
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '80px 0', gap: '16px',
                }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE5D0 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px',
                    }}>⚖️</div>
                    <p style={{ color: '#8A9BBE', fontSize: '15px', margin: 0 }}>
                        {search ? 'Koi court search results mein nahi mili' : 'Koi court nahi mili'}
                    </p>
                    {!search && (
                        <button
                            onClick={onAdd}
                            className="court-add-btn"
                            style={{
                                background: '#D4A843', color: '#1B2A4A', border: 'none',
                                borderRadius: '10px', padding: '10px 24px',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                            }}
                        >
                            + Pehli Court Add Karein
                        </button>
                    )}
                </div>
            ) : (
                /* ── Table ── */
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #EEE9DC',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #243560 100%)' }}>
                                {['#', 'Court Name', 'Address / Contact', 'Status', 'Created', 'Actions'].map((h, i) => (
                                    <th key={i} style={{
                                        padding: i === 0 ? '14px 16px 14px 20px' : '14px 16px',
                                        textAlign: 'left',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '0.08em',
                                        color: '#D4A843',
                                        textTransform: 'uppercase',
                                        whiteSpace: 'nowrap',
                                        borderBottom: '2px solid #D4A843',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((court, index) => (
                                <tr
                                    key={court.id}
                                    className="court-row"
                                    style={{
                                        background: index % 2 === 0 ? '#FDFCF9' : '#fff',
                                        borderBottom: '1px solid #F0EBE0',
                                        animationDelay: `${index * 0.04}s`,
                                    }}
                                >
                                    {/* # */}
                                    <td style={{ padding: '14px 16px 14px 20px' }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #EDE5CF 0%, #E0D4B8 100%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '12px', fontWeight: 700, color: '#8A7040',
                                        }}>
                                            {index + 1}
                                        </div>
                                    </td>

                                    {/* Court Name */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #1B2A4A 0%, #2A3F70 100%)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '16px', flexShrink: 0,
                                            }}>
                                                ⚖️
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1B2A4A' }}>
                                                    {court.courtName}
                                                </p>
                                                <p style={{ margin: 0, fontSize: '11px', color: '#A0ABBE' }}>
                                                    ID: {court.id.toString().slice(0, 8)}...
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Address */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontSize: '13px', color: court.addressContact ? '#4A5568' : '#C0CADB' }}>
                                            {court.addressContact ?? '— Not provided —'}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            padding: '4px 12px', borderRadius: '20px',
                                            fontSize: '12px', fontWeight: 600,
                                            background: court.isActive ? '#F0FDF4' : '#FEF2F2',
                                            color: court.isActive ? '#15803D' : '#DC2626',
                                            border: `1px solid ${court.isActive ? '#BBF7D0' : '#FECACA'}`,
                                        }}>
                                            <span style={{
                                                width: '6px', height: '6px', borderRadius: '50%',
                                                background: court.isActive ? '#22C55E' : '#EF4444',
                                                display: 'inline-block',
                                            }} />
                                            {court.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    {/* Created */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontSize: '13px', color: '#64748B' }}>
                                            {court.createdAt
                                                ? new Date(court.createdAt).toLocaleDateString('en-PK', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                })
                                                : '—'}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                className="court-action-btn court-edit-btn"
                                                onClick={() => onEdit(court)}
                                                style={{
                                                    background: '#EEF2FF', color: '#1B2A4A',
                                                    border: '1px solid #C7D2FE',
                                                    borderRadius: '8px', padding: '6px 14px',
                                                    fontSize: '12px', fontWeight: 600,
                                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                                }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="court-action-btn court-del-btn"
                                                onClick={() => deleteCourt(court.id)}
                                                disabled={isDeleting}
                                                style={{
                                                    background: '#FEF2F2', color: '#DC2626',
                                                    border: '1px solid #FECACA',
                                                    borderRadius: '8px', padding: '6px 14px',
                                                    fontSize: '12px', fontWeight: 600,
                                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                                }}
                                            >
                                                🗑️ Deactivate
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ── Footer ── */}
                    <div style={{
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #FDFCF9 0%, #F8F4EC 100%)',
                        borderTop: '1px solid #EEE9DC',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: '12px', color: '#A0ABBE' }}>
                            Total {filtered.length} court{filtered.length !== 1 ? 's' : ''}
                            {search && ` (filtered)`}
                        </span>
                        <span style={{ fontSize: '12px', color: '#A0ABBE' }}>
                            {activeCount} active · {inactiveCount} inactive
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Page Header — Stats + Search + Filter + Add Button
// ─────────────────────────────────────────────────────────────

interface PageHeaderProps {
    totalCount: number
    activeCount: number
    inactiveCount: number
    statusFilter: StatusFilter
    onFilterChange: (f: StatusFilter) => void
    search: string
    onSearchChange: (v: string) => void
    onAdd: () => void
}

const PageHeader = ({
    totalCount, activeCount, inactiveCount,
    statusFilter, onFilterChange,
    search, onSearchChange,
    onAdd,
}: PageHeaderProps) => (
    <div style={{ marginBottom: '24px' }}>

        {/* ── Title Row ── */}
        <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '20px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1B2A4A 0%, #2A3F70 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                }}>⚖️</div>
                <div>
                    <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>
                        Courts
                    </h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#8A9BBE' }}>
                        {totalCount} court{totalCount !== 1 ? 's' : ''} registered
                    </p>
                </div>
            </div>
            <button
                onClick={onAdd}
                className="court-add-btn"
                style={{
                    background: '#D4A843', color: '#1B2A4A',
                    border: 'none', borderRadius: '10px',
                    padding: '11px 22px', fontSize: '13px',
                    fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(212,168,67,0.3)',
                }}
            >
                <span style={{ fontSize: '16px' }}>+</span> Add Court
            </button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
            {[
                { label: 'Total Courts',    val: totalCount,    color: '#1B2A4A', bg: '#F0EBD8', border: '#D4A843' },
                { label: 'Active Courts',   val: activeCount,   color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
                { label: 'Inactive Courts', val: inactiveCount, color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
            ].map(card => (
                <div key={card.label} style={{
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                    borderRadius: '12px',
                    padding: '16px 18px',
                }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: card.color, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        {card.label}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '28px', fontWeight: 700, color: card.color, lineHeight: 1 }}>
                        {card.val}
                    </p>
                </div>
            ))}
        </div>

        {/* ── Search + Filter Row ── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>

            {/* Search */}
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <span style={{
                    position: 'absolute', left: '12px', top: '50%',
                    transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none',
                }}>🔍</span>
                <input
                    className="court-search"
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Search by court name or address..."
                    style={{
                        width: '100%', padding: '10px 12px 10px 36px',
                        border: '1.5px solid #E2DECE', borderRadius: '10px',
                        fontSize: '13px', color: '#1B2A4A', background: '#FDFCF9',
                        outline: 'none', transition: 'all 0.2s ease',
                        boxSizing: 'border-box', fontFamily: 'inherit',
                    }}
                />
            </div>

            {/* Filter Tabs */}
            {(['all', 'active', 'inactive'] as StatusFilter[]).map(f => {
                const labels: Record<StatusFilter, string> = { all: 'All', active: 'Active', inactive: 'Inactive' }
                const counts: Record<StatusFilter, number> = { all: totalCount, active: activeCount, inactive: inactiveCount }
                const isActive = statusFilter === f
                return (
                    <button
                        key={f}
                        className="court-filter-btn"
                        onClick={() => onFilterChange(f)}
                        style={{
                            padding: '9px 16px', borderRadius: '10px',
                            border: isActive ? '1.5px solid #D4A843' : '1.5px solid #E2DECE',
                            background: isActive ? '#FDF6E3' : '#FDFCF9',
                            color: isActive ? '#8A6020' : '#64748B',
                            fontSize: '13px', fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        {labels[f]}
                        <span style={{
                            background: isActive ? '#D4A843' : '#E2E8F0',
                            color: isActive ? '#1B2A4A' : '#64748B',
                            borderRadius: '20px', padding: '1px 8px',
                            fontSize: '11px', fontWeight: 700,
                        }}>
                            {counts[f]}
                        </span>
                    </button>
                )
            })}
        </div>
    </div>
)

export default CourtList
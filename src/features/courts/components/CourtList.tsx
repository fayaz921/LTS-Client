import { useState } from 'react'
import { useGetCourts, useDeleteCourt } from '../hooks/useCourts'
import type { Court, CourtPageParams } from '../types/court.types'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface Props {
    onEdit: (court: Court) => void
    onAdd:  () => void
}

type StatusFilter = 'all' | 'active' | 'inactive'

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

// ─────────────────────────────────────────────────────────────
// CourtList
// ─────────────────────────────────────────────────────────────

const CourtList = ({ onEdit, onAdd }: Props) => {
    const [pageNumber,    setPageNumber]    = useState(1)
    const [pageSize,      setPageSize]      = useState(10)
    const [statusFilter,  setStatusFilter]  = useState<StatusFilter>('all')
    const [search,        setSearch]        = useState('')

    const isActiveParam: boolean | undefined =
        statusFilter === 'all' ? undefined : statusFilter === 'active'

    const params: CourtPageParams = { pageNumber, pageSize, isActive: isActiveParam }

    const { data, isLoading, isFetching, isError } = useGetCourts(params)
    const { mutate: deleteCourt, isPending: isDeleting } = useDeleteCourt()

    // Client-side search (within current page)
    const filtered = (data?.items ?? []).filter(c =>
        c.courtName.toLowerCase().includes(search.toLowerCase()) ||
        (c.addressContact ?? '').toLowerCase().includes(search.toLowerCase())
    )

    const totalCount   = data?.totalCount  ?? 0
    const totalPages   = data?.totalPages  ?? 1
    const hasPrevious  = data?.hasPrevious ?? false
    const hasNext      = data?.hasNext     ?? false

    // Reset to page 1 on filter change
    const handleFilterChange = (f: StatusFilter) => {
        setStatusFilter(f)
        setPageNumber(1)
    }

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setPageNumber(1)
    }

    // ── Loading ───────────────────────────────────────────────
    if (isLoading) return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', gap: '16px',
        }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '3px solid #F0E8D0', borderTop: '3px solid #D4A843',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#8A9BBE', fontSize: '14px', margin: 0 }}>
                Loading courts...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    // ── Error ─────────────────────────────────────────────────
    if (isError) return (
        <div>
            <PageHeader
                totalCount={0} activeCount={0} inactiveCount={0}
                statusFilter={statusFilter} onFilterChange={handleFilterChange}
                search={search} onSearchChange={setSearch} onAdd={onAdd}
            />
            <div style={{
                background: 'linear-gradient(135deg,#FFF5F5 0%,#FFF0F0 100%)',
                border: '1px solid #FECACA', borderRadius: '12px',
                padding: '20px 24px', display: 'flex',
                alignItems: 'center', gap: '12px',
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
                .court-row { animation: fadeInUp 0.3s ease forwards; transition: background 0.15s ease; }
                .court-row:hover { background: #F8F6F0 !important; }
                .court-row:hover .court-action-btn { opacity: 1 !important; transform: translateY(0) !important; }
                .court-action-btn { opacity: 0; transform: translateY(4px); transition: all 0.2s ease; }
                .court-edit-btn:hover { background: #1B2A4A !important; color: #fff !important; }
                .court-del-btn:hover  { background: #DC2626 !important; color: #fff !important; }
                .court-add-btn:hover  { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .court-search:focus   { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; }
                .page-btn:hover:not(:disabled) { background: #1B2A4A !important; color: #fff !important; border-color: #1B2A4A !important; }
                .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .page-num-btn:hover { background: #FDF6E3 !important; border-color: #D4A843 !important; color: #8A6020 !important; }
                .page-num-btn.active-page { background: #D4A843 !important; color: #1B2A4A !important; border-color: #D4A843 !important; font-weight: 700 !important; }
                .size-select:focus { border-color: #D4A843 !important; outline: none; }
                .fetching-bar {
                    position: absolute; top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #D4A843, #E8C05A, #D4A843);
                    background-size: 200% 100%;
                    animation: shimmer 1.2s infinite;
                }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            <PageHeader
                totalCount={totalCount}
                activeCount={0}
                inactiveCount={0}
                statusFilter={statusFilter}
                onFilterChange={handleFilterChange}
                search={search}
                onSearchChange={setSearch}
                onAdd={onAdd}
            />

            {/* ── Table Card ── */}
            <div style={{
                background: '#fff', borderRadius: '16px',
                border: '1px solid #EEE9DC', overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                position: 'relative',
            }}>
                {/* Fetching indicator bar */}
                {isFetching && !isLoading && (
                    <div className="fetching-bar" />
                )}

                {filtered.length === 0 ? (
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '80px 0', gap: '16px',
                    }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '20px',
                            background: 'linear-gradient(135deg,#F5F0E8 0%,#EDE5D0 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '32px',
                        }}>⚖️</div>
                        <p style={{ color: '#8A9BBE', fontSize: '15px', margin: 0 }}>
                            {search ? 'No court found in search results' : 'No court found'}
                        </p>
                        {!search && (
                            <button onClick={onAdd} className="court-add-btn" style={{
                                background: '#D4A843', color: '#1B2A4A', border: 'none',
                                borderRadius: '10px', padding: '10px 24px',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                            }}>
                                + Add the first court
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)' }}>
                                        {['#', 'Court Name', 'Address / Contact', 'Status', 'Created', 'Actions'].map((h, i) => (
                                            <th key={i} style={{
                                                padding: i === 0 ? '14px 16px 14px 20px' : '14px 16px',
                                                textAlign: 'left', fontSize: '11px', fontWeight: 700,
                                                letterSpacing: '0.08em', color: '#D4A843',
                                                textTransform: 'uppercase', whiteSpace: 'nowrap',
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
                                            {/* # — absolute number */}
                                            <td style={{ padding: '14px 16px 14px 20px' }}>
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: '8px',
                                                    background: 'linear-gradient(135deg,#EDE5CF 0%,#E0D4B8 100%)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '12px', fontWeight: 700, color: '#8A7040',
                                                }}>
                                                    {(pageNumber - 1) * pageSize + index + 1}
                                                </div>
                                            </td>

                                            {/* Court Name */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '10px',
                                                        background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '16px', flexShrink: 0,
                                                    }}>⚖️</div>
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
                                                    color:      court.isActive ? '#15803D' : '#DC2626',
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
                                                            border: '1px solid #C7D2FE', borderRadius: '8px',
                                                            padding: '6px 14px', fontSize: '12px',
                                                            fontWeight: 600, cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
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
                                                            border: '1px solid #FECACA', borderRadius: '8px',
                                                            padding: '6px 14px', fontSize: '12px',
                                                            fontWeight: 600, cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
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
                        </div>

                        {/* ── Pagination Footer ── */}
                        <div style={{
                            padding: '14px 20px',
                            background: 'linear-gradient(135deg,#FDFCF9 0%,#F8F4EC 100%)',
                            borderTop: '1px solid #EEE9DC',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                        }}>
                            {/* Left: info + page size selector */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '12px', color: '#64748B' }}>
                                    Showing{' '}
                                    <strong style={{ color: '#1B2A4A' }}>
                                        {(pageNumber - 1) * pageSize + 1}
                                    </strong>
                                    {' '}–{' '}
                                    <strong style={{ color: '#1B2A4A' }}>
                                        {Math.min(pageNumber * pageSize, totalCount)}
                                    </strong>
                                    {' '}of{' '}
                                    <strong style={{ color: '#D4A843' }}>{totalCount}</strong>
                                    {' '}courts
                                </span>

                                {/* Page size dropdown */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '11px', color: '#A0ABBE' }}>Per page:</span>
                                    <select
                                        className="size-select"
                                        value={pageSize}
                                        onChange={e => handlePageSizeChange(Number(e.target.value))}
                                        style={{
                                            padding: '4px 8px', border: '1.5px solid #E2DECE',
                                            borderRadius: '7px', fontSize: '12px', color: '#1B2A4A',
                                            background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                                        }}
                                    >
                                        {PAGE_SIZE_OPTIONS.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Right: page buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

                                {/* Previous */}
                                <button
                                    className="page-btn"
                                    onClick={() => setPageNumber(p => p - 1)}
                                    disabled={!hasPrevious || isFetching}
                                    style={{
                                        padding: '6px 14px', border: '1.5px solid #E2DECE',
                                        borderRadius: '8px', background: '#fff',
                                        color: '#1B2A4A', fontSize: '12px', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                    }}
                                >
                                    ← Prev
                                </button>

                                {/* Page numbers */}
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {getPageNumbers(pageNumber, totalPages).map((p, i) =>
                                        p === '...' ? (
                                            <span key={`ellipsis-${i}`} style={{
                                                padding: '6px 4px', fontSize: '12px', color: '#A0ABBE',
                                            }}>…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                className={`page-num-btn ${pageNumber === p ? 'active-page' : ''}`}
                                                onClick={() => setPageNumber(Number(p))}
                                                disabled={isFetching}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    border: '1.5px solid #E2DECE',
                                                    borderRadius: '8px',
                                                    background: pageNumber === p ? '#D4A843' : '#fff',
                                                    color: pageNumber === p ? '#1B2A4A' : '#64748B',
                                                    fontSize: '12px', fontWeight: pageNumber === p ? 700 : 400,
                                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                </div>

                                {/* Next */}
                                <button
                                    className="page-btn"
                                    onClick={() => setPageNumber(p => p + 1)}
                                    disabled={!hasNext || isFetching}
                                    style={{
                                        padding: '6px 14px', border: '1.5px solid #E2DECE',
                                        borderRadius: '8px', background: '#fff',
                                        color: '#1B2A4A', fontSize: '12px', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.2s ease',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                    }}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// Page Number Generator — shows ellipsis for large ranges
// e.g. [1, 2, '...', 8, 9, 10] or [1, '...', 4, 5, 6, '...', 10]
// ─────────────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): (number | string)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const pages: (number | string)[] = []

    if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }

    return pages
}

// ─────────────────────────────────────────────────────────────
// Page Header
// ─────────────────────────────────────────────────────────────

interface PageHeaderProps {
    totalCount:     number
    activeCount:    number
    inactiveCount:  number
    statusFilter:   StatusFilter
    onFilterChange: (f: StatusFilter) => void
    search:         string
    onSearchChange: (v: string) => void
    onAdd:          () => void
}

const PageHeader = ({
    totalCount, statusFilter, onFilterChange,
    search, onSearchChange, onAdd,
}: PageHeaderProps) => (
    <div style={{ marginBottom: '24px' }}>

        {/* Title Row */}
        <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '20px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
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
                    background: '#D4A843', color: '#1B2A4A', border: 'none',
                    borderRadius: '10px', padding: '11px 22px', fontSize: '13px',
                    fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(212,168,67,0.3)',
                }}
            >
                <span style={{ fontSize: '16px' }}>+</span> Add Court
            </button>
        </div>

        {/* Search + Filter Row */}
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
                    placeholder="Search courts on current page..."
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
                const labels: Record<StatusFilter, string> = {
                    all: 'All', active: 'Active', inactive: 'Inactive',
                }
                const isActive = statusFilter === f
                return (
                    <button
                        key={f}
                        onClick={() => onFilterChange(f)}
                        style={{
                            padding: '9px 18px', borderRadius: '10px',
                            border: isActive ? '1.5px solid #D4A843' : '1.5px solid #E2DECE',
                            background: isActive ? '#FDF6E3' : '#FDFCF9',
                            color: isActive ? '#8A6020' : '#64748B',
                            fontSize: '13px', fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            fontFamily: 'inherit',
                        }}
                    >
                        {labels[f]}
                    </button>
                )
            })}
        </div>
    </div>
)

export default CourtList
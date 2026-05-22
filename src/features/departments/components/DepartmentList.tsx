import { useState } from 'react'
import { useGetDepartments, useDeleteDepartment } from '../hooks/useDepartments'
import type { Department, DepartmentPageParams } from '../types/department.types'

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface Props {
    onEdit: (dep: Department) => void
    onAdd:  () => void
}

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

// ─────────────────────────────────────────────────────────────
// Page Number Generator — ellipsis ke saath
// ─────────────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): (number | string)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | string)[] = []
    if (current <= 4)            pages.push(1, 2, 3, 4, 5, '...', total)
    else if (current >= total-3) pages.push(1, '...', total-4, total-3, total-2, total-1, total)
    else                         pages.push(1, '...', current-1, current, current+1, '...', total)
    return pages
}

// ─────────────────────────────────────────────────────────────
// DepartmentList
// ─────────────────────────────────────────────────────────────

const DepartmentList = ({ onEdit, onAdd }: Props) => {
    const [pageNumber,   setPageNumber]   = useState(1)
    const [pageSize,     setPageSize]     = useState(10)
    const [search,       setSearch]       = useState('')

    const params: DepartmentPageParams = { pageNumber, pageSize }

    const { data, isLoading, isFetching, isError } = useGetDepartments(params)
    const { mutate: deleteDep, isPending: isDeleting } = useDeleteDepartment()

    // Client-side search within current page
    const filtered = (data?.items ?? []).filter(d =>
        d.departmentName.toLowerCase().includes(search.toLowerCase()) ||
        (d.addressContact ?? '').toLowerCase().includes(search.toLowerCase())
    )

    const totalCount  = data?.totalCount  ?? 0
    const totalPages  = data?.totalPages  ?? 1
    const hasPrevious = data?.hasPrevious ?? false
    const hasNext     = data?.hasNext     ?? false

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
                border: '3px solid #F0E8D0',
                borderTop: '3px solid #D4A843',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#8A9BBE', fontSize: '14px', margin: 0 }}>
                Loading departments...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    // ── Error ─────────────────────────────────────────────────
    if (isError) return (
        <div>
            <PageHeader
                totalCount={0}
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
                Departments load nahi ho sake. Please refresh karein.
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
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .dep-row { animation: fadeInUp 0.3s ease forwards; transition: background 0.15s ease; }
                .dep-row:hover { background: #F8F6F0 !important; }
                .dep-row:hover .action-btn { opacity: 1 !important; transform: translateY(0) !important; }
                .action-btn { opacity: 0; transform: translateY(4px); transition: all 0.2s ease; }
                .edit-btn:hover { background: #1B2A4A !important; color: #fff !important; }
                .del-btn:hover  { background: #DC2626 !important; color: #fff !important; }
                .add-btn:hover  { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .add-btn:active { transform: translateY(0); }
                .dep-search:focus { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; }
                .pg-btn:hover:not(:disabled) { background: #1B2A4A !important; color: #fff !important; border-color: #1B2A4A !important; }
                .pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .pg-num:hover { background: #FDF6E3 !important; border-color: #D4A843 !important; color: #8A6020 !important; }
                .pg-num.active { background: #D4A843 !important; color: #1B2A4A !important; border-color: #D4A843 !important; font-weight: 700 !important; }
                .sz-sel:focus { border-color: #D4A843 !important; outline: none; }
                .fetching-bar {
                    position: absolute; top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #D4A843, #E8C05A, #D4A843);
                    background-size: 200% 100%;
                    animation: shimmer 1.2s infinite;
                }
            `}</style>

            <PageHeader
                totalCount={totalCount}
                search={search}
                onSearchChange={setSearch}
                onAdd={onAdd}
            />

            {/* ── Table Card ── */}
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #EEE9DC',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                position: 'relative',
            }}>
                {/* Fetching shimmer bar */}
                {isFetching && !isLoading && <div className="fetching-bar" />}

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
                        }}>🏢</div>
                        <p style={{ color: '#8A9BBE', fontSize: '15px', margin: 0 }}>
                            {search ? 'Koi department search mein nahi mila' : 'Koi department nahi mila'}
                        </p>
                        {!search && (
                            <button onClick={onAdd} className="add-btn" style={{
                                background: '#D4A843', color: '#1B2A4A', border: 'none',
                                borderRadius: '10px', padding: '10px 24px',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                            }}>
                                + Pehla Department Add Karein
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* ── Table ── */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg, #1B2A4A 0%, #243560 100%)' }}>
                                        {['#', 'Department Name', 'Address / Contact', 'Status', 'Created', 'Actions'].map((h, i) => (
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
                                    {filtered.map((dep, index) => (
                                        <tr
                                            key={dep.id}
                                            className="dep-row"
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
                                                    {(pageNumber - 1) * pageSize + index + 1}
                                                </div>
                                            </td>

                                            {/* Department Name */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, #1B2A4A 0%, #2A3F70 100%)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '16px', flexShrink: 0,
                                                    }}>🏢</div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1B2A4A' }}>
                                                            {dep.departmentName}
                                                        </p>
                                                        <p style={{ margin: 0, fontSize: '11px', color: '#A0ABBE' }}>
                                                            ID: {dep.id.toString().slice(0, 8)}...
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Address */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontSize: '13px', color: dep.addressContact ? '#4A5568' : '#C0CADB' }}>
                                                    {dep.addressContact ?? '— Not provided —'}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                    padding: '4px 12px', borderRadius: '20px',
                                                    fontSize: '12px', fontWeight: 600,
                                                    background: dep.isActive ? '#F0FDF4' : '#FEF2F2',
                                                    color:      dep.isActive ? '#15803D' : '#DC2626',
                                                    border: `1px solid ${dep.isActive ? '#BBF7D0' : '#FECACA'}`,
                                                }}>
                                                    <span style={{
                                                        width: '6px', height: '6px', borderRadius: '50%',
                                                        background: dep.isActive ? '#22C55E' : '#EF4444',
                                                        display: 'inline-block',
                                                    }} />
                                                    {dep.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Created */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontSize: '13px', color: '#64748B' }}>
                                                    {dep.createdAt
                                                        ? new Date(dep.createdAt).toLocaleDateString('en-PK', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                        })
                                                        : '—'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button
                                                        className="action-btn edit-btn"
                                                        onClick={() => onEdit(dep)}
                                                        style={{
                                                            background: '#EEF2FF', color: '#1B2A4A',
                                                            border: '1px solid #C7D2FE', borderRadius: '8px',
                                                            padding: '6px 14px', fontSize: '12px',
                                                            fontWeight: 600, cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="action-btn del-btn"
                                                        onClick={() => deleteDep(dep.id)}
                                                        disabled={isDeleting}
                                                        style={{
                                                            background: '#FEF2F2', color: '#DC2626',
                                                            border: '1px solid #FECACA', borderRadius: '8px',
                                                            padding: '6px 14px', fontSize: '12px',
                                                            fontWeight: 600, cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        🗑️
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
                            background: 'linear-gradient(135deg, #FDFCF9 0%, #F8F4EC 100%)',
                            borderTop: '1px solid #EEE9DC',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap', gap: '12px',
                        }}>
                            {/* Left — count + per page selector */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
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
                                    {' '}departments
                                </span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '11px', color: '#A0ABBE' }}>Per page:</span>
                                    <select
                                        className="sz-sel"
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

                            {/* Right — page buttons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

                                {/* Prev */}
                                <button
                                    className="pg-btn"
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
                                            <span key={`e${i}`} style={{
                                                padding: '6px 4px', fontSize: '12px', color: '#A0ABBE',
                                            }}>…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                className={`pg-num ${pageNumber === p ? 'active' : ''}`}
                                                onClick={() => setPageNumber(Number(p))}
                                                disabled={isFetching}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    border: '1.5px solid #E2DECE',
                                                    borderRadius: '8px',
                                                    background: pageNumber === p ? '#D4A843' : '#fff',
                                                    color: pageNumber === p ? '#1B2A4A' : '#64748B',
                                                    fontSize: '12px',
                                                    fontWeight: pageNumber === p ? 700 : 400,
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
                                    className="pg-btn"
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
// Page Header — Title + Search + Add Button
// ─────────────────────────────────────────────────────────────

interface PageHeaderProps {
    totalCount:     number
    search:         string
    onSearchChange: (v: string) => void
    onAdd:          () => void
}

const PageHeader = ({ totalCount, search, onSearchChange, onAdd }: PageHeaderProps) => (
    <div style={{ marginBottom: '24px' }}>

        {/* Title Row */}
        <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px',
            gap: '12px', flexWrap: 'wrap',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1B2A4A 0%, #2A3F70 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                }}>🏢</div>
                <div>
                    <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>
                        Departments
                    </h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#8A9BBE' }}>
                        {totalCount} department{totalCount !== 1 ? 's' : ''} registered
                    </p>
                </div>
            </div>
            <button
                onClick={onAdd}
                className="add-btn"
                style={{
                    background: '#D4A843', color: '#1B2A4A', border: 'none',
                    borderRadius: '10px', padding: '11px 22px', fontSize: '13px',
                    fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(212,168,67,0.3)',
                    flexShrink: 0,
                }}
            >
                <span style={{ fontSize: '16px' }}>+</span> Add Department
            </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
            <span style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none',
            }}>🔍</span>
            <input
                className="dep-search"
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search by department name or address..."
                style={{
                    width: '100%', padding: '10px 12px 10px 36px',
                    border: '1.5px solid #E2DECE', borderRadius: '10px',
                    fontSize: '13px', color: '#1B2A4A', background: '#FDFCF9',
                    outline: 'none', transition: 'all 0.2s ease',
                    boxSizing: 'border-box', fontFamily: 'inherit',
                }}
            />
        </div>
    </div>
)

export default DepartmentList
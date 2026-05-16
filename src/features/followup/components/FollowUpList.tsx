// components/FollowUpList.tsx

import { useState, useEffect } from 'react'
import { useGetFollowUps, useDeleteFollowUp } from '../hooks/useFollowups'
import type { FollowUp, FollowUpPageParams } from '../types/followup.types'

interface Props {
    onEdit: (followup: FollowUp) => void
    onAdd: () => void
    caseId?: string  // Optional: filter by case
}

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

const FollowUpList = ({ onEdit, onAdd, caseId }: Props) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')

    const params: FollowUpPageParams = { pageNumber, pageSize, caseId }

    const { data, isLoading, isFetching, isError, error, refetch } = useGetFollowUps(params)
    const { mutate: deleteFollowUp, isPending: isDeleting } = useDeleteFollowUp()

    useEffect(() => {
        refetch()
    }, [caseId, refetch])

    // Client-side filtering
    const filtered = (data?.items ?? []).filter(f =>
        f.caseId.toLowerCase().includes(search.toLowerCase()) ||
        (f.interimOrder ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (f.decision ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (f.remarks ?? '').toLowerCase().includes(search.toLowerCase())
    )

    const totalCount = data?.totalCount ?? 0
    const totalPages = data?.totalPages ?? 1
    const hasPrevious = data?.hasPrevious ?? false
    const hasNext = data?.hasNext ?? false

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setPageNumber(1)
    }

    const getStatusColor = (hearingDate: string, nextHearingDate?: string | null) => {
        const today = new Date()
        const hearing = new Date(hearingDate)
        
        if (hearing < today) {
            return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', text: 'Past' }
        }
        if (nextHearingDate) {
            return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A', text: 'Adjourned' }
        }
        return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', text: 'Scheduled' }
    }

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
                Loading follow-ups...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    if (isError) {
        const errorMsg = (error as any)?.response?.data?.message || 'Follow-ups load nahi ho sake. Please refresh karein.'
        return (
            <div>
                <PageHeader
                    totalCount={0}
                    search={search}
                    onSearchChange={setSearch}
                    onAdd={onAdd}
                    caseId={caseId}
                />
                <div style={{
                    background: 'linear-gradient(135deg,#FFF5F5 0%,#FFF0F0 100%)',
                    border: '1px solid #FECACA', borderRadius: '12px',
                    padding: '20px 24px',
                    marginBottom: '20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '20px' }}>⚠️</span>
                        <span style={{ color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>
                            {errorMsg}
                        </span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        style={{
                            background: '#D4A843',
                            color: '#1B2A4A',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '8px',
                        }}
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .followup-row { animation: fadeInUp 0.3s ease forwards; transition: background 0.15s ease; }
                .followup-row:hover { background: #F8F6F0 !important; }
                .followup-row:hover .followup-action-btn { opacity: 1 !important; transform: translateY(0) !important; }
                .followup-action-btn { opacity: 0; transform: translateY(4px); transition: all 0.2s ease; }
                .followup-edit-btn:hover { background: #1B2A4A !important; color: #fff !important; }
                .followup-del-btn:hover  { background: #DC2626 !important; color: #fff !important; }
                .followup-add-btn:hover  { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .followup-search:focus   { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; }
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
                .status-badge {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 4px 12px; border-radius: 20px;
                    font-size: 12px; font-weight: 600;
                }
            `}</style>

            <PageHeader
                totalCount={totalCount}
                search={search}
                onSearchChange={setSearch}
                onAdd={onAdd}
                caseId={caseId}
            />

            <div style={{
                background: '#fff', borderRadius: '16px',
                border: '1px solid #EEE9DC', overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                position: 'relative',
            }}>
                {isFetching && !isLoading && <div className="fetching-bar" />}

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
                            {search ? 'No follow-up found in search results' : 'No follow-up found'}
                        </p>
                        {!search && (
                            <button onClick={onAdd} className="followup-add-btn" style={{
                                background: '#D4A843', color: '#1B2A4A', border: 'none',
                                borderRadius: '10px', padding: '10px 24px',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                            }}>
                                + Add first follow-up
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)' }}>
                                        {['#', 'Case ID', 'Hearing Date', 'Next Hearing', 'Interim Order', 'Decision', 'Actions'].map((h, i) => (
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
                                    {filtered.map((followup, index) => {
                                        const status = getStatusColor(followup.hearingDate, followup.nextHearingDate)
                                        return (
                                            <tr
                                                key={followup.id}
                                                className="followup-row"
                                                style={{
                                                    background: index % 2 === 0 ? '#FDFCF9' : '#fff',
                                                    borderBottom: '1px solid #F0EBE0',
                                                    animationDelay: `${index * 0.04}s`,
                                                }}
                                            >
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
                                                <td style={{ padding: '14px 16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            width: '36px', height: '36px', borderRadius: '10px',
                                                            background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '16px', flexShrink: 0,
                                                        }}>📋</div>
                                                        <div>
                                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                                                                {followup.caseId.toString().slice(0, 8)}...
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span className="status-badge" style={{
                                                        background: status.bg,
                                                        color: status.color,
                                                        border: `1px solid ${status.border}`,
                                                    }}>
                                                        {new Date(followup.hearingDate).toLocaleDateString('en-PK')}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{ fontSize: '13px', color: followup.nextHearingDate ? '#64748B' : '#C0CADB' }}>
                                                        {followup.nextHearingDate
                                                            ? new Date(followup.nextHearingDate).toLocaleDateString('en-PK')
                                                            : '— Not set —'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{ fontSize: '12px', color: followup.interimOrder ? '#4A5568' : '#C0CADB' }}>
                                                        {followup.interimOrder?.slice(0, 40) ?? '—'}
                                                        {followup.interimOrder && followup.interimOrder.length > 40 ? '...' : ''}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{ fontSize: '12px', color: followup.decision ? '#4A5568' : '#C0CADB' }}>
                                                        {followup.decision?.slice(0, 40) ?? '—'}
                                                        {followup.decision && followup.decision.length > 40 ? '...' : ''}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button
                                                            className="followup-action-btn followup-edit-btn"
                                                            onClick={() => onEdit(followup)}
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
                                                            className="followup-action-btn followup-del-btn"
                                                            onClick={() => deleteFollowUp(followup.id)}
                                                            disabled={isDeleting}
                                                            style={{
                                                                background: '#FEF2F2', color: '#DC2626',
                                                                border: '1px solid #FECACA', borderRadius: '8px',
                                                                padding: '6px 14px', fontSize: '12px',
                                                                fontWeight: 600, cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                            }}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div style={{
                            padding: '14px 20px',
                            background: 'linear-gradient(135deg,#FDFCF9 0%,#F8F4EC 100%)',
                            borderTop: '1px solid #EEE9DC',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                        }}>
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
                                    {' '}follow-ups
                                </span>

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

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

interface PageHeaderProps {
    totalCount: number
    search: string
    onSearchChange: (v: string) => void
    onAdd: () => void
    caseId?: string
}

const PageHeader = ({
    totalCount, search, onSearchChange, onAdd, caseId
}: PageHeaderProps) => (
    <div style={{ marginBottom: '24px' }}>
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
                        Follow-Ups {caseId && `- Case ${caseId.slice(0, 8)}...`}
                    </h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#8A9BBE' }}>
                        {totalCount} follow-up{totalCount !== 1 ? 's' : ''} recorded
                    </p>
                </div>
            </div>
            <button
                onClick={onAdd}
                className="followup-add-btn"
                style={{
                    background: '#D4A843', color: '#1B2A4A', border: 'none',
                    borderRadius: '10px', padding: '11px 22px', fontSize: '13px',
                    fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(212,168,67,0.3)',
                }}
            >
                <span style={{ fontSize: '16px' }}>+</span> Add FollowUp
            </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <span style={{
                    position: 'absolute', left: '12px', top: '50%',
                    transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none',
                }}>🔍</span>
                <input
                    className="followup-search"
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Search by case ID, interim order, decision..."
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
    </div>
)

export default FollowUpList
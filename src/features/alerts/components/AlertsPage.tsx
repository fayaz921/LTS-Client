import { useState } from 'react'
import { useGetUpcomingHearings, useSendAlert } from '../hooks/useAlerts'

// ─────────────────────────────────────────────────────────────
// AlertsPage — Upcoming Hearings & Send Alerts
// Design matches Courts / Departments / Follow-ups pattern
// ─────────────────────────────────────────────────────────────

const AlertsPage = () => {
    const { data: hearings, isLoading, isError, error } = useGetUpcomingHearings()
    const { mutate: sendAlert, isPending, isSuccess, isError: isSendError, error: sendError } = useSendAlert()
    const [sentCaseId, setSentCaseId] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    // Client-side search filtering
    const filtered = (hearings ?? []).filter(h =>
        h.caseNo.toLowerCase().includes(search.toLowerCase()) ||
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        (h.emailList ?? '').toLowerCase().includes(search.toLowerCase())
    )

    // Days until hearing helper
    const getDaysUntil = (dateStr: string) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const hearing = new Date(dateStr)
        hearing.setHours(0, 0, 0, 0)
        const diff = Math.ceil((hearing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diff
    }

    const getUrgencyStyle = (dateStr: string) => {
        const days = getDaysUntil(dateStr)
        if (days <= 0) return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', text: 'Today' }
        if (days === 1) return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A', text: 'Tomorrow' }
        if (days <= 3) return { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA', text: `${days} days` }
        return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', text: `${days} days` }
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
                Loading upcoming hearings...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )

    return (
        <div style={{
            padding: '32px',
            minHeight: '100vh',
            background: '#ffffff',
        }}>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .alert-row { animation: fadeInUp 0.3s ease forwards; transition: background 0.15s ease; }
                .alert-row:hover { background: #F8F6F0 !important; }
                .alert-row:hover .alert-action-btn { opacity: 1 !important; transform: translateY(0) !important; }
                .alert-action-btn { opacity: 0; transform: translateY(4px); transition: all 0.2s ease; }
                .alert-send-btn { transition: all 0.2s ease; }
                .alert-send-btn:hover:not(:disabled) { background: #C49830 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.35) !important; }
                .alert-search:focus { border-color: #D4A843 !important; box-shadow: 0 0 0 3px rgba(212,168,67,0.1) !important; }
                .alert-toast {
                    animation: fadeInUp 0.3s ease forwards;
                    display: flex; align-items: center; gap: 10px;
                    padding: 14px 20px; border-radius: 12px;
                    font-size: 13px; font-weight: 600; margin-bottom: 16px;
                }
            `}</style>

            {/* ── Page Header ── */}
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
                        }}>🔔</div>
                        <div>
                            <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>
                                Upcoming Hearings
                            </h5>
                            <p style={{ margin: 0, fontSize: '13px', color: '#8A9BBE' }}>
                                {hearings?.length ?? 0} hearing{(hearings?.length ?? 0) !== 1 ? 's' : ''} in the next 3 days
                            </p>
                        </div>
                    </div>

                    {!isError && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: '20px',
                            fontSize: '12px', fontWeight: 700,
                            background: (hearings?.length ?? 0) > 0 ? '#FEF2F2' : '#F0FDF4',
                            color: (hearings?.length ?? 0) > 0 ? '#DC2626' : '#15803D',
                            border: `1px solid ${(hearings?.length ?? 0) > 0 ? '#FECACA' : '#BBF7D0'}`,
                        }}>
                            <span style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: (hearings?.length ?? 0) > 0 ? '#EF4444' : '#22C55E',
                                display: 'inline-block',
                                animation: (hearings?.length ?? 0) > 0 ? 'pulse 2s infinite' : 'none',
                            }} />
                            {hearings?.length ?? 0} Upcoming
                        </span>
                    )}
                </div>

                {/* ── Search ── */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <span style={{
                            position: 'absolute', left: '12px', top: '50%',
                            transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none',
                        }}>🔍</span>
                        <input
                            className="alert-search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by case no, title, or email..."
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

            {/* ── Toast Messages ── */}
            {isSuccess && (
                <div className="alert-toast" style={{
                    background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                    border: '1px solid #BBF7D0', color: '#15803D',
                }}>
                    <span style={{ fontSize: '18px' }}>✅</span>
                    Alert sent successfully!
                </div>
            )}

            {isSendError && (
                <div className="alert-toast" style={{
                    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFF0F0 100%)',
                    border: '1px solid #FECACA', color: '#DC2626',
                }}>
                    <span style={{ fontSize: '18px' }}>⚠️</span>
                    {(sendError as Error)?.message || 'Alert could not be sent. Please try again.'}
                </div>
            )}

            {/* ── Error State ── */}
            {isError && (
                <div style={{
                    background: 'linear-gradient(135deg,#FFF5F5 0%,#FFF0F0 100%)',
                    border: '1px solid #FECACA', borderRadius: '12px',
                    padding: '20px 24px', display: 'flex',
                    alignItems: 'center', gap: '12px',
                    color: '#DC2626', fontSize: '14px',
                }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    {(error as Error)?.message || 'Hearings could not be loaded. Please refresh.'}
                </div>
            )}

            {/* ── Table Card ── */}
            {!isError && (
                <div style={{
                    background: '#fff', borderRadius: '16px',
                    border: '1px solid #EEE9DC', overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                    position: 'relative',
                }}>
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
                            }}>📅</div>
                            <p style={{ color: '#8A9BBE', fontSize: '15px', margin: 0 }}>
                                {search ? 'No hearings found matching your search' : 'No upcoming hearings'}
                            </p>
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    style={{
                                        background: '#D4A843', color: '#1B2A4A', border: 'none',
                                        borderRadius: '10px', padding: '10px 24px',
                                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                                    }}
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)' }}>
                                            {['#', 'Case No', 'Title', 'Hearing Date', 'Urgency', 'Emails', 'Action'].map((h, i) => (
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
                                        {filtered.map((hearing, index) => {
                                            const urgency = getUrgencyStyle(hearing.nextHearingDate)
                                            return (
                                                <tr
                                                    key={hearing.caseId}
                                                    className="alert-row"
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
                                                            background: 'linear-gradient(135deg,#EDE5CF 0%,#E0D4B8 100%)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '12px', fontWeight: 700, color: '#8A7040',
                                                        }}>
                                                            {index + 1}
                                                        </div>
                                                    </td>

                                                    {/* Case No */}
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                            padding: '4px 12px', borderRadius: '8px',
                                                            fontSize: '12px', fontWeight: 700,
                                                            background: 'linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 100%)',
                                                            color: '#1B2A4A',
                                                            border: '1px solid #C7D2FE',
                                                            fontFamily: 'monospace',
                                                        }}>
                                                            {hearing.caseNo}
                                                        </span>
                                                    </td>

                                                    {/* Title */}
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{
                                                                width: '36px', height: '36px', borderRadius: '10px',
                                                                background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: '16px', flexShrink: 0,
                                                            }}>📋</div>
                                                            <p style={{
                                                                margin: 0, fontSize: '14px',
                                                                fontWeight: 600, color: '#1B2A4A',
                                                                maxWidth: '220px', overflow: 'hidden',
                                                                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                            }}>
                                                                {hearing.title}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    {/* Hearing Date */}
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                                                            📅 {new Date(hearing.nextHearingDate).toLocaleDateString('en-PK', {
                                                                day: '2-digit', month: 'short', year: 'numeric',
                                                            })}
                                                        </span>
                                                    </td>

                                                    {/* Urgency Badge */}
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                            padding: '4px 12px', borderRadius: '20px',
                                                            fontSize: '12px', fontWeight: 600,
                                                            background: urgency.bg, color: urgency.color,
                                                            border: `1px solid ${urgency.border}`,
                                                        }}>
                                                            <span style={{
                                                                width: '6px', height: '6px', borderRadius: '50%',
                                                                background: urgency.color, display: 'inline-block',
                                                            }} />
                                                            {urgency.text}
                                                        </span>
                                                    </td>

                                                    {/* Emails */}
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <span style={{
                                                            fontSize: '12px',
                                                            color: hearing.emailList ? '#4A5568' : '#C0CADB',
                                                            maxWidth: '200px', display: 'inline-block',
                                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            {hearing.emailList || '— No emails —'}
                                                        </span>
                                                    </td>

                                                    {/* Action */}
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <button
                                                            className="alert-action-btn alert-send-btn"
                                                            onClick={() => {
                                                                setSentCaseId(hearing.caseId)
                                                                sendAlert(hearing.caseId)
                                                            }}
                                                            disabled={isPending && sentCaseId === hearing.caseId}
                                                            style={{
                                                                background: '#D4A843', color: '#1B2A4A',
                                                                border: 'none', borderRadius: '8px',
                                                                padding: '8px 16px', fontSize: '12px',
                                                                fontWeight: 700, cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
                                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                            }}
                                                        >
                                                            {isPending && sentCaseId === hearing.caseId ? (
                                                                <>
                                                                    <div style={{
                                                                        width: '14px', height: '14px', borderRadius: '50%',
                                                                        border: '2px solid rgba(27,42,74,0.2)',
                                                                        borderTop: '2px solid #1B2A4A',
                                                                        animation: 'spin 0.6s linear infinite',
                                                                    }} />
                                                                    Sending...
                                                                </>
                                                            ) : (
                                                                <>📧 Send Alert</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── Footer ── */}
                            <div style={{
                                padding: '12px 20px',
                                background: 'linear-gradient(135deg,#FDFCF9 0%,#F8F4EC 100%)',
                                borderTop: '1px solid #EEE9DC',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <span style={{ fontSize: '12px', color: '#A0ABBE' }}>
                                    Showing <strong style={{ color: '#1B2A4A' }}>{filtered.length}</strong> of{' '}
                                    <strong style={{ color: '#D4A843' }}>{hearings?.length ?? 0}</strong> hearings
                                </span>
                                <span style={{ fontSize: '12px', color: '#A0ABBE' }}>
                                    Next 3 days · Auto-refreshed
                                </span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default AlertsPage
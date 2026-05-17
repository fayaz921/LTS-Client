import { useSummaryReport } from '../hooks/useSummaryReport'
import { useDepartmentReport } from '../hooks/useDepartmentReport'
import { useCourtReport } from '../hooks/useCourtReport'

// ─────────────────────────────────────────────────────────────
// ReportsPage — Reports & Analytics
// Design matches Courts / Departments / Follow-ups pattern
// ─────────────────────────────────────────────────────────────

const ReportsPage = () => {
    const { data: summary, isLoading: summaryLoading } = useSummaryReport()
    const { data: deptReport, isLoading: deptLoading } = useDepartmentReport()
    const { data: courtReport, isLoading: courtLoading } = useCourtReport()

    const getPercentage = (pending: number, total: number) => {
        if (total === 0) return 0
        return Math.round((pending / total) * 100)
    }

    const statCards = [
        { title: 'Total Cases', value: summary?.totalCases, icon: '📁', tone: '#1B2A4A' },
        { title: 'Pending Cases', value: summary?.pendingCases, icon: '⏳', tone: '#D97706' },
        { title: 'Finalized Cases', value: summary?.finalizedCases, icon: '✅', tone: '#15803D' },
        { title: 'Upcoming Hearings', value: summary?.upcomingHearings, icon: '📅', tone: '#DC2626' },
    ]

    return (
        <div style={{ padding: '32px', minHeight: '100vh', background: '#ffffff' }}>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .report-row { animation: fadeInUp 0.3s ease forwards; transition: background 0.15s ease; }
                .report-row:hover { background: #F8F6F0 !important; }
                .stat-card { animation: fadeInUp 0.35s ease forwards; transition: all 0.25s ease; }
                .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(27,42,74,0.12) !important; }
            `}</style>

            {/* ── Page Header ── */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px',
                    }}>📊</div>
                    <div>
                        <h5 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#1B2A4A' }}>
                            Reports & Analytics
                        </h5>
                        <p style={{ margin: 0, fontSize: '13px', color: '#8A9BBE' }}>
                            Overall system performance and statistics
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px', marginBottom: '28px',
            }}>
                {statCards.map((card, i) => (
                    <div
                        key={card.title}
                        className="stat-card"
                        style={{
                            background: '#fff', borderRadius: '16px',
                            border: '1px solid #EEE9DC', padding: '20px 24px',
                            boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                            display: 'flex', alignItems: 'center', gap: '16px',
                            borderLeft: `4px solid ${card.tone}`,
                            animationDelay: `${i * 0.08}s`,
                        }}
                    >
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            background: `linear-gradient(135deg,${card.tone}15 0%,${card.tone}08 100%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px', flexShrink: 0,
                        }}>
                            {card.icon}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#8A9BBE', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {card.title}
                            </p>
                            {summaryLoading ? (
                                <div style={{
                                    width: '60px', height: '28px', borderRadius: '6px',
                                    background: 'linear-gradient(90deg, #F0E8D0, #F8F4EC, #F0E8D0)',
                                    backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite',
                                    marginTop: '4px',
                                }} />
                            ) : (
                                <h3 style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: 800, color: card.tone, lineHeight: 1 }}>
                                    {card.value ?? 0}
                                </h3>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Two Tables Side by Side ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>

                {/* Department-wise Report */}
                <div style={{
                    background: '#fff', borderRadius: '16px',
                    border: '1px solid #EEE9DC', overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                }}>
                    <div style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <span style={{ fontSize: '16px' }}>🏢</span>
                        <h6 style={{ margin: 0, color: '#D4A843', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Department-wise Cases
                        </h6>
                    </div>

                    {deptLoading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #F0E8D0', borderTop: '3px solid #D4A843', animation: 'spin 0.8s linear infinite' }} />
                            <p style={{ color: '#8A9BBE', fontSize: '13px', margin: 0 }}>Loading...</p>
                        </div>
                    )}

                    {!deptLoading && deptReport && deptReport.length === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0', gap: '12px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,#F5F0E8 0%,#EDE5D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏢</div>
                            <p style={{ color: '#8A9BBE', fontSize: '14px', margin: 0 }}>No department data found</p>
                        </div>
                    )}

                    {!deptLoading && deptReport && deptReport.length > 0 && (
                        <>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#FDFCF9' }}>
                                            {['Department', 'Total', 'Pending', 'Finalized', 'Pending %'].map((h, i) => (
                                                <th key={i} style={{
                                                    padding: '12px 16px', textAlign: i === 0 ? 'left' : 'center',
                                                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                                                    color: '#8A9BBE', textTransform: 'uppercase',
                                                    borderBottom: '1px solid #EEE9DC',
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deptReport.map((dept, index) => {
                                            const pct = getPercentage(dept.pendingCases, dept.totalCases)
                                            return (
                                                <tr key={index} className="report-row" style={{
                                                    background: index % 2 === 0 ? '#fff' : '#FDFCF9',
                                                    borderBottom: '1px solid #F0EBE0',
                                                    animationDelay: `${index * 0.04}s`,
                                                }}>
                                                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                                                        {dept.departmentName}
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block', padding: '3px 10px',
                                                            borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                                                            background: '#EEF2FF', color: '#1B2A4A', border: '1px solid #C7D2FE',
                                                        }}>{dept.totalCases}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block', padding: '3px 10px',
                                                            borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                                                            background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A',
                                                        }}>{dept.pendingCases}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block', padding: '3px 10px',
                                                            borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                                                            background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0',
                                                        }}>{dept.finalizedCases}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                                            <div style={{
                                                                flex: 1, maxWidth: '80px', height: '6px',
                                                                borderRadius: '3px', background: '#F0EBE0',
                                                                overflow: 'hidden',
                                                            }}>
                                                                <div style={{
                                                                    width: `${pct}%`, height: '100%',
                                                                    borderRadius: '3px',
                                                                    background: pct > 60 ? '#DC2626' : pct > 30 ? '#D97706' : '#D4A843',
                                                                    transition: 'width 0.6s ease',
                                                                }} />
                                                            </div>
                                                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', minWidth: '30px' }}>
                                                                {pct}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{
                                padding: '10px 16px',
                                background: 'linear-gradient(135deg,#FDFCF9 0%,#F8F4EC 100%)',
                                borderTop: '1px solid #EEE9DC',
                            }}>
                                <span style={{ fontSize: '11px', color: '#A0ABBE' }}>
                                    {deptReport.length} department{deptReport.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Court-wise Report */}
                <div style={{
                    background: '#fff', borderRadius: '16px',
                    border: '1px solid #EEE9DC', overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(27,42,74,0.06)',
                }}>
                    <div style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 100%)',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <span style={{ fontSize: '16px' }}>⚖️</span>
                        <h6 style={{ margin: 0, color: '#D4A843', fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Court-wise Cases
                        </h6>
                    </div>

                    {courtLoading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #F0E8D0', borderTop: '3px solid #D4A843', animation: 'spin 0.8s linear infinite' }} />
                            <p style={{ color: '#8A9BBE', fontSize: '13px', margin: 0 }}>Loading...</p>
                        </div>
                    )}

                    {!courtLoading && courtReport && courtReport.length === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 0', gap: '12px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,#F5F0E8 0%,#EDE5D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⚖️</div>
                            <p style={{ color: '#8A9BBE', fontSize: '14px', margin: 0 }}>No court data found</p>
                        </div>
                    )}

                    {!courtLoading && courtReport && courtReport.length > 0 && (
                        <>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#FDFCF9' }}>
                                            {['Court', 'Total', 'Pending', 'Finalized', 'Pending %'].map((h, i) => (
                                                <th key={i} style={{
                                                    padding: '12px 16px', textAlign: i === 0 ? 'left' : 'center',
                                                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                                                    color: '#8A9BBE', textTransform: 'uppercase',
                                                    borderBottom: '1px solid #EEE9DC',
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courtReport.map((court, index) => {
                                            const pct = getPercentage(court.pendingCases, court.totalCases)
                                            return (
                                                <tr key={index} className="report-row" style={{
                                                    background: index % 2 === 0 ? '#fff' : '#FDFCF9',
                                                    borderBottom: '1px solid #F0EBE0',
                                                    animationDelay: `${index * 0.04}s`,
                                                }}>
                                                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                                                        {court.courtName}
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block', padding: '3px 10px',
                                                            borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                                                            background: '#EEF2FF', color: '#1B2A4A', border: '1px solid #C7D2FE',
                                                        }}>{court.totalCases}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block', padding: '3px 10px',
                                                            borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                                                            background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A',
                                                        }}>{court.pendingCases}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block', padding: '3px 10px',
                                                            borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                                                            background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0',
                                                        }}>{court.finalizedCases}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                                            <div style={{
                                                                flex: 1, maxWidth: '80px', height: '6px',
                                                                borderRadius: '3px', background: '#F0EBE0',
                                                                overflow: 'hidden',
                                                            }}>
                                                                <div style={{
                                                                    width: `${pct}%`, height: '100%',
                                                                    borderRadius: '3px',
                                                                    background: pct > 60 ? '#DC2626' : pct > 30 ? '#D97706' : '#D4A843',
                                                                    transition: 'width 0.6s ease',
                                                                }} />
                                                            </div>
                                                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', minWidth: '30px' }}>
                                                                {pct}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{
                                padding: '10px 16px',
                                background: 'linear-gradient(135deg,#FDFCF9 0%,#F8F4EC 100%)',
                                borderTop: '1px solid #EEE9DC',
                            }}>
                                <span style={{ fontSize: '11px', color: '#A0ABBE' }}>
                                    {courtReport.length} court{courtReport.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Footer Note */}
            <div style={{
                marginTop: '24px', textAlign: 'center',
                fontSize: '12px', color: '#A0ABBE',
            }}>
                <p style={{ margin: 0 }}>Reports are read-only. Data is refreshed automatically.</p>
            </div>
        </div>
    )
}

export default ReportsPage

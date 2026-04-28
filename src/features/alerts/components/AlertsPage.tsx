import { useGetUpcomingHearings, useSendAlert } from '../hooks/useAlerts'

const AlertsPage = () => {
    const { data: hearings, isLoading, isError } = useGetUpcomingHearings()
    const { mutate: sendAlert, isPending } = useSendAlert()

    if (isLoading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" />
        </div>
    )

    if (isError) return (
        <div className="alert alert-danger">
            Hearings load nahi ho sake!
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 style={{ color: '#1B2A4A', fontWeight: 700, margin: 0 }}>
                        Upcoming Hearings
                    </h4>
                    <small style={{ color: '#64748B' }}>
                        Agle 3 din k hearings
                    </small>
                </div>
                <span className="badge" style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '13px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                }}>
                    🔔 {hearings?.length ?? 0} Upcoming
                </span>
            </div>

            {/* Empty State */}
            {hearings?.length === 0 && (
                <div className="text-center py-5" style={{ color: '#64748B' }}>
                    <div style={{ fontSize: '40px' }}>📅</div>
                    <p className="mt-2">Koi upcoming hearing nahi hai</p>
                </div>
            )}

            {/* Table */}
            {hearings && hearings.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead style={{ backgroundColor: '#F8FAFC' }}>
                            <tr>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>CASE NO</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>TITLE</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>HEARING DATE</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>EMAILS</th>
                                <th style={{ color: '#64748B', fontSize: '12px' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hearings.map(hearing => (
                                <tr key={hearing.caseId}>
                                    {/* Case No */}
                                    <td>
                                        <span style={{
                                            backgroundColor: '#EFF6FF',
                                            color: '#2563EB',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                        }}>
                                            {hearing.caseNo}
                                        </span>
                                    </td>

                                    {/* Title */}
                                    <td style={{ fontSize: '13px', color: '#0F172A', fontWeight: 500 }}>
                                        {hearing.title}
                                    </td>

                                    {/* Date */}
                                    <td>
                                        <span style={{
                                            backgroundColor: '#FEF2F2',
                                            color: '#DC2626',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                        }}>
                                            📅 {new Date(hearing.nextHearingDate).toLocaleDateString('en-PK', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </td>

                                    {/* Emails */}
                                    <td style={{ fontSize: '12px', color: '#64748B' }}>
                                        {hearing.emailList}
                                    </td>

                                    {/* Send Button */}
                                    <td>
                                        <button
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: '#D4A843',
                                                color: '#0F172A',
                                                fontWeight: 600,
                                                fontSize: '12px',
                                            }}
                                            onClick={() => sendAlert(hearing.caseId)}
                                            disabled={isPending}
                                        >
                                            {isPending ? 'Sending...' : '📧 Send Alert'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AlertsPage
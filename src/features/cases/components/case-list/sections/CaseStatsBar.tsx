interface Props {
    totalCount: number;
    pendingCount: number
    finalizedCount: number
}

export default function CaseStatsBar({ totalCount, pendingCount, finalizedCount }: Props) {

    return (
        <div className="cl__stats-grid">
            <div className="cl__stat-card">
                <div className="cl__stat-header">
                    <span className="cl__stat-number">{totalCount}</span>
                    <span className="badge bg-primary">All</span>
                </div>
                <p className="cl__stat-label">Total Cases</p>
            </div>

            <div className="cl__stat-card">
                <div className="cl__stat-header">
                    <span className="cl__stat-number cl__stat-number--pending">{pendingCount}</span>
                    <span className="badge bg-warning text-dark">Pending</span>
                </div>
                <p className="cl__stat-label">Pending Cases</p>
            </div>

            <div className="cl__stat-card">
                <div className="cl__stat-header">
                    <span className="cl__stat-number cl__stat-number--success">{finalizedCount}</span>
                    <span className="badge bg-success">Finalized</span>
                </div>
                <p className="cl__stat-label">Completed Cases</p>
            </div>
        </div>
    )
}

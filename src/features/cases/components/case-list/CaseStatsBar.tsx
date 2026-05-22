import type { GetCaseDto } from '../../types/case.types';

interface Props {
    totalCount: number;
    cases: GetCaseDto[];
}

export default function CaseStatsBar({ totalCount, cases }: Props) {
    const pendingCount = cases.filter(c => c.status === 'Pending').length;
    const finalizedCount = cases.filter(c => c.status === 'Finalized').length;

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
                    <span className="cl__stat-number cl__stat-number--pending">
                        {pendingCount}
                    </span>
                    <span className="badge bg-warning text-dark">Pending</span>
                </div>
                <p className="cl__stat-label">Active Cases</p>
            </div>

            <div className="cl__stat-card">
                <div className="cl__stat-header">
                    <span className="cl__stat-number cl__stat-number--success">
                        {finalizedCount}
                    </span>
                    <span className="badge bg-success">Finalized</span>
                </div>
                <p className="cl__stat-label">Completed</p>
            </div>
        </div>
    );
}

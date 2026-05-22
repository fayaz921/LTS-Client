import type { GetCaseDto } from '../../types/case.types';

// ── Types ─────────────────────────────────────────────────────

interface TableProps {
    cases: GetCaseDto[];
    onDetails: (id: string) => void;
    onEdit: (id: string) => void;
    onDocuments: (id: string) => void;
    onFollowups: (id: string) => void;
    onDelete: (id: string) => void;
}

interface RowProps {
    caseItem: GetCaseDto;
    onDetails: () => void;
    onEdit: () => void;
    onDocuments: () => void;
    onFollowups: () => void;
    onDelete: () => void;
}

// ── CaseTable ──────────────────────────────────────────────────

export default function CaseTable({
    cases,
    onDetails,
    onEdit,
    onDocuments,
    onFollowups,
    onDelete,
}: TableProps) {
    return (
        <div className="table-responsive">
            <table className="cl__table">
                <thead>
                    <tr>
                        <th>Case No.</th>
                        <th>Title &amp; Subject</th>
                        <th>Court &amp; Dept</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.length > 0 ? (
                        cases.map(caseItem => (
                            <CaseRow
                                key={caseItem.id}
                                caseItem={caseItem}
                                onDetails={() => onDetails(caseItem.id)}
                                onEdit={() => onEdit(caseItem.id)}
                                onDocuments={() => onDocuments(caseItem.id)}
                                onFollowups={() => onFollowups(caseItem.id)}
                                onDelete={() => onDelete(caseItem.id)}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="cl__empty">
                                No cases found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ── CaseRow ────────────────────────────────────────────────────

function CaseRow({ caseItem, onDetails, onEdit, onDocuments, onFollowups, onDelete }: RowProps) {
    return (
        <tr>
            <td>
                <span className="cl__case-no">{caseItem.caseNo}</span>
            </td>
            <td>
                <div className="cl__cell-title">{caseItem.title}</div>
                <div className="cl__cell-sub">{caseItem.subject}</div>
            </td>
            <td>
                <div className="cl__cell-title">{caseItem.courtName}</div>
                <div className="cl__cell-sub">{caseItem.departmentName}</div>
            </td>
            <td>
                <StatusBadge status={caseItem.status} />
            </td>
            <td>
                <span className="cl__cell-date">
                    {new Date(caseItem.dateInstitution).toLocaleDateString('en-PK')}
                </span>
            </td>

            {/* ── Actions: 4 clean icon buttons ── */}
            <td>
                <div className="cl__actions">

                    {/* 1. Details — eye */}
                    <button
                        className="cl__action-btn cl__action-btn--details"
                        onClick={onDetails}
                        title="View Details"
                    >
                        <i className="bi bi-eye" />
                    </button>

                    {/* 2. Edit — pencil */}
                    <button
                        className="cl__action-btn cl__action-btn--edit"
                        onClick={onEdit}
                        title="Edit Case"
                    >
                        <i className="bi bi-pencil" />
                    </button>

                    <button
                        className="cl__action-btn cl__action-btn--delete"
                        onClick={onDelete}
                        title="Delete Case"
                    >
                        <i className="bi bi-trash" />
                    </button>

                    {/* 3. Documents — file */}
                    <button
                        className="cl__action-btn cl__action-btn--docs"
                        onClick={onDocuments}
                        title="Documents"
                    >
                        <i className="bi bi-file-earmark-text" />
                    </button>

                    {/* 4. Follow-ups — calendar */}
                    <button
                        className="cl__action-btn cl__action-btn--followup"
                        onClick={onFollowups}
                        title="Follow-ups"
                    >
                        <i className="bi bi-calendar-check" />
                    </button>

                </div>
            </td>
        </tr>
    );
}

// ── StatusBadge ────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { cls: string; icon: string }> = {
        Pending: { cls: 'cl__status--pending', icon: 'bi-clock' },
        Finalized: { cls: 'cl__status--finalized', icon: 'bi-check-circle' },
        Active: { cls: 'cl__status--active', icon: 'bi-arrow-repeat' },
    };
    const s = map[status] ?? { cls: '', icon: 'bi-circle' };
    return (
        <span className={`cl__status ${s.cls}`}>
            <i className={`bi ${s.icon}`} />
            {status}
        </span>
    );
}

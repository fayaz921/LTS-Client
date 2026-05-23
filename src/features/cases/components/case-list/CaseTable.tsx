import type { CaseDto, CaseStatus } from '../../types/case.types';

// ── Types ─────────────────────────────────────────────────────────

interface TableProps {
    cases: CaseDto[];
    onDetails: (id: string) => void;
    onEdit: (id: string) => void;
    onDocuments: (id: string) => void;
    onFollowups: (id: string) => void;
    onDelete: (id: string) => void;
}

interface RowProps {
    caseItem: CaseDto;
    onDetails: () => void;
    onEdit: () => void;
    onDocuments: () => void;
    onFollowups: () => void;
    onDelete: () => void;
}

// ── CaseTable ─────────────────────────────────────────────────────

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
                        <th>Petitioner(s)</th>
                        <th>Court &amp; Dept</th>
                        <th>DAG</th>
                        <th>Status</th>
                        <th>Date Filed</th>
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
                            <td colSpan={8} className="cl__empty">  {/* ✅ was 6, now 8 columns */}
                                No cases found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ── CaseRow ───────────────────────────────────────────────────────

function CaseRow({ caseItem, onDetails, onEdit, onDocuments, onFollowups, onDelete }: RowProps) {
    return (
        <tr>
            {/* 1. Case No. */}
            <td>
                <span className="cl__case-no">{caseItem.caseNo}</span>
            </td>

            {/* 2. Title & Subject */}
            <td>
                <div className="cl__cell-title">{caseItem.title}</div>
                <div className="cl__cell-sub">{caseItem.subject}</div>
            </td>

            {/* 3. Petitioner(s) — NEW COLUMN */}
            {/* Shows first petitioner name + CNIC, with +N badge if more */}
            <td>
                <PetitionerCell petitioners={caseItem.petitioners} />
            </td>

            {/* 4. Court & Department */}
            <td>
                <div className="cl__cell-title">{caseItem.courtName}</div>
                <div className="cl__cell-sub">{caseItem.departmentName}</div>
            </td>

            {/* 5. DAG — NEW COLUMN */}
            <td>
                <span className="cl__cell-dag">{caseItem.dag || '—'}</span>
            </td>

            {/* 6. Status */}
            <td>
                <StatusBadge status={caseItem.status} />
            </td>

            {/* 7. Date Filed */}
            <td>
                <span className="cl__cell-date">
                    {new Date(caseItem.dateInstitution).toLocaleDateString('en-PK', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
            </td>

            {/* 8. Actions — 5 icon buttons */}
            <td>
                <div className="cl__actions">

                    <button
                        className="cl__action-btn cl__action-btn--details"
                        onClick={onDetails}
                        title="View Details"
                    >
                        <i className="bi bi-eye" />
                    </button>

                    <button
                        className="cl__action-btn cl__action-btn--edit"
                        onClick={onEdit}
                        title="Edit Case"
                    >
                        <i className="bi bi-pencil" />
                    </button>

                    <button
                        className="cl__action-btn cl__action-btn--docs"
                        onClick={onDocuments}
                        title="Documents"
                    >
                        <i className="bi bi-file-earmark-text" />
                    </button>

                    <button
                        className="cl__action-btn cl__action-btn--followup"
                        onClick={onFollowups}
                        title="Follow-ups"
                    >
                        <i className="bi bi-calendar-check" />
                    </button>

                    <button
                        className="cl__action-btn cl__action-btn--delete"
                        onClick={onDelete}
                        title="Delete Case"
                    >
                        <i className="bi bi-trash" />
                    </button>

                </div>
            </td>
        </tr>
    );
}

// ── PetitionerCell ────────────────────────────────────────────────
// Shows first petitioner's name + CNIC. If more than 1, shows "+N more" badge.

function PetitionerCell({ petitioners }: { petitioners: CaseDto['petitioners'] }) {
    if (!petitioners || petitioners.length === 0) {
        return <span className="cl__cell-sub">—</span>;
    }

    const first = petitioners[0];
    const extra = petitioners.length - 1;

    return (
        <div className="cl__petitioner-cell">
            <div className="cl__cell-title">{first.name}</div>
            {first.cnic && (
                <div className="cl__cell-sub cl__cnic">{first.cnic}</div>
            )}
            {extra > 0 && (
                <span className="cl__petitioner-more" title={petitioners.slice(1).map(p => p.name).join(', ')}>
                    +{extra} more
                </span>
            )}
        </div>
    );
}

// ── StatusBadge ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: CaseStatus }) {
    const map: Record<CaseStatus, { cls: string; icon: string }> = {
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
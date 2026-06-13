import '../styles/case-details-modal.css';
import type { CaseDto } from '../types/case.types';

interface Props {
    caseItem: CaseDto;
    onEdit: () => void;
    onClose: () => void;
}

export default function CaseDetailsModal({ caseItem, onEdit, onClose }: Props) {
    return (
        <div className="cdm__overlay" onClick={onClose}>
            <div className="cdm__dialog" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="cdm__header">
                    <div className="cdm__header-left">
                        <div className="cdm__header-icon">
                            <i className="bi bi-file-earmark-text" />
                        </div>
                        <div>
                            <div className="cdm__header-title">{caseItem.title}</div>
                            <div className="cdm__header-subtitle">
                                {caseItem.caseNo}&nbsp;·&nbsp;
                                Filed {new Date(caseItem.dateInstitution).toLocaleDateString('en-PK')}
                            </div>
                        </div>
                    </div>
                    <button className="cdm__close-btn" onClick={onClose} title="Close">
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* BODY */}
                <div className="cdm__body">

                    {/* SECTION I — Jurisdiction */}
                    <div className="cdm__section">
                        <div className="cdm__section-title">Jurisdiction &amp; Assignment</div>
                        <div className="cdm__grid">
                            <div className="cdm__item">
                                <span className="cdm__item-label">Court</span>
                                <span className="cdm__item-value">{caseItem.courtName}</span>
                            </div>
                            <div className="cdm__item">
                                <span className="cdm__item-label">Department</span>
                                <span className="cdm__item-value">{caseItem.departmentName}</span>
                            </div>
                            <div className="cdm__item">
                                <span className="cdm__item-label">DAG / Counsel</span>
                                <span className="cdm__item-value">{caseItem.dag}</span>
                            </div>
                            <div className="cdm__item">
                                <span className="cdm__item-label">Status</span>
                                <span className="cdm__item-value">
                                    <StatusBadge status={caseItem.status} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION II — Case Particulars */}
                    <div className="cdm__section">
                        <div className="cdm__section-title">Case Particulars</div>
                        <div className="cdm__grid">
                            <div className="cdm__item cdm__item--full">
                                <span className="cdm__item-label">Subject Matter</span>
                                <span className="cdm__item-value">{caseItem.subject}</span>
                            </div>
                            <div className="cdm__item cdm__item--full">
                                <span className="cdm__item-label">Date Instituted</span>
                                <span className="cdm__item-value">
                                    {new Date(caseItem.dateInstitution).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION III — Petitioners */}
                    <div className="cdm__section">
                        <div className="cdm__section-title">Petitioners</div>
                        {caseItem.petitioners?.length > 0 ? (
                            <div className="cdm__tags">
                                {caseItem.petitioners.map(p => (
                                    <span key={p.name} className="cdm__tag">
                                        <i className="bi bi-person" />
                                        {p.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="cdm__item-value cdm__item-value--muted">
                                No petitioners on record
                            </span>
                        )}
                    </div>

                </div>

                {/* FOOTER */}
                <div className="cdm__footer">
                    <button className="cdm__btn-close" onClick={onClose}>
                        <i className="bi bi-x" /> Close
                    </button>
                    <button className="cdm__btn-edit" onClick={onEdit}>
                        <i className="bi bi-pencil" /> Edit Case
                    </button>
                </div>

            </div>
        </div>
    );
}

/* ── Status Badge ───────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { cls: string; icon: string }> = {
        Pending: { cls: 'cdm__status--pending', icon: 'bi-clock' },
        Finalized: { cls: 'cdm__status--finalized', icon: 'bi-check-circle' },
        Active: { cls: 'cdm__status--active', icon: 'bi-arrow-repeat' },
    };
    const s = map[status] ?? { cls: '', icon: 'bi-circle' };
    return (
        <span className={`cdm__status ${s.cls}`}>
            <i className={`bi ${s.icon}`} />
            {status}
        </span>
    );
}
import { useState } from 'react'
import { useGetFollowUps, useDeleteFollowUp } from '../../../../../followup/hooks/useFollowups'
import FollowUpForm from '../../../../../followup/components/FollowupForm'
import type { FollowUp } from '../../../../../followup/types/followup.types'
import DrawerLoader from '../shared/DrawerLoader'
import DrawerEmpty from '../shared/DrawerEmpty'
import { fmtDate, getHearingStatus } from '../shared/case-drawer.helpers'

export default function FollowUpsTab({ caseId }: { caseId: string }) {
    const [showForm, setShowForm] = useState(false)
    const [selected, setSelected] = useState<FollowUp | undefined>()

    const { data, isLoading, isError, refetch } = useGetFollowUps({ pageNumber: 1, pageSize: 50, caseId })
    const { mutate: deleteFollowUp, isPending: isDeleting } = useDeleteFollowUp()

    const followups = data?.items ?? []

    const handleEdit = (f: FollowUp) => {
        setSelected(f)
        setShowForm(true)
    }

    const handleClose = () => {
        setSelected(undefined)
        setShowForm(false)
    }

    if (isLoading) return <DrawerLoader text="Loading follow-ups..." />

    if (isError) return (
        <div className="cdr__error">
            <span>⚠️</span> Could not load follow-ups.
            <button className="cdr__retry-btn" onClick={() => refetch()}>Retry</button>
        </div>
    )

    return (
        <div className="cdr__tab-content">

            {/* Toolbar */}
            <div className="cdr__tab-toolbar">
                <span className="cdr__tab-count">
                    {followups.length} follow-up{followups.length !== 1 ? 's' : ''}
                </span>
                <button className="cdr__add-btn" onClick={() => { setSelected(undefined); setShowForm(true) }}>
                    <i className="bi bi-plus" /> Add Follow-up
                </button>
            </div>

            {/* List */}
            {followups.length === 0 ? (
                <DrawerEmpty
                    icon="📋"
                    text="No follow-ups yet for this case"
                    btnText="+ Add First Follow-up"
                    onAdd={() => setShowForm(true)}
                />
            ) : (
                <div className="cdr__list">
                    {followups.map((f, i) => {
                        const st = getHearingStatus(f.hearingDate, f.nextHearingDate)
                        return (
                            <div key={f.id} className="cdr__fu-card" style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="cdr__fu-card-top">
                                    <span className="cdr__fu-date">{fmtDate(f.hearingDate)}</span>
                                    <span className="cdr__fu-status" style={{
                                        background: st.bg, color: st.color, border: `1px solid ${st.border}`
                                    }}>{st.text}</span>
                                </div>

                                {f.nextHearingDate && (
                                    <div className="cdr__fu-row">
                                        <span className="cdr__fu-label">Next Hearing</span>
                                        <span className="cdr__fu-val">{fmtDate(f.nextHearingDate)}</span>
                                    </div>
                                )}
                                {f.interimOrder && (
                                    <div className="cdr__fu-row">
                                        <span className="cdr__fu-label">Interim Order</span>
                                        <span className="cdr__fu-val">{f.interimOrder}</span>
                                    </div>
                                )}
                                {f.decision && (
                                    <div className="cdr__fu-row">
                                        <span className="cdr__fu-label">Decision</span>
                                        <span className="cdr__fu-val">{f.decision}</span>
                                    </div>
                                )}
                                {f.remarks && (
                                    <div className="cdr__fu-row">
                                        <span className="cdr__fu-label">Remarks</span>
                                        <span className="cdr__fu-val cdr__fu-val--muted">{f.remarks}</span>
                                    </div>
                                )}

                                <div className="cdr__fu-actions">
                                    <button className="cdr__fu-btn cdr__fu-btn--edit" onClick={() => handleEdit(f)}>
                                        <i className="bi bi-pencil" /> Edit
                                    </button>
                                    <button
                                        className="cdr__fu-btn cdr__fu-btn--del"
                                        onClick={() => deleteFollowUp(f.id)}
                                        disabled={isDeleting}
                                    >
                                        <i className="bi bi-trash" /> Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {showForm && (
                <FollowUpForm
                    caseId={caseId}
                    selected={selected}
                    onClose={handleClose}
                />
            )}
        </div>
    )
}
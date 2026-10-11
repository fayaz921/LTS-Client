import { useState } from 'react'
import type { FollowUp } from '../types/followup.types'
import { useCreateFollowUp, useUpdateFollowUp } from '../hooks/useFollowups'
import { toastService } from '../../../lib/toast.service'
import FuField from './Fufield'
import '../styles/followUps-form.css'

interface Props {
    selected?: FollowUp
    caseId: string
    onClose: () => void
}

const getInitialForm = (selected?: FollowUp) => ({
    hearingDate: selected?.hearingDate ? selected.hearingDate.split('T')[0] : '',
    nextHearingDate: selected?.nextHearingDate ? selected.nextHearingDate.split('T')[0] : '',
    interimOrder: selected?.interimOrder ?? '',
    decision: selected?.decision ?? '',
    remarks: selected?.remarks ?? '',
})

export default function FollowUpForm({ selected, caseId, onClose }: Props) {

    const [form, setForm] = useState(() => getInitialForm(selected))

    const { mutate: createFollowUp, isPending: creating } = useCreateFollowUp()
    const { mutate: updateFollowUp, isPending: updating } = useUpdateFollowUp()

    const isPending = creating || updating

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm(p => ({ ...p, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.hearingDate) {
            toastService.error('Hearing Date is required')
            return
        }

        const payload = {
            caseId,
            hearingDate: form.hearingDate,
            nextHearingDate: form.nextHearingDate || null,
            interimOrder: form.interimOrder || null,
            decision: form.decision || null,
            remarks: form.remarks || null,
        }

        if (selected) {
            updateFollowUp(
                { id: selected.id, ...payload },
                {
                    onSuccess: () => onClose(),
                    onError: (err: unknown) => toastService.error(err),
                }
            )
        } else {
            createFollowUp(payload, {
                onSuccess: () => onClose(),
                onError: (err: unknown) => toastService.error(err),
            })
        }
    }

    return (
        <div className="fu-backdrop" onClick={onClose}>
            <div className="fu-modal" onClick={e => e.stopPropagation()}>

                {/* HEADER */}
                <div className="fu-header">
                    <div className="fu-header-deco fu-header-deco--lg" />
                    <div className="fu-header-deco fu-header-deco--sm" />

                    <button className="fu-close-btn" onClick={onClose}>×</button>

                    <div className="fu-header-content">
                        <div className="fu-header-icon">📋</div>
                        <div>
                            <p className="fu-header-badge">
                                {selected ? 'Edit Record' : 'New Record'}
                            </p>
                            <h5 className="fu-header-title">
                                {selected ? 'Update FollowUp' : 'Add FollowUp'}
                            </h5>
                        </div>
                    </div>

                    <svg viewBox="0 0 480 12" className="fu-header-wave" preserveAspectRatio="none">
                        <path d="M0,0 C120,12 360,12 480,0 L480,12 L0,12 Z" fill="#fff" />
                    </svg>
                </div>

                {/* BODY */}
                <div className="fu-body">
                    <form onSubmit={handleSubmit}>

                        <div className="fu-date-grid">
                            <FuField num={1} label="Hearing Date" required>
                                <input
                                    type="date"
                                    name="hearingDate"
                                    value={form.hearingDate}
                                    onChange={handleChange}
                                    required
                                    className="fu-input"
                                />
                            </FuField>
                            <FuField num={2} label="Next Date" optional>
                                <input
                                    type="date"
                                    name="nextHearingDate"
                                    value={form.nextHearingDate}
                                    onChange={handleChange}
                                    className="fu-input"
                                />
                            </FuField>
                        </div>

                        <FuField num={3} label="Interim Order" optional>
                            <textarea
                                name="interimOrder"
                                value={form.interimOrder}
                                onChange={handleChange}
                                placeholder="e.g. Stay granted, Notice issued..."
                                rows={2}
                                className="fu-textarea"
                            />
                        </FuField>

                        <FuField num={4} label="Decision" optional>
                            <textarea
                                name="decision"
                                value={form.decision}
                                onChange={handleChange}
                                placeholder="e.g. Case decided in favour..."
                                rows={2}
                                className="fu-textarea"
                            />
                        </FuField>

                        <FuField num={5} label="Remarks" optional>
                            <textarea
                                name="remarks"
                                value={form.remarks}
                                onChange={handleChange}
                                placeholder="Additional notes..."
                                rows={2}
                                className="fu-textarea"
                            />
                        </FuField>

                        <div className="fu-actions">
                            <button
                                type="button"
                                className="fu-btn fu-btn-cancel"
                                onClick={onClose}
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="fu-btn fu-btn-submit"
                                disabled={isPending}
                            >
                                {isPending
                                    ? <><span className="fu-spinner" /> Saving...</>
                                    : <>{selected ? '✓ Update' : '+ Create'}</>
                                }
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    )
}
// components/FollowUpForm.tsx - Fully Responsive

import { useState, useEffect } from 'react'
import type { FollowUp } from '../types/followup.types'
import { useCreateFollowUp, useUpdateFollowUp } from '../hooks/useFollowups'

interface Props {
    selected?: FollowUp
    caseId: string
    onClose: () => void
}

const FollowUpForm = ({ selected, caseId, onClose }: Props) => {
    const [form, setForm] = useState({
        hearingDate: '',
        nextHearingDate: '',
        interimOrder: '',
        decision: '',
        remarks: '',
    })
    const [error, setError] = useState('')

    const { mutate: createFollowUp, isPending: creating } = useCreateFollowUp()
    const { mutate: updateFollowUp, isPending: updating } = useUpdateFollowUp()
    const isPending = creating || updating

    useEffect(() => {
        if (selected) {
            setForm({
                hearingDate: selected.hearingDate ? selected.hearingDate.split('T')[0] : '',
                nextHearingDate: selected.nextHearingDate ? selected.nextHearingDate.split('T')[0] : '',
                interimOrder: selected.interimOrder ?? '',
                decision: selected.decision ?? '',
                remarks: selected.remarks ?? '',
            })
        } else {
            setForm({hearingDate: '',nextHearingDate: '',interimOrder: '',decision: '',remarks: ''})
            setError('')
        }
    }, [selected])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm(p => ({ ...p, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!form.hearingDate) {
            setError('Hearing Date is required')
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
                    onError: (err: any) =>
                        setError(err.response?.data?.message || 'Update failed'),
                }
            )
        } else {
            createFollowUp(payload,{
                onSuccess: () => onClose(),
                onError: (err: any) =>
                    setError(err.response?.data?.message || 'Create failed'),
            })
        }
    }

    return (
        <>
            <style>{`
                @keyframes backdropIn   { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: translateY(-20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0px);  }
                    50%      { transform: translateY(-4px); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .fu-input, .fu-textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1.5px solid #E2DECE;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #1B2A4A;
                    background: #FDFCF9;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .fu-input:focus, .fu-textarea:focus {
                    border-color: #D4A843;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(212,168,67,0.12);
                }
                .fu-input::placeholder, .fu-textarea::placeholder { color: #B0BBCA; }
                .fu-textarea { resize: vertical; min-height: 60px; }
                .fu-input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity: 0.5; cursor: pointer;
                }
                .fu-cancel:hover  { background: #E8EDF5 !important; color: #1B2A4A !important; }
                .fu-submit:hover:not(:disabled) {
                    background: #C49830 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(212,168,67,0.3) !important;
                }
                .fu-submit:disabled { opacity: 0.6; cursor: not-allowed; }
                .fu-close:hover { background: #F0EBE0 !important; color: #1B2A4A !important; }

                /* ── Responsive date grid ── */
                .fu-date-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 14px;
                }
                @media (max-width: 480px) {
                    .fu-date-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(15,25,50,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'backdropIn 0.2s ease',
                    padding: '12px',
                                }}
                onClick={onClose}
            >
                {/* Modal */}
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        width: '100%', maxWidth: '480px',
                        overflow: 'hidden',
                        animation: 'modalSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        boxShadow: '0 20px 60px rgba(15,25,50,0.25)',
                        maxHeight: '92vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Top Banner */}
                    <div style={{
                        background: 'linear-gradient(135deg,#1B2A4A 0%,#243560 50%,#1B2A4A 100%)',
                        padding: '20px 20px 0',
                        position: 'relative',
                        overflow: 'hidden',
                        flexShrink: 0,
                    }}>
                        {/* Deco circles */}
                        <div style={{
                            position: 'absolute', top: '-15px', right: '-15px',
                            width: '80px', height: '80px', borderRadius: '50%',
                            border: '1px solid rgba(212,168,67,0.15)',
                        }} />
                        <div style={{
                            position: 'absolute', top: '5px', right: '5px',
                            width: '50px', height: '50px', borderRadius: '50%',
                            border: '1px solid rgba(212,168,67,0.10)',
                        }} />

                        {/* Close */}
                        <button onClick={onClose} className="fu-close" style={{
                            position: 'absolute', top: '12px', right: '12px',
                            width: '28px', height: '28px', borderRadius: '6px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '16px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s ease', zIndex: 1,
                        }}>×</button>

                        {/* Icon + Title */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: 'linear-gradient(135deg,#D4A843 0%,#E8C05A 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '22px', flexShrink: 0,
                                boxShadow: '0 6px 16px rgba(212,168,67,0.3)',
                                animation: 'iconFloat 3s ease-in-out infinite',
                            }}>📋</div>
                            <div>
                                <p style={{
                                    margin: '0 0 2px', fontSize: '10px', fontWeight: 700,
                                    letterSpacing: '0.1em', color: '#D4A843', textTransform: 'uppercase',
                                }}>
                                    {selected ? 'Edit Record' : 'New Record'}
                                </p>
                                <h5 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                                    {selected ? 'Update FollowUp' : 'Add FollowUp'}
                                </h5>
                            </div>
                        </div>

                        <svg viewBox="0 0 480 12" style={{ display: 'block', marginBottom: '-1px' }} preserveAspectRatio="none">
                            <path d="M0,0 C120,12 360,12 480,0 L480,12 L0,12 Z" fill="#fff" />
                        </svg>
                    </div>

                    {/* Body — scrollable on small screens */}
                    <div style={{ padding: '18px 20px 20px', overflowY: 'auto', flex: 1 }}>

                        {/* Error */}
                        {error && (
                            <div style={{
                                background: '#FEF2F2', border: '1px solid #FECACA',
                                borderRadius: '8px', padding: '10px 12px', marginBottom: '14px',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '12px', color: '#DC2626',
                            }}>
                                <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* Hearing Date + Next Hearing Date — side by side on desktop, stacked on mobile */}
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

                            {/* Interim Order */}
                            <div style={{ marginBottom: '14px' }}>
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
                            </div>

                            {/* Decision */}
                            <div style={{ marginBottom: '14px' }}>
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
                            </div>

                            {/* Remarks */}
                            <div style={{ marginBottom: '20px' }}>
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
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    className="fu-cancel"
                                    onClick={onClose}
                                    disabled={isPending}
                                    style={{
                                        flex: 1, padding: '10px 12px',
                                        background: '#F8F6F0', color: '#64748B',
                                        border: '1px solid #E2DECE', borderRadius: '8px',
                                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="fu-submit"
                                    disabled={isPending}
                                    style={{
                                        flex: 2, padding: '10px 12px',
                                        background: '#D4A843', color: '#1B2A4A',
                                        border: 'none', borderRadius: '8px',
                                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 8px rgba(212,168,67,0.3)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '6px',
                                    }}
                                >
                                    {isPending ? (
                                        <>
                                            <div style={{
                                                width: '12px', height: '12px', borderRadius: '50%',
                                                border: '2px solid rgba(27,42,74,0.3)',
                                                borderTop: '2px solid #1B2A4A',
                                                animation: 'spin 0.8s linear infinite',
                                            }} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>{selected ? '✓ Update' : '+ Create'}</>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

// ── Numbered field label helper ──────────────────────────────
const FuField = ({
    num, label, required, optional, children,
}: {
    num: number
    label: string
    required?: boolean
    optional?: boolean
    children: React.ReactNode
}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', fontWeight: 700, color: '#4A5568',
            letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
            <span style={{
                width: '16px', height: '16px', borderRadius: '4px',
                background: '#1B2A4A', color: '#D4A843',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 800, flexShrink: 0,
            }}>{num}</span>
            {label}
            {required && <span style={{ color: '#DC2626' }}>*</span>}
            {optional && (
                <span style={{
                    fontSize: '9px', color: '#A0ABBE', background: '#F1F5F9',
                    borderRadius: '4px', padding: '1px 5px', fontWeight: 600,
                    textTransform: 'none', letterSpacing: 0,
                }}>Optional</span>
            )}
        </label>
        {children}
    </div>
)

export default FollowUpForm
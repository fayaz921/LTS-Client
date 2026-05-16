// components/FollowUpForm.tsx - Compact Size with Full Styling

import { useState, useEffect } from 'react'
import type { FollowUp } from '../types/followup.types'
import { useCreateFollowUp, useUpdateFollowUp } from '../hooks/useFollowups'

interface Props {
    selected?: FollowUp
    onClose: () => void
}

const FollowUpForm = ({ selected, onClose }: Props) => {
    const [form, setForm] = useState({
        caseId: '',
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
                caseId: selected.caseId,
                hearingDate: selected.hearingDate ? selected.hearingDate.split('T')[0] : '',
                nextHearingDate: selected.nextHearingDate ? selected.nextHearingDate.split('T')[0] : '',
                interimOrder: selected.interimOrder ?? '',
                decision: selected.decision ?? '',
                remarks: selected.remarks ?? '',
            })
        } else {
            setForm({
                caseId: '',
                hearingDate: '',
                nextHearingDate: '',
                interimOrder: '',
                decision: '',
                remarks: '',
            })
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

        if (!form.caseId || !form.hearingDate) {
            setError('Case ID and Hearing Date are required')
            return
        }

        const payload = {
            caseId: form.caseId,
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
            createFollowUp(
                payload,
                {
                    onSuccess: () => onClose(),
                    onError: (err: any) =>
                        setError(err.response?.data?.message || 'Create failed'),
                }
            )
        }
    }

    return (
        <>
            <style>{`
                @keyframes backdropIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: translateY(-20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0px);  }
                    50%      { transform: translateY(-4px); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .followup-input, .followup-textarea {
                    width: 100%;
                    padding: 8px 12px;
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
                .followup-input:focus, .followup-textarea:focus {
                    border-color: #D4A843;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(212,168,67,0.12);
                }
                .followup-input::placeholder, .followup-textarea::placeholder { color: #B0BBCA; }
                .followup-textarea {
                    resize: vertical;
                    min-height: 60px;
                }
                .followup-cancel-btn:hover {
                    background: #E8EDF5 !important;
                    color: #1B2A4A !important;
                }
                .followup-submit-btn:hover:not(:disabled) {
                    background: #C49830 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(212,168,67,0.3) !important;
                }
                .followup-submit-btn:active:not(:disabled) { transform: translateY(0); }
                .followup-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .followup-close-btn:hover { background: #F0EBE0 !important; color: #1B2A4A !important; }
            `}</style>

            <div
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(15, 25, 50, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'backdropIn 0.2s ease',
                }}
                onClick={onClose}
            >
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        width: '100%', maxWidth: '460px',
                        margin: '16px',
                        overflow: 'hidden',
                        animation: 'modalSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        boxShadow: '0 20px 60px rgba(15,25,50,0.25)',
                    }}
                    onClick={e => e.stopPropagation()}
                >

                    {/* Compact Top Banner */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1B2A4A 0%, #243560 50%, #1B2A4A 100%)',
                        padding: '20px 20px 0',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Decorative circles - smaller */}
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

                        {/* Close button - smaller */}
                        <button
                            onClick={onClose}
                            className="followup-close-btn"
                            style={{
                                position: 'absolute', top: '12px', right: '12px',
                                width: '28px', height: '28px', borderRadius: '6px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '16px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s ease', zIndex: 1,
                            }}
                        >
                            ×
                        </button>

                        {/* Icon + Title - compact */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '22px',
                                boxShadow: '0 6px 16px rgba(212,168,67,0.3)',
                                animation: 'iconFloat 3s ease-in-out infinite',
                            }}>
                                📋
                            </div>
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

                        {/* Wave divider - compact */}
                        <svg viewBox="0 0 460 12" style={{ display: 'block', marginBottom: '-1px' }} preserveAspectRatio="none">
                            <path d="M0,0 C115,12 345,12 460,0 L460,12 L0,12 Z" fill="#fff" />
                        </svg>
                    </div>

                    {/* Compact Body */}
                    <div style={{ padding: '20px' }}>
                        {error && (
                            <div style={{
                                background: '#FEF2F2', border: '1px solid #FECACA',
                                borderRadius: '8px', padding: '8px 12px',
                                marginBottom: '16px',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '12px', color: '#DC2626',
                            }}>
                                <span style={{ fontSize: '14px' }}>⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* Case ID */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '11px', fontWeight: 700,
                                    color: '#4A5568', letterSpacing: '0.05em',
                                    textTransform: 'uppercase', marginBottom: '6px',
                                }}>
                                    <span style={{
                                        width: '16px', height: '16px', borderRadius: '4px',
                                        background: '#1B2A4A', color: '#D4A843',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '9px', fontWeight: 800,
                                    }}>1</span>
                                    Case ID
                                    <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
                                </label>
                                <input
                                    name="caseId"
                                    value={form.caseId}
                                    onChange={handleChange}
                                    placeholder="Enter Case ID"
                                    required
                                    className="followup-input"
                                />
                            </div>

                            {/* Hearing Date & Next Hearing Date */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '11px', fontWeight: 700,
                                        color: '#4A5568', letterSpacing: '0.05em',
                                        textTransform: 'uppercase', marginBottom: '6px',
                                    }}>
                                        <span style={{
                                            width: '16px', height: '16px', borderRadius: '4px',
                                            background: '#1B2A4A', color: '#D4A843',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '9px', fontWeight: 800,
                                        }}>2</span>
                                        Hearing Date
                                        <span style={{ color: '#DC2626' }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="hearingDate"
                                        value={form.hearingDate}
                                        onChange={handleChange}
                                        required
                                        className="followup-input"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '11px', fontWeight: 700,
                                        color: '#4A5568', letterSpacing: '0.05em',
                                        textTransform: 'uppercase', marginBottom: '6px',
                                    }}>
                                        <span style={{
                                            width: '16px', height: '16px', borderRadius: '4px',
                                            background: '#1B2A4A', color: '#D4A843',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '9px', fontWeight: 800,
                                        }}>3</span>
                                        Next Date
                                    </label>
                                    <input
                                        type="date"
                                        name="nextHearingDate"
                                        value={form.nextHearingDate}
                                        onChange={handleChange}
                                        className="followup-input"
                                    />
                                </div>
                            </div>

                            {/* Interim Order */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '11px', fontWeight: 700,
                                    color: '#4A5568', letterSpacing: '0.05em',
                                    textTransform: 'uppercase', marginBottom: '6px',
                                }}>
                                    <span style={{
                                        width: '16px', height: '16px', borderRadius: '4px',
                                        background: '#1B2A4A', color: '#D4A843',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '9px', fontWeight: 800,
                                    }}>4</span>
                                    Interim Order
                                </label>
                                <textarea
                                    name="interimOrder"
                                    value={form.interimOrder}
                                    onChange={handleChange}
                                    placeholder="Interim order..."
                                    rows={2}
                                    className="followup-textarea"
                                />
                            </div>

                            {/* Decision */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '11px', fontWeight: 700,
                                    color: '#4A5568', letterSpacing: '0.05em',
                                    textTransform: 'uppercase', marginBottom: '6px',
                                }}>
                                    <span style={{
                                        width: '16px', height: '16px', borderRadius: '4px',
                                        background: '#1B2A4A', color: '#D4A843',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '9px', fontWeight: 800,
                                    }}>5</span>
                                    Decision
                                </label>
                                <textarea
                                    name="decision"
                                    value={form.decision}
                                    onChange={handleChange}
                                    placeholder="Decision..."
                                    rows={2}
                                    className="followup-textarea"
                                />
                            </div>

                            {/* Remarks */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '11px', fontWeight: 700,
                                    color: '#4A5568', letterSpacing: '0.05em',
                                    textTransform: 'uppercase', marginBottom: '6px',
                                }}>
                                    <span style={{
                                        width: '16px', height: '16px', borderRadius: '4px',
                                        background: '#1B2A4A', color: '#D4A843',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '9px', fontWeight: 800,
                                    }}>6</span>
                                    Remarks
                                </label>
                                <textarea
                                    name="remarks"
                                    value={form.remarks}
                                    onChange={handleChange}
                                    placeholder="Remarks..."
                                    rows={2}
                                    className="followup-textarea"
                                />
                            </div>

                            {/* Buttons - Compact */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    className="followup-cancel-btn"
                                    onClick={onClose}
                                    disabled={isPending}
                                    style={{
                                        flex: 1, padding: '8px 12px',
                                        background: '#F8F6F0', color: '#64748B',
                                        border: '1px solid #E2DECE',
                                        borderRadius: '8px', fontSize: '12px',
                                        fontWeight: 600, cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="followup-submit-btn"
                                    disabled={isPending}
                                    style={{
                                        flex: 2, padding: '8px 12px',
                                        background: '#D4A843', color: '#1B2A4A',
                                        border: 'none',
                                        borderRadius: '8px', fontSize: '12px',
                                        fontWeight: 700, cursor: 'pointer',
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

export default FollowUpForm
import { useState, useEffect } from 'react'
import type { Court } from '../types/court.types'
import { useCreateCourt, useUpdateCourt } from '../hooks/useCourts'

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface Props {
    selected?: Court
    onClose: () => void
}

// ─────────────────────────────────────────────────────────────
// CourtForm Component
// ─────────────────────────────────────────────────────────────

const CourtForm = ({ selected, onClose }: Props) => {
    const [form, setForm] = useState({
        courtName: '',
        addressContact: '',
        isActive: true,
    })
    const [error, setError] = useState('')

    const { mutate: createCourt, isPending: creating } = useCreateCourt()
    const { mutate: updateCourt, isPending: updating } = useUpdateCourt()
    const isPending = creating || updating

    useEffect(() => {
        if (selected) {
            setForm({
                courtName: selected.courtName,
                addressContact: selected.addressContact ?? '',
                isActive: selected.isActive,
            })
        } else {
            setForm({ courtName: '', addressContact: '', isActive: true })
            setError('')
        }
    }, [selected])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (selected) {
            updateCourt(
                { id: selected.id, ...form },
                {
                    onSuccess: () => onClose(),
                    onError: (err: any) =>
                        setError(err.response?.data?.message || 'Update failed'),
                }
            )
        } else {
            createCourt(
                { courtName: form.courtName, addressContact: form.addressContact || undefined },
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
                .court-input {
                    width: 100%;
                    padding: 11px 14px;
                    border: 1.5px solid #E2DECE;
                    border-radius: 10px;
                    font-size: 13px;
                    color: #1B2A4A;
                    background: #FDFCF9;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .court-input:focus {
                    border-color: #D4A843;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(212,168,67,0.12);
                }
                .court-input::placeholder { color: #B0BBCA; }
                .court-cancel-btn:hover {
                    background: #E8EDF5 !important;
                    color: #1B2A4A !important;
                }
                .court-submit-btn:hover:not(:disabled) {
                    background: #C49830 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(212,168,67,0.4) !important;
                }
                .court-submit-btn:active:not(:disabled) { transform: translateY(0); }
                .court-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .court-close-btn:hover { background: #F0EBE0 !important; color: #1B2A4A !important; }
                .court-toggle-track {
                    width: 44px; height: 24px; border-radius: 12px;
                    transition: background 0.25s ease; cursor: pointer;
                    position: relative; flex-shrink: 0;
                }
                .court-toggle-thumb {
                    position: absolute; top: 3px; left: 3px;
                    width: 18px; height: 18px; border-radius: 50%;
                    background: #fff; transition: transform 0.25s ease;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                }
            `}</style>

            {/* ── Backdrop ── */}
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
                {/* ── Modal ── */}
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '20px',
                        width: '100%', maxWidth: '480px',
                        margin: '16px',
                        overflow: 'hidden',
                        animation: 'modalSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        boxShadow: '0 24px 80px rgba(15,25,50,0.25), 0 8px 24px rgba(15,25,50,0.12)',
                    }}
                    onClick={e => e.stopPropagation()}
                >

                    {/* ── Top Banner ── */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1B2A4A 0%, #243560 50%, #1B2A4A 100%)',
                        padding: '28px 28px 0',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Decorative circles */}
                        <div style={{
                            position: 'absolute', top: '-20px', right: '-20px',
                            width: '120px', height: '120px', borderRadius: '50%',
                            border: '1px solid rgba(212,168,67,0.15)',
                        }} />
                        <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            width: '70px', height: '70px', borderRadius: '50%',
                            border: '1px solid rgba(212,168,67,0.10)',
                        }} />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="court-close-btn"
                            style={{
                                position: 'absolute', top: '16px', right: '16px',
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '18px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s ease', lineHeight: 1, zIndex: 1,
                            }}
                        >
                            ×
                        </button>

                        {/* Icon + Title */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '24px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #D4A843 0%, #E8C05A 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '28px',
                                boxShadow: '0 8px 24px rgba(212,168,67,0.4)',
                                animation: 'iconFloat 3s ease-in-out infinite',
                            }}>
                                ⚖️
                            </div>
                            <div>
                                <p style={{
                                    margin: '0 0 3px', fontSize: '11px', fontWeight: 700,
                                    letterSpacing: '0.1em', color: '#D4A843', textTransform: 'uppercase',
                                }}>
                                    {selected ? 'Edit Record' : 'New Record'}
                                </p>
                                <h5 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#fff' }}>
                                    {selected ? 'Update Court' : 'Add Court'}
                                </h5>
                            </div>
                        </div>

                        {/* Wave divider */}
                        <svg viewBox="0 0 480 20" style={{ display: 'block', marginBottom: '-1px' }} preserveAspectRatio="none">
                            <path d="M0,0 C120,20 360,20 480,0 L480,20 L0,20 Z" fill="#fff" />
                        </svg>
                    </div>

                    {/* ── Body ── */}
                    <div style={{ padding: '24px 28px 28px' }}>

                        {/* Error */}
                        {error && (
                            <div style={{
                                background: '#FEF2F2', border: '1px solid #FECACA',
                                borderRadius: '10px', padding: '12px 16px',
                                marginBottom: '20px',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                fontSize: '13px', color: '#DC2626',
                            }}>
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* ── Court Name ── */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '12px', fontWeight: 700,
                                    color: '#4A5568', letterSpacing: '0.05em',
                                    textTransform: 'uppercase', marginBottom: '8px',
                                }}>
                                    <span style={{
                                        width: '18px', height: '18px', borderRadius: '5px',
                                        background: '#1B2A4A', color: '#D4A843',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '10px', fontWeight: 800,
                                    }}>1</span>
                                    Court Name
                                    <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
                                </label>
                                <input
                                    name="courtName"
                                    value={form.courtName}
                                    onChange={handleChange}
                                    placeholder="e.g. High Court Islamabad, Supreme Court..."
                                    required
                                    maxLength={100}
                                    className="court-input"
                                />
                            </div>

                            {/* ── Address / Contact ── */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '12px', fontWeight: 700,
                                    color: '#4A5568', letterSpacing: '0.05em',
                                    textTransform: 'uppercase', marginBottom: '8px',
                                }}>
                                    <span style={{
                                        width: '18px', height: '18px', borderRadius: '5px',
                                        background: '#1B2A4A', color: '#D4A843',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '10px', fontWeight: 800,
                                    }}>2</span>
                                    Address / Contact
                                    <span style={{
                                        fontSize: '10px', color: '#A0ABBE',
                                        background: '#F1F5F9', borderRadius: '4px',
                                        padding: '2px 6px', fontWeight: 600,
                                        textTransform: 'none', letterSpacing: 0,
                                    }}>Optional</span>
                                </label>
                                <input
                                    name="addressContact"
                                    value={form.addressContact}
                                    onChange={handleChange}
                                    placeholder="Court address ya contact number..."
                                    maxLength={500}
                                    className="court-input"
                                />
                            </div>

                            {/* ── Status Toggle — only in edit mode ── */}
                            {selected && (
                                <div
                                    style={{
                                        marginBottom: '28px',
                                        background: form.isActive ? '#F0FDF4' : '#FEF2F2',
                                        border: `1px solid ${form.isActive ? '#BBF7D0' : '#FECACA'}`,
                                        borderRadius: '12px',
                                        padding: '14px 16px',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                                >
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1B2A4A' }}>
                                            Court Status
                                        </p>
                                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: form.isActive ? '#16A34A' : '#DC2626' }}>
                                            {form.isActive
                                                ? '✓ Active — visible in system'
                                                : '✗ Inactive — hidden from system'}
                                        </p>
                                    </div>
                                    <div
                                        className="court-toggle-track"
                                        style={{ background: form.isActive ? '#22C55E' : '#E2E8F0' }}
                                    >
                                        <div
                                            className="court-toggle-thumb"
                                            style={{ transform: form.isActive ? 'translateX(20px)' : 'translateX(0)' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── Buttons ── */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    className="court-cancel-btn"
                                    onClick={onClose}
                                    disabled={isPending}
                                    style={{
                                        flex: 1, padding: '12px',
                                        background: '#F8F6F0', color: '#64748B',
                                        border: '1px solid #E2DECE',
                                        borderRadius: '10px', fontSize: '13px',
                                        fontWeight: 600, cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="court-submit-btn"
                                    disabled={isPending}
                                    style={{
                                        flex: 2, padding: '12px',
                                        background: '#D4A843', color: '#1B2A4A',
                                        border: 'none',
                                        borderRadius: '10px', fontSize: '13px',
                                        fontWeight: 700, cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 4px 12px rgba(212,168,67,0.3)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '8px',
                                    }}
                                >
                                    {isPending ? (
                                        <>
                                            <div style={{
                                                width: '14px', height: '14px', borderRadius: '50%',
                                                border: '2px solid rgba(27,42,74,0.3)',
                                                borderTop: '2px solid #1B2A4A',
                                                animation: 'spin 0.8s linear infinite',
                                            }} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>{selected ? '✓ Update Court' : '+ Create Court'}</>
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

export default CourtForm
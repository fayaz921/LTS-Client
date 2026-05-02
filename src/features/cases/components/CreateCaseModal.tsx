import React, { useState } from 'react';
import '../styles/case-list.css';

export default function CreateCaseModal({ onClose }: { onClose: () => void }) {
    const [selectedDate, setSelectedDate] = useState('');

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '860px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                    animation: 'slideIn 0.3s ease',
                }}
            >
                {/* MODAL HEADER */}
                <div
                    style={{
                        background: 'var(--lts-navy)',
                        color: 'white',
                        padding: '18px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        borderRadius: '12px 12px 0 0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                background: 'rgba(212,168,67,0.2)',
                                borderRadius: '8px',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <i className="bi bi-file-earmark-plus" style={{ color: 'var(--lts-gold)', fontSize: '18px' }}></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '700' }}>File New Case</div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                                Complete all required fields to register a new case
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* MODAL BODY */}
                <div style={{ background: 'var(--lts-bg)', padding: '24px' }}>
                    {/* SECTION I */}
                    <div style={{ marginBottom: '16px' }}>
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '8px 8px 0 0',
                                border: '1px solid var(--lts-border)',
                                borderBottom: 'none',
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    background: 'var(--lts-navy)',
                                    color: 'white',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                I
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--lts-navy)' }}>
                                JURISDICTION & ASSIGNMENT
                            </div>
                        </div>
                        <div
                            style={{
                                background: 'white',
                                border: '1px solid var(--lts-border)',
                                borderRadius: '0 0 8px 8px',
                                padding: '20px',
                            }}
                        >
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Court <span style={{ color: '#7a1f1f' }}>*</span>
                                    </label>
                                    <select className="form-control" style={{ border: '1px solid var(--lts-border)', borderRadius: 'var(--lts-radius)', background: '#fdfcfa', fontSize: '15px', padding: '9px 12px', width: '100%', color: 'var(--lts-text-dark)' }}>
                                        <option>— Select Court —</option>
                                        <option>Peshawar High Court</option>
                                        <option>District & Sessions Court Peshawar</option>
                                        <option>Civil Court Peshawar</option>
                                        <option>Anti-Terrorism Court KPK</option>
                                        <option>Accountability Court</option>
                                        <option>Family Court Peshawar</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Department <span style={{ color: '#7a1f1f' }}>*</span>
                                    </label>
                                    <select className="form-control" style={{ border: '1px solid var(--lts-border)', borderRadius: 'var(--lts-radius)', background: '#fdfcfa', fontSize: '15px', padding: '9px 12px', width: '100%', color: 'var(--lts-text-dark)' }}>
                                        <option>— Select Department —</option>
                                        <option>Civil</option>
                                        <option>Criminal</option>
                                        <option>Family</option>
                                        <option>Constitutional</option>
                                        <option>Corporate & Commercial</option>
                                        <option>Revenue</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION II */}
                    <div style={{ marginBottom: '16px' }}>
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '8px 8px 0 0',
                                border: '1px solid var(--lts-border)',
                                borderBottom: 'none',
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    background: 'var(--lts-navy)',
                                    color: 'white',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                II
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--lts-navy)' }}>
                                PETITIONER & COUNSEL
                            </div>
                        </div>
                        <div
                            style={{
                                background: 'white',
                                border: '1px solid var(--lts-border)',
                                borderRadius: '0 0 8px 8px',
                                padding: '20px',
                            }}
                        >
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Petitioner <span style={{ color: '#7a1f1f' }}>*</span>
                                    </label>
                                    <select className="form-control" style={{ border: '1px solid var(--lts-border)', borderRadius: 'var(--lts-radius)', background: '#fdfcfa', fontSize: '15px', padding: '9px 12px', width: '100%', color: 'var(--lts-text-dark)' }}>
                                        <option>— Select Petitioner —</option>
                                        <option>Muhammad Ali Khan</option>
                                        <option>Fatima Bibi</option>
                                        <option>Ahmed Enterprises (Pvt.) Ltd.</option>
                                        <option>Noor-ul-Haq</option>
                                        <option>Zainab Sultana</option>
                                    </select>
                                    <div style={{ background: 'var(--lts-gold-light)', border: '1px solid var(--lts-gold)', borderRadius: '5px', padding: '8px 12px', fontSize: '13px', color: '#555', marginTop: '8px' }}>
                                        ℹ CNIC: — · Email: —
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">
                                        DAG / Opposing Counsel <span style={{ color: '#7a1f1f' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Barrister Imran Raza"
                                        style={{ border: '1px solid var(--lts-border)', borderRadius: 'var(--lts-radius)', background: '#fdfcfa', fontSize: '15px', padding: '9px 12px', width: '100%', color: 'var(--lts-text-dark)' }}
                                    />
                                    <small style={{ fontSize: '12px', color: 'var(--lts-text-light)', fontStyle: 'italic', display: 'block', marginTop: '5px' }}>
                                        Deputy Attorney General or opposing counsel name
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION III */}
                    <div style={{ marginBottom: '16px' }}>
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '8px 8px 0 0',
                                border: '1px solid var(--lts-border)',
                                borderBottom: 'none',
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    background: 'var(--lts-navy)',
                                    color: 'white',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                III
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--lts-navy)' }}>
                                CASE PARTICULARS
                            </div>
                        </div>
                        <div
                            style={{
                                background: 'white',
                                border: '1px solid var(--lts-border)',
                                borderRadius: '0 0 8px 8px',
                                padding: '20px',
                            }}
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <label className="form-label">
                                    Case Title <span style={{ color: '#7a1f1f' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Muhammad Ali Khan vs. Province of KPK"
                                    style={{ border: '1px solid var(--lts-border)', borderRadius: 'var(--lts-radius)', background: '#fdfcfa', fontSize: '15px', padding: '9px 12px', width: '100%', color: 'var(--lts-text-dark)' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label className="form-label">
                                    Subject Matter <span style={{ color: '#7a1f1f' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Wrongful termination / Property dispute"
                                    style={{ border: '1px solid var(--lts-border)', borderRadius: 'var(--lts-radius)', background: '#fdfcfa', fontSize: '15px', padding: '9px 12px', width: '100%', color: 'var(--lts-text-dark)' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label className="form-label">
                                    Case Detail & Background <span style={{ color: '#7a1f1f' }}>*</span>
                                </label>
                                <textarea
                                    className="form-control"
                                    placeholder="Describe the facts, legal grounds, and reliefs sought..."
                                    style={{ border: '1px solid var(--lts-border)', borderRadius: 'var(--lts-radius)', background: '#fdfcfa', fontSize: '15px', padding: '9px 12px', width: '100%', color: 'var(--lts-text-dark)', minHeight: '100px', resize: 'vertical' }}
                                    rows={4}
                                />
                                <div style={{ textAlign: 'right', marginTop: '6px', fontSize: '11px', color: '#aaa', fontFamily: 'monospace' }}>
                                    0 / 2000
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION IV */}
                    <div style={{ marginBottom: '16px' }}>
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '8px 8px 0 0',
                                border: '1px solid var(--lts-border)',
                                borderBottom: 'none',
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    background: 'var(--lts-navy)',
                                    color: 'white',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                IV
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--lts-navy)' }}>
                                DATE OF INSTITUTION
                            </div>
                        </div>
                        <div
                            style={{
                                background: 'white',
                                border: '1px solid var(--lts-border)',
                                borderRadius: '0 0 8px 8px',
                                padding: '20px',
                            }}
                        >
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Date Instituted <span style={{ color: '#7a1f1f' }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                        style={{ border: '1px solid var(--lts-border)', borderRadius: 'var(--lts-radius)', background: '#fdfcfa', fontSize: '15px', padding: '9px 12px', width: '100%', color: 'var(--lts-text-dark)' }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <label className="form-label">Full Date Reference</label>
                                    <div
                                        style={{
                                            background: '#F8FAFC',
                                            border: '1px solid var(--lts-border)',
                                            borderRadius: 'var(--lts-radius)',
                                            padding: '9px 14px',
                                            fontSize: '14px',
                                            color: 'var(--lts-text-gray)',
                                            fontStyle: 'italic',
                                            minHeight: '42px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <i className="bi bi-calendar3 me-2 text-muted"></i>
                                        {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date above'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION V */}
                    <div style={{ marginBottom: '16px' }}>
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '8px 8px 0 0',
                                border: '1px solid var(--lts-border)',
                                borderBottom: 'none',
                                padding: '10px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    background: 'var(--lts-navy)',
                                    color: 'white',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                V
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--lts-navy)' }}>
                                EMAIL NOTIFICATION LIST
                            </div>
                        </div>
                        <div
                            style={{
                                background: 'white',
                                border: '1px solid var(--lts-border)',
                                borderRadius: '0 0 8px 8px',
                                padding: '20px',
                            }}
                        >
                            <label className="form-label">Notify Recipients</label>
                            <div
                                style={{
                                    border: '1px solid var(--lts-border)',
                                    borderRadius: 'var(--lts-radius)',
                                    background: '#fdfcfa',
                                    minHeight: '44px',
                                    padding: '6px 10px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    gap: '5px',
                                    marginBottom: '10px',
                                }}
                            >
                                <div
                                    style={{
                                        background: 'var(--lts-gold-light)',
                                        border: '1px solid var(--lts-gold)',
                                        color: 'var(--lts-navy)',
                                        fontSize: '12px',
                                        fontFamily: 'monospace',
                                        padding: '2px 8px',
                                        borderRadius: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    ali@example.com
                                    <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 2px' }}>
                                        ×
                                    </button>
                                </div>
                                <div
                                    style={{
                                        background: 'var(--lts-gold-light)',
                                        border: '1px solid var(--lts-gold)',
                                        color: 'var(--lts-navy)',
                                        fontSize: '12px',
                                        fontFamily: 'monospace',
                                        padding: '2px 8px',
                                        borderRadius: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    petitioner@bar.com
                                    <button style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0 2px' }}>
                                        ×
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type email and press Enter..."
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                        fontSize: '14px',
                                        flex: 1,
                                        minWidth: '150px',
                                    }}
                                />
                            </div>
                            <small style={{ fontSize: '12px', color: 'var(--lts-text-light)', fontStyle: 'italic' }}>
                                <i className="bi bi-envelope me-1"></i>
                                Recipients will receive hearing & update notifications.
                            </small>
                        </div>
                    </div>
                </div>

                {/* MODAL FOOTER */}
                <div
                    style={{
                        background: 'white',
                        borderTop: '1px solid var(--lts-border)',
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        position: 'sticky',
                        bottom: 0,
                    }}
                >
                    <small style={{ fontSize: '12px', color: 'var(--lts-text-gray)', fontStyle: 'italic' }}>
                        <span style={{ color: 'red' }}>*</span> Required fields must be completed before filing
                    </small>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            style={{
                                background: 'white',
                                border: '1px solid var(--lts-border)',
                                color: '#555',
                                padding: '8px 20px',
                                borderRadius: 'var(--lts-radius)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f0f0f0')}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'white')}
                        >
                            <i className="bi bi-arrow-counterclockwise me-1"></i> Clear
                        </button>
                        <button
                            style={{
                                background: 'var(--lts-navy)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 28px',
                                borderRadius: 'var(--lts-radius)',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '15px',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--lts-gold)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--lts-navy)')}
                        >
                            <i className="bi bi-send me-1"></i> File Case
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}

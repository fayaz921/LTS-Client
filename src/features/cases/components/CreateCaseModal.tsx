import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import '../styles/case-list.css';
import '../styles/create-case.css';
import { HandleCreateCase, DropDownPetitioners, DropDownDepartments, DropDownCourts } from '../hooks/useCases';
import type { PetitionerDto } from '../../petitioners/types/petitioner.types';
import type { Department } from '../../departments/types/department.types';
import type { Court } from '../../courts/types/court.types';
import type { CreateCaseDto } from "../types/case.types";

const toUtcInstitutionDate = (date: string) => {
    return new Date(`${date}T00:00:00.000Z`).toISOString();
};

interface CreateCaseModalProps {
    onClose: () => void;
}

export default function CreateCaseModal({ onClose }: CreateCaseModalProps) {

    // ── Date ────────────────────────────────────────────────
    const [selectedDate, setSelectedDate] = useState('');

    // ── Petitioner ──────────────────────────────────────────
    const [petitionerEnabled, setPetitionerEnabled] = useState(false);
    const [selectedPetitionerId, setSelectedPetitionerId] = useState('');

    // ── Department ──────────────────────────────────────────
    const [deptEnabled, setDeptEnabled] = useState(false);

    // ── Court ───────────────────────────────────────────────
    const [courtEnabled, setCourtEnabled] = useState(false);

    // ── Email tags ──────────────────────────────────────────
    const [emailInput, setEmailInput] = useState('');
    const [emailTags, setEmailTags] = useState<string[]>([]);

    // Form States 
    const [courtId, setCourtId] = useState('');
    const [deptId, setDeptId] = useState('');
    const [dag, setDag] = useState('');
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [detail, setDetail] = useState('');

    // ── Hooks ───────────────────────────────────────────────
    const {
        data: petData,
        isLoading: petLoading,
        isError: petError,
        refetch: refetchPetitioners,
    } = DropDownPetitioners(petitionerEnabled);

    const {
        data: deptData,
        isLoading: deptLoading,
        isError: deptError,
        refetch: refetchDepts,
    } = DropDownDepartments(deptEnabled);

    const {
        data: courtData,
        isLoading: courtLoading,
        isError: courtError,
        refetch: refetchCourts,
    } = DropDownCourts(courtEnabled);

    const { mutate: createCase, isPending, isError: submitError } = HandleCreateCase()

// ─────────────────────────────────────────────────────────────
// SAFE DROPDOWN DATA
// ─────────────────────────────────────────────────────────────

const petitioners: PetitionerDto[] = petData?.data ?? [];

// Departments
const departments: Department[] = deptData ?? [];

// Courts
const courts: Court[] = courtData?.items ?? [];


    // ── Selected petitioner → info pill ─────────────────────
    const selected = petitioners.find((p) => p.id === selectedPetitionerId);
    const cnicDisplay = selected?.cnic ?? '—';
    const emailDisplay = selected?.email ?? '—';

    // ── Email tag handlers ───────────────────────────────────
    const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

    const addEmailTag = () => {
        const trimmed = emailInput.trim();
        if (!trimmed) return;
        if (!isValidEmail(trimmed)) return;
        if (emailTags.includes(trimmed)) return; // duplicate nahi
        setEmailTags(prev => [...prev, trimmed]);
        setEmailInput('');
    };

    const handleEmailKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addEmailTag();
        }
        // Backspace se last tag remove
        if (e.key === 'Backspace' && emailInput === '' && emailTags.length > 0) {
            setEmailTags(prev => prev.slice(0, -1));
        }
    };

    const removeEmailTag = (tag: string) => {
        setEmailTags(prev => prev.filter((t) => t !== tag));
    };

    // ── Refresh handlers — enabled true karo + refetch ──────
    const handleRefreshPetitioners = () => {
        setPetitionerEnabled(true);
        refetchPetitioners();
    };
    const handleRefreshDepts = () => {
        setDeptEnabled(true);
        refetchDepts();
    };
    const handleRefreshCourts = () => {
        setCourtEnabled(true);
        refetchCourts();
    };

    // submit handler
    const handleSubmit = () => {
        // simple required check
        if (!courtId || !deptId || !selectedPetitionerId || !dag || !title || !subject || !detail || !selectedDate) {
            alert('Please fill all required fields')
            return
        }

        const payload: CreateCaseDto = {
            courtId,
            departmentId: deptId,
            petitionerId: selectedPetitionerId,
            dag,
            title,
            subject,
            detail,
            dateInstitution: toUtcInstitutionDate(selectedDate),
            emailList: emailTags.join(','),            // ["a@b.com","c@d.com"] → "a@b.com,c@d.com"
        }

        createCase(payload, {
            onSuccess: (res) => {
                if (res.isSuccess) {
                    onClose()   // modal band karo
                }
            }
        })
    }

    // ── Reusable dropdown renderer ───────────────────────────
    const renderDropdown = (
        id: string,
        value: string,
        onChange: (v: string) => void,
        onFocusCb: () => void,
        onRefresh: () => void,
        isLoading: boolean,
        isError: boolean,
        enabled: boolean,
        items: { id: string; label: string }[],
        placeholder: string,
        emptyMsg: string,
        errorMsg: string,
    ) => (
        <div className="ccm__select-wrapper">
            <select
                id={id}
                className="ccm__select"
                value={value}
                onFocus={onFocusCb}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <option>Loading…</option>
                ) : isError ? (
                    <option>Error — refresh karo</option>
                ) : items.length === 0 && enabled ? (
                    <option disabled value="">{emptyMsg}</option>
                ) : (
                    <>
                        <option value="">{placeholder}</option>
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.label}
                            </option>
                        ))}
                    </>
                )}
            </select>

            {/* Refresh icon — select ke saath */}
            <button
                type="button"
                className={`ccm__refresh-btn ${isLoading ? 'ccm__refresh-btn--spinning' : ''}`}
                onClick={onRefresh}
                title="Refresh"
                disabled={isLoading}
            >
                <i className="bi bi-arrow-clockwise"></i>
            </button>

            {/* Error message neeche */}
            {isError && !isLoading && (
                <div className="ccm__select-error">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    {errorMsg}
                </div>
            )}
        </div>
    );

    return (
        <div className="ccm__overlay">
            <div className="ccm__dialog">

                {/* HEADER */}
                <div className="ccm__header">
                    <div className="ccm__header-left">
                        <div className="ccm__header-icon">
                            <i className="bi bi-file-earmark-plus"></i>
                        </div>
                        <div>
                            <div className="ccm__header-title">File New Case</div>
                            <div className="ccm__header-subtitle">
                                Complete all required fields to register a new case
                            </div>
                        </div>
                    </div>
                    <button className="ccm__close-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* BODY */}
                <div className="ccm__body">

                    {/* SECTION I — JURISDICTION & ASSIGNMENT */}
                    <div className="ccm__section">
                        <div className="ccm__section-header">
                            <div className="ccm__section-badge">I</div>
                            <div className="ccm__section-title">JURISDICTION &amp; ASSIGNMENT</div>
                        </div>
                        <div className="ccm__section-body">
                            <div className="row g-3">

                                {/* Court */}
                                <div className="col-md-6">
                                    <label className="ccm__label">
                                        Court <span className="ccm__required">*</span>
                                    </label>
                                    {renderDropdown(
                                        'court',
                                        courtId,
                                        setCourtId,
                                        () => setCourtEnabled(true),
                                        handleRefreshCourts,
                                        courtLoading,
                                        courtError,
                                        courtEnabled,
                                        courts.map(c => ({ id: c.id, label: c.courtName })),
                                        '— Select Court —',
                                        'No courts found',
                                        'Courts load nahi ho sake',
                                    )}
                                </div>

                                {/* Department */}
                                <div className="col-md-6">
                                    <label className="ccm__label">
                                        Department <span className="ccm__required">*</span>
                                    </label>
                                    {renderDropdown(
                                        'department',
                                        deptId,
                                        setDeptId,
                                        () => setDeptEnabled(true),
                                        handleRefreshDepts,
                                        deptLoading,
                                        deptError,
                                        deptEnabled,
                                        departments.map(d => ({ id: d.id, label: d.departmentName })),
                                        '— Select Department —',
                                        'No departments found',
                                        'Departments load nahi ho sake',
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* SECTION II — PETITIONER & COUNSEL */}
                    <div className="ccm__section">
                        <div className="ccm__section-header">
                            <div className="ccm__section-badge">II</div>
                            <div className="ccm__section-title">PETITIONER &amp; COUNSEL</div>
                        </div>
                        <div className="ccm__section-body">
                            <div className="row g-3">

                                {/* Petitioner */}
                                <div className="col-md-6">
                                    <label className="ccm__label">
                                        Petitioner <span className="ccm__required">*</span>
                                    </label>
                                    {renderDropdown(
                                        'petitioner',
                                        selectedPetitionerId,
                                        setSelectedPetitionerId,
                                        () => setPetitionerEnabled(true),
                                        handleRefreshPetitioners,
                                        petLoading,
                                        petError,
                                        petitionerEnabled,
                                        petitioners.map(p => ({ id: p.id, label: p.name })),
                                        '— Select Petitioner —',
                                        'Petitioner list is currently empty',
                                        'Petitioners load nahi ho sake',
                                    )}

                                    {/* Info pill */}
                                    <div className="ccm__petitioner-info">
                                        <span>
                                            <i className="bi bi-person-vcard me-1"></i>
                                            CNIC: <strong>{cnicDisplay}</strong>
                                        </span>
                                        <span className="ccm__petitioner-info-sep">·</span>
                                        <span>
                                            <i className="bi bi-envelope me-1"></i>
                                            Email: <strong>{emailDisplay}</strong>
                                        </span>
                                    </div>
                                </div>

                                {/* DAG */}
                                <div className="col-md-6">
                                    <label className="ccm__label">
                                        DAG / Opposing Counsel <span className="ccm__required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="ccm__input"
                                        placeholder="e.g. Barrister Imran Raza"
                                        value={dag}
                                        onChange={(e) => setDag(e.target.value)}
                                    />
                                    <small className="ccm__hint">
                                        Deputy Attorney General or opposing counsel name
                                    </small>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* SECTION III — CASE PARTICULARS */}
                    <div className="ccm__section">
                        <div className="ccm__section-header">
                            <div className="ccm__section-badge">III</div>
                            <div className="ccm__section-title">CASE PARTICULARS</div>
                        </div>
                        <div className="ccm__section-body">
                            <div className="ccm__field">
                                <label className="ccm__label">
                                    Case Title <span className="ccm__required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="ccm__input"
                                    placeholder="e.g. Muhammad Ali Khan vs. Province of KPK"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="ccm__field">
                                <label className="ccm__label">
                                    Subject Matter <span className="ccm__required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="ccm__input"
                                    placeholder="e.g. Wrongful termination / Property dispute"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                            <div className="ccm__field">
                                <label className="ccm__label">
                                    Case Detail &amp; Background <span className="ccm__required">*</span>
                                </label>
                                <textarea
                                    className="ccm__textarea"
                                    placeholder="Describe the facts, legal grounds, and reliefs sought..."
                                    rows={4}
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                />
                                <div className="ccm__char-count">0 / 2000</div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION IV — DATE OF INSTITUTION */}
                    <div className="ccm__section">
                        <div className="ccm__section-header">
                            <div className="ccm__section-badge">IV</div>
                            <div className="ccm__section-title">DATE OF INSTITUTION</div>
                        </div>
                        <div className="ccm__section-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="ccm__label">
                                        Date Instituted <span className="ccm__required">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="ccm__input"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <label className="ccm__label">Full Date Reference</label>
                                    <div className="ccm__date-display">
                                        <i className="bi bi-calendar3 me-2 text-muted"></i>
                                        {selectedDate
                                            ? new Date(selectedDate).toLocaleDateString('en-US', {
                                                weekday: 'long', year: 'numeric',
                                                month: 'long', day: 'numeric',
                                            })
                                            : 'Select a date above'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION V — EMAIL NOTIFICATION LIST */}
                    <div className="ccm__section">
                        <div className="ccm__section-header">
                            <div className="ccm__section-badge">V</div>
                            <div className="ccm__section-title">EMAIL NOTIFICATION LIST</div>
                        </div>
                        <div className="ccm__section-body">
                            <label className="ccm__label">Notify Recipients</label>

                            {/* Tag input box */}
                            <div
                                className="ccm__tag-input"
                                onClick={() => document.getElementById('ccm-email-input')?.focus()}
                            >
                                {emailTags.map((tag) => (
                                    <span key={tag} className="ccm__email-tag">
                                        <i className="bi bi-envelope-fill me-1" style={{ fontSize: '10px' }}></i>
                                        {tag}
                                        <button
                                            type="button"
                                            className="ccm__email-tag-remove"
                                            onClick={(e) => { e.stopPropagation(); removeEmailTag(tag); }}
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <input
                                    id="ccm-email-input"
                                    type="email"
                                    className="ccm__tag-input-field"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    onKeyDown={handleEmailKeyDown}
                                    onBlur={addEmailTag}
                                    placeholder={emailTags.length === 0 ? 'Type email and press Enter or comma…' : ''}
                                />
                            </div>

                            {/* Inline validation */}
                            {emailInput && !isValidEmail(emailInput) && (
                                <div className="ccm__email-invalid">
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    Valid email address درج کریں
                                </div>
                            )}

                            <small className="ccm__notify-hint">
                                <i className="bi bi-info-circle me-1"></i>
                                Enter dabao ya comma lagao tag banane ke liye · Backspace se last tag hata sakte hain
                            </small>
                        </div>
                    </div>

                </div>
                {submitError && (
                    <div className="ccm__select-error" style={{ margin: '0 24px 12px' }}>
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Case file nahi ho saka — dobara try karo
                    </div>
                )}
                {/* FOOTER */}
                <div className="ccm__footer">
                    <small className="ccm__footer-note">
                        <span className="ccm__required">*</span> Required fields must be completed before filing
                    </small>
                    <div className="ccm__footer-actions">
                        <button
                            type="button"
                            className="ccm__btn-clear"
                            onClick={() => {
                                setCourtId(''); setDeptId(''); setSelectedPetitionerId('')
                                setDag(''); setTitle(''); setSubject(''); setDetail('')
                                setSelectedDate(''); setEmailTags([])
                            }}
                        >
                            <i className="bi bi-arrow-counterclockwise me-1"></i> Clear
                        </button>

                        <button
                            type="button"
                            className="ccm__btn-submit"
                            onClick={handleSubmit}
                            disabled={isPending}
                        >
                            {isPending
                                ? <><i className="bi bi-arrow-repeat ccm__spin me-1"></i> Filing…</>
                                : <><i className="bi bi-send me-1"></i> File Case</>
                            }
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

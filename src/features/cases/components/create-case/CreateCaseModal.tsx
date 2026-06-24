import { useState } from 'react';
import '../../styles/case-list.css';
import '../../styles/create-case.css';
import { useCreateCase, useDropDownPetitioners, useDropDownDepartments, useDropDownCourts } from '../../hooks/useCases';
import { validateCaseForm, hasErrors, type CaseFormErrors } from '../../hooks/Usecreatecasevalidation';
import type { CreateCaseDto } from '../../types/case.types';
import type { PetitionerDto } from '../../../petitioners/types/petitioner.types';
import type { Department } from '../../../departments/types/department.types';
import type { Court } from '../../../courts/types/court.types';

import JurisdictionSection from './sections/Jurisdictionsection';
import PetitionerSection from './sections/Petitionersection';
import CaseParticularsSection from './sections/Caseparticularssection';
import DateSection from './sections/Datesection';
import EmailSection from './sections/Emailsection';

const toUtcInstitutionDate = (date: string) =>
    new Date(`${date}T00:00:00.000Z`).toISOString();

interface CreateCaseModalProps {
    onClose: () => void;
}

export default function CreateCaseModal({ onClose }: CreateCaseModalProps) {

    // ── Dropdown enable state ────────────────────────────────
    const [petitionerEnabled, setPetitionerEnabled] = useState(false);
    const [deptEnabled, setDeptEnabled] = useState(false);
    const [courtEnabled, setCourtEnabled] = useState(false);

    // ── Form state ───────────────────────────────────────────
    const [courtId, setCourtId] = useState('');
    const [deptId, setDeptId] = useState('');
    const [selectedPetitionerId, setSelectedPetitionerId] = useState('');
    const [dag, setDag] = useState('');
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [detail, setDetail] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [emailTags, setEmailTags] = useState<string[]>([]);

    // ── Validation state ─────────────────────────────────────
    const [errors, setErrors] = useState<CaseFormErrors>({});

    // ── Hooks ────────────────────────────────────────────────
    const { data: petData, isLoading: petLoading, isError: petError, refetch: refetchPetitioners } = useDropDownPetitioners(petitionerEnabled);
    const { data: deptData, isLoading: deptLoading, isError: deptError, refetch: refetchDepts } = useDropDownDepartments(deptEnabled);
    const { data: courtData, isLoading: courtLoading, isError: courtError, refetch: refetchCourts } = useDropDownCourts(courtEnabled);
    const { mutate: createCase, isPending } = useCreateCase();

    const petitioners: PetitionerDto[] = petData?.data ?? [];
    const departments: Department[] = deptData?.items ?? [];
    const courts: Court[] = courtData?.items ?? [];

    // ── Clear single field error when user fixes it ──────────
    const clearError = (field: keyof CaseFormErrors) => {
        setErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    // ── Clear all ────────────────────────────────────────────
    const handleClear = () => {
        setCourtId(''); setDeptId(''); setSelectedPetitionerId('');
        setDag(''); setTitle(''); setSubject(''); setDetail('');
        setSelectedDate(''); setEmailTags([]); setEmailInput('');
        setErrors({});
    };

    // ── Submit ───────────────────────────────────────────────
    const handleSubmit = () => {
        const validationErrors = validateCaseForm({
            courtId, deptId, selectedPetitionerId,
            dag, title, subject, detail, selectedDate,
        });

        if (hasErrors(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const payload: CreateCaseDto = {
            courtId,
            departmentId: deptId,
            petitionerId: selectedPetitionerId,
            dag, title, subject, detail,
            dateInstitution: toUtcInstitutionDate(selectedDate),
            emailList: emailTags.join(','),
        };

        createCase(payload, {
            onSuccess: (res) => {
                if (res.isSuccess) onClose();
            },
        });
    };

    return (
        <div className="ccm__overlay">
            <div className="ccm__dialog">

                {/* HEADER */}
                <div className="ccm__header">
                    <div className="ccm__header-left">
                        <div className="ccm__header-icon">
                            <i className="bi bi-file-earmark-plus" />
                        </div>
                        <div>
                            <div className="ccm__header-title">File New Case</div>
                            <div className="ccm__header-subtitle">
                                Complete all required fields to register a new case
                            </div>
                        </div>
                    </div>
                    <button className="ccm__close-btn" onClick={onClose} disabled={isPending}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* BODY */}
                <div className="ccm__body">

                    <JurisdictionSection
                        courtId={courtId}
                        setCourtId={(v) => { setCourtId(v); clearError('courtId'); }}
                        courts={courts} courtLoading={courtLoading} courtError={courtError}
                        courtEnabled={courtEnabled} setCourtEnabled={setCourtEnabled} refetchCourts={refetchCourts}
                        courtError_msg={errors.courtId}
                        deptId={deptId}
                        setDeptId={(v) => { setDeptId(v); clearError('deptId'); }}
                        departments={departments} deptLoading={deptLoading} deptError={deptError}
                        deptEnabled={deptEnabled} setDeptEnabled={setDeptEnabled} refetchDepts={refetchDepts}
                        deptError_msg={errors.deptId}
                    />

                    <PetitionerSection
                        selectedPetitionerId={selectedPetitionerId}
                        setSelectedPetitionerId={(v) => { setSelectedPetitionerId(v); clearError('selectedPetitionerId'); }}
                        petitioners={petitioners} petLoading={petLoading} petError={petError}
                        petitionerEnabled={petitionerEnabled} setPetitionerEnabled={setPetitionerEnabled}
                        refetchPetitioners={refetchPetitioners}
                        petError_msg={errors.selectedPetitionerId}
                        dag={dag}
                        setDag={(v) => { setDag(v); clearError('dag'); }}
                        dagError={errors.dag}
                    />

                    <CaseParticularsSection
                        title={title}
                        setTitle={(v) => { setTitle(v); clearError('title'); }}
                        titleError={errors.title}
                        subject={subject}
                        setSubject={(v) => { setSubject(v); clearError('subject'); }}
                        subjectError={errors.subject}
                        detail={detail}
                        setDetail={(v) => { setDetail(v); clearError('detail'); }}
                        detailError={errors.detail}
                    />

                    <DateSection
                        selectedDate={selectedDate}
                        setSelectedDate={(v) => { setSelectedDate(v); clearError('selectedDate'); }}
                        dateError={errors.selectedDate}
                    />

                    <EmailSection
                        emailInput={emailInput} setEmailInput={setEmailInput}
                        emailTags={emailTags} setEmailTags={setEmailTags}
                    />

                </div>

                {/* FOOTER */}
                <div className="ccm__footer">
                    <small className="ccm__footer-note">
                        <span className="ccm__required">*</span> Required fields must be completed before filing
                    </small>
                    <div className="ccm__footer-actions">
                        <button type="button" className="ccm__btn-clear" onClick={handleClear} disabled={isPending}>
                            <i className="bi bi-arrow-counterclockwise me-1" /> Clear
                        </button>
                        <button
                            type="button"
                            className="ccm__btn-submit"
                            onClick={handleSubmit}
                            disabled={isPending}
                        >
                            {isPending
                                ? <><i className="bi bi-arrow-repeat ccm__spin me-1" /> Filing…</>
                                : <><i className="bi bi-send me-1" /> File Case</>
                            }
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
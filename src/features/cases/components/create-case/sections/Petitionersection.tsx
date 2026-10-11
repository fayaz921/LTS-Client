import DropdownField from './Dropdownfield';
import type { PetitionerDto } from '../../../../petitioners/types/petitioner.types';

interface PetitionerSectionProps {
    selectedPetitionerId: string
    setSelectedPetitionerId: (v: string) => void
    petitioners: PetitionerDto[]
    petLoading: boolean
    petError: boolean
    petitionerEnabled: boolean
    setPetitionerEnabled: (v: boolean) => void
    refetchPetitioners: () => void
    petError_msg?: string

    dag: string
    setDag: (v: string) => void
    dagError?: string
}

export default function PetitionerSection({
    selectedPetitionerId, setSelectedPetitionerId,
    petitioners, petLoading, petError, petitionerEnabled, setPetitionerEnabled, refetchPetitioners,
    petError_msg,
    dag, setDag, dagError,
}: PetitionerSectionProps) {

    const selected = petitioners.find(p => p.id === selectedPetitionerId);
    const cnicDisplay = selected?.cnic ?? '—';
    const emailDisplay = selected?.email ?? '—';

    return (
        <div className="ccm__section">
            <div className="ccm__section-header">
                <div className="ccm__section-badge">II</div>
                <div className="ccm__section-title">PETITIONER &amp; COUNSEL</div>
            </div>
            <div className="ccm__section-body">
                <div className="row g-3">

                    <div className="col-md-6">
                        <DropdownField
                            id="petitioner"
                            label="Petitioner"
                            required
                            value={selectedPetitionerId}
                            onChange={setSelectedPetitionerId}
                            onFocus={() => setPetitionerEnabled(true)}
                            onRefresh={() => { setPetitionerEnabled(true); refetchPetitioners(); }}
                            isLoading={petLoading}
                            isError={petError}
                            enabled={petitionerEnabled}
                            items={petitioners.map(p => ({
                                id: p.id,
                                label: p.cnic ? `${p.name} — ${p.cnic}` : p.name
                            }))} placeholder="— Select Petitioner —"
                            emptyMsg="Petitioner list is currently empty"
                            errorMsg="Petitioners connot loaded"
                            validationError={petError_msg}
                        />

                        <div className="ccm__petitioner-info">
                            <span><i className="bi bi-person-vcard me-1" />CNIC: <strong>{cnicDisplay}</strong></span>
                            <span className="ccm__petitioner-info-sep">·</span>
                            <span><i className="bi bi-envelope me-1" />Email: <strong>{emailDisplay}</strong></span>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="ccm__label">
                            DAG / Opposing Counsel <span className="ccm__required">*</span>
                        </label>
                        <input
                            type="text"
                            className={`ccm__input ${dagError ? 'ccm__input--error' : ''}`}
                            placeholder="e.g. Barrister Imran Raza"
                            value={dag}
                            onChange={(e) => setDag(e.target.value)}
                        />
                        {dagError && <div className="ccm__field-error">{dagError}</div>}
                        <small className="ccm__hint">Deputy Attorney General or opposing counsel name</small>
                    </div>

                </div>
            </div>
        </div>
    );
}
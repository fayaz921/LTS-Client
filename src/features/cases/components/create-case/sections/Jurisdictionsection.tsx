import DropdownField from './Dropdownfield';
import type { Court } from '../../../../courts/types/court.types';
import type { Department } from '../../../../departments/types/department.types';

interface JurisdictionSectionProps {
    courtId: string
    setCourtId: (v: string) => void
    courts: Court[]
    courtLoading: boolean
    courtError: boolean
    courtEnabled: boolean
    setCourtEnabled: (v: boolean) => void
    refetchCourts: () => void
    courtError_msg?: string

    deptId: string
    setDeptId: (v: string) => void
    departments: Department[]
    deptLoading: boolean
    deptError: boolean
    deptEnabled: boolean
    setDeptEnabled: (v: boolean) => void
    refetchDepts: () => void
    deptError_msg?: string
}

export default function JurisdictionSection({
    courtId, setCourtId, courts, courtLoading, courtError, courtEnabled, setCourtEnabled, refetchCourts, courtError_msg,
    deptId, setDeptId, departments, deptLoading, deptError, deptEnabled, setDeptEnabled, refetchDepts, deptError_msg,
}: JurisdictionSectionProps) {
    return (
        <div className="ccm__section">
            <div className="ccm__section-header">
                <div className="ccm__section-badge">I</div>
                <div className="ccm__section-title">JURISDICTION &amp; ASSIGNMENT</div>
            </div>
            <div className="ccm__section-body">
                <div className="row g-3">

                    <div className="col-md-6">
                        <DropdownField
                            id="court"
                            label="Court"
                            required
                            value={courtId}
                            onChange={setCourtId}
                            onFocus={() => setCourtEnabled(true)}
                            onRefresh={() => { setCourtEnabled(true); refetchCourts(); }}
                            isLoading={courtLoading}
                            isError={courtError}
                            enabled={courtEnabled}
                            items={courts.map(c => ({ id: c.id, label: c.courtName }))}
                            placeholder="— Select Court —"
                            emptyMsg="No courts found"
                            errorMsg="Courts load nahi ho sake"
                            validationError={courtError_msg}
                        />
                    </div>

                    <div className="col-md-6">
                        <DropdownField
                            id="department"
                            label="Department"
                            required
                            value={deptId}
                            onChange={setDeptId}
                            onFocus={() => setDeptEnabled(true)}
                            onRefresh={() => { setDeptEnabled(true); refetchDepts(); }}
                            isLoading={deptLoading}
                            isError={deptError}
                            enabled={deptEnabled}
                            items={departments.map(d => ({ id: d.id, label: d.departmentName }))}
                            placeholder="— Select Department —"
                            emptyMsg="No departments found"
                            errorMsg="Departments load nahi ho sake"
                            validationError={deptError_msg}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
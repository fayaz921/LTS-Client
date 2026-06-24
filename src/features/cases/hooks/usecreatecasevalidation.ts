export interface CaseFormFields {
    courtId: string
    deptId: string
    selectedPetitionerId: string
    dag: string
    title: string
    subject: string
    detail: string
    selectedDate: string
}

export type CaseFormErrors = Partial<Record<keyof CaseFormFields, string>>

export const validateCaseForm = (fields: CaseFormFields): CaseFormErrors => {
    const errors: CaseFormErrors = {}

    if (!fields.courtId)
        errors.courtId = 'Court is required'

    if (!fields.deptId)
        errors.deptId = 'Department is required'

    if (!fields.selectedPetitionerId)
        errors.selectedPetitionerId = 'Petitioner is required'

    if (!fields.dag.trim())
        errors.dag = 'DAG / Counsel name is required'
    else if (fields.dag.trim().length < 3)
        errors.dag = 'Minimum 3 characters required'

    if (!fields.title.trim())
        errors.title = 'Case title is required'
    else if (fields.title.trim().length < 5)
        errors.title = 'Minimum 5 characters required'
    else if (fields.title.trim().length > 200)
        errors.title = 'Maximum 200 characters allowed'

    if (!fields.subject.trim())
        errors.subject = 'Subject matter is required'
    else if (fields.subject.trim().length < 5)
        errors.subject = 'Minimum 5 characters required'
    else if (fields.subject.trim().length > 200)
        errors.subject = 'Maximum 200 characters allowed'

    if (!fields.detail.trim())
        errors.detail = 'Case detail is required'
    else if (fields.detail.trim().length < 10)
        errors.detail = 'Minimum 10 characters required'
    else if (fields.detail.trim().length > 2000)
        errors.detail = 'Maximum 2000 characters allowed'

    if (!fields.selectedDate)
        errors.selectedDate = 'Date of institution is required'
    else {
        const picked = new Date(fields.selectedDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (picked > today)
            errors.selectedDate = 'Future date is not allowed'
    }

    return errors
}

export const hasErrors = (errors: CaseFormErrors): boolean =>
    Object.keys(errors).length > 0
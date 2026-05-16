// types/followup.types.ts

export interface FollowUp {
    id: string
    caseId: string
    hearingDate: string           // Changed from nextDate
    nextHearingDate?: string | null
    interimOrder?: string | null
    decision?: string | null
    remarks?: string | null
    isCompleted?: boolean         // Calculate from hearingDate
    createdAt?: string
    createdBy?: string
}

export interface CreateFollowUpDto {
    caseId: string
    hearingDate: string           // Changed from nextDate
    nextHearingDate?: string | null
    interimOrder?: string | null
    decision?: string | null
    remarks?: string | null
}

export interface UpdateFollowUpDto {
    id: string
    caseId: string
    hearingDate: string
    nextHearingDate?: string | null
    interimOrder?: string | null
    decision?: string | null
    remarks?: string | null
}

export interface PaginatedResponse<T> {
    items: T[]
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
    hasPrevious: boolean
    hasNext: boolean
}

export interface FollowUpPageParams {
    pageNumber: number
    pageSize: number
    caseId?: string               // Optional caseId filter
}
// ─────────────────────────────────────────────────────────────
// Court Domain Types
// ─────────────────────────────────────────────────────────────

export interface Court {
    id: string
    courtName: string
    addressContact?: string | null
    isActive: boolean
    createdAt?: string
}

export interface CreateCourtDto {
    courtName: string
    addressContact?: string
}

export interface UpdateCourtDto {
    id: string
    courtName: string
    addressContact?: string
    isActive: boolean
}

// ─────────────────────────────────────────────────────────────
// Pagination Types — matches backend PaginatedResponse<T>
// ─────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
    items:       T[]
    totalCount:  number
    pageNumber:  number
    pageSize:    number
    totalPages:  number
    hasPrevious: boolean
    hasNext:     boolean
}

export interface CourtPageParams {
    pageNumber: number
    pageSize:   number
    isActive?:  boolean
}
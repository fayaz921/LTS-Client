// ─────────────────────────────────────────────────────────────
// Department Domain Types
// ─────────────────────────────────────────────────────────────

export interface Department {
    id: string
    departmentName: string
    addressContact?: string
    isActive: boolean
    createdAt?: string
}

export interface CreateDepartmentDto {
    departmentName: string
    addressContact?: string
    isActive?: boolean
}

export interface UpdateDepartmentDto {
    id: string
    departmentName: string
    addressContact?: string
    isActive: boolean
}

// ─────────────────────────────────────────────────────────────
// Pagination Types
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

export interface DepartmentPageParams {
    pageNumber: number
    pageSize:   number
    isActive?:  boolean
}
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
    isActive?: boolean
}

export interface UpdateCourtDto {
    id: string
    courtName: string
    addressContact?: string
    isActive: boolean
}
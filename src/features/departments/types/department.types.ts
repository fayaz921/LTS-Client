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
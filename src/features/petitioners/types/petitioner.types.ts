

export interface PetitionerDto {
    id: string
    name: string
    address: string | null
    phone: string | null
    mobile: string | null
    business: string | null
    email: string | null
    cnic: string | null
    createdAt: string
}

export interface CreatePetitionerDto {
    name: string
    address?: string
    phone?: string
    mobile?: string
    business?: string
    email?: string
    cnic?: string
    organizationId: string
    createdBy: string
}

export interface UpdatePetitionerDto {
    id: string
    name: string
    address?: string
    phone?: string
    mobile?: string
    business?: string
    email?: string
    cnic?: string
    updatedBy: string
}
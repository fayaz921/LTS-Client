import axiosInstance from '../../../lib/axios'
import type { ApiResponse } from '../../../shared/types/api.types'
import type { PetitionerDto, CreatePetitionerDto, UpdatePetitionerDto } from '../types/petitioner.types'

export const getAllPetitioners = async (organizationId: string): Promise<ApiResponse<PetitionerDto[]>> => {
    const res = await axiosInstance.get(`/Petitioners/GetAllPetitioners?organizationId=${organizationId}`)
    return res.data
}

export const getPetitionerById = async (id: string): Promise<ApiResponse<PetitionerDto>> => {
    const res = await axiosInstance.get(`/Petitioners/GetPetitionerById/${id}`)
    return res.data
}

export const createPetitioner = async (data: CreatePetitionerDto): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.post('/Petitioners/CreatePetitioner', data)
    return res.data
}

export const updatePetitioner = async (id: string, data: UpdatePetitionerDto): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.put(`/Petitioners/UpdatePetitioner/${id}`, data)
    return res.data
}

export const deletePetitioner = async (id: string): Promise<ApiResponse<string>> => {
    const res = await axiosInstance.delete(`/Petitioners/DeletePetitioner/${id}`)
    return res.data
}
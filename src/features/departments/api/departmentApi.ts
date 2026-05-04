import instance from '../../../lib/axios'
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.types'

export const departmentApi = {

getAll: () =>
    instance
        .get<{ status: number; message: string; data: Department[] }>('/departments')
        .then(r => r.data.data),

getById: (id: string) =>
    instance
        .get<{ status: number; message: string; data: Department }>(`/departments/${id}`)
        .then(r => r.data.data),

create: (data: CreateDepartmentDto) =>
    instance
        .post<{ status: number; message: string; data: Department }>('/departments', data)
        .then(r => r.data),

update: (data: UpdateDepartmentDto) =>
    instance
        .put<{ status: number; message: string; data: Department }>(`/departments/${data.id}`, data)
        .then(r => r.data),

delete: (id: string) =>
    instance
        .delete<{ status: number; message: string; data: string }>(`/departments/${id}`)
        .then(r => r.data),
}
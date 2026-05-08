import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentApi } from '../api/departmentApi'
import type { CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.types'

const KEYS = {
    all: ['departments'],
    byId: (id: string) => ['departments', id],
}

export const useGetDepartments = (enabled: boolean = true) =>
    useQuery({
        queryKey: KEYS.all,
        queryFn: departmentApi.getAll,
        enabled,
    })

export const useGetDepartmentById = (id: string) =>
    useQuery({
        queryKey: KEYS.byId(id),
        queryFn: () => departmentApi.getById(id),
        enabled: !!id,
    })

export const useCreateDepartment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateDepartmentDto) => departmentApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}

export const useUpdateDepartment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateDepartmentDto) => departmentApi.update(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}

export const useDeleteDepartment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => departmentApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}
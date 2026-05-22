import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentApi } from '../api/departmentApi'
import type { CreateDepartmentDto, UpdateDepartmentDto, DepartmentPageParams } from '../types/department.types'

// ─────────────────────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────────────────────

const KEYS = {
    all:      ['departments']                           as const,
    list:     (params: DepartmentPageParams) =>
                  ['departments', 'list', params]       as const,
    byId:     (id: string) => ['departments', id]      as const,
}

// ─────────────────────────────────────────────────────────────
// GET ALL — paginated (client-side)
// ─────────────────────────────────────────────────────────────

export const useGetDepartments = (params: DepartmentPageParams, enabled = true) =>
    useQuery({
        queryKey:        KEYS.list(params),
        queryFn:         () => departmentApi.getAll(params),
        enabled,
        placeholderData: (prev) => prev,   // smooth page transition
    })

// ─────────────────────────────────────────────────────────────
// GET BY ID
// ─────────────────────────────────────────────────────────────

export const useGetDepartmentById = (id: string) =>
    useQuery({
        queryKey: KEYS.byId(id),
        queryFn:  () => departmentApi.getById(id),
        enabled:  !!id,
    })

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export const useCreateDepartment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateDepartmentDto) => departmentApi.create(data),
        onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export const useUpdateDepartment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateDepartmentDto) => departmentApi.update(data),
        onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

export const useDeleteDepartment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => departmentApi.delete(id),
        onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}
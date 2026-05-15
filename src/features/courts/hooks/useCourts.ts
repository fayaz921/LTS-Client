import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courtApi } from '../api/courtApi'
import type { CreateCourtDto, UpdateCourtDto } from '../types/court.types'

// ─────────────────────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────────────────────

const KEYS = {
    all: ['courts'] as const,
    filtered: (isActive?: boolean) => ['courts', { isActive }] as const,
    byId: (id: string) => ['courts', id] as const,
}

// ─────────────────────────────────────────────────────────────
// GET ALL — optional isActive filter
// ─────────────────────────────────────────────────────────────

export const useGetCourts = (isActive?: boolean, enabled: boolean = true) =>
    useQuery({
        queryKey: KEYS.filtered(isActive),
        queryFn: () => courtApi.getAll(isActive),
        enabled,
    })

// ─────────────────────────────────────────────────────────────
// GET BY ID
// ─────────────────────────────────────────────────────────────

export const useGetCourtById = (id: string) =>
    useQuery({
        queryKey: KEYS.byId(id),
        queryFn: () => courtApi.getById(id),
        enabled: !!id,
    })

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export const useCreateCourt = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateCourtDto) => courtApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export const useUpdateCourt = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateCourtDto) => courtApi.update(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}

// ─────────────────────────────────────────────────────────────
// DELETE (soft delete — marks isActive = false)
// ─────────────────────────────────────────────────────────────

export const useDeleteCourt = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => courtApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
    })
}
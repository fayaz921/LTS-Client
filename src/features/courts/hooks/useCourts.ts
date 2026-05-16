import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courtApi } from '../api/courtApi'
import type { CreateCourtDto, UpdateCourtDto, CourtPageParams } from '../types/court.types'

// ─────────────────────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────────────────────

export const courtKeys = {
    all:      ['courts']                          as const,
    list:     (params: CourtPageParams) =>
                  ['courts', 'list', params]      as const,
    byId:     (id: string) =>
                  ['courts', id]                  as const,
}

// ─────────────────────────────────────────────────────────────
// GET ALL — paginated
// ─────────────────────────────────────────────────────────────

export const useGetCourts = (params: CourtPageParams, enabled = true) =>
    useQuery({
        queryKey: courtKeys.list(params),
        queryFn:  () => courtApi.getAll(params),
        enabled,
        placeholderData: (prev) => prev,   // keeps old data visible while fetching next page
    })

// ─────────────────────────────────────────────────────────────
// GET BY ID
// ─────────────────────────────────────────────────────────────

export const useGetCourtById = (id: string) =>
    useQuery({
        queryKey: courtKeys.byId(id),
        queryFn:  () => courtApi.getById(id),
        enabled:  !!id,
    })

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

export const useCreateCourt = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateCourtDto) => courtApi.create(data),
        onSuccess:  () => qc.invalidateQueries({ queryKey: courtKeys.all }),
    })
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

export const useUpdateCourt = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateCourtDto) => courtApi.update(data),
        onSuccess:  () => qc.invalidateQueries({ queryKey: courtKeys.all }),
    })
}

// ─────────────────────────────────────────────────────────────
// DELETE (soft)
// ─────────────────────────────────────────────────────────────

export const useDeleteCourt = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => courtApi.delete(id),
        onSuccess:  () => qc.invalidateQueries({ queryKey: courtKeys.all }),
    })
}
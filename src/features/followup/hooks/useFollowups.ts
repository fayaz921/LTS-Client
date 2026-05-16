// hooks/useFollowups.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { followupApi } from '../api/followupApi'
import type { CreateFollowUpDto, UpdateFollowUpDto, FollowUpPageParams } from '../types/followup.types'

export const followupKeys = {
    all: ['followups'] as const,
    list: (params: FollowUpPageParams) => ['followups', 'list', params] as const,
    byId: (id: string) => ['followups', id] as const,
}

export const useGetFollowUps = (params: FollowUpPageParams, enabled = true) =>
    useQuery({
        queryKey: followupKeys.list(params),
        queryFn: () => followupApi.getAll(params),
        enabled,
        placeholderData: (prev) => prev,
        retry: 1,
    })

export const useGetFollowUpById = (id: string) =>
    useQuery({
        queryKey: followupKeys.byId(id),
        queryFn: () => followupApi.getById(id),
        enabled: !!id,
    })

export const useCreateFollowUp = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateFollowUpDto) => followupApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: followupKeys.all })
        },
    })
}

export const useUpdateFollowUp = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateFollowUpDto) => followupApi.update(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: followupKeys.all })
        },
    })
}

export const useDeleteFollowUp = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => followupApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: followupKeys.all })
        },
    })
}
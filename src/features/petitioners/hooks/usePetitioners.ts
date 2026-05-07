import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import {
    getAllPetitioners,
    createPetitioner,
    updatePetitioner,
    deletePetitioner
} from '../api/petitionersApi'
import type { CreatePetitionerDto, UpdatePetitionerDto } from '../types/petitioner.types'

export const usePetitioners = () => {
    const { user } = useAuthStore()

    return useQuery({
        queryKey: ['petitioners', user?.organizationId],
        queryFn: () => getAllPetitioners(user?.organizationId ?? ''),
        enabled: !!user?.organizationId,
    })
}

export const useCreatePetitioner = () => {
    const queryClient = useQueryClient()
    const { user } = useAuthStore()

    return useMutation({
        mutationFn: (data: CreatePetitionerDto) => createPetitioner({
            ...data,
            organizationId: user?.organizationId ?? '',
            createdBy: user?.email ?? '',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['petitioners'] })
        }
    })
}

export const useUpdatePetitioner = () => {
    const queryClient = useQueryClient()
    const { user } = useAuthStore()

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: UpdatePetitionerDto }) =>
            updatePetitioner(id, { ...data, updatedBy: user?.email ?? '' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['petitioners'] })
        }
    })
}

export const useDeletePetitioner = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deletePetitioner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['petitioners'] })
        }
    })
}


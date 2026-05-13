import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../../store/authStore'
import {
    getAllPetitioners,
    createPetitioner,
    updatePetitioner,
    deletePetitioner
} from '../api/petitionersApi'
import type { CreatePetitionerDto, UpdatePetitionerDto } from '../types/petitioner.types'

const DEMO_ORG_ID = '4278665f-13ed-445c-ae61-0dabcdc5b3a4'

export const usePetitioners = (fetchEnable: boolean = true) => {
    const { user } = useAuthStore()
    const organizationId = user?.organizationId || DEMO_ORG_ID

    return useQuery({
        queryKey: ['petitioners', organizationId],
        queryFn: () => getAllPetitioners(organizationId),
        enabled: fetchEnable,
    })
}

export const useCreatePetitioner = () => {
    const queryClient = useQueryClient()
    const { user } = useAuthStore()
    const organizationId = user?.organizationId || DEMO_ORG_ID

    return useMutation({
        mutationFn: (data: CreatePetitionerDto) => createPetitioner({
            ...data,
            organizationId,
            createdBy: user?.email ?? 'system',
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


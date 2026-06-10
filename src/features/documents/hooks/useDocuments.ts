import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentsApi } from '../api/documents'
import type { UploadDocumentDto } from '../types'

const DOCUMENT_KEYS = {
    byCase: (caseId: string) => ['documents', 'case', caseId],
    byId: (id: string) => ['documents', id],
}

export function useGetDocumentsByCase(caseId: string) {
    return useQuery({
        queryKey: DOCUMENT_KEYS.byCase(caseId),
        queryFn: () => documentsApi.getByCase(caseId),
        enabled: !!caseId,
    })
}

export function useGetDocumentById(id: string) {
    return useQuery({
        queryKey: DOCUMENT_KEYS.byId(id),
        queryFn: () => documentsApi.getById(id),
        enabled: !!id,
    })
}

export function useUploadDocument(caseId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (dto: UploadDocumentDto) => documentsApi.upload(dto),
        onSuccess: (response) => {
            alert(response?.message);

            queryClient.invalidateQueries({
                queryKey: DOCUMENT_KEYS.byCase(caseId),
            });
        },

        onError: (error: any) => {
            alert(error.message);
        },
    });
}

export function useDeleteDocument(caseId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => documentsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: DOCUMENT_KEYS.byCase(caseId),
            })
        },
    })
}
// api/followupApi.ts - Fix the unused params warning

import instance from '../../../lib/axios'
import type {
    FollowUp,
    CreateFollowUpDto,
    UpdateFollowUpDto,
    PaginatedResponse,
    FollowUpPageParams,
} from '../types/followup.types'

export const followupApi = {

    // GET all followups (with pagination)
    getAll: async ({ pageNumber, pageSize, caseId }: FollowUpPageParams) => {
        // If caseId is provided, use the case-specific endpoint
        if (caseId) {
            const response = await instance.get<{
                status: number
                message: string
                data: FollowUp[]
            }>(`/followup/${caseId}`)
            
            // Convert to paginated format
            const items = response.data.data
            const start = (pageNumber - 1) * pageSize
            const end = start + pageSize
            
            return {
                items: items.slice(start, end),
                totalCount: items.length,
                pageNumber,
                pageSize,
                totalPages: Math.ceil(items.length / pageSize),
                hasPrevious: pageNumber > 1,
                hasNext: end < items.length,
            } as PaginatedResponse<FollowUp>
        }
        
        // If no caseId, return empty or handle differently
        return {
            items: [],
            totalCount: 0,
            pageNumber,
            pageSize,
            totalPages: 0,
            hasPrevious: false,
            hasNext: false,
        } as PaginatedResponse<FollowUp>
    },

    // Get by case ID (your backend endpoint)
    getByCaseId: async (caseId: string) => {
        const response = await instance.get<{
            status: number
            message: string
            data: FollowUp[]
        }>(`/followup/${caseId}`)
        return response.data.data
    },

    getById: (id: string) =>
        instance
            .get<{ status: number; message: string; data: FollowUp }>(`/followup/${id}`)
            .then(r => r.data.data),

    create: (data: CreateFollowUpDto) =>
        instance
            .post<{ status: number; message: string; data: string }>('/followup', data)
            .then(r => r.data),

    update: (data: UpdateFollowUpDto) =>
        instance
            .put<{ status: number; message: string; data: string }>(`/followup/${data.id}`, data)
            .then(r => r.data),

    delete: (id: string) =>
        instance
            .delete<{ status: number; message: string; data: string }>(`/followup/${id}`)
            .then(r => r.data),
}
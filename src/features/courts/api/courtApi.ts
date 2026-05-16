import instance from '../../../lib/axios'
import type {
    Court,
    CreateCourtDto,
    UpdateCourtDto,
    PaginatedResponse,
    CourtPageParams,
} from '../types/court.types'

// ─────────────────────────────────────────────────────────────
// Court API
// ─────────────────────────────────────────────────────────────

export const courtApi = {

    // GET /api/courts?pageNumber=1&pageSize=10&isActive=true
    getAll: ({ pageNumber, pageSize, isActive }: CourtPageParams) => {
        const params = new URLSearchParams({
            pageNumber: String(pageNumber),
            pageSize:   String(pageSize),
        })
        if (isActive !== undefined) params.append('isActive', String(isActive))

        return instance
            .get<{ status: number; message: string; data: PaginatedResponse<Court> }>(
                `/courts?${params.toString()}`
            )
            .then(r => r.data.data)
    },

    getById: (id: string) =>
        instance
            .get<{ status: number; message: string; data: Court }>(`/courts/${id}`)
            .then(r => r.data.data),

    create: (data: CreateCourtDto) =>
        instance
            .post<{ status: number; message: string; data: string }>('/courts', data)
            .then(r => r.data),

    update: (data: UpdateCourtDto) =>
        instance
            .put<{ status: number; message: string; data: string }>(`/courts/${data.id}`, data)
            .then(r => r.data),

    delete: (id: string) =>
        instance
            .delete<{ status: number; message: string; data: string }>(`/courts/${id}`)
            .then(r => r.data),
}
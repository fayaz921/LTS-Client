import instance from '../../../lib/axios'
import type { Court, CreateCourtDto, UpdateCourtDto } from '../types/court.types'

// ─────────────────────────────────────────────────────────────
// Court API — matches backend CourtsController endpoints
// GET    /courts
// GET    /courts/:id
// POST   /courts
// PUT    /courts/:id
// DELETE /courts/:id
// ─────────────────────────────────────────────────────────────

export const courtApi = {

    getAll: (isActive?: boolean) =>
        instance
            .get<{ status: number; message: string; data: Court[] }>(
                isActive !== undefined ? `/courts?isActive=${isActive}` : '/courts'
            )
            .then(r => r.data.data),

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
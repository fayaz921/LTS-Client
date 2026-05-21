import instance from '../../../lib/axios'
import type {
    Department,
    CreateDepartmentDto,
    UpdateDepartmentDto,
    PaginatedResponse,
    DepartmentPageParams,
} from '../types/department.types'

// ─────────────────────────────────────────────────────────────
// Department API
// Backend mein pagination nahi hai — isliye getAll se sab data
// laate hain aur frontend pe paginate karte hain
// ─────────────────────────────────────────────────────────────

export const departmentApi = {

    // Sab departments lao — phir frontend pe slice karo
    getAll: async ({ pageNumber, pageSize, isActive }: DepartmentPageParams) => {
        const url = isActive !== undefined
            ? `/departments?isActive=${isActive}`
            : '/departments'

        const res = await instance
            .get<{ status: number; message: string; data: Department[] }>(url)

        const all   = res.data.data ?? []
        const start = (pageNumber - 1) * pageSize
        const end   = start + pageSize

        return {
            items:       all.slice(start, end),
            totalCount:  all.length,
            pageNumber,
            pageSize,
            totalPages:  Math.ceil(all.length / pageSize) || 1,
            hasPrevious: pageNumber > 1,
            hasNext:     end < all.length,
        } as PaginatedResponse<Department>
    },

    getById: (id: string) =>
        instance
            .get<{ status: number; message: string; data: Department }>(`/departments/${id}`)
            .then(r => r.data.data),

    create: (data: CreateDepartmentDto) =>
        instance
            .post<{ status: number; message: string; data: Department }>('/departments', data)
            .then(r => r.data),

    update: (data: UpdateDepartmentDto) =>
        instance
            .put<{ status: number; message: string; data: Department }>(`/departments/${data.id}`, data)
            .then(r => r.data),

    delete: (id: string) =>
        instance
            .delete<{ status: number; message: string; data: string }>(`/departments/${id}`)
            .then(r => r.data),
}
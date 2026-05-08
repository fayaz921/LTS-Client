import instance from '../../../lib/axios'
import type { Court } from '../types/court.types'
import type { ApiResponse } from '../../../shared/types/api.types'

export const courtApi = {
    getAll: () =>
        instance
            .get<ApiResponse<Court[]>>('/Courts')
            .then(r => r.data),
}
import { HttpStatusCode } from 'axios'

export interface ApiResponse<T> {
    data: T
    isSuccess: boolean
    message: string
    status: HttpStatusCode
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
    // isSuccess: boolean
    // message: string
    // status: HttpStatusCode
}

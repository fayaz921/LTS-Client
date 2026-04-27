import { HttpStatusCode } from 'axios'

export interface ApiResponse<T> {
    data: T
    isSuccess: boolean
    message: string
    status: HttpStatusCode
}

export interface PaginatedResponse<T> {
    data: T[]
    totalCount: number
    pageNumber: number
    pageSize: number
    isSuccess: boolean
    message: string
    status: HttpStatusCode
}
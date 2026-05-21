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
    pageNumber: number; 
  totalPages: number;
  hasPrevious: boolean; 
  hasNext: boolean;  
    // isSuccess: boolean
    // message: string
    // status: HttpStatusCode
}

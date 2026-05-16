import AxiosInstance from "../../../lib/axios";
import type { ApiResponse, PaginatedResponse } from "../../../shared/types/api.types";
import type { CreateCaseDto, GetCaseDto } from "../types/case.types";


export const getCases = async (
    page: number = 1,
    pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<GetCaseDto>>> => {
    const response = await AxiosInstance.get(`/getAll`, {
        params: { page, pageSize }
    });
    return response.data;
};

export const createCase = async (data: CreateCaseDto): Promise<ApiResponse<string>> => {
    const response = await AxiosInstance.post('/Case/Create', data);
    return response.data;
};


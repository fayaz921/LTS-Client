import AxiosInstance from "../../../lib/axios";
import type { ApiResponse, PaginatedResponse } from "../../../shared/types/api.types";
import type { CreateCaseDto, GetCaseDto } from "../types/case.types";

const withTotalPages = (
    response: ApiResponse<PaginatedResponse<GetCaseDto>>
): ApiResponse<PaginatedResponse<GetCaseDto>> => {
    if (!response.data) return response;

    return {
        ...response,
        data: {
            ...response.data,
            totalPages: response.data.totalPages
                ?? Math.ceil(response.data.totalCount / response.data.pageSize)
                ?? 0,
        },
    };
};

export const getCases = async (
    organizationId: string,
    page: number = 1,
    pageSize: number = 10
): Promise<ApiResponse<PaginatedResponse<GetCaseDto>>> => {
    const response = await AxiosInstance.get<ApiResponse<PaginatedResponse<GetCaseDto>>>('/Case/getAll', {
        params: { organizationId, page, pageSize }
    });

    return withTotalPages(response.data);
};

export const createCase = async (data: CreateCaseDto): Promise<ApiResponse<string>> => {
    const response = await AxiosInstance.post<ApiResponse<string>>('/Case/Create', data);
    return response.data;
};

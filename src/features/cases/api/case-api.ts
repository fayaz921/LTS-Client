import AxiosInstance from "../../../lib/axios";
import type { ApiResponse, PaginatedResponse } from "../../../shared/types/api.types";
import type { CaseDto, CreateCaseDto, SearchCaseResponse, SearchParams } from "../types/case.types";

// ── Helper ────────────────────────────────────────────────────────
const withTotalPages = (
    response: ApiResponse<PaginatedResponse<CaseDto>>
): ApiResponse<PaginatedResponse<CaseDto>> => {
    if (!response.data) return response;

    return {
        ...response,
        data: {
            ...response.data,
            totalPages:
                response.data.totalPages > 0
                    ? response.data.totalPages
                    : Math.ceil(response.data.totalCount / response.data.pageSize),
        },
    };
};

// ── Get All Cases (paginated) ─────────────────────────────────────
export const getCases = async (
    page: number = 1,
    pageSize: number = 10
): Promise<ApiResponse<PaginatedResponse<CaseDto>>> => {
    const response = await AxiosInstance.get<ApiResponse<PaginatedResponse<CaseDto>>>(
        '/Case/getAll',
        { params: { page, pageSize } }
    );
    return withTotalPages(response.data);
};

// ── Create Case ───────────────────────────────────────────────────
export const createCase = async (
    data: CreateCaseDto
): Promise<ApiResponse<string>> => {
    const response = await AxiosInstance.post<ApiResponse<string>>('/Case/Create', data);
    return response.data;
};

// ── Delete Case ───────────────────────────────────────────────────
export const deleteCase = async (
    id: string
): Promise<ApiResponse<string>> => {
    const response = await AxiosInstance.delete<ApiResponse<string>>(`/Case/delete/${id}`);
    return response.data;
};

// ── Search Cases ──────────────────────────────────────────────────
export const searchCases = async (
    params: SearchParams
): Promise<ApiResponse<SearchCaseResponse>> => {
    const response = await AxiosInstance.get<ApiResponse<SearchCaseResponse>>(
        '/Case/search',
        { params }
    );
    return response.data;
};
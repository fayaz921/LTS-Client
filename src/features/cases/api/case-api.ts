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
export const deleteCase = async (
    id: string
): Promise<ApiResponse<string>> => {
    const response = await AxiosInstance.delete<ApiResponse<string>>(
        `/Case/Delete/${id}`
    );

    return response.data;
};



// Search cases with CNIC
// export const searchCases = async (params: SearchParams): Promise<ApiResponse<SearchCaseResponse>> => {
//     const queryParams = new URLSearchParams();

//     if (params.query) queryParams.append("query", params.query);
//     if (params.pageNumber) queryParams.append("pageNumber", params.pageNumber.toString());
//     if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
//     if (params.status) queryParams.append("status", params.status);
//     if (params.fromDate) queryParams.append("fromDate", params.fromDate);
//     if (params.toDate) queryParams.append("toDate", params.toDate);

//     var response = await axiosInstance.get('/case/search?${queryParams.toString()}`);

//     if (!response.ok) {
//         throw new Error(`Search failed: ${response.statusText}`);
//     }

//     return response.json();
// },



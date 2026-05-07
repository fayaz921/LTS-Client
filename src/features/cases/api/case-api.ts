// src/features/cases/api/case-api.ts

import axios from "axios";
import type { ApiResponse, PaginatedResponse } from "../../../shared/types/api.types";
import type { CreateCaseDto, GetCaseDto } from "../types/case.types";

const BASE = 'https://localhost:7142/api/Case';

export const getCases = async (
    page: number = 1,
    pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<GetCaseDto>>> => {
    const response = await axios.get(`${BASE}/getAll`, {
        params: { page, pageSize }
    });
    return response.data;
};

export const createCase = async (data: CreateCaseDto): Promise<ApiResponse<string>> => {
    const response = await axios.post('https://localhost:7142/api/Case/create', data);
    return response.data;
}; 
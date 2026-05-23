import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateCaseDto, SearchParams } from '../types/case.types';
import { createCase, deleteCase, getCases, searchCases } from '../api/case-api';
import { usePetitioners } from '../../petitioners/hooks/usePetitioners';
import { useGetDepartments } from '../../departments/hooks/useDepartments';
import { useGetCourts } from '../../courts/hooks/useCourts';
import { useAuthStore } from '../../../store/authStore';

// ── Query Key Factory ─────────────────────────────────────────────
export const caseKeys = {
    all: () => ['cases'] as const,
    list: (orgId: string, page: number, size: number) => ['cases', 'list', orgId, page, size] as const,
    search: (params: SearchParams) => ['cases', 'search', params] as const,
};

// ── Cases ─────────────────────────────────────────────────────────

export const useGetAllCases = (page: number = 1, pageSize: number = 10) => {
    const { user } = useAuthStore();
    const orgId = user?.organizationId ?? '';

    return useQuery({
        queryKey: caseKeys.list(orgId, page, pageSize),
        queryFn: () => getCases(orgId, page, pageSize),
        enabled: !!orgId,
    });
};

export const useSearchCases = (params: SearchParams) => {
    return useQuery({
        queryKey: caseKeys.search(params),
        queryFn: () => searchCases(params),
        // run when there's a search term OR a status/date filter active
        enabled: !!(params.query || params.status || params.fromDate || params.toDate),
    });
};

export const useCreateCase = () => {
    const qc = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (data: CreateCaseDto) => createCase({
            ...data,
            organizationId: user?.organizationId ?? data.organizationId,
        }),
        onSuccess: () => qc.invalidateQueries({ queryKey: caseKeys.all() }),
    });
};

export const useDeleteCase = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCase(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: caseKeys.all() }),
    });
};

// ── Dropdown Helpers ──────────────────────────────────────────────

export const useDropDownPetitioners = (enabled = false) =>
    usePetitioners(enabled);

export const useDropDownDepartments = (enabled = false) =>
    useGetDepartments({ pageNumber: 1, pageSize: 100 }, enabled);

export const useDropDownCourts = (enabled = false) =>
    useGetCourts({ pageNumber: 1, pageSize: 100, isActive: true }, enabled);
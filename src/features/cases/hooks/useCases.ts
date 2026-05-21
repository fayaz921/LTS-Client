import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCaseDto } from "../types/case.types";
import { createCase, getCases } from "../api/case-api";
import { usePetitioners } from "../../petitioners/hooks/usePetitioners";
import { useGetDepartments } from "../../departments/hooks/useDepartments";
import { useGetCourts } from '../../courts/hooks/useCourts';
import { useAuthStore } from "../../../store/authStore";

// ── Cases ────────────────────────────────────────────────────────
export const HandleGetAllCases = (page: number = 1, pageSize: number = 10) => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: ['cases', user?.organizationId, page, pageSize],
        queryFn: () => getCases(user?.organizationId ?? '', page, pageSize),
        enabled: !!user?.organizationId,
    });
};

export const HandleCreateCase = () => {
    const qc = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (data: CreateCaseDto) => createCase({
            ...data,
            organizationId: user?.organizationId ?? data.organizationId,
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['cases'] });
        },
    });
};

// ── Dropdowns ────────────────────────────────────────────────────
export const DropDownPetitioners = (enabled: boolean = false) =>
    usePetitioners(enabled);

export const DropDownDepartments = (enabled: boolean = false) =>
    useGetDepartments(
        { pageNumber: 1, pageSize: 100 },
        enabled
    );
export const DropDownCourts = (enabled: boolean = false) =>
    useGetCourts(
        {
            pageNumber: 1,
            pageSize: 100,
            isActive: true,
        },
        enabled
    );

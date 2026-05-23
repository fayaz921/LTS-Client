// ── Shared Enums ─────────────────────────────────────────────────
export type CaseStatus = 'Pending' | 'Finalized' | 'Active';

// ── Petitioner ───────────────────────────────────────────────────
export interface PetitionerDetail {
    id: string;
    name: string;
    cnic?: string;
    email?: string;
    phone?: string;
}


export interface CaseDto {
    id: string;
    caseNo: string;
    title: string;
    subject: string;
    dag: string;
    status: CaseStatus;
    dateInstitution: string;
    courtName: string;
    departmentName: string;
    petitioners: PetitionerDetail[];
}

// ── Commands ─────────────────────────────────────────────────────
export interface CreateCaseDto {
    courtId: string;
    departmentId: string;
    petitionerId: string;
    dag: string;
    title: string;
    subject: string;
    detail: string;
    dateInstitution: string;
    emailList: string;
    organizationId?: string;
}

export interface UpdateCaseDto {
    id: string;
    courtId: string;
    departmentId: string;
    petitionerId: string;
    dag: string;
    title: string;
    subject: string;
    detail: string;
    status: CaseStatus;
    dateInstitution: string;
    emailList: string;
}

// ── API Response Shapes ──────────────────────────────────────────
export interface PaginatedCaseResponse {
    items: CaseDto[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

// Search uses the same paged shape — no separate SearchCaseResponse needed
export type SearchCaseResponse = PaginatedCaseResponse;

// ── Search / Filter Params ───────────────────────────────────────
export interface SearchParams {
    query?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: CaseStatus;
    fromDate?: string;
    toDate?: string;
}
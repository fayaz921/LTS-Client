export interface GetCaseDto {
    id: string
    caseNo: string
    title: string
    subject: string
    dag: string
    status: string
    dateInstitution: string
    courtName: string
    departmentName: string
    petitioners: string[]
}

export type CaseDto = GetCaseDto

export interface CreateCaseDto {
    courtId: string
    departmentId: string
    petitionerId: string
    dag: string
    title: string
    subject: string
    detail: string
    dateInstitution: string
    emailList: string
    organizationId?: string
}

export interface UpdateCaseDto {
    id: string
    courtId: string
    departmentId: string
    petitionerId: string
    dag: string
    title: string
    subject: string
    detail: string
    status: string
    dateInstitution: string
}

export interface PetitionerDetail {
    id: string;
    name: string;
    cnic?: string;
    email?: string;
    phone?: string;
}

export interface Case {
    id: string;
    caseNo: string;
    title: string;
    subject: string;
    dag: string;
    status: "Pending" | "Finalized";
    dateInstitution: string;
    courtName: string;
    departmentName: string;
    petitioners: PetitionerDetail[];
}

export interface SearchCaseResponse {
    data: Case[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

// Search query parameters
export interface SearchParams {
    query?: string;
    pageNumber?: number;
    pageSize?: number;
    status?: "Pending" | "Finalized";
    fromDate?: string;
    toDate?: string;
}


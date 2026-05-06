
export interface CreateCaseDto {
    CourtId: string,
    DepartmentId: string,
    PetitionerId: string,
    DAG: string,
    Title: string,
    Subject: string,
    Detail: string,
    DateInstitution: string,
    EmailList: string
}

export interface GetCaseDto {
    id: string;
    caseNo: string;
    title: string;
    subject: string;
    dag: string;
    status: string;
    dateInstitution: string;
    courtName: string;
    departmentName: string;
    petitioners: string[];
}
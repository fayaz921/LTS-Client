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
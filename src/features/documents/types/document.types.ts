export interface GetCaseDocument{
    id:string;
    caseId:string;
    fileName:string;
    filePath:string;
    fileType:string;
    fileSize:number;
    remarks?:string;
    createdAt:string;
}
export interface UploadDocumentDto {
    caseId: string;
    file: File;
    fileName?: string;
    remarks?: string;
}